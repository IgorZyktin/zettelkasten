# curl

Утилита для HTTP запросов

- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ linux }}](../../__tags/linux.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ системное администрирование }}](../../__tags/sistemnoe_administrirovanie.md)
- [{{ утилиты }}](../../__tags/utility.md)
- [{{ curl }}](../../__tags/curl.md)

1. [Запрос с аутентификацией](#Запрос-с-аутентификацией)

## Запрос с аутентификацией

Curl умеет самостоятельно добавлять basic аутентификацию, для этого надо
воспользоваться ключом --user.

```shell
curl --user name:password http://www.example.com
```
