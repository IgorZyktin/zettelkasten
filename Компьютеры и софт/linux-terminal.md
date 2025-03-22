# Терминал Linux

### Вывести все диски

```shell
sudo lsblk
sudo lsblk -d # только физические устройства
sudo lshw -class disk
sudo lsscsi
```

Настроить `hostname` компьютера:

```shell
hostnamectl hostname newhostname
```

Источники:

* https://interface31.ru/tech_it/2023/01/linux-nachinayushhim-nastraivaem-imya-hosta-pri-pomoshhi-hostnamectl.html
* https://userman.ru/2019/12/15/kak-izmenit-hostname-v-linux.html

### Выкусить первую колонку из текстовых данных

```shell
cut -d ' ' -f1 file
awk '{print $1}' file
```

### Less

#### Выключить перенос строк

Перед запуском:

```shell
-S
--chop-long-lines
```
