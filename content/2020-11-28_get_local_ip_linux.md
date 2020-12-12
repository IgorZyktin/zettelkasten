# Узнать IP адреса в локальной сети linux

Заметка позволяет узнать какой IP адрес присвоен нашей машине в локальной сети,
а также узнать какие ещё адреса в этой сети представлены.

---

[linux](./meta_linux.md)

[системное администрирование](./meta_sistemnoe_administrirovanie.md)

Удобно для этого использовать программу nmap:
```
sudo apt-get install nmap
```

Дальше надо понять маску сети, в которой мы находимся. 
Это делается утилитой **ifconfig**, смотреть надо **eth0** для проводного интернета и **wlan0** для wi-fi.
Хотя имена могут быть и другие.
```
ifconfig
```
```
enp1s0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 00:26:6c:cc:25:70  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Локальная петля (Loopback))
        RX packets 6942  bytes 991230 (991.2 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 6942  bytes 991230 (991.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlp2s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        **inet 192.168.0.13  netmask 255.255.255.0  broadcast 192.168.0.255**
        inet6 fe80::431e:edff:522d:ee4b  prefixlen 64  scopeid 0x20<link>
        ether d0:df:9a:35:d9:9c  txqueuelen 1000  (Ethernet)
        RX packets 195053  bytes 210354484 (210.3 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 135617  bytes 25264540 (25.2 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

```

Как вариант, в Ubuntu можно использовать другую команду:
```
ip -a
```
```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp1s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether 00:26:6c:cc:25:70 brd ff:ff:ff:ff:ff:ff
3: wlp2s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether d0:df:9a:35:d9:9c brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.13/24 brd 192.168.0.255 scope global dynamic noprefixroute wlp2s0
       valid_lft 85857sec preferred_lft 85857sec
    inet6 fe80::431e:edff:522d:ee4b/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```

Зная маску сети, мы можем начать сканировать её адреса:
```
sudo nmap -sn 192.168.0.0/24
```
```
Starting Nmap 7.60 ( https://nmap.org ) at 2020-01-02 20:22 MSK
Nmap scan report for _gateway (192.168.0.1)
Host is up (0.0034s latency).
MAC Address: F8:AB:05:B6:6E:06 (Sagemcom Broadband SAS)
Nmap scan report for 192.168.0.11
Host is up (0.14s latency).
MAC Address: 78:02:F8:20:98:0A (Xiaomi Communications)
Nmap scan report for 192.168.0.15
Host is up (0.21s latency).
MAC Address: EC:0E:C4:63:4C:17 (Hon Hai Precision Ind.)
Nmap scan report for Toshiba (192.168.0.13)
Host is up.
Nmap done: 256 IP addresses (4 hosts up) scanned in 3.43 seconds
```
