# Настройка aliases для SSH

Настройка заменителей (alias) для работы с ssh.

[ssh](./meta_ssh.md)

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

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

> ssh -p 225 my_user@8.8.8.8

Писать:

> ssh my_host

Это удобно, когда надо ходить на множество машин, 
с разными портами и пользователями.
