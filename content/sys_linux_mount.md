# Монтирование носителя в linux

[linux](./meta_linux.md)

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

[монтирование носителя в linux](./meta_montirovanie_nositelya_v_linux.md)

## Получение сведений

Получить данные по подключенным носителям:

```shell
sudo fdisk -l
```

```shell
...
Disk /dev/mmcblk0: 14,6 GiB, 15653142528 bytes, 30572544 sectors        
Units: sectors of 1 * 512 = 512 bytes                                   
Sector size (logical/physical): 512 bytes / 512 bytes                   
I/O size (minimum/optimal): 512 bytes / 512 bytes                       
Disklabel type: dos                                                     
Disk identifier: 0x97709164                                             
                                                                        
Device         Boot  Start      End  Sectors  Size Id Type              
/dev/mmcblk0p1        8192   532479   524288  256M  c W95 FAT32 (LBA)   
/dev/mmcblk0p2      532480 30572543 30040064 14,3G 83 Linux             
                                                                        
                                                                        
Disk /dev/sda: 15 GiB, 16148070400 bytes, 31539200 sectors              
Disk model: USB DISK                                                    
Units: sectors of 1 * 512 = 512 bytes                                   
Sector size (logical/physical): 512 bytes / 512 bytes                   
I/O size (minimum/optimal): 512 bytes / 512 bytes                       
Disklabel type: dos                                                     
Disk identifier: 0x7d4ecca6                                             
                                                                        
Device     Boot Start      End  Sectors Size Id Type                    
/dev/sda1  *      112 31539199 31539088  15G  c W95 FAT32 (LBA)         
```

В выводе надо найти интересующий нас носитель, в данном случае это **
/dev/sda1**.

## Создание точки монтирования

Для начала надо создать каталог, к которому будет потом смонтирован наш
носитель.

```shell
mkdir /media/usb-drive
```

## Монтирование

Само монтирование:

```shell
sudo mount /dev/sda1 /media/usb-drive/
```

Проверить, факт успешного подключения:

```shell
mount | grep /dev/sda1
```

## Отмена монтирования монтирование

Надо убедиться, что никакой процесс не работает с данным носителем.

```shell
sudo umount /dev/sda1
```

## Постоянное монтирование (работает после перезагрузки)

**ЕСТЬ РИСК ПОЛОМАТЬ ЗАГРУЗКУ НА МАШИНЕ**

Для постоянного монтирования, диск надо внести в **/etc/fstab**. Можно делать
это по block device name, но они потенциально могут повторяться, поэтому лучше
использовать для этого уникальный идентификатор.

Пример содержимого /etc/fstab:
```shell
proc                  /proc           proc    defaults          0       0
PARTUUID=97709164-01  /boot           vfat    defaults          0       2
PARTUUID=97709164-02  /               ext4    defaults,noatime  0       1
```

Узнать идентификаторы:
```shell
ls -l /dev/disk/by-uuid/*
```

```shell
lrwxrwxrwx 1 root root 15 июл 14 19:17 /dev/disk/by-uuid/8f2a74a4-809c-471e-b4ad-a91bfd51d7c3 -> ../../mmcblk0p2
lrwxrwxrwx 1 root root 15 июл 14 19:17 /dev/disk/by-uuid/9969-E3D2 -> ../../mmcblk0p1
lrwxrwxrwx 1 root root 10 авг 27 22:08 /dev/disk/by-uuid/9C0D-FD9D -> ../../sda1
```

После этого можно добавить в **/etc/fstab** следующую строку:
```shell
/dev/disk/by-uuid/9C0D-FD9D    /media/usb-drive         vfat   0   0
```

Выполнить монтирование всех несмонтированных девайсов:
```shell
sudo mount -a
```
