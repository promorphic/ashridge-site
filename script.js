/* Ashridge — generative illustrations (monochrome + gold accents) and nav. */
(function () {
  const SAND = '#f6e189', CEMENT = '#c6c7c5', GRAIN = '#a7a28d';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fit(c) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = c.getBoundingClientRect();
    if (c.width !== r.width * dpr || c.height !== r.height * dpr) {
      c.width = r.width * dpr; c.height = r.height * dpr;
    }
    return { w: r.width, h: r.height, dpr };
  }

  /* Hero: flowing contour lines drifting over a dot grid, gold highlights. */
  function hero(c) {
    const ctx = c.getContext('2d');
    let t = 0;
    function draw() {
      const { w, h, dpr } = fit(c);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const g = 36;
      for (let y = g; y < h; y += g) for (let x = g; x < w; x += g) {
        const n = Math.sin(x * .012 + t * .6) * Math.cos(y * .011 - t * .4);
        ctx.fillStyle = n > .72 ? SAND : CEMENT;
        ctx.globalAlpha = n > .72 ? .9 : .12 + Math.max(0, n) * .25;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      ctx.globalAlpha = 1;
      const lines = 28;
      for (let i = 0; i < lines; i++) {
        const p = i / lines;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y = h * (.18 + p * .72)
            + Math.sin(x * .0045 + i * .35 + t) * 42 * (1 - p * .4)
            + Math.sin(x * .0012 - t * .7 + i) * 60;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = i % 9 === 4 ? SAND : CEMENT;
        ctx.globalAlpha = i % 9 === 4 ? .55 : .16 + p * .18;
        ctx.lineWidth = i % 9 === 4 ? 1.2 : .8;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      t += reduce ? 0 : .006;
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }

  /* Field: dot-matrix sphere (coin-like) resolving out of noise. */
  function field(c) {
    const ctx = c.getContext('2d'); let t = 0;
    function draw() {
      const { w, h, dpr } = fit(c);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const cx = w * .58, cy = h * .5, R = Math.min(w, h) * .36, g = 9;
      for (let y = g; y < h; y += g) for (let x = g; x < w; x += g) {
        const dx = (x - cx) / R, dy = (y - cy) / R, d = Math.hypot(dx, dy);
        let a, col = CEMENT, s = 1.2;
        if (d < 1) {
          const z = Math.sqrt(1 - d * d);
          const lit = (dx * -.5 + dy * -.4 + z * .75);
          a = .18 + Math.max(0, lit) * .8;
          s = 1 + Math.max(0, lit) * 2.2;
          if (lit > .78) col = SAND;
        } else {
          a = .05 + Math.max(0, Math.sin(x * .02 + t) * Math.cos(y * .02 - t)) * .12;
        }
        ctx.fillStyle = col; ctx.globalAlpha = a;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1; t += reduce ? 0 : .01;
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }

  /* Lattice: perspective grid converging to a horizon, like a bridge deck. */
  function lattice(c) {
    const ctx = c.getContext('2d'); let t = 0;
    function draw() {
      const { w, h, dpr } = fit(c);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const hz = h * .42, vx = w * .5;
      ctx.lineWidth = .8;
      for (let i = -14; i <= 14; i++) {
        ctx.beginPath(); ctx.moveTo(vx, hz); ctx.lineTo(vx + i * w * .12, h);
        ctx.strokeStyle = i === 0 ? SAND : CEMENT; ctx.globalAlpha = i === 0 ? .6 : .18; ctx.stroke();
      }
      for (let k = 0; k < 24; k++) {
        const p = ((k / 24) + (t % 1)) % 1;
        const y = hz + (h - hz) * p * p;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y);
        ctx.strokeStyle = CEMENT; ctx.globalAlpha = .05 + p * .3; ctx.stroke();
      }
      for (let x = 0; x < w; x += 6) {
        const y = hz - Math.abs(Math.sin(x * .006 + t * 2)) * h * .3 * Math.sin(Math.PI * x / w);
        ctx.fillStyle = (x / 6) % 17 === 0 ? SAND : CEMENT;
        ctx.globalAlpha = (x / 6) % 17 === 0 ? .9 : .35;
        ctx.fillRect(x, y, 1.5, 1.5);
        ctx.globalAlpha = .07; ctx.fillStyle = CEMENT; ctx.fillRect(x, y, 1, hz - y);
      }
      ctx.globalAlpha = 1; t += reduce ? 0 : .0012;
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }

  /* Wave: layered sine ribbons, strict monochrome with one gold line. */
  function wave(c) {
    const ctx = c.getContext('2d'); let t = 0;
    function draw() {
      const { w, h, dpr } = fit(c);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const n = 48;
      for (let i = 0; i < n; i++) {
        const p = i / n;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y = h * (.25 + p * .55) + Math.sin(x * .008 + p * 6 + t) * 26 + Math.cos(x * .003 - t * .5) * 40 * p;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const gold = i === 30;
        ctx.strokeStyle = gold ? SAND : (i % 2 ? CEMENT : GRAIN);
        ctx.globalAlpha = gold ? .9 : .12 + p * .25; ctx.lineWidth = gold ? 1.4 : .7; ctx.stroke();
      }
      ctx.globalAlpha = 1; t += reduce ? 0 : .008;
      if (!reduce) requestAnimationFrame(draw);
    }
    draw();
  }

  hero(document.getElementById('heroCanvas'));
  const arts = { field, lattice, wave };
  document.querySelectorAll('canvas[data-art]').forEach(c => arts[c.dataset.art](c));

  /* Side index highlighting */
  const idx = [...document.querySelectorAll('.side-index span')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) idx.forEach(s => s.classList.toggle('active', s.dataset.target === e.target.id));
  }), { threshold: .5 });
  document.querySelectorAll('.product').forEach(p => io.observe(p));

  /* Mobile nav */
  const nav = document.querySelector('.nav'), tg = document.querySelector('.nav-toggle');
  tg.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    tg.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
})();
