
# 🎈 《宝贝趣学堂》GitHub 部署与使用手册

由于 Gitee Pages 服务调整，本项目现推荐使用 **GitHub Pages** 进行部署。GitHub 更加稳定，且无需身份证实名认证。

## 📁 1. 准备工作 (文件核对)
上传到 GitHub 仓库时，请确保文件结构如下：
```text
baby-fun-learning/
├── index.html          # 主应用文件（已优化）
├── sw.js               # Service Worker（已优化）
├── manifest.json       # PWA配置（已优化）
├── .nojekyll          # 防止Jekyll处理
├── .github/
│   └── workflows/
│       └── deploy.yml   # 自动部署配置
├── package.json        # 项目配置
├── vite.config.ts      # Vite配置
├── tsconfig.json       # TypeScript配置
├── metadata.json       # 元数据
└── README.md           # 本文件
```

## 🛠️ 2. GitHub Pages 部署流程 (最快 3 分钟)

### 方法一：自动部署（推荐）

1. **Fork 此仓库**：
   - 点击右上角 `Fork` 按钮，将项目复制到你的账户下。

2. **开启 GitHub Pages**：
   - 在你的仓库中点击 **Settings** 标签。
   - 在左侧菜单找到 **Pages**。
   - 在 **Build and deployment** 下拉菜单中选择 `GitHub Actions`。
   - 点击 **Save**。

3. **等待部署完成**：
   - 点击 **Actions** 标签查看部署进度。
   - 部署完成后，会在 Pages 设置页面显示访问地址。

### 方法二：手动部署

1. **创建仓库**：
   - 登录 GitHub，点击右上角 `+` -> `New repository`。
   - 名字填 `baby-fun-learning`，设为 **Public**，点 `Create repository`。

2. **上传文件**：
   - 在新仓库页面点击 `uploading an existing file`。
   - 将优化后的所有文件拖进去（包括 `.nojekyll` 文件）。
   - 点击底部的绿色按钮 `Commit changes`。

3. **开启服务**：
   - 点击仓库顶部的 **Settings** (设置)。
   - 在左侧菜单找到 **Pages**。
   - 在 **Build and deployment** 下方的 **Branch** 处，选择 `main` (或 `master`)，点击右边的 **Save**。

4. **获取地址**：
   - 稍等 1 分钟刷新页面，顶部会出现一行字：`Your site is live at ...`。
   - 点击那个网址，就可以在手机上打开了！

---

## 🛠️ 3. 本地开发与测试

如果您想修改或测试项目：

```bash
# 安装依赖（如果需要）
npm install

# 本地开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 👨‍👩‍👧 4. 亲子互动：高效利用这 10 分钟

1. **同步学习**：在手机浏览器打开网址后，点击底部的"分享"图标 -> **"添加到主屏幕"**，它就会像真 App 一样出现在手机桌面。
2. **难点复习**：每天挑战结束后，去"家长中心"查看宝宝答错频率最高的字，今晚睡觉前跟她再念两遍。
3. **奖励机制**：能量条满后的全屏纸屑（Confetti）特效非常受小宝宝欢迎，可以告诉她这是"勤奋小星星"。

---

## 🔧 5. 技术优化说明

本次优化包含以下改进：

- ✅ **路径兼容性**：支持GitHub Pages子路径部署
- ✅ **PWA优化**：改进Service Worker，支持离线访问
- ✅ **自动化部署**：添加GitHub Actions配置
- ✅ **静态资源**：移除绝对路径引用，确保CDN正常加载
- ✅ **缓存策略**：优化Service Worker缓存策略
- ✅ **文件清理**：移除未使用的代码文件

---

祝您和宝贝拥有愉快的 10 分钟亲子互动时光！
