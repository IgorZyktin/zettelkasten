# Полезные команды ClickHouse

[clickhouse](./meta_clickhouse.md)

[базы данных](./meta_bazy_dannyh.md)

### Узнать сколько места занимают те или иные таблицы:

```SQL
SELECT 
    table, 
    max(rows), 
    toInt32(sum((bytes_on_disk / 1024) / 1024)) AS mbytes 
FROM system.parts 
GROUP BY table
```

### Запросить данные через HTTP интерфейс (нужна авторизация)

> http://site.com:8123?query=SELECT 1

### Скопировать данные из одной таблицы в другую

```SQL
INSERT INTO table_b SELECT * FROM table_a WHERE id=1;
```

### Создать базу данных

```SQL
CREATE DATABASE IF NOT EXISTS db_name
```

### Переключиться на базу данных

```SQL
USE db_name
```

### Создать таблицу
```SQL
CREATE TABLE modes_1s_new
(
    client_id         UInt32 CODEC (T64, LZ4HC),
    endpoint_id       UInt32 CODEC (T64, LZ4HC),
    event_date        Date CODEC (T64, LZ4HC),
    event_time        DateTime('Europe/Moscow') CODEC (T64, LZ4HC),
    total             Float32 CODEC (Gorilla, LZ4HC),
    mode              Int32 CODEC (T64, LZ4HC),
    version           DateTime('Europe/Moscow') DEFAULT now() CODEC (T64, LZ4HC)
)
    ENGINE = ReplacingMergeTree(version)
        PARTITION BY (client_id, toYYYYMM(event_date))
        ORDER BY (client_id, endpoint_id, event_date, event_time)
```
