# Kubernetes

Система запуска и управления большим количеством сервисов, упакованных в
контейнеры.

---

Теги:

- [Компьютеры](../../_tags/компьютеры.md)
- [Программное обеспечение](../../_tags/программное%20обеспечение.md)
- [Программы](../../_tags/программы.md)
- [Полезные рецепты](../../_tags/полезные%20рецепты.md)
- [Системное администрирование](../../_tags/системное%20администрирование.md)
- [Виртуализация](../../_tags/виртуализация.md)
- [Linux](../../_tags/linux.md)
- [Kubernetes](../../_tags/kubernetes.md)

---

1. [Создание секрета](#Создание-секрета)
2. [Изменение секрета](#Изменение-секрета)

## Создание секрета

Секреты в kubernetes хранятся в незашифрованном виде. Они закодированы в
base64, следует помнить, что любой человек с административным доступом может их
прочитать.

Пример создания секрета из файлов:

```shell
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
kubectl create secret generic db-user-pass \
  --from-file=./username.txt \
  --from-file=./password.txt
```

Флаг -n нужен, чтобы в файл не включались автоматически символы перевода
строки. Имя файла в итоге станет ключом для секрета по которому этот секрет
можно будет потом запросить. Если нужен другой ключ, его можно указать отдельно
в формате --from-file=[key=]source:

```shell
kubectl create secret generic db-user-pass \
  --from-file=username=./username.txt \
  --from-file=password=./password.txt
```

Аналогичным образом можно создать секрет прямо из командной строки:

```shell
kubectl create secret generic dev-db-secret \
  --from-literal=username=devuser \
  --from-literal=password='S!B\*d$zDsb='
```

Убедиться, что секрет создан:

```shell
kubectl get secrets
```

```shell
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```

```shell
kubectl describe secrets/db-user-pass
```

```shell
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password:    12 bytes
username:    5 bytes
```

Посмотреть содержимое секрета в base64:

```shell
kubectl get secret db-user-pass -o jsonpath='{.data}'
```

```shell
{"password":"MWYyZDFlMmU2N2Rm","username":"YWRtaW4="}
```

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```

```shell
1f2d1e2e67df
```

Удалить секрет:

```shell
kubectl delete secret db-user-pass
```

## Работа с секретами

Секреты можно пробрасывать в pod как файлы или как переменные окружения. Я
опишу только работы с переменными окружения.

Предположим, что у нас есть секрет mysecret с логином admin и паролем
1f2d1e2e67df.

Пример конфигурации пода для работы с переменными окружения:

```yaml
apiVersion: v1
kind: Pod
metadata:
    name: secret-env-pod
spec:
    containers:
        -   name: mycontainer
            image: redis
            env:
                -   name: SECRET_USERNAME
                    valueFrom:
                        secretKeyRef:
                            name: mysecret
                            key: username
                -   name: SECRET_PASSWORD
                    valueFrom:
                        secretKeyRef:
                            name: mysecret
                            key: password
    restartPolicy: Never
```

Доступ из контейнера:

```shell
echo $SECRET_USERNAME
```

> admin

```shell
echo $SECRET_PASSWORD
```

> 1f2d1e2e67df

## Изменение секрета

```shell
kubectl edit secrets mysecret
```
