/* =========================================================
   手法實驗室：每種動畫手法的即時示範＋核心程式碼
   以 Web Animations API / CSS / Canvas 實作，與影片中的做法同原理
   ========================================================= */
window.LAB = (() => {
  const SP = 'cubic-bezier(.34,1.56,.64,1)';      // 彈性
  const OUT = 'cubic-bezier(.22,1,.36,1)';        // 減速
  const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
  const scene = (cls, big, small = '') => h(`<div class="sc ${cls}"><div><div class="big">${big}</div>${small ? `<div class="small">${small}</div>` : ''}</div></div>`);
  const sfx = (n, ...a) => window.SFX && SFX.play(n, ...a);

  /* 每個舞台的計時器管理，重播時清乾淨 */
  const stop = (st) => {
    (st._timers || []).forEach(clearTimeout); (st._ivs || []).forEach(clearInterval);
    if (st._raf) cancelAnimationFrame(st._raf);
    st.getAnimations && st.getAnimations({ subtree: true }).forEach(a => a.cancel());
    st._timers = []; st._ivs = []; st._raf = 0;
    st.innerHTML = ''; st.style.cssText = '';
  };
  const later = (st, fn, ms) => { const id = setTimeout(fn, ms); (st._timers = st._timers || []).push(id); return id; };
  const every = (st, fn, ms) => { const id = setInterval(fn, ms); (st._ivs = st._ivs || []).push(id); return id; };
  const loop = (st, fn) => { const t0 = performance.now(); const f = (n) => { if (fn((n - t0) / 1000) === false) return; st._raf = requestAnimationFrame(f); }; st._raf = requestAnimationFrame(f); };
  const canvas = (st) => { const c = document.createElement('canvas'); const r = st.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1); c.width = (r.width || 400) * dpr; c.height = (r.height || 220) * dpr; c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'; st.appendChild(c); const x = c.getContext('2d'); x.scale(dpr, dpr); return [c, x, r.width || 400, r.height || 220]; };
  const splitChars = (el, text) => { el.innerHTML = [...text].map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join(''); return [...el.children]; };
  const twoScenes = (st) => { const a = scene('a', '場景 A', 'Scene A'); const b = scene('b', '場景 B', 'Scene B'); st.append(b, a); return [a, b]; };
  const center = (st, inner) => { const w = h(`<div class="sc" style="background:transparent">${inner}</div>`); st.appendChild(w); return w; };

  const D = {};

  /* ================= 文字動畫 ================= */
  D['char-pop'] = {
    desc: { zh: '把標題拆成單字，每個字從基線下方彈上來，錯開 40ms 形成波浪。', en: 'Split the title into characters; each pops up from below the baseline, staggered by 40 ms.' },
    run(st) {
      const w = center(st, '<div class="demo-text" style="overflow:hidden;padding:.1em 0"></div>');
      splitChars(w.querySelector('.demo-text'), '所有權的物權特性').forEach((s, i) =>
        s.animate([{ transform: 'translateY(110%) rotate(8deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 650, delay: i * 45, easing: SP, fill: 'both' }));
      sfx('pop');
    },
    code: `chars.forEach((s, i) => s.animate(
  [{ transform: 'translateY(110%) rotate(8deg)', opacity: 0 },
   { transform: 'none', opacity: 1 }],
  { duration: 650, delay: i * 45,
    easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'both' }));`
  };
  D['typewriter'] = {
    desc: { zh: '依序加上一個字，搭配閃爍游標；可配合鍵盤音效。', en: 'Append one character at a time with a blinking caret; pair with key clicks.' },
    run(st) {
      const w = center(st, '<div class="demo-text" style="font-size:1.7rem"><span class="tw"></span><span class="caret" style="display:inline-block;width:3px;height:1em;background:currentColor;vertical-align:-.1em;margin-left:2px"></span></div>');
      w.querySelector('.caret').animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, iterations: Infinity, direction: 'alternate', easing: 'steps(1)' });
      const txt = '我到底是誰的？', out = w.querySelector('.tw'); let i = 0;
      every(st, () => { if (i < txt.length) { out.textContent += txt[i++]; sfx('type'); } }, 140);
    },
    code: `let i = 0;
const id = setInterval(() => {
  out.textContent += text[i++];
  if (i >= text.length) clearInterval(id);
}, 140);   /* 游標用 steps(1) 閃爍 */`
  };
  D['highlighter'] = {
    desc: { zh: '用 background-size 從 0% 長到 100%，像螢光筆一筆劃過重點字。', en: 'Grow background-size from 0% to 100% so a highlighter sweeps across the keyword.' },
    run(st) {
      const w = center(st, '<div style="font-size:1.45rem;font-weight:700;line-height:1.9;padding:0 24px">物權是對<span class="hlx">特定物</span>的直接支配，<br>可以對抗<span class="hlx">任何人</span>。</div>');
      w.querySelectorAll('.hlx').forEach((s, i) => {
        s.style.cssText = 'background:linear-gradient(transparent 55%,#FFC93C 55%) no-repeat;background-size:0% 100%;padding:0 3px;color:inherit';
        s.animate([{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: 700, delay: 300 + i * 650, easing: OUT, fill: 'forwards' });
      });
    },
    code: `.hl { background: linear-gradient(transparent 55%, #FFC93C 55%)
        no-repeat; background-size: 0% 100%; }
el.animate([{ backgroundSize: '0% 100%' },
            { backgroundSize: '100% 100%' }],
  { duration: 700, easing: 'ease-out', fill: 'forwards' });`
  };
  D['stamp'] = {
    desc: { zh: '由 3 倍大、旋轉狀態快速縮回定位，落下瞬間讓整個畫面震一下。', en: 'Scale down from 3× with rotation and shake the whole frame on impact.' },
    run(st) {
      const w = center(st, '<div style="font-family:var(--f-display);font-size:2rem;color:#E2402F;border:5px solid #E2402F;border-radius:14px;padding:6px 22px;transform:rotate(-12deg)">共 有</div>');
      const s = w.firstElementChild;
      s.animate([{ transform: 'scale(3) rotate(-30deg)', opacity: 0 }, { transform: 'scale(.92) rotate(-12deg)', opacity: 1, offset: .7 }, { transform: 'scale(1) rotate(-12deg)', opacity: 1 }], { duration: 420, delay: 200, easing: 'ease-in', fill: 'both' });
      later(st, () => { sfx('stamp'); st.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-5px,4px)' }, { transform: 'translate(4px,-3px)' }, { transform: 'translate(0,0)' }], { duration: 220 }); }, 500);
    },
    code: `stamp.animate([
  { transform: 'scale(3) rotate(-30deg)', opacity: 0 },
  { transform: 'scale(.92) rotate(-12deg)', opacity: 1, offset: .7 },
  { transform: 'scale(1) rotate(-12deg)' }], { duration: 420 });
/* 落地時畫面震動 */
stage.animate([{transform:'translate(-5px,4px)'}, ...], 220);`
  };
  D['scramble'] = {
    desc: { zh: '每一格先顯示隨機字元，從左到右依序「解碼」成正確文字。', en: 'Each slot flickers random glyphs, then resolves left to right.' },
    run(st) {
      const w = center(st, '<div class="demo-text" style="font-family:var(--f-mono);letter-spacing:.06em"></div>');
      const out = w.firstElementChild.firstElementChild || w.querySelector('.demo-text');
      const target = 'C3H4O3 線性規劃', pool = '!<>-_\\/[]{}=+*^?#ABCDEFXYZ0123456789';
      const t0 = performance.now();
      loop(st, () => {
        const p = (performance.now() - t0) / 1600;
        out.textContent = [...target].map((c, i) => (i / target.length < p || c === ' ') ? c : pool[Math.random() * pool.length | 0]).join('');
        if (Math.random() < .3 && p < 1) sfx('tick');
        return p < 1.05;
      });
    },
    code: `const p = elapsed / 1600;   // 0 → 1
el.textContent = [...target].map((c, i) =>
  i / target.length < p ? c
  : pool[Math.random() * pool.length | 0]).join('');`
  };
  D['particle-text'] = {
    desc: { zh: '先把文字畫在隱藏畫布上取樣像素，再讓粒子從四周飛到對應位置組成字。', en: 'Rasterise the text off-screen, sample pixels, and fly particles to those points.' },
    run(st) {
      const [c, x, W, H] = canvas(st);
      const off = document.createElement('canvas'); off.width = W; off.height = H; const o = off.getContext('2d');
      o.fillStyle = '#000'; o.font = `900 ${Math.min(W / 3.2, 92)}px "Noto Sans TC", sans-serif`; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('CH₂O', W / 2, H / 2);
      const data = o.getImageData(0, 0, W, H).data, pts = [];
      for (let y = 0; y < H; y += 4) for (let xx = 0; xx < W; xx += 4) if (data[(y * W + xx) * 4 + 3] > 128) pts.push({ tx: xx, ty: y, x: Math.random() * W, y: Math.random() * H, d: Math.random() * .6 });
      const cols = ['#FF7A3D', '#5B5BD6', '#2FBF9B', '#FFC93C'];
      loop(st, (t) => {
        x.clearRect(0, 0, W, H);
        pts.forEach((p, i) => {
          const k = Math.min(1, Math.max(0, (t - p.d) / 1.2)); const e = 1 - Math.pow(1 - k, 3);
          x.fillStyle = cols[i % 4]; x.beginPath(); x.arc(p.x + (p.tx - p.x) * e, p.y + (p.ty - p.y) * e, 1.8, 0, 7); x.fill();
        });
        return t < 2.2;
      });
      sfx('whoosh');
    },
    code: `off.fillText('CH₂O', W/2, H/2);       // 隱藏畫布
const d = off.getImageData(0,0,W,H).data;
for (y...) for (x...) if (d[(y*W+x)*4+3] > 128)
  pts.push({ tx:x, ty:y, x:rand(W), y:rand(H) });
// 每幀：pos = start + (target-start) * easeOutCubic(k)`
  };
  D['weight-shift'] = {
    desc: { zh: '可變字型的字重可以補間，標題由極細長到極粗，強調「重量感」。', en: 'Variable fonts let you tween font-weight — the title grows from hairline to black.' },
    run(st) {
      const w = center(st, '<div style="font-family:\'Noto Sans TC\',sans-serif;font-size:2.6rem;letter-spacing:.04em">實驗式</div>');
      w.firstElementChild.animate([{ fontWeight: 100, letterSpacing: '.3em' }, { fontWeight: 900, letterSpacing: '.02em' }], { duration: 1400, easing: OUT, fill: 'both', direction: 'alternate', iterations: 2 });
    },
    code: `/* 載入可變字重：Noto Sans TC wght@100..900 */
title.animate(
  [{ fontWeight: 100, letterSpacing: '.3em' },
   { fontWeight: 900, letterSpacing: '.02em' }],
  { duration: 1400, easing: 'ease-out', fill: 'both' });`
  };
  D['mask-reveal'] = {
    desc: { zh: '用 clip-path 把文字整個遮住，再由左往右（或由上往下）打開。', en: 'Hide the text with clip-path, then open it left-to-right (or top-down).' },
    run(st) {
      const w = center(st, '<div><div class="demo-text mr1" style="font-family:Georgia,serif;letter-spacing:.08em">THE LADY</div><div class="demo-text mr2" style="font-family:Georgia,serif;color:#C9324A">OR THE TIGER?</div></div>');
      ['.mr1', '.mr2'].forEach((s, i) => w.querySelector(s).animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 900, delay: 200 + i * 600, easing: OUT, fill: 'both' }));
    },
    code: `el.animate([{ clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0 0 0)' }],
  { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)',
    fill: 'both' });
/* 直書：inset(0 0 100% 0) → inset(0) 由上往下 */`
  };
  D['line-up'] = {
    desc: { zh: '每一行從下方 24px 處淡入，行與行之間錯開，適合表格與條列。', en: 'Each line fades in from 24 px below, staggered — great for lists and tables.' },
    run(st) {
      const w = center(st, '<div style="text-align:left;font-weight:700;font-size:1.1rem;line-height:2">' + ['CH₃COOH　示性式', 'C₂H₄O₂　分子式', 'CH₂O　實驗式', 'H–C–C=O　結構式'].map(s => `<div>${s}</div>`).join('') + '</div>');
      [...w.firstElementChild.children].forEach((l, i) => l.animate([{ transform: 'translateY(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, delay: 150 + i * 220, easing: OUT, fill: 'both' }));
    },
    code: `lines.forEach((l, i) => l.animate(
  [{ transform: 'translateY(24px)', opacity: 0 },
   { transform: 'none', opacity: 1 }],
  { duration: 600, delay: i * 220, fill: 'both' }));`
  };

  /* ================= 圖形與資訊 ================= */
  D['counter'] = {
    desc: { zh: '數字用 easeOut 從 0 滾到目標值，搭配千分位格式，視覺上很有份量。', en: 'Roll the number from 0 to the target with ease-out and thousands separators.' },
    run(st) {
      const w = center(st, '<div><div class="small" style="font-weight:700">民法第</div><div style="font-family:var(--f-display);font-size:3.4rem;line-height:1;color:#F26B3A"><span class="n">0</span></div><div class="small" style="font-weight:700">條・$<span class="m">0</span></div></div>');
      const n = w.querySelector('.n'), m = w.querySelector('.m'); const t0 = performance.now();
      loop(st, () => { const k = Math.min(1, (performance.now() - t0) / 1600), e = 1 - Math.pow(1 - k, 4); n.textContent = Math.round(767 * e); m.textContent = Math.round(6000 * e).toLocaleString(); if (k < 1 && Math.random() < .25) sfx('tick'); return k < 1; });
    },
    code: `const k = Math.min(1, elapsed / 1600);
const e = 1 - Math.pow(1 - k, 4);         // easeOutQuart
el.textContent = Math.round(target * e)
                     .toLocaleString();`
  };
  D['svg-stroke'] = {
    desc: { zh: '設定 stroke-dasharray 等於路徑長度，再把 dashoffset 從全長補間到 0，線條就會被「畫」出來。', en: 'Set stroke-dasharray to the path length and tween dashoffset to 0 — the line draws itself.' },
    run(st) {
      st.innerHTML = `<svg viewBox="0 0 400 220" style="position:absolute;inset:0;width:100%;height:100%"><path d="M30 170 C 90 40, 160 40, 200 110 S 320 190, 370 50" fill="none" stroke="#1C8FE0" stroke-width="7" stroke-linecap="round"/><path d="M350 40 l22 8 l-6 22" fill="none" stroke="#1C8FE0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="30" cy="170" r="10" fill="#F26B3A"/></svg>`;
      st.querySelectorAll('path').forEach((p, i) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: i ? 300 : 1500, delay: i ? 1500 : 100, easing: 'ease-in-out', fill: 'both' }); });
    },
    code: `const L = path.getTotalLength();
path.style.strokeDasharray = L;
path.animate([{ strokeDashoffset: L },
              { strokeDashoffset: 0 }],
  { duration: 1500, easing: 'ease-in-out', fill: 'both' });`
  };
  D['hand-circle'] = {
    desc: { zh: '用不規則、首尾沒有完全接上的橢圓路徑描邊圈住重點，就有手繪感。', en: 'A wobbly, slightly open ellipse stroked around the keyword reads as hand-drawn.' },
    run(st) {
      st.innerHTML = `<div class="sc" style="background:transparent"><div class="demo-text" style="font-size:1.9rem">妨害防止請求權</div></div><svg viewBox="0 0 400 220" style="position:absolute;inset:0;width:100%;height:100%"><path d="M70 120 C 60 70, 200 62, 330 80 C 380 90, 360 150, 250 160 C 150 168, 60 160, 75 105 C 82 88, 120 78, 150 76" fill="none" stroke="#E2402F" stroke-width="5" stroke-linecap="round"/></svg>`;
      const p = st.querySelector('path'), L = p.getTotalLength(); p.style.strokeDasharray = L;
      p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 900, delay: 300, easing: 'ease-out', fill: 'both' });
    },
    code: `<path d="M70 120 C60 70,200 62,330 80
         C380 90,360 150,250 160
         C150 168,60 160,75 105 C82 88,120 78,150 76"/>
/* 同 SVG 描邊：dashoffset 從全長 → 0 */`
  };
  D['chart-grow'] = {
    desc: { zh: '長條以 transform-origin: bottom 從 scaleY(0) 長到 1，並依序錯開出現。', en: 'Bars grow from scaleY(0) with transform-origin at the bottom, staggered.' },
    run(st) {
      const vals = [62, 34, 88, 50, 75], cols = ['#F26B3A', '#FFC93C', '#20A85A', '#1C8FE0', '#8A5CF0'];
      st.innerHTML = `<div style="position:absolute;inset:24px 30px 30px;display:flex;align-items:flex-end;gap:14px;border-bottom:3px solid currentColor">${vals.map((v, i) => `<div style="flex:1;height:${v}%;background:${cols[i]};border:2px solid #241E3A;border-radius:8px 8px 0 0;transform-origin:bottom;position:relative"><b style="position:absolute;top:-1.6em;left:0;right:0;text-align:center;font-family:var(--f-mono)">${v}</b></div>`).join('')}</div>`;
      [...st.firstElementChild.children].forEach((b, i) => b.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 800, delay: 150 + i * 120, easing: SP, fill: 'both' }));
    },
    code: `.bar { transform-origin: bottom; }
bars.forEach((b, i) => b.animate(
  [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
  { duration: 800, delay: i * 120,
    easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'both' }));`
  };
  D['orbit'] = {
    desc: { zh: '用 CSS 3D（preserve-3d）把原子球放在三維座標上，整組 rotateY 無限旋轉，就是可轉動的分子模型。', en: 'Place sphere divs in CSS 3D space (preserve-3d) and spin the group with rotateY.' },
    run(st) {
      const atoms = [[0, 0, 0, 34, '#333'], [70, 0, 0, 34, '#333'], [-40, -50, 20, 22, '#eee'], [-40, 40, 40, 22, '#eee'], [-50, 10, -50, 22, '#eee'], [120, -40, 0, 32, '#E8392B'], [120, 50, 0, 32, '#E8392B'], [160, 70, 30, 20, '#eee']];
      st.style.perspective = '700px';
      st.innerHTML = `<div class="mol" style="position:absolute;left:50%;top:50%;transform-style:preserve-3d">${atoms.map(a => `<i style="position:absolute;width:${a[3]}px;height:${a[3]}px;margin:${-a[3] / 2}px;border-radius:50%;background:radial-gradient(circle at 32% 30%,#fff,${a[4]} 45%,#000 120%);transform:translate3d(${a[0] - 50}px,${a[1]}px,${a[2]}px)"></i>`).join('')}</div>`;
      st.querySelector('.mol').animate([{ transform: 'rotateX(-15deg) rotateY(0deg)' }, { transform: 'rotateX(-15deg) rotateY(360deg)' }], { duration: 6000, iterations: Infinity });
      st.querySelectorAll('i').forEach(i => { i.animate([{ transform: i.style.transform + ' rotateY(0)' }, { transform: i.style.transform + ' rotateY(-360deg)' }], { duration: 6000, iterations: Infinity }); });
    },
    code: `.mol { transform-style: preserve-3d; }
atom.style.transform = 'translate3d(x, y, z)';
atom.style.background =
  'radial-gradient(circle at 32% 30%, #fff, #E8392B 45%, #000 120%)';
mol.animate([{transform:'rotateY(0)'},
             {transform:'rotateY(360deg)'}],
  { duration: 6000, iterations: Infinity });`
  };
  D['flow-particles'] = {
    desc: { zh: '粒子沿著一條路徑（管線、洋流、氣流）持續移動，用來表現「流向」。', en: 'Particles travel continuously along a path (pipe, current, airflow) to show direction.' },
    run(st) {
      const [c, x, W, H] = canvas(st);
      const path = (t) => [30 + t * (W - 60), H / 2 + Math.sin(t * Math.PI * 2) * H * .25];
      const ps = Array.from({ length: 70 }, () => ({ t: Math.random(), s: .08 + Math.random() * .12, o: (Math.random() - .5) * 18 }));
      loop(st, (tt) => {
        x.clearRect(0, 0, W, H);
        x.strokeStyle = 'rgba(28,143,224,.25)'; x.lineWidth = 34; x.lineCap = 'round'; x.beginPath();
        for (let i = 0; i <= 60; i++) { const [a, b] = path(i / 60); i ? x.lineTo(a, b) : x.moveTo(a, b); } x.stroke();
        ps.forEach(p => { p.t = (p.t + p.s / 60) % 1; const [a, b] = path(p.t); x.fillStyle = p.t > .6 ? '#F26B3A' : '#1C8FE0'; x.beginPath(); x.arc(a, b + p.o, 3.2, 0, 7); x.fill(); });
      });
    },
    code: `const path = t => [30 + t*(W-60), H/2 + Math.sin(t*2*PI)*H*.25];
particles.forEach(p => {
  p.t = (p.t + p.speed / 60) % 1;      // 沿路徑前進
  const [x, y] = path(p.t);
  ctx.arc(x, y + p.offset, 3, 0, 7);
});`
  };
  D['line-sweep'] = {
    desc: { zh: '目標函數 x + y = k 是一族平行線；讓 k 由小變大掃過可行解區域，最後一個碰到的頂點就是最佳解。', en: 'The objective x + y = k is a family of parallel lines; sweep k upward — the last vertex touched is optimal.' },
    run(st) {
      st.style.background = '#0A0F14';
      // 數學座標 → SVG：X = 40 + 36x，Y = 195 − 28y；可行解頂點 (0,0)(0,4)(3,5)(6,3)(7,0)，目標 x + y = k
      const X = (x) => 40 + 36 * x, Y = (y) => 195 - 28 * y;
      const poly = [[0, 0], [0, 4], [3, 5], [6, 3], [7, 0]];
      st.innerHTML = `<svg viewBox="0 0 400 220" style="position:absolute;inset:0;width:100%;height:100%"><g stroke="#203040">${Array.from({ length: 10 }, (_, i) => `<path d="M${X(i)} 0V220"/>`).join('')}<path d="M0 ${Y(0)}H400" stroke="#6F8597"/><path d="M${X(0)} 0V220" stroke="#6F8597"/></g><polygon points="${poly.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')}" fill="rgba(61,255,176,.18)" stroke="#3DFFB0" stroke-width="2"/>${poly.map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="#3DFFB0"/>`).join('')}<line class="ln" stroke="#FFB000" stroke-width="3" stroke-dasharray="8 6"/><g class="xh" opacity="0" style="transform-origin:${X(6)}px ${Y(3)}px"><circle cx="${X(6)}" cy="${Y(3)}" r="13" fill="none" stroke="#FF5A4E" stroke-width="3"/><path d="M${X(6)} ${Y(3) - 22}v12M${X(6)} ${Y(3) + 10}v12M${X(6) - 22} ${Y(3)}h12M${X(6) + 10} ${Y(3)}h12" stroke="#FF5A4E" stroke-width="3"/><text x="${X(6) + 18}" y="${Y(3) - 14}" fill="#FF5A4E" font-family="monospace" font-size="14" font-weight="700">(6, 3)</text></g><text class="k" x="290" y="28" fill="#FFD27A" font-family="monospace" font-size="18">x + y = 0</text></svg>`;
      const ln = st.querySelector('.ln'), kt = st.querySelector('.k'); const t0 = performance.now();
      loop(st, () => {
        const p = Math.min(1, (performance.now() - t0) / 2800), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const k = e * 9;                                   // 最大值在頂點 (6,3)：k = 9
        ln.setAttribute('x1', X(-1)); ln.setAttribute('y1', Y(k + 1));
        ln.setAttribute('x2', X(10)); ln.setAttribute('y2', Y(k - 10));
        kt.textContent = 'x + y = ' + k.toFixed(1);
        if (p >= 1) { st.querySelector('.xh').animate([{ opacity: 0, transform: 'scale(2)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 400, fill: 'forwards', easing: SP }); sfx('success'); return false; }
      });
    },
    code: `const X = x => 40 + 36*x, Y = y => 195 - 28*y;  // 數學→畫面
const e = p < .5 ? 2*p*p : 1 - (-2*p+2)**2 / 2;   // 平滑加減速
const k = e * 9;                                  // x + y = k
line.setAttribute('x1', X(-1)); line.setAttribute('y1', Y(k + 1));
line.setAttribute('x2', X(10)); line.setAttribute('y2', Y(k - 10));
// 斜率固定只移截距；結束時準星鎖定頂點 (6, 3)`
  };
  D['door-open'] = {
    desc: { zh: '門片以 transform-origin 為門軸做 rotateY，配合 perspective 就是立體開門；開門時刻意放慢製造懸念。', en: 'rotateY around a hinge with perspective; slow it down for suspense.' },
    run(st) {
      st.style.background = '#120A1F'; st.style.perspective = '600px';
      st.innerHTML = `<div style="position:absolute;inset:0;display:flex;justify-content:center;align-items:center;gap:40px">${[0, 1].map(i => `<div style="position:relative;width:90px;height:160px;border-radius:45px 45px 0 0;background:radial-gradient(circle at 50% 70%,#FFE3A0,#FF8A3D 40%,#120A1F 75%);border:4px solid #E8B84A"><div class="door" style="position:absolute;inset:0;border-radius:42px 42px 0 0;background:repeating-linear-gradient(90deg,#6b3a1d 0 14px,#5a2f17 14px 16px);transform-origin:${i ? 'right' : 'left'} center;border:2px solid #E8B84A"></div></div>`).join('')}</div>`;
      const d = st.querySelectorAll('.door');
      d[0].animate([{ transform: 'rotateY(0)' }, { transform: 'rotateY(-25deg)', offset: .6 }, { transform: 'rotateY(-100deg)' }], { duration: 3200, delay: 400, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'both' });
      d[1].animate([{ transform: 'rotate(0)' }, { transform: 'rotate(1.5deg)' }, { transform: 'rotate(-1.5deg)' }, { transform: 'rotate(0)' }], { duration: 300, delay: 400, iterations: 4 });
    },
    code: `.stage { perspective: 600px; }
.door { transform-origin: left center; }
door.animate([{ transform: 'rotateY(0)' },
  { transform: 'rotateY(-25deg)', offset: .6 },  // 先停住
  { transform: 'rotateY(-100deg)' }],
  { duration: 3200, easing: 'cubic-bezier(.7,0,.3,1)' });`
  };
  D['hud'] = {
    desc: { zh: '四角框線、REC 閃爍點、跳動時碼和準心，觀眾立刻進入「第一人稱」視角。', en: 'Corner brackets, a blinking REC dot, a ticking timecode and a crosshair put viewers in first person.' },
    run(st) {
      st.style.background = '#0A0F14'; st.style.color = '#FFB000';
      const br = (pos) => `<i style="position:absolute;${pos};width:30px;height:30px;border-color:#FFB000;border-style:solid;border-width:0"></i>`;
      st.innerHTML = br('left:14px;top:14px;border-left-width:3px;border-top-width:3px') + br('right:14px;top:14px;border-right-width:3px;border-top-width:3px') + br('left:14px;bottom:14px;border-left-width:3px;border-bottom-width:3px') + br('right:14px;bottom:14px;border-right-width:3px;border-bottom-width:3px') +
        `<div style="position:absolute;left:24px;top:22px;font-family:monospace;font-weight:700;display:flex;gap:8px;align-items:center"><b class="dot" style="width:12px;height:12px;border-radius:50%;background:#FF5A4E"></b>REC <span class="tc">00:00:00</span></div><svg viewBox="0 0 60 60" style="position:absolute;left:50%;top:50%;width:60px;margin:-30px"><circle cx="30" cy="30" r="14" fill="none" stroke="#FFB000" stroke-width="2"/><path d="M30 4v14M30 42v14M4 30h14M42 30h14" stroke="#FFB000" stroke-width="2"/></svg><div style="position:absolute;right:24px;bottom:22px;font-family:monospace">X 12.4  Y 08.9</div>`;
      st.querySelector('.dot').animate([{ opacity: 1 }, { opacity: .1 }], { duration: 600, iterations: Infinity, direction: 'alternate' });
      const tc = st.querySelector('.tc'), t0 = performance.now();
      every(st, () => { const s = (performance.now() - t0) / 1000; tc.textContent = `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }, 250);
    },
    code: `.corner { border-left: 3px solid; border-top: 3px solid; }
dot.animate([{opacity:1},{opacity:.1}],
  { duration: 600, iterations: Infinity, direction: 'alternate' });
setInterval(() => tc.textContent = fmt(elapsed), 250);`
  };

  /* ================= 轉場 ================= */
  const trans = (zh, en, kf, code, opt = {}) => ({
    desc: { zh, en },
    run(st) { const [a, b] = twoScenes(st); if (opt.prep) opt.prep(st, a, b); later(st, () => { sfx(opt.sfx || 'whoosh'); (opt.target === 'b' ? b : a).animate(kf, { duration: opt.dur || 900, easing: opt.ease || 'cubic-bezier(.7,0,.2,1)', fill: 'both' }); if (opt.also) opt.also(st, a, b); }, 500); },
    code
  });
  D['shape-mask'] = {
    desc: { zh: '新場景放在最上層，用 clip-path: circle() 從 0 擴張到蓋滿全畫面；也可改成菱形 polygon。', en: 'Put the next scene on top and grow clip-path: circle() from 0 to full; or use a diamond polygon.' },
    run(st) {
      const [a, b] = twoScenes(st); st.appendChild(b);
      const diamond = Math.random() < .5;
      b.style.clipPath = diamond ? 'polygon(50% 50%,50% 50%,50% 50%,50% 50%)' : 'circle(0% at 50% 50%)';
      later(st, () => { sfx('whoosh'); b.animate(diamond ? [{ clipPath: 'polygon(50% 50%,50% 50%,50% 50%,50% 50%)' }, { clipPath: 'polygon(50% -60%,160% 50%,50% 160%,-60% 50%)' }] : [{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }], { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'both' }); }, 500);
    },
    code: `next.animate([{ clipPath: 'circle(0% at 50% 50%)' },
              { clipPath: 'circle(75% at 50% 50%)' }],
  { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)' });
/* 菱形：polygon(50% -60%, 160% 50%, 50% 160%, -60% 50%) */`
  };
  D['wipe'] = trans('舊場景用 clip-path: inset() 由一側被「擦掉」，露出底下的新場景。', 'The old scene is wiped away with clip-path: inset(), revealing the next.',
    [{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)' }],
    `current.animate([{ clipPath: 'inset(0 0 0 0)' },
                 { clipPath: 'inset(0 0 0 100%)' }],
  { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)' });
/* 向上擦除：inset(0 0 100% 0) */`);
  D['zoom-through'] = trans('鏡頭衝進畫面中的一個點：舊場景放大到 8 倍並淡出，新場景從小放大進來。', 'Dive into a point: scale the old scene up 8× while fading, the new one scales in.',
    [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(8)', opacity: 0 }],
    `old.animate([{ transform:'scale(1)', opacity:1 },
             { transform:'scale(8)', opacity:0 }], 900);
next.animate([{ transform:'scale(.3)' },
              { transform:'scale(1)' }], 900);`,
    { also: (st, a, b) => b.animate([{ transform: 'scale(.3)' }, { transform: 'scale(1)' }], { duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }) });
  D['liquid'] = {
    desc: { zh: 'SVG feTurbulence + feDisplacementMap 製造水波扭曲，扭曲量升高同時淡出，就像墨水暈開或液體溶解。', en: 'SVG turbulence + displacement map; ramp the distortion up while fading for a liquid dissolve.' },
    run(st) {
      const id = 'liq' + Math.random().toString(36).slice(2, 7);
      st.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="0" class="dm"/></filter></svg>`);
      const [a, b] = twoScenes(st); a.style.filter = `url(#${id})`;
      const dm = st.querySelector('.dm');
      later(st, () => { sfx('whoosh'); const t0 = performance.now(); loop(st, () => { const p = Math.min(1, (performance.now() - t0) / 1300); dm.setAttribute('scale', p * 180); a.style.opacity = 1 - p * p; return p < 1; }); }, 500);
    },
    code: `<filter id="liq">
  <feTurbulence type="fractalNoise" baseFrequency=".015"/>
  <feDisplacementMap in="SourceGraphic" scale="0"/>
</filter>
// 每幀：dm.setAttribute('scale', p * 180);
//       old.style.opacity = 1 - p*p;`
  };
  D['page-flip'] = trans('以左邊為軸 rotateY(-180deg)，搭配 perspective 與 backface-visibility，像翻書一樣翻到下一頁。', 'Rotate -180° around the left edge with perspective — like turning a page.',
    [{ transform: 'perspective(900px) rotateY(0)' }, { transform: 'perspective(900px) rotateY(-180deg)' }],
    `old.style.transformOrigin = 'left center';
old.style.backfaceVisibility = 'hidden';
old.animate([{ transform: 'perspective(900px) rotateY(0)' },
  { transform: 'perspective(900px) rotateY(-180deg)' }], 900);`,
    { prep: (st, a) => { a.style.transformOrigin = 'left center'; a.style.backfaceVisibility = 'hidden'; }, sfx: 'page' });
  D['fold'] = {
    desc: { zh: '把舊場景切成上下兩半，各自以中線為軸 rotateX 摺起來。', en: 'Split the old scene into halves and fold each along the centre with rotateX.' },
    run(st) {
      const b = scene('b', '場景 B', 'Scene B'); st.appendChild(b);
      const half = (top) => { const w = h(`<div style="position:absolute;left:0;right:0;${top ? 'top:0' : 'bottom:0'};height:50%;overflow:hidden;transform-origin:${top ? 'bottom' : 'top'} center"></div>`); const a = scene('a', '場景 A', 'Scene A'); a.style.height = '200%'; a.style.inset = 'auto 0 auto 0'; a.style[top ? 'top' : 'bottom'] = '0'; w.appendChild(a); st.appendChild(w); return w; };
      const t = half(true), bo = half(false);
      later(st, () => { sfx('whoosh'); t.animate([{ transform: 'perspective(700px) rotateX(0)' }, { transform: 'perspective(700px) rotateX(90deg)' }], { duration: 700, easing: 'ease-in', fill: 'both' }); bo.animate([{ transform: 'perspective(700px) rotateX(0)' }, { transform: 'perspective(700px) rotateX(-90deg)' }], { duration: 700, easing: 'ease-in', fill: 'both' }); }, 500);
    },
    code: `top.style.transformOrigin = 'bottom center';
top.animate([{ transform:'perspective(700px) rotateX(0)' },
  { transform:'perspective(700px) rotateX(90deg)' }], 700);
bottom.animate([... rotateX(-90deg) ...], 700);`
  };
  D['whip-pan'] = trans('模擬攝影機快速甩過去：舊場景橫移出畫面並加上動態模糊，新場景從另一側甩進來。', 'Simulate a fast camera whip: slide out with motion blur while the next slides in.',
    [{ transform: 'translateX(0)', filter: 'blur(0)' }, { transform: 'translateX(-30%)', filter: 'blur(14px)', offset: .4 }, { transform: 'translateX(-110%)', filter: 'blur(24px)' }],
    `old.animate([{ transform:'translateX(0)', filter:'blur(0)' },
  { transform:'translateX(-110%)', filter:'blur(24px)' }],
  { duration: 500, easing: 'cubic-bezier(.7,0,.3,1)' });
next.animate([{ transform:'translateX(110%)', filter:'blur(24px)' },
  { transform:'none', filter:'blur(0)' }], 500);`,
    { dur: 500, also: (st, a, b) => b.animate([{ transform: 'translateX(110%)', filter: 'blur(24px)' }, { transform: 'translateX(0)', filter: 'blur(0)' }], { duration: 500, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'both' }) });
  D['glitch'] = {
    desc: { zh: '畫面被切成幾條橫帶並隨機錯位，加上 RGB 色彩分離與一瞬間的白閃。', en: 'Slice the frame into bands, offset them randomly, add RGB split and a white flash.' },
    run(st) {
      const [a, b] = twoScenes(st);
      a.querySelector('.big').style.textShadow = '3px 0 #ff004c, -3px 0 #00e5ff';
      later(st, () => {
        sfx('glitch'); let n = 0;
        every(st, () => {
          n++;
          a.style.clipPath = `inset(${Math.random() * 60}% 0 ${Math.random() * 30}% 0)`;
          a.style.transform = `translateX(${(Math.random() - .5) * 40}px)`;
          b.style.transform = `translateX(${(Math.random() - .5) * 20}px)`;
          if (n === 7) { a.remove(); b.style.transform = ''; const f = h('<div style="position:absolute;inset:0;background:#fff"></div>'); st.appendChild(f); f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }); }
        }, 60);
        later(st, () => (st._ivs || []).forEach(clearInterval), 60 * 7 + 10);
      }, 600);
    },
    code: `setInterval(() => {                 // 約 60ms 一格
  old.style.clipPath = \`inset(\${rand(60)}% 0 \${rand(30)}% 0)\`;
  old.style.transform = \`translateX(\${rand(-20,20)}px)\`;
}, 60);
title.style.textShadow = '3px 0 #ff004c, -3px 0 #00e5ff';
// 最後一格：白色全屏 opacity 1 → 0`
  };
  D['slash-wipe'] = {
    desc: { zh: '一道斜向白光劃過畫面，新場景沿著斜線從兩側切入，是日系動漫常見的「斬擊」轉場。', en: 'A diagonal white slash cuts across; the next scene is revealed along the diagonal.' },
    run(st) {
      const [a, b] = twoScenes(st); st.appendChild(b);
      b.style.clipPath = 'polygon(0 0,0 0,0 0,0 0)';
      const sl = h('<div style="position:absolute;left:-20%;top:50%;width:140%;height:10px;background:#fff;box-shadow:0 0 20px #fff,0 0 40px #ff2a54;transform:rotate(-24deg) scaleX(0);transform-origin:left"></div>'); st.appendChild(sl);
      later(st, () => {
        sfx('whoosh');
        sl.animate([{ transform: 'rotate(-24deg) scaleX(0)', opacity: 1 }, { transform: 'rotate(-24deg) scaleX(1)', opacity: 1, offset: .5 }, { transform: 'rotate(-24deg) scaleX(1)', opacity: 0 }], { duration: 500, fill: 'both' });
        b.animate([{ clipPath: 'polygon(0 0,0 0,0 0,0 0)' }, { clipPath: 'polygon(0 0,40% 0,0 100%,0 100%)', offset: .3 }, { clipPath: 'polygon(0 0,180% 0,100% 100%,0 100%)' }], { duration: 650, delay: 250, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'both' });
      }, 500);
    },
    code: `slash.animate([{ transform:'rotate(-24deg) scaleX(0)' },
               { transform:'rotate(-24deg) scaleX(1)' }], 250);
next.animate([
  { clipPath: 'polygon(0 0,0 0,0 0,0 0)' },
  { clipPath: 'polygon(0 0,180% 0,100% 100%,0 100%)' }], 650);`
  };

  /* ================= 鏡頭運動 ================= */
  D['push-in'] = {
    desc: { zh: '整個畫面以 10 秒以上的時間極緩慢放大 10–15%，觀眾不一定察覺，卻會感覺更投入。', en: 'Scale the frame 10–15% over many seconds — subtle, but it pulls viewers in.' },
    run(st) {
      const s = scene('a', '危急存亡之秋', '緩慢推近 Slow push-in'); st.appendChild(s);
      s.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18) translateY(-3%)' }], { duration: 6000, easing: 'linear', fill: 'both' });
    },
    code: `.cam { transform-origin: 50% 45%; }
cam.animate([{ transform: 'scale(1)' },
             { transform: 'scale(1.18) translateY(-3%)' }],
  { duration: 6000, easing: 'linear', fill: 'both' });`
  };
  D['parallax'] = {
    desc: { zh: '遠景移動少、近景移動多，就有景深。移動滑鼠或手指試試看！', en: 'Far layers move less, near layers more. Move your mouse or finger over it!' },
    run(st) {
      st.style.background = 'linear-gradient(#9FD8FF,#FFE9C7)';
      st.innerHTML = `<div class="ly" data-d="6" style="position:absolute;inset:-20px"><svg viewBox="0 0 400 220" preserveAspectRatio="none" style="width:100%;height:100%"><circle cx="300" cy="60" r="28" fill="#FFC93C"/></svg></div>
        <div class="ly" data-d="14" style="position:absolute;inset:-20px"><svg viewBox="0 0 400 220" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M-20 160 L60 90 L120 140 L200 70 L290 150 L360 100 L430 160 V240 H-20Z" fill="#8FB8A8"/></svg></div>
        <div class="ly" data-d="26" style="position:absolute;inset:-20px"><svg viewBox="0 0 400 220" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M-20 190 L80 140 L170 185 L260 130 L430 195 V240 H-20Z" fill="#4F7A5A"/></svg></div>
        <div class="ly" data-d="44" style="position:absolute;inset:-20px"><svg viewBox="0 0 400 220" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M-20 215 Q200 180 430 215 V240 H-20Z" fill="#2B3D2F"/><circle cx="80" cy="196" r="10" fill="#F26B3A"/></svg></div>`;
      const ls = [...st.querySelectorAll('.ly')];
      const move = (nx, ny) => ls.forEach(l => { const d = +l.dataset.d; l.style.transform = `translate(${nx * d}px,${ny * d * .4}px)`; });
      let auto = true;
      loop(st, (t) => { if (auto) move(Math.sin(t * .9), Math.cos(t * .7) * .5); });
      const onMove = (e) => { auto = false; const r = st.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; move(((p.clientX - r.left) / r.width - .5) * 2, ((p.clientY - r.top) / r.height - .5) * 2); };
      st.onpointermove = onMove; st.ontouchmove = onMove;
      st.onpointerleave = () => { auto = true; };
    },
    code: `layers.forEach(l => {
  const depth = +l.dataset.d;       // 遠 6 → 近 44
  l.style.transform =
    \`translate(\${nx * depth}px, \${ny * depth * .4}px)\`;
});`
  };
  D['head-bob'] = {
    desc: { zh: '畫面持續做微小的位移與旋轉（像走路或呼吸），營造手持攝影的第一人稱臨場感。', en: 'Tiny continuous translate + rotate (walking or breathing) for a hand-held POV feel.' },
    run(st) {
      D['hud'].run(st);
      const inner = h('<div style="position:absolute;inset:0"></div>'); [...st.childNodes].forEach(n => inner.appendChild(n)); st.appendChild(inner);
      inner.animate([{ transform: 'translate(0,0) rotate(0)' }, { transform: 'translate(-3px,4px) rotate(-.4deg)' }, { transform: 'translate(2px,-2px) rotate(.3deg)' }, { transform: 'translate(3px,3px) rotate(.2deg)' }, { transform: 'translate(0,0) rotate(0)' }], { duration: 3200, iterations: Infinity, easing: 'ease-in-out' });
    },
    code: `cam.animate([
  { transform: 'translate(0,0) rotate(0)' },
  { transform: 'translate(-3px,4px) rotate(-.4deg)' },
  { transform: 'translate(2px,-2px) rotate(.3deg)' },
  { transform: 'translate(0,0) rotate(0)' }],
  { duration: 3200, iterations: Infinity });`
  };

  /* ================= 節奏與時間 ================= */
  D['beat-cut'] = {
    desc: { zh: '把每一幕的切換時間對齊配樂節拍（例如 BPM 104 → 每拍 0.577 秒），畫面會有「卡點」的爽快感。開音效聽聽看！', en: 'Snap every cut to the music grid (e.g. 104 BPM → 0.577 s per beat). Turn sound on to hear it!' },
    run(st) {
      const cols = ['#FF6B5B', '#FFC93C', '#19A7A0', '#6EC1FF'], words = ['使用', '收益', '處分', '排他'];
      st.innerHTML = `<div class="sc" style="transition:none"><div class="big"></div></div><div style="position:absolute;left:0;right:0;bottom:10px;display:flex;justify-content:center;gap:8px">${[0, 1, 2, 3].map(() => '<i style="width:14px;height:14px;border-radius:50%;background:#0003;border:2px solid #241E3A"></i>').join('')}</div>`;
      const sc = st.querySelector('.sc'), big = sc.querySelector('.big'), dots = st.querySelectorAll('i'); let n = 0;
      const beat = () => { const k = n % 4; sc.style.background = cols[k]; big.textContent = words[k]; big.animate([{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 300, easing: OUT }); dots.forEach((d, i) => d.style.background = i === k ? '#241E3A' : '#0003'); sfx('beat', k === 0); n++; };
      beat(); every(st, beat, 577);
      later(st, () => (st._ivs || []).forEach(clearInterval), 577 * 12);
    },
    code: `const BPM = 104, beat = 60 / BPM;      // 0.577 s
scenes.forEach(s =>
  s.start = Math.round(s.start / beat) * beat);  // 吸附到拍點
/* 每幕起點都落在拍上，剪接就會「卡點」 */`
  };
  D['stagger'] = {
    desc: { zh: '一群元素用相同動畫，但依序延遲出場（可依距離中心遠近決定延遲），畫面更有節奏。', en: 'Same animation for a group, but each starts a bit later (here: by distance from centre).' },
    run(st) {
      const N = 8, M = 4, cols = ['#F26B3A', '#FFC93C', '#20A85A', '#1C8FE0', '#8A5CF0', '#E8456B'];
      st.innerHTML = `<div style="position:absolute;inset:20px;display:grid;grid-template-columns:repeat(${N},1fr);gap:8px">${Array.from({ length: N * M }, (_, i) => `<i style="border-radius:10px;background:${cols[i % 6]};border:2px solid #241E3A"></i>`).join('')}</div>`;
      [...st.firstElementChild.children].forEach((el, i) => { const x = i % N - (N - 1) / 2, y = (i / N | 0) - (M - 1) / 2; el.animate([{ transform: 'scale(0) rotate(-90deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, delay: Math.hypot(x, y) * 90, easing: SP, fill: 'both' }); });
    },
    code: `items.forEach((el, i) => {
  const dist = Math.hypot(col - cx, row - cy);
  el.animate([{ transform:'scale(0) rotate(-90deg)' },
              { transform:'none' }],
    { duration: 600, delay: dist * 90, fill: 'both' });
});`
  };
  D['spring'] = {
    desc: { zh: '物件掉下來會超過終點再回彈幾次，比直線移動更有重量與生命感。', en: 'Objects overshoot and bounce back a few times — more weight and life than linear moves.' },
    run(st) {
      st.innerHTML = `<div style="position:absolute;left:0;right:0;bottom:30px;height:3px;background:currentColor;opacity:.3"></div>` + ['📘', '🏠', '📱'].map((e, i) => `<div class="sp" style="position:absolute;bottom:33px;left:${22 + i * 25}%;font-size:3rem;line-height:1">${e}</div>`).join('');
      st.querySelectorAll('.sp').forEach((el, i) => el.animate([
        { transform: 'translateY(-260px)', offset: 0 }, { transform: 'translateY(0) scale(1.15,.85)', offset: .45 }, { transform: 'translateY(-50px) scale(.95,1.05)', offset: .62 },
        { transform: 'translateY(0) scale(1.05,.95)', offset: .78 }, { transform: 'translateY(-12px)', offset: .88 }, { transform: 'translateY(0)', offset: 1 }
      ], { duration: 1200, delay: i * 200, easing: 'ease-in', fill: 'both' }));
    },
    code: `el.animate([
  { transform: 'translateY(-260px)' },
  { transform: 'translateY(0) scale(1.15,.85)', offset: .45 },
  { transform: 'translateY(-50px)', offset: .62 },
  { transform: 'translateY(0)', offset: .78 },
  { transform: 'translateY(-12px)', offset: .88 },
  { transform: 'translateY(0)' }], 1200);`
  };
  D['loop'] = {
    desc: { zh: '角色上下浮動、眨眼、燭火搖曳等「無縫循環」讓靜態畫面持續有呼吸感。', en: 'Seamless loops — bobbing, blinking, flickering — keep still frames breathing.' },
    run(st) {
      st.innerHTML = `<div class="sc" style="background:#FFF3DF"><svg viewBox="0 0 120 120" width="150"><g class="body"><rect x="15" y="20" width="90" height="64" rx="12" fill="#6EC1FF" stroke="#2B2A33" stroke-width="5"/><rect x="28" y="32" width="64" height="40" rx="6" fill="#fff" stroke="#2B2A33" stroke-width="4"/><g class="eyes"><circle cx="48" cy="50" r="5" fill="#2B2A33"/><circle cx="72" cy="50" r="5" fill="#2B2A33"/></g><path d="M52 62 q8 6 16 0" stroke="#2B2A33" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="45" y="84" width="30" height="10" fill="#2B2A33"/><rect x="32" y="94" width="56" height="8" rx="4" fill="#2B2A33"/></g></svg></div>`;
      st.querySelector('.body').animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 1800, iterations: Infinity, easing: 'ease-in-out' });
      st.querySelector('.eyes').animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(1)', offset: .9 }, { transform: 'scaleY(.1)', offset: .95 }, { transform: 'scaleY(1)' }], { duration: 2600, iterations: Infinity, transformOrigin: '60px 50px' });
      st.querySelector('.eyes').style.transformOrigin = '60px 50px';
    },
    code: `body.animate([{ transform:'translateY(0)' },
              { transform:'translateY(-8px)' },
              { transform:'translateY(0)' }],
  { duration: 1800, iterations: Infinity });
eyes.animate([{ transform:'scaleY(1)' },
  { transform:'scaleY(1)', offset:.9 },
  { transform:'scaleY(.1)', offset:.95 },
  { transform:'scaleY(1)' }], { duration: 2600, iterations: Infinity });`
  };
  D['ease-out'] = {
    desc: { zh: '同樣的移動距離，換成不同的緩動曲線，感覺完全不同：linear 機械、ease-out 自然、spring 有彈性。', en: 'Same distance, different easing: linear feels robotic, ease-out natural, spring bouncy.' },
    run(st) {
      const rows = [['linear', 'linear', '#6F8597'], ['ease-out (cubic)', OUT, '#1C8FE0'], ['spring', SP, '#F26B3A']];
      st.innerHTML = rows.map((r, i) => `<div style="position:absolute;left:16px;right:16px;top:${26 + i * 64}px;height:44px;border-bottom:2px dashed #0002"><small style="position:absolute;left:0;top:-4px;font-family:monospace;font-weight:700">${r[0]}</small><i style="position:absolute;left:0;top:16px;width:28px;height:28px;border-radius:50%;background:${r[2]};border:2px solid #241E3A"></i></div>`).join('');
      st.querySelectorAll('i').forEach((b, i) => b.animate([{ left: '0%' }, { left: 'calc(100% - 28px)' }], { duration: 1400, delay: 200, easing: rows[i][1], fill: 'both' }));
    },
    code: `const easings = {
  linear: 'linear',
  easeOutCubic: 'cubic-bezier(.22,1,.36,1)',
  spring: 'cubic-bezier(.34,1.56,.64,1)'
};
ball.animate([{ left: 0 }, { left: '100%' }],
             { duration: 1400, easing: easings.easeOutCubic });`
  };

  /* ================= 後製質感 ================= */
  const baseScene = (st, kind = 'a', big = '後製質感', small = 'Post-processing') => { const s = scene(kind, big, small); st.appendChild(s); return s; };
  D['grain'] = {
    desc: { zh: '在最上層放一張每幀重新產生的雜訊畫布（低不透明度、overlay 混合），立刻有膠片味。', en: 'Overlay a noise canvas regenerated every frame (low opacity, overlay blend) for a film look.' },
    slider: { min: 0, max: 100, val: 45, apply: (st, v) => { const c = st.querySelector('canvas'); if (c) c.style.opacity = v / 100; } },
    run(st) {
      baseScene(st);
      const c = document.createElement('canvas'); c.width = 200; c.height = 120; c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:overlay;opacity:.45;image-rendering:pixelated'; st.appendChild(c);
      const x = c.getContext('2d'), img = x.createImageData(200, 120);
      loop(st, () => { for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; } x.putImageData(img, 0, 0); });
    },
    code: `for (let i = 0; i < d.length; i += 4) {
  const v = Math.random() * 255;
  d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
}
ctx.putImageData(img, 0, 0);          // 每幀重畫
/* canvas { mix-blend-mode: overlay; opacity: .45 } */`
  };
  D['vignette'] = {
    desc: { zh: '四周壓暗的放射狀漸層，把視線集中到畫面中央，電影感最便宜的來源。', en: 'A radial gradient darkening the edges focuses attention on the centre.' },
    slider: { min: 0, max: 100, val: 70, apply: (st, v) => { const o = st.querySelector('.vg'); if (o) o.style.background = `radial-gradient(ellipse at center, transparent ${70 - v * .45}%, rgba(0,0,0,${.2 + v / 110}) 100%)`; } },
    run(st) { baseScene(st, 'b'); st.appendChild(h('<div class="vg" style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,.84) 100%)"></div>')); },
    code: `.vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at center,
              transparent 40%, rgba(0,0,0,.85) 100%);
}`
  };
  D['halftone'] = {
    desc: { zh: '用重複的放射狀小圓點圖樣疊在畫面上（multiply 混合），重現漫畫印刷的網點。', en: 'A repeating dot pattern multiplied over the frame recreates comic-print halftone.' },
    slider: { min: 4, max: 18, val: 8, apply: (st, v) => { const o = st.querySelector('.ht'); if (o) o.style.backgroundSize = `${v}px ${v}px`; } },
    run(st) {
      st.appendChild(h('<div class="sc" style="background:linear-gradient(135deg,#FFD166,#FF2A54)"><div><div class="big" style="font-size:2.8rem;color:#fff;-webkit-text-stroke:2px #0b0d17">DILEMMA!</div></div></div>'));
      st.appendChild(h('<div class="ht" style="position:absolute;inset:0;pointer-events:none;mix-blend-mode:multiply;background-image:radial-gradient(circle,#0b0d17 30%,transparent 32%);background-size:8px 8px;-webkit-mask:linear-gradient(135deg,#000,transparent 70%);mask:linear-gradient(135deg,#000,transparent 70%)"></div>'));
    },
    code: `.halftone {
  background-image: radial-gradient(circle, #000 30%, transparent 32%);
  background-size: 8px 8px;
  mix-blend-mode: multiply;
  mask: linear-gradient(135deg, #000, transparent 70%);
}`
  };
  D['tilt-shift'] = {
    desc: { zh: '畫面上緣與下緣加上漸層遮罩的模糊（backdrop-filter），中間保持清晰，真實景物就像微縮模型。', en: 'Blur top and bottom bands with masked backdrop-filter, keep the middle sharp — real scenes look miniature.' },
    slider: { min: 0, max: 12, val: 6, apply: (st, v) => st.querySelectorAll('.tsb').forEach(o => { o.style.backdropFilter = o.style.webkitBackdropFilter = `blur(${v}px)`; }) },
    run(st) {
      st.style.background = '#8BCB6A';
      st.innerHTML = `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;filter:saturate(1.35)"><rect width="400" height="220" fill="#8BCB6A"/><path d="M0 120 Q200 90 400 130" stroke="#F2D49B" stroke-width="26" fill="none"/>${Array.from({ length: 14 }, (_, i) => `<g transform="translate(${(i * 61) % 380 + 10},${(i * 37) % 170 + 20})"><circle r="${10 + i % 3 * 3}" fill="#5FA84A" stroke="#2c5a2a" stroke-width="2"/></g>`).join('')}<g transform="translate(170,80)"><rect width="46" height="34" fill="#FFF3DF" stroke="#241E3A" stroke-width="2"/><path d="M-6 0 L23 -22 L52 0Z" fill="#F2614B" stroke="#241E3A" stroke-width="2"/></g><circle cx="240" cy="128" r="5" fill="#F26B3A"/></svg>
        <div class="tsb" style="position:absolute;left:0;right:0;top:0;height:45%;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);-webkit-mask:linear-gradient(#000,transparent);mask:linear-gradient(#000,transparent)"></div>
        <div class="tsb" style="position:absolute;left:0;right:0;bottom:0;height:45%;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);-webkit-mask:linear-gradient(transparent,#000);mask:linear-gradient(transparent,#000)"></div>`;
    },
    code: `.tilt-top, .tilt-bottom {
  position: absolute; left: 0; right: 0; height: 45%;
  backdrop-filter: blur(6px);
}
.tilt-top    { top: 0;    mask: linear-gradient(#000, transparent); }
.tilt-bottom { bottom: 0; mask: linear-gradient(transparent, #000); }
.scene { filter: saturate(1.35); }   /* 提高飽和更像模型 */`
  };
  D['crt'] = {
    desc: { zh: '重複的橫向細線模擬掃描線，再加上輕微的亮度閃爍，就是老式螢幕。', en: 'Repeating horizontal lines simulate scanlines; add subtle brightness flicker for an old monitor.' },
    slider: { min: 0, max: 100, val: 60, apply: (st, v) => { const o = st.querySelector('.crt'); if (o) o.style.opacity = v / 100; } },
    run(st) {
      st.style.background = '#0A0F14';
      st.appendChild(h('<div class="sc" style="background:transparent;color:#3DFFB0"><div><div class="big" style="font-family:var(--f-mono);text-shadow:0 0 12px #3DFFB0">MISSION 01</div><div class="small" style="font-family:var(--f-mono)">&gt; 載入限制條件…</div></div></div>'));
      const o = h('<div class="crt" style="position:absolute;inset:0;pointer-events:none;opacity:.6;background:repeating-linear-gradient(0deg,rgba(0,0,0,.55) 0 2px,transparent 2px 4px)"></div>'); st.appendChild(o);
      st.firstElementChild.animate([{ opacity: 1 }, { opacity: .86 }, { opacity: 1 }, { opacity: .93 }, { opacity: 1 }], { duration: 400, iterations: Infinity });
    },
    code: `.crt {
  background: repeating-linear-gradient(0deg,
    rgba(0,0,0,.55) 0 2px, transparent 2px 4px);
}
screen.animate([{opacity:1},{opacity:.86},{opacity:1}],
               { duration: 400, iterations: Infinity });`
  };
  D['light-leak'] = {
    desc: { zh: '幾團暖色光斑用 screen 混合在畫面邊緣緩慢飄移，模擬底片漏光。', en: 'Warm blobs drifting at the edges with screen blending mimic film light leaks.' },
    run(st) {
      baseScene(st, 'b', '臣本布衣', 'Light leak');
      st.firstElementChild.style.background = 'linear-gradient(135deg,#1b1a2e,#3a2a3e)';
      ['#FF8A3D', '#FFD27A', '#FF3D6E'].forEach((c, i) => {
        const b = h(`<div style="position:absolute;width:240px;height:240px;border-radius:50%;filter:blur(40px);mix-blend-mode:screen;background:${c};opacity:.7;left:${[-60, 220, 40][i]}px;top:${[-80, 40, 120][i]}px"></div>`); st.appendChild(b);
        b.animate([{ transform: 'translate(0,0)', opacity: .2 }, { transform: `translate(${[60, -50, 40][i]}px,${[30, -30, -40][i]}px)`, opacity: .75 }], { duration: 3000 + i * 700, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
      });
    },
    code: `.leak {
  width: 240px; height: 240px; border-radius: 50%;
  background: #FF8A3D; filter: blur(40px);
  mix-blend-mode: screen;
}
leak.animate([...], { duration: 3000, iterations: Infinity,
                      direction: 'alternate' });`
  };
  D['lut'] = {
    desc: { zh: '同一張畫面套不同的調色（filter 組合或疊色），情緒立刻改變。點按鈕切換。', en: 'Grade the same frame differently (filter stacks or colour overlays) to change the mood. Tap the buttons.' },
    run(st) {
      st.innerHTML = `<div class="g" style="position:absolute;inset:0;transition:filter .5s"><svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%"><defs><linearGradient id="skyL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC8F0"/><stop offset="1" stop-color="#F8D9A8"/></linearGradient></defs><rect width="400" height="220" fill="url(#skyL)"/><circle cx="300" cy="70" r="30" fill="#FFE08A"/><path d="M0 150 L80 90 L150 140 L230 80 L320 150 L400 110 V220 H0Z" fill="#4F7A5A"/><path d="M0 190 Q200 160 400 195 V220 H0Z" fill="#2B4A3A"/></svg></div>
        <div style="position:absolute;left:8px;bottom:8px;display:flex;gap:6px;flex-wrap:wrap">${[['原始', 'none'], ['暖橘', 'sepia(.45) saturate(1.5) hue-rotate(-12deg)'], ['冷青', 'saturate(.8) hue-rotate(20deg) brightness(.95) contrast(1.1)'], ['青橙', 'contrast(1.15) saturate(1.3) hue-rotate(-8deg)'], ['黑白', 'grayscale(1) contrast(1.2)']].map(([n, f], i) => `<button type="button" data-f="${f}" class="chip${i ? '' : ' on'}" style="padding:2px 10px;font-size:.8rem">${n}</button>`).join('')}</div>`;
      st.querySelectorAll('button').forEach(b => b.onclick = () => { st.querySelector('.g').style.filter = b.dataset.f; st.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); sfx('tap'); });
    },
    code: `const LUT = {
  warm: 'sepia(.45) saturate(1.5) hue-rotate(-12deg)',
  cold: 'saturate(.8) hue-rotate(20deg) contrast(1.1)',
  tealOrange: 'contrast(1.15) saturate(1.3) hue-rotate(-8deg)'
};
scene.style.filter = LUT.warm;`
  };
  D['letterbox'] = {
    desc: { zh: '上下黑邊把畫面裁成寬銀幕比例，一出現就有「電影開場」的儀式感。', en: 'Black bars crop the frame to a widescreen ratio — instant cinema.' },
    run(st) {
      baseScene(st, 'b', '一封千古奏表', 'Letterbox');
      st.firstElementChild.style.background = 'linear-gradient(#3a2a1a,#0B0A09)'; st.firstElementChild.style.color = '#F3D9A0';
      ['top', 'bottom'].forEach(p => { const b = h(`<div style="position:absolute;left:0;right:0;${p}:0;height:16%;background:#000"></div>`); st.appendChild(b); b.animate([{ transform: `translateY(${p === 'top' ? '-100%' : '100%'})` }, { transform: 'none' }], { duration: 900, delay: 300, easing: OUT, fill: 'both' }); });
    },
    code: `.bar { position: absolute; left: 0; right: 0;
       height: 16%; background: #000; }
top.animate([{ transform:'translateY(-100%)' },
             { transform:'none' }], 900);`
  };
  D['speed-lines'] = {
    desc: { zh: '用 repeating-conic-gradient 畫出放射線，中心再用放射狀遮罩挖空並旋轉，就是動漫的集中線。', en: 'repeating-conic-gradient rays with a radial mask hole, rotating — classic anime focus lines.' },
    run(st) {
      st.style.background = '#fffdf5';
      const s = h('<div style="position:absolute;inset:-60%;background:repeating-conic-gradient(from 0deg,#0b0d17 0 1.2deg,transparent 1.2deg 6deg);-webkit-mask:radial-gradient(circle,transparent 18%,#000 46%);mask:radial-gradient(circle,transparent 18%,#000 46%)"></div>'); st.appendChild(s);
      s.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(12deg)' }], { duration: 300, iterations: Infinity, direction: 'alternate', easing: 'steps(3)' });
      st.appendChild(h('<div class="sc" style="background:transparent"><div class="big" style="color:#ff2a54;-webkit-text-stroke:2px #0b0d17;font-size:2.6rem">兩難！</div></div>'));
    },
    code: `.speed {
  background: repeating-conic-gradient(from 0deg,
    #000 0 1.2deg, transparent 1.2deg 6deg);
  mask: radial-gradient(circle, transparent 18%, #000 46%);
}
speed.animate([{rotate:'0deg'},{rotate:'12deg'}],
  { duration: 300, iterations: Infinity, easing: 'steps(3)' });`
  };
  D['embers'] = {
    desc: { zh: 'Canvas 粒子從底部隨機升起，帶點左右飄動與閃爍，營造燭火、烽火或史詩氛圍。', en: 'Canvas particles rise with drift and flicker — candles, beacon fires, epic mood.' },
    run(st) {
      st.style.background = 'radial-gradient(ellipse at 50% 120%,#5a2a10,#0f0c0a 70%)';
      const [c, x, W, H] = canvas(st);
      const ps = Array.from({ length: 90 }, () => ({ x: Math.random() * W, y: H + Math.random() * H, v: 20 + Math.random() * 50, r: .8 + Math.random() * 2.2, p: Math.random() * 6 }));
      let last = performance.now();
      loop(st, (t) => {
        const now = performance.now(), dt = (now - last) / 1000; last = now;
        x.clearRect(0, 0, W, H);
        ps.forEach(p => { p.y -= p.v * dt; p.x += Math.sin(t * 2 + p.p) * .4; if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; } const a = .4 + .6 * Math.abs(Math.sin(t * 3 + p.p)); x.fillStyle = `rgba(255,${140 + (p.p * 15 | 0)},60,${a * (p.y / H)})`; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); });
      });
      st.appendChild(h('<div class="sc" style="background:transparent;color:#F6DC9B"><div class="big" style="font-family:serif;letter-spacing:.2em;text-shadow:0 0 18px #d9b15f">出師表</div></div>'));
    },
    code: `particles.forEach(p => {
  p.y -= p.speed * dt;                 // 往上飄
  p.x += Math.sin(t*2 + p.phase) * .4; // 左右擺動
  const a = .4 + .6 * Math.abs(Math.sin(t*3 + p.phase));
  ctx.fillStyle = \`rgba(255,160,60,\${a})\`;
  ctx.arc(p.x, p.y, p.r, 0, 7);
});`
  };

  /* ---------- 渲染一張示範卡 ---------- */
  const { t, L } = window.I18N;
  const usedBy = (key) => window.SITE_DATA.VIDEOS.filter(v => Object.values(v.tech).some(list => list.some(([k]) => k === key)));

  const card = (key, i = 0) => {
    const T = window.SITE_DATA.TECH[key], demo = D[key];
    const cat = window.SITE_DATA.CATS[T.cat];
    const users = usedBy(key);
    const el = document.createElement('article');
    el.className = 'demo-card'; el.style.setProperty('--c', cat.color); el.style.setProperty('--i', i); el.dataset.key = key;
    el.innerHTML = `
      <div class="dh"><div style="flex:1"><h3>${window.I18N.lang === 'en' ? T.en : T.zh}</h3><small>${window.I18N.lang === 'en' ? T.zh : T.en}</small></div><span class="tag" style="--c:${cat.color}">${L(cat)}</span></div>
      <div class="stage" aria-label="${T.zh} 示範"></div>
      <div class="db">
        <p>${demo ? L(demo.desc) : ''}</p>
        <div class="acts">
          <button class="btn sm sun" data-act="replay"><svg class="ic"><use href="#i-replay"/></svg>${t('replay')}</button>
          <button class="btn sm" data-act="code" aria-expanded="false"><svg class="ic"><use href="#i-code"/></svg>${t('code')}</button>
          ${demo && demo.slider ? `<label style="display:flex;align-items:center;gap:6px;flex:1;font-size:.85rem;font-weight:700">${t('intensity')}<input type="range" min="${demo.slider.min}" max="${demo.slider.max}" value="${demo.slider.val}"></label>` : ''}
        </div>
        <pre hidden><code></code></pre>
        ${users.length ? `<div class="usedby"><small style="font-weight:800;color:var(--ink-3)">${t('usedBy')}：</small>${users.map(v => `<a href="#/v/${v.id}" style="--mc:${window.SITE_DATA.MAKERS[v.maker].color}" title="${window.SITE_DATA.MAKERS[v.maker].name}">${window.I18N.lang === 'en' ? window.SITE_DATA.SUBJECTS[v.subject].en : window.SITE_DATA.SUBJECTS[v.subject].zh}・${window.SITE_DATA.MAKERS[v.maker].name.split(' ')[0]}</a>`).join('')}</div>` : ''}
      </div>`;
    el.querySelector('pre code').textContent = demo ? demo.code : '';
    const st = el.querySelector('.stage');
    const run = () => { stop(st); demo && demo.run(st); const r = el.querySelector('input[type=range]'); if (r && demo.slider) demo.slider.apply(st, +r.value); };
    el.querySelector('[data-act=replay]').onclick = run;
    el.querySelector('[data-act=code]').onclick = (e) => { const p = el.querySelector('pre'); p.hidden = !p.hidden; e.currentTarget.setAttribute('aria-expanded', String(!p.hidden)); window.SFX.play(p.hidden ? 'close' : 'open'); };
    const r = el.querySelector('input[type=range]'); if (r) r.oninput = () => demo.slider.apply(st, +r.value);
    el._run = run; el._stop = () => stop(st);
    return el;
  };

  /* 只在卡片進入視窗時才播放，離開就停止（省電） */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => ents.forEach(e => {
    const c = e.target;
    if (e.isIntersecting) { if (!c._played) { c._played = true; requestAnimationFrame(() => c._run()); } }
    else if (c._played) { c._played = false; c._stop(); }
  }), { threshold: .35 }) : null;
  const observe = (el) => { if (io) io.observe(el); else el._run(); };
  const unobserveAll = () => io && io.disconnect();

  return { DEMOS: D, card, observe, unobserveAll, stop, has: (k) => !!D[k] };
})();
