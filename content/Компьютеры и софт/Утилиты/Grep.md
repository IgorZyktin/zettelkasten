# grep

Позволяет искать в текстовых файлах совпадение по шаблону.

---

Теги:

- {{ компьютеры }}
- {{ программное обеспечение }}
- {{ linux }}
- {{ полезные рецепты }}
- {{ системное администрирование }}
- {{ утилиты }}
- {{ grep }}

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
