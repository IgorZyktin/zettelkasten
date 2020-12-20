# Установка ClickHouse на Ubuntu

[clickhouse](./meta_clickhouse.md)

[базы данных](./meta_bazy_dannyh.md)

Проверка наличия поддержки набора инструкций SSE 4.2 (с ней скомпилированы предсобранные пакеты):

> grep -q sse4_2 /proc/cpuinfo && echo "SSE 4.2 supported" || echo "SSE 4.2 not supported"

Надо прописать репозиторий яндекса в **/etc/apt/sources.list** или в отдельный файл **/etc/apt/sources.list.d/clickhouse.list**:

> deb http://repo.yandex.ru/clickhouse/deb/stable/ main/

Затем можно провести установку (попросит ввести пароль для пользователя по умолчанию):

> sudo apt-get install dirmngr    # optional

> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv E0C56BD4    # optional

> sudo apt-get update

> sudo apt-get install clickhouse-client clickhouse-server

Для запуска сервера в качестве демона:

> sudo service clickhouse-server start

Логи он будет сохранять в **/var/log/clickhouse-server/**.

Если сервер не стартует, проверьте корректность конфигурации в файле /etc/clickhouse-server/config.xml

Также можно запустить сервер вручную из консоли:

> clickhouse-server --config-file=/etc/clickhouse-server/config.xml

При этом, лог будет выводиться в консоль, что удобно для разработки. Если конфигурационный файл лежит в текущей директории, то указывать параметр --config-file не требуется, по умолчанию будет использован файл ./config.xml.

После запуска сервера, соединиться с ним можно с помощью клиента командной строки:

> clickhouse-client

По умолчанию он соединяется с localhost:9000, от имени пользователя default без пароля. Также клиент может быть использован для соединения с удалённым сервером с помощью аргумента --host. По умолчанию соединение идёт без пароля. Пароль указывается аргументом --password.

Пример проверки работоспособности системы:

> ./clickhouse-client

```
ClickHouse client version 0.0.18749.
Connecting to localhost:9000.
Connected to ClickHouse server version 0.0.18749.
```
Должен получиться результат:
```
SELECT 1
┌─1─┐
│ 1 │
└───┘
```

Для возможности удалённого подключения надо в файле **sudo nano /etc/clickhouse-server/config.xml** раскомментировать блок listen_host:
```
...
<interserver_http_host>example.yandex.ru</interserver_http_host>
-->
<!-- Listen specified host. use :: (wildcard IPv6 address), if you want to accept connections both with IPv4 and IPv6 from everywhere. -->
<!-- <listen_host>::</listen_host> -->
<!-- Same for hosts with disabled ipv6: -->
<listen_host>0.0.0.0</listen_host>
<!-- Default values - try listen localhost on ipv4 and ipv6: -->
<!--
<listen_host>::1</listen_host>
<listen_host>127.0.0.1</listen_host>
-->
...
```

После этого надо перезапустить сервер:

> sudo service clickhouse-server restart
