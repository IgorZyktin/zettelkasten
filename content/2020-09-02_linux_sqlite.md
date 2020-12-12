# Установка SQLite на Linux

---

[базы данных](./meta_bazy_dannyh.md)

[linux](./meta_linux.md)

[sqlite](./meta_sqlite.md)


Простая установка на Ubuntu:

> sudo apt-get install sqlite3


Для сборки из исходников надо сходить на официальный сайт:
https://www.sqlite.org/download.html

И взять там самую свежую версию.

Типичная команда установки выглядит как:

> sudo wget https://www.sqlite.org/2020/sqlite-autoconf-<версия>.tar.gz && tar xvfz sqlite-autoconf-<версия>.tar.gz && cd sqlite-autoconf-<версия>&& ./configure && make && make install


На 2 сентября 2020 года актуальной была версия 3330000:

> sudo wget https://www.sqlite.org/2020/sqlite-autoconf-3330000.tar.gz && tar xvfz sqlite-autoconf-3330000.tar.gz && cd sqlite-autoconf-3330000 && ./configure && make && make install

