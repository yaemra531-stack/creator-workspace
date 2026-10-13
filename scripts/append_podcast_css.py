import os

CSS_TO_APPEND = '''
/* ============================================================
   夜读智库排版与睡前心智滑梯升级 (V2 Readability & Typography)
   ============================================================ */

/* 核心切片：睡前心智滑梯卡片 */
.podcast-insight-slice-card {
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.22);
  border-left: 4px solid #D97706;
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
}

[data-theme='dark'] .podcast-insight-slice-card {
  background: rgba(245, 158, 11, 0.07);
  border-color: rgba(245, 158, 11, 0.28);
  border-left-color: #FBBF24;
}

.podcast-slice-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.podcast-slice-icon {
  color: #D97706;
}

[data-theme='dark'] .podcast-slice-icon {
  color: #FBBF24;
}

.podcast-slice-label {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.podcast-slice-hint {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.podcast-slice-quote {
  font-family: var(--font-serif);
  font-size: 1.02rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin: 0;
  font-style: normal;
  letter-spacing: 0.01em;
}

/* 篇目模式标签（独白漫谈 vs 深度对谈） */
.podcast-item-mode-badge {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: var(--bg-tertiary);
  padding: 0.05rem 0.35rem;
  border-radius: var(--radius-sm);
}

.podcast-article-mode-tag {
  color: var(--accent-primary);
  background: var(--accent-light);
  font-weight: 600;
  font-size: 0.78rem;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
}

[data-theme='dark'] .podcast-article-mode-tag {
  background: rgba(154, 52, 18, 0.25);
  color: #FDBA74;
}

/* 夜读字号档位调整 */
.podcast-transcript-body.font-size-sm {
  font-size: 0.95rem;
  line-height: 1.85;
}

.podcast-transcript-body.font-size-base {
  font-size: 1.05rem;
  line-height: 1.95;
}

.podcast-transcript-body.font-size-lg {
  font-size: 1.15rem;
  line-height: 2.05;
}

.podcast-transcript-body.font-size-xl {
  font-size: 1.25rem;
  line-height: 2.15;
}

/* 对话体中的提问引述块排版（去除突兀的巨大引号，改为舒缓提问卡片） */
.podcast-transcript-body blockquote.editorial-quote {
  margin: 1.75rem 0 1.25rem 0;
  padding: 1rem 1.25rem;
  background: var(--bg-secondary);
  border-left: 3px solid var(--accent-primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  display: block;
}

.podcast-transcript-body blockquote.editorial-quote .quote-ornament {
  display: none;
}

.podcast-transcript-body blockquote.editorial-quote .quote-content {
  font-family: var(--font-sans);
  font-size: 0.96rem;
  line-height: 1.75;
  color: var(--text-primary);
  font-weight: 500;
}

.podcast-transcript-body blockquote.editorial-quote p {
  margin: 0;
}

/* 沉浸专注模式（隐藏目录，居中宽屏） */
.podcast-workspace.focus-reading {
  grid-template-columns: 1fr;
}

.podcast-workspace.focus-reading .podcast-sidebar {
  display: none;
}

.podcast-workspace.focus-reading .podcast-main-reader {
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
}

.podcast-action-btn.font-btn {
  font-family: var(--font-mono);
  font-size: 0.78rem;
}
'''

target_path = '/Users/curry/Projects/personal-blog/src/App.css'
with open(target_path, 'a', encoding='utf-8') as f:
    f.write(CSS_TO_APPEND)

print(f"Appended new CSS to {target_path} successfully.")
