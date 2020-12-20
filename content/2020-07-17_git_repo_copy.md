# Скопировать репозиторий GIT

[программирование](./meta_programmirovanie.md)

[git](./meta_git.md)

[github](./meta_github.md)

### Создание полноценной копии старого репозитория на новом месте:

```
git clone --bare https://github.com/exampleuser/old-repository.git
cd old-repository.git
git push --mirror https://github.com/exampleuser/new-repository.git
cd ..
rm -rf old-repository.git
```

### Изменение настроек источника:

Посмотреть текущие источники:

```
git remote -v
```

Установить другой адрес:

```
git remote set-url origin git@gitserver.com:user/repo_name.git
```
