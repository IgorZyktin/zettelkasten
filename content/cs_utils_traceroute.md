# Утилита traceroute

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

[утилиты](./meta_utility.md)

Это программа, которая позволяет проверить 
цепочку коммутаторов до конкретного адреса в сети.

Для windows:
> tracert ya.ru
```
Трассировка маршрута к ya.ru [87.250.250.242]
с максимальным числом прыжков 30:

  1    <1 мс    <1 мс    <1 мс  192.168.1.1
  2     1 ms    <1 мс    <1 мс  78.107.125.245
  3     1 ms    <1 мс    <1 мс  korova-bng1-local.msk.corbina.net [85.21.0.103]
  4     1 ms     1 ms     1 ms  10.2.254.178
  5     3 ms     2 ms     2 ms  85.21.224.96
  6     3 ms     3 ms     3 ms  m9-crs-be13.corbina.net [85.21.224.54]
  7     3 ms     2 ms     2 ms  m9-br-be1.corbina.net [195.14.54.79]
  8     4 ms     3 ms     5 ms  corbina-gw.dante.yandex.net [83.102.145.178]
  9     *        9 ms     6 ms  10.2.3.1
 10     5 ms     4 ms     4 ms  ya.ru [87.250.250.242]

Трассировка завершена.
```

Для linux:
> traceroute ya.ru
