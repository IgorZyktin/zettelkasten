# Полезные рецепты

Микрокомпьютер с linux на борту и существенной вычислительной мощью.

- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ Raspberry Pi }}](../../__tags/raspberry_pi.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ системное администрирование }}](../../__tags/sistemnoe_administrirovanie.md)


1. [Узнать температуру процессора](#Узнать-температуру-процессора)

## Узнать температуру процессора

```shell
vcgencmd measure_temp
````

То же самое для любителей программировать:

```shell
touch temp.c
```

```
#include <stdio.h>

int main(int argc, char *argv[]) 
{
   FILE *fp;

   int temp = 0;
   fp = fopen("/sys/class/thermal/thermal_zone0/temp", "r");
   fscanf(fp, "%d", &temp);
   printf(">> CPU Temp: %.2f°C\n", temp / 1000.0);
   fclose(fp);

   return 0;
}
```

```shell
gcc temp.c -o temp
sudo mv ./temp /usr/local/bin/
temp
```

```shell
CPU Temp: 42.35°C
```
