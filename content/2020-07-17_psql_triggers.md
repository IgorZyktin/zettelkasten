# Триггеры PostgreSQL

---

\# базы данных

\# postgresql

Триггеры это автоматически вызываемые при определённых событиях сущности.
Они обладают хранимой процедурой, вызов которой производит какие-либо 
проверки или изменения.

В данном случае мне нужен триггер, который будет следить за тем, за какие даты
у меня есть данные. Эту информацию можно было бы получить и из самих данных,
но PostgreSQL это не ClickHouse, при росте размеров таблиц скорость получения 
подобной инфрмации очень быстро становится неприемлемой.

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
