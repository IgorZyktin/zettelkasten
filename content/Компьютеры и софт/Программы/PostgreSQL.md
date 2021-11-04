# PostgreSQL

Распространённая реляционная база данных.

---

Теги:

- [Компьютеры](../../_tags/Компьютеры.md)
- [Программное обеспечение](../../_tags/Программное%20обеспечение.md)
- [Программы](../../_tags/Программы.md)
- [Полезные рецепты](../../_tags/Полезные%20рецепты.md)
- [Системное администрирование](../../_tags/Системное%20администрирование.md)
- [Базы данных](../../_tags/Базы%20данных.md)
- [Linux](../../_tags/Linux.md)
- [PostgreSQL](../../_tags/PostgreSQL.md)

---

1. [Партиционирование таблиц](#Партиционирование-таблиц)
1. [Автоматическое партиционирование](#автоматическое-партиционирование)
1. [Триггеры](#триггеры)
1. [Установка на Ubuntu](#Установка-на-Ubuntu)
1. [Получить размер всех баз данных на данном сервере](#Получить-размер-всех-баз-данных-на-данном-сервере)
1. [Получить размер всех таблиц на данном сервере](#Получить-размер-всех-таблиц-на-данном-сервере)
1. [Скользящая средняя](#Скользящая-средняя)
1. [Узнать права доступа к таблицам](#Узнать-права-доступа-к-таблицам)

## Партиционирование таблиц

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

## Автоматическое партиционирование

Очень неудобно, что таблицы в Postgres не партиционируются самостоятельно.
Попробуем исправить это с помощью триггера.

Сначала определение головной таблицы:

```SQL
CREATE TABLE source.energy_1m
(
    client_id   INTEGER                  NOT NULL,
    endpoint_id INTEGER                  NOT NULL,
    event_date  date                     NOT NULL,
    event_time  timestamp with time zone NOT NULL,
    kwh         real
) PARTITION BY RANGE (client_id, endpoint_id, event_date)
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

ALTER TABLE source.energy_1m
    OWNER to postgres;

GRANT ALL ON source.energy_1m TO db_user;
GRANT ALL ON source.energy_1m TO db_master;

COMMENT ON TABLE source.energy_1m
    IS 'Поминутное потребление электроэнергии';

CREATE UNIQUE INDEX energy_1m_idx
    ON source.energy_1m USING btree
        (client_id ASC NULLS LAST,
         endpoint_id ASC NULLS LAST,
         event_date ASC NULLS LAST,
         event_time ASC NULLS LAST)
    TABLESPACE pg_default;
```

Затем определение таблицы для вставки. Это связано с тем, что для
секционированных таблиц нельзя задавать триггеры ON EACH ROW, а только для
всего выражения. А в таком триггере мы не видим данные, которые добавляются.
Нужна промежуточная таблица/вью, которая будет фильтровать данные.

```SQL
CREATE OR REPLACE VIEW source.proxy_energy_1m AS
SELECT *
FROM source.energy_1m;

ALTER TABLE source.proxy_energy_1m
    OWNER TO postgres;

GRANT ALL ON source.proxy_energy_1m TO db_user;
GRANT ALL ON source.proxy_energy_1m TO db_master;
```

Триггер автогенерации:

```SQL
CREATE OR REPLACE FUNCTION auto_create_partition_on_insert()
    RETURNS TRIGGER AS
$$
DECLARE
    base_table     TEXT;
    partition_name TEXT;
    partition_date TEXT;
    start_of_month TEXT;
    end_of_month   TEXT;
    days_in_month  INTEGER;
BEGIN
    base_table := substring(TG_TABLE_NAME::text from 7);
    partition_name := base_table
                          || '_c' || LPAD(NEW.client_id::text, 3, '0')
                          || '_e' || LPAD(NEW.endpoint_id::text, 5, '0')
                          || '_y' || to_char(NEW.event_date, 'YYYY')
                          || '_m' || to_char(NEW.event_date, 'MM');

    partition_date := to_char(NEW.event_date, 'YYYY-MM');
    start_of_month := date_trunc('month', NEW.event_date)::text;
    end_of_month :=
            (date_trunc('month', NEW.event_date) + interval '1 month')::text;

    IF NOT EXISTS(SELECT 1
                  FROM information_schema.tables
                  WHERE table_name = partition_name
                    AND table_schema = TG_TABLE_SCHEMA::text)
    THEN
        EXECUTE format(
                        'CREATE TABLE %1$I.%2$I ' ||
                        'PARTITION OF %1$I.%3$I ' ||
                        'FOR VALUES FROM (%4$s, %5$s, %6$L) TO (%4$s, %5$s, %7$L);',
                        TG_TABLE_SCHEMA::text,
                        partition_name,
                        base_table,
                        NEW.client_id,
                        NEW.endpoint_id,
                        start_of_month,
                        end_of_month
            );
        EXECUTE format('GRANT ALL ON TABLE %I.%I TO db_user',
                       TG_TABLE_SCHEMA::text, partition_name);
        EXECUTE format('GRANT ALL ON TABLE %I.%I TO db_master',
                       TG_TABLE_SCHEMA::text, partition_name);
        RAISE NOTICE 'A partition has been created %', partition_name;
    END IF;

    EXECUTE format('INSERT INTO %I.%I SELECT $1.*',
                   TG_TABLE_SCHEMA, base_table) USING NEW;
    RETURN NULL;
END
$$
    LANGUAGE plpgsql;
```

Потом вешаем его на таблицу:

```SQL
CREATE TRIGGER energy_1m_insert_trigger
    INSTEAD OF INSERT
    ON source.proxy_energy_1m
    FOR EACH ROW
EXECUTE PROCEDURE auto_create_partition_on_insert();
```

## Триггеры

Триггеры это автоматически вызываемые при определённых событиях сущности.
Они обладают хранимой процедурой, вызов которой производит какие-либо 
проверки или изменения.

В данном случае мне нужен триггер, который будет следить за тем, за какие даты
у меня есть данные. Эту информацию можно было бы получить и из самих данных,
но PostgreSQL это не ClickHouse, при росте размеров таблиц скорость получения 
подобной информации очень быстро становится неприемлемой.

Для начала создадим таблицу для учёта:

```SQL
CREATE TABLE source.existing_dates
(
    table_name character varying(32) NOT NULL,
    client_id INTEGER NOT NULL,
    endpoint_id INTEGER NOT NULL,
    event_date date NOT NULL,
    UNIQUE (table_name, client_id, endpoint_id, event_date)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE source.existing_dates
    OWNER to postgres;

GRANT ALL ON TABLE source.existing_dates TO db_user;
GRANT ALL ON TABLE source.existing_dates TO db_master;

COMMENT ON TABLE source.existing_dates
    IS 'Перечень имеющихся дат для каждой из таблиц в схеме source. 
        Автоматически обновляется триггерами, не должна модифицироваться вручную!';

CREATE UNIQUE INDEX existing_dates_idx
    ON source.existing_dates USING btree
    (table_name ASC NULLS LAST, 
    client_id ASC NULLS LAST,
    endpoint_id ASC NULLS LAST,
    event_date ASC NULLS LAST)
    TABLESPACE pg_default;
```

Потом нам понадобятся два триггера. Один на добавление данных и один на удаление.
И на всякий случай можно добавить один на очистку. Это связано с тем, что
TRUNCATE это отдельное событие и его вызов не вызовет срабатывания DELETE триггера.

```SQL
CREATE OR REPLACE FUNCTION register_insert() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO source.existing_dates 
    SELECT 
        TG_TABLE_NAME::text, 
        client_id, 
        endpoint_id,
        event_date 
    FROM new_table GROUP BY client_id, endpoint_id, event_date
    ON CONFLICT (table_name, client_id, endpoint_id, event_date) DO NOTHING;
    RETURN NULL;
END
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION register_delete() RETURNS TRIGGER AS $$
BEGIN
    SET search_path TO source,public;
    WITH gr as (
        SELECT 
            client_id, 
            endpoint_id, 
            event_date 
        FROM old_table 
        GROUP BY 
            client_id, 
            endpoint_id, 
            event_date
    )
	DELETE FROM source.existing_dates ed
	USING gr
    WHERE table_name = TG_TABLE_NAME::text
    AND ed.client_id = gr.client_id
    AND ed.endpoint_id = gr.endpoint_id
	AND ed.event_date = gr.event_date;
    RETURN NULL;
END

$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION register_truncate() RETURNS TRIGGER AS $$
BEGIN
	DELETE FROM source.existing_dates 
    WHERE table_name = TG_TABLE_NAME::text;
    RETURN NULL;
END
$$ LANGUAGE 'plpgsql';
```

После этого их можно повесить на таблицы, которые мы хотим отслеживать:

```SQL
CREATE TRIGGER energy_1m_insert
    AFTER INSERT ON source.energy_1m
    REFERENCING NEW TABLE AS new_table
    FOR EACH STATEMENT EXECUTE FUNCTION register_insert();

CREATE TRIGGER energy_1m_delete
    AFTER DELETE ON source.energy_1m
    REFERENCING OLD TABLE AS old_table
    FOR EACH STATEMENT EXECUTE FUNCTION register_delete();

CREATE TRIGGER energy_1m_truncate
    AFTER TRUNCATE ON source.energy_1m
    FOR EACH STATEMENT EXECUTE FUNCTION register_truncate();
```

После этого в таблице existing_dates должна автоматически обновляться информация
о том, за какие даты у нас есть данные. Таблица при этом не должна редактироваться
вручную.

### Установка на Ubuntu

```shell
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -i -u postgres
psql
\q
sudo -u postgres createuser --interactive
sudo adduser new_user_name
sudo passwd postgres
su - postgres
psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'NewPassword';"
create database my_db;
grant all privileges on database my_db to new_user_name;
sudo nano /etc/postgresql/x.x/main/pg_hba.conf
```

Ввести:
```
host	all	all	0.0.0.0/0		md5
host	all	all	::0/0       md5
```
```
sudo nano /etc/postgresql/x.x/main/postgresqlconf.conf
```

Раскомментировать:
```
listen_addresses = '*'
```

### Получить размер всех баз данных на данном сервере

```sql
SELECT d.datname                            AS Name,
       pg_catalog.pg_get_userbyid(d.datdba) AS Owner,
       CASE
           WHEN pg_catalog.has_database_privilege(d.datname, 'CONNECT')
               THEN pg_catalog.pg_size_pretty(
                   pg_catalog.pg_database_size(d.datname))
           ELSE 'No Access'
           END                              AS size
FROM pg_catalog.pg_database d
ORDER BY size,
         CASE
             WHEN pg_catalog.has_database_privilege(d.datname, 'CONNECT')
                 THEN pg_catalog.pg_database_size(d.datname)
             ELSE NULL
             END DESC -- nulls first
LIMIT 20
```

### Получить размер всех таблиц на данном сервере

```sql
WITH RECURSIVE pg_inherit(inhrelid, inhparent) AS
    (select inhrelid, inhparent
    FROM pg_inherits
    UNION
    SELECT child.inhrelid, parent.inhparent
    FROM pg_inherit child, pg_inherits parent
    WHERE child.inhparent = parent.inhrelid),
pg_inherit_short AS (SELECT * FROM pg_inherit WHERE inhparent NOT IN (SELECT inhrelid FROM pg_inherit))
SELECT table_schema
    , TABLE_NAME
    , row_estimate
    , pg_size_pretty(total_bytes) AS total
    , pg_size_pretty(index_bytes) AS INDEX
    , pg_size_pretty(toast_bytes) AS toast
    , pg_size_pretty(table_bytes) AS TABLE
  FROM (
    SELECT *, total_bytes-index_bytes-COALESCE(toast_bytes,0) AS table_bytes
    FROM (
         SELECT c.oid
              , nspname AS table_schema
              , relname AS TABLE_NAME
              , SUM(c.reltuples) OVER (partition BY parent) AS row_estimate
              , SUM(pg_total_relation_size(c.oid)) OVER (partition BY parent) AS total_bytes
              , SUM(pg_indexes_size(c.oid)) OVER (partition BY parent) AS index_bytes
              , SUM(pg_total_relation_size(reltoastrelid)) OVER (partition BY parent) AS toast_bytes
              , parent
          FROM (
                SELECT pg_class.oid
                    , reltuples
                    , relname
                    , relnamespace
                    , pg_class.reltoastrelid
                    , COALESCE(inhparent, pg_class.oid) parent
                FROM pg_class
                    LEFT JOIN pg_inherit_short ON inhrelid = oid
                WHERE relkind IN ('r', 'p')
             ) c
             LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
  ) a
  WHERE oid = parent
) a
ORDER BY total_bytes DESC;
```

### Скользящая средняя

```sql
SELECT
    event_time as t,
    avg(value) OVER w
FROM table
WHERE event_date = now()::date AND client_id = 67 AND endpoint_id = 488
WINDOW w AS (ORDER BY event_time DESC ROWS BETWEEN 1 FOLLOWING AND 3 FOLLOWING)
ORDER BY t
```

### Узнать права доступа к таблицам

```sql
SELECT grantee AS user, CONCAT(table_schema, '.', table_name) AS table, 
    CASE 
        WHEN COUNT(privilege_type) = 7 THEN 'ALL'
        ELSE ARRAY_TO_STRING(ARRAY_AGG(privilege_type), ', ')
    END AS grants
FROM information_schema.role_table_grants
GROUP BY table_name, table_schema, grantee;
```
