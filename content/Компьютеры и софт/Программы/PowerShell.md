# PowerShell

Вариант оболочки от Microsoft. Внешне похож на cmd и bash, но имеет кучу своих
особенностей.

---

Теги:

- {{ компьютеры }}
- {{ программное обеспечение }}
- {{ Программы }}
- {{ системное администрирование }}
- {{ полезные рецепты }}
- {{ PowerShell }}

---

1. [Псевдоним для grep](#Псевдоним-для-grep)

### Псевдоним для grep

Совсем простой, будет выводить результат в следующей строке и не будет
подсвечивать:

```shell
new-alias grep findstr
```

Более каноничный вариант поиска строк в PowerShell:

```shell
kubectl get pods | Select-String "topo"
```

Более красивый вариант псевдонима:

```shell
New-Alias -Name "grep" -Value "Select-String"
```

Удалить существующий псевдоним:

```shell
Remove-Alias -Name <some-name>
```

Можно добавить поиск по регулярным выражениям и сохранением после рестарта. Для
этого сначала надо узнать адрес файла для профиля (он может и не существовать).

```shell
$profile
```

```shell
C:\Users\user\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
```

Добавить в него следующий код:
```shell
filter Filter-Object ([string]$pattern)
{
    Out-String -InputObject $_ -Stream | Select-String -Pattern "$pattern"
}

New-Alias -Name grep -Value Filter-Object
```

После чего перезагрузить PowerShell.
