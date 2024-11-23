# Установка wireguard

## Установка пакетов

```shell
sudo apt update
sudo apt install wireguard
```

## Генерация приватного ключа сервера и ограничение доступа на его чтение

```shell
wg genkey | sudo tee /etc/wireguard/server_private.key
sudo chmod go= /etc/wireguard/server_private.key
```

После первой команды приватный ключ будет выведен на экран, далее он
понадобится.

## Генерация публичного ключа сервера

```shell
sudo cat /etc/wireguard/server_private.key | wg pubkey | sudo tee /etc/wireguard/server_public.key
```

## Выбор приватных IP адресов

Можно выбирать в этих диапазонах:

* От 10.0.0.0 и до 10.255.255.255 (10/8 prefix)
* От 172.16.0.0 и до 172.31.255.255 (172.16/12 prefix)
* От 192.168.0.0 и до 192.168.255.255 (192.168/16 prefix)

Для примера будет взят 10.7.0.1/24.

## Создание конфига wireguard на сервере

```shell
sudo nano /etc/wireguard/wg0.conf
```

```
[Interface]
PrivateKey = <вставить сюда полученный ранее приватный ключ сервера>
Address = 10.7.0.1/24
ListenPort = 51820
SaveConfig = true
```

## Дополнительная настройка сервера

```shell
sudo nano /etc/sysctl.conf
```

Надо убедиться, что на машине включена переадресация.

```shell
net.ipv4.ip_forward=1
```

Проверить результат настройки:

```shell
sudo sysctl -p
```

## Настройка wireguard клиента

Установить пакеты аналогично тому, как это было сделано для сервера.

```shell
wg genkey | sudo tee /etc/wireguard/client_private.key
sudo chmod go= /etc/wireguard/client_private.key
```

Сгенерировать клиентский публичный ключ:

```shell
sudo cat /etc/wireguard/client_private.key | wg pubkey | sudo tee /etc/wireguard/client_public.key
```

Создать конфиг на клиентской машине:

```shell
sudo nano /etc/wireguard/wg0.conf
```

```shell
[Interface]
PrivateKey = <вставить сюда полученный ранее приватный ключ клиента>
Address = 10.7.0.2/24

[Peer]
PublicKey = <вставить сюда полученный ранее публичный ключ сервера>
AllowedIPs = 10.7.0.0/24
Endpoint = <тут IP адрес сервера в интернете>:51820
PersistentKeepalive = 20
```

## Добавление клиента к настройкам сервера

На сервере:

```shell
sudo wg set wg0 peer <тут публичный ключ клиента> allowed-ips 10.7.0.2
```

На клиенте:

```shell
sudo systemctl enable wg-quick@wg0.service
sudo systemctl start wg-quick@wg0.service
sudo systemctl status wg-quick@wg0.service
```

Посмотреть, что система думает про настройки на сервере:

```shell
sudo watch wg show
```

## Настройка переадресации (при необходимости)

Узнать публичный сетевой интерфейс:

```shell
ip route list default
```

```shell
default via <тут IP адрес сервера в интернете> dev ens3 proto static
```

В данном случае интересующее нас устройство называется ens3.

Надо добавить правила переадресации:

```shell
sudo nano /etc/wireguard/wg0.conf
```

Добавить в конец:

```shell
PostUp = iptables -t nat -I POSTROUTING -o ens3 -j MASQUERADE
PreDown = iptables -t nat -D POSTROUTING -o ens3 -j MASQUERADE
```

## Запуск wireguard сервера

```shell
sudo systemctl enable wg-quick@wg0.service
sudo systemctl start wg-quick@wg0.service
sudo systemctl status wg-quick@wg0.service
```
