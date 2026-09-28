import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const DIARY_DIR = path.join(WORKSPACE_ROOT, '02-成型日记', '每日备战日记');

const API_BASE = 'https://creator-api-worker.yaemra531.workers.dev';

async function fetchFromD1() {
  console.log(`[Sync] 正在从云端 D1 数据库 (${API_BASE}) 获取打卡日记...`);
  const res = await fetch(`${API_BASE}/api/challenge`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.logs || [];
}

function sanitizeFilename(name) {
  return name
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .replace(/：/g, '-')
    .replace(/，/g, '-')
    .substring(0, 30);
}

function formatDiaryMarkdown(log) {
  const dayStr = String(log.day).padStart(2, '0');
  const isDual = log.isDual || log.type?.includes('双轨');
  
  let md = `---
day: ${log.day}
date: ${log.date}
type: "${log.type || '📘 雅思实操通关'}"
status: "${log.status || 'completed'}"
created_at: "${log.createdAt || ''}"
updated_at: "${log.updatedAt || ''}"
---

# 雅思备考日记 · Day ${dayStr}｜${log.title}

- **打卡日期**：${log.date}
- **挑战天数**：Day ${dayStr} / 21
- **打卡类型**：${log.type || '📘 雅思实操通关'}
- **云端状态**：已同步至 Cloudflare D1

---

## 📘 雅思实战卡点与记录

${(log.ieltsNote || log.note || '').trim()}
`;

  if (isDual && log.thoughtNote) {
    md += `
---

## ✨ 灵感速记与顿悟

${log.thoughtNote.trim()}
`;
  }

  return md;
}

async function sync() {
  if (!fs.existsSync(DIARY_DIR)) {
    fs.mkdirSync(DIARY_DIR, { recursive: true });
  }

  const logs = await fetchFromD1();
  console.log(`[Sync] 获取到 ${logs.length} 条打卡日记。开始写入本地库...`);

  const indexList = [];

  for (const log of logs) {
    const dayStr = String(log.day).padStart(2, '0');
    const safeTitle = sanitizeFilename(log.title || '雅思卡点');
    const filename = `Day-${dayStr}-${log.date}-${safeTitle}.md`;
    const filepath = path.join(DIARY_DIR, filename);

    const content = formatDiaryMarkdown(log);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`  ✅ 写入: ${filename}`);

    indexList.push({
      day: log.day,
      dayStr,
      date: log.date,
      type: log.type || '📘 雅思实操通关',
      title: log.title,
      filename
    });
  }

  // 排序：按天数升序
  indexList.sort((a, b) => a.day - b.day);

  // 生成索引 README.md
  let readme = `# 📖 雅思每日备战日记库 (Daily IELTS Field Codex)

> **“做就是做了，卡就是卡了。不粉饰太平，把每天的真实卡点与实操动作沉淀入库。”**  
> 本目录为瓦斯雅思实战备考的每日原始日记库，与 Cloudflare D1 云端数据库双向打通，支持自动化定时同步。

---

## 📊 21天打卡挑战进度概览

- **累计有效打卡**：**${indexList.length}** / 21 天
- **通关目标**：30 天内有效打卡满 21 天
- **免死容错**：9 天弹性调整

---

## 🗂️ 每日日记索引列表

| 天数 | 日期 | 打卡类型 | 核心卡点 / 主题 | 对应日记文件 |
| :---: | :---: | :---: | :--- | :--- |
`;

  for (const item of indexList) {
    readme += `| **Day ${item.dayStr}** | \`${item.date}\` | ${item.type} | **${item.title}** | [${item.filename}](./${item.filename}) |\n`;
  }

  readme += `
---

## 🔄 自动化同步说明
- **同步脚本**：\`node scripts/sync-diaries.mjs\`
- **数据源**：Cloudflare D1 (\`https://creator-api-worker.yaemra531.workers.dev/api/challenge\`)
- **同步规则**：云端新增打卡后，执行本脚本将自动拉取并在本目录生成标准格式的 Markdown 日记文件。
`;

  fs.writeFileSync(path.join(DIARY_DIR, 'README.md'), readme, 'utf8');
  console.log(`[Sync] 索引 README.md 更新完毕！同步已完成。`);
}

sync().catch(err => {
  console.error('[Sync] 错误:', err);
  process.exit(1);
});
