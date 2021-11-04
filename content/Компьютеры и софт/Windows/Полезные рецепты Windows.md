# Полезные рецепты



---

Теги:

- [Компьютеры](../../_tags/Компьютеры.md)
- [Программное обеспечение](../../_tags/Программное%20обеспечение.md)
- [Windows](../../_tags/Windows.md)
- [Полезные рецепты](../../_tags/Полезные%20рецепты.md)
- [Системное администрирование](../../_tags/Системное%20администрирование.md)

---

1. [Добавить каталог в PATH](#Добавить-каталог-в-PATH)

## Добавить каталог в PATH

Можно решить через создание функции.

```shell
function AddTo-Path{
param(
    [string]$Dir
)

    if( !(Test-Path $Dir) ){
        Write-warning "Supplied directory was not found!"
        return
    }
    $PATH = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    if( $PATH -notlike "*"+$Dir+"*" ){
        [Environment]::SetEnvironmentVariable("PATH", "$PATH;$Dir", "Machine")
    }
}
```

И потом:

```shell
AddTo-Path("C:\Users\user\bin")
```
