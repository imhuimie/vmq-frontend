# vmq-frontend

VMQ 的 Vue 3 + TypeScript 前端，适配 `../vmq` Go 后端。

## 适配内容

- 默认开发代理后端改为 `http://localhost:8080`。
- 项目包名改为 `vmq-frontend`，系统标题改为 `VMQ`。
- 登录使用 VMQ Bearer Token：`accessToken` + `refreshToken`。
- 请求体默认使用 `application/x-www-form-urlencoded`，兼容 VMQ 的 `ParseForm` 参数解析。
- 订单、二维码分页结果统一归一化为 `{ items, total }`。
- 订单补单入口使用 VMQ 的 `/api/order/reissue/:id` 接口。

## 本地开发

先启动后端：

```bash
cd ../vmq
go run -tags mysql ./cmd/server
```

再启动前端：

```bash
npm install
npm run dev
```

默认前端端口：`3006`，默认后端端口：`8080`。

## 构建

```bash
npm run build
```

## 环境变量

核心变量见 `.env`：

```env
VITE_PORT=3006
VITE_API_URL=/
VITE_VMQ_API_URL=/api/
VITE_WITH_CREDENTIALS=false
```

生产同域部署时保持 `/api/` 相对路径即可；跨域部署时将 `VITE_API_URL` 和 `VITE_VMQ_API_URL` 改为后端完整地址，并在 VMQ 后端配置 `VMQ_ALLOWED_ORIGINS`。前端默认使用 `Authorization: Bearer <accessToken>`，不依赖跨站 Cookie。

旧静态页面兼容策略：旧后端中的 `admin/*.html`、`api.html`、`main.html`、`example/*` 不再复制到新项目，后端 `vmq` 会按 `VMQ_FRONTEND_BASE_URL` 跳转到对应新版前端路由。监控端 APK 建议放置到 `vmq/public/v.apk` 或由下载按钮跳转到发布页。
