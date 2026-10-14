# 雅思见闻 · 每日侦察 JSON 标准规范与导入契约

> **核心原则**：  
> **Agent 海量初筛 ➔ 人工精选 10 篇并定写文角度 ➔ 生成标准纯净 JSON ➔ IELTS Radar 一键导入研读**。  
> 坚决不盲从爆款，聚焦真实读者痛点与三问认知沉淀。

---

## 📌 一、系统导入的整体流转链路

```mermaid
graph LR
    A[WorkBuddy / 外部初筛] -->|多源搜集 20+ 篇| B[人工精选 10 篇]
    B -->|提炼写文角度与痛点| C[生成标准 2026-MM-DD.json]
    C -->|网页端点击「📥 导入日报」| D[IELTS Radar 浏览器工作台]
    D -->|沉浸研读 / 勾选今日候选| E[日常创作日记与选题爆发]
```

1. **为什么不让 Agent 直接自动入库？**  
   - 侦察 Agent 擅长广泛检索和数据提取，但它不懂你的个人备考现状（如四级450分）、写文视角与当下关注重点。
   - 必须经过人工精选出的 10 篇，才是你真正愿意投入时间精读的资产。
2. **为什么统一采用标准 JSON 契约？**  
   - 浏览器 `parser.js` 能够 100% 零误差解析全部字段（标题、作者、发布日期、点赞、收藏、三问简介、读者价值、观众真实问题、平台指标）。
   - 避免纯文本格式中因标点、缩进或换行偶发的解析丢失。

---

## 📐 二、JSON 数据结构规范契约

一份符合规范的每日侦察文件（如 `2026-10-14.json`）必须包含以下两级字段：

### 1. 顶层对象字段（Root Object）

| 字段名 | 类型 | 必填 | 说明 | 示例 |
|:---|:---:|:---:|:---|:---|
| `report_date` | String | 是 | 侦察报告归档日期，格式 `YYYY-MM-DD` | `"2026-10-14"` |
| `agent` | String | 是 | 侦察员标识，通常为 `"WorkBuddy"` 或 `"Muse"` | `"WorkBuddy"` |
| `prompt_version` | String | 是 | 提示词版本，当前统一规范为 `"V1.4"` | `"V1.4"` |
| `coverage` | Object | 否 | 平台覆盖配额与特殊情况说明对象 | 见下方示例 |
| `items` | Array | 是 | 当天精选的内容数组，固定为 10 篇（可扩展） | `[{...}, ...]` |

#### `coverage` 平台配额示例：
```json
"coverage": {
  "小红书": { "target": 3, "collected": 8, "reason": "本轮为精选汇总收录8篇" },
  "抖音":   { "target": 2, "collected": 2, "reason": null },
  "X":      { "target": 3, "collected": 0, "reason": "按用户要求本轮不抓取 X" },
  "Reddit": { "target": 2, "collected": 0, "reason": "按用户要求本轮不抓取 Reddit" }
}
```

---

### 2. 单篇条目字段（Item Object）

每个 item 严格围绕「三大核心研究目标 V2.0」组织：

| 字段名 | 类型 | 必填 | 规范说明 |
|:---|:---:|:---:|:---|
| `platform` | String | 是 | 平台名称：`"小红书"`、`"抖音"`、`"X"`、`"Reddit"`、`"YouTube"` |
| `title` | String | 是 | 原始标题（真实原话，不二次润色，不夸张） |
| `author` | String / null | 否 | 作者昵称，无法获取填 `null` |
| `published_at` | String | 是 | 原帖发布日期，格式 `YYYY-MM-DD` |
| `likes` | Number / null | 否 | 点赞数（整数数值），无则填 `null` |
| `favorites` | Number / null | 否 | 收藏数（整数数值），无则填 `null` |
| `score` | Number / null | 否 | Reddit 帖子得分，非 Reddit 固定填 `null` |
| `url` | String | 是 | 原文直接链接（小红书需带 `xsec_token`） |
| `content_id` | String | 否 | 平台的唯一内容 ID（如小红书笔记 ID 或抖音视频数字 ID） |
| `discovery_reason` | String | 是 | **① 发现**：为什么最近值得关注？（发布时间、赞藏比、热点原因） |
| `summary` | String | 是 | **② 理解**：内容究竟讲什么？（80~120字客观提炼，禁止假大空） |
| `reader_value` | String | 是 | **③ 价值**：对读者有什么实际帮助？（30~60字，明确具体受众与痛点，不编造） |
| `comments_checked`| Boolean | 是 | 是否查看了评论区：`true` 或 `false` |
| `audience_questions`| Array | 是 | **观众真实问题**：读者在评论区留下的高频代表性原话（最多3条），无则留空数组 `[]` |

