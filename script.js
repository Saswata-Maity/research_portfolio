/* ══════════════════════════════════════════════════════
   IRMINSUL TREE CANVAS ENGINE — Realistic bark edition
   Polygon-based branches: organic taper, bark texture,
   highlight/shadow rounding, flared base, root buttresses.
   Call window.setIrminsulProgress(0…1) to grow the tree.
══════════════════════════════════════════════════════ */
if (false) {
(function initTree(){
  const CW = 460, CH = 340;
  const canvas = document.getElementById('irminsulCanvas');
  if (!canvas) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = CW * dpr;
  canvas.height = CH * dpr;
  canvas.style.width  = CW + 'px';
  canvas.style.height = CH + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const W = CW, H = CH;
  const OX = W / 2, OY = H - 18;
  const MAX_D = 7;

  /* ── Seeded random (stable tree shape every load) ── */
  let _s = 98765;
  const sr  = () => { _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; };
  const srr = (a, b) => a + (b - a) * sr();

  /* ── Bezier helpers ── */
  const bPos = (p0,p1,p2,t) => (1-t)*(1-t)*p0 + 2*(1-t)*t*p1 + t*t*p2;
  const bTan = (p0,p1,p2,t) => 2*(1-t)*(p1-p0) + 2*t*(p2-p1);

  /* ── Sample a quadratic bezier into left/right polygon edges ── */
  function samplePolygon(x1,y1,cpx,cpy,x2,y2, widBase,widTip, lp, flareAmt) {
    const SEGS = Math.max(5, Math.round(16 * lp));
    const L = [], R = [], C = [];
    for (let i = 0; i <= SEGS; i++) {
      const t  = (i / SEGS) * lp;
      const bx = bPos(x1,cpx,x2,t);
      const by = bPos(y1,cpy,y2,t);
      const tx = bTan(x1,cpx,x2,t);
      const ty = bTan(y1,cpy,y2,t);
      const tl = Math.sqrt(tx*tx+ty*ty)||1;
      const nx = -ty/tl, ny = tx/tl;          // outward normal

      // Organic taper: power curve so base stays thick longer
      const frac = lp > 0 ? t/lp : 0;          // 0 at base, 1 at tip
      const taper = Math.pow(1 - frac*0.85, 0.55);
      // Base flare (buttress effect)
      const flare = flareAmt * Math.pow(Math.max(0, 1 - frac*5), 1.8);
      const w = widBase * taper + flare;

      L.push([bx + nx*w, by + ny*w]);
      R.push([bx - nx*w, by - ny*w]);
      C.push([bx, by, t, nx, ny, w]);
    }
    return { L, R, C };
  }

  /* ── Build branch data (seeded once) ── */
  const branches = [];

  function spawn(x, y, ang, len, wid, d) {
    if (d > MAX_D) return;
    const ex  = x + Math.sin(ang) * len;
    const ey  = y - Math.cos(ang) * len;
    const jit = srr(-0.13, 0.13);
    const cpx = x + Math.sin(ang + jit) * len * 0.54;
    const cpy = y - Math.cos(ang + jit*0.4) * len * 0.54;

    // Pre-bake bark grain lines (seeded, never changes)
    const bark = [];
    const bDensity = d < 2 ? 0.60 : d < 4 ? 0.40 : 0.22;
    const nKnots = 18;
    for (let k = 1; k < nKnots; k++) {
      if (sr() > bDensity) continue;
      const t   = k / nKnots;
      const bx  = bPos(x,cpx,ex,t);
      const by  = bPos(y,cpy,ey,t);
      const tx  = bTan(x,cpx,ex,t);
      const ty  = bTan(y,cpy,ey,t);
      const tl  = Math.sqrt(tx*tx+ty*ty)||1;
      const nx  = -ty/tl, ny = tx/tl;
      const side = sr() < 0.5 ? 1 : -1;          // left or right half
      const sf  = srr(0.1, 0.45) * side;          // start offset (fraction of w)
      const ef  = srr(0.5, 0.92) * side;          // end offset
      const slant = srr(-0.6, 0.6);               // diagonal along branch axis
      const alpha = srr(0.08, 0.22);
      const isShadow = sr() < 0.4;                // darker crack vs lighter ridge
      bark.push({ t, bx, by, nx, ny, sf, ef, slant, alpha, isShadow });
    }

    // Tip width tapers naturally; store base wid only
    branches.push({
      x1:x, y1:y, x2:ex, y2:ey, cpx, cpy,
      wid, d, ph: sr()*Math.PI*2, bark
    });

    if (d < MAX_D) {
      const nb = d < 2 ? 3 : d < 5 ? 3 : 2;
      const sp = d < 2 ? 0.52 : d < 4 ? 0.46 : 0.52;
      const lm = d < 2 ? 0.70 : 0.64;
      for (let i = 0; i < nb; i++) {
        const ao = (i - (nb-1)/2) * sp + srr(-0.06, 0.06);
        spawn(ex, ey, ang+ao, len*lm, Math.max(0.35, wid*0.62), d+1);
      }
    }
  }
  spawn(OX, OY, 0, H*0.235, W*0.028, 0);
  branches.sort((a,b) => a.d - b.d);

  /* ── Draw one branch as a filled tapered polygon with bark ── */
  function drawBranch(b, lp, p) {
    const { x1,y1,x2,y2,cpx,cpy,wid,d,bark } = b;
    if (lp <= 0.004) return;

    // Flare only on trunk (d=0) and main forks (d=1)
    const flare = d === 0 ? wid*0.70 : d === 1 ? wid*0.25 : 0;
    const { L, R, C } = samplePolygon(x1,y1,cpx,cpy,x2,y2, wid, wid*0.18, lp, flare);

    /* ── 1. Dark outline shadow (gives depth before fill) ── */
    const edgeAlpha = Math.max(0.25, 0.7 - (d/MAX_D)*0.45);
    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    L.forEach(pt => ctx.lineTo(pt[0], pt[1]));
    R.slice().reverse().forEach(pt => ctx.lineTo(pt[0], pt[1]));
    ctx.closePath();
    ctx.strokeStyle = `rgba(18,8,3,${edgeAlpha})`;
    ctx.lineWidth   = Math.max(0.5, wid * 0.22);
    ctx.lineJoin    = 'round';
    ctx.stroke();

    /* ── 2. Main fill — warm bark gradient ── */
    // Deeper branches are slightly lighter / more reddish
    const df = d / MAX_D;
    const rA = Math.round(62  + df*32),  gA = Math.round(35  + df*18),  bA = Math.round(14  + df*8);
    const rB = Math.round(95  + df*28),  gB = Math.round(55  + df*15),  bB = Math.round(22  + df*7);

    // Gradient runs along the branch length
    const tipX = bPos(x1,cpx,x2,lp), tipY = bPos(y1,cpy,y2,lp);
    const grd = ctx.createLinearGradient(x1,y1,tipX,tipY);
    grd.addColorStop(0,   `rgba(${rA},${gA},${bA},0.97)`);
    grd.addColorStop(0.55,`rgba(${rB},${gB},${bB},0.94)`);
    grd.addColorStop(1,   `rgba(${rB+12},${gB+8},${bB+5},0.88)`);

    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    L.forEach(pt => ctx.lineTo(pt[0], pt[1]));
    R.slice().reverse().forEach(pt => ctx.lineTo(pt[0], pt[1]));
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    /* ── 3. Left-side highlight (ambient occlusion feel) ── */
    if (C.length > 1) {
      ctx.beginPath();
      ctx.moveTo(L[0][0], L[0][1]);
      C.forEach(([cx,cy]) => ctx.lineTo(cx + (L[0][0]-C[0][0])*0.0, cy));
      // Blend left edge to center for a rounded-cylinder highlight
      L.forEach(pt => ctx.lineTo(pt[0], pt[1]));
      R.slice().reverse().forEach(pt => ctx.lineTo(pt[0], pt[1]));
      ctx.closePath();
      // Build side gradient left→center
      const hlGrd = ctx.createLinearGradient(L[0][0], L[0][1], R[0][0], R[0][1]);
      const hlA   = (0.18 - df*0.10).toFixed(2);
      hlGrd.addColorStop(0,   `rgba(255,210,140,${hlA})`);
      hlGrd.addColorStop(0.38,`rgba(255,200,120,${(+hlA*0.5).toFixed(2)})`);
      hlGrd.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = hlGrd;
      ctx.fill();
    }

    /* ── 4. Right-side shadow ── */
    if (C.length > 1) {
      const shGrd = ctx.createLinearGradient(L[0][0], L[0][1], R[0][0], R[0][1]);
      const shA   = (0.22 - df*0.10).toFixed(2);
      shGrd.addColorStop(0,   'rgba(0,0,0,0)');
      shGrd.addColorStop(0.62,`rgba(8,3,1,${(+shA*0.4).toFixed(2)})`);
      shGrd.addColorStop(1,   `rgba(8,3,1,${shA})`);
      ctx.beginPath();
      ctx.moveTo(L[0][0], L[0][1]);
      L.forEach(pt => ctx.lineTo(pt[0], pt[1]));
      R.slice().reverse().forEach(pt => ctx.lineTo(pt[0], pt[1]));
      ctx.closePath();
      ctx.fillStyle = shGrd;
      ctx.fill();
    }

    /* ── 5. Bark grain lines ── */
    if (d <= 4) {
      ctx.lineCap = 'round';
      bark.forEach(bk => {
        if (bk.t > lp * 0.93) return;   // only on revealed portion
        const frac  = lp > 0 ? bk.t/lp : 0;
        const taper = Math.pow(1 - frac*0.85, 0.55);
        const w     = wid * taper;
        const baseFlare = d===0 ? wid*0.70*Math.pow(Math.max(0,1-frac*5),1.8) : 0;
        const wEff  = w + baseFlare;

        // Start and end of grain scratch (in normal direction + slight slant)
        const ax = bk.bx + bk.nx*(wEff*bk.sf)  + (bk.ny * bk.slant * wEff * 0.3);
        const ay = bk.by + bk.ny*(wEff*bk.sf)  - (bk.nx * bk.slant * wEff * 0.3);
        const bx2= bk.bx + bk.nx*(wEff*bk.ef)  + (bk.ny * bk.slant * wEff * 0.3);
        const by2= bk.by + bk.ny*(wEff*bk.ef)  - (bk.nx * bk.slant * wEff * 0.3);

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx2, by2);
        ctx.strokeStyle = bk.isShadow
          ? `rgba(15,6,2,${bk.alpha})`
          : `rgba(145,88,38,${bk.alpha * 0.6})`;
        ctx.lineWidth = d < 2 ? 0.8 : 0.5;
        ctx.stroke();
      });
    }

    /* ── 6. Blossoms at outer tips ── */
    if (b.d >= MAX_D - 1 && lp > 0.62) {
      const bp    = (lp - 0.62) / 0.38;
      const pulse = 1 + Math.sin(performance.now()*0.0023 + b.ph) * 0.07;
      const sz    = bp * (b.d === MAX_D ? W*0.020 : W*0.013) * pulse;
      if (sz < 0.5) return;

      ctx.save();
      ctx.shadowColor = 'rgba(255,192,232,0.98)';
      ctx.shadowBlur  = 15*bp;
      const bg = ctx.createRadialGradient(b.x2,b.y2,0, b.x2,b.y2,sz);
      bg.addColorStop(0,    `rgba(255,255,255,${(bp*0.98).toFixed(2)})`);
      bg.addColorStop(0.38, `rgba(255,182,224,${(bp*0.92).toFixed(2)})`);
      bg.addColorStop(0.78, `rgba(218,98,182,${(bp*0.52).toFixed(2)})`);
      bg.addColorStop(1,    'rgba(178,58,158,0)');
      ctx.beginPath();
      ctx.arc(b.x2, b.y2, sz, 0, Math.PI*2);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.restore();
    }
  }

  /* ── Falling petals ── */
  const petals   = [];
  let   lastPetal = 0;
  const outerB    = branches.filter(b => b.d >= MAX_D - 2);

  function addPetals(ts, p) {
    if (p < 0.62 || ts - lastPetal < 150) return;
    lastPetal = ts;
    for (let i = 0; i < 4; i++) {
      const b = outerB[Math.floor(Math.random() * outerB.length)];
      if (!b) continue;
      petals.push({
        x: b.x2 + (Math.random()-0.5)*56, y: b.y2 + (Math.random()-0.5)*36,
        vx:(Math.random()-0.5)*1.3,        vy: Math.random()*0.9+0.35,
        rot:Math.random()*Math.PI*2,        rv:(Math.random()-0.5)*0.09,
        sz: Math.random()*4+3, op: Math.random()*0.35+0.65, hue: Math.random()*42+296
      });
    }
    while (petals.length > 140) petals.shift();
  }

  let progress = 0, t = 0;
  let isVisible = false;
  let rafId = 0;
  let lastFrame = 0;

  const stage = document.getElementById('treeStage');
  if (stage && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      isVisible = entries[0]?.isIntersecting || false;
      if (isVisible && !rafId && (progress > 0 || petals.length > 0)) {
        rafId = requestAnimationFrame(draw);
      }
    }, { threshold: 0.1 });
    io.observe(stage);
  } else {
    isVisible = true;
  }

  function scheduleDraw() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  function draw(ts) {
    rafId = 0;
    if (!isVisible && progress <= 0 && petals.length === 0) return;
    if (ts - lastFrame < 33) {
      scheduleDraw();
      return;
    }
    lastFrame = ts;
    t = ts * 0.001;
    ctx.clearRect(0, 0, W, H);
    const p = progress;

    /* Aurora */
    if (p > 0.04) {
      const r = ctx.createRadialGradient(OX,H*0.36,0, OX,H*0.36, Math.min(W,H)*0.75*p);
      r.addColorStop(0,   `rgba(255,128,205,${(p*0.22).toFixed(2)})`);
      r.addColorStop(0.5, `rgba(148,68,225,${(p*0.10).toFixed(2)})`);
      r.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = r; ctx.fillRect(0,0,W,H);
    }

    /* Ground mist */
    if (p > 0.06) {
      const mp = Math.min(p/0.18,1);
      const mg = ctx.createRadialGradient(OX,OY,0, OX,OY, W*0.52*mp);
      mg.addColorStop(0, `rgba(155,95,255,${(mp*0.18).toFixed(2)})`);
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mg; ctx.fillRect(0,0,W,H);
    }

    /* Roots — thicker, more trunk-like */
    if (p > 0.01) {
      const rp = Math.min(p/0.08, 1);
      ctx.lineCap = 'round';
      for (let i = 0; i < 8; i++) {
        const ra  = (i/8)*Math.PI*1.6 - Math.PI*0.8 + Math.PI*0.5;
        const rl  = W * 0.13 * rp;
        const rw  = Math.max(0.5, (W*0.012 - i*0.8) * rp * Math.min(p*3,1));
        const cpx = OX + Math.cos(ra)*rl*0.45;
        const cpy = OY + Math.abs(Math.sin(ra))*rl*0.55 + 6;
        const ex  = OX + Math.cos(ra)*rl;
        const ey  = OY + Math.abs(Math.sin(ra))*rl*0.30 + 3;

        // Main root stroke
        ctx.beginPath();
        ctx.moveTo(OX, OY);
        ctx.quadraticCurveTo(cpx, cpy, ex, ey);
        ctx.strokeStyle = `rgba(55,30,10,${(rp*(0.85-i*0.08)).toFixed(2)})`;
        ctx.lineWidth   = rw;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.moveTo(OX, OY);
        ctx.quadraticCurveTo(cpx-1, cpy-1, ex-1, ey);
        ctx.strokeStyle = `rgba(120,72,28,${(rp*(0.25-i*0.03)).toFixed(2)})`;
        ctx.lineWidth   = rw * 0.3;
        ctx.stroke();
      }
    }

    /* Branches — drawn back→front (depth sorted already) */
    ctx.shadowBlur = 0;
    branches.forEach(b => {
      const ds = b.d / (MAX_D + 1.1);
      const de = (b.d + 1.65) / (MAX_D + 1.1);
      if (p < ds) return;
      const lp = Math.min((p - ds) / (de - ds), 1);

      // Subtle bloom on tips
      if (b.d >= MAX_D - 2 && p > 0.5) {
        ctx.shadowColor = 'rgba(255,152,218,0.55)';
        ctx.shadowBlur  = 3 + p*4;
      } else {
        ctx.shadowBlur = 0;
      }

      drawBranch(b, lp, p);
    });
    ctx.shadowBlur = 0;

    /* Petals */
    addPetals(ts, p);
    for (let i = petals.length-1; i >= 0; i--) {
      const pt = petals[i];
      pt.x   += pt.vx + Math.sin(t*1.15+i*0.38)*0.28;
      pt.y   += pt.vy;
      pt.rot += pt.rv;
      pt.op  -= 0.0045;
      if (pt.op <= 0 || pt.y > H+18) { petals.splice(i,1); continue; }
      ctx.save();
      ctx.globalAlpha = pt.op;
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.rot);
      ctx.beginPath();
      ctx.ellipse(0,0, pt.sz, pt.sz*0.5, 0, 0, Math.PI*2);
      ctx.fillStyle = `hsl(${pt.hue},80%,77%)`;
      ctx.fill();
      ctx.restore();
    }

    if (isVisible && (progress > 0 || petals.length > 0)) {
      scheduleDraw();
    }
  }

  window.setIrminsulProgress = function(v) {
    progress = Math.max(0, Math.min(1, v));
    if (progress > 0) scheduleDraw();
  };
})();
}

