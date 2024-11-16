# Терминал Windows

### Аналог ssh-copy-id

```shell
type $env:USERPROFILE\.ssh\id_rsa.pub | ssh {IP-ADDRESS-OR-FQDN} "cat >> .ssh/authorized_keys"
```

### Сохранить команду

Чтобы она автоматически применялась, её надо добавить в файл $PROFILE.

```shell
$PROFILE
C:\Users\User\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
```

Автоматическое добавление:

```shell
# Make sure the $PROFILE file exists.
If (-not (Test-Path $PROFILE)) { $null = New-Item -Force $PROFILE }

# Append the function definition to it.
@"

function Restart-PowerShell { 
  ${function:Restart-PowerShell}
}
"@ | Add-Content $PROFILE
```

## Источники:

* [How to save function in powershell](https://stackoverflow.com/questions/69725081/how-to-save-function-in-powershell)