---

## 🌟 三、实测跑通 Benchmark 标杆案例（2026-10-14 完整数据）

以下为 2026-10-14 经过浏览器解析、预览、归档 100% 验证通过的完整标杆代码块，后续任何生成均可直接对照本样例：

```json
{
  "report_date": "2026-10-14",
  "agent": "WorkBuddy",
  "prompt_version": "V1.4",
  "coverage": {
    "小红书": {
      "target": 3,
      "collected": 8,
      "reason": "本轮为跨日已抓取内容的精选汇总，按指定清单收录8篇，超出单日平台配额"
    },
    "抖音": {
      "target": 2,
      "collected": 2,
      "reason": null
    },
    "X": {
      "target": 3,
      "collected": 0,
      "reason": "按用户要求本轮不抓取 X"
    },
    "Reddit": {
      "target": 2,
      "collected": 0,
      "reason": "按用户要求本轮不抓取 Reddit"
    }
  },
  "items": [
    {
      "platform": "小红书",
      "title": "每天2hAI暴力自学雅思速通7分完全指南",
      "author": "yan（ai自学雅思版）",
      "published_at": "2026-09-23",
      "likes": 1084,
      "favorites": 1590,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6ab36e25000000001500ffeb?xsec_token=ABLmRnRp0IWaCtceMyHyut1xlX625oQ4WPtlPhwlVLCIA=&xsec_source=",
      "content_id": "6ab36e25000000001500ffeb",
      "summary": "作者用白板讲解自己两个月、每天2小时，借助AI（Claude Code、Codex）自学雅思从6分提到7.5分的规划。视频按时间轴分章节：第一步做什么、第一个月与第二个月各做什么、如何每天只学2小时快速提分，以及怎样用AI加速辅助学习。",
      "reader_value": "适合想用AI辅助自学、时间有限（每天约2小时）的考生，参考一份从6到7.5的两个月规划与AI使用方式。",
      "comments_checked": true,
      "audience_questions": [
        "WorkBuddy 可以用来这样自学雅思吗？（原话：workbuddy可以嘛）"
      ],
      "discovery_reason": "9月23日发布，收藏1590高于点赞1084；评论区追问WorkBuddy能否同样自学，AI辅助自学正被具体讨论。"
    },
    {
      "platform": "小红书",
      "title": "雅思6.5 7.0 等于文盲",
      "author": "在碎碎念",
      "published_at": "2026-10-03",
      "likes": 4780,
      "favorites": 1069,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6ac04d2f0000000018005683?xsec_token=ABP3Pw3an8b1LqVTRNKZ_F7-FMX14VyLSyLzluEWoETq0=",
      "content_id": "6ac04d2f0000000018005683",
      "summary": "作者在英留学，认为6.5至7.0的学术英语与同堂native speaker差距明显：lecture听不懂、seminar插不上话；并反驳「中国人擅长阅读」的说法，认为阅读上7分必须真的读懂，靠找关键词的技巧会破坏读懂整句的基本功。",
      "reader_value": "给分数已到6.5至7、准备留学上课的考生一个关于分数之外真实能力差距的参照。",
      "comments_checked": true,
      "audience_questions": [],
      "discovery_reason": "10月3日发布，点赞4780、评论1158，是已抓取样本里热度与争议都最高的一篇，讨论集中在阅读是否最难。"
    },
    {
      "platform": "小红书",
      "title": "二本，六级437，雅思8.0",
      "author": "就苹你",
      "published_at": "2026-09-15",
      "likes": 1701,
      "favorites": 1615,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6aa969840000000012000a2c?xsec_token=ABpt-hYdLrMxfy2LsKYEuTCIiNvvyfIE8tvlxk7e58jVs=",
      "content_id": "6aa969840000000012000a2c",
      "summary": "作者自述二本背景、六级仅437分，仍拿到雅思8.0，用图文分阶段讲了各科的备考节奏、资料取舍与踩过的坑，属低起点逆袭的完整经历帖；评论区多在问具体的时间分配与阶段安排。",
      "reader_value": "给基础一般、想参考一条完整逆袭路径的考生提供分科节奏与资料取舍。",
      "comments_checked": true,
      "audience_questions": [],
      "discovery_reason": "9月15日发布，赞1701、藏1615；低起点高分的经历型内容，收藏接近点赞，评论区集中在时间分配。"
    },
    {
      "platform": "小红书",
      "title": "耗时300h 首考雅思8.0（中国人，不卖课）",
      "author": "缠绕我脸上悲伤应该如何卸妆",
      "published_at": "2026-09-15",
      "likes": 5466,
      "favorites": 6284,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6aa969a20000000028034e71?xsec_token=ABpt-hYdLrMxfy2LsKYEuTCNjvwLpNiC7eJjW1YqJqkKk=&xsec_source=",
      "content_id": "6aa969a20000000028034e71",
      "summary": "作者晒出首考8.0成绩（听8.0/读8.5/写7.5/口7.0）并复盘：双非一本、四级524，每天约5小时。听力靠王陆语料库挑错章节反复刷；阅读按看标题、辨题型、划关键词定位三步走，先做填空判断、后做乱序题，限时18–20分钟一篇。",
      "reader_value": "帮备考初期、想自学的考生拿到一份分科的听力与阅读方法和每天5小时的时间安排，减少自己摸索资料和节奏的成本。",
      "comments_checked": true,
      "audience_questions": [
        "可以推荐一下你用的老师吗？（原话：阔不阔以球球你的劳斯啊）",
        "从零开始学、打算12月考试，来得及吗？"
      ],
      "discovery_reason": "9月15日发布，收藏6284高于点赞5466，读者倾向存为方法清单；评论区追问所用老师，属近期偏实用的分科方法复盘。"
    },
    {
      "platform": "小红书",
      "title": "雅思7.5最大感悟：不要太参考xhs。",
      "author": "长眠",
      "published_at": "2026-10-04",
      "likes": 144,
      "favorites": 142,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6abd1fc1000000001b022787?xsec_token=ABGMA3ZR1aBk2hExEk1rQ4S3Vmmb8L5oghWnClJ-PAiPo=&xsec_source=",
      "content_id": "6abd1fc1000000001b022787",
      "summary": "作者自称大陆A类考生均分约5.9、7分以上仅约14%，据此提醒高分帖多不写自身基础、别拿来对标；并称换城市避压分的说法已被官方辟谣。文中也分享自己的做法：碎片时间听BBC、6 Minute English，真题先原速做完再逐句精听答案句。",
      "reader_value": "帮容易被高分帖带偏的考生校准预期，并提供一套以精听真题答案句为主的听力练习方法。",
      "comments_checked": true,
      "audience_questions": [
        "雅思到底怎么学？刚上手听力听不懂，刷了很多还是不会。",
        "首考5.5、两个月时间，要从基础课开始看吗？"
      ],
      "discovery_reason": "10月4日发布，赞藏几乎持平、评论28条偏多；用官方均分数据反驳遍地8分的印象，并回应评论区听力怎么练的追问。"
    },
    {
      "platform": "小红书",
      "title": "雅思机考刷题网站从夯到拉",
      "author": "名字叫张潮",
      "published_at": "2026-09-29",
      "likes": 12000,
      "favorites": 15000,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6abb2c7900000000020116ff?xsec_token=ABCM0SLJ43PlY5aFZme69ODge00b2w6QLD7UUfDAI177c=",
      "content_id": "6abb2c7900000000020116ff",
      "summary": "作者把雅思机考刷题网站按「从夯到拉」分档推荐，逐个讲各站点的题源、机考界面还原度与适用阶段，末尾附上自己常用的组合，围绕机考阅读与听力的练题资源展开，适合准备转机考的考生直接抄作业。",
      "reader_value": "给准备转机考、需要真题模考环境的考生一份分档清单与常用组合。",
      "comments_checked": true,
      "audience_questions": [],
      "discovery_reason": "9月29日发布，平台显示点赞1.2万、收藏1.5万，是已抓取样本中互动最高的机考工具类内容。"
    },
    {
      "platform": "小红书",
      "title": "普通家庭想考雅思的，可以参考我的开智顺序",
      "author": "荼靡(ᇂ_ᇂ|||)",
      "published_at": "2026-09-15",
      "likes": 1774,
      "favorites": 2063,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6aa8c3c7000000000b003dab?xsec_token=ABYhxieMJKYnPFFlQQSZ2n2uq8F-l8x96w97ScXlHfsD4=&xsec_source=",
      "content_id": "6aa8c3c7000000000b003dab",
      "summary": "作者自称普通家庭出身、边上班用约两个月拿下7.0，写给考一次1990元、没有反复考资本的人群，按阶段整理了一份备考顺序，面向基础一般、总分要求不高的人；高赞评论把要点归纳为备考2至3个月为宜、先花一周入门熟悉题型、听力抓信号词加五步精听法。",
      "reader_value": "给预算有限、只能考一两次的在职考生一份分阶段顺序参考，避免盲目拉长战线。",
      "comments_checked": true,
      "audience_questions": [
        "大家都是怎么学的？降价了也还是这么贵，不敢乱来",
        "路然第二遍是和第一遍复习模式一样吗？",
        "有人跟我一样不喜欢机考吗？"
      ],
      "discovery_reason": "9月15日发布，收藏2063高于点赞1774，评论多；面向考一次就要1990元的人群，评论区在追问怎么学、要不要报班。"
    },
    {
      "platform": "小红书",
      "title": "31岁大龄在职，靠雅思7.5重启人生的真实感受",
      "author": "早到的u",
      "published_at": "2026-10-06",
      "likes": 500,
      "favorites": 745,
      "score": null,
      "url": "https://www.xiaohongshu.com/explore/6ac514ad000000001803a81c?xsec_token=ABGXH_-qy3-aQ2HAQJGaLUwmI7PfXH3xEJICLrZklzORE=&xsec_source=",
      "content_id": "6ac514ad000000001803a81c",
      "summary": "一位31岁在职考生记录考出雅思7.5的全过程，写成5256字。她自述双非二本、工作不顺、家里催婚，想靠雅思出国找机会；文中给出资料清单（剑桥真题10–20、雅思王听力语料库、跟Simon学写作、雅思词汇真经），并复盘在职备考的弯路。",
      "reader_value": "给在职、大龄、想通过雅思出国的考生一份真实经历和资料清单，帮助判断在职备考的节奏与心态。",
      "comments_checked": true,
      "audience_questions": [
        "考过雅思后是怎样重启人生的？",
        "你是自学还是报班？我也要留学，想照着这个帖子准备。"
      ],
      "discovery_reason": "10月6日发布，收藏745高于点赞500，评论集中问是否自学、如何重启人生，反映在职大龄考生的真实处境与信息需求。"
    },
    {
      "platform": "抖音",
      "title": "刚开始学雅思就用这三个软件就可以啦",
      "author": "这只卡皮巴拉在学雅思",
      "published_at": "2026-10-09",
      "likes": 2965,
      "favorites": 3153,
      "score": null,
      "url": "https://www.douyin.com/video/7694615280005377521",
      "content_id": "7694615280005377521",
      "summary": "面向雅思入门者的三款实用软件推荐，视频按章节分别介绍talkaa、爱听写、九分学长，说明各自用途与上手方式，结尾强调工具再好也要坚持，适合刚起步、想搭一套轻量学习工具链的自学者。",
      "reader_value": "给刚起步的雅思自学者一套可照配的三件套工具与上手方式，减少试错。",
      "comments_checked": true,
      "audience_questions": [],
      "discovery_reason": "10月9日发布，赞2965、藏3153，收藏高于点赞；入门工具向内容，被存下来照着配工具链。"
    },
    {
      "platform": "抖音",
      "title": "邪修英语 · 英剧推荐片单（按雅思分数段）",
      "author": "超哥留学雅思托福",
      "published_at": "2026-10-08",
      "likes": 5517,
      "favorites": 4763,
      "score": null,
      "url": "https://www.douyin.com/video/7686397298569514283",
      "content_id": "7686397298569514283",
      "summary": "把英剧按雅思分数段分层推荐：3.5分看幼儿启蒙动画靠动作记词、4.5分看生活音慢速剧、5.5分看英音科幻冒险、6.5分看三种语体风格、7.5分看潜台词多的剧，给用英剧磨耳朵提供了有梯度的选片思路。",
      "reader_value": "给想用英剧磨耳朵的考生一套按雅思分数段分层的选片清单，便于对号入座。",
      "comments_checked": true,
      "audience_questions": [],
      "discovery_reason": "10月8日发布，赞5517、藏4763；按分数段选片，把泛英语输入做成能对号入座的清单。"
    }
  ]
}
```

---

## 💡 四、创作者写文角度与个人笔记的留存规范

1. **导入用纯净 JSON**：保持纯净字段，严格不掺入个人草稿笔记，保证数据结构健壮；
2. **写文角度去向**：
   - **素材池留存**：每期在 `01-素材池/YYYY-MM-DD-雅思见闻-选文与写文角度.md` 中保存对照表格，供写作日记直接引用；
   - **卡片内笔记**：在 IELTS Radar 网页端研读时，可随时点击每张卡片的 **「✏️ 编辑 / 记笔记」** 按钮，写下当时的灵感，系统会自动保留并做差异安全保护。