/* ══════════════════════════════════════════════════════
   CERT SCROLL → TREE GROWTH (fixed wiring)
══════════════════════════════════════════════════════ */
(function initCertScroll(){
  const scroller = document.getElementById('certScroll');
  if (!scroller) return;

  const cards     = [...scroller.querySelectorAll('.nation-card')];
  function updateOnScroll() {
    const sLeft    = scroller.scrollLeft;
    const sW       = scroller.clientWidth;
    const centerX   = sLeft + sW / 2;

    /* ── Card zoom & highlight ── */
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist  = Math.abs(centerX - cardCenter);
      const ratio = Math.min(dist / (sW * 0.65), 1);
      card.style.transform = `scale(${1 - ratio * 0.15})`;
      card.style.opacity   = String(1 - ratio * 0.55);
      if (ratio < 0.25) card.classList.add('cert-active');
      else              card.classList.remove('cert-active');
    });

  }

  scroller.addEventListener('scroll', updateOnScroll, { passive: true });
  /* Run once so the active card state is initialized immediately */
  requestAnimationFrame(updateOnScroll);
})();

/* ══════════════════════════════════════════════════════
   REST OF ORIGINAL SCRIPTS (unchanged)
══════════════════════════════════════════════════════ */

/* Touch detection */
const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

