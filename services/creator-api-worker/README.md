# ⚡ Creator API Worker (Cloudflare D1 云端实时网关)

打破浏览器 `localStorage` 限制，为博客随笔（21天打卡、灵感速记、点赞）与雅思日记提供统一的真云端无服务器数据库支持。

---

## 🚀 3 步极速上线指南

### 步骤 1：创建云端 D1 数据库
```bash
# 登录 Cloudflare（首次使用需执行）
npx wrangler login

# 创建 D1 数据库实例
npx wrangler d1 create creator-hub-db
```
执行后终端会输出类似：
```toml
[[d1_databases]]
binding = "DB"
database_name = "creator-hub-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```
将上面输出的 `database_id` 复制并替换到 `wrangler.toml` 中。

---

### 步骤 2：初始化远程数据库表结构
```bash
npx wrangler d1 execute creator-hub-db --remote --file=./schema.sql
```
- 会自动创建 `challenge_logs`（打卡表）、`thoughts`（灵感表）、`target_likes`（点赞表）并写入 Day 01 出厂基底数据。

---

### 步骤 3：一键部署 API 网关
```bash
npx wrangler deploy
```
部署成功后，Cloudflare 会生成一个专属网关地址，例如：
```text
https://creator-api-worker.<你的用户名>.workers.dev
```

---

## 🔗 前端对接生效

在 `personal-blog` 根目录创建 `.env`（或 `.env.production`）：
```env
VITE_API_URL=https://creator-api-worker.<你的用户名>.workers.dev
```
重新执行 `npm run build`，你的博客随笔就会**立刻从纯本地升级为全网真云端双向实时同步**！
- 手机端打开直接能看
- 陌生读者打开自动显示最新数据
- 离线/飞行模式自动降级为本地缓存，联网自动恢复
