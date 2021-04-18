# Linux OOM killer

[linux](./meta_linux.md)

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

Если процесс жрёт слишком много памяти, система может убить его. 
Узнать об этом можно тут:
```shell
dmesg | less
```

Попытаться узнать факт убийства:
```shell
#!/bin/bash
<your_job_here>
ret=$?
#
#  returns > 127 are a SIGNAL
#
if [ $ret -gt 127 ]; then
        sig=$((ret - 128))
        echo "Got SIGNAL $sig"
        if [ $sig -eq $(kill -l SIGKILL) ]; then
                echo "process was killed with SIGKILL"
                dmesg > $HOME/dmesg-kill.log
        fi
fi
```