/* Custom cursor (desktop only) */
if (!isTouch) {
  const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
  (function animRing() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); })();
  document.querySelectorAll('a,button,.el-card,.nation-card,.proj-card,.lore-card,.hobby-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.width = '20px'; cur.style.height = '20px'; ring.style.width = '52px'; ring.style.height = '52px'; });
    el.addEventListener('mouseleave', () => { cur.style.width = '12px'; cur.style.height = '12px'; ring.style.width = '36px'; ring.style.height = '36px'; });
  });
}

/* Hamburger menu */
const navToggle = document.getElementById('navToggle'), navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => { navToggle.classList.toggle('open'); navMenu.classList.toggle('open'); });
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { navToggle.classList.remove('open'); navMenu.classList.remove('open'); }));
}

/* Starfield */
const sfCanvas = document.getElementById('starfield'), sfCtx = sfCanvas.getContext('2d');
let stars = [], sfW, sfH;
const starDensity = isTouch ? 7200 : 3600;
function sfResize() { sfW = sfCanvas.width = innerWidth; sfH = sfCanvas.height = innerHeight; buildStars(); }
function buildStars() { stars = []; const n = Math.floor(sfW * sfH / starDensity); for (let i = 0; i < n; i++) stars.push({ x: Math.random() * sfW, y: Math.random() * sfH, r: Math.random() * 1.2 + .2, a: Math.random() * .7 + .1, t: Math.random() * Math.PI * 2, ts: Math.random() * .018 + .004 }); }
window.addEventListener('resize', sfResize, { passive: true }); sfResize();
(function sfDraw(ts) { if (!sfDraw.last || ts - sfDraw.last >= 33) { sfDraw.last = ts; sfCtx.clearRect(0, 0, sfW, sfH); for (const s of stars) { s.t += s.ts; const a = s.a * (.5 + .5 * Math.sin(s.t)); sfCtx.beginPath(); sfCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2); sfCtx.fillStyle = `rgba(255,240,175,${a})`; sfCtx.fill(); } } requestAnimationFrame(sfDraw); })();

