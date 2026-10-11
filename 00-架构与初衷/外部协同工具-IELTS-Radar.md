# 外部协同工具 · IELTS Radar 雅思内容侦察日志

> **生态定位**：瓦斯备考雅思的高维生态情报与认知输入中枢。  
> **设计语言**：Apple × Notion × Linear 风格个人研究工作台（极简克制、阅读优先、白底精致排版）。  
> **部署状态**：已正式全量部署至 GitHub Pages 并作为首选子模块纳管。

---

## 📌 项目基本信息

- **项目名称**：IELTS Radar｜我的 AI 雅思侦察日志 (`ielts-radar`)
- **源码物理路径**：`/Users/curry/Projects/creator-workspace/ielts-radar`
- **GitHub 开源仓库**：[`yaemra531-stack/ielts-radar`](https://github.com/yaemra531-stack/ielts-radar)
- **线上部署网址**：[https://yaemra531-stack.github.io/ielts-radar/](https://yaemra531-stack.github.io/ielts-radar/)
- **本地常驻服务**：`http://localhost:3000`（执行 `npm run radar` 或 `bash service.sh start`）
- **技术栈**：原生 HTML / CSS / Vanilla JavaScript + 原生 Node.js 本地持久化服务，支持 GitHub Pages 纯前端无缝部署与 LocalStorage + 磁盘双持久化。
- **状态日期**：2026-10-11，V3.0 视觉重构全量通过测试并成功上线 GitHub Pages。

---

## 🎯 三大核心研究目标 V2.0

整个系统的阅读与沉淀围绕三个本质问题展开：

1. **① 发现：最近有什么值得关注？**
   - 最近 30 天，雅思领域出现了哪些受到关注的内容？
2. **② 理解：这些内容究竟在讲什么？**
   - 作者讨论了什么问题？提供了什么观点、信息或方法？
3. **③ 价值：对读者有什么帮助？**
   - 解决了读者什么问题？满足了什么需求？读者看完能获得什么？（不编造，无足够信息则如实留空）

---

## 🤖 双 Agent 侦察分工

- **🔴 WorkBuddy**：每天在小红书、抖音筛选 5 篇中文生态高互动干货。
- **🔵 Muse**：每天在 YouTube、Reddit (r/IELTS)、X 筛选 5 篇海外高分与考官视角内容。
- **每日归并**：系统自动将两批日报汇聚为 **当天正好 10 篇精选**，单列纵向阅读流呈现。

---

## 🛠️ 运维与部署规范

1. **线上免运维**：
   - 每次推送到 `yaemra531-stack/ielts-radar` 的 `main` 分支，GitHub Actions 自动化流水线（`.github/workflows/deploy.yml`）会在 20 秒内自动构建并发布至 GitHub Pages。
2. **本地常驻运行**：
   - 在工作区根目录下执行 `npm run radar` 即可一键拉起本地后台 Node.js 服务。
   - 数据安全存储于 `ielts-radar/data/radar-store.json`，带时间戳自动轮转备份。
