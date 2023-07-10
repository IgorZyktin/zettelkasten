# grep

Позволяет искать в текстовых файлах совпадение по шаблону.



- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ linux }}](../../__tags/linux.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ системное администрирование }}](../../__tags/sistemnoe_administrirovanie.md)
- [{{ утилиты }}](../../__tags/utility.md)
- [{{ grep }}](../../__tags/grep.md)


1. [Найти рекурсивно в файлах определенного типа](#Найти-рекурсивно-в-файлах-определенного-типа)

## Найти рекурсивно в файлах определенного типа

```shell
grep -iro  --include="*.tf" "openstack_.*"
```

Ключи: -i игнорировать регистр, -r искать рекурсивно, -o выводить только
совпавший текст.

Пример вывода:

```
terraform-cases-new/cases/transit-network/network.tf:openstack_networking_router_v2.east.id
terraform-cases-new/cases/transit-network/network.tf:openstack_networking_subnet_v2.east.id
terraform-cases-new/cases/transit-network/network.tf:openstack_networking_port_v2" "wan-east" {
terraform-cases-new/cases/transit-network/network.tf:openstack_networking_network_v2.wan.id
terraform-cases-new/cases/transit-network/network.tf:openstack_networking_subnet_v2.wan.id
```

Улучшенный вариант предыдущей инструкции, который выкусывает только имена и
выводит уникальный набор.

```shell
grep -iroh  --include="*.tf" "openstack_[A-Za-z0-9_]*" | sort | uniq
```

Ключ -h отключает вывод имени файла.
