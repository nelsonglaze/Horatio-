/* Trafalgar, 21 October 1805: scenario for the battle-plan engine.
   North is up. The Combined Fleet creeps north towards Cadiz in a five-mile
   crescent; the British come down from the west in two columns. */
(function () {
  'use strict';

  var V = 1.3;          /* northward creep of the Combined Fleet (map units per time unit) */
  var DRIFT = 0.26;     /* leeward drift of ships locked in the melee */
  var Y0 = 100, GAP = 22;

  function rnd(n) { var x = Math.sin(n * 91.7 + 13.3) * 43758.5453; return x - Math.floor(x); }

  /* name, side, guns, captain, flag officer, time engaged, fate kind, fate time, fate text */
  var A = [
    ['Neptuno', 'spanish', 80, 'Capt. Cayetano Valdés', null, 50, 'neptuno', 90, 'Came down to help the centre; struck to Minotaur and Spartiate about 5.10 pm. Retaken in the storm, then wrecked.'],
    ['Scipion', 'french', 74, 'Capt. Charles Bérenger', null, 50, 'dumanoir', 0, 'Escaped with Dumanoir; taken off Cape Ortegal, 4 November.'],
    ['Intrépide', 'french', 74, 'Capt. Louis Infernet', null, 50, 'intrepide', 88, 'Turned back into the fight alone; struck to Orion about 5 pm.'],
    ['Formidable', 'french', 80, 'Capt. Jean-Marie Letellier', 'Rear-Adm. Dumanoir', 50, 'dumanoir', 0, 'Escaped; taken off Cape Ortegal, 4 November.'],
    ['Duguay-Trouin', 'french', 74, 'Capt. Claude Touffet', null, 50, 'dumanoir', 0, 'Escaped; taken off Cape Ortegal, 4 November. Served the Royal Navy as HMS Implacable until 1949.'],
    ['Mont-Blanc', 'french', 74, 'Capt. Guillaume Lavillegris', null, 50, 'dumanoir', 0, 'Escaped; taken off Cape Ortegal, 4 November.'],
    ['Rayo', 'spanish', 100, 'Commodore Enrique Macdonell', null, 50, 'cadiz', 58, 'Reached Cádiz; wrecked after sortieing in the storm.'],
    ['San Francisco de Asís', 'spanish', 74, 'Capt. Luis de Flores', null, 50, 'cadiz', 60, 'Reached Cádiz; wrecked in the storm.'],
    ['San Agustín', 'spanish', 74, 'Capt. Felipe Cagigal', null, 38, 'struck', 58, 'Boarded and taken by Leviathan; burnt after the storm.'],
    ['Héros', 'french', 74, 'Capt. Jean Poulain (killed)', null, 32, 'cadiz', 52, 'Reached Cádiz.'],
    ['Santísima Trinidad', 'spanish', 136, 'Capt. Francisco de Uriarte', 'Rear-Adm. Cisneros', 28, 'struck', 59, 'The largest warship afloat. Dismasted and taken; scuttled in the storm.'],
    ['Bucentaure', 'french', 80, 'Capt. Jean-Jacques Magendie', 'Vice-Adm. Villeneuve', 28, 'struck', 46, 'Raked by Victory; Villeneuve surrendered to Conqueror. Wrecked in the storm.'],
    ['Neptune', 'french', 80, 'Capt. Esprit-Tranquille Maistral', null, 28, 'cadiz', 40, 'Reached Cádiz.'],
    ['Redoutable', 'french', 74, 'Capt. Jean Lucas', null, 28, 'struck', 45, 'The shot that killed Nelson came from her mizzen-top. Struck with 487 of her 643 men killed; sank next day.'],
    ['San Leandro', 'spanish', 64, 'Capt. José Quevedo', null, 22, 'cadiz', 44, 'Reached Cádiz.'],
    ['San Justo', 'spanish', 74, 'Capt. Miguel Gastón', null, 22, 'cadiz', 46, 'Reached Cádiz.'],
    ['Indomptable', 'french', 80, 'Capt. Jean Hubert', null, 22, 'cadiz', 48, 'Reached Cádiz; wrecked in the storm with heavy loss of life.'],
    ['Santa Ana', 'spanish', 112, 'Capt. José Gardoqui', 'Vice-Adm. Álava', 17, 'struck', 50, 'Struck to Royal Sovereign about 2.15 pm; retaken by the Cádiz sortie two days later.'],
    ['Fougueux', 'french', 74, 'Capt. Louis Baudoin (killed)', null, 17, 'fougueux', 46, 'Fired the first shots of the battle. Boarded from Téméraire; wrecked in the storm.'],
    ['Monarca', 'spanish', 74, 'Capt. Teodoro Argumosa', null, 20, 'struck', 53, 'Struck to Bellerophon; wrecked in the storm.'],
    ['Pluton', 'french', 74, 'Commodore Julien Cosmao-Kerjulien', null, 20, 'cadiz', 66, 'Reached Cádiz, and led the sortie that retook two prizes.'],
    ['Algésiras', 'french', 74, 'Capt. Laurent Le Tourneur', 'Rear-Adm. Magon (killed)', 22, 'struck', 52, 'Taken by Tonnant; her crew retook her in the storm and reached Cádiz.'],
    ['Bahama', 'spanish', 74, 'Commodore Dionisio Alcalá Galiano (killed)', null, 24, 'struck', 55, 'Struck to Colossus; one of four prizes to reach Gibraltar.'],
    ['Aigle', 'french', 74, 'Capt. Pierre Gourrège (killed)', null, 24, 'struck', 58, 'Struck to Defiance; wrecked in the storm.'],
    ['Swiftsure', 'french', 74, 'Capt. Charles-Eusèbe L’Hospitalier-Villemadrin', null, 26, 'struck', 56, 'A former British ship. Struck to Colossus; reached Gibraltar.'],
    ['Argonaute', 'french', 74, 'Capt. Jacques Epron', null, 27, 'cadiz', 62, 'Reached Cádiz.'],
    ['Montañés', 'spanish', 74, 'Capt. Francisco Alcedo (killed)', null, 27, 'cadiz', 60, 'Reached Cádiz.'],
    ['Argonauta', 'spanish', 80, 'Capt. Antonio Pareja', null, 28, 'struck', 60, 'Struck to Belleisle; scuttled after the storm.'],
    ['Berwick', 'french', 74, 'Capt. Jean Filhol-Camas (killed)', null, 30, 'struck', 61, 'A former British ship. Struck to Achille; wrecked in the storm.'],
    ['San Juan Nepomuceno', 'spanish', 74, 'Commodore Cosme de Churruca (killed)', null, 32, 'struck', 58, 'Fought six ships; struck to Dreadnought. Reached Gibraltar.'],
    ['San Ildefonso', 'spanish', 74, 'Commodore José de Vargas', null, 34, 'struck', 64, 'Struck to Defence; reached Gibraltar.'],
    ['Achille', 'french', 74, 'Capt. Louis Deniéport (killed)', null, 34, 'achille', 94, 'Caught fire in the fore-top and blew up about 5.45 pm.'],
    ['Príncipe de Asturias', 'spanish', 112, 'Capt. Rafael de Hore', 'Adm. Gravina', 34, 'cadiz', 72, 'Gravina, mortally wounded, led the retreat to Cádiz.']
  ];
  var lee = { 6: 15, 12: 17, 14: 14, 16: 15, 22: 12, 25: 14, 27: 10 };   /* ships sagged to leeward of the line */

  function ax(i) { return 772 + 50 * Math.sin(Math.PI * i / 32) + (lee[i] || 0); }
  function ay(i) { return Y0 + i * GAP; }
  function apos(i, t) {
    var e = A[i][5];
    return [ax(i) + Math.max(0, t - e) * DRIFT, ay(i) - V * Math.min(t, e)];
  }
  function gap(a, t) {              /* the water astern of allied ship a */
    var p = apos(a, t), q = apos(a + 1, t);
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  }
  function rel(i, t, dx, dy) { var p = apos(i, t); return [p[0] + dx, p[1] + dy]; }

  var ships = [];

  /* ---- Combined Fleet ---- */
  A.forEach(function (a, i) {
    var e = a[5], kind = a[6], ft = a[7], tr, ev = {}, p, q;
    var wob = (rnd(i) - .5) * 56;
    tr = [[0].concat(apos(i, 0)), [e].concat(apos(i, e))];
    if (kind === 'struck') {
      tr.push([Math.min(e + 9, ft)].concat(apos(i, Math.min(e + 9, ft)), [wob]));
      tr.push([100].concat(apos(i, 100), [wob]));
      ev.struck = ft; ev.dismast = ft - 6;
    } else if (kind === 'cadiz') {
      p = apos(i, ft);
      tr.push([ft, p[0], p[1]]);
      tr.push([ft + 7, p[0] + 62, p[1] - 14]);
      q = [1150, Math.max(40, p[1] - 330 - (i % 3) * 40)];
      tr.push([ft + 46, q[0], q[1]]);
      ev.cease = ft + 12;
    } else if (kind === 'dumanoir') {
      /* the four wear in succession and run down to windward of the fight in line ahead */
      var lag = (5 - i) * 2.7, t0 = 52 + (5 - i) * 1.2;
      p = apos(i, t0);
      tr = [[0].concat(apos(i, 0)), [t0, p[0], p[1]], [t0 + 6, p[0] - 44, p[1] - 14], [t0 + 12, p[0] - 84, p[1] + 34],
        [74 + lag, 684, 318], [86 + lag, 648, 470], [102 + lag, 580, 668]];
    } else if (kind === 'neptuno') {
      p = apos(i, 54);
      tr = [[0].concat(apos(i, 0)), [54, p[0], p[1]], [61, p[0] - 30, p[1] - 6], [68, p[0] - 34, p[1] + 34], [84, 770, 206, 150], [100, 778, 214, 150]];
      ev.struck = ft; ev.dismast = ft - 4;
    } else if (kind === 'intrepide') {
      p = apos(i, 53);
      tr = [[0].concat(apos(i, 0)), [53, p[0], p[1]], [59, p[0] + 26, p[1] + 12], [72].concat(rel(9, 72, 16, -54)), [100].concat(rel(9, 100, 20, -50), [200])];
      ev.struck = ft; ev.dismast = ft - 3;
    } else if (kind === 'fougueux') {
      tr = [[0].concat(apos(i, 0)), [e].concat(apos(i, e)), [26].concat(apos(i, 26)), [41].concat(rel(13, 41, 14.5, 6), [14]), [100].concat(rel(13, 100, 14.5, 6), [14])];
      ev.struck = ft; ev.dismast = ft - 4;
    } else if (kind === 'achille') {
      tr.push([100].concat(apos(i, 100), [wob]));
      ev.burn = [66, ft]; ev.explode = ft; ev.dismast = 60; ev.cease = 78;
    }
    ships.push({
      id: 'a' + i, name: a[0], side: a[1], guns: a[2], captain: a[3], flag: a[4], fate: a[8], track: tr, ev: ev,
      key: [3, 10, 11, 17, 32].indexOf(i) >= 0, label: [15, 4, 'start']
    });
  });

  /* ---- British ----
     col: bearing of the approach; T: time she reaches the allied line; a: she
     passes astern of allied ship a; st: stations taken afterwards, each
     [arrive, leave, allied ship, dx, dy, heading]. */
  function brit(name, guns, captain, flag, col, T, a, st, fate, extra) {
    var sp = col === 'w' ? 13 : 12.5, bear = (col === 'w' ? 76 : 86) * Math.PI / 180;
    var P = gap(a, T), tr, ev = {}, i, s, p;
    tr = [[0, P[0] - Math.sin(bear) * sp * T, P[1] + Math.cos(bear) * sp * T], [T, P[0], P[1]]];
    for (i = 0; i < st.length; i++) {
      s = st[i];
      p = rel(s[2], s[0], s[3], s[4]); tr.push([s[0], p[0], p[1], s[5]]);
      p = rel(s[2], s[1], s[3], s[4]); tr.push([s[1], p[0], p[1], s[5]]);
    }
    if (extra && extra.dismast) ev.dismast = extra.dismast;
    ships.push({
      id: 'b' + ships.length, name: name, side: 'british', guns: guns, captain: captain, flag: flag, fate: fate, track: tr, ev: ev,
      key: !!(extra && extra.key), label: [-13, -7, 'end']
    });
  }

  /* weather column (Nelson) */
  brit('Victory', 100, 'Capt. Thomas Masterman Hardy', 'Vice-Adm. Lord Nelson', 'w', 28, 11, [[33, 100, 13, -8, 1, 12]],
    'Raked Bucentaure, then locked with Redoutable. 57 killed, 102 wounded; Nelson shot about 1.15 pm.', { key: true });
  brit('Téméraire', 98, 'Capt. Eliab Harvey', null, 'w', 31, 13, [[36, 100, 13, 7.5, 3, 12]],
    'Fought Redoutable on one side and Fougueux on the other, and took both.');
  brit('Neptune', 98, 'Capt. Thomas Fremantle', null, 'w', 33, 11, [[39, 100, 10, 17, 17, -20]],
    'Raked Bucentaure, then dismasted Santísima Trinidad.');
  brit('Leviathan', 74, 'Capt. Henry Bayntun', null, 'w', 35, 11, [[40, 46, 10, 30, 2, -10], [52, 100, 8, 12.5, 4, 5]],
    'Raked Bucentaure, then boarded and took San Agustín.');
  brit('Conqueror', 74, 'Capt. Israel Pellew', null, 'w', 37, 11, [[42, 100, 11, 13, 9, -30]],
    'Brought down Bucentaure’s masts; her marines received Villeneuve’s surrender.');
  brit('Britannia', 100, 'Capt. Charles Bullen', 'Rear-Adm. Lord Northesk', 'w', 41, 10, [[46, 100, 10, -22, 4, 20]],
    'Third flagship of the fleet; engaged in the centre.');
  brit('Agamemnon', 64, 'Capt. Sir Edward Berry', null, 'w', 44, 9, [[49, 100, 9, -20, 2, 10]],
    'Nelson’s old favourite; engaged Santísima Trinidad and Héros.');
  brit('Ajax', 74, 'Lieut. John Pilfold (acting)', null, 'w', 46, 9, [[51, 66, 9, 22, -12, 0], [74, 100, 9, 34, -40, 20]],
    'Helped Orion bring Intrépide to surrender.');
  brit('Orion', 74, 'Capt. Edward Codrington', null, 'w', 48, 9, [[54, 68, 9, 2, -30, 0], [76, 100, 9, 0, -52, 20]],
    'Held her fire until close; took Intrépide.');
  brit('Minotaur', 74, 'Capt. Charles Mansfield', null, 'w', 53, 8, [[60, 70, 6, -52, 40, 150], [84, 100, 6, -32, 16, 150]],
    'Hauled across Dumanoir’s path, then took Neptuno.');
  brit('Spartiate', 74, 'Capt. Sir Francis Laforey', null, 'w', 55, 8, [[62, 72, 6, -62, 62, 150], [86, 100, 6, -5, 22, 150]],
    'A Nile prize. With Minotaur, cut off and took Neptuno.');

  /* lee column (Collingwood) */
  brit('Royal Sovereign', 100, 'Capt. Edward Rotheram', 'Vice-Adm. Cuthbert Collingwood', 'l', 17, 17, [[22, 100, 17, 9.5, 2, 4]],
    'First through the line; fought Santa Ana alone for a quarter of an hour. 47 killed, 94 wounded.', { key: true });
  brit('Belleisle', 74, 'Capt. William Hargood', null, 'l', 20, 17, [[26, 100, 19, 30, -8, 60]],
    'Totally dismasted by four opponents, she kept her colours flying on a pike.', { dismast: 44 });
  brit('Mars', 74, 'Capt. George Duff (killed)', null, 'l', 22, 19, [[27, 100, 20, -19, 4, 20]],
    'Battered by Pluton and Fougueux; Duff was beheaded by a round shot.');
  brit('Tonnant', 80, 'Capt. Charles Tyler', null, 'l', 24, 20, [[29, 100, 21, 9, -2, 8]],
    'A Nile prize. Took Algésiras by boarding action.');
  brit('Bellerophon', 74, 'Capt. John Cooke (killed)', null, 'l', 26, 22, [[31, 100, 23, 8, -1, 10]],
    'Ran aboard Aigle; Cooke was shot down on the quarterdeck. Took Monarca.');
  brit('Colossus', 74, 'Capt. James Morris', null, 'l', 28, 23, [[33, 100, 24, 9, 4, 0]],
    'Took Swiftsure and Bahama; 40 killed, 160 wounded, the heaviest British loss.');
  brit('Achille', 74, 'Capt. Richard King', null, 'l', 30, 26, [[35, 100, 28, 9, -4, -6]],
    'Fought Montañés and Argonauta; took Berwick.');
  brit('Revenge', 74, 'Capt. Robert Moorsom', null, 'l', 32, 29, [[37, 100, 30, 26, 2, 30]],
    'Broke through near the rear and was set upon by Príncipe de Asturias.');
  brit('Defiance', 74, 'Capt. Philip Durham', null, 'l', 35, 22, [[40, 100, 23, -8, 6, 0]],
    'Took Aigle after her boarders were first driven back.');
  brit('Dreadnought', 98, 'Capt. John Conn', null, 'l', 37, 28, [[42, 100, 29, 9, 2, 0]],
    'Took San Juan Nepomuceno in a quarter of an hour.');
  brit('Swiftsure', 74, 'Capt. William Rutherfurd', null, 'l', 39, 30, [[44, 100, 31, -22, -6, 30]],
    'Engaged the French Achille.');
  brit('Polyphemus', 64, 'Capt. Robert Redmill', null, 'l', 40, 27, [[45, 100, 28, -19, 6, 0]],
    'Engaged in the rear.');
  brit('Thunderer', 74, 'Lieut. John Stockham (acting)', null, 'l', 42, 31, [[47, 70, 32, -20, 0, 20], [78, 100, 31, 26, 30, 40]],
    'Engaged Príncipe de Asturias.');
  brit('Defence', 74, 'Capt. George Hope', null, 'l', 44, 29, [[49, 100, 30, -9, 3, 0]],
    'Took San Ildefonso.');
  brit('Prince', 98, 'Capt. Richard Grindall', null, 'l', 50, 31, [[57, 100, 31, -24, 20, 40]],
    'A slow sailer and last into action; her broadsides set the French Achille ablaze.');

  /* Africa lost touch in the night and came down the allied van alone */
  ships.push({
    id: 'africa', name: 'Africa', side: 'british', guns: 64, captain: 'Capt. Henry Digby', label: [-13, -7, 'end'],
    fate: 'Ran the gauntlet of the whole allied van, then engaged Santísima Trinidad and Intrépide.',
    track: [[0, 742, 16], [30].concat(rel(10, 30, -24, -22)), [34].concat(rel(10, 34, -22, -16), [190]), [62].concat(rel(10, 62, -22, -16), [190]),
      [74].concat(rel(9, 74, -6, -64), [120]), [100].concat(rel(9, 100, -6, -62), [120])], ev: {}
  });

  window.NelsonBattle.mount('plan', {
    title: 'The Battle of Trafalgar',
    size: [1100, 880], duration: 95, shipScale: .8,
    rose: [92, 96], north: 0,
    wind: { x: 232, y: 86, toward: 112, label: 'Wind WNW, very light' },
    scale: { px: 140, label: '1 nautical mile', x: 30, y: 852 },
    clock: [[0, 660], [8, 705], [14, 720], [17, 730], [28, 765], [36, 795], [44, 825], [50, 855], [56, 870], [72, 960], [80, 990], [88, 1030], [94, 1065], [100, 1080]],
    days: ['21 October 1805'],
    sides: { british: 'British', french: 'French', spanish: 'Spanish' },
    allies: [['french', 'spanish']],
    autoFire: { range: 54 },
    labels: [
      { x: 1082, y: 430, text: 'Cape Trafalgar, 21 miles east →', cls: 'small', anchor: 'end' },
      { x: 1082, y: 32, text: 'to Cádiz ↗', cls: 'small', anchor: 'end' },
      { x: 300, y: 250, text: 'Weather column', cls: 'small' },
      { x: 440, y: 800, text: 'Lee column', cls: 'small' },
      { x: 968, y: 200, text: 'Combined Fleet', cls: 'small', rot: 90 },
      { x: 420, y: 60, text: 'ATLANTIC  OCEAN', cls: 'sea' }
    ],
    ships: ships,
    phases: [
      { t: 0, title: 'Two columns bear down', text: 'Twenty-seven British ships run before a faint west-north-westerly in two columns, at right angles to the Combined Fleet. Villeneuve’s thirty-three creep north for Cádiz in a ragged crescent five miles long.' },
      { t: 8, title: '“England expects”', text: 'At about 11.45 Victory hoists Nelson’s signal to the fleet, then No. 16, “Engage the enemy more closely”, which stays flying until it is shot away.' },
      { t: 14, title: 'Fougueux opens fire', text: 'The allied line opens on Royal Sovereign at noon. Coming on bows-first, the leading British ships cannot reply and must take raking fire through the last half mile.' },
      { t: 17, title: 'Collingwood breaks the line', text: 'Royal Sovereign passes under Santa Ana’s stern, rakes her with a double-shotted broadside and ranges up on her lee side. She fights alone for a quarter of an hour.' },
      { t: 21, title: 'The lee column piles in', text: 'Belleisle, Mars, Tonnant, Bellerophon and the rest strike the allied rear one after another. The line dissolves into ship-to-ship duels in the smoke.' },
      { t: 28, title: 'Victory cuts astern of Bucentaure', text: 'A 68-pounder carronade and a treble-shotted broadside go through Villeneuve’s stern windows at a few yards. Victory then runs aboard the Redoutable.' },
      { t: 36, title: 'Nelson is shot', text: 'About 1.15 pm a musket ball from Redoutable’s mizzen-top strikes Nelson on the quarterdeck. Téméraire closes on Redoutable’s other side, and Fougueux drifts on to Téméraire.' },
      { t: 44, title: 'The centre collapses', text: 'Redoutable, Fougueux and Bucentaure strike within minutes of each other. Villeneuve gives up his sword. Santísima Trinidad, ringed by three-deckers, loses all her masts.' },
      { t: 50, title: 'Santa Ana strikes', text: 'Álava’s flagship hauls down her colours to Royal Sovereign. In the rear the prizes mount: Algésiras, Monarca, Bahama, Swiftsure, Aigle.' },
      { t: 56, title: 'Dumanoir turns back', text: 'The allied van has sailed on untouched for two hours. Dumanoir now wears; four French ships pass to windward at long range and stand away south-west. Intrépide and Neptuno steer for the fight instead.' },
      { t: 72, title: 'Gravina breaks off', text: 'Mortally wounded, Gravina signals the retreat. Eleven ships gather on Príncipe de Asturias and run for Cádiz.' },
      { t: 80, title: 'Nelson dies', text: '“Thank God I have done my duty.” Nelson dies in Victory’s cockpit at about 4.30 pm, knowing that fourteen or fifteen of the enemy have struck.' },
      { t: 88, title: 'The last to strike', text: 'Intrépide surrenders to Orion after fighting half a dozen ships. Neptuno, cut off by Minotaur and Spartiate, follows.' },
      { t: 94, title: 'Achille blows up', text: 'The French Achille, burning since mid-afternoon, explodes at about 5.45 pm. Seventeen prizes are in British hands. Not one British ship is lost.' }
    ]
  });
})();
