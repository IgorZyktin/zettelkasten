# Полезные команды PostgreSQL

[postgresql](./meta_postgresql.md)

[базы данных](./meta_bazy_dannyh.md)

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
