# Полезные рецепты



---

Теги:

- [Компьютеры](../../_tags/компьютеры.md)
- [Программное обеспечение](../../_tags/программное%20обеспечение.md)
- [Windows](../../_tags/windows.md)
- [Полезные рецепты](../../_tags/полезные%20рецепты.md)
- [Системное администрирование](../../_tags/системное%20администрирование.md)

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
