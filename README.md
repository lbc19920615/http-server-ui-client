## 使用

1. 在资源服务生成tls

```bash
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

1. 开启资源服务

```bash
 http-server --p 7100 --cors 
```

2. 开启服务

```bash
pm2 start pm2.json
```
