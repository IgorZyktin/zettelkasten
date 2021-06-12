# Инструмент GIT

[программирование](./meta_programmirovanie.md)

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

[git](./meta_git.md)

[ssh](./meta_ssh.md)

GIT это распределённая система контроля версий. Позволяет хранить одновременно
множество вариантов исходных текстов и удобно переключаться между ними.

1. [Авторизация по SSH на GitHub](#авторизация-по-SSH-на-GitHub)
1. [Скопировать репозиторий GIT](#скопировать-репозиторий-GIT)
1. [Полезные команды GIT](#полезные-команды-GIT)

## Авторизация по SSH на GitHub

Для автоматической авторизации надо сгенерировать ключ

```shell
cd ~/.ssh/
ssh-keygen -t rsa -C "username@domain.tld"
```

После генерации можно проверить доступ:

```shell
ssh -T git@github.com
```

На этом этапе должен возвращаться ответ **git@github.com: Permission denied (
publickey).**

Добавляем на гитхабе в SSH ключи содержимое файла **id_rsa.pub**.

```shell
cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB.....as username@domain.tld
```

Добавляем сгенерированный ключ в ssh-agent:

```shell
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

В этот момент может выскочить сообщение:

```shell
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                                                                                                                     
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @                                                                                                                                     
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for '/home/user/.ssh/id_rsa.pub' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
```

Проблема решается установкой прав:

```shell
chmod =600 ~/.ssh/id_rsa
```

Чтобы не вызывать каждый раз ssh-agent, можно прописать это в ~/.bashrc

```shell
# start ssh
{ eval $(ssh-agent -s) && ssh-add /home/user/.ssh/id_rsa; } &> /dev/null
```

На этом этапе **ssh -T git@github.com** выдавать приветствие. Если всё-равно не
получается зайти без пароля, значит надо проверить настройки репозитория.

```shell
nano .git/config
```

url должен иметь вид:

```shell
url = ssh://git@domain/accountname/reponame.git
```

## Скопировать репозиторий GIT

Создание полноценной копии старого репозитория на новом месте:

```shell
git clone --bare https://github.com/exampleuser/old-repository.git
cd old-repository.git
git push --mirror https://github.com/exampleuser/new-repository.git
cd ..
rm -rf old-repository.git
```

### Изменение настроек источника:

Посмотреть текущие источники:

```shell
git remote -v
```

Установить другой адрес:

```shell
git remote set-url origin git@gitserver.com:user/repo_name.git
```

## Полезные команды GIT

### Установка на Ubuntu

```shell
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install git
git --version
```
