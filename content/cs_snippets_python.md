# Рецепты python

[python](./meta_python.md)

[программирование](./meta_programmirovanie.md)

1. [Понять кто меняет наш атрибут](#Понять-кто-меняет-наш-атрибут)
1. [Массовое обновление пакетов виртуального окружения](#Массовое-обновление-пакетов-виртуального-окружения)

## Понять кто меняет наш атрибут

На одном из проектов встал вопрос, как понять, какая программная сущность
меняет критическую настройку. Это оказалось легко сделать с данным примером,
который показывает, кто выключает логгер.

```python3
import logging
import sys


@property
def disabled(self):
    return self._disabled


@disabled.setter
def disabled(self, disabled):
    if disabled:
        frame = sys._getframe(1)
        print(f"{frame.f_code.co_filename}:{frame.f_lineno} "
              f"disabled the {self.name} logger")
    self._disabled = disabled


# не во всех версиях атрибут disabled присутствует
# logging.Logger._disabled = logging.Logger.disabled
logging.Logger.disabled = disabled
```

Пример вывода от этой команды:

```
# много строк пропущено
/usr/lib/python3.8/logging/config.py:181 disabled the concurrent.futures logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.base.client logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.library.session logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.raw.client logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.raw.entities.lease logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.raw.managers.kv logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.raw.managers.lease logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.wrapped.client logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.wrapped.entities.kvlock logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.wrapped.entities.lease logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.wrapped.managers.kv logger
/usr/lib/python3.8/logging/config.py:181 disabled the httpetcd3.wrapped.managers.kvlock logger
/usr/lib/python3.8/logging/config.py:181 disabled the oslo_config.cfg logger
/usr/lib/python3.8/logging/config.py:181 disabled the oslo_i18n._message logger
/usr/lib/python3.8/logging/config.py:181 disabled the pbr.testr_command logger
/usr/lib/python3.8/logging/config.py:181 disabled the requests logger
/usr/lib/python3.8/logging/config.py:181 disabled the requests.packages.urllib3 logger
/usr/lib/python3.8/logging/config.py:181 disabled the requests.packages.urllib3.connection logger
/usr/lib/python3.8/logging/config.py:181 disabled the requests.packages.urllib3.connectionpool logger
/usr/lib/python3.8/logging/config.py:181 disabled the requests.packages.urllib3.poolmanager logger
/usr/lib/python3.8/logging/config.py:181 disabled the requests.packages.urllib3.util.retry logger
/usr/lib/python3.8/logging/config.py:181 disabled the setuptools.extern.packaging.tags logger
# много строк пропущено
```

Источник: [StackOverflow](https://stackoverflow.com/questions/28694540/python-default-logger-disabled/28694704#28694704)

## Массовое обновление пакетов виртуального окружения

Иногда возникает необходимость обновить целую пачку зависимостей, да так, чтобы
сбои при обновлении одних зависимостей не сказывались на обновлении других.

Этого можно достичь командой:

```shell
pip list --outdated | cut -d ' ' -f1 | xargs -n1 pip install -U
```

Команда "pip list --outdated" выведет перечень устаревших зависимостей вида:

```shell
urllib3 (1.7.1) - Latest: 1.15.1 [wheel]
wheel (0.24.0) - Latest: 0.29.0 [wheel]
```

Содержимое ответа отправится команде cut, которая разобьёт строки по пробелу и
возьмёт крайний левый элемент. После чего xargs последовательно будет звать "
pip install -U" + имя пакета для каждой строки.

