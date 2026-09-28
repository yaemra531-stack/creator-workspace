-- ============================================================
-- 瓦斯创作者宇宙 · Cloudflare D1 统一数据库初始化脚本
-- 数据库名称：creator-hub-db
-- ============================================================

-- 1. 21天挑战打卡表
CREATE TABLE IF NOT EXISTS challenge_logs (
    day INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    is_dual INTEGER NOT NULL DEFAULT 0,
    type TEXT NOT NULL DEFAULT '🌟 双轨双满贯',
    title TEXT NOT NULL,
    ielts_title TEXT,
    ielts_note TEXT,
    thought_note TEXT,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. 灵感速记流表 (Thoughts Stream)
CREATE TABLE IF NOT EXISTS thoughts (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    content TEXT NOT NULL,
    location TEXT DEFAULT '书房',
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. 全局点赞表 (文章 + 速记计数，原子更新)
CREATE TABLE IF NOT EXISTS target_likes (
    target_id TEXT PRIMARY KEY,
    likes_count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4. 自定义文章与草稿表
CREATE TABLE IF NOT EXISTS custom_posts (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 预填 Day 01 出厂基底数据
INSERT OR IGNORE INTO challenge_logs (day, date, status, is_dual, type, title, ielts_title, ielts_note, thought_note, note)
VALUES (
    1,
    '2026-09-27',
    'completed',
    1,
    '🌟 双轨双满贯',
    '背单词看例句翻 4 倍的效率卡点',
    '背单词看例句时间翻 4 倍的卡点',
    '单词脱离句子记不住，结合例句背能理解，但时间直接推迟 2~4 倍（原来用 Anki 过 60 词 1 小时搞定，结合例句 2 小时都啃不完），陷入速度与深度的矛盾中。',
    '确立21天公开挑战与容错契约（30天满21天通关，9天免死容错），消除完美主义内耗。先用极简标准释放算力，再在标准之上持续进阶！',
    '【雅思实操】背单词脱离句子记不住，看例句时间推迟2~4倍（60词2小时过不完）。\n【灵感速记】确立21天挑战双轨机制与容错契约，彻底消灭断更负罪感。'
);

INSERT OR IGNORE INTO thoughts (id, date, time, content, location)
VALUES (
    't-20260927-01',
    '2026-09-27',
    '23:55',
    '努力进步，不求完美。确立21天挑战双轨契约与容错机制（30天满21天通关，9天免死容错），消除一切断更内耗！',
    '数字母港 · 瓦斯'
);
