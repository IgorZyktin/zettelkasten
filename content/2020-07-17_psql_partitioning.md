# Партиционирование таблиц PostgreSQL

---

\# базы данных

\# postgresql

Партиционирование удобно для таблиц большого размера, когда мы заранее знаем, 
что обращаться будем в основном к каким то характерным параметрам. В данном
случае мне потребовалось партиционировать таблицу по дате. Я знаю, что
большая часть запросов будет идти к свежим данным и мне не хотелось бы, чтобы
планировщику запросов постоянно приходилось проверять и старые данные тоже.

```SQL
CREATE TABLE source.energy_1m
(
    client_id integer,
    endpoint_id integer,
    event_date date,
    event_time timestamp with time zone,
    kwh real
) PARTITION BY RANGE (event_date) 
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE source.energy_1m
    OWNER to postgres;

GRANT ALL ON source.energy_1m TO db_user;

COMMENT ON TABLE source.energy_1m
    IS 'Поминутное потребление электроэнергии';
```

Создание партиционированной таблицы не отличается от обычной, 
за исключением двух моментов:

1. Мы ограничены в constraint'ах и первичных ключах. Ключи вообще не
поддерживаются, ограничения допустимы, но только в рамках одной партиции, а не
всей таблицы целиком.
1. Надо указать, как таблица должна быть партиционирована. Базовые варианты это
LIST, RANGE и HASH. В моём случае идёт работа с датами, так что я решил выбрать RANGE.

Дочерние таблицы, выступающие в качестве партиций требуется создавать специально.
Для этого можно написать соответствующие хранимые процедуры в базе, но в
моём случае я решил обойтись ручной генерацией. Главное не забыть добавить
партиций, когда подойдёт время.

```SQL
SET search_path TO source,public;
CREATE TABLE energy_1m_2020_01 PARTITION OF energy_1m FOR VALUES FROM ('2020-01-01') TO ('2020-01-31');
CREATE TABLE energy_1m_2020_02 PARTITION OF energy_1m FOR VALUES FROM ('2020-02-01') TO ('2020-02-29');
CREATE TABLE energy_1m_2020_03 PARTITION OF energy_1m FOR VALUES FROM ('2020-03-01') TO ('2020-03-31');
CREATE TABLE energy_1m_2020_04 PARTITION OF energy_1m FOR VALUES FROM ('2020-04-01') TO ('2020-04-30');
CREATE TABLE energy_1m_2020_05 PARTITION OF energy_1m FOR VALUES FROM ('2020-05-01') TO ('2020-05-31');
CREATE TABLE energy_1m_2020_06 PARTITION OF energy_1m FOR VALUES FROM ('2020-06-01') TO ('2020-06-30');
CREATE TABLE energy_1m_2020_07 PARTITION OF energy_1m FOR VALUES FROM ('2020-07-01') TO ('2020-07-31');
CREATE TABLE energy_1m_2020_08 PARTITION OF energy_1m FOR VALUES FROM ('2020-08-01') TO ('2020-08-31');
CREATE TABLE energy_1m_2020_09 PARTITION OF energy_1m FOR VALUES FROM ('2020-09-01') TO ('2020-09-30');
CREATE TABLE energy_1m_2020_10 PARTITION OF energy_1m FOR VALUES FROM ('2020-10-01') TO ('2020-10-31');
CREATE TABLE energy_1m_2020_11 PARTITION OF energy_1m FOR VALUES FROM ('2020-11-01') TO ('2020-11-30');
CREATE TABLE energy_1m_2020_12 PARTITION OF energy_1m FOR VALUES FROM ('2020-12-01') TO ('2020-12-31');
CREATE TABLE energy_1m_2021_01 PARTITION OF energy_1m FOR VALUES FROM ('2021-01-01') TO ('2021-01-31');
CREATE TABLE energy_1m_2021_02 PARTITION OF energy_1m FOR VALUES FROM ('2021-02-01') TO ('2021-02-28');
CREATE TABLE energy_1m_2021_03 PARTITION OF energy_1m FOR VALUES FROM ('2021-03-01') TO ('2021-03-31');
CREATE TABLE energy_1m_2021_04 PARTITION OF energy_1m FOR VALUES FROM ('2021-04-01') TO ('2021-04-30');
CREATE TABLE energy_1m_2021_05 PARTITION OF energy_1m FOR VALUES FROM ('2021-05-01') TO ('2021-05-31');
CREATE TABLE energy_1m_2021_06 PARTITION OF energy_1m FOR VALUES FROM ('2021-06-01') TO ('2021-06-30');
CREATE TABLE energy_1m_2021_07 PARTITION OF energy_1m FOR VALUES FROM ('2021-07-01') TO ('2021-07-31');
CREATE TABLE energy_1m_2021_08 PARTITION OF energy_1m FOR VALUES FROM ('2021-08-01') TO ('2021-08-31');
CREATE TABLE energy_1m_2021_09 PARTITION OF energy_1m FOR VALUES FROM ('2021-09-01') TO ('2021-09-30');
CREATE TABLE energy_1m_2021_10 PARTITION OF energy_1m FOR VALUES FROM ('2021-10-01') TO ('2021-10-31');
CREATE TABLE energy_1m_2021_11 PARTITION OF energy_1m FOR VALUES FROM ('2021-11-01') TO ('2021-11-30');
CREATE TABLE energy_1m_2021_12 PARTITION OF energy_1m FOR VALUES FROM ('2021-12-01') TO ('2021-12-31');
```

После этого можно добавить индекс на главной таблице и он автоматически
появится и на всех партициях.

```SQL
CREATE UNIQUE INDEX energy_1m_idx
    ON source.energy_1m USING btree
    (table_name ASC NULLS LAST, 
    client_id ASC NULLS LAST,
    endpoint_id ASC NULLS LAST,
    event_date ASC NULLS LAST)
    TABLESPACE pg_default;
```

Также можно добавить ограничения на таблицу. Главное помнить, что не всё
допустимо. Партиционированные таблицы не умеют гарантировать уникальность данных
между партициями, только в рамках одной партициии.

```SQL
ALTER TABLE source.energy_1m
    ADD CONSTRAINT energy_1m_unique 
    UNIQUE (client_id, endpoint_id, event_date, event_time);
```

После этого можно проверить результат:

```SQL
INSERT INTO source.energy_1m VALUES (1, 1, '2020-01-01'::date, '2020-01-01 14:35:00'::timestamptz, 7.32);
INSERT INTO source.energy_1m VALUES (1, 1, '2021-02-01'::date, '2021-02-01 14:35:00'::timestamptz, 6.12);
```
```SQL
DELETE FROM source.energy_1m WHERE client_id = 1;
```

Партиционированная таблица сама по себе не содержит никаких данных и просто 
перенаправляет запросы к своим партициям. Сами же партиции также могут быть
партиционированы и тоже перенаправлять запросы. Преобразовать обычную таблицу
напрямую в партиционированную нельзя. Равно как и наоборот.
