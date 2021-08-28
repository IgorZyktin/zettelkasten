# NGINX

Быстрый асинхронный веб сервер.

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

[nginx](./meta_nginx.md)

Оригинал: https://www.digitalocean.com/community/tutorials/nginx-ubuntu-18-04-ru


Обновить репозитории и установить:
```shell
sudo apt update
sudo apt install nginx
```

Доступ через файерволл:
```shell
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw status
```

Проверка работы сервера:
```shell
systemctl status nginx
```

Типичная настройка:
```shell
sudo nano /etc/nginx/sites-available/example.com
```

Содержимое:
```
server {
        listen       80;
        server_name  localhost;

        access_log  logs/localhost.access.log  main;

        location / {
            root /var/www/board/public;
            index index.html index.htm index.php;
        }
   }
```

Создание ссылки, чтобы сайт был видим:
```shell
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
```

### Раздача на несколько внутренних адресов

```
server {
    listen       ...;
    ...
    location / {
        proxy_pass http://127.0.0.1:8080;
    }
    
    location /blog {
        proxy_pass http://127.0.0.1:8181;
    }

    location /mail {
        proxy_pass http://127.0.0.1:8282;
    }
    ...
}
```

#### Перезапуск с новыми настройками

```shell
nginx -s reload
```
