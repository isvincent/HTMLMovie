/* =========================================================
   簡報影片HTML教學網 — 主程式（路由與頁面）
   ========================================================= */
window.APP = (() => {
  const DATA = window.SITE_DATA;
  const { SUBJECTS, SUBJECT_ORDER, MATERIAL_POINTS, MAKERS, MAKER_ORDER, STYLES, CATS, CAT_ORDER, TECH, VIDEOS } = DATA;
  const I = window.I18N, t = I.t, L = I.L;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $('#app');
  const sfx = (n, ...a) => window.SFX.play(n, ...a);
  const en = () => I.lang === 'en';
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (s) => { s = Math.round(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const subjName = (k) => en() ? SUBJECTS[k].en : SUBJECTS[k].zh;
  const techName = (k) => TECH[k] ? (en() ? TECH[k].en : TECH[k].zh) : k;
  const styleName = (k) => en() ? STYLES[k].en : STYLES[k].zh;
  const byId = (id) => VIDEOS.find(v => v.id === id);
  const techKeys = (v) => [...new Set(Object.values(v.tech).flat().map(x => x[0]))];

  /* ---------- 通用：toast / 彩帶 / 揭示 ---------- */
  let toastTimer;
  const toast = (msg) => { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200); };

  const confetti = (n = 140) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = $('#confetti'), x = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;
    const cols = ['#F26B3A', '#FFC93C', '#20A85A', '#1C8FE0', '#8A5CF0', '#FF5C8A'];
    const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .45, vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 5, r: Math.random() * 6 + 4, c: cols[Math.random() * 6 | 0], a: Math.random() * 6, va: (Math.random() - .5) * .4 }));
    let f = 0;
    const tick = () => {
      x.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
      if (++f < 150) requestAnimationFrame(tick); else x.clearRect(0, 0, c.width, c.height);
    };
    tick();
  };

  const revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } }), { threshold: .12 }) : null;
  const reveal = () => $$('.reveal').forEach(el => revealIO ? revealIO.observe(el) : el.classList.add('in'));

  const counters = (root = app) => $$('[data-count]', root).forEach(el => {
    const to = +el.dataset.count, t0 = performance.now(), d = 1400;
    const go = () => { const k = Math.min(1, (performance.now() - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(go); };
    go();
  });

  /* 卡片縮圖輪播（滑過時） */
  const bindThumbCycle = (root = app) => $$('.vcard', root).forEach(card => {
    const img = $('img', card), dots = $$('.dots i', card), v = byId(card.dataset.id); if (!v) return;
    let i = 3, iv;
    const show = (k) => { i = k; img.src = v.thumbs[k]; dots.forEach((d, j) => d.classList.toggle('on', j === k)); };
    card.addEventListener('mouseenter', () => { sfx('hover'); clearInterval(iv); show(0); iv = setInterval(() => show((i + 1) % 4), 700); });
    card.addEventListener('mouseleave', () => { clearInterval(iv); show(3); });
  });

  /* ---------- 共用片段 ---------- */
  const vcard = (v, i = 0) => {
    const m = MAKERS[v.maker], s = SUBJECTS[v.subject], st = STYLES[v.style];
    return `<a class="vcard" href="#/v/${v.id}" data-id="${v.id}" style="--i:${i};--mc:${m.color}">
      <div class="thumb"><img src="${v.thumbs[3]}" alt="${esc(L(s.title))}・${esc(m.name)} 畫面" loading="lazy" width="360" height="640">
        <span class="maker-badge">${m.name}</span><span class="dur">${fmt(v.dur)}</span>
        <span class="play"><svg class="ic"><use href="#i-play"/></svg></span>
        <span class="dots">${[0, 1, 2, 3].map(k => `<i class="${k === 3 ? 'on' : ''}"></i>`).join('')}</span></div>
      <div class="body">
        <div class="meta"><span class="tag" style="--c:${s.color}">${subjName(v.subject)}</span><span class="tag" style="--c:${st.color}">${styleName(v.style)}</span></div>
        <h3>${esc(L(s.title))}</h3>
        <div class="sub"><span><svg class="ic"><use href="#i-layers"/></svg>${v.sceneCount} ${t('scenes')}</span><span><svg class="ic"><use href="#i-sparkle"/></svg>${techKeys(v).length} ${en() ? 'techniques' : '種手法'}</span></div>
      </div></a>`;
  };
  const makerLogo = (k) => `<span class="maker-logo" style="--c:${MAKERS[k].color}" aria-hidden="true">${MAKERS[k].name[0]}</span>`;

  /* =========================================================
     首頁 + 影片庫
     ========================================================= */
  const lib = { subject: 'all', maker: 'all', view: 'cards' };

  const viewHome = (scrollToLib) => {
    const totalMin = Math.round(VIDEOS.reduce((a, v) => a + v.dur, 0) / 60);
    const techCount = Object.keys(TECH).length;
    /* 逐字彈出；標點黏在前一字，英文單字不拆開，避免標點落在行首 */
    const heroText = (s, delay) => {
      // 先依標點／空白切成「詞組」（整組不換行），組內再逐字彈出
      const phrases = s.match(/[^、，。！？：；\s]+[、，。！？：；]?|\s+/gu) || [s];
      let n = 0;
      return phrases.map(ph => /^\s+$/.test(ph) ? ' ' : `<span class="phr">${(ph.match(/[A-Za-z0-9]+|./gu) || []).map(c => `<span class="ch" style="animation-delay:${(delay + (n++) * 0.05).toFixed(2)}s">${esc(c)}</span>`).join('')}</span>`).join('');
    };
    const reelPick = [['claude', 'english'], ['codex', 'civics'], ['antigravity', 'chemistry']];
    const mq = t('marquee');
    app.innerHTML = `
    <section class="hero">
      <span class="deco star" style="left:3%;top:8%"><svg viewBox="0 0 24 24"><use href="#i-sparkle"/></svg></span>
      <span class="deco ring" style="right:4%;top:6%"></span>
      <span class="deco tri" style="left:46%;bottom:6%"></span>
      <svg class="deco squig" style="right:30%;top:3%" viewBox="0 0 140 30"><path d="M2 15 Q 19 0 36 15 T 70 15 T 104 15 T 138 15" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>
      <div class="wrap hero-grid">
        <div>
          <span class="kicker"><span class="dot"></span>${t('heroKicker')}</span>
          <h1>${heroText(t('heroTitleA'), .1)}<br><span class="hl">${heroText(t('heroTitleB'), .6)}</span>${heroText(t('heroTitleC'), .8)}</h1>
          <p class="lead">${t('heroLead')}</p>
          <div class="hero-cta">
            <a class="btn primary" href="#/library"><svg class="ic"><use href="#i-play"/></svg>${t('ctaWatch')}</a>
            <a class="btn sun" href="#/lab"><svg class="ic"><use href="#i-flask"/></svg>${t('ctaLab')}</a>
          </div>
          <div class="stats">
            <div class="stat" style="--c:var(--coral)"><b data-count="${VIDEOS.length}">0</b><span>${t('statVideos')}</span></div>
            <div class="stat" style="--c:var(--leaf)"><b data-count="${SUBJECT_ORDER.length}">0</b><span>${t('statSubjects')}</span></div>
            <div class="stat" style="--c:var(--antigravity)"><b data-count="${MAKER_ORDER.length}">0</b><span>${t('statMakers')}</span></div>
            <div class="stat" style="--c:var(--violet)"><b data-count="${Object.keys(STYLES).length}">0</b><span>${t('statStyles')}</span></div>
            <div class="stat" style="--c:var(--sky)"><b data-count="${techCount}">0</b><span>${t('statTech')}</span></div>
            <div class="stat" style="--c:var(--pink)"><b data-count="${totalMin}">0</b><span>${t('statMinutes')}</span></div>
          </div>
        </div>
        <div class="reel" aria-hidden="true">
          ${reelPick.map(([m, s], i) => { const v = byId(`${m}-${s}`); return `<a class="phone p${i + 1}" href="#/v/${v.id}" tabindex="-1" style="--c:${MAKERS[m].color}">${v.thumbs.map((src, k) => `<img src="${src}" alt="" class="${k ? 'off' : ''}">`).join('')}<span class="label">${MAKERS[m].name}</span></a>`; }).join('')}
          <div class="blob" style="width:70%;aspect-ratio:1;left:15%;top:12%;background:radial-gradient(circle,color-mix(in oklab,var(--sun) 70%,transparent),transparent 70%)"></div>
        </div>
      </div>
    </section>

    <div class="marquee" aria-hidden="true"><div class="marquee-track">${[...mq, ...mq].map(s => `<span><svg class="ic"><use href="#i-sparkle"/></svg>${s}</span>`).join('')}</div></div>

    <section class="section wrap" id="makers">
      <div class="section-head reveal"><div><span class="kicker">${t('makersKicker')}</span><h2 class="h-sec">${t('makersTitle')}</h2><p class="lead">${t('makersLead')}</p></div></div>
      <div class="makers">
        ${MAKER_ORDER.map((k, i) => { const m = MAKERS[k]; return `<article class="card maker-card reveal" style="--c:${m.color};transition-delay:${i * 90}ms">
          <h3>${makerLogo(k)}${m.name}</h3><p class="tagline">${L(m.tagline)}</p>
          <ul>${L(m.specs).slice(0, 5).map(s => `<li><svg class="ic"><use href="#i-check"/></svg><span>${esc(s)}</span></li>`).join('')}</ul>
          <div class="foot"><button class="btn sm" data-maker="${k}" style="background:${m.color};color:#fff"><svg class="ic"><use href="#i-film"/></svg>${t('seeVideos')}</button><a class="btn sm ghost" href="${m.doc}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-external"/></svg>${t('specDoc')}</a></div>
        </article>`; }).join('')}
      </div>
    </section>

    <section class="section wrap" id="library">
      <div class="section-head reveal"><div><span class="kicker">${t('libKicker')}</span><h2 class="h-sec">${t('libTitle')}</h2><p class="lead">${t('libLead')}</p></div></div>
      <div class="toolbar">
        <div class="toolrow" role="group" aria-label="${t('fSubject')}"><span class="lbl">${t('fSubject')}</span>
          <button class="chip" data-fs="all" aria-pressed="${lib.subject === 'all'}">${t('all')}</button>
          ${SUBJECT_ORDER.map(k => `<button class="chip" data-fs="${k}" aria-pressed="${lib.subject === k}"><span class="sw" style="--c:${SUBJECTS[k].color}"></span>${subjName(k)}</button>`).join('')}
        </div>
        <div class="toolrow" role="group" aria-label="${t('fMaker')}"><span class="lbl">${t('fMaker')}</span>
          <button class="chip" data-fm="all" aria-pressed="${lib.maker === 'all'}">${t('all')}</button>
          ${MAKER_ORDER.map(k => `<button class="chip" data-fm="${k}" aria-pressed="${lib.maker === k}"><span class="sw" style="--c:${MAKERS[k].color}"></span>${MAKERS[k].name}</button>`).join('')}
          <span class="spacer"></span>
          <div class="seg" role="group"><button data-view="cards" aria-pressed="${lib.view === 'cards'}"><svg class="ic"><use href="#i-grid"/></svg>${t('viewCards')}</button><button data-view="matrix" aria-pressed="${lib.view === 'matrix'}"><svg class="ic"><use href="#i-table"/></svg>${t('viewMatrix')}</button></div>
        </div>
      </div>
      <div id="libOut"></div>
    </section>

    <section class="section wrap" id="styles">
      <div class="section-head reveal"><div><span class="kicker">${t('stylesKicker')}</span><h2 class="h-sec">${t('stylesTitle')}</h2><p class="lead">${t('stylesLead')}</p></div></div>
      <div class="styles">
        ${Object.entries(STYLES).map(([k, s], i) => { const vs = VIDEOS.filter(v => v.style === k); return `<article class="style-tile reveal" style="--c:${s.color};transition-delay:${i * 60}ms">
          <span class="big" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <h3>${en() ? s.en : s.zh}</h3><div class="en">${en() ? s.zh : s.en}</div><p>${L(s.cue)}</p>
          <div class="uses">${vs.map(v => `<a href="#/v/${v.id}"><img src="${v.thumbs[2]}" alt="" loading="lazy">${MAKERS[v.maker].name.split(' ')[0]}・${subjName(v.subject)}</a>`).join('')}</div>
        </article>`; }).join('')}
      </div>
    </section>

    <section class="section wrap">
      <div class="section-head reveal"><h2 class="h-sec">${t('ctaBandTitle')}</h2></div>
      <div class="cta-band">
        <a class="cta reveal" href="#/lab" style="--c:var(--sun)"><svg class="ic"><use href="#i-flask"/></svg><h3>${t('ctaLabT')}</h3><p>${t('ctaLabD')}</p></a>
        <a class="cta reveal" href="#/workflow" style="--c:#8FE3C9;transition-delay:90ms"><svg class="ic"><use href="#i-route"/></svg><h3>${t('ctaFlowT')}</h3><p>${t('ctaFlowD')}</p></a>
        <a class="cta reveal" href="#/quiz" style="--c:#FFB3C7;transition-delay:180ms"><svg class="ic"><use href="#i-trophy"/></svg><h3>${t('ctaQuizT')}</h3><p>${t('ctaQuizD')}</p></a>
      </div>
    </section>`;

    renderLib();
    counters();
    reveal();

    // Hero 手機輪播
    const phones = $$('.phone', app);
    let k = 0;
    const iv = setInterval(() => {
      if (!document.body.contains(phones[0])) return clearInterval(iv);
      k = (k + 1) % 4;
      phones.forEach((p, i) => $$('img', p).forEach((im, j) => im.classList.toggle('off', j !== (k + i) % 4)));
    }, 1800);

    $$('[data-fs]').forEach(b => b.onclick = () => { lib.subject = b.dataset.fs; $$('[data-fs]').forEach(x => x.setAttribute('aria-pressed', x === b)); renderLib(); });
    $$('[data-fm]').forEach(b => b.onclick = () => { lib.maker = b.dataset.fm; $$('[data-fm]').forEach(x => x.setAttribute('aria-pressed', x === b)); renderLib(); });
    $$('[data-view]').forEach(b => b.onclick = () => { lib.view = b.dataset.view; $$('[data-view]').forEach(x => x.setAttribute('aria-pressed', x === b)); renderLib(); });
    $$('[data-maker]').forEach(b => b.onclick = () => {
      lib.maker = b.dataset.maker; lib.subject = 'all'; lib.view = 'cards';
      $$('[data-fm]').forEach(x => x.setAttribute('aria-pressed', x.dataset.fm === lib.maker));
      $$('[data-fs]').forEach(x => x.setAttribute('aria-pressed', x.dataset.fs === 'all'));
      $$('[data-view]').forEach(x => x.setAttribute('aria-pressed', x.dataset.view === 'cards'));
      renderLib(); scrollToY($('#library'));
    });
    if (scrollToLib) setTimeout(() => scrollToY($('#library')), 60);
  };

  const scrollToY = (el) => { if (!el) return; const y = el.getBoundingClientRect().top + scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 76) - 10; window.scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };

  const renderLib = () => {
    const out = $('#libOut'); if (!out) return;
    if (lib.view === 'matrix') {
      const subs = lib.subject === 'all' ? SUBJECT_ORDER : [lib.subject];
      const mks = lib.maker === 'all' ? MAKER_ORDER : [lib.maker];
      out.innerHTML = `<div class="matrix" style="grid-template-columns:${document.documentElement.dataset.dev === 'mobile' ? '4.6rem' : '9rem'} repeat(${mks.length}, minmax(0,1fr))">
        <div></div>${mks.map(m => `<div class="mh" style="--c:${MAKERS[m].color}">${makerLogo(m)}${MAKERS[m].name}</div>`).join('')}
        ${subs.map(s => `<div class="rh" style="--c:${SUBJECTS[s].color}"><b>${subjName(s)}</b><small>${esc(L(SUBJECTS[s].title))}</small></div>` + mks.map(m => { const v = byId(`${m}-${s}`); return `<a class="mcell" href="#/v/${v.id}"><img src="${v.thumbs[2]}" alt="" loading="lazy"><div><span class="tag" style="--c:${STYLES[v.style].color}">${styleName(v.style)}</span><small>${fmt(v.dur)} · ${v.sceneCount} ${t('scenes')}</small></div></a>`; }).join('')).join('')}
      </div>`;
      sfx('whoosh');
      return;
    }
    const list = VIDEOS.filter(v => (lib.subject === 'all' || v.subject === lib.subject) && (lib.maker === 'all' || v.maker === lib.maker))
      .sort((a, b) => SUBJECT_ORDER.indexOf(a.subject) - SUBJECT_ORDER.indexOf(b.subject) || MAKER_ORDER.indexOf(a.maker) - MAKER_ORDER.indexOf(b.maker));
    out.innerHTML = list.length ? `<div class="grid">${list.map(vcard).join('')}</div>` : `<p class="empty">${t('noMatch')}</p>`;
    bindThumbCycle(out);
  };

  /* =========================================================
     影片頁
     ========================================================= */
  const vstate = { tab: 'style', page: {} };

  const viewVideo = (id) => {
    const v = byId(id); if (!v) return viewNotFound();
    const m = MAKERS[v.maker], s = SUBJECTS[v.subject], st = STYLES[v.style];
    const idx = VIDEOS.indexOf(v), prev = VIDEOS[(idx + VIDEOS.length - 1) % VIDEOS.length], next = VIDEOS[(idx + 1) % VIDEOS.length];
    const tabs = [['style', 'tabStyle', '#i-palette'], ['source', 'tabSource', '#i-book'], ['chapters', 'tabChapters', '#i-list'], ['compare', 'tabCompare', '#i-compare'], ['prompt', 'tabPrompt', '#i-wand']];
    document.title = `${L(s.title)}｜${m.name}｜${t('siteTitle')}`;
    app.innerHTML = `
    <div class="wrap">
      <header class="vp-head">
        <nav class="crumbs" aria-label="breadcrumb"><a href="#/">${t('navHome')}</a><span>›</span><a href="#/library">${t('back')}</a><span>›</span><span>${subjName(v.subject)}・${m.name}</span></nav>
        <h1 class="vp-title">${esc(L(s.title))}</h1>
        <div class="vp-tags">
          <span class="tag" style="--c:${m.color}">${m.name}</span>
          <span class="tag" style="--c:${s.color}">${subjName(v.subject)}</span>
          <span class="tag" style="--c:${st.color}">${styleName(v.style)}</span>
          <span class="tag" style="--c:#6F8597"><svg class="ic"><use href="#i-clock"/></svg>${fmt(v.dur)}</span>
          <span class="tag" style="--c:#6F8597"><svg class="ic"><use href="#i-layers"/></svg>${v.sceneCount} ${t('scenes')}</span>
        </div>
      </header>
      <div class="vp-layout">
        <div class="player-col">
          <div class="player" id="player">
            <button class="poster" id="poster" aria-label="${t('loadPlayer')}">
              ${v.thumbs.map((src, k) => `<img src="${src}" alt="" class="${k === 3 ? '' : 'off'}">`).join('')}
              <span class="big-play"><svg class="ic"><use href="#i-play"/></svg></span>
              <span class="hint">${t('loadPlayer')}<br><small style="font-weight:700;opacity:.9">${t('loadHint')}</small></span>
            </button>
          </div>
          <div class="player-tools">
            <button class="btn sm" id="pFull"><svg class="ic"><use href="#i-expand"/></svg>${t('fullscreen')}</button>
            <a class="btn sm" href="${v.file}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-external"/></svg>${t('openNew')}</a>
            <button class="btn sm ghost" id="pReload" hidden><svg class="ic"><use href="#i-replay"/></svg>${t('reload')}</button>
          </div>
          <nav class="vnav" aria-label="prev/next">
            <a href="#/v/${prev.id}"><svg class="ic"><use href="#i-left"/></svg><span>${t('prev')}：${subjName(prev.subject)}・${MAKERS[prev.maker].name}</span></a>
            <a href="#/v/${next.id}"><span>${t('next')}：${subjName(next.subject)}・${MAKERS[next.maker].name}</span><svg class="ic"><use href="#i-right"/></svg></a>
          </nav>
        </div>
        <div class="info-col">
          <div class="tabs" role="tablist" style="--tc:${m.color}">
            ${tabs.map(([k, lab, ic]) => `<button role="tab" id="tab-${k}" aria-label="${t(lab)}" title="${t(lab)}" aria-controls="panel" aria-selected="${vstate.tab === k}" data-tab="${k}"><svg class="ic"><use href="${ic}"/></svg><span class="${k === 'compare' || k === 'prompt' ? 'lbl-long' : ''}">${t(lab)}</span></button>`).join('')}
          </div>
          <div id="panel" class="tabpanel" role="tabpanel"></div>
        </div>
      </div>
    </div>`;

    /* 播放器：點擊才載入（每支約 3–7 MB） */
    const player = $('#player');
    let posterIv = setInterval(() => { const ims = $$('#poster img'); if (!ims.length) return clearInterval(posterIv); const on = ims.findIndex(i => !i.classList.contains('off')); ims[on].classList.add('off'); ims[(on + 1) % ims.length].classList.remove('off'); }, 2200);
    const load = () => {
      clearInterval(posterIv);
      player.innerHTML = `<iframe src="${v.file}" title="${esc(L(s.title))}・${m.name}" allow="autoplay; fullscreen" allowfullscreen loading="eager"></iframe>`;
      $('#pReload').hidden = false; sfx('open');
      return $('iframe', player);
    };
    $('#poster').onclick = () => { const f = load(); f && f.focus(); };
    $('#pReload').onclick = () => { const f = $('iframe', player); if (f) { f.src = v.file; sfx('whoosh'); } };
    $('#pFull').onclick = () => {
      if (!$('iframe', player)) load();
      const el = player;
      (el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullscreen ? Promise.resolve(el.webkitRequestFullscreen()) : Promise.reject()).catch(() => toast(t('fsFail')));
    };

    const renderTab = () => {
      const p = $('#panel');
      $$('[data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === vstate.tab));
      p.setAttribute('aria-labelledby', 'tab-' + vstate.tab);
      p.classList.remove('tabpanel'); void p.offsetWidth; p.classList.add('tabpanel');
      ({ style: tabStyle, source: tabSource, chapters: tabChapters, compare: tabCompare, prompt: tabPrompt })[vstate.tab](p, v);
    };
    $$('[data-tab]').forEach(b => b.onclick = () => { vstate.tab = b.dataset.tab; sfx('tap'); renderTab(); });
    $('.tabs').addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const ks = tabs.map(x => x[0]); let i = ks.indexOf(vstate.tab) + (e.key === 'ArrowRight' ? 1 : -1);
      vstate.tab = ks[(i + ks.length) % ks.length]; renderTab(); $(`#tab-${vstate.tab}`).focus();
    });
    renderTab();
  };

  /* --- 分頁：風格與手法 --- */
  const tabStyle = (p, v) => {
    const st = STYLES[v.style], m = MAKERS[v.maker];
    const canvasSize = v.maker === 'antigravity' ? '540 × 960' : '1080 × 1920';
    p.innerHTML = `
      <div class="style-hero" style="--c:${st.color}">
        <span class="tag" style="--c:${m.color}">${m.name}</span>
        <h2 style="margin-top:8px">${en() ? st.en : st.zh}</h2>
        <div class="en">${en() ? st.zh : st.en}</div>
        <p>${esc(L(v.visual))}</p>
        <div class="palette" role="group" aria-label="${t('palette')}">${v.palette.map(c => `<button type="button" style="background:${c}" data-c="${c}" title="${c}"><span>${c.toUpperCase()}</span></button>`).join('')}</div>
        <small class="muted">${t('palette')}</small>
      </div>
      <div class="info-row">
        <div class="info" style="--c:${m.color}"><svg class="ic"><use href="#i-music"/></svg><div><b>${t('music')}</b>${esc(L(v.music))}</div></div>
        <div class="info" style="--c:${st.color}"><svg class="ic"><use href="#i-film"/></svg><div><b>${t('canvas')}</b>9:16 · ${canvasSize}</div></div>
        <div class="info" style="--c:var(--leaf)"><svg class="ic"><use href="#i-sound"/></svg><div><b>${t('narration')}</b>Azure zh-TW-HsiaoChenNeural</div></div>
      </div>
      <h3 style="margin-top:var(--s6);font-size:1.35rem">${t('techTitle')}</h3>
      <p class="muted">${t('techHint')}</p>
      <div class="tech-cats">
        ${CAT_ORDER.filter(c => v.tech[c] && v.tech[c].length).map(c => `<section class="tech-cat" style="--c:${CATS[c].color}"><h3><i></i>${L(CATS[c])}<small class="muted" style="font-family:var(--f-body);font-size:.85rem">（${v.tech[c].length}）</small></h3>
          <div class="tech-list">${v.tech[c].map(([k, d]) => { const demo = window.LAB.has(k); return `<${demo ? 'button type="button"' : 'div'} class="tech-item" ${demo ? `data-demo="${k}"` : ''}><b>${demo ? '<svg class="ic"><use href="#i-play"/></svg>' : ''}${techName(k)}</b>${d ? `<small>${esc(d)}</small>` : ''}</${demo ? 'button' : 'div'}>`; }).join('')}</div></section>`).join('')}
      </div>`;
    $$('.palette button', p).forEach(b => b.onclick = () => copyText(b.dataset.c));
    $$('[data-demo]', p).forEach(b => b.onclick = () => openDemo(b.dataset.demo));
  };

  /* --- 分頁：原始教材 --- */
  const tabSource = (p, v) => {
    const s = SUBJECTS[v.subject], n = s.pages;
    let cur = vstate.page[v.subject] || 1;
    const src = (i, small) => `assets/pages/${v.subject}/p${String(i).padStart(2, '0')}${small ? '-s' : ''}.jpg`;
    p.innerHTML = `
      <div class="reader">
        <div class="reader-stage">
          <div class="reader-page" id="rpage" title="${t('zoomHint')}"><img id="rimg" src="${src(cur)}" alt="${esc(L(s.title))} 第 ${cur} 頁" width="1100" height="1460"></div>
          <div class="reader-bar">
            <button class="icon-btn" id="rPrev" aria-label="${t('prev')}"><svg class="ic"><use href="#i-left"/></svg></button>
            <span class="count" id="rCount">${cur} / ${n}</span>
            <input type="range" id="rRange" min="1" max="${n}" value="${cur}" aria-label="page">
            <button class="icon-btn" id="rNext" aria-label="${t('next')}"><svg class="ic"><use href="#i-right"/></svg></button>
          </div>
          <div class="strip" id="rStrip">${Array.from({ length: n }, (_, i) => `<button type="button" data-p="${i + 1}" aria-current="${i + 1 === cur}"><img src="${src(i + 1, true)}" alt="" loading="lazy" width="240" height="318"><span>${i + 1}</span></button>`).join('')}</div>
          <div class="reader-bar">
            <a class="btn sm" href="materials/${v.subject}.pdf" target="_blank" rel="noopener"><svg class="ic"><use href="#i-external"/></svg>${t('openPdf')}</a>
            <a class="btn sm ghost" href="materials/${v.subject}.pdf" download><svg class="ic"><use href="#i-download"/></svg>${t('downloadPdf')}</a>
            <small class="muted">${n} ${t('srcPages')} · ${t('zoomHint')}</small>
          </div>
        </div>
        <div class="points" style="--c:${s.color}">
          <h3><svg class="ic" style="color:${s.color}"><use href="#i-book"/></svg>${t('keyPoints')}</h3>
          <ol>${L(MATERIAL_POINTS[v.subject]).map(x => `<li><span>${esc(x)}</span></li>`).join('')}</ol>
          <p class="muted" style="margin-top:12px;font-size:.85rem">${t('keyPointsNote')}</p>
        </div>
      </div>`;
    const go = (i, dir) => {
      cur = Math.max(1, Math.min(n, i)); vstate.page[v.subject] = cur;
      const img = $('#rimg', p); img.src = src(cur); img.alt = `${L(s.title)} p.${cur}`;
      img.classList.remove('turn', 'turn-back'); void img.offsetWidth; img.classList.add(dir < 0 ? 'turn-back' : 'turn');
      $('#rCount', p).textContent = `${cur} / ${n}`; $('#rRange', p).value = cur;
      $$('#rStrip button', p).forEach(b => b.setAttribute('aria-current', +b.dataset.p === cur));
      const tb = $(`#rStrip button[data-p="${cur}"]`, p); if (tb) { const sEl = $('#rStrip', p); sEl.scrollTo({ left: tb.offsetLeft - sEl.clientWidth / 2 + tb.clientWidth / 2, behavior: 'smooth' }); }
      sfx('page');
    };
    $('#rPrev', p).onclick = () => go(cur - 1, -1);
    $('#rNext', p).onclick = () => go(cur + 1, 1);
    $('#rRange', p).oninput = (e) => go(+e.target.value, +e.target.value - cur);
    $$('#rStrip button', p).forEach(b => b.onclick = () => go(+b.dataset.p, +b.dataset.p - cur));
    $('#rpage', p).onclick = () => openModal(`<img class="zoom-img" src="${src(cur)}" alt="">`, true);
    // 觸控滑動翻頁
    let sx = null; const rp = $('#rpage', p);
    rp.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    rp.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); sx = null; });
  };

  /* --- 分頁：章節 --- */
  const tabChapters = (p, v) => {
    const sc = v.scenes, hasT = sc.length && sc[0].length > 1;
    const seg = sc.map((x, i) => { const st = hasT ? x[1] : i * v.dur / sc.length; const en_ = hasT ? (sc[i + 1] ? sc[i + 1][1] : v.dur) : (i + 1) * v.dur / sc.length; return en_ - st; });
    const cols = [MAKERS[v.maker].color, SUBJECTS[v.subject].color, STYLES[v.style].color, '#FFC93C'];
    p.innerHTML = `
      <h3 style="font-size:1.35rem">${t('chTitle')}</h3>
      <p class="muted">${hasT ? t('chNote') : t('chNoteAg')}</p>
      <div class="timeline-bar" aria-hidden="true">${seg.map((d, i) => `<i style="flex:${d};background:${cols[i % 4]}" title="${esc(sc[i][0])}"></i>`).join('')}</div>
      <div class="chapters">${sc.map((x, i) => `<div class="chapter" style="--i:${i};--c:${cols[i % 4]}"><span class="no">${i + 1}</span><span class="t">${esc(x[0])}</span>${x[2] ? `<button type="button" class="chip" data-pg="${parseInt(x[2], 10)}" title="${en() ? 'Open this textbook page' : '翻到教材這一頁'}"><svg class="ic"><use href="#i-book"/></svg>${en() ? 'p.' : '教材 p.'}${esc(x[2])}</button>` : ''}${hasT ? `<time>${fmt(x[1])}</time>` : ''}</div>`).join('')}</div>`;
    $$('[data-pg]', p).forEach(b => b.onclick = () => {
      vstate.page[v.subject] = Math.min(SUBJECTS[v.subject].pages, Math.max(1, +b.dataset.pg || 1));
      vstate.tab = 'source';
      $$('[data-tab]').forEach(x => x.setAttribute('aria-selected', x.dataset.tab === 'source'));
      p.classList.remove('tabpanel'); void p.offsetWidth; p.classList.add('tabpanel');
      tabSource(p, v); sfx('page');
    });
  };

  /* --- 分頁：三版比較 --- */
  const tabCompare = (p, v) => {
    const vs = MAKER_ORDER.map(mk => byId(`${mk}-${v.subject}`));
    const sets = vs.map(x => new Set(techKeys(x)));
    const shared = [...sets[0]].filter(k => sets.every(s => s.has(k)));
    const mine = [...sets[vs.indexOf(v)]].filter(k => vs.every((x, i) => x === v || !sets[i].has(k)));
    const maxD = Math.max(...vs.map(x => x.dur));
    p.innerHTML = `
      <h3 style="font-size:1.35rem;margin-bottom:var(--s4)">${t('cmpTitle')}</h3>
      <div class="compare">${vs.map(x => { const mm = MAKERS[x.maker]; return `<article class="cmp ${x === v ? 'cur' : ''}" style="--c:${mm.color}">
        <div class="top"><span>${mm.name}</span>${x === v ? `<small>${t('cmpCurrent')}</small>` : ''}</div>
        <img src="${x.thumbs[2]}" alt="" loading="lazy">
        <div class="b">
          <div class="row"><span>${en() ? 'Style' : '風格'}</span><b>${styleName(x.style)}</b></div>
          <div class="row"><span>${t('duration')}</span><b>${fmt(x.dur)}</b></div>
          <div class="row"><span>${t('sceneCount')}</span><b>${x.sceneCount}</b></div>
          <div class="row"><span>${en() ? 'Techniques' : '手法數'}</span><b>${techKeys(x).length}</b></div>
          ${x === v ? '' : `<a class="btn sm" href="#/v/${x.id}" style="margin-top:auto"><svg class="ic"><use href="#i-play"/></svg>${t('watchThis')}</a>`}
        </div></article>`; }).join('')}</div>
      <div class="venn">
        <h3>${t('cmpDur')}</h3>
        <div class="bars">${vs.map(x => `<div class="bar" style="--c:${MAKERS[x.maker].color}"><span>${MAKERS[x.maker].name}</span><span class="track"><span class="fill" data-w="${(x.dur / maxD * 100).toFixed(1)}"></span></span><span class="v">${fmt(x.dur)}</span></div>`).join('')}</div>
      </div>
      <div class="venn"><h3>${t('cmpShared')}</h3><div class="chips">${shared.length ? shared.map(k => chipTech(k)).join('') : `<span class="muted">${t('cmpNone')}</span>`}</div></div>
      <div class="venn"><h3>${t('cmpOnly')}（${MAKERS[v.maker].name}）</h3><div class="chips">${mine.map(k => chipTech(k)).join('') || '—'}</div></div>`;
    requestAnimationFrame(() => $$('.fill', p).forEach(f => f.style.width = f.dataset.w + '%'));
    $$('[data-demo]', p).forEach(b => b.onclick = () => openDemo(b.dataset.demo));
  };
  const chipTech = (k) => { const c = CATS[TECH[k].cat]; return window.LAB.has(k) ? `<button class="chip" data-demo="${k}"><span class="sw" style="--c:${c.color}"></span>${techName(k)}</button>` : `<span class="chip" style="cursor:default"><span class="sw" style="--c:${c.color}"></span>${techName(k)}</span>`; };

  /* --- 分頁：仿作提示詞 --- */
  const buildPrompt = ({ topic, styleKey, visual, music, tech, len = 5, ratio = '9:16', ref }) => {
    const st = STYLES[styleKey];
    const byCat = {}; tech.forEach(k => { const c = TECH[k] ? TECH[k].cat : 'graphic'; (byCat[c] = byCat[c] || []).push(techName(k)); });
    const techLines = CAT_ORDER.filter(c => byCat[c]).map(c => `  - ${L(CATS[c])}：${byCat[c].join('、')}`).join('\n');
    if (en()) return `Turn the textbook PDF “${topic}” into a ${ratio} vertical lesson video as ONE self-contained HTML file.

[Length & structure]
- About ${len} minutes, 8–14 scenes, one key idea per scene; show the source page number for each scene.
- Rewrite the textbook into spoken Traditional-Chinese narration (not a word-for-word reading).

[Visual style] ${st.en} (${st.zh})
- ${L(st.cue)}${visual ? `\n- Visual setting: ${visual}` : ''}

[Motion techniques]
${techLines}

[Audio]
- Narration: Azure TTS zh-TW-HsiaoChenNeural, medium rate; embed the MP3 as Base64 so the file plays offline.
- Music synthesised with Web Audio API${music ? ` (${music})` : ''}; duck the music under the voice; cut scenes on the beat.

[Player]
- 1080×1920 stage scaled to fit the window; narration audio is the master clock.
- Burned-in captions synced to speech; play/pause, draggable progress bar, chapter menu, fullscreen, mute toggle.
- Space = play/pause, ←/→ = ±10 s. Do not expose any API key in the output.
${ref ? `\n[Reference] Follow the approach of “${ref}”.` : ''}`;
    return `請把教材 PDF〈${topic}〉做成 ${ratio} 直式的 HTML 教學影片，輸出成「單一、可離線播放」的 HTML 檔。

【長度與結構】
- 約 ${len} 分鐘，8–14 幕，一幕只講一個重點；每幕標註教材來源頁碼。
- 把教材改寫成口語化的繁體中文旁白（不要逐字照念）。

【視覺風格】${st.zh}（${st.en}）
- ${L(st.cue)}${visual ? `\n- 視覺設定：${visual}` : ''}

【動畫手法】
${techLines}

【聲音】
- 旁白：Azure TTS zh-TW-HsiaoChenNeural、中等語速；MP3 以 Base64 內嵌，確保離線可播。
- 配樂用 Web Audio API 程式合成${music ? `（${music}）` : ''}；旁白出現時配樂自動降低音量；每幕起點對齊節拍。

【播放器】
- 1080×1920 畫布依視窗等比縮放；以旁白音軌當作時間主軸。
- 燒錄字幕與語音同步；播放／暫停、可拖曳進度條、章節選單、全螢幕、音效開關。
- 空白鍵播放／暫停，← → 前後 10 秒。成品中不可出現任何 API 金鑰。
${ref ? `\n【參考範本】做法參考「${ref}」。` : ''}`;
  };
  const tabPrompt = (p, v) => {
    const s = SUBJECTS[v.subject], m = MAKERS[v.maker];
    const txt = buildPrompt({ topic: L(s.title), styleKey: v.style, visual: L(v.visual), music: L(v.music), tech: techKeys(v), len: Math.round(v.dur / 60), ref: `${m.name}・${L(s.title)}` });
    p.innerHTML = `<h3 style="font-size:1.35rem">${t('promptTitle')}</h3><p class="muted" style="margin-bottom:var(--s4)">${t('promptLead')}</p>
      <div class="prompt-box"><button class="btn sm sun" id="cpy"><svg class="ic"><use href="#i-copy"/></svg>${t('copy')}</button><pre id="ptxt"></pre></div>`;
    $('#ptxt', p).textContent = txt;
    $('#cpy', p).onclick = () => copyText(txt);
  };

  const copyText = async (s) => {
    try { await navigator.clipboard.writeText(s); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = s; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (er) {} ta.remove(); }
    sfx('copy'); toast(`${t('copied')}${s.length < 12 ? '：' + s : ''}`);
  };

  /* ---------- 彈窗 ---------- */
  let modalLast = null;
  const openModal = (html, wide = false, onClose) => {
    modalLast = document.activeElement;
    const md = $('#modal'), card = $('#modalCard');
    card.classList.toggle('wide', wide);
    $('#modalBody').innerHTML = ''; if (typeof html === 'string') $('#modalBody').innerHTML = html; else $('#modalBody').appendChild(html);
    md.hidden = false; md._onClose = onClose; sfx('open');
    $('#modalClose').focus();
  };
  const closeModal = () => { const md = $('#modal'); if (md.hidden) return; md.hidden = true; md._onClose && md._onClose(); $('#modalBody').innerHTML = ''; sfx('close'); modalLast && modalLast.focus && modalLast.focus(); };
  $('#modalClose').onclick = closeModal;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const openDemo = (key) => {
    const c = window.LAB.card(key);
    openModal(c, false, () => c._stop());
    requestAnimationFrame(() => c._run());
  };

  /* =========================================================
     手法實驗室
     ========================================================= */
  const labState = { cat: 'all', q: '' };
  const viewLab = (focusKey) => {
    const keys = Object.keys(TECH).filter(k => window.LAB.has(k));
    const others = Object.keys(TECH).filter(k => !window.LAB.has(k));
    app.innerHTML = `<section class="section wrap" style="padding-top:var(--s6)">
      <div class="section-head"><div><span class="kicker"><span class="dot"></span>${t('labKicker')}</span><h1 class="h-sec">${t('labTitle')}</h1><p class="lead">${t('labLead')}</p></div></div>
      <div class="lab-filter">
        <label class="search"><svg class="ic"><use href="#i-search"/></svg><input type="search" id="labQ" placeholder="${t('searchPh')}" value="${esc(labState.q)}" aria-label="${t('searchPh')}"></label>
        <button class="chip" data-cat="all" aria-pressed="${labState.cat === 'all'}">${t('all')}（${keys.length}）</button>
        ${CAT_ORDER.map(c => `<button class="chip" data-cat="${c}" aria-pressed="${labState.cat === c}"><span class="sw" style="--c:${CATS[c].color}"></span>${L(CATS[c])}（${keys.filter(k => TECH[k].cat === c).length}）</button>`).join('')}
      </div>
      <div class="lab-grid" id="labGrid"></div>
      <div class="venn" style="margin-top:var(--s6)"><h3>${en() ? 'Also used in the videos (no live demo)' : '影片中也用到的其他手法（無即時示範）'}</h3><div class="chips">${others.map(k => chipTech(k)).join('')}</div></div>
    </section>`;
    const draw = () => {
      window.LAB.unobserveAll();
      const g = $('#labGrid'); g.innerHTML = '';
      const q = labState.q.trim().toLowerCase();
      const list = keys.filter(k => (labState.cat === 'all' || TECH[k].cat === labState.cat) && (!q || (TECH[k].zh + TECH[k].en + k + L(window.LAB.DEMOS[k].desc)).toLowerCase().includes(q)));
      if (!list.length) { g.innerHTML = `<p class="empty" style="grid-column:1/-1">${t('noDemo')}</p>`; return; }
      list.forEach((k, i) => { const c = window.LAB.card(k, i); g.appendChild(c); window.LAB.observe(c); });
    };
    $$('[data-cat]').forEach(b => b.onclick = () => { labState.cat = b.dataset.cat; $$('[data-cat]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
    let qt; $('#labQ').oninput = (e) => { clearTimeout(qt); qt = setTimeout(() => { labState.q = e.target.value; draw(); }, 200); };
    draw();
    if (focusKey && window.LAB.has(focusKey)) setTimeout(() => openDemo(focusKey), 300);
  };

  /* =========================================================
     製作流程 + 提示詞產生器
     ========================================================= */
  const STEPS = [
    { c: '#F26B3A', zh: ['讀懂原始教材', '擷取 PDF 文字與頁碼，找出每一節的核心概念、例題與考點。'], en: ['Read the textbook', 'Extract PDF text with page numbers; find the core ideas, examples and exam points.'],
      d: { claude: { zh: '讀取 PDF 內容後直接規劃 10–13 幕的分鏡與旁白。', en: 'Reads the PDF and plans 10–13 scenes with narration.' },
           codex: { zh: 'extract_sources.py 擷取文字（附逐頁 .txt），另寫「來源與內容校對.md」核對內容。', en: 'extract_sources.py dumps per-page text; a separate source-check file verifies content.' },
           antigravity: { zh: '依 PDF 整理出每科的「核心教學內容」，再規劃 6–8 幕。', en: 'Summarises each PDF’s core content, then plans 6–8 scenes.' } } },
    { c: '#E3A100', zh: ['寫分幕腳本與旁白稿', '一幕一個重點；把書面語改寫成口語旁白，並標註來源頁碼。'], en: ['Script scenes & narration', 'One idea per scene; rewrite into spoken narration and note source pages.'],
      d: { claude: { zh: '時間軸 JSON 內含每幕標題、起點與旁白結束時間（speechEnd）。', en: 'A timeline JSON stores each scene’s title, start and speechEnd.' },
           codex: { zh: 'lesson_*.json 存放逐幕標題、標籤、圖解類型、旁白與頁碼；另輸出 旁白稿.txt。', en: 'lesson_*.json holds titles, labels, diagram type, narration and page refs; plus a narration .txt.' },
           antigravity: { zh: '每幕以多句旁白組成（共 20–44 句），章節標題放進下拉選單。', en: 'Each scene is several narration lines (20–44 total); chapter titles feed the menu.' } } },
    { c: '#8A5CF0', zh: ['決定視覺風格', '依科目個性挑一種風格，先定色票、字體與質感。'], en: ['Choose a visual style', 'Match a style to the subject; lock palette, fonts and texture first.'],
      d: { claude: { zh: '六科六種風格（擬人、3D 卡通、電影寫實、微縮、POV、奇幻史詩），各配專屬字體。', en: 'Six subjects, six styles, each with its own fonts.' },
           codex: { zh: '每科 4 色主題色票，以「設計讀取＋五項刻度」記錄在 brief.md。', en: 'A 4-colour palette per subject; a design read with five dials in brief.md.' },
           antigravity: { zh: '每科獨立 CSS 變數色票與風格（含日系動漫風）。', en: 'Per-subject CSS-variable palettes and styles (including anime).' } } },
    { c: '#20A85A', zh: ['合成旁白語音', '用 TTS 產生旁白，並取得每句（或每段）的精確時間。'], en: ['Synthesise narration', 'Generate the voice with TTS and capture precise timing per line.'],
      d: { claude: { zh: 'Azure zh-TW-HsiaoChenNeural，中等語速；音軌即時間主軸。', en: 'Azure HsiaoChen, medium rate; the track is the master clock.' },
           codex: { zh: 'Azure rate -5%；用 bookmark 事件取得字幕切分的真實時間。', en: 'Azure at −5% rate; bookmark events give real caption timings.' },
           antigravity: { zh: '逐句合成 MP3（eastasia 區域），轉 Base64 內嵌。', en: 'Per-sentence MP3 (eastasia region), embedded as Base64.' } } },
    { c: '#1C8FE0', zh: ['寫動畫引擎', '依時間軸驅動每一幕的進場、強調與轉場，並確保可以任意拖曳。'], en: ['Build the motion engine', 'Drive entrances, emphasis and transitions from the timeline — and make seeking safe.'],
      d: { claude: { zh: 'DOM＋CSS 動畫＋SVG，Canvas 做顆粒等後製；暫停時凍結所有動畫。', en: 'DOM + CSS animation + SVG, Canvas for grain; pausing freezes every animation.' },
           codex: { zh: 'motion_engine.js 在 Canvas 上逐幀繪製圖解，畫面是播放時間的函數。', en: 'motion_engine.js draws diagrams on Canvas per frame as a function of time.' },
           antigravity: { zh: 'DOM＋SVG＋Canvas 粒子；字元彈出、計數器在進場時觸發。', en: 'DOM + SVG + Canvas particles; char-pops and counters fire on scene entry.' } } },
    { c: '#E8456B', zh: ['合成配樂與音效', '不用版權音樂：用 Web Audio API 依風格寫出配樂與轉場音效。'], en: ['Synthesise music & SFX', 'No licensed tracks: write the score and transition sounds with Web Audio API.'],
      d: { claude: { zh: '每科不同配器（木琴、古箏、合成器波…）；剪接卡在節拍上，人聲時自動降低配樂。', en: 'Different instruments per subject; cuts on the beat; music ducks under the voice.' },
           codex: { zh: '依主題選音階與節拍；章節轉換提示音；人聲期間低音量伴奏。', en: 'Theme-based scale and tempo; chapter cue tones; quiet bed under the voice.' },
           antigravity: { zh: '八音盒、古箏戰鼓、IMAX 弦樂 Pad、電子 Arp、動漫搖滾 Riff 等專屬引擎。', en: 'Music box, guzheng & drums, IMAX pads, arps, anime-rock riffs.' } } },
    { c: '#0FA38E', zh: ['字幕與播放控制', '把字幕燒進畫面，做好播放、拖曳、章節與全螢幕。'], en: ['Captions & controls', 'Burn captions into the frame; add play, scrub, chapters and fullscreen.'],
      d: { claude: { zh: '字幕依朗讀進度逐字亮起；音效按鈕、全螢幕、進度條。', en: 'Captions light up word by word; SFX toggle, fullscreen, scrub bar.' },
           codex: { zh: '字幕畫在 Canvas 上並另附 SRT；Tweaks 可關配樂、降低動態、關字幕。', en: 'Captions drawn on Canvas plus SRT; Tweaks for music, motion, captions.' },
           antigravity: { zh: '高對比字幕＋逐句進度條；Tweaks 可調移軸、光暈、LUT、掃描線、字幕大小。', en: 'High-contrast captions with per-line progress; Tweaks for tilt-shift, bloom, LUT, scanlines, caption size.' } } },
    { c: '#6F8597', zh: ['檢查與打包', '抽樣截圖檢查版面溢位與錯誤，最後打包成單一 HTML。'], en: ['QA & package', 'Sample frames for overflow and errors, then ship one HTML file.'],
      d: { claude: { zh: '輸出單一 HTML，並整理「風格與手法一覽」PDF。', en: 'Ships single HTML files plus a style-and-technique PDF.' },
           codex: { zh: 'inspect_lesson.py 抽樣 42 個畫面、檢查溢位與錯誤，存 qa 截圖與檢查報告.json。', en: 'inspect_lesson.py samples 42 frames, checks overflow/errors, saves QA shots and a report.' },
           antigravity: { zh: '每支實測時長皆超過 300 秒，整理成果總覽 PDF。', en: 'All videos measured over 300 s; summarised in a report PDF.' } } }
  ];

  const viewWorkflow = () => {
    const avg = (mk, f) => { const vs = VIDEOS.filter(v => v.maker === mk); return vs.reduce((a, v) => a + f(v), 0) / vs.length; };
    const rows = [
      [en() ? 'Canvas' : '畫布尺寸', '1080 × 1920', '1080 × 1920', '540 × 960'],
      [en() ? 'Rendering' : '繪製方式', en() ? 'DOM + CSS + SVG, Canvas post-FX' : 'DOM＋CSS＋SVG，Canvas 後製', en() ? 'Canvas 2D diagrams' : 'Canvas 2D 程式圖解', en() ? 'DOM + SVG + Canvas particles' : 'DOM＋SVG＋Canvas 粒子'],
      [en() ? 'Narration' : '旁白', 'Azure HsiaoChen', 'Azure HsiaoChen (−5%)', 'Azure HsiaoChen'],
      [en() ? 'Captions' : '字幕', en() ? 'Burned in, word-by-word' : '燒錄，逐字亮起', en() ? 'Drawn in frame + SRT' : '畫在畫面內＋SRT', en() ? 'Burned in + line progress' : '燒錄＋逐句進度條'],
      [en() ? 'Avg. length' : '平均片長', ...MAKER_ORDER.map(mk => fmt(avg(mk, v => v.dur)))],
      [en() ? 'Avg. scenes' : '平均幕數', ...MAKER_ORDER.map(mk => avg(mk, v => v.sceneCount).toFixed(1))],
      [en() ? 'Avg. techniques' : '平均手法數', ...MAKER_ORDER.map(mk => avg(mk, v => techKeys(v).length).toFixed(1))],
      [en() ? 'Extra outputs' : '附帶產出', en() ? 'Style PDF' : '風格與手法 PDF', en() ? 'SRT, narration, timeline.json, QA shots, Python source' : 'SRT、旁白稿、timeline.json、QA 截圖、Python 原始碼', en() ? 'Report PDF' : '成果總覽 PDF']
    ];
    const pickTech = ['char-pop', 'typewriter', 'highlighter', 'mask-reveal', 'counter', 'svg-stroke', 'chart-grow', 'shape-mask', 'wipe', 'zoom-through', 'glitch', 'push-in', 'parallax', 'beat-cut', 'stagger', 'spring', 'grain', 'vignette', 'tilt-shift', 'halftone'];
    const bs = { subject: 'civics', custom: '', style: 'anthropomorphic', tech: new Set(['char-pop', 'highlighter', 'counter', 'shape-mask', 'beat-cut', 'grain']), len: 5, ratio: '9:16' };
    app.innerHTML = `<section class="section wrap" style="padding-top:var(--s6)">
      <div class="section-head"><div><span class="kicker"><span class="dot"></span>${t('flowKicker')}</span><h1 class="h-sec">${t('flowTitle')}</h1><p class="lead">${t('flowLead')}</p></div></div>
      <div class="steps">${STEPS.map((s, i) => `<div class="step reveal" style="--c:${s.c}"><span class="n">${i + 1}</span><details ${i === 0 ? 'open' : ''}><summary><h3>${L({ zh: s.zh[0], en: s.en[0] })}</h3><p>${L({ zh: s.zh[1], en: s.en[1] })}</p></summary>
        <div class="detail">${MAKER_ORDER.map(mk => `<div style="--mc:${MAKERS[mk].color}"><b>${MAKERS[mk].name}</b>${esc(L(s.d[mk]))}</div>`).join('')}</div></details></div>`).join('')}</div>
    </section>
    <section class="section wrap">
      <div class="section-head reveal"><h2 class="h-sec">${t('flowCmpTitle')}</h2></div>
      <div class="cmp-table-wrap reveal"><table class="cmp-table"><thead><tr><th style="--c:var(--ink)"></th>${MAKER_ORDER.map(mk => `<th style="--c:${MAKERS[mk].color}">${MAKERS[mk].name}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(r => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    </section>
    <section class="section wrap" id="builder">
      <div class="section-head reveal"><div><span class="kicker"><svg class="ic"><use href="#i-wand"/></svg>${t('builderTitle')}</span><h2 class="h-sec">${t('builderTitle')}</h2><p class="lead">${t('builderLead')}</p></div></div>
      <div class="builder">
        <div class="card" style="padding:var(--s5)">
          <div class="field"><label for="bSub">${t('bSubject')}</label><select id="bSub">${SUBJECT_ORDER.map(k => `<option value="${k}">${subjName(k)}｜${esc(L(SUBJECTS[k].title))}</option>`).join('')}</select>
            <input type="text" id="bCustom" placeholder="${t('bCustom')}"></div>
          <div class="field"><span class="lbl">${t('bStyle')}</span><div class="chips" id="bStyle">${Object.entries(STYLES).map(([k, s]) => `<button type="button" class="chip" data-st="${k}" aria-pressed="${k === bs.style}"><span class="sw" style="--c:${s.color}"></span>${styleName(k)}</button>`).join('')}</div></div>
          <div class="field"><span class="lbl">${t('bTech')}</span><div class="chips" id="bTech">${pickTech.map(k => `<button type="button" class="chip" data-tk="${k}" aria-pressed="${bs.tech.has(k)}"><span class="sw" style="--c:${CATS[TECH[k].cat].color}"></span>${techName(k)}</button>`).join('')}</div></div>
          <div class="field"><span class="lbl">${t('bLen')}</span><div class="seg" id="bLen">${[3, 5, 8].map(n => `<button type="button" data-len="${n}" aria-pressed="${n === bs.len}">${n} ${t('minutes')}</button>`).join('')}</div></div>
          <div class="field"><span class="lbl">${t('bRatio')}</span><div class="seg" id="bRatio">${['9:16', '16:9'].map(r => `<button type="button" data-r="${r}" aria-pressed="${r === bs.ratio}">${r}</button>`).join('')}</div></div>
        </div>
        <div class="prompt-box"><button class="btn sm sun" id="bCopy"><svg class="ic"><use href="#i-copy"/></svg>${t('copy')}</button><pre id="bOut"></pre></div>
      </div>
    </section>`;
    const gen = () => { $('#bOut').textContent = buildPrompt({ topic: bs.custom.trim() || L(SUBJECTS[bs.subject].title), styleKey: bs.style, tech: [...bs.tech], len: bs.len, ratio: bs.ratio }); };
    $('#bSub').onchange = (e) => { bs.subject = e.target.value; sfx('tap'); gen(); };
    $('#bCustom').oninput = (e) => { bs.custom = e.target.value; gen(); };
    $$('[data-st]').forEach(b => b.onclick = () => { bs.style = b.dataset.st; $$('[data-st]').forEach(x => x.setAttribute('aria-pressed', x === b)); gen(); });
    $$('[data-tk]').forEach(b => b.onclick = () => { const k = b.dataset.tk; bs.tech.has(k) ? bs.tech.delete(k) : bs.tech.add(k); b.setAttribute('aria-pressed', bs.tech.has(k)); sfx('toggle', bs.tech.has(k)); gen(); });
    $$('[data-len]').forEach(b => b.onclick = () => { bs.len = +b.dataset.len; $$('[data-len]').forEach(x => x.setAttribute('aria-pressed', x === b)); gen(); });
    $$('[data-r]').forEach(b => b.onclick = () => { bs.ratio = b.dataset.r; $$('[data-r]').forEach(x => x.setAttribute('aria-pressed', x === b)); gen(); });
    $('#bCopy').onclick = () => copyText($('#bOut').textContent);
    $$('.step details').forEach(d => d.addEventListener('toggle', () => sfx(d.open ? 'open' : 'close')));
    gen(); reveal();
  };

  /* =========================================================
     風格挑戰
     ========================================================= */
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let quiz = null;
  const newQuiz = () => {
    const vids = shuffle(VIDEOS).slice(0, 10);
    const types = shuffle(['style', 'style', 'style', 'style', 'style', 'maker', 'maker', 'maker', 'subject', 'subject']);
    return {
      i: 0, score: 0, streak: 0, best: 0, answered: false,
      qs: vids.map((v, k) => {
        const type = types[k];
        let opts, ans;
        if (type === 'style') { ans = v.style; opts = shuffle([ans, ...shuffle(Object.keys(STYLES).filter(s => s !== ans)).slice(0, 3)]); }
        else if (type === 'maker') { ans = v.maker; opts = shuffle(MAKER_ORDER); }
        else { ans = v.subject; opts = shuffle([ans, ...shuffle(SUBJECT_ORDER.filter(s => s !== ans)).slice(0, 3)]); }
        return { v, type, ans, opts, shot: v.thumbs[1 + (Math.random() * 3 | 0)] };
      })
    };
  };
  const optLabel = (type, k) => type === 'style' ? styleName(k) : type === 'maker' ? MAKERS[k].name : `${subjName(k)}｜${L(SUBJECTS[k].title)}`;
  const viewQuiz = () => {
    if (!quiz || quiz.done) quiz = newQuiz();
    app.innerHTML = `<section class="section wrap" style="padding-top:var(--s6)">
      <div class="section-head"><div><span class="kicker"><span class="dot"></span>${t('quizKicker')}</span><h1 class="h-sec">${t('quizTitle')}</h1><p class="lead">${t('quizLead')}</p></div></div>
      <div id="quizBox"></div></section>`;
    drawQ();
  };
  const drawQ = () => {
    const box = $('#quizBox'); if (!box) return;
    const n = quiz.qs.length;
    if (quiz.i >= n) {
      quiz.done = true;
      const stars = Math.round(quiz.score / n * 5), msgI = quiz.score === n ? 3 : quiz.score >= 7 ? 2 : quiz.score >= 4 ? 1 : 0;
      box.innerHTML = `<div class="card result"><h2 style="font-size:2rem">${t('resultTitle')}</h2>
        <div class="stars" aria-label="${stars}/5">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</div>
        <div class="score">${quiz.score} / ${n}</div>
        <p class="lead" style="margin:0 auto">${t('resultMsg')[msgI]}</p>
        <p class="muted">${t('streak')} ${quiz.best}</p>
        <div class="hero-cta" style="justify-content:center"><button class="btn primary" id="qAgain"><svg class="ic"><use href="#i-replay"/></svg>${t('again')}</button><a class="btn" href="#/library"><svg class="ic"><use href="#i-film"/></svg>${t('navLibrary')}</a></div></div>`;
      sfx('fanfare'); confetti(quiz.score >= 7 ? 220 : 90);
      $('#qAgain').onclick = () => { quiz = newQuiz(); drawQ(); };
      return;
    }
    const q = quiz.qs[quiz.i];
    quiz.answered = false;
    box.innerHTML = `<div class="quiz">
      <div class="quiz-shot"><img src="${q.shot}" alt="quiz frame"></div>
      <div>
        <div class="qmeta"><span>${t('qNo', { n: quiz.i + 1, t: n })}</span><span>${t('score')} ${quiz.score}　🔥 ${t('streak')} ${quiz.streak}</span></div>
        <div class="qbar"><i style="width:${quiz.i / n * 100}%"></i></div>
        <h2 class="quiz-q">${t(q.type === 'style' ? 'qStyle' : q.type === 'maker' ? 'qMaker' : 'qSubject')}</h2>
        <div class="options" style="${q.opts.length === 3 ? 'grid-template-columns:1fr' : ''}">${q.opts.map((o, i) => `<button class="opt" data-o="${o}"><span class="k">${'ABCD'[i]}</span>${esc(optLabel(q.type, o))}</button>`).join('')}</div>
        <div class="feedback" id="qFb" aria-live="polite"></div>
      </div></div>`;
    const answer = (o, btn) => {
      if (quiz.answered) return; quiz.answered = true;
      const ok = o === q.ans;
      $$('.opt', box).forEach(b => { b.disabled = true; if (b.dataset.o === q.ans) b.classList.add('right'); });
      if (!ok) btn.classList.add('wrong');
      if (ok) { quiz.score++; quiz.streak++; quiz.best = Math.max(quiz.best, quiz.streak); sfx('success'); confetti(60); }
      else { quiz.streak = 0; sfx('fail'); }
      $('#qFb').innerHTML = `<p>${ok ? `<b style="color:var(--leaf)">${t('right')}</b>` : `<b style="color:var(--pink)">${t('wrong')}</b>${esc(optLabel(q.type, q.ans))}`}
        — ${MAKERS[q.v.maker].name}・${subjName(q.v.subject)}・${styleName(q.v.style)}</p>
        <div class="hero-cta" style="margin-top:10px"><button class="btn primary" id="qNext">${quiz.i + 1 >= n ? t('seeResult') : t('nextQ')}<svg class="ic"><use href="#i-right"/></svg></button><a class="btn sm ghost" href="#/v/${q.v.id}">${t('watchIt')}</a></div>`;
      $('#qNext').onclick = () => { quiz.i++; drawQ(); };
      $('#qNext').focus();
    };
    $$('.opt', box).forEach(b => b.onclick = () => answer(b.dataset.o, b));
    box.onkeydown = (e) => { const k = 'abcd'.indexOf(e.key.toLowerCase()); const b = $$('.opt', box)[k]; if (b && !quiz.answered) b.click(); };
  };

  const viewNotFound = () => { app.innerHTML = `<section class="section wrap"><h1 class="h-sec">404</h1><p class="lead">${en() ? 'Page not found.' : '找不到這個頁面。'}</p><a class="btn primary" href="#/">${t('navHome')}</a></section>`; };

  /* =========================================================
     路由
     ========================================================= */
  let lastRoute = '';
  const route = (force) => {
    const h = location.hash.replace(/^#/, '') || '/';
    const parts = h.split('/').filter(Boolean);
    const key = parts[0] || 'home';
    if (!force && h === lastRoute) return;
    const sameBase = lastRoute.split('/')[1] === parts[0] && key === 'v';
    lastRoute = h;
    window.LAB.unobserveAll();
    document.title = t('siteTitle');
    $$('[data-route]').forEach(a => a.classList.toggle('on', a.dataset.route === (key === 'v' ? 'library' : key)));
    if (key === 'home') viewHome(false);
    else if (key === 'library') viewHome(true);
    else if (key === 'v') viewVideo(parts[1]);
    else if (key === 'lab') viewLab(parts[1]);
    else if (key === 'workflow') viewWorkflow();
    else if (key === 'quiz') viewQuiz();
    else viewNotFound();
    if (key !== 'library' && !force) window.scrollTo({ top: 0, behavior: 'auto' });
    if (!force) sfx(sameBase ? 'page' : 'whoosh');
    app.focus({ preventScroll: true });
  };
  window.addEventListener('hashchange', () => route());

  /* 設定改變時（語言／裝置）重繪目前頁面 */
  document.addEventListener('settingschange', (e) => {
    const k = e.detail.key;
    if (k === 'lang' || k === 'reset') { I.apply(); const y = scrollY; route(true); window.scrollTo(0, y); }
    if ((k === 'device' || k === 'orient') && lib.view === 'matrix') renderLib();
  });

  /* 全域音效：點擊與滑過 */
  document.addEventListener('pointerdown', () => window.SFX.unlock(), { once: true });
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a');
    if (!el || el.closest('#settingsBody') || el.closest('.opt') || el.closest('.stage') || el.dataset.tab || el.id === 'poster' || el.id === 'btnSound' || el.matches('[data-tk], .palette button, [data-demo]')) return;
    sfx(el.matches('.chip, .seg button') ? 'tap' : 'click');
  });
  document.addEventListener('pointerover', (e) => { if (e.pointerType !== 'mouse') return; const el = e.target.closest('.btn, .chip, .mcell, .style-tile .uses a, .tech-item[data-demo]'); if (el && !el.contains(e.relatedTarget)) sfx('hover'); });

  /* ---------- PWA ---------- */
  let deferred = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; $('#installWrap').hidden = false; });
  $('#btnInstall').onclick = async () => { if (!deferred) return; deferred.prompt(); const r = await deferred.userChoice; if (r.outcome === 'accepted') { toast(t('installed')); $('#installWrap').hidden = true; } deferred = null; };
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {
      if (!navigator.serviceWorker.controller) reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'activated') toast(t('offlineReady')); }); });
    }).catch(() => {}));
  }

  I.apply();
  route(true);
  return { toast, confetti, route };
})();
