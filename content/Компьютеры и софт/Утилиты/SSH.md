# ssh

Инструмент для работы на удалённой машине через консоль.

---

Теги:

- [Компьютеры](../../_tags/Компьютеры.md)
- [Программное обеспечение](../../_tags/Программное%20обеспечение.md)
- [Linux](../../_tags/Linux.md)
- [Windows](../../_tags/Windows.md)
- [Полезные рецепты](../../_tags/Полезные%20рецепты.md)
- [Системное администрирование](../../_tags/Системное%20администрирование.md)
- [Утилиты](../../_tags/Утилиты.md)
- [ssh](../../_tags/ssh.md)

---

## Работа с ключами

Генерация ключа:

```shell
ssh-keygen
```

Копирование ключа:

```shell
ssh-copy-id -i /path/to/key.pub SERVERNAME
```

## Конфиг

Находится в файле:

```shell
 ~/.ssh/config
```

Должен содержать примерно:

```shell
Host SERVERNAME
Hostname ip-or-domain-of-server
User USERNAME
PubKeyAuthentication yes
IdentityFile ./path/to/key
```

## Подключение по SSH

С максимальным выводом подробностей:

```shell
ssh -vvv -i id_rsa user@127.0.0.1
```

Просто с указанием конкретного ключа:

```shell
ssh -i ~/.ssh/custom_key_name SYSUSER@x.x.x.x
```

## Множественные ключи

Надо добавить их в файл **.ssh/authorized_keys**. Один ключ — одна строка.

```shell
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDSkT3A1j89RT/540ghIMHXIVwNlAEM3WtmqVG7YN/wYwtsJ8iCszg4/lXQsfLFxYmEVe8L9atgtMGCi5QdYPl4X/c+5YxFfm88Yjfx+2xEgUdOr864eaI22yaNMQ0AlyilmK+PcSyxKP4dzkf6B5Nsw8lhfB5n9F5md6GHLLjOGuBbHYlesKJKnt2cMzzS90BdRk73qW6wJ+MCUWo+cyBFZVGOzrjJGEcHewOCbVs+IJWBFSi6w1enbKGc+RY9KrnzeDKWWqzYnNofiHGVFAuMxrmZOasqlTIKiC2UK3RmLxZicWiQmPnpnjJRo7pL0oYM9r/sIWzD6i2S9szDy6aZ mike@laptop1
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCzlL9Wo8ywEFXSvMJ8FYmxP6HHHMDTyYAWwM3AOtsc96DcYVQIJ5VsydZf5/4NWuq55MqnzdnGB2IfjQvOrW4JEn0cI5UFTvAG4PkfYZb00Hbvwho8JsSAwChvWU6IuhgiiUBofKSMMifKg+pEJ0dLjks2GUcfxeBwbNnAgxsBvY6BCXRfezIddPlqyfWfnftqnafIFvuiRFB1DeeBr24kik/550MaieQpJ848+MgIeVCjko4NPPLssJ/1jhGEHOTlGJpWKGDqQK+QBaOQZh7JB7ehTK+pwIFHbUaeAkr66iVYJuC05iA7ot9FZX8XGkxgmhlnaFHNf0l8ynosanqt henry@laptop2
```

## Отзыв ключа

```shell
ssh-keygen -y -f /path/to/your_private_key_file (eg. /root/.ssh/id_rsa or ~/.ssh/custom_key_name)
```

## Псевдонимы

Алиасы настраиваются в файле **~/.ssh/config**:

Пример алиасов:

    Host my_host
    User my_user
    Port 225
    HostName 8.8.8.8
    
    Host srv2
    User root
    Port 226
    HostName 8.8.4.4

Введя подобный текст в этом файле, вы сможете вместо:

```shell
ssh -p 225 my_user@8.8.8.8
```

Писать:

```shell
ssh my_host
```

Это удобно, когда надо ходить на множество машин, с разными портами и
пользователями.
