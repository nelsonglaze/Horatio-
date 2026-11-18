/* Agamemnon and the Ça Ira, 13 March 1795: scenario for the battle-plan engine.
   North is up; the French fleet is standing away westward. A 64 hangs on the
   stern of a crippled 80, yawing to fire her broadside and closing up again. */
(function () {
  'use strict';
  var ships = [], V = 1.6;
  function cx(t) { return 560 - V * t; }           /* where the Ça Ira is */

  ships.push({ id: 'caira', name: 'Ça Ira', side: 'french', guns: 80, captain: 'Capt. Louis-Marie Coudé', key: true, label: [0, 30],
    fate: 'Lost her fore and main topmasts in a collision. 110 killed and wounded on the 13th; taken next day with 400 more casualties.',
    track: [[0, cx(0), 250, 270], [100, cx(100), 250, 270]], ev: { dismast: 0 } });
  ships.push({ id: 'vestale', name: 'Vestale', side: 'french', guns: 36, captain: 'Frigate', label: [0, 26],
    fate: 'Took the crippled ship in tow.', noFire: true,
    track: [[0, 548, 212, 270], [16, 520, 216], [24, cx(24) - 46, 250, 270], [100, cx(100) - 46, 250, 270]], ev: {} });
  ships.push({ id: 'sansculotte', name: 'Sans-Culotte', side: 'french', guns: 120, flag: 'Rear-Adm. Pierre Martin', key: true, label: [0, -20],
    fate: 'Flagship of the Toulon fleet. Bore down to cover Ça Ira, which ended the day’s action.',
    track: [[0, 430, 208, 270], [72, 262, 208], [80, 250, 190], [88, 300, 196], [100, 352, 206, 100]], ev: {} });
  ships.push({ id: 'jeanbart', name: 'Jean-Bart', side: 'french', guns: 74, label: [0, 26],
    fate: 'Bore down with the flagship to cover Ça Ira.',
    track: [[0, 400, 292, 270], [72, 236, 292], [80, 228, 308], [90, 290, 300], [100, 336, 290, 80]], ev: {} });
  [['Tonnant', 80, 330, 246], ['Duquesne', 74, 300, 196], ['Censeur', 74, 356, 276]].forEach(function (f, i) {
    ships.push({ id: 'fr' + i, name: f[0], side: 'french', guns: f[1], noFire: true, label: [0, 26],
      fate: i === 2 ? 'Took Ça Ira in tow that night and was captured with her on the 14th.' : 'Stood on with the French fleet.',
      track: [[0, f[2], f[3], 270], [100, f[2] - (i === 2 ? 190 : 420), f[3]]], ev: {} });
  });

  ships.push({ id: 'inconstant', name: 'Inconstant', side: 'british', guns: 36, captain: 'Capt. Thomas Fremantle', label: [0, -18],
    fate: 'First to attack. Fired into the big ship’s quarter twice before her lower-deck guns drove the frigate off.',
    track: [[0, 760, 232], [14, 612, 222, 270], [19, 580, 214, 270], [23, 600, 196], [40, 700, 172], [100, 640, 160, 270]], ev: { cease: 24 } });

  /* Agamemnon: close up, yaw to starboard so the port broadside bears, fire, fall back into her wake */
  var tr = [[0, 900, 268], [38, cx(38) + 62, 255, 270]], k, t0;
  for (k = 0; k < 5; k++) {
    t0 = 38 + k * 10;
    tr.push([t0, cx(t0) + 62, 255, 270]);
    tr.push([t0 + 3, cx(t0) + 52, 243, 352]);
    tr.push([t0 + 5.5, cx(t0) + 49, 235, 352]);
    tr.push([t0 + 8, cx(t0) + 50, 250, 262]);
  }
  tr.push([88, cx(88) + 62, 255, 270]);
  tr.push([93, 500, 282, 120]);
  tr.push([100, 590, 306, 100]);
  ships.push({ id: 'agamemnon', name: 'Agamemnon', side: 'british', guns: 64, captain: 'Capt. Horatio Nelson', key: true, label: [26, 26, 'start'],
    fate: 'The fastest ship in the fleet, and alone. Seven wounded. Nelson was not yet a flag officer, so she flew no flag of his.', track: tr, ev: { cease: 90 } });
  [['Captain', 74, 'Capt. Samuel Reeve', 1040, 300, 790, 292], ['Bedford', 74, 'Capt. Davidge Gould', 1090, 236, 860, 240], ['Britannia', 100, 'Capt. John Holloway', 1150, 278, 940, 274]].forEach(function (b, i) {
    ships.push({ id: 'br' + i, name: b[0], side: 'british', guns: b[1], captain: b[2], flag: i === 2 ? 'Vice-Adm. William Hotham' : null, noFire: true, key: i === 2, label: [0, 30],
      fate: i === 2 ? 'Hotham’s flagship, miles astern. Made the signal of recall at 1.15 pm.' : 'Coming up in chase; not engaged on the 13th.',
      track: [[0, b[3], b[4]], [100, b[5], b[6]]], ev: {} });
  });

  window.NelsonBattle.mount('plan-ca-ira', {
    key: 'caira',
    title: 'Agamemnon and the Ça Ira',
    size: [1000, 440], duration: 60, shipScale: 1.5,
    rose: [84, 358], north: 0,
    wind: { x: 206, y: 346, toward: 45, label: 'Wind SW, fresh' },
    clock: [[0, 540], [14, 560], [38, 645], [88, 795], [100, 810]],
    days: ['13 March 1795'],
    sides: { british: 'British', french: 'French' },
    autoFire: { range: 96 },
    labels: [
      { x: 500, y: 60, text: 'GULF  OF  GENOA', cls: 'sea' },
      { x: 18, y: 128, text: '← the French fleet, for Toulon', cls: 'small' },
      { x: 982, y: 372, text: 'Hotham’s fleet in chase →', cls: 'small', anchor: 'end' }
    ],
    ships: ships,
    phases: [
      { t: 0, title: 'A collision in the French line', text: 'At daylight the 80-gun Ça Ira runs aboard her next ahead and loses her fore and main topmasts. She drops astern as the French fleet stands away to the west.' },
      { t: 12, title: 'Inconstant strikes first', text: 'Captain Fremantle takes a 36-gun frigate under the big ship’s quarter, fires, tacks and fires again, until her lower-deck guns drive him off. The frigate Vestale passes Ça Ira a tow.' },
      { t: 36, title: 'Agamemnon comes up', text: 'Nelson’s 64 has outsailed the rest of the fleet. He means not to fire until he touches her stern, but her stern-chasers are cutting up his rigging, so he opens at a hundred yards.' },
      { t: 44, title: 'Yaw, fire, follow', text: 'Agamemnon puts her helm over until her whole broadside bears on the Frenchman’s stern, fires, then swings back into her wake and closes up again. Ça Ira cannot bring a single broadside gun to bear.' },
      { t: 68, title: 'Over two hours', text: 'The drill goes on without a break. Ça Ira, by Nelson’s account “a perfect wreck”, has 110 men killed and wounded. Agamemnon has seven wounded.' },
      { t: 86, title: 'Recalled', text: 'At 1.15 pm the 120-gun Sans-Culotte and the Jean-Bart bear down to cover their consort, and Hotham signals Agamemnon to rejoin. Next morning Ça Ira and Censeur, towing her, are cut off and taken.' }
    ]
  });
})();
