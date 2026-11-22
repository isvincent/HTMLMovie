/* 介面音效：全部以 Web Audio API 即時合成，不需音檔 */
window.SFX = (() => {
  let ctx = null, master = null, enabled = true, lastHover = 0;

  const ensure = () => {
    if (!enabled) return null;
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.32;
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  };

  /* 單音：type, 起始頻率, 結束頻率, 長度, 音量, 延遲 */
  const tone = (type, f1, f2, dur, vol = 0.5, delay = 0) => {
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, t0);
    if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  };

  const noise = (dur, vol = 0.3, from = 800, to = 4000, delay = 0, q = 0.8) => {
    const c = ensure(); if (!c) return;
    const t0 = c.currentTime + delay;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q;
    f.frequency.setValueAtTime(from, t0); f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur + 0.05);
  };

  const fx = {
    click()   { tone('triangle', 880, 660, 0.07, 0.35); },
    tap()     { tone('sine', 1200, 900, 0.05, 0.22); },
    hover()   { const n = performance.now(); if (n - lastHover < 70) return; lastHover = n; tone('sine', 1650, 1650, 0.03, 0.06); },
    toggle(on = true) { on ? (tone('square', 520, 520, 0.05, 0.12), tone('square', 780, 780, 0.07, 0.12, 0.05)) : (tone('square', 780, 780, 0.05, 0.12), tone('square', 520, 520, 0.07, 0.12, 0.05)); },
    pop()     { tone('sine', 300, 1100, 0.12, 0.4); },
    open()    { tone('triangle', 440, 880, 0.16, 0.3); noise(0.18, 0.08, 1200, 5000); },
    close()   { tone('triangle', 880, 440, 0.14, 0.25); },
    whoosh()  { noise(0.35, 0.22, 400, 3600, 0, 1.2); },
    page()    { noise(0.16, 0.18, 2500, 900, 0, 1.5); tone('sine', 300, 200, 0.08, 0.08); },
    success() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone('triangle', f, f, 0.22, 0.32, i * 0.08)); },
    fail()    { tone('sawtooth', 220, 140, 0.28, 0.22); tone('square', 180, 110, 0.3, 0.12, 0.06); },
    copy()    { tone('sine', 1320, 1320, 0.06, 0.25); tone('sine', 1760, 1760, 0.1, 0.25, 0.07); },
    tick()    { tone('square', 1000, 1000, 0.03, 0.1); },
    beat(accent = false) { tone('sine', accent ? 140 : 110, 50, 0.18, accent ? 0.7 : 0.45); noise(0.05, accent ? 0.14 : 0.06, 6000, 9000); },
    stamp()   { tone('sine', 160, 60, 0.18, 0.7); noise(0.08, 0.25, 900, 300); },
    glitch()  { for (let i = 0; i < 5; i++) tone('square', 200 + Math.random() * 1600, 100 + Math.random() * 800, 0.04, 0.12, i * 0.035); },
    type()    { tone('square', 1800 + Math.random() * 300, 1500, 0.02, 0.06); },
    fanfare() { [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone('triangle', f, f, 0.3, 0.3, i * 0.09)); noise(0.6, 0.08, 3000, 9000, 0.45); }
  };

  const play = (name, ...a) => { if (!enabled) return; try { fx[name] && fx[name](...a); } catch (e) {} };

  return {
    play,
    unlock: () => ensure(),
    setEnabled(v) { enabled = !!v; if (!enabled && ctx && ctx.state === 'running') ctx.suspend(); if (enabled) ensure(); },
    get enabled() { return enabled; }
  };
})();
