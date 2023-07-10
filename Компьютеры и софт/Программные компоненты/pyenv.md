# Pyenv

Удобная замена стандартному virtualenv. Основное отличие — может самостоятельно
собирать нужные версии питона для каждого проекта, а также переключать
интерпретаторы по необходимости.



- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ программирование }}](../../__tags/programmirovanie.md)
- [{{ linux }}](../../__tags/linux.md)
- [{{ python }}](../../__tags/python.md)
- [{{ Pyenv }}](../../__tags/pyenv.md)


## Установка

Для начала надо обновить систему:

```shell
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
xz-utils tk-dev libffi-dev liblzma-dev python-openssl git
```

И не забыть собрать SQlite!

Потом клонировать pyenv:

```shell
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc
exec "$SHELL"
```

```shell
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc
eval "$(pyenv init -)"
exec "$SHELL"
pyenv install 3.7.4
```

Виртуальное окружение:

```shell
pyenv virtualenv 3.7.4 venv
pyenv activate <name>
pyenv deactivate
```
