# pgbench

Утилита тестирования производительности PostgreSQL.

---

Теги:

- [Компьютеры](../../_tags/компьютеры.md)
- [Программное обеспечение](../../_tags/программное%20обеспечение.md)
- [Программы](../../_tags/программы.md)
- [Полезные рецепты](../../_tags/полезные%20рецепты.md)
- [Системное администрирование](../../_tags/системное%20администрирование.md)
- [Базы данных](../../_tags/базы%20данных.md)
- [Linux](../../_tags/linux.md)
- [pgbench](../../_tags/pgbench.md)
- [PostgreSQL](../../_tags/postgresql.md)

---

1. [Тестирование производительности](#Тестирование-производительности)

## Тестирование производительности

Переключаемся на пользователя postgres.

```shell
sudo su - postgres
psql
CREATE DATABASE example;
\q
```

Создаём тестовые данные:

```shell
pgbench -i -s 50 example
```

```shell
dropping old tables...
NOTICE:  table "pgbench_accounts" does not exist, skipping
NOTICE:  table "pgbench_branches" does not exist, skipping
NOTICE:  table "pgbench_history" does not exist, skipping
NOTICE:  table "pgbench_tellers" does not exist, skipping
creating tables...
generating data (client-side)...
5000000 of 5000000 tuples (100%) done (elapsed 3.21 s, remaining 0.00 s)
vacuuming...
creating primary keys...
done in 4.96 s (drop tables 0.00 s, create tables 0.01 s, client-side generate 3.25 s, vacuum 0.72 s, primary keys 0.98 s).
```

Запускаем тест:

```shell
pgbench -c 10 -j 2 -t 10000 example
```

Результат для AMD Ryzen 7 4700U + NVMe.

```shell
pgbench (14.5 (Ubuntu 14.5-0ubuntu0.22.04.1))
starting vacuum...end.
transaction type: <builtin: TPC-B (sort of)>
scaling factor: 50
query mode: simple
number of clients: 10
number of threads: 2
number of transactions per client: 10000
number of transactions actually processed: 100000/100000
latency average = 2.015 ms
initial connection time = 13.163 ms
tps = 4962.311000 (without initial connection time)
```

Аналогичный для Synology 220 + HDD:

```shell
pgbench -c 10 -j 2 -t 100 example
```

```shell
pgbench (14.5 (Ubuntu 14.5-0ubuntu0.22.04.1), server 14.2 (Debian 14.2-1.pgdg110+1))
starting vacuum...end.
transaction type: <builtin: TPC-B (sort of)>
scaling factor: 50
query mode: simple
number of clients: 10
number of threads: 2
number of transactions per client: 100
number of transactions actually processed: 1000/1000
latency average = 289.369 ms
initial connection time = 96.955 ms
tps = 34.557930 (without initial connection time)
```

Видно, что машина с Ryzen быстрее в ~144 раза.

Источник:

> https://www.cloudbees.com/blog/tuning-postgresql-with-pgbench
