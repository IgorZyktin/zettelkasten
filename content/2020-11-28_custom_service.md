# Создание собственного сервиса в systemctl Linux

Эта инструкция позволяет создавать демонов системы,
выполняющихся в фоне относительно пользовательских скриптов.

---

[\#linux](meta_linux.md)

[\#systemctl](meta_systemctl.md)

Необходимо создать файл с именем оканчивающимся на **.service**:
> sudo nano /etc/systemd/system/my_app.service

Удобно держать в репозитории проекта локальный вариант, а потом копировать его в систему по необходимости:
> sudo cp ./my_app.service /etc/systemd/system/my_app.service

В файл надо записать данные:
```
[Unit]
Description=My cool app description
After=network.target

[Service]
User=some_user
WorkingDirectory=/home/some_user/my_app_folder
Environment= DB_PATH="/home/some_user/database"
ExecStart=/home/some_user/my_app_folder/run_app.sh

[Install]
WantedBy=multi-user.target
```
В Environment перечисляются значения переменных окружения.
Дополнительно можно использовать поле **EnvironmentFile=** с указанием пути до текстового файла, тогда переменные среды будут загружаться оттуда.

Убедиться, что есть права на запуск скрипта:

> sudo chmod +x ./run_app.sh

Затем можно запустить сервис:

> sudo systemctl enable my_app

> sudo systemctl start my_app

> sudo systemctl status my_app

Посмотреть лог сервиса:

> sudo journalctl --unit=my_app

Удалить сервис:

> sudo systemctl disable my_app
