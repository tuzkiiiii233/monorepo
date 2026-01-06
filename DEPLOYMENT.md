# 部署配置文档

## 项目信息

- **项目名称**: monorepo-demo
- **项目类型**: Next.js 14 Monorepo
- **包管理器**: pnpm 10.27.0
- **Node.js 版本要求**: >= 18.17.0

## 项目结构

```
monorepo-demo/
├── packages/
│   ├── common-utils/      # 共享工具库
│   ├── app-a/             # 应用 A (端口 3000)
│   └── app-b/             # 应用 B (端口 3001)
└── package.json
```

## 环境要求

### 必需软件

1. **Node.js**: >= 18.17.0 (推荐使用 LTS 版本)
2. **pnpm**: 10.27.0 或更高版本

### 安装 pnpm

```bash
# 使用 npm 安装
npm install -g pnpm@10.27.0

# 或使用 curl (Linux/macOS)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 验证安装
pnpm --version
```

## 部署步骤

### 1. 克隆代码

```bash
git clone <repository-url>
cd monorepo-demo
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建项目

```bash
# 构建所有应用
pnpm build

# 或单独构建
pnpm --filter app-a build
pnpm --filter app-b build
```

### 4. 启动应用

#### 开发环境

```bash
# 启动所有应用（开发模式）
pnpm dev:all

# 或单独启动
pnpm dev:a  # app-a: http://localhost:3000
pnpm dev:b  # app-b: http://localhost:3001
```

#### 生产环境

```bash
# 启动 app-a (端口 3000)
cd packages/app-a
pnpm start

# 启动 app-b (端口 3001)
cd packages/app-b
pnpm start
```

## 生产环境配置

### 使用 PM2 管理进程

1. **安装 PM2**

```bash
npm install -g pm2
```

2. **创建 PM2 配置文件** (已包含在项目中: `ecosystem.config.js`)

3. **启动应用**

```bash
pm2 start ecosystem.config.js
```

4. **常用 PM2 命令**

```bash
pm2 list              # 查看所有进程
pm2 logs              # 查看日志
pm2 restart all       # 重启所有应用
pm2 stop all          # 停止所有应用
pm2 delete all        # 删除所有进程
```

### 使用 Docker 部署

参考项目中的 `Dockerfile` 和 `docker-compose.yml` 文件。

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

## 端口配置

- **app-a**: 3000
- **app-b**: 3001

如需修改端口，编辑对应应用的 `package.json` 中的启动脚本。

## 环境变量

如果需要配置环境变量，在各应用目录下创建 `.env.local` 文件：

```bash
# packages/app-a/.env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 反向代理配置 (Nginx)

```nginx
# app-a
server {
    listen 80;
    server_name app-a.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# app-b
server {
    listen 80;
    server_name app-b.example.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 监控和日志

### 日志位置

- PM2 日志: `~/.pm2/logs/`
- 应用日志: 标准输出 (stdout/stderr)

### 健康检查

```bash
# 检查应用是否运行
curl http://localhost:3000
curl http://localhost:3001
```

## 故障排查

### 常见问题

1. **端口被占用**

   ```bash
   # 查找占用端口的进程
   lsof -i :3000
   # 或
   netstat -tulpn | grep 3000
   ```

2. **依赖安装失败**

   ```bash
   # 清理缓存重新安装
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

3. **构建失败**

   ```bash
   # 检查 Node.js 版本
   node --version

   # 清理构建缓存
   rm -rf packages/*/. next
   pnpm build
   ```

## 性能优化建议

1. 启用 Next.js 缓存
2. 配置 CDN 加速静态资源
3. 使用 PM2 cluster 模式提高并发能力
4. 配置 Nginx 缓存和压缩

## 联系方式

如有问题，请联系开发团队。
