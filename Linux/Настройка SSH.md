---
tags:

- linux
- ssh
- настройка сервера
- fail2ban

---

# Настройка SSH

## Оглавление

### Подготовка к работе через SSH

Первым делом надо сменить пароль root пользователя.

```shell
sudo passwd root
```

Потом обновить зависимости:

```shell
sudo apt update
sudo apt upgrade
```

### Копирование публичного ключа

Перед тем как пытаться настроить SSH, надо убедиться в том, что мы сами
себе не оборвём доступ.

Во-первых, если идёт подключение по публичному ключу,
он должен быть добавлен на машину до начала настройки.

Во-вторых, надо
убедиться, что нам не помешают настройки файерволла. Например, порт 22 может
быть по умолчанию открыт. Но если мы захотим вывести SSHD на другой порт, надо
проверить настройки файерволла и, при необходимости, заранее открыть нужный
порт.

Скопировать публичный ключ на машину, к которой уже есть ssh доступ:

```shell
ssh-copy-id -i ~/.ssh/id_rsa.pub user@192.168.1.200
```

Следует убедиться, что на файлах ключа выставлены соответствующие разрешения (
как на клиенте, так и на сервере):

```shell
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### Конфигурация демона SSH

Изменение конфига:

```shell
sudo nano /etc/ssh/sshd_config
```

Стоит установить:

```shell
PermitRootLogin no
HostBasedAuthentication no
PermitEmptyPasswords no
MaxAuthTries 4
# ClientAliveInterval 600
PermitUserEnvironment no
X11Forwarding no
maxsessions 4
LogLevel VERBOSE
Port <любой отличающийся от 22 чтобы избежать сканеров>
AllowUsers <список пользователей, которым можно заходить на хост>
PasswordAuthentication no
PubkeyAuthentication yes
```

Для применения настроек:

```shell
sudo systemctl restart sshd
```

### Конфигурация клиента SSH

Конфигурация обычно находится в каталоге пользователя.

```shell
nano /home/user/.ssh/config
```

Для быстрого доступа следует добавить в конец файла:

```shell
Host my_host
    User user
    Port 22
    HostName 192.168.1.200
```

Если для доступа используется отдельный файл с ключом, также надо добавить:

```shell
	IdentityFile file.pem
```

После этого можно будет ходить на машину через:

```shell
ssh my_host
```

### Конфигурация файервола

Следует разрешить траффик SSH. Желательно ограничить набор IP с которых может
приходить запрос.

```shell
sudo ufw allow from to any port 22
```

### Установка fail2ban

```shell
sudo apt update
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/ssh.conf
```

Пример настройки:

```ini
[sshd]
enabled = true
filter = sshd
action = iptables[name=SSH, port=ssh, protocol=tcp]
logpath = /var/log/auth.log
findtime = 300
maxretry = 5
bantime = 7200
```

Посмотреть заблокированные адреса:

```shell
sudo fail2ban-client status sshd
```
