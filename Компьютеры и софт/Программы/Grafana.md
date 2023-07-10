# Grafana

Grafana это серверное приложение, позволяющее запустить свой сервис с
дашбордами. Умеет работать со множеством баз данных и рисует красивые графики.



- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ Программы }}](../../__tags/programmy.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ системное администрирование }}](../../__tags/sistemnoe_administrirovanie.md)
- [{{ Grafana }}](../../__tags/grafana.md)


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
