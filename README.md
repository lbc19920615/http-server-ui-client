## 介绍

http-server 自带的html页面不方便使用 通过对信息的优化方便在当前页面读取内容

## 依赖

[http-server](https://www.npmjs.com/package/http-server)

## 使用

1. 开启资源服务

```bash
 http-server --p 7100 --cors 
```

2. 开启服务

```bash
pm2 start pm2.json
```
