# Переадресация HTTP





- [{{ компьютеры }}](../../__tags/kompytery.md)
- [{{ программное обеспечение }}](../../__tags/programmnoe_obespechenie.md)
- [{{ linux }}](../../__tags/linux.md)
- [{{ полезные рецепты }}](../../__tags/poleznye_retsepty.md)
- [{{ системное администрирование }}](../../__tags/sistemnoe_administrirovanie.md)
- [{{ HTTP }}](../../__tags/http.md)


Первоисточник:

## Настройка переадресации

Допустим у нас есть сервер, к которому могу приходить запросы HTTP и HTTPS. На
нём самом никакого web сервера нет, но он может переадресовать их другой
машине.

Допустим мы хотим запросы на 89.208.86.95 отправлять на 10.7.0.2.

```shell
sudo iptables -A PREROUTING -t nat -p tcp -i ens3 --dport 80 -j DNAT --to-destination 10.7.0.2:80  
sudo iptables -A POSTROUTING -t nat -p tcp -d 10.7.0.2 --dport 80 -j MASQUERADE  
sudo iptables -A FORWARD -p tcp -d 10.7.0.2 --dport 80 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT

sudo iptables -A PREROUTING -t nat -p tcp -i ens3 --dport 443 -j DNAT --to-destination 10.7.0.2:443  
sudo iptables -A POSTROUTING -t nat -p tcp -d 10.7.0.2 --dport 443 -j MASQUERADE  
sudo iptables -A FORWARD -p tcp -d 10.7.0.2 --dport 443 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
```

Для сохранения результата после перезагрузки:

```shell
sudo apt-get install iptables-persistent netfilter-persistent
sudo service netfilter-persistent save
```

Загрузка сохранённых правил:

```shell
sudo service netfilter-persistent reload
```
