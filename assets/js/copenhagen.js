/* Copenhagen, 2 April 1801: scenario for the battle-plan engine.
   This sheet is drawn with north to the RIGHT (west is up), as several plans of
   the day were, so that the King's Deep runs across the page. The Danish line
   is moored along the Amager flats; Nelson's division comes up from the south
   (left) on a south-south-easterly wind. */
(function () {
  'use strict';

  var ships = [], DY = 268, BY = 313, LANE = 337, SPEED = 36;
  function dx(i) { return 210 + i * 36; }

  /* ---- Danish line, south to north: name, kind, guns, commander, events, extra track, fate ---- */
  var D = [
    ['Prøvesteenen', 'blockship', 58, 'Capt. L. F. Lassen', { dismast: 50, struck: 62 }, null, 'Southern anchor of the line. Fought four hours against Polyphemus, Isis and Désirée; taken and burnt.'],
    ['Wagrien', 'blockship', 52, 'Capt. F. C. Risbrich', { struck: 60 }, null, 'Abandoned after three hours; taken and burnt.'],
    ['Rendsborg', 'pram', 20, 'Lt-Cmdr C. T. Egede', { aground: 48, struck: 56 }, [[40, dx(2), DY, 90], [48, 300, 230, 60]], 'Cable shot away; drove on to the flats, still firing. Taken and burnt.'],
    ['Nyborg', 'pram', 20, 'Lt-Cmdr C. A. Rothe', { sink: 71 }, [[50, dx(3), DY, 90], [53, 336, 249], [69, 818, 226], [71, 836, 198, 20]], 'Got under way with one mast standing and sank at the harbour mouth.'],
    ['Jylland', 'blockship', 54, 'Capt. E. O. Branth', { struck: 64 }, null, 'Engaged Edgar from the first shot; taken and burnt.'],
    ['Sværdfisken', 'floating battery', 18, 'Sub-Lt S. S. Sommerfeldt', { struck: 60 }, null, 'Taken and burnt.'],
    ['Kronborg', 'frigate hulk', 22, 'Lt J. E. Hauch (killed)', { struck: 58 }, null, 'Taken and burnt.'],
    ['Hajen', 'floating battery', 18, 'Sub-Lt J. N. Müller', { struck: 62 }, null, 'Taken and burnt.'],
    ['Elven', 'sloop', 10, 'Lt-Cmdr H. Holsten', { cease: 48 }, [[48, dx(8), DY, 90], [51, 512, 249], [64, 822, 222], [70, 806, 128, 0]], 'Signal ship; withdrew damaged into the harbour.'],
    ['Dannebrog', 'blockship', 60, 'Capt. F. A. Braun', { burn: [38, 97], struck: 68, explode: 97 }, [[72, dx(9), DY, 90], [86, 668, 286, 110], [97, 706, 292, 110]], 'Fischer’s flagship. On fire within the first hour; drifted blazing down the line and blew up about 4.30 pm.'],
    ['Aggershus', 'pram', 20, 'Lt T. Fasting', { cease: 58, sink: 71 }, [[58, dx(10), DY, 90], [61, 582, 249], [70, 760, 236, 90]], 'Towed out of the line sinking; went down on the flats.'],
    ['Flådebatteri No. 1', 'floating battery', 20, 'Sub-Lt Peter Willemoes', { cease: 57 }, [[56, dx(11), DY, 90], [60, 620, 248], [74, 862, 210, 60]], 'A raft of 24-pounders commanded by a 17-year-old, moored opposite Elephant. Nelson asked to meet him afterwards. Cut loose and got clear.'],
    ['Sjælland', 'ship of the line', 74, 'Capt. F. C. L. Harboe', { dismast: 56, struck: 62 }, [[64, dx(12), DY, 90], [78, 808, 266, 80]], 'The strongest ship in the line. Drifted under Trekroner after striking; taken next day and burnt.'],
    ['Charlotte Amalie', 'old Indiaman', 26, 'Capt. H. H. Koefoed', { struck: 64 }, null, 'Taken and burnt.'],
    ['Søhesten', 'floating battery', 18, 'Lt B. U. Middelboe', { struck: 64 }, null, 'Taken and burnt.'],
    ['Holsteen', 'ship of the line', 60, 'Capt. J. Arenfelt', { struck: 66 }, null, 'The only prize kept. Sailed to England as a hospital ship and became HMS Holstein.'],
    ['Indfødsretten', 'blockship', 64, 'Capt. A. de Thurah (killed)', { struck: 68 }, null, 'Taken and burnt.'],
    ['Hjælperen', 'frigate', 22, 'Lt P. C. Lillienskiold', { cease: 54 }, [[54, dx(17), DY, 90], [57, 826, 250], [66, 834, 150, 0]], 'Northernmost of the line; slipped away into the harbour.']
  ];
  D.forEach(function (d, i) {
    ships.push({
      id: 'd' + i, name: d[0], side: 'danish', guns: d[2], captain: d[3], flag: i === 9 ? 'Commodore Olfert Fischer' : null,
      scale: d[2] >= 50 ? undefined : (d[1] === 'floating battery' ? .7 : .78), shape: d[1] === 'floating battery' ? 'battery' : undefined,
      fate: d[1].charAt(0).toUpperCase() + d[1].slice(1) + '. ' + d[6],
      track: [[0, dx(i), DY, 90]].concat(d[5] || []), ev: d[4], key: i === 9, label: [0, -15]
    });
  });
  ships.push({
    id: 'trekroner', name: 'Trekroner fort', side: 'danish', guns: 68, captain: 'Maj. Meyer', shape: 'battery', scale: 1.5, range: 128, key: true, label: [26, 5, 'start'],
    fate: 'The Three Crowns battery, built on piles at the harbour mouth. It was never silenced; its guns killed Captain Riou.',
    track: [[0, 876, 238, 90]], ev: {}
  });
  [['Elephanten', 70, 846, 178], ['Mars', 64, 864, 150]].forEach(function (b, i) {
    ships.push({ id: 'bille' + i, name: b[0], side: 'danish', guns: b[1], captain: 'Steen Bille’s harbour squadron', noFire: true, noTarget: true, label: [18, 5, 'start'],
      fate: 'Blockship guarding the harbour entrance; not engaged.', track: [[0, b[2], b[3], 150]], ev: {} });
  });

  /* ---- Nelson's division ----
     Each ship lies at anchor off the tail of the Middle Ground, weighs at her
     turn, rounds the shoal and runs up the King's Deep outside the ships
     already placed. */
  var slot = 0;
  function brit(name, guns, captain, flag, weigh, station, fate, more) {
    more = more || {};
    var c = slot % 4, r = Math.floor(slot / 4); slot++;
    var p = [36 + c * 30 - r * 4, 512 + r * 35 + c * 5], tr, t = weigh, pts, i, q = p, d;
    tr = [[0, p[0], p[1], 250], [weigh, p[0], p[1], 250]];
    pts = more.path || [[118, 452], [142, 388], [198, LANE], [station - 26, more.first ? BY + 4 : LANE], [station, more.y || BY]];
    for (i = 0; i < pts.length; i++) {
      d = Math.hypot(pts[i][0] - q[0], pts[i][1] - q[1]);
      t += d / SPEED; q = pts[i];
      tr.push([t, q[0], q[1], i === pts.length - 1 ? (more.h !== undefined ? more.h : 90) : null]);
    }
    if (more.aground) { more.ev = more.ev || {}; more.ev.aground = t; }
    (more.after || []).forEach(function (k) { tr.push(k); });
    ships.push({
      id: 'b' + slot, name: name, side: 'british', guns: guns, captain: captain, flag: flag, fate: fate, track: tr,
      ev: more.ev || {}, key: !!more.key, label: more.label || [0, 25], range: more.range, noFire: more.noFire
    });
  }
  brit('Edgar', 74, 'Capt. George Murray', null, 0, 354, 'Led the division in and anchored opposite Jylland. 31 killed, 111 wounded.', { first: true });
  brit('Ardent', 64, 'Capt. Thomas Bertie', null, 1.5, 410, 'Fought the floating batteries and Kronborg; 30 killed.');
  brit('Glatton', 54, 'Capt. William Bligh', null, 3, 492, 'Bligh of the Bounty, armed entirely with carronades, lay next astern of Nelson against Dannebrog.');
  brit('Isis', 50, 'Capt. James Walker', null, 4.5, 250, 'The weakest ship of the line, matched against Prøvesteenen. 33 killed, 88 wounded.');
  brit('Agamemnon', 64, 'Capt. Robert Fancourt', null, 5.5, 0, 'Nelson’s old ship could not weather the shoal and stuck on its tail, never firing a shot.',
    { path: [[120, 478], [160, 462]], h: 60, aground: true, noFire: true, key: true, label: [34, 20, 'start'] });
  brit('Polyphemus', 64, 'Capt. John Lawford', null, 7, 206, 'Sent to the southern end in Agamemnon’s place; engaged Prøvesteenen and Wagrien.');
  brit('Bellona', 74, 'Capt. Sir Thomas Thompson', null, 8.5, 0, 'Kept too far to starboard and grounded on the Middle Ground; fired at long range. Thompson lost a leg.',
    { path: [[118, 452], [142, 392], [204, 352], [322, 386]], aground: true, range: 132, key: true, label: [0, 26] });
  brit('Russell', 74, 'Capt. William Cuming', null, 9.5, 0, 'Followed Bellona in the smoke and grounded astern of her.',
    { path: [[118, 452], [142, 392], [200, 356], [286, 390]], aground: true, range: 132, label: [0, 26] });
  brit('Elephant', 74, 'Capt. Thomas Foley', 'Vice-Adm. Lord Nelson', 11, 556, 'Nelson’s flagship for the day, chosen for her shallow draught. Anchored against Dannebrog and the floating battery.', { key: true });
  brit('Ganges', 74, 'Capt. Thomas Fremantle', null, 12, 640, 'Her master was killed and pilot wounded going in; Fremantle conned her to her berth opposite Sjælland himself.');
  brit('Monarch', 74, 'Capt. James Mosse (killed)', null, 13, 700, 'Under fire from Holsteen, Sjælland and Trekroner at once. 56 killed, 164 wounded: the heaviest loss in the fleet.');
  brit('Defiance', 74, 'Capt. Richard Retalick', 'Rear-Adm. Thomas Graves', 14, 760, 'Head of the line, nearest Trekroner. Graves repeated Parker’s recall but kept the signal for close action flying.');
  brit('Désirée', 36, 'Capt. Henry Inman', null, 6, 172, 'Anchored across Prøvesteenen’s bows and raked her.', { path: [[118, 452], [140, 388], [172, 302]], h: 40, label: [-16, 6, 'end'] });
  var riouOut = [[1010, 398], [1016, 418], [1026, 438], [1040, 456], [1056, 470]];
  [['Amazon', 38, 'Capt. Edward Riou (killed)', 812, 318, 'Riou led the frigates against Trekroner in place of the grounded ships. Obeying the recall, he was cut in two as Amazon turned away.'],
    ['Blanche', 36, 'Capt. Graham Hamond', 838, 327, 'Frigate squadron under Riou.'],
    ['Alcmène', 32, 'Capt. Samuel Sutton', 862, 336, 'Frigate squadron under Riou.'],
    ['Arrow', 28, 'Cmdr William Bolton', 886, 344, 'Sloop; frigate squadron under Riou.'],
    ['Dart', 28, 'Cmdr John Devonshire', 908, 351, 'Sloop; frigate squadron under Riou.']
  ].forEach(function (f, i) {
    brit(f[0], f[1], f[2], null, 15 + i * .8, f[3], f[5], { y: f[4], range: 118, label: [0, 22],
      after: [[55 + i * .6, f[3], f[4], 90], [70 + i, riouOut[i][0], riouOut[i][1]]], ev: { cease: 56 + i * .6 } });
  });

  /* Parker's division, four miles to the north, beating up against wind and current */
  [['London', 98, 'Capt. William Domett', 'Adm. Sir Hyde Parker', 1076, 566, 1040, 540, 'Parker’s flagship. At about 1.15 pm she hoisted signal No. 39: discontinue the action.'],
    ['Defence', 74, 'Capt. Lord Henry Paulet', null, 1072, 500, 984, 452, 'Sent ahead by Parker to support Nelson; arrived as the firing died.'],
    ['Ramillies', 74, 'Capt. James Dixon', null, 1084, 524, 1006, 478, 'Sent ahead by Parker to support Nelson.'],
    ['Veteran', 64, 'Capt. Archibald Dickson', null, 1090, 548, 1028, 506, 'Sent ahead by Parker to support Nelson.']
  ].forEach(function (p, i) {
    ships.push({ id: 'pk' + i, name: p[0], side: 'british', guns: p[1], captain: p[2], flag: p[3], noFire: true, noTarget: true, key: i === 0, label: [-14, 22, 'end'],
      fate: p[8], track: [[0, p[4], p[5], 250], [20, p[4], p[5], 250], [100, p[6], p[7]]], ev: {} });
  });

  window.NelsonBattle.mount('plan', {
    title: 'The Battle of Copenhagen',
    size: [1100, 700], duration: 90, shipScale: 1,
    rose: [990, 626], north: 90,
    wind: { x: 860, y: 606, toward: 67, label: 'Wind SSE' },
    scale: { px: 175, label: '½ nautical mile', x: 300, y: 676 },
    clock: [[0, 570], [10, 615], [36, 690], [52, 795], [58, 810], [66, 840], [74, 870], [84, 915], [100, 990]],
    days: ['2 April 1801'],
    sides: { british: 'British', danish: 'Danish' },
    autoFire: { range: 60, quiet: [[76, 101]] },
    land: [
      'M-10,-10 L-10,176 L80,170 L220,160 L380,150 L520,140 L640,128 L720,112 L770,90 L790,40 L792,-10 Z',
      'M830,-10 L832,46 L846,96 L880,120 L940,128 L1020,120 L1110,112 L1110,-10 Z'
    ],
    towns: ['M846,12 h58 v36 h-58 Z', 'M914,16 h48 v40 h-48 Z', 'M972,22 h64 v30 h-64 Z', 'M716,24 h52 v26 h-52 Z', 'M856,58 h40 v22 h-40 Z'],
    shoals: [
      'M-10,176 L80,170 L220,160 L380,150 L520,140 L640,128 L720,112 L770,90 L800,150 L842,224 L700,238 L500,242 L300,244 L150,247 L-10,250 Z',
      'M150,470 Q180,402 360,394 L760,390 Q940,394 990,450 Q960,540 760,560 L360,566 Q180,560 150,470 Z'
    ],
    forts: [{ x: 934, y: 96, r: 12 }, { x: 778, y: 104, r: 6 }, { x: 876, y: 238, r: 15 }],
    labels: [
      { x: 300, y: 84, text: 'AMAGER', cls: 'caps' },
      { x: 968, y: 82, text: 'COPENHAGEN', cls: 'caps' },
      { x: 500, y: 204, text: 'Amager flats', cls: 'small' },
      { x: 470, y: 486, text: 'MIDDLE  GROUND', cls: 'caps' },
      { x: 600, y: 370, text: 'King’s Deep', cls: 'small' },
      { x: 520, y: 628, text: 'OUTER  DEEP', cls: 'sea' },
      { x: 18, y: 690, text: 'Nelson’s anchorage, night of 1 April', cls: 'small' },
      { x: 806, y: 22, text: 'harbour', cls: 'small', rot: 90 }
    ],
    ships: ships,
    phases: [
      { t: 0, title: 'The wind comes fair', text: 'Nelson has spent the night anchored off the tail of the Middle Ground, two miles from the Danish line. At 9.30 am, with the wind in the south-south-east, he makes the signal to weigh in succession.' },
      { t: 7, title: 'Edgar leads in', text: 'Edgar rounds the shoal alone and runs the length of the southern batteries under fire before anchoring by the stern opposite Jylland. The pilots have refused to lead; a ship’s master volunteers.' },
      { t: 11, title: 'Three ships aground', text: 'Agamemnon cannot weather the shoal. Bellona and Russell hug its western edge too closely and stick. A quarter of Nelson’s line is out of the fight before it begins.' },
      { t: 22, title: 'The line is formed', text: 'Each ship passes outside those already anchored and takes the next berth. Nelson re-orders the line on the move. Riou takes his frigates against Trekroner, in place of the missing 74s.' },
      { t: 36, title: 'A cannonade at a cable’s length', text: 'By 11.30 every ship is engaged, at about 200 yards. There is no manoeuvre left: the hulks cannot run and the British cannot leave. Dannebrog is already burning.' },
      { t: 52, title: 'Signal No. 39', text: 'Four miles north, Parker can see three ships aground and no slackening of Danish fire. At about 1.15 pm he signals: discontinue the action. Nelson puts the glass to his blind eye. “I really do not see the signal.”' },
      { t: 56, title: 'Riou obeys', text: 'The frigates, in plain sight of the flagship, haul off. As Amazon turns her stern to Trekroner a shot kills Riou. No ship of the line moves.' },
      { t: 62, title: 'The Danish fire slackens', text: 'One by one the southern hulks fall silent. Some strike and are then re-manned from the shore and fire again, so that the prizes cannot be taken without more killing.' },
      { t: 74, title: 'A letter under flag of truce', text: 'Nelson writes “To the Brothers of Englishmen, the Danes”: stop firing, or he must burn the floating batteries he has taken with the men in them. He insists on sealing it properly with wax.' },
      { t: 84, title: 'Cease-fire', text: 'The Crown Prince agrees to a truce. Firing stops about 3 pm. The British can now extricate their battered ships from under Trekroner’s guns.' },
      { t: 96, title: 'Dannebrog blows up', text: 'The burning flagship, adrift since she struck, explodes about 4.30 pm. Of eighteen moored vessels, twelve are prizes; all but Holsteen will be burnt.' }
    ]
  });
})();
