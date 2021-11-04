# Grafana

Grafana это серверное приложение, позволяющее запустить свой сервис с
дашбордами. Умеет работать со множеством баз данных и рисует красивые графики.

---

Теги:

- [Компьютеры](../../_tags/Компьютеры.md)
- [Программное обеспечение](../../_tags/Программное%20обеспечение.md)
- [Программы](../../_tags/Программы.md)
- [Полезные рецепты](../../_tags/Полезные%20рецепты.md)
- [Системное администрирование](../../_tags/Системное%20администрирование.md)
- [Grafana](../../_tags/Grafana.md)

---

# Установка на Ubuntu

Официальный сайт: https://grafana.com

Для установки надо выполнить следующие команды:

```shell
wget https://dl.grafana.com/oss/release/grafana_6.4.4_amd64.deb
sudo dpkg -i grafana_6.4.4_amd64.deb
sudo service grafana-server start
```

Установка datasource для ClickHouse:

```shell
sudo grafana-cli plugins install vertamedia-clickhouse-datasource
```
