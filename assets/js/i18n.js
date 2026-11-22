/* 介面文字：繁體中文 / English */
window.I18N = (() => {
  const dict = {
    zh: {
      skip: '跳到主要內容', siteTitle: '簡報影片HTML教學網', siteSub: '18 支影片・6 科教材・3 個 AI',
      navHome: '首頁', navLibrary: '影片庫', navLab: '手法實驗室', navWorkflow: '製作流程', navQuiz: '風格挑戰',
      navLabShort: '實驗室', navWorkflowShort: '流程', navQuizShort: '挑戰',
      settings: '顯示與操作設定', close: '關閉', reset: '恢復預設', install: '安裝成 App',
      footerNote: '影片由 Claude Code、Codex、Antigravity 依原始教材製作；旁白為 Azure zh-TW-HsiaoChenNeural 語音。',
      styleDoc: '風格手法 PDF',
      // 首頁
      heroKicker: 'HTML 動態簡報影片・學習工作坊',
      heroTitleA: '看懂、拆解、學會做', heroTitleB: 'HTML', heroTitleC: '簡報影片',
      heroLead: '同一份教材，交給三個 AI 工具做成 9:16 直式教學短片。在這裡邊看影片、邊對照原始教材與動畫手法，一步步學會自己做。',
      ctaWatch: '開始看影片', ctaLab: '進入手法實驗室',
      statVideos: '支教學影片', statSubjects: '科原始教材', statMakers: '個 AI 工具', statStyles: '種視覺風格', statTech: '種動畫手法', statMinutes: '分鐘總片長',
      marquee: ['逐字從基線彈出', '螢光筆劃重點', 'SVG 描邊', '形狀遮罩轉場', '卡在節拍上的剪接', '移軸模糊', '膠片顆粒', '3D 分子旋轉', '故障轉場', '數字計數器'],
      makersKicker: '三個 AI，三種做法', makersTitle: '同一份教材，<em>三種</em>做法', makersLead: '三套作品各自有不同的引擎、旁白同步方式與後製面板。先認識它們，再去看影片。',
      seeVideos: '看這 6 支影片', specDoc: '原始說明 PDF',
      libKicker: '影片庫', libTitle: '18 支影片，<em>任你挑</em>', libLead: '依科目或 AI 工具篩選；滑過卡片可以預覽畫面，點進去就能播放並對照教材。',
      fSubject: '科目', fMaker: 'AI 工具', all: '全部', viewCards: '卡片', viewMatrix: '對照表',
      noMatch: '沒有符合條件的影片，換個篩選試試看。',
      scenes: '幕', minutes: '分',
      stylesKicker: '風格地圖', stylesTitle: '7 種視覺風格，<em>怎麼分</em>？', stylesLead: '同一種風格交給不同 AI，做出來的味道也不一樣。點小圖直接看影片。',
      ctaBandTitle: '下一步，動手學',
      ctaLabT: '手法實驗室', ctaLabD: '40 多種動畫手法的即時示範，附上可以照抄的程式碼。',
      ctaFlowT: '製作流程', ctaFlowD: '從 PDF 到單一 HTML 影片的完整步驟，加上提示詞產生器。',
      ctaQuizT: '風格挑戰', ctaQuizD: '看一張畫面猜猜看是哪種風格、哪個 AI 做的。',
      // 影片頁
      back: '影片庫', tabStyle: '風格與手法', tabSource: '原始教材', tabChapters: '章節', tabCompare: '三版比較', tabPrompt: '仿作提示詞',
      loadPlayer: '點一下載入播放器', loadHint: '載入後，請點影片內的「開始播放」', fullscreen: '全螢幕', openNew: '新分頁開啟', reload: '重新載入',
      prev: '上一支', next: '下一支',
      visual: '視覺設定', music: '配樂（程式合成）', duration: '片長', sceneCount: '幕數', canvas: '畫布', narration: '旁白',
      palette: '色票（點一下複製色碼）', techTitle: '使用的動畫手法', techHint: '有 ▶ 的手法可以點開看即時示範。',
      notInDoc: '這個類別的手法沒有列在原始說明中',
      srcTitle: '原始教材', srcPages: '頁', openPdf: '開啟 PDF', downloadPdf: '下載 PDF', keyPoints: '教材重點',
      keyPointsNote: '整理自 Antigravity 成果總覽 PDF 的「核心教學內容」',
      zoomHint: '點頁面可放大',
      chTitle: '章節清單', chNote: '時間取自影片 HTML 內嵌的時間軸', chNoteAg: '章節取自影片的章節選單（原檔未提供逐章時間）',
      cmpTitle: '同一份教材的三種版本', cmpCurrent: '目前觀看', cmpShared: '三版共同使用的手法', cmpOnly: '只有這一版用到的手法', cmpDur: '片長比較', cmpNone: '沒有三版共同的手法',
      watchThis: '看這一版',
      promptTitle: '用這支影片當範本的提示詞', promptLead: '複製後交給 AI 工具，再換成你自己的教材 PDF，就能做出同樣風格的影片。',
      copy: '複製', copied: '已複製到剪貼簿',
      // 實驗室
      labKicker: '手法實驗室', labTitle: '每一種手法，<em>都能動手玩</em>', labLead: '影片裡用到的動畫手法都整理在這裡，附即時示範和核心程式碼。點「重播」再看一次，拖拉滑桿調整參數。',
      searchPh: '搜尋手法，例如：遮罩、計數…', replay: '重播', code: '程式碼', usedBy: '用在', intensity: '強度',
      noDemo: '沒有找到這個手法。',
      // 流程
      flowKicker: '製作流程', flowTitle: '從 PDF 到 <em>單一 HTML</em> 影片', flowLead: '整理自三套作品的說明文件與原始碼。每一步都附上三個 AI 的實際做法。',
      flowCmpTitle: '三套引擎規格對照', builderTitle: '提示詞產生器', builderLead: '選好教材、風格和手法，產生一段可以直接交給 AI 的製作提示詞。',
      bSubject: '教材主題', bCustom: '或輸入自己的主題', bStyle: '視覺風格', bTech: '想用的手法（可複選）', bLen: '目標片長', bRatio: '畫面比例', bGen: '產生提示詞',
      // 測驗
      quizKicker: '風格挑戰', quizTitle: '看畫面，<em>猜風格</em>', quizLead: '共 10 題。每題看一張影片截圖，選出正確答案。答對會有音效和彩帶！',
      qStyle: '這個畫面屬於哪一種視覺風格？', qMaker: '這支影片是哪一個 AI 工具做的？', qSubject: '這個畫面出自哪一科的教材？',
      qNo: '第 {n} / {t} 題', score: '得分', streak: '連對', right: '答對了！', wrong: '答錯了，正確答案是：', nextQ: '下一題', seeResult: '看結果',
      again: '再玩一次', resultTitle: '挑戰完成！', resultMsg: ['再看幾支影片，下次一定更好！', '不錯喔，已經看出門道了。', '很厲害，風格感很敏銳！', '滿分！你是動態設計達人！'],
      watchIt: '看這支影片',
      // 設定
      sFullscreen: '全螢幕', sSound: '音效', sDevice: '裝置', sOrient: '版面', sLang: '語言', sFont: '字體', sTheme: '色系',
      on: '開啟', off: '關閉', auto: '自動', mobile: '手機', tablet: '平板', desktop: '電腦', portrait: '直式', landscape: '橫式',
      zh: '繁體中文', en: 'English', fontSm: '縮小', fontMd: '標準', fontLg: '放大', system: '跟隨系統', light: '亮色', dark: '暗色',
      now: '目前：', simNote: '模擬裝置',
      soundOn: '音效已開啟', soundOff: '音效已關閉', resetDone: '已恢復預設設定', fsFail: '這個瀏覽器不支援全螢幕',
      offlineReady: '已可離線瀏覽', installed: '已安裝'
    },
    en: {
      skip: 'Skip to content', siteTitle: 'HTML Video Lesson Lab', siteSub: '18 videos · 6 textbooks · 3 AI tools',
      navHome: 'Home', navLibrary: 'Library', navLab: 'Technique Lab', navWorkflow: 'Workflow', navQuiz: 'Style Quiz',
      navLabShort: 'Lab', navWorkflowShort: 'Flow', navQuizShort: 'Quiz',
      settings: 'Display & Controls', close: 'Close', reset: 'Reset', install: 'Install app',
      footerNote: 'Videos produced by Claude Code, Codex and Antigravity from the original textbooks; narration by Azure zh-TW-HsiaoChenNeural.',
      styleDoc: 'style PDF',
      heroKicker: 'HTML motion lessons · workshop',
      heroTitleA: 'Watch, dissect, then make your own', heroTitleB: 'HTML', heroTitleC: ' video lessons',
      heroLead: 'The same textbooks were handed to three AI tools and turned into 9:16 vertical lesson videos. Watch them next to the source pages and the motion techniques, and learn to build your own.',
      ctaWatch: 'Start watching', ctaLab: 'Open the lab',
      statVideos: 'lesson videos', statSubjects: 'textbooks', statMakers: 'AI tools', statStyles: 'visual styles', statTech: 'techniques', statMinutes: 'minutes in total',
      marquee: ['Per-character pop', 'Highlighter sweep', 'SVG stroke draw', 'Shape-mask transition', 'Cut on the beat', 'Tilt-shift', 'Film grain', '3D molecule orbit', 'Glitch', 'Number counter'],
      makersKicker: 'Three AIs, three approaches', makersTitle: 'One textbook, <em>three</em> approaches', makersLead: 'Each set uses a different engine, narration-sync method and post-FX panel. Get to know them first.',
      seeVideos: 'See its 6 videos', specDoc: 'Original spec PDF',
      libKicker: 'Library', libTitle: '18 videos to <em>explore</em>', libLead: 'Filter by subject or AI tool. Hover a card to preview frames; open it to play and compare with the textbook.',
      fSubject: 'Subject', fMaker: 'AI tool', all: 'All', viewCards: 'Cards', viewMatrix: 'Matrix',
      noMatch: 'No videos match. Try another filter.',
      scenes: 'scenes', minutes: 'min',
      stylesKicker: 'Style map', stylesTitle: '7 visual styles — <em>what’s the difference</em>?', stylesLead: 'The same style feels different in each AI’s hands. Tap a thumbnail to watch.',
      ctaBandTitle: 'Next: get hands-on',
      ctaLabT: 'Technique Lab', ctaLabD: 'Live demos of 40+ motion techniques with copy-ready code.',
      ctaFlowT: 'Workflow', ctaFlowD: 'Every step from PDF to a single-file HTML video, plus a prompt builder.',
      ctaQuizT: 'Style Quiz', ctaQuizD: 'Guess the style or the AI from a single frame.',
      back: 'Library', tabStyle: 'Style & techniques', tabSource: 'Textbook', tabChapters: 'Chapters', tabCompare: 'Compare 3', tabPrompt: 'Remix prompt',
      loadPlayer: 'Tap to load the player', loadHint: 'Then press “開始播放” (Start) inside the video', fullscreen: 'Fullscreen', openNew: 'Open in new tab', reload: 'Reload',
      prev: 'Previous', next: 'Next',
      visual: 'Visual setting', music: 'Music (synthesised)', duration: 'Length', sceneCount: 'Scenes', canvas: 'Canvas', narration: 'Narration',
      palette: 'Palette (tap to copy)', techTitle: 'Motion techniques used', techHint: 'Techniques marked ▶ open a live demo.',
      notInDoc: 'Not listed in the original spec',
      srcTitle: 'Original textbook', srcPages: 'pages', openPdf: 'Open PDF', downloadPdf: 'Download PDF', keyPoints: 'Key points',
      keyPointsNote: 'Summarised from the “core content” section of the Antigravity report PDF',
      zoomHint: 'Tap a page to zoom',
      chTitle: 'Chapters', chNote: 'Times come from the timeline embedded in the video HTML', chNoteAg: 'Titles come from the video’s chapter menu (no per-chapter times in the file)',
      cmpTitle: 'Three versions of the same textbook', cmpCurrent: 'Now viewing', cmpShared: 'Techniques all three share', cmpOnly: 'Only this version uses', cmpDur: 'Length comparison', cmpNone: 'No technique is shared by all three',
      watchThis: 'Watch this version',
      promptTitle: 'A prompt that uses this video as the template', promptLead: 'Copy it into an AI tool and swap in your own textbook PDF to get a video in the same style.',
      copy: 'Copy', copied: 'Copied to clipboard',
      labKicker: 'Technique Lab', labTitle: 'Every technique is <em>playable</em>', labLead: 'All motion techniques used in the videos, with live demos and core code. Hit Replay, drag the sliders.',
      searchPh: 'Search, e.g. mask, counter…', replay: 'Replay', code: 'Code', usedBy: 'Used in', intensity: 'Intensity',
      noDemo: 'No technique found.',
      flowKicker: 'Workflow', flowTitle: 'From PDF to a <em>single HTML</em> video', flowLead: 'Compiled from the three projects’ docs and source code, with each AI’s actual approach per step.',
      flowCmpTitle: 'Engine specs side by side', builderTitle: 'Prompt builder', builderLead: 'Pick a textbook, style and techniques to generate a production prompt for an AI tool.',
      bSubject: 'Topic', bCustom: 'or type your own topic', bStyle: 'Visual style', bTech: 'Techniques (multi-select)', bLen: 'Target length', bRatio: 'Aspect ratio', bGen: 'Generate prompt',
      quizKicker: 'Style Quiz', quizTitle: 'See a frame, <em>guess the style</em>', quizLead: '10 questions. Each shows a screenshot — pick the right answer. Correct answers get sound and confetti!',
      qStyle: 'Which visual style is this frame?', qMaker: 'Which AI tool made this video?', qSubject: 'Which subject is this frame from?',
      qNo: 'Question {n} / {t}', score: 'Score', streak: 'Streak', right: 'Correct!', wrong: 'Not quite — the answer is: ', nextQ: 'Next', seeResult: 'See result',
      again: 'Play again', resultTitle: 'Challenge complete!', resultMsg: ['Watch a few more videos and try again!', 'Nice — you are getting the hang of it.', 'Great eye for style!', 'Perfect score — motion design pro!'],
      watchIt: 'Watch this video',
      sFullscreen: 'Fullscreen', sSound: 'Sound', sDevice: 'Device', sOrient: 'Layout', sLang: 'Language', sFont: 'Font size', sTheme: 'Theme',
      on: 'On', off: 'Off', auto: 'Auto', mobile: 'Phone', tablet: 'Tablet', desktop: 'Desktop', portrait: 'Portrait', landscape: 'Landscape',
      zh: '繁體中文', en: 'English', fontSm: 'Small', fontMd: 'Standard', fontLg: 'Large', system: 'System', light: 'Light', dark: 'Dark',
      now: 'Now: ', simNote: 'Simulated device',
      soundOn: 'Sound on', soundOff: 'Sound off', resetDone: 'Settings reset', fsFail: 'Fullscreen is not supported here',
      offlineReady: 'Ready to work offline', installed: 'Installed'
    }
  };
  let lang = 'zh';
  const t = (k, vars) => {
    let s = (dict[lang] && dict[lang][k]);
    if (s == null) s = dict.zh[k];
    if (s == null) return k;
    if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (_, v) => vars[v]);
    return s;
  };
  /* 取資料中的雙語欄位 */
  const L = (o) => (o == null ? '' : typeof o === 'string' ? o : (o[lang] ?? o.zh));
  const apply = (root = document) => {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  };
  const setLang = (l) => {
    lang = l === 'en' ? 'en' : 'zh';
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
    document.title = t('siteTitle');
    apply();
  };
  return { t, L, apply, setLang, get lang() { return lang; } };
})();
