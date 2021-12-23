## 使用

1. 开启资源服务

```bash
 http-server --p 7100 --cors -S -C .\cert.pem
```


2. 开启服务

```bash
pm2 start pm2.json
```
