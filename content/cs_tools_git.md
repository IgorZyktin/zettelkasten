# Инструмент GIT

GIT это распределённая система контроля версий. Позволяет хранить одновременно
множество вариантов исходных текстов и удобно переключаться между ними.

[программирование](./meta_programmirovanie.md)

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

[git](./meta_git.md)

[ssh](./meta_ssh.md)

1. [Авторизация по SSH на GitHub](#авторизация-по-SSH-на-GitHub)
1. [Скопировать репозиторий GIT](#скопировать-репозиторий-GIT)
1. [Полезные команды GIT](#полезные-команды-GIT)
1. [Интерактивный rebase](#интерактивный-rebase)
1. [Перенести коммит из upstream в свою ветку](#Перенести-коммит-из-upstream-в-свою-ветку)
1. [Сделать pull поверх имеющихся изменений](#Сделать-pull-поверх-имеющихся-изменений)

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

### Экранирование специальных символов

На windows оболочке могут не понравится специальные символы git вроде ~ или ^.
В cmd их можно экранировать как 'HEAD^^', в powershell как 'HEAD`^'. Другой
вариант - '"HEAD^"'.

### Установка на Ubuntu

```shell
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update
sudo apt-get install git
git --version
```

### Интерактивный rebase

Операция rebase в данном случае используется не столько для слияния веток, а
скорее для переписывания истории. Такой режим позволяет переписывать все
сохранённые коммиты, менять их, удалять, менять очередность. Как при любом
переписывании истории, эта операция может создать очень серьёзные проблемы если
кто-то уже начал работать с оригинальной веткой. Поэтому такая операция
допускается только на отдельных ветках и только когда с ней работает один
человек. Для push изменений обязательно будет использовать force, что может
быть запрещено на некоторых ветках.

Сначала надо узнать на сколько коммитов мы ушли от мастера (предполагается, что
переписывать историю мастера недопустимо, значит глубже уходить нельзя):

```shell
git cherry -v master
```

```shell
+ e100543903fd72efb60514a5bb0786725c8faa48 environment setup
+ bf9cbdb13d41d8930d84c93bde5cfd976a4db83a dpp setup
+ dc912d45153197e1b76d6d28464a7c765269f729 main components setup
+ 3c6bf1c56d2ae1351fbcb64d4d700e3675c02d91 tests setup
+ 03b498bede8f97ef3cb102da97daee8426d4e1c8 Updated dependencies
...
```

Потом надо посчитать их:

```shell
git cherry -v master | wc -l
```

```shell
90
```

Для запуска интерактивного rebase надо будет указать сколько коммитов в прошлом
мы хотим переписать. Например, 5:

```shell
git rebase -i HEAD~5
```

Примечание: merge коммиты будут проигнорированы.

```shell
pick c7dd7b0 fixed putting hypervisor in context
pick 958e983 feat: added tests for analyze graph
pick 60bf495 fix: correct amount of volumes to migrate
pick 5b19e4e fix: handling exc on topology api 404
pick 32077bf testing stage deploy

# Rebase abdcd0a..32077bf onto abdcd0a (5 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified); use -c <commit> to reword the commit message
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
```

Откроется текстовый редактор, который позволит описать, что именно надо сделать
с коммитами. Изменения вносятся в первое слово в строке с коммитом.

Возможные операции:

* Удалить строку — удалить коммит из истории. То же самое что drop, но при
  определённых настройках гита можно получить предупреждение (предполагается
  что это может быть опечатка или ошибка при copy-paste). Удалить все коммиты
  таким образом не получится.
* pick или p — добавить коммит без изменений т.е. оставить как было.
* reword или r — также добавить, но изменить commit message.
* edit или e — остановить операцию на этом коммите, чтобы можно было внести
  изменения и потом продолжить. Можно вызвать amend, чтобы поменять сам коммит.
* squash или s — слить один или несколько коммитов с предыдущим, все commit
  message склеить в одно большое сообщение.
* fixup или f — слить один или несколько коммитов с предыдущим, оставить только
  последний commit message.
* exec или x — исполнить команду в оболочке. exec надо ставить между самими
  коммитами. С её помощью можно например запускать тесты, чтобы убедиться что
  добавление коммита ничего не сломало. Если команда вернёт ошибку, rebase
  будет остановлен.
* break или b — остановить слияние на этом месте. Потом можно будет продолжить
  вручную через 'git rebase --continue'.
* drop или d — удалить коммит из истории.
* label или l — промаркировать HEAD текстом. Метка будет удалена после
  окончания rebase. Может быть полезно если делать rebase нескольких похожих
  веток в одном репозитории одновременно.
* reset или t — перевести указатель HEAD на указанную метку. Примерно то же
  самое что 'exec git reset --hard <label>', но изменения в файлах остаются.
* merge или m — выполнить merge данного коммита с HEAD (текущей позицией).

После сохранения и закрытия файла все операции будут применены. После этого
можно будет сделать git push --force для отправки на сервер.

### Разделение существующих коммитов

Начать интерактивный rebase если недалеко в историю:

```shell
git rebase -i HEAD~3
```

Начать интерактивный rebase если нужный коммит очень глубоко:

```shell
git rebase -i <commit>^
```

Промаркировать нужный коммит словом edit. Когда git доберётся до него, позвать:

```shell
git reset HEAD^
```

Так указатель HEAD сдвинется на один коммит назад и индекс вместе с ним. Теперь
можно сколько угодно раз делать коммиты различных изменений.

По окончанию надо позвать:

```shell
git rebase --continue
```

### Перенести коммит из upstream в свою ветку

Эта операция используется, когда мы работаем в fork какого-либо репозитория и
хотим перенести к себе некоторый коммит оттуда. Но при этом не хотим тащить всю
ветку целиком.

Проверить наличие веток:

```shell
git remote -v show
```

```shell
origin  git@some:repo.git (fetch)
origin  git@some:repo.git (push)
```

Добавить upstream если его нет:

```shell
git remote add upstream https://github.com/openstack/nova.git
```

```shell
git remote -v show
```

```shell
origin  git@some:repo.git (fetch)
origin  git@some:repo.git (push)
upstream        https://github.com/openstack/nova.git (fetch)
upstream        https://github.com/openstack/nova.git (push)
```

На всякий случай обновляем нужную ветку:

```shell
git fetch upstream some_branch
```

После этого вызываем операцию (с sha нужного нам коммита):

```shell
git cherry-pick -xs b6c7456face630086a0eb7fd1c8335d42ab0456a
```

Флаги:

* -x добавляет имя коммита в описание
* -s добавляет в примечание кто сделал cherry-pick

После этого выбранный коммит окажется в нашей ветке.

### Сделать pull поверх имеющихся изменений

[Оригинал](https://stackoverflow.com/questions/1125968/git-how-do-i-force-git-pull-to-overwrite-local-files)

Иногда требуется сделать нечто похожее на git push --force, но в обратную
сторону.

```shell
git fetch --all
git reset --hard origin/<branch_name>
```

Можно выполнить подобную операцию, сохранив локальные коммиты:

```shell
git checkout master
git branch new-branch-to-save-current-commits
git fetch --all
git reset --hard origin/master
```
