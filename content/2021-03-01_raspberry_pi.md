# RaspberryPI

Сборник рецептов для работы с этим микрокомпьютером.

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

[raspberrypi](./meta_raspberrypi.md)


### Температура процессора

> vcgencmd measure_temp


То же самое для любителей программировать:
> touch temp.c

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

> gcc temp.c -o temp
> sudo mv ./temp /usr/local/bin/
> $ temp
>> CPU Temp: 42.35°C
