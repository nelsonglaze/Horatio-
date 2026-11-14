/* Santa Cruz de Tenerife, night of 24-25 July 1797: scenario for the battle-plan engine.
   North is up; the town lies on an east-facing shore. The boats pull for the
   mole in the dark; most miss it and are thrown on the rocks to the south. */
(function () {
  'use strict';
  var ships = [];

  /* shore batteries, north to south */
  [['Paso Alto fort', 348, 96, 8], ['San Pedro battery', 336, 196, 6], ['Castillo de San Cristóbal', 320, 346, 12],
    ['La Concepción battery', 314, 394, 6], ['San Telmo battery', 310, 442, 6], ['San Juan fort', 300, 528, 8]
  ].forEach(function (b, i) {
    ships.push({ id: 'bat' + i, name: b[0], side: 'spanish', guns: b[3], shape: 'battery', scale: i === 2 ? 1.1 : .8, range: 172, noTarget: true,
      captain: i === 2 ? 'Lt-Gen. Antonio Gutiérrez' : null, key: i === 2, label: i === 2 ? [-20, 6, 'end'] : [-14, 5, 'end'],
      fate: i === 2 ? 'The citadel at the foot of the mole, and Gutiérrez’s headquarters. Its grapeshot cleared the mole.' : 'Shore battery.',
      track: [[0, b[1], b[2], 0]], ev: {} });
  });
  /* militia closing round the convent at daybreak */
  [[188, 300, 218, 358], [176, 430, 214, 404], [278, 452, 268, 412]].forEach(function (m, i) {
    ships.push({ id: 'mil' + i, name: 'Spanish troops and militia', side: 'spanish', shape: 'battery', scale: .55, noTarget: true, label: [0, -12],
      fate: 'Regulars of the Canarias battalion, island militia and French seamen: several thousand men under arms by morning.',
      track: [[0, m[0], m[1], 0], [70, m[0], m[1], 0], [84, m[2], m[3], 0]], ev: { fire: [[84, 95, 'B']], hide: [[0, 62]] } });
  });

  /* the squadron, at anchor two miles off */
  [['Theseus', 74, 'Capt. Ralph Miller', 'Rear-Adm. Sir Horatio Nelson', 780, 150], ['Culloden', 74, 'Capt. Thomas Troubridge', null, 832, 206],
    ['Zealous', 74, 'Capt. Samuel Hood', null, 758, 228], ['Leander', 50, 'Capt. Thomas Thompson', null, 852, 140],
    ['Seahorse', 38, 'Capt. Thomas Fremantle', null, 662, 252], ['Emerald', 36, 'Capt. Thomas Waller', null, 640, 318], ['Terpsichore', 32, 'Capt. Richard Bowen (killed)', null, 672, 192]
  ].forEach(function (s, i) {
    ships.push({ id: 'sq' + i, name: s[0], side: 'british', guns: s[1], captain: s[2], flag: s[3], noFire: true, noTarget: true, key: i === 0, label: [0, -18],
      fate: i === 0 ? 'Nelson climbed her side one-handed and had his arm taken off in her cockpit within half an hour.' : (i === 4 ? 'Nearest ship to the shore. Nelson refused to be taken aboard, with Fremantle’s wife in her and Fremantle still ashore.' : 'At anchor; sent her boats.'),
      track: [[0, s[4], s[5], 60]], ev: {} });
  });
  ships.push({ id: 'fox', name: 'Fox', side: 'british', guns: 10, captain: 'Lieut. John Gibson (drowned)', noFire: true, label: [0, -14],
    fate: 'Cutter carrying 180 men. Struck between wind and water and sank at once; 97 were lost.',
    track: [[0, 700, 262], [40, 520, 312], [56, 432, 322]], ev: { sink: 57 } });

  function boat(id, name, who, track, fate, ev, key) {
    ships.push({ id: id, name: name, side: 'british', scale: .46, captain: who, noFire: true, track: track, fate: fate, ev: ev || {}, key: !!key, label: [0, -11] });
  }
  /* the boats that found the mole */
  boat('b-nelson', 'Nelson’s barge', 'Rear-Adm. Nelson; Lieut. Josiah Nisbet',
    [[0, 770, 170], [40, 470, 318], [50, 381, 327, 270], [53, 381, 327, 270], [56, 420, 320], [68, 652, 244], [78, 772, 162, 60]],
    'Nelson was hit as he stepped ashore. His stepson bound the arm and steered the barge back under the batteries, stopping to pick up men from the Fox.', {}, true);
  boat('b-fremantle', 'Fremantle’s boat', 'Capt. Thomas Fremantle (wounded)', [[0, 650, 258], [40, 462, 312], [50, 377, 318, 270]], 'Reached the mole. Fremantle was shot through the arm.');
  boat('b-bowen', 'Bowen’s boat', 'Capt. Richard Bowen (killed)', [[0, 668, 196], [40, 466, 324], [50, 373, 332, 270]], 'Stormed the mole battery and spiked its guns. Bowen and his first lieutenant were killed by grapeshot.');
  boat('b-thompson', 'Thompson’s boat', 'Capt. Thomas Thompson (wounded)', [[0, 845, 146], [42, 480, 330], [52, 382, 338, 270]], 'Reached the mole.');
  /* the boats swept south */
  boat('b-troubridge', 'Troubridge’s boats', 'Capt. Thomas Troubridge', [[0, 825, 212], [40, 480, 340], [57, 327, 404, 250]], 'Missed the mole in the dark and were stove in on the rocks south of the citadel.', { aground: 57 });
  boat('b-hood', 'Hood’s and Miller’s boats', 'Capts Samuel Hood and Ralph Miller', [[0, 755, 232], [42, 486, 352], [60, 322, 432, 250]], 'Landed through the surf further south; scaling ladders lost, powder soaked.', { aground: 60 });
  boat('b-waller', 'Waller’s boats', 'Capt. Thomas Waller', [[0, 640, 320], [42, 476, 368], [58, 318, 456, 250]], 'Landed through the surf south of the town.', { aground: 58 });
  boat('b-oldfield', 'Oldfield’s marines', 'Capt. Thomas Oldfield, Royal Marines', [[0, 782, 158], [44, 492, 382], [62, 314, 480, 250]], 'Landed through the surf south of the town.', { aground: 62 });

  ships.push({ id: 'party', name: 'Troubridge’s party', side: 'british', shape: 'battery', scale: .7, captain: 'About 340 seamen and marines', noFire: true, key: true, label: [0, 22],
    fate: 'Fought through the streets to the square, then held the convent of Santo Domingo until terms were agreed at about 7 am.',
    track: [[0, 320, 424, 0], [62, 320, 424, 0], [72, 274, 352, 0], [82, 246, 384, 0]], ev: { hide: [[0, 61.5]] } });

  window.NelsonBattle.mount('plan-tenerife', {
    key: 'tenerife',
    title: 'Santa Cruz de Tenerife',
    size: [1000, 640], duration: 70, shipScale: 1.05,
    rose: [912, 548], north: 0,
    scale: { px: 190, label: '1 nautical mile', x: 560, y: 612 },
    clock: [[0, 1350], [40, 1530], [60, 1575], [80, 1680], [100, 1860]],
    days: ['24 July 1797', '25 July 1797'],
    night: [[0, .5], [86, .5], [95, .16], [100, .04]],
    sides: { british: 'British', spanish: 'Spanish' },
    autoFire: { range: 172, quiet: [[0, 38], [66, 101]] },
    land: [
      'M-10,-10 L354,-10 L348,60 L340,120 L335,200 L329,260 L323,318 L378,314 L379,324 L325,332 L318,352 L313,400 L307,450 L301,520 L293,600 L290,650 L-10,650 Z'
    ],
    towns: ['M226,268 h72 v40 h-72 Z', 'M210,316 h86 v34 h-86 Z', 'M218,358 h18 v36 h-18 Z', 'M256,358 h40 v36 h-40 Z', 'M232,402 h60 v30 h-60 Z'],
    forts: [{ x: 246, y: 384, r: 7 }],
    labels: [
      { x: 30, y: 210, text: 'TENERIFE', cls: 'caps' },
      { x: 206, y: 256, text: 'Santa Cruz', cls: 'small', anchor: 'end' },
      { x: 386, y: 306, text: 'the mole', cls: 'small' },
      { x: 204, y: 392, text: 'Santo Domingo', cls: 'small', anchor: 'end' },
      { x: 334, y: 492, text: 'heavy surf', cls: 'small', rot: 84 },
      { x: 640, y: 480, text: 'ATLANTIC  OCEAN', cls: 'sea' }
    ],
    ships: ships,
    phases: [
      { t: 0, title: 'A thousand men in the boats', text: 'The first attempt, two days ago, failed and warned the town. Nelson now means to go straight at the mole in the dark with about a thousand seamen and marines, the boats roped together in six divisions, oars muffled.' },
      { t: 38, title: 'Discovered', text: 'At half past one, half a gunshot from the mole, the boats are seen. Bells ring, and some forty guns and the muskets of the garrison open together. The boats cast off, cheer, and pull for the shore.' },
      { t: 48, title: 'The mole', text: 'Nelson’s, Fremantle’s and Bowen’s boats reach the mole, storm it and spike its guns. Grapeshot from the citadel sweeps the stonework. Bowen and his first lieutenant are killed.' },
      { t: 52, title: 'Nelson is hit', text: 'As he steps from the boat, drawing his sword, a ball shatters his right arm above the elbow. His stepson Josiah Nisbet gets a tourniquet on it and the barge off the beach.' },
      { t: 56, title: 'The Fox goes down', text: 'The cutter Fox, coming in with 180 men, is hit below the waterline and sinks at once. Ninety-seven drown. Nelson’s barge stops to pull survivors out of the water.' },
      { t: 60, title: 'Troubridge lands in the surf', text: 'Most of the boats have missed the mole and are thrown on the rocks to the south, their powder soaked and ladders lost. Troubridge collects some 340 men and fights through the streets to the square.' },
      { t: 80, title: 'Santo Domingo', text: 'Daybreak finds him in the convent of Santo Domingo with no dry powder and several thousand Spaniards round him. He sends word that he will burn the town unless he is allowed to re-embark.' },
      { t: 96, title: 'Terms', text: 'Gutiérrez knows it is a bluff and agrees anyway. The British march to the mole with their arms and are taken off, partly in Spanish boats. Aboard Theseus, Nelson’s arm is already off.' }
    ]
  });
})();
