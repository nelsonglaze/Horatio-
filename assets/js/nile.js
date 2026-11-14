/* The Nile (Aboukir Bay), 1-2 August 1798: scenario for the battle-plan engine.
   North is up. The French lie at anchor in a bent line, bows to the north-west;
   the British round Aboukir Island at sunset and take the van on both sides. */
(function () {
  'use strict';

  /* French line, van to rear: name, guns, captain, flag, x, y, heading */
  var F = [
    ['Guerrier', 74, 'Capt. Jean-François-Timothée Trullet', null, 430, 292, 315],
    ['Conquérant', 74, 'Capt. Étienne Dalbarade', null, 455.5, 317.5, 315],
    ['Spartiate', 74, 'Capt. Maurice-Julien Emeriau', null, 481, 343, 315],
    ['Aquilon', 74, 'Capt. Antoine Thévenard (killed)', null, 506.5, 368.5, 315],
    ['Peuple Souverain', 74, 'Capt. Pierre-Paul Raccord', null, 532, 394, 315],
    ['Franklin', 80, 'Capt. Maurice Gillet', 'Rear-Adm. Blanquet du Chayla', 557.5, 419.5, 315],
    ['Orient', 120, 'Capt. Luc-Julien-Joseph Casabianca (killed)', 'Vice-Adm. Brueys (killed)', 583, 445, 318],
    ['Tonnant', 80, 'Commodore Aristide Dupetit-Thouars (killed)', null, 598, 478, 335],
    ['Heureux', 74, 'Capt. Jean-Pierre Étienne', null, 610.3, 511.8, 340],
    ['Mercure', 74, 'Capt. Cambon', null, 622.6, 545.6, 340],
    ['Guillaume Tell', 80, 'Capt. Saulnier', 'Rear-Adm. Villeneuve', 634.9, 579.4, 340],
    ['Généreux', 74, 'Capt. Louis-Jean-Nicolas Lejoille', null, 647.2, 613.2, 340],
    ['Timoléon', 74, 'Capt. Louis-Léonce Trullet', null, 659.5, 647, 340]
  ];
  var ships = [];
  function fr(i, extra, fate, more) {
    var f = F[i], tr = [[0, f[4], f[5], f[6]]].concat(extra && extra.track || []);
    ships.push({
      id: 'f' + i, name: f[0], side: 'french', guns: f[1], captain: f[2], flag: f[3], fate: fate, track: tr, ev: extra && extra.ev || {},
      key: !!(more && more.key), label: more && more.label || [16, 5, 'start']
    });
  }
  fr(0, { ev: { dismast: 24, struck: 52 } }, 'Raked by five ships in turn and dismasted within minutes; struck about 9 pm. Burnt as beyond repair.');
  fr(1, { ev: { dismast: 28, struck: 34 } }, 'An old ship with light guns; the first to strike, after barely twenty minutes.');
  fr(2, { ev: { dismast: 50, struck: 59 } }, 'Fought Vanguard and Theseus; struck about 9 pm. Served at Trafalgar as HMS Spartiate.');
  fr(3, { ev: { dismast: 52, struck: 61 } }, 'Raked by Minotaur; struck about 9.25 pm.');
  fr(4, { track: [[44, 532, 394, 315], [54, 506, 456, 300]], ev: { dismast: 40, struck: 66 } }, 'Cable cut by shot; drifted out of the line, opening the gap Leander used.');
  fr(5, { ev: { dismast: 62, struck: 74 } }, 'Fought on until both admirals aboard were wounded; struck near midnight. Became HMS Canopus.');
  fr(6, { ev: { burn: [56, 68], explode: 68 } }, 'Flagship of the expedition. Caught fire about 9 pm and blew up about 10 pm with the fleet’s treasure aboard.', { key: true, label: [36, -6, 'start'] });
  fr(7, { track: [[67, 598, 478, 335], [80, 580, 612, 320]], ev: { dismast: 70 } }, 'Dupetit-Thouars, legs shot away, would not strike. Drifted south dismasted; surrendered 3 August. Fought at Trafalgar as HMS Tonnant.');
  fr(8, { track: [[66, 610.3, 511.8, 340], [77, 528, 668, 300]], ev: { aground: 77, struck: 88 } }, 'Cut her cable to escape the burning Orient and grounded; struck next morning.');
  fr(9, { track: [[66.5, 622.6, 545.6, 340], [78, 556, 702, 300]], ev: { aground: 78, struck: 88 } }, 'Cut her cable and grounded; struck next morning.');
  fr(10, { track: [[90, 634.9, 579.4, 340], [93, 690, 552], [108, 1160, 330]], ev: {} }, 'Villeneuve’s flagship. Escaped on 2 August; taken off Malta in March 1800.', { key: true });
  fr(11, { track: [[90.6, 647.2, 613.2, 340], [94, 704, 584], [109, 1160, 372]], ev: {} }, 'Escaped; captured HMS Leander eighteen days later. Taken by Nelson’s squadron in February 1800.');
  fr(12, { track: [[92.5, 659.5, 647, 340], [97.5, 704, 737, 150]], ev: { aground: 97.5, burn: [98.6, 101] } }, 'Too far to leeward to escape; run ashore and burnt by her own crew on 3 August.');

  [
    ['Sérieuse', 36, 'Capt. Claude-Jean Martin', 462, 408, { sink: 29 }, 'Fired on Orion as she passed and was sunk in the shallows by a single broadside.'],
    ['Artémise', 36, 'Capt. Pierre-Jean Standelet', 540, 482, { burn: [84, 89], explode: 89 }, 'Struck, then was set alight by her crew and blew up on 2 August.']
  ].forEach(function (a, i) {
    ships.push({ id: 'ff' + i, name: a[0], side: 'french', guns: a[1], captain: a[2], track: [[0, a[3], a[4], 320]], ev: a[5], fate: a[6], label: [-12, 16, 'end'] });
  });
  ships.push({ id: 'diane', name: 'Diane', side: 'french', guns: 40, captain: 'Capt. Éléonore-Jean-Nicolas Soleil', flag: 'Rear-Adm. Decrès', fate: 'Escaped with Villeneuve on 2 August.', label: [-12, 16, 'end'],
    track: [[0, 603, 640, 330], [90.3, 603, 640, 330], [93.5, 650, 700], [96, 716, 668], [110, 1160, 440]], ev: {} });
  ships.push({ id: 'justice', name: 'Justice', side: 'french', guns: 40, captain: 'Capt. Villeneuve', fate: 'Escaped with Villeneuve on 2 August.', label: [-12, 16, 'end'],
    track: [[0, 622, 676, 330], [90.9, 622, 676, 330], [94, 672, 716], [96.5, 730, 690], [111, 1160, 480]], ev: {} });

  /* ---- British: everyone follows the same track round the island shoal ---- */
  var L = [[-140, 152], [150, 120], [330, 100], [452, 185]], SP = 18;
  var cum = [0], k;
  for (k = 1; k < L.length; k++) cum.push(cum[k - 1] + Math.hypot(L[k][0] - L[k - 1][0], L[k][1] - L[k - 1][1]));
  var S3 = cum[cum.length - 1];
  function pt(s) {
    var i, u;
    if (s <= 0) { u = s / cum[1]; return [L[0][0] + (L[1][0] - L[0][0]) * u, L[0][1] + (L[1][1] - L[0][1]) * u]; }
    for (i = 1; i < L.length; i++) if (s <= cum[i]) { u = (s - cum[i - 1]) / (cum[i] - cum[i - 1]); return [L[i - 1][0] + (L[i][0] - L[i - 1][0]) * u, L[i - 1][1] + (L[i][1] - L[i - 1][1]) * u]; }
    return L[L.length - 1];
  }
  function approach(T3, from) {
    var t0 = from || 0, tr = [[t0].concat(pt(S3 - SP * (T3 - t0)))], i, tk;
    for (i = 1; i < L.length; i++) { tk = T3 - (S3 - cum[i]) / SP; if (tk > t0 + .05) tr.push([tk, L[i][0], L[i][1]]); }
    return tr;
  }
  function br(name, guns, captain, flag, T3, way, fate, more) {
    var tr = approach(T3);
    way.forEach(function (w) { tr.push([w[4] ? w[0] : T3 + w[0], w[1], w[2], w[3]]); });
    ships.push({
      id: 'b' + ships.length, name: name, side: 'british', guns: guns, captain: captain, flag: flag, fate: fate, track: tr,
      ev: more && more.ev || {}, key: !!(more && more.key), label: more && more.label || [0, -15]
    });
  }
  /* way-points: [time after rounding the shoal, x, y, heading]; a fifth element marks an absolute time */
  br('Goliath', 74, 'Capt. Thomas Foley', null, 12, [[4, 426, 252], [6.5, 407, 274], [10, 418, 312], [13, 443.5, 336.5, 135], [85, 443.5, 336.5, 135, 1], [90, 548, 628, 150, 1]],
    'Led the fleet. Foley saw there was room to pass inside the French line and took it; anchored on Conquérant’s inshore quarter.', { key: true, label: [-13, 17, 'end'] });
  br('Zealous', 74, 'Capt. Samuel Hood', null, 13.3, [[4, 426, 252], [6, 410, 270], [8, 406, 288, 150], [91, 406, 288, 150, 1], [94, 470, 250, null, 1], [97, 545, 238, null, 1], [101, 500, 262, null, 1]],
    'Anchored off Guerrier’s bow and dismasted her in twelve minutes. Chased Villeneuve alone next day until recalled.');
  br('Orion', 74, 'Capt. Sir James Saumarez', null, 14.6, [[4, 420, 250], [7, 396, 282], [10.5, 410, 340], [14, 452, 392], [20, 527.7, 423.7, 135]],
    'Swept wide inshore, sank the frigate Sérieuse with one broadside, and anchored between Peuple Souverain and Franklin.');
  br('Audacious', 74, 'Capt. Davidge Gould', null, 15.9, [[5.5, 450, 262], [8.5, 443, 303], [10.5, 430, 320, 150]],
    'Cut through the line between Guerrier and Conquérant and raked both.');
  br('Theseus', 74, 'Capt. Ralph Miller', null, 17.2, [[4, 426, 252], [6, 410, 268], [8, 418, 290], [11.5, 428, 352], [15, 463, 362, 135], [85, 463, 362, 135, 1], [90, 520, 640, 150, 1]],
    'Passed between Zealous and her victim and anchored inshore of Spartiate.');
  br('Vanguard', 74, 'Capt. Edward Berry', 'Rear-Adm. Sir Horatio Nelson', 18.8, [[5, 466, 250], [8.5, 486, 300], [11, 498, 326, 135]],
    'First to anchor on the seaward side, doubling the French van. 30 killed, 76 wounded; Nelson struck on the forehead about 8.30 pm.', { key: true, label: [16, -10, 'start'] });
  br('Minotaur', 74, 'Capt. Thomas Louis', null, 20.1, [[5, 470, 250], [9, 500, 300], [13, 523.5, 351.5, 135]],
    'Anchored outside Aquilon and covered the hard-pressed Vanguard.');
  br('Defence', 74, 'Capt. John Peyton', null, 21.4, [[5, 472, 250], [10, 520, 320], [14.5, 549, 377, 135]],
    'Engaged Peuple Souverain from the seaward side.');
  br('Bellerophon', 74, 'Capt. Henry Darby', null, 22.7, [[5, 474, 250], [11, 540, 330], [16.5, 600, 428, 135], [48, 600, 428, 135, 1], [62, 730, 590, 120, 1], [100, 772, 648, 120, 1]],
    'Brought up alongside the 120-gun Orient; lost every mast and 197 men, and drifted out of the fight.', { ev: { dismast: 46, cease: 47 } });
  br('Majestic', 74, 'Capt. George Westcott (killed)', null, 24, [[5, 476, 250], [11, 560, 360], [17, 624, 468], [19, 630, 498, 160], [56, 630, 498, 160, 1], [60, 643, 532, 160, 1]],
    'Ran her jib-boom into Heureux’s rigging; Westcott was shot dead. 50 killed, 143 wounded.');
  br('Alexander', 74, 'Capt. Alexander Ball', null, 34, [[3.6, 476, 250], [11.5, 560, 372], [15.5, 612, 446], [17.2, 590, 464], [19, 566, 462, 120], [85, 566, 462, 120, 1], [89, 580, 668, 160, 1]],
    'Arrived after dark, cut the line astern of Orient and raked her from inshore.');
  br('Swiftsure', 74, 'Capt. Benjamin Hallowell', null, 35.5, [[3.6, 476, 250], [11.6, 556, 366], [15, 588, 414, 135]],
    'Anchored between Franklin and Orient. Hallowell later had a coffin made for Nelson from Orient’s mainmast.');
  ships.push({
    id: 'culloden', name: 'Culloden', side: 'british', guns: 74, captain: 'Capt. Thomas Troubridge', key: true, label: [0, -16],
    fate: 'Cut the corner of the island shoal and stuck fast, a spectator of the whole battle. Her fate warned Alexander and Swiftsure clear.',
    track: [[0, -90, 152], [13, 150, 126], [21, 310, 110], [25, 374, 184, 130]], ev: { aground: 25 }, noFire: true
  });
  ships.push({
    id: 'mutine', name: 'Mutine', side: 'british', guns: 16, captain: 'Cmdr Thomas Masterman Hardy', label: [0, -13],
    fate: 'The fleet’s only small craft; stood by the grounded Culloden.',
    track: [[0, -150, 172], [15, 150, 140], [24, 330, 96], [28, 404, 154, 140]], ev: {}, noFire: true
  });
  (function () {
    var tr = [[0, -190, 160], [17, 150, 110], [26, 330, 84], [30, 430, 138, 140], [37, 430, 138, 140], [39, 452, 185]];
    [[42.6, 474, 250], [48.6, 520, 350], [52.5, 543, 403, 215]].forEach(function (w) { tr.push(w); });
    ships.push({
      id: 'leander', name: 'Leander', side: 'british', guns: 50, captain: 'Capt. Thomas Thompson', label: [0, -14],
      fate: 'Stopped to help Culloden, then slipped into the gap left by Peuple Souverain and raked Franklin and Orient.', track: tr, ev: {}
    });
  })();

  window.NelsonBattle.mount('plan', {
    key: 'nile',
    title: 'The Battle of the Nile',
    size: [1100, 780], duration: 95, shipScale: .92,
    rose: [1006, 98], north: 0,
    wind: { x: 880, y: 92, toward: 157, label: 'Wind NNW' },
    clock: [[0, 1050], [12, 1095], [17, 1110], [30, 1140], [44, 1200], [56, 1260], [68, 1320], [76, 1440], [84, 1800], [100, 2220]],
    days: ['1 August 1798', '2 August 1798'],
    night: [[0, 0], [14, .06], [30, .46], [78, .46], [84, .14], [88, 0]],
    sides: { british: 'British', french: 'French' },
    autoFire: { range: 37, quiet: [[68.3, 71.6], [76, 84.6]] },
    land: [
      'M-10,330 L40,318 L110,306 L160,300 L176,306 L172,330 L150,372 L132,440 L128,520 L142,600 L180,668 L250,715 L360,742 L520,752 L700,750 L900,742 L1110,728 L1110,790 L-10,790 Z',
      'M246,172 a16,9 0 1,0 32,0 a16,9 0 1,0 -32,0 Z'
    ],
    shoals: [
      'M172,300 Q200,250 240,190 Q262,140 320,128 Q372,128 388,170 Q372,210 300,216 Q250,250 200,310 Z',
      'M176,330 Q260,330 330,372 Q400,430 452,520 Q500,610 560,690 Q600,725 700,728 L900,722 L1110,712 L1110,728 L900,742 L700,750 L520,752 L360,742 L250,715 L180,668 L142,600 L128,520 L132,440 L150,372 L172,330 Z'
    ],
    forts: [{ x: 162, y: 312, r: 9 }],
    labels: [
      { x: 60, y: 520, text: 'EGYPT', cls: 'caps' },
      { x: 30, y: 352, text: 'Aboukir Castle', cls: 'small' },
      { x: 236, y: 158, text: 'Aboukir Island', cls: 'small', anchor: 'end' },
      { x: 250, y: 470, text: 'shoal water', cls: 'small', rot: 52 },
      { x: 790, y: 420, text: 'ABOUKIR  BAY', cls: 'sea' },
      { x: 14, y: 290, text: '← Alexandria, 13 miles', cls: 'small' },
      { x: 1086, y: 702, text: 'Rosetta mouth of the Nile →', cls: 'small', anchor: 'end' }
    ],
    ships: ships,
    phases: [
      { t: 0, title: 'Round the island at sunset', text: 'After ten weeks of searching, Nelson finds Brueys at anchor in Aboukir Bay. He does not wait for morning or for his stragglers: the fleet steers round the shoal off Aboukir Island with the wind astern.' },
      { t: 12, title: 'The French open fire', text: 'Thirteen ships lie in a bent line, bows to the north-west, guns run out to seaward. Many of their men are ashore digging wells. Guerrier and Conquérant fire first, at about 6.20 pm.' },
      { t: 16, title: 'Foley goes inside', text: 'Goliath crosses Guerrier’s bows. Foley reasons that where a French ship can swing at single anchor, a British ship can sail. The inshore guns are not even cleared for action.' },
      { t: 21, title: 'Five ships inshore', text: 'Zealous, Orion, Audacious and Theseus follow Goliath round. Orion sinks the frigate Sérieuse on her way down the line.' },
      { t: 28, title: 'Nelson doubles the van', text: 'Vanguard anchors on the seaward side; Minotaur and Defence come down astern of her. Each of the leading French ships now has an enemy on either beam, and the rear cannot beat up to help.' },
      { t: 36, title: 'Bellerophon and the Orient', text: 'Bellerophon brings up against the three-decker flagship, twice her force. Within the hour she is dismasted and drifting. Culloden is fast on the shoal; Majestic loses her captain.' },
      { t: 48, title: 'Help arrives in the dark', text: 'Alexander and Swiftsure, back from looking into Alexandria, steer for the gun-flashes. Leander anchors across Franklin’s bows. About 8.30 Nelson is laid open to the bone above his blind eye and carried below.' },
      { t: 56, title: 'Orient is on fire', text: 'Flames climb the flagship’s rigging. Brueys is already dead. Ships on both sides cut their cables or close their ports to get clear of what is coming.' },
      { t: 68, title: 'The explosion', text: 'About 10 pm the Orient blows up with a shock heard in Alexandria. For several minutes not a gun fires in the bay.' },
      { t: 72, title: 'Franklin strikes', text: 'The fight in the centre sputters on until near midnight. Crews on both sides are so spent that men fall asleep at their guns.' },
      { t: 84, title: 'Dawn, 2 August', text: 'The French van and centre are prizes or wrecks. The freshest British ships work down towards the rear, where Heureux and Mercure lie aground. Both strike.' },
      { t: 90, title: 'Villeneuve escapes', text: 'Guillaume Tell, Généreux and two frigates cut and run for the open sea. Only Zealous is fit to chase, and Nelson recalls her. Timoléon is run ashore and burnt.' }
    ]
  });
})();
