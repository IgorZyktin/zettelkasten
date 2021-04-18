# Полезные команды Grafana

Grafana это серверное приложение, позволяющее запустить 
свой сервис с дашбордами. Умеет работать со множеством баз данных и рисует
красивые графики.

[grafana](./meta_grafana.md)

[базы данных](./meta_bazy_dannyh.md)

[визуализация данных](./meta_vizualizatsiya_dannyh.md)

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