/* Particles */
const pColors = ['#b96df0','#2ec9c9','#66c030','#e0a820','#ff5f2e','#8ddff5','#c9a227'];
setInterval(() => {
  if (document.hidden) return;
  const el = document.createElement('div'); el.className = 'particle';
  const c = pColors[Math.floor(Math.random() * pColors.length)], s = Math.random() * 3.5 + 1;
  el.style.cssText = `left:${Math.random()*100}%;width:${s}px;height:${s}px;background:${c};box-shadow:0 0 ${s*3}px ${c};animation-duration:${Math.random()*9+7}s;animation-delay:${Math.random()*4}s;`;
  document.body.appendChild(el); setTimeout(() => el.remove(), 14000);
}, isTouch ? 3200 : 1200);

/* Progress bar */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => { prog.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%'; }, { passive: true });

/* Hero parallax (desktop only) */
if (!isTouch) {
  const parallaxMap = { heroEmblem:.25, heroEyebrow:.15, heroTitle:.08, heroSub:.12, heroDesc:.16, heroSocials:.18, heroCta:.2 };
  window.addEventListener('scroll', () => { const sy = scrollY; for (const [id, speed] of Object.entries(parallaxMap)) { const el = document.getElementById(id); if (el) el.style.transform = `translateY(${sy * speed}px)`; } }, { passive: true });
}

/* Scroll-fly */
const flyObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); flyObs.unobserve(e.target); } }); }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('[data-fly]').forEach(el => flyObs.observe(el));

