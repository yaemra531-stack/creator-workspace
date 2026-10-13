import glob
import re
import os
import json

PODCASTS_DIR = '/Users/curry/Projects/personal-blog/src/content/podcasts'
INDEX_FILE = '/Users/curry/Projects/personal-blog/src/content/podcastsIndex.json'

def extract_slice_quote(content, title, column):
    penalties = [
        '喜马拉雅', '新浪微博', '留言', '199块钱', '我是陪我APP', 
        '专栏', '案例分析', '经过两期的分析', '关注他', '大家如果',
        '预告', '听完了', '扫码', '公众号', '第一期', '第二期',
        '微信群', '老朋友孙宇晨', '这一章我们'
    ]
    
    rewards = {
        '边界': 8, '本质': 8, '核心': 8, '权责': 7, '战略': 7,
        '精神自由': 7, '价值观': 6, '独立': 6, '归宿': 6, '妥协': 6,
        '兜底': 6, '风险': 5, '认知': 5, '资产': 5, '负债': 5,
        '复利': 5, '财富自由': 4, '买房': 4, '婚姻': 4, '投资': 4,
        '选择': 4, '不确定性': 4, '规则': 4, '能力': 3
    }
    
    clean = re.sub(r'#.*?\n', '', content)
    clean = re.sub(r'>.*?\n', '', clean)
    clean = re.sub(r'\*\*讲话人\d+\*\*.*?\n', '', clean)
    clean = re.sub(r'🎙️.*?\n', '', clean)
    
    sentences = re.split(r'[。\n！？]', clean)
    candidates = []
    
    for s in sentences:
        s = s.strip()
        if 22 <= len(s) <= 110:
            score = 0
            for p in penalties:
                if p in s:
                    score -= 15
            for kw, pts in rewards.items():
                if kw in s:
                    score += pts
            
            if 35 <= len(s) <= 80:
                score += 3
                
            candidates.append((score, s))
            
    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        best = candidates[0][1]
        best = re.sub(r'[，、；]$', '', best)
        return best + '。'
        
    return f'《{title}》重点探讨了{column}维度的底层逻辑与个人发展抉择。'

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        raw = f.read()

    lines = raw.split('\n')
    speaker_matches = re.findall(r'\*\*讲话人(\d+)\*\*(?:（(\d+:\d+)）)?', raw)
    speakers = sorted(list(set(m[0] for m in speaker_matches)))
    is_multi_speaker = len(speakers) > 1

    cleaned_lines = []
    current_speaker = None
    
    for line in lines:
        stripped = line.strip()
        speaker_match = re.match(r'^\*\*讲话人(\d+)\*\*(?:（(\d+:\d+)）)?', stripped)
        
        if speaker_match:
            sp_num = speaker_match.group(1)
            timestamp = speaker_match.group(2) or ''
            
            if not is_multi_speaker:
                # 独白散文体：直接剔除所有机械的 **讲话人1** 标签
                continue
            else:
                # 对谈体：仅在说话人发生交替切换时打标签
                if sp_num != current_speaker:
                    current_speaker = sp_num
                    time_suffix = f' · {timestamp}' if timestamp else ''
                    
                    if sp_num == '1':
                        sp_name = '孙宇晨'
                        cleaned_lines.append('')
                        cleaned_lines.append(f'🎙️ **{sp_name}**{time_suffix}')
                        cleaned_lines.append('')
                    elif sp_num == '2':
                        sp_name = '提问 / 对话'
                        cleaned_lines.append('')
                        cleaned_lines.append(f'> 💬 **{sp_name}**{time_suffix}')
                    else:
                        sp_name = f'嘉宾 {sp_num}'
                        cleaned_lines.append('')
                        cleaned_lines.append(f'> 💬 **{sp_name}**{time_suffix}')
                else:
                    # 同一说话人连续段落，平滑合并，不打断
                    continue
        else:
            if is_multi_speaker and current_speaker in ['2', '3', '4', '5', '6'] and stripped:
                if not stripped.startswith('>'):
                    cleaned_lines.append(f'> {line}')
                else:
                    cleaned_lines.append(line)
            else:
                cleaned_lines.append(line)

    result = '\n'.join(cleaned_lines)
    result = re.sub(r'\n{3,}', '\n\n', result).strip() + '\n'
    
    text_content = re.sub(r'[\s#>\*`_\[\]\(\)-]', '', result)
    word_count = len(text_content)
    
    mode = 'dialogue' if is_multi_speaker else 'monologue'
    mode_label = '深度对谈' if is_multi_speaker else '独白漫谈'
    read_minutes = max(1, round(word_count / 380))

    return result, mode, mode_label, word_count, read_minutes

def main():
    print(f"Reading index from {INDEX_FILE}...")
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        index_data = json.load(f)

    updated_index = []
    for item in index_data:
        filename = item['filename']
        file_path = os.path.join(PODCASTS_DIR, filename)
        if not os.path.exists(file_path):
            updated_index.append(item)
            continue
        cleaned_content, mode, mode_label, word_count, read_minutes = process_file(file_path)
        slice_quote = extract_slice_quote(cleaned_content, item['title'], item['column'])
        with open(file_path, 'w', encoding='utf-8') as fp:
            fp.write(cleaned_content)
        new_item = {
            **item,
            'wordCount': word_count,
            'mode': mode,
            'modeLabel': mode_label,
            'readTimeMinutes': read_minutes,
            'sliceQuote': slice_quote
        }
        updated_index.append(new_item)

    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(updated_index, f, ensure_ascii=False, indent=2)

    print(f"Successfully reprocessed {len(updated_index)} podcast episodes.")

if __name__ == '__main__':
    main()
