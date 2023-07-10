# Установка Raspbian

Raspbian это основанный на debian дистрибутив, специально предназначенный для
raspberry pi.

---

Теги:

- {{ компьютеры }}
- {{ программное обеспечение }}
- {{ Raspberry Pi }}
- {{ Raspbian }}
- {{ полезные рецепты }}
- {{ системное администрирование }}

---

## Скачивание

Скачать
тут: [https://www.raspberrypi.com/software/operating-systems/](https://www.raspberrypi.com/software/operating-systems/)

Оптимально скачать руками zip архив нужной версии.

## Заливка образа

Нужна машина с кард-ридером для SD. Скачанный zip архив распаковывается, и img
файл заливается на micro-sd.

Для windows рекомендуется делать
это [Win32 Disk Imager](https://sourceforge.net/projects/win32diskimager/).

Для linux [Etcher](https://etcher.io/).

## Загрузка ОС

Вставляем флешку в малину и загружаемся. По умолчанию попадаем в
пользователя **pi** с паролем **raspberry**.

## Базовая настройка

### Включаем SSH

```shell
sudo raspi-config
```

```
Interfacing options -> SSH -> Would you like the SSH server to be enabled -> YES
```

```shell
sudo reboot now
```

```shell
ssh pi@192.168.1.67
```

### Основная настройка

```shell
sudo raspi-config
```

```
Syetem Options -> Update -> OK
Syetem Options -> Password -> OK
Syetem Options -> Boot -> Console -> OK
Localisation Options -> Locale -> All locales -> en_GB.UTF-8
Localisation Options -> Timezone -> Europe -> Moscow
Finish -> Reboot
```

```shell
sudo apt-get update
sudo apt-get upgrade
```

### Настройка SSH

На хостовой машине:

```shell
ssh-copy-id pi@192.168.1.67
```

```shell
sudo nano /etc/ssh/sshd_config
```

```
PermitRootLogin no
PasswordAuthentication no
```

```shell
sudo service ssh restart
```

### Настройка сети

```shell
sudo nano /etc/dhcpcd.conf
```

Дописать в конце:

```
nodhcp
```

Потом указать:

```
interface eth0
static ip_address=192.168.1.67/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1
```

```shell
sudo reboot
```

### Измерение температуры

```shell
nano /home/pi/.bash_aliases
```

```
alias temp='vcgencmd measure_temp'
```

Перезапустить сессию.

### Бэкап

На этом этапе рекомендуется сделать снимок файловой системы, чтобы потом можно
было развернуть заново. Это делается теми же программами, что используются для
записи ОС на флешку, например win32imager.
