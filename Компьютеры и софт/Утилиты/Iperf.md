# iperf

Замеряет скорость соединения по локальной сети.



- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ linux }}](../../__tags/linux.md)
- [{{ Windows }}](../../__tags/windows.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ системное администрирование }}](../../__tags/sistemnoe_administrirovanie.md)
- [{{ утилиты }}](../../__tags/utility.md)
- [{{ iperf }}](../../__tags/iperf.md)


## Использование

Работает по схеме клиент-сервер.

Скачать можно вот [тут](https://iperf.fr/iperf-download.php).

Запустить на одной машине сервер:
> iperf -s

Запустить на второй машине клиент:
> iperf -c 192.168.1.67

Пример ответа сервера:

```shell
---------------------------------------------------------Server listening on TCP port 5001
TCP window size:  128 KByte (default)
---------------------------------------------------------[  4] local 192.168.1.67 port 5001 connected with 192.168.1.81 port 42092
[ ID] Interval       Transfer     Bandwidth
[  4]  0.0-10.0 sec   113 MBytes  94.1 Mbits/sec
```

Пример ответа клиента

```shell
---------------------------------------------------------Client connecting to 192.168.1.67, TCP port 5001
TCP window size:  178 KByte (default)
---------------------------------------------------------[  3] local 192.168.1.81 port 42092 connected with 192.168.1.67 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec   113 MBytes  94.5 Mbits/sec
```

Другой вариант ответа, при запуске на windows 8:

```shell
D:\Programs\iperf-3.1.3-win64>iperf3.exe -c 192.168.1.64
Connecting to host 192.168.1.64, port 5201
[  4] local 192.168.1.69 port 64479 connected to 192.168.1.64 port 5201
[ ID] Interval           Transfer     Bandwidth
[  4]   0.00-1.00   sec  39.2 MBytes   329 Mbits/sec
[  4]   1.00-2.00   sec  39.8 MBytes   333 Mbits/sec
[  4]   2.00-3.00   sec  38.9 MBytes   326 Mbits/sec
[  4]   3.00-4.00   sec  39.8 MBytes   333 Mbits/sec
[  4]   4.00-5.00   sec  39.0 MBytes   327 Mbits/sec
[  4]   5.00-6.00   sec  39.2 MBytes   329 Mbits/sec
[  4]   6.00-7.00   sec  37.5 MBytes   315 Mbits/sec
[  4]   7.00-8.00   sec  38.2 MBytes   321 Mbits/sec
[  4]   8.00-9.00   sec  39.1 MBytes   328 Mbits/sec
[  4]   9.00-10.00  sec  39.1 MBytes   329 Mbits/sec
- - - - - - - - - - - - - - - - - - - - - - - - -
[ ID] Interval           Transfer     Bandwidth
[  4]   0.00-10.00  sec   390 MBytes   327 Mbits/sec                  sender
[  4]   0.00-10.00  sec   390 MBytes   327 Mbits/sec                  receiver

iperf Done.
```
