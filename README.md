
# 🎈 《宝贝趣学堂》GitHub 部署与使用手册

由于 Gitee Pages 服务调整，本项目现推荐使用 **GitHub Pages** 进行部署。GitHub 更加稳定，且无需身份证实名认证。

## 📁 1. 准备工作 (文件核对)
上传到 GitHub 仓库时，请确保文件结构如下：
```text
baby-study/
├── index.html
├── index.tsx
├── App.tsx
├── sw.js
├── manifest.json
├── types.ts
├── constants.ts
└── services/
    └── geminiService.ts
```

## 🛠️ 2. GitHub Pages 部署流程 (最快 3 分钟)

1. **创建仓库**：
   - 登录 GitHub，点击右上角 `+` -> `New repository`。
   - 名字填 `baby-study`，设为 **Public**，点 `Create repository`。

2. **上传文件**：
   - 在新仓库页面点击 `uploading an existing file`。
   - 将电脑上的所有文件（和 services 文件夹）拖进去。
   - 点击底部的绿色按钮 `Commit changes`。

3. **开启服务**：
   - 点击仓库顶部的 **Settings** (设置)。
   - 在左侧菜单找到 **Pages**。
   - 在 **Build and deployment** 下方的 **Branch** 处，选择 `main` (或 `master`)，点击右边的 **Save**。

4. **获取地址**：
   - 稍等 1 分钟刷新页面，顶部会出现一行字：`Your site is live at ...`。
   - 点击那个网址，就可以在手机上打开了！

---

## 👨‍👩‍👧 3. 亲子互动：高效利用这 10 分钟

1. **同步学习**：在手机浏览器打开网址后，点击底部的“分享”图标 -> **“添加到主屏幕”**，它就会像真 App 一样出现在手机桌面。
2. **难点复习**：每天挑战结束后，去“家长中心”查看宝宝答错频率最高的字，今晚睡觉前跟她再念两遍。
3. **奖励机制**：能量条满后的全屏纸屑（Confetti）特效非常受小宝宝欢迎，可以告诉她这是“勤奋小星星”。

---
祝您和宝贝拥有愉快的 10 分钟亲子互动时光！
