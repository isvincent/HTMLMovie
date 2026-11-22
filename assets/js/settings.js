/* ⚙️ 顯示與操作設定：全螢幕／音效／裝置／版面／語言／字體／色系 */
window.SETTINGS = (() => {
  const KEY = 'hva-settings';
  const DEFAULTS = { sound: true, device: 'auto', orient: 'auto', lang: 'zh', font: 'md', theme: 'system' };
  let state = { ...DEFAULTS };
  try { state = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  const root = document.documentElement;
  const mqDark = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : { matches: false, addEventListener() {} };
  const { t } = window.I18N;

  /* 各設定的選項定義 */
  const GROUPS = [
    { key: 'fullscreen', label: 'sFullscreen', color: '#F26B3A', opts: [['on', 'on', '⛶'], ['off', 'off', '▢']] },
    { key: 'sound', label: 'sSound', color: '#20A85A', opts: [[true, 'on', '🔊'], [false, 'off', '🔇']] },
    { key: 'device', label: 'sDevice', color: '#1C8FE0', opts: [['auto', 'auto', '✨'], ['mobile', 'mobile', '📱'], ['tablet', 'tablet', '📲'], ['desktop', 'desktop', '💻']] },
    { key: 'orient', label: 'sOrient', color: '#8A5CF0', opts: [['auto', 'auto', '🔄'], ['portrait', 'portrait', '▯'], ['landscape', 'landscape', '▭']] },
    { key: 'lang', label: 'sLang', color: '#E8456B', opts: [['zh', 'zh', '中'], ['en', 'en', 'A']] },
    { key: 'font', label: 'sFont', color: '#E3A100', opts: [['sm', 'fontSm', '<small style="font-size:.75em">A</small>'], ['md', 'fontMd', 'A'], ['lg', 'fontLg', '<b style="font-size:1.3em">A</b>']] },
    { key: 'theme', label: 'sTheme', color: '#0FA38E', opts: [['system', 'system', '🖥️'], ['light', 'light', '☀️'], ['dark', 'dark', '🌙']] }
  ];

  const isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  const value = (key) => key === 'fullscreen' ? (isFs() ? 'on' : 'off') : state[key];

  /* ---- 套用 ---- */
  const effective = () => {
    const w = window.innerWidth, h = window.innerHeight;
    const autoDev = w < 640 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop';
    const dev = state.device === 'auto' ? autoDev : state.device;
    let ori = state.orient === 'auto' ? (w >= h ? 'landscape' : 'portrait') : state.orient;
    if (state.orient === 'auto' && state.device !== 'auto') ori = state.device === 'desktop' ? 'landscape' : 'portrait';
    return { dev, ori, w };
  };
  const SIM_W = { mobile: { portrait: 420, landscape: 860 }, tablet: { portrait: 820, landscape: 1180 } };

  let badge;
  const applyLayout = () => {
    const { dev, ori, w } = effective();
    root.dataset.dev = dev;
    root.dataset.ori = ori;
    const simW = state.device !== 'auto' && SIM_W[dev] ? SIM_W[dev][ori] : 0;
    const sim = simW && w > simW + 40;
    root.classList.toggle('sim', !!sim);
    root.style.setProperty('--sim-w', sim ? simW + 'px' : 'none');
    if (!badge) { badge = document.createElement('div'); badge.className = 'sim-badge'; document.body.appendChild(badge); }
    badge.textContent = `${t('simNote')}：${t(dev)} · ${t(ori)} · ${simW}px`;
  };
  const applyTheme = () => {
    const dark = state.theme === 'dark' || (state.theme === 'system' && mqDark.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
  };
  const applyFont = () => { root.dataset.font = state.font; };
  const applySound = () => {
    window.SFX.setEnabled(state.sound);
    const b = document.getElementById('btnSound');
    if (b) {
      b.setAttribute('aria-pressed', String(state.sound));
      b.querySelector('use').setAttribute('href', state.sound ? '#i-sound' : '#i-mute');
      b.title = t('sSound') + '：' + t(state.sound ? 'on' : 'off');
    }
  };
  const applyLang = () => { window.I18N.setLang(state.lang); };

  const applyAll = () => { applyLang(); applyTheme(); applyFont(); applySound(); applyLayout(); };

  const emit = (key) => document.dispatchEvent(new CustomEvent('settingschange', { detail: { key, state: { ...state } } }));

  /* ---- 全螢幕 ---- */
  const toggleFullscreen = async (want) => {
    try {
      if (want && !isFs()) {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else throw new Error('no fs');
      } else if (!want && isFs()) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    } catch (e) { window.APP && APP.toast(t('fsFail')); }
  };

  const set = (key, val) => {
    if (key === 'fullscreen') { toggleFullscreen(val === 'on'); return; }
    if (state[key] === val) return;
    state[key] = val; save();
    if (key === 'theme') applyTheme();
    if (key === 'font') applyFont();
    if (key === 'sound') { applySound(); if (val) window.SFX.play('toggle', true); window.APP && APP.toast(t(val ? 'soundOn' : 'soundOff')); }
    if (key === 'device' || key === 'orient') applyLayout();
    if (key === 'lang') { applyLang(); applyLayout(); }
    render();
    emit(key);
  };

  /* ---- 面板 ---- */
  const body = document.getElementById('settingsBody');
  const render = () => {
    if (!body) return;
    body.innerHTML = GROUPS.map((g, i) => {
      const v = value(g.key);
      const cur = g.opts.find(o => o[0] === v);
      return `<div class="setting" style="--c:${g.color}">
        <div class="sh"><span class="n">${i + 1}</span><span>${t(g.label)}</span><span class="cur">${t('now')}${cur ? t(cur[1]) : ''}</span></div>
        <div class="opts" role="group" aria-label="${t(g.label)}" style="--n:${g.opts.length}">
          ${g.opts.map(o => `<button type="button" data-k="${g.key}" data-v="${o[0]}" aria-pressed="${o[0] === v}"><span class="ico" aria-hidden="true">${o[2]}</span><span>${t(o[1])}</span></button>`).join('')}
        </div></div>`;
    }).join('');
  };
  body && body.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    let v = b.dataset.v;
    if (v === 'true') v = true; else if (v === 'false') v = false;
    window.SFX.play('toggle', v !== false && v !== 'off');
    set(b.dataset.k, v);
  });

  const drawer = document.getElementById('settings');
  const backdrop = document.getElementById('settingsBackdrop');
  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    render();
    drawer.hidden = false; backdrop.hidden = false;
    window.SFX.play('open');
    setTimeout(() => { const f = drawer.querySelector('button[aria-pressed="true"]'); f && f.focus(); }, 50);
  };
  const close = () => {
    if (drawer.hidden) return;
    drawer.hidden = true; backdrop.hidden = true;
    window.SFX.play('close');
    lastFocus && lastFocus.focus && lastFocus.focus();
  };
  document.getElementById('btnSettings').addEventListener('click', open);
  document.getElementById('btnCloseSettings').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) close();
    if (e.key === 'Tab' && !drawer.hidden) {            // 焦點留在抽屜內
      const f = [...drawer.querySelectorAll('button:not([hidden])')].filter(x => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  document.getElementById('btnResetSettings').addEventListener('click', () => {
    const prevLang = state.lang;
    state = { ...DEFAULTS }; save();
    if (isFs()) toggleFullscreen(false);
    applyAll(); render();
    window.SFX.play('whoosh');
    window.APP && APP.toast(t('resetDone'));
    emit(prevLang !== state.lang ? 'lang' : 'reset');
  });
  document.getElementById('btnSound').addEventListener('click', () => set('sound', !state.sound));

  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => { render(); }));
  mqDark.addEventListener && mqDark.addEventListener('change', applyTheme);
  let rz;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(applyLayout); });
  window.addEventListener('orientationchange', applyLayout);

  /* 鍵盤快捷：F = 全螢幕、M = 音效 */
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select, [contenteditable]') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'f' || e.key === 'F') set('fullscreen', isFs() ? 'off' : 'on');
    if (e.key === 'm' || e.key === 'M') set('sound', !state.sound);
  });

  applyAll();
  return { get: (k) => value(k), set, open, close, render, applyLayout };
})();
