# grep

Позволяет искать в текстовых файлах совпадение по шаблону.

---

Теги:

- [Компьютеры](../../_tags/компьютеры.md)
- [Программное обеспечение](../../_tags/программное%20обеспечение.md)
- [Linux](../../_tags/linux.md)
- [Полезные рецепты](../../_tags/полезные%20рецепты.md)
- [Системное администрирование](../../_tags/системное%20администрирование.md)
- [Утилиты](../../_tags/утилиты.md)
- [grep](../../_tags/grep.md)

---

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
