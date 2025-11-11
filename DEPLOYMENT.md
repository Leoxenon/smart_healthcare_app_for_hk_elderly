# 部署指南

## 方案一：Vercel部署（推荐）

### 步骤：
1. **注册Vercel账户**：访问 [vercel.com](https://vercel.com) 注册账户
2. **重新启动PowerShell**，然后运行：
   ```powershell
   vercel login
   ```
3. **初始化项目**：
   ```powershell
   vercel init
   ```
4. **部署**：
   ```powershell
   vercel --prod
   ```

### 优势：
- 免费托管
- 自动SSL证书
- 全球CDN加速
- 简单的CI/CD集成

---

## 方案二：Netlify部署

### 步骤：
1. **注册Netlify账户**：访问 [netlify.com](https://netlify.com) 注册
2. **构建项目**：
   ```powershell
   npm run build
   ```
3. **拖拽build文件夹到Netlify Deploy页面**

### 优势：
- 免费托管
- 简单拖拽部署
- 自动SSL

---

## 方案三：GitHub Pages

### 步骤：
1. **创建GitHub仓库**并推送代码
2. **安装gh-pages**：
   ```powershell
   npm install --save-dev gh-pages
   ```
3. **修改package.json**（已为您添加）
4. **部署**：
   ```powershell
   npm run deploy
   ```

---

## 方案四：Firebase Hosting

### 步骤：
1. **安装Firebase CLI**：
   ```powershell
   npm install -g firebase-tools
   ```
2. **登录并初始化**：
   ```powershell
   firebase login
   firebase init hosting
   ```
3. **构建并部署**：
   ```powershell
   npm run build
   firebase deploy
   ```

---

## 推荐工作流程

1. **本地开发**：`npm run dev`
2. **测试**：确保功能正常
3. **构建**：`npm run build`
4. **部署**：使用上述任一方案
5. **更新**：修改代码后重复步骤3-4

---

## 注意事项

- 部署后的URL将完全独立于Figma发布的URL
- 您可以使用自定义域名
- 建议使用Git进行版本控制
- 每次代码修改后需要重新部署才能看到更新
