# SQLite

Популярная реляционная база данных, умещающаяся в одном файле.

---

Теги:

- {{ компьютеры }}
- {{ программное обеспечение }}
- {{ Программы }}
- {{ полезные рецепты }}
- {{ системное администрирование }}
- {{ Базы данных }}
- {{ linux }}
- {{ SQLite }}

---

## Установка на Ubuntu

Простая установка на Ubuntu:

```shell
sudo apt-get install sqlite3
```

Для сборки из исходников надо сходить на официальный сайт:
https://www.sqlite.org/download.html

И взять там самую свежую версию.

Типичная команда установки выглядит как:

```shell
sudo wget https://www.sqlite.org/2020/sqlite-autoconf-<версия>.tar.gz && tar xvfz sqlite-autoconf-<версия>.tar.gz && cd sqlite-autoconf-<версия>&& ./configure && make && make install
```

На 2 сентября 2020 года актуальной была версия 3330000:

```shell
wget https://www.sqlite.org/2020/sqlite-autoconf-3310100.tar.gz && tar xvfz sqlite-autoconf-3310100.tar.gz && cd sqlite-autoconf-3310100 && ./configure && make && make install
```
