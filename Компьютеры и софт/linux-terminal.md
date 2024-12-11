# Терминал Linux

### Вывести все диски

```shell
sudo lsblk
sudo lsblk -d # только физические устройства
sudo lshw -class disk
sudo lsscsi
```

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
