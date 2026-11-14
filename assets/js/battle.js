/* ==========================================================================
   Battle plans: a small engine that draws a fleet action from above and plays
   it back. No libraries. A page calls NelsonBattle.mount(elementId, scenario).

   Scenario time runs from 0 to 100. Each ship has a track of keyframes
   [t, x, y, heading?] in map units; headings follow the direction of travel
   unless a keyframe gives one (0 = up the sheet, 90 = to the right).
   ========================================================================== */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var SAMPLES = 400;
  var SLOW = 0.7;   /* below this speed (map units per time unit) a ship is drifting, not sailing */

  /* Every word the engine shows. A page may set window.NelsonBattleUI to
     override any of them (the French pages do). */
  var UI_EN = {
    play: 'Play', pause: 'Pause', replay: 'Replay', restart: 'Restart', speed: 'Speed ', names: ' Ship names', wakes: ' Wakes',
    struck: 'Struck her colours', flagship: 'Flagship', aground: 'Aground', hint: 'Click a ship for her name, guns and captain.',
    ship: 'Ship', pick: 'Click any ship on the plan to see her name, guns, captain and fate.', flagTag: 'flagship', guns: ' guns',
    flagOf: 'Flag of ', scrub: 'Position in the battle', aria: ': animated plan of the fleets seen from above',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    swap: []
  };
  function T(k) { var u = window.NelsonBattleUI; return (u && u[k] !== undefined) ? u[k] : UI_EN[k]; }
  function swap(str) { T('swap').forEach(function (p) { str = str.split(p[0]).join(p[1]); }); return str; }

  function S(name, attrs, parent) {
    var n = document.createElementNS(NS, name), k;
    if (attrs) for (k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function H(name, cls, parent, text) {
    var n = document.createElement(name);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function angLerp(a, b, u) { var d = ((b - a + 540) % 360) - 180; return a + d * u; }
  function frac(x) { return x - Math.floor(x); }
  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function rnd(seed) { var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  /* ---- tracks ------------------------------------------------------------ */
  function normTrack(track) {
    return track.map(function (k) {
      return { t: k[0], x: k[1], y: k[2], h: (k.length > 3 && k[3] !== null && k[3] !== undefined) ? k[3] : null };
    }).sort(function (a, b) { return a.t - b.t; });
  }
  function posAt(tr, t) {
    var n = tr.length, i, a, b, u;
    if (t <= tr[0].t) return [tr[0].x, tr[0].y];
    if (t >= tr[n - 1].t) return [tr[n - 1].x, tr[n - 1].y];
    for (i = 1; i < n; i++) {
      if (t <= tr[i].t) {
        a = tr[i - 1]; b = tr[i];
        u = (b.t === a.t) ? 1 : (t - a.t) / (b.t - a.t);
        return [lerp(a.x, b.x, u), lerp(a.y, b.y, u)];
      }
    }
    return [tr[n - 1].x, tr[n - 1].y];
  }
  /* Heading table: follow the chord of travel, hold the last heading when
     stopped, honour explicit keyframe headings, then smooth the lot. */
  function buildHeadings(tr) {
    var N = SAMPLES, W = 1.4, Hd = new Array(N + 1), inst = new Array(N + 1), s, t, p0, p1, dx, dy, last = null, first = null;
    for (s = 0; s <= N; s++) {
      t = s * 100 / N;
      p0 = posAt(tr, t - W); p1 = posAt(tr, t + W);
      dx = p1[0] - p0[0]; dy = p1[1] - p0[1];
      Hd[s] = (Math.sqrt(dx * dx + dy * dy) > SLOW * 2 * W) ? Math.atan2(dx, -dy) * 180 / Math.PI : null;
      p0 = posAt(tr, t); p1 = posAt(tr, t + 100 / N);
      dx = p1[0] - p0[0]; dy = p1[1] - p0[1];
      inst[s] = Math.sqrt(dx * dx + dy * dy) > SLOW * 100 / N;
    }
    for (s = 0; s <= N; s++) { if (Hd[s] === null) Hd[s] = last; else last = Hd[s]; }
    for (s = 0; s <= N; s++) { if (Hd[s] !== null) { first = Hd[s]; break; } }
    if (first === null) first = 0;
    for (s = 0; s <= N && Hd[s] === null; s++) Hd[s] = first;

    tr.forEach(function (k) {
      if (k.h === null) return;
      var s0 = Math.round(k.t * N / 100), B = Math.round(4 * N / 100), u, q;
      for (q = Math.max(0, s0 - B); q < s0; q++) {
        u = (q - (s0 - B)) / B; u = u * u * (3 - 2 * u);
        Hd[q] = angLerp(Hd[q], k.h, u);
      }
      for (q = s0; q <= N; q++) {
        if (q > s0 + 2 && inst[q]) break;
        Hd[q] = k.h;
      }
    });

    var out = new Array(N + 1), R = 5, cx, cy, j, a;
    for (s = 0; s <= N; s++) {
      cx = 0; cy = 0;
      for (j = -R; j <= R; j++) {
        a = Hd[clamp(s + j, 0, N)] * Math.PI / 180;
        cx += Math.cos(a); cy += Math.sin(a);
      }
      out[s] = Math.atan2(cy, cx) * 180 / Math.PI;
    }
    return out;
  }
  function headingAt(table, t) {
    var f = clamp(t, 0, 100) * SAMPLES / 100, i = Math.floor(f), u = f - i;
    if (i >= SAMPLES) return table[SAMPLES];
    return angLerp(table[i], table[i + 1], u);
  }

  /* ---- clock ------------------------------------------------------------- */
  function clockAt(sc, t) {
    if (sc.calendar) {
      var d = new Date(lerp(sc.calendar[0], sc.calendar[1], clamp(t, 0, 100) / 100));
      return d.getUTCDate() + ' ' + T('months')[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
    }
    var c = sc.clock, i, m = c[c.length - 1][1];
    if (t <= c[0][0]) m = c[0][1];
    else for (i = 1; i < c.length; i++) {
      if (t <= c[i][0]) { m = lerp(c[i - 1][1], c[i][1], (t - c[i - 1][0]) / (c[i][0] - c[i - 1][0])); break; }
    }
    m = Math.round(m / 5) * 5;
    var day = Math.floor(m / 1440), mm = m - day * 1440, hh = Math.floor(mm / 60), mi = mm % 60;
    var s = (hh < 10 ? '0' : '') + hh + ':' + (mi < 10 ? '0' : '') + mi;
    if (sc.days && sc.days[day]) s += '  ·  ' + sc.days[day];
    return s;
  }
  function keyVal(keys, t) {
    var i;
    if (!keys || !keys.length) return 0;
    if (t <= keys[0][0]) return keys[0][1];
    for (i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
    return keys[keys.length - 1][1];
  }

  /* ---- the map ----------------------------------------------------------- */
  function BattleMap(root, sc) {
    this.root = root; this.sc = sc;
    this.W = sc.size[0]; this.Hh = sc.size[1];
    this.t = 0; this.playing = false; this.speed = 1;
    this.duration = sc.duration || 75;
    this.ships = []; this.selected = null; this.phaseIx = -1;
    this.showNames = false; this.showWakes = true;
    this.build();
    this.render();
  }

  BattleMap.prototype.build = function () {
    var self = this, sc = this.sc, root = this.root, W = this.W, Hh = this.Hh;
    root.innerHTML = '';
    root.classList.add('bm');

    var main = H('div', 'bm-main', root);
    var stage = H('div', 'bm-stage', main);
    var svg = S('svg', { viewBox: '0 0 ' + W + ' ' + Hh, role: 'img', 'aria-label': sc.title + T('aria') }, stage);
    this.svg = svg;

    var defs = S('defs', null, svg);
    var pat = S('pattern', { id: 'bm-stipple-' + root.id, width: 7, height: 7, patternUnits: 'userSpaceOnUse' }, defs);
    S('circle', { cx: 1.5, cy: 1.5, r: .7, fill: 'var(--ink)', 'fill-opacity': .35 }, pat);
    S('circle', { cx: 5, cy: 5, r: .7, fill: 'var(--ink)', 'fill-opacity': .35 }, pat);
    var clip = S('clipPath', { id: 'bm-clip-' + root.id }, defs);
    S('rect', { x: 0, y: 0, width: W, height: Hh }, clip);

    S('rect', { 'class': 'bm-sea', x: 0, y: 0, width: W, height: Hh }, svg);

    /* graticule, rhumb lines and a scatter of soundings */
    var g = S('g', { 'class': 'bm-grat' }, svg), i, x, y;
    for (x = 100; x < W; x += 100) S('line', { x1: x, y1: 0, x2: x, y2: Hh }, g);
    for (y = 100; y < Hh; y += 100) S('line', { x1: 0, y1: y, x2: W, y2: y }, g);
    var rose = sc.rose || [W - 80, 80];
    g = S('g', { 'class': 'bm-rhumb' }, svg);
    for (i = 0; i < 16; i++) {
      var a = i * Math.PI / 8;
      S('line', { x1: rose[0], y1: rose[1], x2: rose[0] + Math.cos(a) * 2000, y2: rose[1] + Math.sin(a) * 2000 }, g);
    }
    g = S('g', null, svg);
    for (i = 0; i < 46; i++) {
      var tx = S('text', { 'class': 'bm-sounding', x: Math.round(rnd(i + 1) * (W - 40) + 20), y: Math.round(rnd(i + 77) * (Hh - 40) + 26) }, g);
      tx.textContent = String(Math.round(4 + rnd(i + 190) * 34));
    }

    /* shoals, land, towns, forts, labels */
    g = S('g', null, svg);
    (sc.shoals || []).forEach(function (d) { S('path', { 'class': 'bm-shoal', d: d, fill: 'url(#bm-stipple-' + root.id + ')' }, g); });
    (sc.land || []).forEach(function (d) { S('path', { 'class': 'bm-land-wash', d: d }, g); });
    (sc.land || []).forEach(function (d) { S('path', { 'class': 'bm-land', d: d }, g); });
    (sc.towns || []).forEach(function (d) { S('path', { 'class': 'bm-town', d: d }, g); });
    (sc.forts || []).forEach(function (f) {
      var r = f.r || 9, pts = [], k;
      for (k = 0; k < 8; k++) { var rr = (k % 2) ? r * .55 : r, an = k * Math.PI / 4 + Math.PI / 8; pts.push((f.x + Math.cos(an) * rr).toFixed(1) + ',' + (f.y + Math.sin(an) * rr).toFixed(1)); }
      S('polygon', { 'class': 'bm-fort', points: pts.join(' ') }, g);
    });
    (sc.labels || []).forEach(function (l) {
      var te = S('text', { 'class': 'bm-label ' + (l.cls || ''), x: l.x, y: l.y, 'text-anchor': l.anchor || 'start', transform: l.rot ? 'rotate(' + l.rot + ' ' + l.x + ' ' + l.y + ')' : null }, g);
      te.textContent = l.text;
    });

    /* compass rose, wind arrow, scale */
    this.drawRose(svg, rose[0], rose[1], sc.north || 0);
    if (sc.wind) this.drawWind(svg, sc.wind);
    if (sc.scale) {
      var sx = sc.scale.x !== undefined ? sc.scale.x : 30, sy = sc.scale.y !== undefined ? sc.scale.y : Hh - 26, px = sc.scale.px;
      g = S('g', { 'class': 'bm-scale' }, svg);
      S('path', { d: 'M' + sx + ',' + (sy - 5) + 'V' + sy + 'H' + (sx + px) + 'V' + (sy - 5) + 'M' + (sx + px / 2) + ',' + sy + 'v-4' }, g);
      S('text', { x: sx, y: sy - 10 }, g).textContent = sc.scale.label;
    }

    this.night = S('rect', { 'class': 'bm-night', x: 0, y: 0, width: W, height: Hh, opacity: 0 }, svg);

    var clipped = S('g', { 'clip-path': 'url(#bm-clip-' + root.id + ')' }, svg);
    this.wakeLayer = S('g', null, clipped);
    this.shipLayer = S('g', null, clipped);
    this.fxLayer = S('g', null, clipped);
    this.nameLayer = S('g', null, clipped);

    sc.ships.forEach(function (d, ix) { self.addShip(d, ix); });

    /* controls */
    var ctl = H('div', 'bm-controls', main);
    this.playBtn = H('button', 'bm-play', ctl, T('play')); this.playBtn.type = 'button';
    var rs = H('button', 'bm-restart', ctl, T('restart')); rs.type = 'button';
    this.scrub = H('input', 'bm-scrub', ctl);
    this.scrub.type = 'range'; this.scrub.min = 0; this.scrub.max = 1000; this.scrub.value = 0; this.scrub.step = 1;
    this.scrub.id = root.id + '-scrub'; this.scrub.setAttribute('aria-label', T('scrub'));
    var lab = H('label', null, ctl); lab.appendChild(document.createTextNode(T('speed')));
    var sel = H('select', null, lab); sel.id = root.id + '-speed';
    [['0.5', '½×'], ['1', '1×'], ['2', '2×'], ['4', '4×']].forEach(function (o) { var op = H('option', null, sel, o[1]); op.value = o[0]; if (o[0] === '1') op.selected = true; });
    lab = H('label', null, ctl); var cbN = H('input', null, lab); cbN.type = 'checkbox'; cbN.id = root.id + '-names'; lab.appendChild(document.createTextNode(T('names')));
    lab = H('label', null, ctl); var cbW = H('input', null, lab); cbW.type = 'checkbox'; cbW.checked = true; cbW.id = root.id + '-wakes'; lab.appendChild(document.createTextNode(T('wakes')));

    this.playBtn.addEventListener('click', function () { self.playing ? self.pause() : self.play(); });
    rs.addEventListener('click', function () { self.seek(0); self.play(); });
    this.scrub.addEventListener('input', function () { self.seek(self.scrub.value / 10, true); });
    sel.addEventListener('change', function () { self.speed = parseFloat(sel.value); });
    cbN.addEventListener('change', function () { self.showNames = cbN.checked; self.render(); });
    cbW.addEventListener('change', function () { self.showWakes = cbW.checked; self.wakeLayer.style.display = cbW.checked ? '' : 'none'; self.render(); });
    svg.addEventListener('click', function (e) {
      var n = e.target;
      while (n && n !== svg) { if (n.__ship) { self.select(n.__ship); return; } n = n.parentNode; }
      self.select(null);
    });

    /* side panel */
    var side = H('div', 'bm-side', root);
    var cap = H('div', 'bm-caption', side);
    this.clockEl = H('div', 'bm-clock', cap);
    this.capTitle = H('h3', null, cap); this.capTitle.setAttribute('aria-live', 'polite');
    this.capText = H('p', null, cap);
    var ol = H('ol', 'bm-phases', side);
    this.phaseBtns = sc.phases.map(function (p, ix) {
      var li = H('li', null, ol), b = H('button', null, li, p.title); b.type = 'button';
      b.addEventListener('click', function () { self.seek(p.t + 0.01); });
      return b;
    });
    this.info = H('div', 'bm-info', side);
    this.select(null);

    var leg = H('ul', 'bm-legend', root);
    Object.keys(sc.sides).forEach(function (k) {
      var li = H('li', null, leg);
      li.innerHTML = '<svg viewBox="0 0 26 12"><path class="hull" d="M25,6 C21,2.2 9,1.6 2,2.6 L2,9.4 C9,10.4 21,9.8 25,6 Z" fill="var(--' + k + ')" stroke="var(--ink)" stroke-width=".9"/></svg>';
      li.appendChild(document.createTextNode(sc.sides[k]));
    });
    var extra = [
      ['<path d="M25,6 C21,2.2 9,1.6 2,2.6 L2,9.4 C9,10.4 21,9.8 25,6 Z" fill="var(--paper-light)" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="2 1.6"/>', T('struck')],
      ['<path d="M25,6 C21,2.2 9,1.6 2,2.6 L2,9.4 C9,10.4 21,9.8 25,6 Z" fill="var(--ink-soft)" stroke="var(--gilt-bright)" stroke-width="1.8"/>', T('flagship')],
      ['<circle cx="13" cy="6" r="5.4" fill="none" stroke="var(--ink)" stroke-dasharray="1.5 2.5"/>', T('aground')]
    ];
    extra.forEach(function (e) { var li = H('li', null, leg); li.innerHTML = '<svg viewBox="0 0 26 12">' + e[0] + '</svg>'; li.appendChild(document.createTextNode(e[1])); });
    H('li', null, leg, T('hint'));
  };

  BattleMap.prototype.drawRose = function (svg, cx, cy, north) {
    var g = S('g', { 'class': 'bm-rose', transform: 'translate(' + cx + ' ' + cy + ') rotate(' + north + ')' }, svg), i, a, r;
    S('circle', { r: 34, fill: 'none' }, g);
    S('circle', { r: 30, fill: 'none', 'stroke-dasharray': '1 3' }, g);
    for (i = 0; i < 8; i++) {
      r = (i % 2) ? 20 : 40;
      a = 'rotate(' + (i * 45) + ')';
      S('path', { 'class': 'dk', d: 'M0,0 L0,' + (-r) + ' L' + (r * .16) + ',' + (-r * .16) + ' Z', transform: a }, g);
      S('path', { 'class': 'lt', d: 'M0,0 L0,' + (-r) + ' L' + (-r * .16) + ',' + (-r * .16) + ' Z', transform: a }, g);
    }
    S('path', { 'class': 'dk', d: 'M0,-58 L5,-46 L0,-49 L-5,-46 Z' }, g);
    var t = S('text', { x: 0, y: -62, 'text-anchor': 'middle', transform: 'rotate(' + (-north) + ' 0 -66)' }, g);
    t.textContent = 'N';
  };

  BattleMap.prototype.drawWind = function (svg, w) {
    var g = S('g', { 'class': 'bm-wind', transform: 'translate(' + w.x + ' ' + w.y + ')' }, svg);
    var a = S('g', { transform: 'rotate(' + w.toward + ')' }, g);
    S('path', { d: 'M0,26 L0,-26 M-7,-15 L0,-27 L7,-15 M-6,26 l-5,8 M0,26 l-5,8 M6,26 l-5,8' }, a);
    S('text', { x: 0, y: 52, 'text-anchor': 'middle' }, g).textContent = w.label;
  };

  BattleMap.prototype.addShip = function (d, ix) {
    var guns = d.guns || 74;
    var k = d.scale || (guns >= 100 ? 1.3 : guns >= 80 ? 1.15 : guns >= 70 ? 1 : guns >= 50 ? .9 : guns >= 28 ? .74 : .58);
    k *= (this.sc.shipScale || 1);
    var L = 23 * k, B = 7.6 * k, hl = L / 2, hb = B / 2;
    var g = S('g', { 'class': 'bm-ship ' + d.side + (d.flag ? ' flag' : '') }, this.shipLayer);
    var hull = 'M0,' + (-hl) + ' C' + hb + ',' + (-hl * .55) + ' ' + (hb * 1.05) + ',' + (hl * .2) + ' ' + (hb * .72) + ',' + hl +
      ' L' + (-hb * .72) + ',' + hl + ' C' + (-hb * 1.05) + ',' + (hl * .2) + ' ' + (-hb) + ',' + (-hl * .55) + ' 0,' + (-hl) + ' Z';
    var smoke = S('g', null, g), puffs = [], flashes = [], i, sd;
    for (sd = -1; sd <= 1; sd += 2) for (i = 0; i < 3; i++) {
      puffs.push({ el: S('circle', { 'class': 'puff', r: 2, display: 'none' }, smoke), side: sd, y: (i - 1) * hl * .55, seed: rnd(ix * 7 + i * 3 + sd) });
    }
    for (sd = -1; sd <= 1; sd += 2) flashes.push({ el: S('circle', { 'class': 'flash', r: 1.6 * k, display: 'none' }, smoke), side: sd, seed: rnd(ix * 13 + sd) });
    S('circle', { 'class': 'ring', r: hl + 5 }, g);
    if (d.shape === 'battery') {
      S('rect', { 'class': 'hull', x: -hb * 1.5, y: -hb * 1.5, width: hb * 3, height: hb * 3 }, g);
    } else {
      S('path', { 'class': 'hull', d: hull }, g);
      [-.48, -.05, .42].forEach(function (f, n) {
        var w = hb * (n === 2 ? 1.25 : 1.55);
        S('line', { 'class': 'yard', x1: -w, y1: hl * f, x2: w, y2: hl * f }, g);
      });
    }
    var flame = S('circle', { 'class': 'flame', r: 3, display: 'none' }, g);
    S('circle', { 'class': 'sel', r: hl + 8 }, g);
    S('circle', { 'class': 'hit', r: Math.max(hl + 2, 13) }, g);
    var name = S('text', { 'class': 'bm-name' + (d.key ? ' key' : ''), display: 'none' }, this.nameLayer);
    name.textContent = d.name;
    var tr = normTrack(d.track);
    var ship = {
      d: d, ix: ix, g: g, hl: hl, hb: hb, k: k, tr: tr, heads: buildHeadings(tr), puffs: puffs, flashes: flashes, flame: flame, name: name,
      wake: S('polyline', { 'class': 'bm-wake ' + d.side }, this.wakeLayer), burst: null, ev: d.ev || {}, cls: ''
    };
    g.__ship = ship;
    if (ship.ev.explode !== undefined) {
      ship.burst = S('g', { 'class': 'bm-burst', display: 'none' }, this.fxLayer);
      ship.b1 = S('circle', { r: 10, fill: '#f6c453' }, ship.burst);
      ship.b2 = S('circle', { r: 6, fill: '#fff6dc' }, ship.burst);
      ship.b3 = S('circle', { r: 14, fill: 'none', stroke: '#e8792b', 'stroke-width': 2 }, ship.burst);
    }
    this.ships.push(ship);
  };

  BattleMap.prototype.team = function (side) {
    var al = this.sc.allies || [], i;
    for (i = 0; i < al.length; i++) if (al[i].indexOf(side) >= 0) return 'team' + i;
    return side;
  };

  function inSpan(spans, t) {
    var i;
    if (!spans) return null;
    for (i = 0; i < spans.length; i++) if (t >= spans[i][0] && t <= spans[i][1]) return spans[i];
    return null;
  }

  BattleMap.prototype.render = function () {
    var self = this, t = this.t, sc = this.sc, secs = t / 100 * this.duration;

    /* pass 1: where every ship is and what state she is in */
    this.ships.forEach(function (s) {
      var ev = s.ev;
      s.p = posAt(s.tr, t); s.h = headingAt(s.heads, t);
      s.gone = !!((ev.explode !== undefined && t >= ev.explode) || (ev.hide && inSpan(ev.hide, t)));
      s.struck = ev.struck !== undefined && t >= ev.struck;
      s.sunk = ev.sink !== undefined && t >= ev.sink;
      s.out = s.gone || s.struck || s.sunk || s.p[0] < -10 || s.p[1] < -10 || s.p[0] > self.W + 10 || s.p[1] > self.Hh + 10;
    });

    /* pass 2: broadsides. A ship fires on the side an enemy lies within range. */
    var af = sc.autoFire, quiet = af && inSpan(af.quiet, t);
    this.ships.forEach(function (s) {
      var ev = s.ev, span = inSpan(ev.fire, t), port = false, stbd = false;
      s.fire = null;
      if (s.out) return;
      if (span) { s.fire = span[2] || 'B'; return; }
      if (!af || quiet || ev.fire || s.d.noFire || (ev.cease !== undefined && t >= ev.cease) || (ev.open !== undefined && t < ev.open)) return;
      var R = s.d.range || af.range, team = self.team(s.d.side);
      self.ships.forEach(function (o) {
        if (o === s || o.out || o.d.noTarget || self.team(o.d.side) === team) return;
        var dx = o.p[0] - s.p[0], dy = o.p[1] - s.p[1];
        if (dx * dx + dy * dy > R * R) return;
        var rel = (Math.atan2(dx, -dy) * 180 / Math.PI - s.h) * Math.PI / 180, sn = Math.sin(rel);
        if (sn > .34) stbd = true; else if (sn < -.34) port = true;
      });
      if (port || stbd) s.fire = (port && stbd) ? 'B' : (stbd ? 'S' : 'P');
    });

    /* pass 3: draw */
    this.ships.forEach(function (s) {
      var ev = s.ev, p = s.p, h = s.h, gone = s.gone, struck = s.struck, sunk = s.sunk;
      var aground = ev.aground !== undefined && (Array.isArray(ev.aground) ? (t >= ev.aground[0] && t <= ev.aground[1]) : t >= ev.aground);
      var dism = ev.dismast !== undefined && t >= ev.dismast;
      var cls = 'bm-ship ' + s.d.side + (s.d.flag ? ' flag' : '') + (struck ? ' struck' : '') + (aground ? ' aground' : '') +
        (dism ? ' dismasted' : '') + (sunk ? ' sunk' : '') + (self.selected === s ? ' selected' : '');
      if (cls !== s.cls) { s.g.setAttribute('class', cls); s.cls = cls; }
      s.g.setAttribute('display', gone ? 'none' : 'inline');
      s.g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + h.toFixed(1) + ')');

      /* gun smoke */
      var fire = s.fire, side = fire;
      s.puffs.forEach(function (pf) {
        var on = fire && (side === 'B' || (side === 'S' && pf.side === 1) || (side === 'P' && pf.side === -1));
        if (!on) { if (pf.on) { pf.el.setAttribute('display', 'none'); pf.on = false; } return; }
        var ph = frac(secs * .55 + pf.seed * 5);
        pf.el.setAttribute('display', 'inline'); pf.on = true;
        pf.el.setAttribute('cx', (pf.side * (s.hb + 2 + ph * 9 * s.k)).toFixed(1));
        pf.el.setAttribute('cy', (pf.y + (pf.seed - .5) * 3).toFixed(1));
        pf.el.setAttribute('r', (1.4 + ph * 4.6 * s.k).toFixed(1));
        pf.el.setAttribute('opacity', (.92 * (1 - ph * ph)).toFixed(2));
      });
      s.flashes.forEach(function (fl) {
        var on = fire && (side === 'B' || (side === 'S' && fl.side === 1) || (side === 'P' && fl.side === -1));
        var ph = frac(secs * .9 + fl.seed * 7);
        if (on && ph < .16) {
          fl.el.setAttribute('display', 'inline'); fl.on = true;
          fl.el.setAttribute('cx', (fl.side * (s.hb + 1.5)).toFixed(1));
          fl.el.setAttribute('cy', ((frac(fl.seed * 31 + Math.floor(secs * .9)) - .5) * s.hl * 1.3).toFixed(1));
        } else if (fl.on) { fl.el.setAttribute('display', 'none'); fl.on = false; }
      });

      /* fire aboard */
      var burning = !gone && ev.burn && t >= ev.burn[0] && t <= ev.burn[1];
      if (burning) {
        s.flame.setAttribute('display', 'inline');
        s.flame.setAttribute('r', (s.hb * (.8 + .5 * Math.abs(Math.sin(secs * 6 + s.ix)))).toFixed(1));
        s.flame.setAttribute('cy', ((Math.sin(secs * 2.3 + s.ix) * .25) * s.hl).toFixed(1));
      } else s.flame.setAttribute('display', 'none');

      /* explosion */
      if (s.burst) {
        var dt = (t - ev.explode) / 100 * self.duration;
        if (dt >= 0 && dt < 2.6) {
          var u = dt / 2.6, pe = posAt(s.tr, ev.explode);
          s.burst.setAttribute('display', 'inline');
          s.burst.setAttribute('transform', 'translate(' + pe[0].toFixed(1) + ' ' + pe[1].toFixed(1) + ')');
          s.b1.setAttribute('r', (8 + 62 * Math.sqrt(u)).toFixed(1)); s.b1.setAttribute('opacity', (.85 * (1 - u)).toFixed(2));
          s.b2.setAttribute('r', (5 + 30 * Math.sqrt(u)).toFixed(1)); s.b2.setAttribute('opacity', (1 - u * u).toFixed(2));
          s.b3.setAttribute('r', (12 + 95 * u).toFixed(1)); s.b3.setAttribute('opacity', (.9 * (1 - u)).toFixed(2));
        } else s.burst.setAttribute('display', 'none');
      }

      /* name */
      var showName = !gone && (s.d.key || self.showNames || self.selected === s);
      if (showName) {
        s.name.setAttribute('display', 'inline');
        var off = s.d.label || [0, -(s.hl + 6)];
        s.name.setAttribute('x', (p[0] + off[0]).toFixed(1));
        s.name.setAttribute('y', (p[1] + off[1]).toFixed(1));
        if (off[2]) s.name.style.textAnchor = off[2];
      } else s.name.setAttribute('display', 'none');

      /* wake */
      if (self.showWakes && s.tr.length > 1) {
        var pts = [], i;
        for (i = 0; i < s.tr.length && s.tr[i].t <= t; i++) pts.push(s.tr[i].x.toFixed(1) + ',' + s.tr[i].y.toFixed(1));
        pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
        s.wake.setAttribute('points', pts.join(' '));
        s.wake.setAttribute('display', gone ? 'none' : 'inline');
      }
    });

    this.night.setAttribute('opacity', keyVal(sc.night, t).toFixed(3));

    /* caption */
    var ix = 0, i;
    for (i = 0; i < sc.phases.length; i++) if (t >= sc.phases[i].t) ix = i;
    if (ix !== this.phaseIx) {
      this.phaseIx = ix;
      this.capTitle.textContent = sc.phases[ix].title;
      this.capText.textContent = sc.phases[ix].text;
      this.phaseBtns.forEach(function (b, n) {
        if (n === ix) { b.setAttribute('aria-current', 'step'); if (b.scrollIntoView && self.playing) b.parentNode.parentNode.scrollTop = Math.max(0, b.offsetTop - b.parentNode.parentNode.offsetTop - 40); }
        else b.removeAttribute('aria-current');
      });
    }
    this.clockEl.textContent = clockAt(sc, t);
    if (!this._scrubbing) this.scrub.value = Math.round(t * 10);
  };

  BattleMap.prototype.select = function (ship) {
    this.selected = ship;
    var info = this.info, d;
    info.innerHTML = '';
    if (!ship) {
      H('div', 'bi-k', info, T('ship'));
      H('div', 'bi-meta', info, T('pick'));
    } else {
      d = ship.d;
      H('div', 'bi-k', info, this.sc.sides[d.side] + (d.flag ? '  ·  ' + T('flagTag') : ''));
      H('div', 'bi-name', info, d.name);
      H('div', 'bi-meta', info, (d.guns ? d.guns + T('guns') : '') + (d.captain ? (d.guns ? '  ·  ' : '') + swap(d.captain) : ''));
      if (d.flag) H('div', 'bi-meta', info, T('flagOf') + swap(d.flag));
      if (d.fate) H('div', 'bi-meta', info, d.fate);
    }
    if (this.svg) this.render();
  };

  BattleMap.prototype.seek = function (t, fromScrub) {
    this.t = clamp(t, 0, 100);
    this._scrubbing = !!fromScrub;
    this.render();
    this._scrubbing = false;
  };
  BattleMap.prototype.play = function () {
    var self = this;
    if (this.t >= 100) this.t = 0;
    this.playing = true; this._last = null;
    this.playBtn.textContent = T('pause');
    function step(now) {
      if (!self.playing) return;
      if (self._last !== null) {
        var dt = Math.min(.1, (now - self._last) / 1000);
        self.t += dt * self.speed * 100 / self.duration;
        if (self.t >= 100) { self.t = 100; self.render(); self.pause(); return; }
        self.render();
      }
      self._last = now;
      self._raf = requestAnimationFrame(step);
    }
    this._raf = requestAnimationFrame(step);
  };
  BattleMap.prototype.pause = function () {
    this.playing = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this.playBtn.textContent = this.t >= 100 ? T('replay') : T('play');
  };

  /* A page in another language sets window.NelsonBattleLocale[scenario.key]
     with translated captions; ships are matched by id. */
  function applyLocale(sc, loc) {
    if (loc.title) sc.title = loc.title;
    if (loc.days) sc.days = loc.days;
    if (loc.sides) sc.sides = loc.sides;
    if (loc.wind && sc.wind) sc.wind.label = loc.wind;
    if (loc.scale && sc.scale) sc.scale.label = loc.scale;
    (loc.labels || []).forEach(function (txt, i) { if (txt && sc.labels && sc.labels[i]) sc.labels[i].text = txt; });
    (loc.phases || []).forEach(function (p, i) { if (sc.phases[i]) { sc.phases[i].title = p[0]; sc.phases[i].text = p[1]; } });
    if (loc.ships) sc.ships.forEach(function (sh) {
      var o = loc.ships[sh.id];
      if (!o) return;
      if (o.name) sh.name = o.name;
      if (o.fate) sh.fate = o.fate;
    });
  }

  window.NelsonBattle = {
    maps: {},
    mount: function (id, scenario) {
      var root = document.getElementById(id);
      if (!root) return null;
      var loc = window.NelsonBattleLocale && window.NelsonBattleLocale[scenario.key];
      if (loc) applyLocale(scenario, loc);
      var m = new BattleMap(root, scenario);
      this.maps[id] = m;
      return m;
    }
  };
})();
