# SQLite

Популярная реляционная база данных, умещающаяся в одном файле.

---

Теги:

- [Компьютеры](../../_tags/Компьютеры.md)
- [Программное обеспечение](../../_tags/Программное%20обеспечение.md)
- [Программы](../../_tags/Программы.md)
- [Полезные рецепты](../../_tags/Полезные%20рецепты.md)
- [Системное администрирование](../../_tags/Системное%20администрирование.md)
- [Базы данных](../../_tags/Базы%20данных.md)
- [Linux](../../_tags/Linux.md)
- [SQLite](../../_tags/SQLite.md)

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
