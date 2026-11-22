/* =========================================================
   簡報影片HTML教學網 — 內容資料
   來源：三個資料夾內的「風格與手法」PDF、各影片 HTML 原始碼
   （章節標題／時間軸／CSS 色票）以及 教材/*.pdf。
   ========================================================= */
window.SITE_DATA = (() => {

  /* ---------- 科目 ---------- */
  const SUBJECTS = {
    civics:    { zh: '公民', en: 'Civics',    color: '#E8456B', pages: 7,
                 title: { zh: '所有權的物權特性', en: 'Ownership as a Real Right' } },
    chemistry: { zh: '化學', en: 'Chemistry', color: '#8A5CF0', pages: 9,
                 title: { zh: '化學式與百分組成', en: 'Chemical Formulas & Percent Composition' } },
    chinese:   { zh: '國文', en: 'Chinese',   color: '#E07A12', pages: 16,
                 title: { zh: '出師表', en: 'Chu Shi Biao (Memorial on the Northern Expedition)' } },
    geography: { zh: '地理', en: 'Geography', color: '#20A85A', pages: 10,
                 title: { zh: '氣候系統', en: 'Climate Systems' } },
    math:      { zh: '數學', en: 'Math',      color: '#1C8FE0', pages: 18,
                 title: { zh: '線性規劃', en: 'Linear Programming' } },
    english:   { zh: '英文', en: 'English',   color: '#E3A100', pages: 24,
                 title: { zh: 'The Lady or the Tiger?', en: 'The Lady or the Tiger?' } }
  };
  const SUBJECT_ORDER = ['civics', 'chemistry', 'chinese', 'geography', 'math', 'english'];

  /* 教材重點（依 Antigravity 成果總覽「核心教學內容」整理） */
  const MATERIAL_POINTS = {
    civics: {
      zh: ['古羅馬「私有財產神聖不可侵犯」原則', '民法的權利主體（人）與客體（物）：動產、不動產與寵物考點', '憲法第 15 條財產權保障與社會契約論', '所有權四大特性：直接支配、保護絕對、排他（含共有）、優先性（一物二賣）', '民法第 767 條三大物上請求權', '物權法定主義；動產交付（§761）與不動產登記（§758）', '騎樓、智慧財產權合理使用：私有財產與公共利益的調和'],
      en: ['Roman principle: private property is sacred and inviolable', 'Subjects (persons) and objects (things) of rights: movables, immovables, pets', 'Constitution Art. 15 property protection & social-contract theory', 'Four traits of ownership: direct control, absolute protection, exclusivity (incl. co-ownership), priority (double sale)', 'Civil Code Art. 767: three real-right claims', 'Numerus clausus; delivery of movables (§761) vs registration of immovables (§758)', 'Arcades and fair use: balancing private property and public interest']
    },
    chemistry: {
      zh: ['四大化學式全景（以醋酸為例）', '實驗式定義與氧化錫計算', '燃燒分析法裝置：過氯酸鎂吸水、氫氧化鈉吸 CO₂，順序不可對調', '維生素 C 實驗式實戰', '分子式換算與美耐皿三聚氰胺食安素養題', '結構式與同分異構物（甲醚 vs 乙醇）', '示性式、官能基與乙酸正丁酯四式整合'],
      en: ['Four kinds of formulas, using acetic acid', 'Empirical formula and the tin-oxide calculation', 'Combustion analysis: Mg(ClO₄)₂ absorbs water, NaOH absorbs CO₂ — order matters', 'Worked example: vitamin C', 'Molecular formula and the melamine food-safety problem', 'Structural formulas and isomers (dimethyl ether vs ethanol)', 'Condensed formulas, functional groups, butyl acetate in four forms']
    },
    chinese: {
      zh: ['題解：漢代上書四體（章、奏、表、議）', '建興五年北伐背景與「十三稱先帝」', '作者生平與孔明三大發明', '危急存亡之秋：廣開言路、秉公執法、親賢遠佞', '文武人事的託付', '由布衣躬耕到二十一年的忠誠', '北伐壯志與首尾呼應的寫作特色'],
      en: ['Background: four kinds of memorials in the Han dynasty', 'The 5th year of Jianxing; “the late emperor” mentioned 13 times', 'Life of Zhuge Liang and his inventions', 'A time of crisis: open counsel, fair law, trust the worthy', 'Entrusting civil and military officials', 'From a commoner farmer to 21 years of loyalty', 'Northern Expedition resolve and the circular structure of the text']
    },
    geography: {
      zh: ['三大氣候要素（氣溫、氣壓與風、降水）的交互關係', '氣溫四大推手：緯度、高度（氣溫遞減率）、海陸比熱、洋流（黑潮）', '氣壓與風：北半球氣旋逆時針輻合上升、反氣旋順時針下沉', '氣象局雨量分級與年降水量變率', '四大降水類型：地形雨與焚風、對流雨、氣旋雨、鋒面雨', '2021 年臺灣中南部缺水素養分析'],
      en: ['How temperature, pressure/wind and precipitation interact', 'Four temperature drivers: latitude, altitude (lapse rate), land–sea contrast, ocean currents (Kuroshio)', 'Pressure & wind: cyclones converge and rise; anticyclones sink', 'Rainfall intensity grades and precipitation variability', 'Four rain types: orographic (and foehn), convective, cyclonic, frontal', 'Case study: Taiwan’s 2021 water shortage']
    },
    math: {
      zh: ['以成績極大化情境引入', '平行直線系：斜率不變、截距平移', '二元一次不等式的半平面與實線／虛線邊界', '可行解區域的定義', '兩種解法：平行線法掃描 vs 頂點法代入', '最低成本實戰：無上界區域求最小值', '坎托羅維奇與四步驟解題流程'],
      en: ['Warm-up: maximising a semester grade', 'Families of parallel lines: same slope, shifting intercept', 'Half-planes of linear inequalities; solid vs dashed boundaries', 'Defining the feasible region', 'Two methods: sweeping a parallel line vs testing vertices', 'Minimum-cost problem on an unbounded region', 'Kantorovich and a four-step solving routine']
    },
    english: {
      zh: ['閱讀策略：四種故事結局（Resolved／Unresolved／Unexpected／Expanded）', '鐵腕國王的雙門審判與禁忌之戀', '公主的兩難與開放式結局', '核心單字與發音陷阱（isolated、justice、accuse、guilt、suspect、subtle）', '文法一：要求與建議的虛擬語氣（原形動詞）', '文法二：(As)…as… 讓步倒裝；贊同／反對的聽力策略'],
      en: ['Reading strategy: four kinds of endings (Resolved / Unresolved / Unexpected / Expanded)', 'The king’s two-door trial and a forbidden love', 'The princess’s dilemma and the open ending', 'Key words and pronunciation traps (isolated, justice, accuse, guilt, suspect, subtle)', 'Grammar 1: the subjunctive after demand/suggest (bare infinitive)', 'Grammar 2: concessive inversion with (as)…as…; listening for agree/disagree']
    }
  };

  /* ---------- 三個 AI 製作工具 ---------- */
  const MAKERS = {
    claude: {
      name: 'Claude Code', color: '#F26B3A', soft: '#FFE3D6', doc: 'docs/claude-styles.pdf',
      tagline: { zh: 'Motion Showreel 引擎・電影感分幕轉場', en: 'Motion Showreel engine · cinematic scene cuts' },
      specs: {
        zh: ['1080×1920 直式畫布，依視窗等比縮放', '旁白：Azure zh-TW-HsiaoChenNeural（中等語速）', '旁白音軌是時間主軸：可拖曳進度條，畫面與字幕同步', '每幕起點對齊配樂節拍（卡在節拍上的剪接）', '旁白出現時配樂自動降低音量（Ducking）', '轉場與出場音效即時合成，可用「音效」按鈕關閉', '燒錄字幕依朗讀進度逐字亮起'],
        en: ['1080×1920 vertical canvas scaled to the window', 'Narration: Azure zh-TW-HsiaoChenNeural (medium rate)', 'Narration track is the master clock: scrub bar keeps visuals and captions in sync', 'Every scene starts on a music beat (cut on the beat)', 'Music ducks automatically under the voice', 'Transition SFX synthesised live, can be muted', 'Burned-in captions light up word by word with the voice']
      }
    },
    codex: {
      name: 'Codex', color: '#0FA38E', soft: '#D3F4EE', doc: 'docs/codex-styles.pdf',
      tagline: { zh: 'Canvas 程式圖解・Python 建置流程', en: 'Canvas diagrams · Python build pipeline' },
      specs: {
        zh: ['單一 HTML 內嵌 MP3 旁白、字幕、動畫與合成配樂，離線可播', '旁白：Azure zh-TW-HsiaoChenNeural，字幕依 Azure 書籤實際時間切分', '畫面以 Canvas 繪製，字幕直接畫在畫面內，另附 SRT', '空白鍵播放／暫停、← → 前後 10 秒、章節選單跳轉', 'Tweaks：配樂開關、旁白音量、降低裝飾動態、字幕開關', '製作原始碼：lesson_*.json（逐幕內容）＋ motion_engine.js ＋ build_lesson.py', '共通手法：標題由左向右遮罩揭示、主圖平移淡入、三次方減速緩動、紙面細點紋理'],
        en: ['One HTML file embeds MP3 narration, captions, animation and synth music; works offline', 'Narration: Azure zh-TW-HsiaoChenNeural; captions timed by real Azure bookmarks', 'Visuals drawn on Canvas; captions painted in-frame, plus an SRT file', 'Space to play/pause, ← → to skip 10 s, chapter menu', 'Tweaks: music on/off, voice volume, reduce motion, captions on/off', 'Source: lesson_*.json (per-scene content) + motion_engine.js + build_lesson.py', 'Shared moves: left-to-right title mask reveal, pan-and-fade hero art, cubic ease-out, fine paper-dot texture']
      }
    },
    antigravity: {
      name: 'Antigravity', color: '#4F5BEA', soft: '#E0E3FF', doc: 'docs/antigravity-styles.pdf',
      tagline: { zh: 'DOM 動態圖文・Tweaks 後製面板', en: 'DOM motion graphics · Tweaks post-FX panel' },
      specs: {
        zh: ['單一自包含 HTML，雙擊即播；540×960（9:16）畫布自動縮放', 'Azure 類神經語音逐句合成 MP3 並以 Base64 內嵌，不外洩金鑰', 'Web Audio API 依各科風格即時合成配樂與重點音效', '畫面底部燒錄高對比字幕與逐句進度條', '章節下拉選單、進度拖曳、配樂獨立開關', 'Tweaks 面板：移軸模糊、光暈、火星粒子、LUT 飽和度、CRT 掃描線、網點強度、音量與字幕大小'],
        en: ['Self-contained HTML, double-click to play; 540×960 (9:16) canvas auto-scaled', 'Azure neural voice synthesised per sentence, embedded as Base64 MP3 — no API key exposed', 'Web Audio API synthesises a subject-specific score and accent SFX', 'High-contrast burned-in captions with per-line progress bar', 'Chapter menu, scrubbing, separate music toggle', 'Tweaks panel: tilt-shift blur, bloom, embers, LUT saturation, CRT scanlines, halftone, volumes, caption size']
      }
    }
  };
  const MAKER_ORDER = ['claude', 'codex', 'antigravity'];

  /* ---------- 七種視覺風格 ---------- */
  const STYLES = {
    anthropomorphic: { zh: '擬人動物與物品風', en: 'Anthropomorphic', color: '#FF6B5B',
      cue: { zh: '會眨眼的物品角色、粗黑描邊貼紙卡、硬陰影', en: 'Blinking object characters, bold-outlined sticker cards, hard shadows' } },
    stylized3d:      { zh: '3D 卡通動畫風', en: 'Stylized 3D', color: '#5B5BD6',
      cue: { zh: '柔光攝影棚、塑膠質感、球棍分子模型旋轉', en: 'Soft studio light, plastic materials, rotating ball-and-stick models' } },
    cinematic:       { zh: '電影寫實風', en: 'Cinematic', color: '#B9873A',
      cue: { zh: '信箱遮幅、調色 LUT、漏光、膠片顆粒', en: 'Letterbox, colour LUT, light leaks, film grain' } },
    miniature:       { zh: '微縮模型小人國風', en: 'Miniature / Tilt-shift', color: '#4F9A5B',
      cue: { zh: '桌上模型、移軸模糊、提高飽和、插針小旗', en: 'Tabletop models, tilt-shift blur, boosted saturation, pin flags' } },
    pov:             { zh: '第一人稱沉浸風', en: 'First-person POV', color: '#E09A00',
      cue: { zh: '抬頭顯示介面、REC 時碼、準心、頭部晃動、CRT', en: 'HUD frame, REC timecode, crosshair, head-bob, CRT' } },
    fantasy:         { zh: '奇幻史詩風', en: 'Fantasy / Epic', color: '#8A3FB8',
      cue: { zh: '皇家夜色、神聖光束、金色雕花、浮塵光暈', en: 'Royal night, god rays, gold ornament, floating dust & bloom' } },
    anime:           { zh: '日系動漫風', en: 'Anime', color: '#E8335A',
      cue: { zh: '漫畫分鏡、半色調網點、速度線、斜切擦除', en: 'Comic panels, halftone dots, speed lines, slash wipes' } }
  };

  /* ---------- 手法字典（key → 名稱、分類、可否在實驗室示範） ---------- */
  const CATS = {
    text:       { zh: '文字動畫', en: 'Text animation', color: '#F26B3A' },
    graphic:    { zh: '圖形與資訊', en: 'Graphics & data', color: '#1C8FE0' },
    transition: { zh: '轉場', en: 'Transitions', color: '#8A5CF0' },
    camera:     { zh: '鏡頭運動', en: 'Camera', color: '#20A85A' },
    rhythm:     { zh: '節奏與時間', en: 'Rhythm & timing', color: '#E3A100' },
    post:       { zh: '後製質感', en: 'Post / texture', color: '#E8456B' }
  };
  const CAT_ORDER = ['text', 'graphic', 'transition', 'camera', 'rhythm', 'post'];

  const TECH = {
    // 文字動畫
    'char-pop':     { cat: 'text', zh: '逐字從基線彈出', en: 'Per-character pop from baseline', demo: true },
    'typewriter':   { cat: 'text', zh: '打字機逐字打出', en: 'Typewriter', demo: true },
    'highlighter':  { cat: 'text', zh: '螢光筆劃重點', en: 'Highlighter sweep', demo: true },
    'stamp':        { cat: 'text', zh: '蓋章式彈入', en: 'Stamp-in', demo: true },
    'scramble':     { cat: 'text', zh: '亂碼解碼成字', en: 'Scramble decode', demo: true },
    'particle-text':{ cat: 'text', zh: '粒子聚合成字', en: 'Particles assemble into text', demo: true },
    'weight-shift': { cat: 'text', zh: '字重／字寬變化', en: 'Variable weight / width', demo: true },
    'mask-reveal':  { cat: 'text', zh: '遮罩揭示', en: 'Mask reveal', demo: true },
    'line-up':      { cat: 'text', zh: '逐行上滑淡入', en: 'Line-by-line slide up', demo: true },
    'glow-text':    { cat: 'text', zh: '文字光暈', en: 'Text glow', demo: false },
    // 圖形
    'counter':      { cat: 'graphic', zh: '數字計數器', en: 'Number counter', demo: true },
    'svg-stroke':   { cat: 'graphic', zh: 'SVG 描邊', en: 'SVG stroke draw', demo: true },
    'hand-circle':  { cat: 'graphic', zh: '手繪圈註', en: 'Hand-drawn circle', demo: true },
    'chart-grow':   { cat: 'graphic', zh: '圖表生長', en: 'Growing charts', demo: true },
    'toggle':       { cat: 'graphic', zh: '開關切換', en: 'Switch toggles', demo: false },
    'orbit':        { cat: 'graphic', zh: '3D 分子旋轉／環繞', en: '3D orbit / spin', demo: true },
    'flow-particles':{cat: 'graphic', zh: '流動粒子', en: 'Flowing particles', demo: true },
    'line-sweep':   { cat: 'graphic', zh: '平行線掃描', en: 'Parallel line sweep', demo: true },
    'half-plane':   { cat: 'graphic', zh: '半平面與區域填色', en: 'Half-plane fill', demo: false },
    'door-open':    { cat: 'graphic', zh: '門扇 3D 開啟', en: '3D door opening', demo: true },
    'diagram':      { cat: 'graphic', zh: '關係圖解', en: 'Relationship diagram', demo: false },
    'timeline':     { cat: 'graphic', zh: '時間軸生長', en: 'Growing timeline', demo: false },
    'path-move':    { cat: 'graphic', zh: '沿路徑移動', en: 'Motion along a path', demo: false },
    'pan':          { cat: 'graphic', zh: '物件平移', en: 'Object pan', demo: false },
    'iso':          { cat: 'graphic', zh: '等角 2.5D 舞台', en: 'Isometric 2.5D stage', demo: false },
    'radial-3d':    { cat: 'graphic', zh: '徑向漸層模擬立體', en: 'Radial-gradient faux 3D', demo: false },
    'hud':          { cat: 'graphic', zh: '抬頭顯示介面 HUD', en: 'HUD overlay', demo: true },
    'comic':        { cat: 'graphic', zh: '漫畫分鏡框', en: 'Comic panels', demo: false },
    'vertical-text':{ cat: 'graphic', zh: '卷軸與直排文字', en: 'Scroll & vertical text', demo: false },
    // 轉場
    'shape-mask':   { cat: 'transition', zh: '形狀遮罩轉場', en: 'Shape-mask transition', demo: true },
    'wipe':         { cat: 'transition', zh: '擦除轉場', en: 'Wipe', demo: true },
    'zoom-through': { cat: 'transition', zh: '鏡頭衝進一個點', en: 'Zoom-through', demo: true },
    'liquid':       { cat: 'transition', zh: '液態溶解', en: 'Liquid dissolve', demo: true },
    'page-flip':    { cat: 'transition', zh: '翻頁', en: 'Page flip', demo: true },
    'fold':         { cat: 'transition', zh: '摺疊', en: 'Fold', demo: true },
    'whip-pan':     { cat: 'transition', zh: '甩鏡', en: 'Whip pan', demo: true },
    'glitch':       { cat: 'transition', zh: '故障轉場', en: 'Glitch', demo: true },
    'slash-wipe':   { cat: 'transition', zh: '斜切斬擊擦除', en: 'Slash wipe', demo: true },
    'match-cut':    { cat: 'transition', zh: '匹配剪接', en: 'Match cut', demo: false },
    // 鏡頭
    'push-in':      { cat: 'camera', zh: '緩慢推近', en: 'Slow push-in', demo: true },
    'pull-out':     { cat: 'camera', zh: '反向拉遠', en: 'Pull-out', demo: false },
    'parallax':     { cat: 'camera', zh: '多層視差', en: 'Multi-layer parallax', demo: true },
    'cam-25d':      { cat: 'camera', zh: '2.5D 攝影機（透視微傾）', en: '2.5D camera tilt', demo: false },
    'head-bob':     { cat: 'camera', zh: '第一人稱頭部晃動', en: 'First-person head-bob', demo: true },
    'shake':        { cat: 'camera', zh: '震動特寫', en: 'Shake close-up', demo: false },
    // 節奏
    'beat-cut':     { cat: 'rhythm', zh: '卡在節拍上的剪接', en: 'Cut on the beat', demo: true },
    'stagger':      { cat: 'rhythm', zh: '錯位進場', en: 'Staggered entrance', demo: true },
    'spring':       { cat: 'rhythm', zh: '彈性緩動', en: 'Spring easing', demo: true },
    'loop':         { cat: 'rhythm', zh: '無縫循環', en: 'Seamless loop', demo: true },
    'slow-mo':      { cat: 'rhythm', zh: '變速（極度放慢）', en: 'Speed ramp / slow-mo', demo: false },
    'ease-out':     { cat: 'rhythm', zh: '三次方減速緩動', en: 'Cubic ease-out', demo: true },
    // 後製
    'grain':        { cat: 'post', zh: '膠片顆粒', en: 'Film grain', demo: true },
    'vignette':     { cat: 'post', zh: '暗角', en: 'Vignette', demo: true },
    'halftone':     { cat: 'post', zh: '半色調網點', en: 'Halftone dots', demo: true },
    'tilt-shift':   { cat: 'post', zh: '移軸模糊', en: 'Tilt-shift blur', demo: true },
    'crt':          { cat: 'post', zh: 'CRT 掃描線／閃爍', en: 'CRT scanlines / flicker', demo: true },
    'chromatic':    { cat: 'post', zh: '色差', en: 'Chromatic aberration', demo: false },
    'light-leak':   { cat: 'post', zh: '漏光', en: 'Light leak', demo: true },
    'lut':          { cat: 'post', zh: '調色 LUT', en: 'Colour grade (LUT)', demo: true },
    'bloom':        { cat: 'post', zh: '光暈 Bloom', en: 'Bloom', demo: false },
    'letterbox':    { cat: 'post', zh: '信箱遮幅', en: 'Letterbox', demo: true },
    'speed-lines':  { cat: 'post', zh: '集中速度線', en: 'Speed lines', demo: true },
    'paper':        { cat: 'post', zh: '紙面細點紋理', en: 'Paper dot texture', demo: false },
    'embers':       { cat: 'post', zh: '餘燼／火星粒子', en: 'Embers', demo: true }
  };

  /* 影片時長（秒）：Claude / Codex 取自 HTML 內嵌時間軸；Antigravity 取自成果總覽 PDF 實測值 */
  const V = [];
  const add = (o) => V.push(o);

  /* ===================== Claude Code ===================== */
  add({ maker: 'claude', subject: 'civics', style: 'anthropomorphic', dur: 338.5, sceneCount: 13,
    music: { zh: '木琴玩具樂團、搖鈴、輕鼓', en: 'Toy xylophone band, shaker, light drums' },
    visual: { zh: '奶油色紙張底、粗黑描邊的貼紙卡片與硬陰影；擬人角色「電腦君」，以及房子、手機、書本（民法）、河川、政府建築、燈泡等會眨眼的擬人物品；人物以「辰／元／庭」等字頭像代表。',
              en: 'Cream paper background, bold-outlined sticker cards with hard shadows; a mascot “Mr. Computer” plus blinking anthropomorphic house, phone, Civil-Code book, river, government building and light bulb; people shown as single-character avatars.' },
    palette: ['#FFF3DF', '#2B2A33', '#FF6B5B', '#19A7A0', '#FFC93C', '#6EC1FF', '#7CC96B'],
    tech: {
      text: [['char-pop', '各幕標題、主標題'], ['typewriter', '對話泡泡「我到底是誰的？」「還是我的！」'], ['highlighter', '所有權、特定人、任何人'], ['stamp', '特性卡、「共有」「不得自創」標籤']],
      graphic: [['counter', '憲法第 15 條、民法第 767 條、$5,000／$6,000、總複習 4／3／2'], ['svg-stroke', '支配箭頭、債權虛線、物權放射線、廢水管'], ['hand-circle', '妨害防止請求權'], ['chart-grow', '古羅馬→憲法時間軸、天平傾斜']],
      transition: [['shape-mask', '圓形、菱形'], ['wipe', '橫向、向上'], ['zoom-through', ''], ['liquid', '河川幕'], ['page-flip', ''], ['fold', ''], ['whip-pan', '']],
      camera: [['push-in', ''], ['parallax', '背景色塊']],
      rhythm: [['beat-cut', ''], ['stagger', ''], ['spring', '掉落、回彈'], ['loop', '角色上下浮動、眨眼']],
      post: [['halftone', ''], ['grain', ''], ['vignette', '']]
    } });
  add({ maker: 'claude', subject: 'chemistry', style: 'stylized3d', dur: 322.4, sceneCount: 12,
    music: { zh: '晶亮撥弦琶音、暖音墊、輕電子鼓', en: 'Sparkling plucked arpeggios, warm pad, light electronic drums' },
    visual: { zh: '柔光攝影棚漸層與地面反光、塑膠質感圓角卡片；以 DOM 即時算繪、可旋轉的 3D 球棍分子模型（醋酸、水、甲烷、二氧化碳、乙醇、甲醚、三聚氰胺、乙酸正丁酯），採標準原子配色；燃燒分析裝置示意圖附流動氣體粒子。',
              en: 'Soft studio gradient with floor reflection, plastic rounded cards; DOM-rendered rotatable 3D ball-and-stick molecules (acetic acid, water, methane, CO₂, ethanol, dimethyl ether, melamine, butyl acetate) in CPK colours; a combustion-analysis rig with flowing gas particles.' },
    palette: ['#EEF2FF', '#1B2340', '#FF7A3D', '#5B5BD6', '#2FBF9B', '#CFE0FF'],
    tech: {
      text: [['particle-text', '「CH₂O」'], ['weight-shift', '「化學式」「實驗式」由細變粗'], ['scramble', 'C₃H₄O₃'], ['typewriter', '0.0084 : 0.0168、3 : 4 : 3'], ['char-pop', ''], ['line-up', '示性式表格']],
      graphic: [['chart-grow', '原子數比柱狀圖、三聚氰胺質量百分比、維生素 C 質量堆疊條'], ['counter', '0.27 g、3.6／0.40／4.8 g、n = 6、5.04 mg、6.72 碗'], ['svg-stroke', '結構式逐鍵畫出'], ['hand-circle', '甲烷結構式'], ['orbit', '醋酸、乙醇等 8 種分子']],
      transition: [['zoom-through', '衝進原子'], ['shape-mask', '圓形、菱形'], ['whip-pan', ''], ['liquid', ''], ['wipe', '橫向、向上'], ['fold', ''], ['page-flip', '']],
      camera: [['orbit', '分子 3D 旋轉／擺盪'], ['cam-25d', ''], ['push-in', '']],
      rhythm: [['beat-cut', ''], ['stagger', '原子依序長出、碗依序出現'], ['spring', '回彈']],
      post: [['bloom', '第 7 碗發光'], ['grain', ''], ['vignette', '']]
    } });
  add({ maker: 'claude', subject: 'chinese', style: 'cinematic', dur: 302.3, sceneCount: 12,
    music: { zh: '慢板弦樂、五聲音階撥弦（古箏感）、太鼓', en: 'Slow strings, pentatonic plucks (guzheng feel), taiko' },
    visual: { zh: '上下黑邊信箱遮幅、燭光金色與墨黑；程式產生的多層山脊與月光、霧氣、飄升餘燼；竹簡、匾額、紅色印章、三國鼎立示意圖、蠟燭。原文以楷體直書呈現。',
              en: 'Letterbox bars, candle-gold and ink-black; procedurally generated mountain ridges, moonlight, mist and rising embers; bamboo slips, plaques, red seals, a Three-Kingdoms map and candles. Original text set vertically in Kaiti.' },
    palette: ['#0B0A09', '#E9DFC8', '#D4AF6A', '#F3D9A0', '#B23A2E', '#6D7B8C'],
    tech: {
      text: [['particle-text', '金色「出師表」'], ['mask-reveal', '直書原文由上而下逐列揭示、「諸葛亮」大字'], ['line-up', '原文卡片'], ['char-pop', '鞠躬盡瘁'], ['highlighter', '金色底線：危急存亡之秋、開張聖聽、妄自菲薄']],
      graphic: [['counter', '西元 227 年、爾來 21 年、「先帝」13 次'], ['svg-stroke', '宮中／府中建築合一、北伐路線、首尾呼應箭頭'], ['chart-grow', '先漢興隆、後漢傾頹柱體'], ['timeline', '作者生平']],
      transition: [['liquid', '墨暈'], ['fold', ''], ['shape-mask', '圓形'], ['wipe', ''], ['whip-pan', ''], ['zoom-through', '衝向月亮'], ['page-flip', ''], ['match-cut', '第 4 幕與第 9 幕同一張地圖構圖']],
      camera: [['parallax', '山脊依深度位移'], ['push-in', ''], ['pull-out', '']],
      rhythm: [['beat-cut', ''], ['stagger', ''], ['loop', '燭焰、霧氣、餘燼']],
      post: [['grain', ''], ['light-leak', ''], ['lut', '暖橘／冷青'], ['vignette', ''], ['glow-text', ''], ['letterbox', '']]
    } });
  add({ maker: 'claude', subject: 'geography', style: 'miniature', dur: 301.4, sceneCount: 12,
    music: { zh: '音樂盒旋律、柔和音墊、搖鈴', en: 'Music-box melody, soft pad, shaker' },
    visual: { zh: '桌上立體模型：草皮與土層台座、玩具樹、小房子、棉花雲、登山小人；畫面上緣與下緣加移軸鏡頭模糊並提高飽和度；標籤做成插針小旗與標籤帶。',
              en: 'A tabletop diorama: grass-and-soil base, toy trees, tiny houses, cotton clouds and a little hiker; tilt-shift blur at top and bottom with boosted saturation; labels as pin flags and tape.' },
    palette: ['#FFFDF5', '#1F3A2E', '#8BCB6A', '#4FB3D9', '#F2D49B', '#FFC845', '#F2614B'],
    tech: {
      text: [['char-pop', '各幕標題'], ['mask-reveal', '陽光光束由左展開'], ['stagger', '因素標籤、比較標籤']],
      graphic: [['chart-grow', '雨量筒、三地降水季節長條、水庫水位下降'], ['svg-stroke', '陸地／海洋日溫曲線、黑潮路徑、氣流箭頭'], ['counter', '19.5°C、1,402 mm、25%'], ['toggle', '氣溫／氣壓／降水三個開關']],
      transition: [['shape-mask', '圓形、菱形'], ['wipe', '橫向、向上'], ['zoom-through', ''], ['liquid', '洋流幕'], ['whip-pan', ''], ['fold', '']],
      camera: [['push-in', '並微微上移'], ['path-move', '登山小人沿步道移動'], ['orbit', '氣旋／反氣旋旋轉']],
      rhythm: [['beat-cut', ''], ['stagger', ''], ['spring', ''], ['loop', '地球自轉、雲朵漂移、雨滴、氣壓粒子']],
      post: [['tilt-shift', ''], ['lut', '提高飽和'], ['grain', ''], ['vignette', '']]
    } });
  add({ maker: 'claude', subject: 'math', style: 'pov', dur: 307.3, sceneCount: 10,
    music: { zh: '合成器波（鋸齒波貝斯、電子鼓）', en: 'Synthwave (saw bass, drum machine)' },
    visual: { zh: '觀眾即「工廠決策者」的第一人稱視角：琥珀色抬頭顯示介面（四角框線、REC 錄影時碼、準心、座標讀數）、終端機面板、成績表、任務卡；所有座標圖以程式依方程式精確繪製。',
              en: 'You are the factory decision-maker: amber HUD (corner brackets, REC timecode, crosshair, coordinates), terminal panels, a grade sheet, mission cards; every graph is plotted exactly from its equations.' },
    palette: ['#0A0F14', '#FFB000', '#FFD27A', '#3DFFB0', '#FF5A4E', '#6F8597'],
    tech: {
      text: [['typewriter', '終端機開機、限制條件'], ['scramble', '「線性規劃」'], ['char-pop', '各任務標題']],
      graphic: [['svg-stroke', '平行直線系、不等式界線、可行解區域邊界'], ['counter', 'k 值即時變化、P = 297.14 kg、85 分'], ['chart-grow', '資源條、可行解區域填色'], ['line-sweep', ''], ['hud', '']],
      transition: [['glitch', '含白閃'], ['whip-pan', '模擬轉頭'], ['zoom-through', '']],
      camera: [['head-bob', '持續微幅位移與旋轉'], ['push-in', '']],
      rhythm: [['beat-cut', ''], ['stagger', '頂點表逐列出現'], ['ease-out', '平滑加減速的平行線掃描']],
      post: [['crt', '掃描線、畫面閃爍'], ['chromatic', ''], ['grain', ''], ['vignette', '']]
    } });
  add({ maker: 'claude', subject: 'english', style: 'fantasy', dur: 304.6, sceneCount: 12,
    music: { zh: '合唱音墊、鐘聲、固定音型撥弦、太鼓', en: 'Choir pad, bells, ostinato plucks, taiko' },
    visual: { zh: '深紫皇家夜色、旋轉的神聖光束、火把、金色雕花拱門；黑暗中的老虎眼睛與玫瑰象徵兩扇門後的命運；圓形競技場群眾、羊皮紙卷軸、牢籠鐵柵、寶石徽記；英文標題使用 Cinzel 字體。',
              en: 'Royal purple night, rotating god rays, torches, ornate golden arches; tiger eyes in the dark and a rose symbolise the fates behind the doors; arena crowds, parchment scrolls, iron bars and jewelled crests; English titles in Cinzel.' },
    palette: ['#120A1F', '#2A1440', '#E8B84A', '#FFE3A0', '#C9324A', '#FF8A3D', '#8A7FB0'],
    tech: {
      text: [['mask-reveal', 'THE LADY / OR / THE TIGER?'], ['typewriter', 'Heinz 故事、If I were the princess…'], ['highlighter', 'while、on the other hand'], ['weight-shift', 'DILEMMA'], ['char-pop', '各幕英文標題']],
      graphic: [['svg-stroke', '王冠徽記'], ['counter', '1948'], ['door-open', '門扇 3D 開啟、單字翻牌']],
      transition: [['shape-mask', '圓形、菱形'], ['fold', ''], ['zoom-through', '衝進門內'], ['wipe', '橫向、向上'], ['liquid', ''], ['glitch', '兩難幕'], ['page-flip', '']],
      camera: [['push-in', ''], ['pull-out', '競技場拉遠'], ['loop', '光束持續旋轉']],
      rhythm: [['beat-cut', ''], ['slow-mo', '門扇開啟極度放慢，停在懸念'], ['stagger', ''], ['loop', '火焰、老虎眨眼、浮塵']],
      post: [['bloom', '標題與光點'], ['light-leak', ''], ['grain', ''], ['vignette', '']]
    } });

  /* ===================== Codex ===================== */
  const codexCommon = { text: [['mask-reveal', '標題由左向右遮罩揭示'], ['ease-out', '主圖平移淡入']], post: [['paper', '固定紙面細點紋理']] };
  add({ maker: 'codex', subject: 'civics', style: 'miniature', dur: 389.8, sceneCount: 14,
    music: { zh: '本機 Web Audio 合成，依主題選音階與節拍；章節轉換提示音；人聲期間低音量伴奏', en: 'Local Web Audio synthesis with a theme-specific scale and tempo; chapter cue tones; music ducks under the voice' },
    visual: { zh: '暖米色、深綠與陶紅，將抽象權利放進縮小的生活場景。以小房屋、電腦圖形與橢圓投影建立微縮模型感。',
              en: 'Warm beige, deep green and terracotta place abstract rights into a shrunken everyday scene; tiny houses, a computer icon and oval drop-shadows build the miniature feel.' },
    palette: ['#f1e8d6', '#223f40', '#be593b', '#d6ae54'],
    tech: {
      text: codexCommon.text,
      graphic: [['pan', '電腦在人物標記之間移動，表現交付、移轉與返還'], ['svg-stroke', '圓弧逐步畫出共有關係；「使用、收益、處分」節點輪流變色'], ['iso', '小房屋、電腦圖形與橢圓投影的模型層次'], ['diagram', '人物標記、盾牌輪廓、箭頭與流程標籤說明權利及救濟']],
      rhythm: [['ease-out', '三次方減速緩動']],
      post: codexCommon.post
    } });
  add({ maker: 'codex', subject: 'chemistry', style: 'stylized3d', dur: 361.4, sceneCount: 13,
    music: { zh: '本機 Web Audio 合成配樂；章節轉換提示音', en: 'Local Web Audio score; chapter cue tones' },
    visual: { zh: '以圓潤球體與清楚的比例圖，呈現原子、化學式和質量關係。原子球體使用徑向漸層，屬於平面繪圖的立體視覺效果。',
              en: 'Rounded spheres and clear ratio charts show atoms, formulas and mass relationships. Atoms use radial gradients — a 2D drawing that reads as 3D.' },
    palette: ['#f5efdf', '#244747', '#c9553f', '#c9a84c'],
    tech: {
      text: codexCommon.text,
      graphic: [['radial-3d', '原子球體的立體光影'], ['orbit', '球棍組合依時間環繞運動'], ['chart-grow', '比例與百分組成柱狀圖由下向上長出'], ['flow-particles', '吸收管粒子循環移動；甲醚、乙醇骨架並列']],
      rhythm: [['loop', '化學式以正弦曲線緩慢上下浮動'], ['ease-out', '']],
      post: codexCommon.post
    } });
  add({ maker: 'codex', subject: 'geography', style: 'cinematic', dur: 378.7, sceneCount: 13,
    music: { zh: '本機 Web Audio 合成配樂；章節轉換提示音', en: 'Local Web Audio score; chapter cue tones' },
    visual: { zh: '電影寫實風（圖解紀錄片）：以自然色調、連續氣流與緩慢推近，採圖解紀錄片的敘事方向。山地、海面、雲層分層排列。',
              en: 'Cinematic (diagram documentary): natural tones, continuous airflow and slow push-ins; mountains, sea and cloud layers stacked like a documentary diagram.' },
    palette: ['#e1e9df', '#1c4149', '#48818a', '#ce7946'],
    tech: {
      text: codexCommon.text,
      graphic: [['flow-particles', '箭頭沿海岸移動表現洋流'], ['orbit', '低壓周圍箭頭旋轉並向內收斂'], ['chart-grow', '海陸並列；降水示意柱狀圖逐步生長']],
      camera: [['push-in', '主圖隨章節進度小幅放大']],
      rhythm: [['loop', '雨線反覆落下'], ['ease-out', '']],
      post: codexCommon.post
    } });
  add({ maker: 'codex', subject: 'english', style: 'fantasy', dur: 361.8, sceneCount: 13,
    music: { zh: '本機 Web Audio 合成配樂；章節轉換提示音', en: 'Local Web Audio score; chapter cue tones' },
    visual: { zh: '深色背景、金色拱門與對稱雙門，營造寓言中的命運與兩難。兩扇門保持相同外觀，以 A、B 作圖解標記，不揭露門後結果。',
              en: 'Dark background, golden arches and symmetrical twin doors evoke fate and dilemma; the doors stay identical, labelled A and B, never revealing what is behind them.' },
    palette: ['#241e2b', '#eee3cf', '#b36d5b', '#b99a59'],
    tech: {
      text: [...codexCommon.text, ['line-up', '「文本事實／推測」雙欄；字彙與句型分行色塊']],
      graphic: [['door-open', '其中一扇門水平縮放，模擬門片轉開'], ['diagram', '大問號遮住結果，保留開放結局']],
      rhythm: [['loop', '天秤式線條輕微搖擺表現衝突'], ['ease-out', '']],
      post: codexCommon.post
    } });
  add({ maker: 'codex', subject: 'chinese', style: 'anime', dur: 379.4, sceneCount: 13,
    music: { zh: '本機 Web Audio 合成配樂；章節轉換提示音', en: 'Local Web Audio score; chapter cue tones' },
    visual: { zh: '日系動漫風（歷史墨線分鏡）：以卷軸、墨線、朱紅印章與漫畫網點，呈現歷史題材的分鏡感。',
              en: 'Anime (historical ink storyboard): scrolls, ink lines, vermilion seals and manga screentone give a storyboard feel to history.' },
    palette: ['#f2e6d1', '#302f30', '#a43d37', '#aa9369'],
    tech: {
      text: [...codexCommon.text, ['stagger', '不同文字欄位以不同相位上下浮動']],
      graphic: [['vertical-text', '原文、古今異義詞與勸諫重點放在卷軸式版面，搭配直排'], ['timeline', '以年代節點串起背景；箭頭與對照色塊連結用人原則與興衰']],
      rhythm: [['loop', '微幅錯位浮動'], ['ease-out', '']],
      post: [['speed-lines', '放射線'], ['halftone', '漫畫網點'], ...codexCommon.post]
    } });
  add({ maker: 'codex', subject: 'math', style: 'pov', dur: 373.9, sceneCount: 13,
    music: { zh: '本機 Web Audio 合成配樂；章節轉換提示音', en: 'Local Web Audio score; chapter cue tones' },
    visual: { zh: '第一人稱沉浸風（解題工作臺）：以深色座標工作臺呈現解題過程，讓觀眾跟著限制、目標與結果推理。',
              en: 'First-person (problem-solving workbench): a dark coordinate workbench lets viewers reason through constraints, objective and result.' },
    palette: ['#152d36', '#eee9d7', '#e0ad58', '#79b4a9'],
    tech: {
      text: codexCommon.text,
      graphic: [['half-plane', '先區分單一限制，再呈現全部限制的交集與可行頂點'], ['line-sweep', '固定斜率的虛線隨目標值移動'], ['counter', '目標值 k 隨時間更新，頂點與最佳值使用強調色'], ['path-move', '圓點沿同值線段行進，表現整條邊都可能是最佳解']],
      rhythm: [['ease-out', '']],
      post: codexCommon.post
    } });

  /* ===================== Antigravity ===================== */
  add({ maker: 'antigravity', subject: 'civics', style: 'miniature', dur: 634, sceneCount: 8, lines: 44,
    music: { zh: '溫暖 C 大調微縮八音盒＋木琴＋蓋章音效', en: 'Warm C-major music box + xylophone + stamp SFX' },
    visual: { zh: '等角 2.5D 紙模微縮舞台，上下移軸淺景深模糊；案例衝突定格、地政登記蓋章、騎樓下雨動畫。',
              en: 'An isometric 2.5D paper-model stage with tilt-shift blur; freeze-frames on case conflicts, a land-registry stamp, rain under the arcade.' },
    palette: ['#24211d', '#f4efe6', '#4f7a5a', '#c85a3f', '#2b5b84', '#e6a832'],
    tech: {
      text: [['char-pop', ''], ['highlighter', '']],
      graphic: [['iso', '等角 2.5D 紙模微縮舞台'], ['counter', '$5,000／$6,000、§767'], ['stamp', '地政登記蓋章']],
      transition: [['shape-mask', '圓形移軸遮罩轉場']],
      rhythm: [['loop', '騎樓下雨動畫']],
      post: [['tilt-shift', '上下移軸淺景深模糊']]
    } });
  add({ maker: 'antigravity', subject: 'chemistry', style: 'stylized3d', dur: 495, sceneCount: 7, lines: 31,
    music: { zh: '輕快實驗室彈跳合成器＋水滴泡泡轉場音效', en: 'Bouncy lab synth + water-drop bubble transition SFX' },
    visual: { zh: '高光澤立體 3D 球棍分子自轉浮動，多層視差立體泡泡，燃燒管線氣流粒子。',
              en: 'Glossy 3D ball-and-stick molecules spinning and floating, parallax bubbles, gas particles flowing through the combustion line.' },
    palette: ['#e8f4ff', '#1b2845', '#00a8e8', '#ff5e5b', '#ffae03', '#12b886', '#4c6ef5'],
    tech: {
      graphic: [['orbit', '高光澤 3D 球棍分子自轉浮動'], ['flow-particles', '燃燒管線氣流粒子'], ['chart-grow', '百分組成生長柱狀圖']],
      transition: [['liquid', '液態氣泡擴散轉場']],
      camera: [['parallax', '多層視差立體泡泡']],
      rhythm: [['spring', 'Q 彈緩動']],
      post: [['bloom', 'Bloom 高光光暈']]
    } });
  add({ maker: 'antigravity', subject: 'chinese', style: 'fantasy', dur: 350, sceneCount: 7, lines: 21,
    music: { zh: 'D 調中國五聲音階古箏撥弦＋深沉史詩戰鼓低鳴', en: 'D pentatonic guzheng plucks + deep epic war drums' },
    visual: { zh: 'Canvas 即時烽火火星餘燼粒子、捲軸展開名句、SVG 北伐行軍古地圖金線光軌、史詩暗角。',
              en: 'Live canvas beacon-fire embers, unrolling scrolls for famous lines, a gold-traced SVG march map, epic vignette.' },
    palette: ['#0f0c0a', '#1d1510', '#d9b15f', '#f6dc9b', '#c0392b', '#3c7a78', '#f3e6cc'],
    tech: {
      text: [['mask-reveal', '捲軸展開遮罩揭示名句']],
      graphic: [['svg-stroke', 'SVG 北伐行軍古地圖金線光軌'], ['counter', 'AD 227／13 次／21 年']],
      transition: [['wipe', '金光捲軸擦除轉場']],
      post: [['embers', 'Canvas 即時烽火火星餘燼粒子'], ['vignette', '史詩暗角']]
    } });
  add({ maker: 'antigravity', subject: 'geography', style: 'cinematic', dur: 379, sceneCount: 7, lines: 24,
    music: { zh: 'IMAX 紀錄片氛圍弦樂 Pad＋低頻 Sub-drop 轉場音', en: 'IMAX-documentary string pad + low sub-drop transitions' },
    visual: { zh: 'Canvas 大氣氣流衛星軌跡、北半球氣旋／反氣旋動態旋轉 SVG、青橙電影調色。',
              en: 'Canvas satellite-style airflow trails, rotating SVG cyclone/anticyclone, teal-and-orange film grade.' },
    palette: ['#060b14', '#0d1c2e', '#38bdf8', '#0284c7', '#f59e0b', '#ef4444', '#e2e8f0'],
    tech: {
      text: [['scramble', '亂碼解碼標題動畫']],
      graphic: [['flow-particles', 'Canvas 大氣氣流衛星軌跡'], ['orbit', '北半球氣旋／反氣旋動態旋轉 SVG'], ['chart-grow', '雨量分級生長柱狀圖']],
      transition: [['wipe', '掃描擦除轉場']],
      post: [['lut', '青橙電影調色 LUT'], ['grain', '']]
    } });
  add({ maker: 'antigravity', subject: 'math', style: 'pov', dur: 338, sceneCount: 6, lines: 20,
    music: { zh: '科技指揮室電子脈衝 Arp＋準星雙音鎖定音效', en: 'Command-room electronic arp + two-tone crosshair lock SFX' },
    visual: { zh: '第一人稱全息戰術護目鏡：四角瞄準框、POV 輕微呼吸晃動、CRT 掃描線；目標函數直線即時平行掃過可行解多邊形，並以準星鎖定最佳解頂點。',
              en: 'First-person holographic tactical goggles: corner brackets, gentle breathing sway, CRT scanlines; the objective line sweeps across the feasible polygon and a crosshair locks onto the optimal vertex.' },
    palette: ['#050a0e', '#10b981', '#06b6d4', '#fbbf24', '#f43f5e', '#ecfdf5'],
    tech: {
      graphic: [['hud', '全息戰術護目鏡四角瞄準框'], ['line-sweep', '目標函數直線平行掃過可行解多邊形，準星鎖定頂點']],
      transition: [['glitch', '故障轉場（Glitch）']],
      camera: [['head-bob', 'POV 輕微呼吸晃動']],
      post: [['crt', 'CRT 掃描線']]
    } });
  add({ maker: 'antigravity', subject: 'english', style: 'anime', dur: 329, sceneCount: 6, lines: 20,
    music: { zh: 'E 小調日系熱血動漫搖滾合成器 Riff＋斬擊音效', en: 'E-minor anime-rock synth riff + slash SFX' },
    visual: { zh: '賽璐珞粗黑描框漫畫分鏡、半色調網點、旋轉集中速度線、雙門震動懸疑特寫。',
              en: 'Cel-style bold-outlined comic panels, halftone dots, rotating speed lines, shaking close-ups of the two doors.' },
    palette: ['#12152e', '#ff2a54', '#ffd166', '#00e5ff', '#fffdf5', '#0b0d17'],
    tech: {
      text: [['highlighter', '文法螢光高光']],
      graphic: [['comic', '賽璐珞粗黑描框漫畫分鏡']],
      transition: [['slash-wipe', '日系斜切斬擊擦除轉場（Slash Wipe）']],
      camera: [['shake', '雙門震動懸疑特寫']],
      post: [['halftone', '半色調網點'], ['speed-lines', '旋轉集中速度線']]
    } });

  const SCENES = window.SCENES_DATA || {};

  V.forEach(v => {
    v.id = `${v.maker}-${v.subject}`;
    v.file = `videos/${v.maker}/${v.subject}.html`;
    v.thumbs = [1, 2, 3, 4].map(i => `assets/thumbs/${v.id}-${i}.jpg`);
    v.scenes = SCENES[v.id] || [];
  });

  return { SUBJECTS, SUBJECT_ORDER, MATERIAL_POINTS, MAKERS, MAKER_ORDER, STYLES, CATS, CAT_ORDER, TECH, VIDEOS: V };
})();
