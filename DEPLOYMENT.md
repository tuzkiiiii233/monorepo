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
pnpm build:a  # 构建 app-a
pnpm build:b  # 构建 app-b
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

# 或使用 nohup 后台运行
nohup pnpm start > app-a.log 2>&1 &
```

## Jenkins CI/CD 配置

### 增量构建和部署

每个应用独立的 Jenkins Job 配置：

#### app-a 的 Jenkinsfile

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    extensions: [[$class: 'CloneOption', depth: 10]]
                ])
            }
        }

        stage('Check Changes') {
            steps {
                script {
                    def hasChanges = sh(
                        script: "git diff --name-only HEAD^ HEAD | grep -qE 'packages/(app-a|common-utils)'",
                        returnStatus: true
                    ) == 0

                    if (!hasChanges) {
                        echo "⏭️  app-a 没有变更，跳过构建"
                        currentBuild.result = 'NOT_BUILT'
                        error('No changes')
                    }
                }
            }
        }

        stage('Install & Build') {
            steps {
                sh 'pnpm install'
                sh 'pnpm --filter app-a build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    cd packages/app-a
                    # 部署到服务器
                    # 例如: rsync -avz .next/ user@server:/path/to/app-a/
                    # 或: scp -r .next user@server:/path/to/app-a/
                '''
            }
        }
    }
}
```

#### app-b 的 Jenkinsfile

```groovy
// 同上，只需将 app-a 替换为 app-b
```

### Shell 脚本方式（更简单）

```bash
#!/bin/bash

# 检测变更
if git diff --name-only HEAD^ HEAD | grep -qE "packages/(app-a|common-utils)"; then
    echo "✅ 构建 app-a"
    pnpm install
    pnpm --filter app-a build

    # 部署
    cd packages/app-a
    # 你的部署命令
else
    echo "⏭️  跳过 app-a"
    exit 0
fi
```

## 端口配置

- **app-a**: 3000
- **app-b**: 3001

如需修改端口，编辑对应应用的 `package.json` 中的启动脚本：

```json
{
  "scripts": {
    "dev": "next dev -p 3002",
    "start": "next start -p 3002"
  }
}
```

## 环境变量

在各应用目录下创建 `.env.local` 文件：

```bash
# packages/app-a/.env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NODE_ENV=production
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

## 健康检查

```bash
# 检查应用是否运行
curl http://localhost:3000
curl http://localhost:3001

# 检查进程
ps aux | grep "next start"
```

## 故障排查

### 常见问题

1. **端口被占用**

   ```bash
   # 查找占用端口的进程
   lsof -i :3000
   # 或
   netstat -tulpn | grep 3000

   # 杀死进程
   kill -9 <PID>
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
   rm -rf packages/*/.next
   pnpm build
   ```

4. **Jenkins git diff 报错**

   ```bash
   # 确保 Jenkins 拉取了足够的历史
   # 在 Jenkinsfile 中配置:
   checkout([
       $class: 'GitSCM',
       extensions: [[$class: 'CloneOption', depth: 10]]
   ])

   # 或使用其他比较方式
   git diff --name-only origin/main HEAD
   ```

## 性能优化建议

1. 启用 Next.js 生产模式缓存
2. 配置 CDN 加速静态资源
3. 配置 Nginx 缓存和 gzip 压缩
4. 使用进程管理工具（如 PM2）实现自动重启

## 联系方式

如有问题，请联系开发团队。
