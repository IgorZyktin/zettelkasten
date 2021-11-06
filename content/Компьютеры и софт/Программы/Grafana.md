# Grafana

Grafana это серверное приложение, позволяющее запустить свой сервис с
дашбордами. Умеет работать со множеством баз данных и рисует красивые графики.

---

Теги:

- [Компьютеры](../../_tags/компьютеры.md)
- [Программное обеспечение](../../_tags/программное%20обеспечение.md)
- [Программы](../../_tags/программы.md)
- [Полезные рецепты](../../_tags/полезные%20рецепты.md)
- [Системное администрирование](../../_tags/системное%20администрирование.md)
- [Grafana](../../_tags/grafana.md)

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
