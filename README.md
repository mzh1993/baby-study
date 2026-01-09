
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

## 🔍 6. 故障排除

如果遇到以下问题，请按以下步骤解决：

### 问题1：控制台出现 404 错误（index.css、index.tsx、App.tsx）

**原因**：浏览器缓存了旧版本的页面，或者Service Worker缓存了旧版本。

**快速解决方法**（按顺序尝试）：

1. **方法一：强制清除缓存（最简单）**：
   - 在浏览器地址栏的URL后面添加 `?clearCache=true`
   - 例如：`https://your-username.github.io/baby-fun-learning/?clearCache=true`
   - 按回车，页面会自动清除所有缓存并重新加载

2. **方法二：硬刷新页面**：
   - Windows: `Ctrl+F5` 或 `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`
   - 如果还不行，尝试 `Ctrl+Shift+Delete` 清除浏览器缓存

3. **方法三：手动清除Service Worker**（如果前两种方法无效）：
   - 打开开发者工具 (F12)
   - 转到 **Application** 标签
   - 点击左侧 **Service Workers**
   - 点击 **Unregister** 注销所有Service Worker
   - 点击左侧 **Cache Storage**，删除所有缓存
   - 刷新页面

4. **方法四：检查GitHub Pages部署状态**：
   - 在GitHub仓库中点击 **Actions** 标签
   - 确认最新的部署工作流已完成
   - 如果失败，检查错误信息并修复

**注意**：新版本的Service Worker会自动拦截这些404请求，所以即使看到这些错误也不会影响功能。但为了彻底解决，建议使用方法一清除缓存。

### 问题2：页面无法加载或显示空白

**解决方法**：

1. 检查GitHub Pages是否已启用（Settings > Pages）
2. 确认代码已推送到 `main` 或 `master` 分支
3. 等待几分钟让GitHub Pages更新（最多可能需要10分钟）
4. 检查URL是否正确（应为 `username.github.io/repo-name/`）

### 问题3：功能不正常

**解决方法**：

1. 打开浏览器开发者工具 (F12)
2. 查看 **Console** 标签中的错误信息
3. 查看 **Network** 标签确认资源是否正常加载
4. 尝试使用无痕模式打开页面，排除扩展程序干扰

---

祝您和宝贝拥有愉快的 10 分钟亲子互动时光！
