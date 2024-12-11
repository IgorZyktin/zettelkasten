# Терминал Linux

### Вывести все диски

```shell
sudo lsblk
sudo lsblk -d # только физические устройства
sudo lshw -class disk
sudo lsscsi
```

### Less

#### Выключить перенос строк

Перед запуском:

```shell
-S
--chop-long-lines
```
