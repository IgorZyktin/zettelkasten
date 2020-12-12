# Автоматическое партиционирование PostgreSQL

---

[базы данных](./meta_bazy_dannyh.md)

[postgresql](./meta_postgresql.md)


Очень неудобно, что таблицы в Postgres не партиционируются самостоятельно.
Попробуем исправить это с помощью триггера.

Сначала определение головной таблицы:

```SQL
CREATE TABLE source.energy_1m
(
    client_id INTEGER NOT NULL,
	endpoint_id INTEGER NOT NULL,
    event_date date NOT NULL,
    event_time timestamp with time zone NOT NULL,
    kwh real
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
    SELECT * FROM source.energy_1m;

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
    base_table TEXT;
	partition_name TEXT;
	partition_date TEXT;
	start_of_month TEXT;
	end_of_month TEXT;
    days_in_month INTEGER;
BEGIN
    base_table := substring(TG_TABLE_NAME::text from 7);
    partition_name := base_table
                      || '_c' || LPAD(NEW.client_id::text, 3, '0') 
                      || '_e' || LPAD(NEW.endpoint_id::text, 5, '0') 
                      || '_y' || to_char(NEW.event_date,'YYYY') 
                      || '_m' || to_char(NEW.event_date,'MM');

    partition_date := to_char(NEW.event_date,'YYYY-MM');
    start_of_month := date_trunc('month', NEW.event_date)::text;
    end_of_month := (date_trunc('month', NEW.event_date) + interval '1 month')::text;

    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
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
    INSTEAD OF INSERT ON source.proxy_energy_1m 
    FOR EACH ROW EXECUTE PROCEDURE auto_create_partition_on_insert();
```
