# jq

Утилита для работы с JSON данными в linux.



- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ linux }}](../../__tags/linux.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ системное администрирование }}](../../__tags/sistemnoe_administrirovanie.md)
- [{{ утилиты }}](../../__tags/utility.md)
- [{{ jq }}](../../__tags/jq.md)


1. [Просто вывести JSON в читаемом виде](#Просто-вывести-JSON-в-читаемом-виде)
1. [Вывести список словарей с фильтрацией по ключу](#Вывести-список-словарей-с-фильтрацией-по-ключу)

## Просто вывести JSON в читаемом виде

```shell
echo '{"key": [1, 2, 3]}' | jq
```

```json
{
    "key": [
        1,
        2,
        3
    ]
}
```

## Вывести список словарей с фильтрацией по ключу

Исходные данные для обработки:

```json
[
    {
        "hostname": "compute1",
        "status": "UP",
        "status_time": "2022-07-08 10:54:28"
    },
    {
        "hostname": "compute2",
        "status": "UP",
        "status_time": "2022-07-08 10:54:28"
    },
    {
        "hostname": "compute3",
        "status": "DOWN",
        "status_time": "2022-07-08 10:54:28"
    }
]
```

Они же одной строкой:

```
[ { "hostname": "compute1", "status": "UP", "status_time": "2022-07-08 10:54:28" }, { "hostname": "compute2", "status": "UP", "status_time": "2022-07-08 10:54:28" }, { "hostname": "compute3", "status": "DOWN", "status_time": "2022-07-08 10:54:28" } ]
```

```shell
var = '[ { "hostname": "compute1", "status": "UP", "status_time": "2022-07-08 10:54:28" }, { "hostname": "compute2", "status": "UP", "status_time": "2022-07-08 10:54:28" }, { "hostname": "compute3", "status": "DOWN", "status_time": "2022-07-08 10:54:28" } ]'
echo $var | jq '.[] | select(.status == "DOWN")'
```

Результат:

```
{
  "hostname": "compute3",
  "status": "DOWN",
  "status_time": "2022-07-08 10:54:28"
}
```

Важный момент - результат вывода уже не JSON. Если надо получить корректный
JSON для дальнейшей обработки, надо вызвать команду:

```shell
echo $var | jq '[.[] | select(.status == "UP")]'
```

Т.е. запаковать весь вывод в массив.

Результат:

```json
[
    {
        "hostname": "compute1",
        "status": "UP",
        "status_time": "2022-07-08 10:54:28"
    },
    {
        "hostname": "compute2",
        "status": "UP",
        "status_time": "2022-07-08 10:54:28"
    }
]
```

То же самое, но не полное совпадение, а частичное:

```shell
echo $var | jq '[.[] | select(.hostname | contains("2"))]'
```

```json
[
    {
        "hostname": "compute2",
        "status": "UP",
        "status_time": "2022-07-08 10:54:28"
    }
]
```
