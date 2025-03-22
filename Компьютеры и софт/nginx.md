# NGINX

Быстрый асинхронный веб сервер.

### Простая установка

```shell
sudo apt update
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw status
sudo systemctl status nginx
```

### Простая настройка

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
sudo nginx -t
sudo nginx -s reload
```

#### Убрать версию из выдачи

```shell
sudo vim /etc/nginx/nginx.conf
```

```shell
http {
    ...
    server_tokens off;
}
```

#### Сборка из исходников

Может потребоваться для включения дополнительных модулей. В данном примере
дополнительно включен модуль mod_zip.

```shell
sudo apt-get update
sudo apt-get install build-essential libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev libgd-dev libxml2 libxml2-dev uuid-dev
wget  http://nginx.org/download/nginx-1.27.2.tar.gz
tar -zxvf nginx-1.27.2.tar.gz
wget https://github.com/evanmiller/mod_zip/archive/refs/tags/1.3.0.tar.gz
tar -zxvf 1.3.0.tar.gz
cd nginx-1.27.2
./configure --prefix=/var/www/html --sbin-path=/usr/sbin/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --with-pcre  --lock-path=/var/lock/nginx.lock --pid-path=/var/run/nginx.pid --with-http_ssl_module --with-http_image_filter_module=dynamic --modules-path=/etc/nginx/modules --with-http_v2_module --with-stream=dynamic --with-http_mp4_module --with-http_auth_request_module --add-module=/home/igor/mod_zip-1.3.0 
sudo make
sudo make install
sudo nginx
sudo nginx -V
ps aux | grep nginx 
sudo nginx -s stop
```


#### Создание systemd-файла

```shell
sudo vim /lib/systemd/system/nginx.service
```

```
[Unit]
Description=The NGINX HTTP and reverse proxy server
After=syslog.target network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target
        
[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/sbin/nginx -t
ExecStart=/usr/sbin/nginx
ExecReload=/usr/sbin/nginx -s reload
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true
        
[Install]
WantedBy=multi-user.target
```

```shell
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

#### Бан нежелательных запросов из сети

```shell
location /cgi-bin/ {return 444;}
location /scripts/ {return 444;}
location ~ ".*\.git.*" {return 444;}
```

## Источники

* https://www.digitalocean.com/community/tutorials/nginx-ubuntu-18-04-ru
