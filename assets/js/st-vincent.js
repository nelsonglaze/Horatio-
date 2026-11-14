/* Cape St Vincent, 14 February 1797: scenario for the battle-plan engine.
   North is up. Jervis's fifteen cut between the two halves of a Spanish fleet
   of twenty-seven, then tack after the larger half. Nelson leaves the line. */
(function () {
  'use strict';

  var ships = [];
  function at(keys, t) {
    var i, a, b, u;
    if (t <= keys[0][0]) return [keys[0][1], keys[0][2]];
    for (i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
      a = keys[i - 1]; b = keys[i]; u = (t - a[0]) / (b[0] - a[0]);
      return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
    }
    return [keys[keys.length - 1][1], keys[keys.length - 1][2]];
  }

  /* ---- Spanish main (windward) body: a loose mass moving as one ---- */
  var C = [[0, 360, 410], [12, 455, 425], [18, 478, 400], [24, 480, 350], [48, 462, 200], [70, 445, 132], [100, 425, 64]];
  function main(name, guns, captain, flag, off, fate, own, more) {
    var tr = [], ev = more && more.ev || {};
    C.forEach(function (c) { if (!own || c[0] <= 48) tr.push([c[0], c[1] + off[0], c[2] + off[1]]); });
    (own || []).forEach(function (k) { tr.push(k); });
    ships.push({ id: 's' + ships.length, name: name, side: 'spanish', guns: guns, captain: captain, flag: flag, fate: fate, track: tr, ev: ev,
      key: !!(more && more.key), label: more && more.label || [-15, -6, 'end'] });
  }
  main('Santísima Trinidad', 130, 'Capt. Rafael Orozco', 'Adm. José de Córdoba', [0, -40],
    'The only four-decker in the world. Battered by five ships and reported to have struck, but got away under tow.',
    [[54, 490, 152], [100, 512, 122, 15]], { ev: { dismast: 88 }, key: true, label: [-18, -12, 'end'] });
  main('Mexicano', 112, null, null, [-30, -62], 'One of the leading group Nelson headed off.', [[54, 455, 128], [100, 470, 92, 10]]);
  main('San Josef', 112, 'Capt. Pedro Pineda', 'Rear-Adm. Francisco Winthuysen (killed)', [28, -20],
    'Boarded by Nelson from the deck of San Nicolás. Taken into the Navy; Nelson flew his flag in her in 1801.',
    [[54, 516, 176], [78, 528, 186], [80, 534, 191, 25], [100, 542, 181, 25]], { ev: { struck: 90 }, key: true, label: [-16, -10, 'end'] });
  main('San Nicolás', 80, 'Commodore Tomás Geraldino (killed)', null, [44, 4],
    'Luffed up under Excellent’s fire and fell aboard San Josef. Boarded and taken by Nelson.',
    [[54, 530, 198], [78, 540, 200], [80, 544, 200, 30], [100, 552, 190, 30]], { ev: { struck: 84 } });
  main('Salvador del Mundo', 112, 'Commodore Antonio Yepes (killed)', null, [18, 12],
    'Struck to Excellent, then to Orion, which took possession.', [[54, 480, 226], [72, 492, 252, 20], [100, 498, 252, 20]], { ev: { struck: 72, dismast: 68 } });
  main('San Ysidro', 74, 'Capt. Teodoro Argumosa', null, [10, 44],
    'Struck to Excellent about 2.50 pm, the first prize of the day.', [[54, 492, 240], [75, 522, 226, 30], [100, 530, 224, 30]], { ev: { struck: 75, dismast: 72 } });
  main('Soberano', 74, 'Capt. Juan Vicente Yáñez', null, [-22, -14], 'One of the leading group Nelson headed off.', [[54, 462, 176], [100, 480, 150, 10]]);
  [['Purísima Concepción', 112, 'Vice-Adm. Francisco Morales de los Ríos', [-50, -30]], ['San Ildefonso', 74, null, [-70, -60]],
    ['San Juan Nepomuceno', 74, null, [-62, 4]], ['San Genaro', 74, null, [-36, 22]], ['San Francisco de Paula', 74, null, [-84, -22]],
    ['San Antonio', 74, null, [-100, -52]], ['Neptuno', 80, null, [-74, 40]], ['Bahama', 74, null, [-110, 6]],
    ['San Domingo', 74, null, [-40, 62]], ['Terrible', 74, null, [-92, 70]], ['San Fermín', 74, null, [-130, 44]]
  ].forEach(function (s) { main(s[0], s[1], null, s[2], s[3], 'Main body. Passed the British line on the opposite tack and stood on northward.'); });

  /* ---- Spanish leeward division ---- */
  var Lc = [[0, 735, 505], [20, 712, 492], [34, 630, 446], [40, 598, 432], [47, 640, 470], [60, 752, 462], [76, 842, 352], [90, 800, 232], [100, 742, 196]];
  [['Príncipe de Asturias', 112, 'Vice-Adm. Juan Joaquín Moreno', [0, 0], true], ['Conde de Regla', 112, 'Rear-Adm. Claude-François d’Amblimont (killed)', [26, 22]],
    ['Oriente', 74, null, [-20, 30]], ['Atlante', 74, null, [40, -14]], ['Glorioso', 74, null, [60, 30]], ['Conquistador', 74, null, [14, 54]], ['Firme', 74, null, [70, 60]]
  ].forEach(function (s) {
    ships.push({ id: 'l' + ships.length, name: s[0], side: 'spanish', guns: s[1], flag: s[2], key: !!s[4], label: [16, 5, 'start'],
      fate: 'Leeward division. Tried to break through where the British were tacking, was driven off by Victory’s broadsides, and worked round to rejoin late in the day.',
      track: Lc.map(function (c) { return [c[0], c[1] + s[3][0], c[2] + s[3][1]]; }), ev: {} });
  });
  [['Infante Don Pelayo', 1140, 250, 700, 150], ['San Pablo', 1150, 292, 724, 174]].forEach(function (s) {
    ships.push({ id: 'p' + ships.length, name: s[0], side: 'spanish', guns: 74, label: [16, 5, 'start'],
      fate: 'Detached before the battle; came up in the late afternoon and helped save Santísima Trinidad.',
      track: [[0, s[1], s[2]], [72, s[1], s[2]], [100, s[3], s[4]]], ev: {} });
  });

  /* ---- British line: steering SSW, tacking in succession at one spot ---- */
  var T = [540, 420], U = [-0.3433, 0.9392], VB = 11.03, GAP = 30;
  function linePos(j, t) { var d = VB * (28 + j * GAP / VB - t); return [T[0] - U[0] * d, T[1] - U[1] * d]; }
  function brit(j, name, guns, captain, flag, after, fate, more) {
    more = more || {};
    var tack = 28 + j * GAP / VB, leave = more.leave !== undefined ? more.leave : tack, tr;
    tr = [[0].concat(linePos(j, 0)), [leave].concat(linePos(j, leave))];
    after.forEach(function (k) { tr.push(k); });
    ships.push({ id: 'b' + j, name: name, side: 'british', guns: guns, captain: captain, flag: flag, fate: fate, track: tr, ev: more.ev || {},
      key: !!more.key, label: more.label || [16, 5, 'start'] });
  }
  brit(0, 'Culloden', 74, 'Capt. Thomas Troubridge', null, [[60, 540, 262], [100, 546, 246, 350]],
    'Led the line through the gap, tacked first, and was the first to reach Nelson. 10 killed, 47 wounded.', { key: true, label: [16, 12, 'start'] });
  brit(1, 'Blenheim', 90, 'Capt. Thomas Frederick', null, [[63, 540, 232], [70, 512, 180], [100, 490, 138, 10]],
    'Passed between Captain and the enemy to give her a breathing space, then fought Santísima Trinidad. 12 killed, 49 wounded.');
  brit(2, 'Prince George', 98, 'Capt. John Irwin', 'Rear-Adm. William Parker', [[66, 560, 250], [84, 574, 216], [100, 580, 200, 340]],
    'Poured broadsides into San Josef as Nelson boarded San Nicolás.');
  brit(3, 'Orion', 74, 'Capt. Sir James Saumarez', null, [[68, 500, 286], [100, 478, 268, 350]],
    'Took possession of Salvador del Mundo, then engaged Santísima Trinidad.');
  brit(4, 'Colossus', 74, 'Capt. George Murray', null, [[46, 566, 452], [100, 592, 470, 120]],
    'Lost her fore-yard and fore-topsail yard at the turning-point and fell out of the line.', { ev: { cease: 39 } });
  brit(5, 'Irresistible', 74, 'Capt. George Martin', null, [[72, 520, 296], [100, 534, 146, 0]],
    'Engaged Santísima Trinidad. Nelson shifted his broad pendant into her that evening.');
  brit(6, 'Victory', 100, 'Capt. George Grey', 'Adm. Sir John Jervis', [[100, 524, 300, 352]],
    'Jervis’s flagship. Her raking broadside turned back the Spanish leeward division. 1 killed, 5 wounded.', { key: true, label: [16, 14, 'start'] });
  brit(7, 'Egmont', 74, 'Capt. John Sutton', null, [[100, 530, 326, 352]], 'In the centre of the line; no casualties.');
  brit(8, 'Goliath', 74, 'Capt. Sir Charles Knowles', null, [[100, 536, 352, 352]], 'In the centre of the line.');
  brit(9, 'Barfleur', 98, 'Capt. James Dacres', 'Vice-Adm. William Waldegrave', [[100, 541, 378, 352]], 'In the centre of the line.');
  brit(10, 'Britannia', 100, 'Capt. Thomas Foley', 'Vice-Adm. Charles Thompson', [[100, 545, 402, 352]], 'Thompson did not act on the signal that would have sent the rear division to cut the Spaniards off.');
  brit(11, 'Namur', 90, 'Capt. James Whitshed', null, [[100, 534, 426, 340]], 'In the rear of the line.');
  brit(12, 'Captain', 74, 'Capt. Ralph Miller', 'Commodore Horatio Nelson', [[49.3, 603, 296], [50.3, 608, 282], [51.3, 592, 279], [55, 556, 228], [78, 566, 216, 320], [80.5, 554, 208, 30], [100, 562, 198, 30]],
    'Wore out of the line without orders and fought seven ships. Wheel and fore-topmast shot away; 24 killed, 56 wounded, a third of the fleet’s loss.',
    { leave: 48, key: true, ev: { dismast: 76 }, label: [18, 16, 'start'] });
  brit(13, 'Diadem', 64, 'Capt. George Towry', null, [[100, 552, 446, 330]], 'Next astern of Captain; held her place in the line.');
  brit(14, 'Excellent', 74, 'Capt. Cuthbert Collingwood', null, [[62, 540, 286], [70, 509, 258], [74, 536, 238], [78, 556, 212], [84, 534, 152], [100, 530, 108, 0]],
    'Ordered out of the line to support Nelson. Forced two ships to strike, drove San Nicolás into San Josef, and passed on to Santísima Trinidad. 11 killed, 12 wounded.',
    { leave: 56, key: true, label: [16, -8, 'start'] });

  window.NelsonBattle.mount('plan', {
    key: 'stvincent',
    title: 'The Battle of Cape St Vincent',
    size: [1100, 760], duration: 90, shipScale: .92,
    rose: [96, 650], north: 0,
    wind: { x: 240, y: 646, toward: 79, label: 'Wind W by S' },
    scale: { px: 150, label: '1 nautical mile', x: 880, y: 734 },
    clock: [[0, 645], [20, 690], [28, 728], [48, 770], [60, 810], [70, 860], [80, 920], [90, 960], [100, 1020]],
    days: ['14 February 1797'],
    sides: { british: 'British', spanish: 'Spanish' },
    autoFire: { range: 62 },
    labels: [
      { x: 1082, y: 34, text: 'Cape St Vincent, 25 miles north-east ↗', cls: 'small', anchor: 'end' },
      { x: 1082, y: 600, text: 'to Cádiz →', cls: 'small', anchor: 'end' },
      { x: 130, y: 250, text: 'ATLANTIC  OCEAN', cls: 'sea' },
      { x: 250, y: 520, text: 'Spanish main body, 18 sail', cls: 'small' },
      { x: 770, y: 600, text: 'Leeward division', cls: 'small' }
    ],
    ships: ships,
    phases: [
      { t: 0, title: 'Jervis steers for the gap', text: 'Out of the morning haze the Spanish Grand Fleet appears in two loose bodies, running for Cádiz before a westerly: twenty-seven of the line to Jervis’s fifteen. He forms a single line ahead and steers south for the open water between them.' },
      { t: 20, title: 'Culloden splits the fleet', text: 'At 11.30 Troubridge leads through. The larger Spanish body hauls its wind and runs north past the British line on the opposite tack, firing as it goes. The smaller is cut off to leeward.' },
      { t: 28, title: 'Tack in succession', text: 'A few minutes after noon Jervis signals the line to tack and follow the main body. Culloden has her answering flag ready and turns at once. Every ship behind her must reach the same spot before she can turn.' },
      { t: 36, title: 'The leeward division is driven off', text: 'Moreno’s ships make for the turning-point to break through and rejoin. Victory backs her topsails and rakes Príncipe de Asturias; the division bears away.' },
      { t: 48, title: 'Nelson wears out of the line', text: 'From third in the rear Nelson sees the Spanish van bearing up to slip round the British tail. Without orders he wears Captain, passes between Diadem and Excellent, and puts a 74 across the path of seven ships, one of them of 130 guns.' },
      { t: 60, title: 'Culloden comes up', text: 'After an hour’s chase Troubridge reaches him. Blenheim passes between Captain and the enemy to give her a few minutes’ respite. Captain has lost her fore-topmast and her wheel.' },
      { t: 68, title: 'Collingwood joins', text: 'Jervis has ordered Excellent out of the line as well. In half an hour she makes Salvador del Mundo and San Ysidro haul down their colours, and does not stop to take possession.' },
      { t: 78, title: 'The patent bridge', text: 'Excellent passes San Nicolás at ten feet, firing. The Spaniard luffs and falls aboard San Josef. Captain, unmanageable, is laid against San Nicolás; Nelson boards through her quarter-gallery, takes her, then crosses her deck into the three-decker beyond.' },
      { t: 90, title: 'San Josef surrenders', text: 'On the quarterdeck of a Spanish first-rate Nelson receives the officers’ swords, handing them to his bargeman William Fearney, who tucks them under his arm. The fleet calls it “Nelson’s patent bridge for boarding first-rates”.' },
      { t: 95, title: 'Jervis covers his prizes', text: 'Santísima Trinidad, dismasted, is said to have struck when the leeward division and two fresh ships close in. Jervis forms line to protect four prizes and his cripples, and the fleets part at dusk.' }
    ]
  });
})();