/* Active nav */
const navLinks = document.querySelectorAll('.nav-link');
const secObs   = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { navLinks.forEach(a => a.classList.remove('active')); const a = document.querySelector(`nav a[href="#${e.target.id}"]`); if (a) a.classList.add('active'); } }); }, { threshold: 0.2 });
['skills','education','research','projects','hobbies','contact'].forEach(id => { const el = document.getElementById(id); if (el) secObs.observe(el); });

/* Tabs */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    const panel = document.getElementById('tab-' + this.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

/* Skill card sparkle */
const sparkEvent = isTouch ? 'touchend' : 'click';
document.querySelectorAll('.el-card').forEach(card => {
  card.addEventListener(sparkEvent, function (e) {
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const c = getComputedStyle(this).getPropertyValue('--c').trim() || '#c9a227';
    for (let i = 0; i < 10; i++) {
      const sp = document.createElement('div'), angle = (i / 10) * Math.PI * 2, dist = 45 + Math.random() * 25;
      sp.style.cssText = `position:fixed;left:${touch.clientX}px;top:${touch.clientY}px;width:5px;height:5px;background:${c};border-radius:50%;pointer-events:none;z-index:9999;transition:transform .7s ease-out,opacity .7s`;
      document.body.appendChild(sp);
      requestAnimationFrame(() => { sp.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px)`; sp.style.opacity = '0'; });
      setTimeout(() => sp.remove(), 800);
    }
  });
});

/* 3D card tilt (desktop only) */
if (!isTouch) {
  document.querySelectorAll('.lore-card,.proj-card,.hobby-card,.el-card').forEach(card => {
    let raf = null, targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0, active = false;
    const lerp = (a, b, t) => a + (b - a) * t;
    function tick() {
      currentRX = lerp(currentRX, targetRX, .14);
      currentRY = lerp(currentRY, targetRY, .14);
      card.style.transform = `perspective(700px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateZ(28px) scale(1.05)`;
      if (active || Math.abs(currentRX) > .05 || Math.abs(currentRY) > .05) { raf = requestAnimationFrame(tick); }
      else { card.style.transform = ''; card.style.transition = 'transform .6s cubic-bezier(.23,1,.32,1),border-color .4s,box-shadow .4s'; raf = null; }
    }
    card.addEventListener('mouseenter', () => { active = true; card.style.transition = 'border-color .4s,box-shadow .4s'; if (!raf) raf = requestAnimationFrame(tick); });
    card.addEventListener('mousemove', function (e) { const r = this.getBoundingClientRect(); targetRY = ((e.clientX - r.left) / r.width - .5) * 18; targetRX = -((e.clientY - r.top) / r.height - .5) * 13; });
    card.addEventListener('mouseleave', () => { active = false; targetRX = 0; targetRY = 0; });
  });
}

