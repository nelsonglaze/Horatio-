/* The long chase, 30 March to 20 August 1805: scenario for the battle-plan engine.
   An Atlantic chart on a plain latitude-longitude grid. Each marker is a whole
   fleet. Coastlines are sketched, not surveyed. */
(function () {
  'use strict';
  var K = 13.1;
  function P(lon, lat) { return [Math.round((lon + 72) * K * 10) / 10, Math.round((53 - lat) * K * 10) / 10]; }
  function path(pts) { return 'M' + pts.map(function (p) { return P(p[0], p[1]).join(','); }).join(' L') + ' Z'; }
  function isle(lon, lat, rx, ry) {
    var c = P(lon, lat);
    return 'M' + (c[0] - rx) + ',' + c[1] + ' a' + rx + ',' + (ry || rx) + ' 0 1,0 ' + (2 * rx) + ',0 a' + rx + ',' + (ry || rx) + ' 0 1,0 ' + (-2 * rx) + ',0 Z';
  }
  var DAY0 = Date.UTC(1805, 2, 30), DAYS = 143;
  function T(month, day) { return (Date.UTC(1805, month - 1, day) - DAY0) / 864e5 / DAYS * 100; }
  function track(list) { return list.map(function (k) { var p = P(k[2], k[3]); return [T(k[0], k[1]), p[0], p[1]]; }); }

  var land = [
    /* France, Iberia, Italy */
    path([[-4.8, 48.4], [-1.6, 48.7], [-1.3, 49.7], [1.5, 50.2], [2.5, 51.1], [4, 52], [5, 53.6], [13, 53.6], [13, 41.2], [11.6, 42.4], [10.3, 43.5], [8.9, 44.4], [7.3, 43.7], [5.9, 43.1], [4, 43.4], [3.1, 42.5], [3.2, 41.9], [2.2, 41.4], [0.3, 40], [-0.3, 39.4], [0.2, 38.7], [-0.6, 37.6], [-2.2, 36.7], [-4.4, 36.7], [-5.35, 36.1], [-6, 36.2], [-6.3, 36.6], [-7.4, 37.2], [-8.9, 37], [-8.8, 38.5], [-9.5, 38.7], [-8.7, 41.2], [-9.3, 43], [-8, 43.7], [-3.8, 43.5], [-1.8, 43.4], [-1.2, 44.6], [-1.2, 46], [-2.2, 47.3], [-4.4, 47.8]]),
    /* southern Britain and Ireland */
    path([[-5.7, 50.1], [-3.5, 50.2], [-1.1, 50.8], [1.4, 51.1], [1.7, 52.6], [0.3, 53.6], [-4.6, 53.6], [-4.4, 52.3], [-5.3, 51.7], [-3, 51.3], [-4.2, 51]]),
    path([[-10, 51.6], [-8.5, 51.5], [-6.2, 52.2], [-6, 53.6], [-10, 53.6], [-10.3, 52.2]]),
    /* Africa */
    path([[-5.9, 35.8], [-5.3, 35.9], [-3, 35.3], [0, 35.8], [3, 36.8], [8, 37], [10, 37.3], [13, 36.6], [13, 3], [-9, 3], [-9, 5], [-11.5, 6.8], [-13.3, 9], [-15, 11], [-16.8, 12.4], [-17.5, 14.7], [-16.3, 16], [-16.5, 19], [-17.1, 20.9], [-14.9, 25], [-13, 27.7], [-9.6, 30.4], [-9.8, 31.5], [-6.8, 34]]),
    /* South America */
    path([[-73, 11.5], [-71.6, 12.4], [-70, 11.6], [-68.4, 10.5], [-66, 10.6], [-64, 10.4], [-62, 10.7], [-60.8, 8.7], [-58.5, 7], [-57, 6], [-55, 5.9], [-52, 5], [-52, 3], [-73, 3]]),
    /* Mediterranean islands */
    isle(9, 40.1, 9, 16), isle(9.1, 42.2, 6, 10), isle(3, 39.6, 6, 4),
    /* Atlantic islands */
    isle(-28.2, 38.6, 5, 3), isle(-25.5, 37.8, 5, 3), isle(-17, 32.7, 4), isle(-16.5, 28.3, 5, 3), isle(-14, 28.6, 5, 3), isle(-23.6, 15.1, 4), isle(-24.4, 16.7, 4),
    /* Caribbean */
    isle(-61.3, 10.45, 7, 5), isle(-59.55, 13.15, 3.5), isle(-61, 14.65, 3.5, 5), isle(-61.5, 16.2, 4), isle(-61.8, 17.1, 3), isle(-66.4, 18.2, 12, 4), isle(-70.6, 19, 22, 8)
  ];

  var ships = [];
  ships.push({ id: 'villeneuve', name: 'The Combined Fleet', side: 'french', scale: 1.7, flag: 'Vice-Adm. Villeneuve', key: true, label: [0, 28], noFire: true,
    captain: '11 of the line from Toulon; 20 with Gravina’s Spaniards and reinforcements',
    fate: 'Toulon to Martinique and back in four and a half months, to end where Nelson would find it: Cádiz.',
    track: track([[3, 30, 5.9, 42.9], [4, 3, 3.5, 40.5], [4, 7, -0.6, 37.3], [4, 9, -5.4, 35.95], [4, 10, -6.7, 36.3], [4, 15, -17, 33], [4, 25, -30, 25], [5, 5, -45, 18], [5, 14, -61, 14.6],
      [6, 5, -61, 14.6], [6, 6, -61.4, 15.8], [6, 8, -62, 17.4], [6, 10, -61.4, 18.4], [6, 18, -50, 27], [6, 26, -40, 33.5], [7, 2, -30, 38.6], [7, 12, -20, 41.5], [7, 22, -11.5, 43.4],
      [7, 27, -9.3, 42.2], [7, 31, -9.3, 42.2], [8, 2, -8.6, 43.6], [8, 13, -8.6, 43.6], [8, 15, -11, 44.4], [8, 17, -10.2, 40], [8, 20, -6.5, 36.5]]),
    ev: { fire: [[T(7, 22) - .5, T(7, 22) + .7, 'B']] } });
  ships.push({ id: 'nelson', name: 'Nelson', side: 'british', scale: 1.7, flag: 'Vice-Adm. Lord Nelson, in Victory', key: true, label: [0, -20], noFire: true,
    captain: '11 of the line off Toulon; 10 across the Atlantic',
    fate: 'About seven thousand miles out and back. He never sighted the enemy, and the West Indies were saved.',
    track: track([[3, 30, 8.6, 38.9], [4, 6, 10.6, 38.3], [4, 10, 11.9, 38.3], [4, 18, 9.5, 38.5], [4, 27, 4, 38.3], [5, 1, -1, 36.5], [5, 4, -5.3, 35.6], [5, 7, -5.4, 36.02], [5, 10, -8.7, 36.9], [5, 11, -8.7, 36.9],
      [5, 15, -17, 32.3], [5, 25, -37, 21.5], [6, 4, -59.6, 13.1], [6, 7, -61.3, 10.9], [6, 9, -61.8, 12.1], [6, 12, -61.9, 17.1], [6, 13, -61.9, 17.1], [6, 21, -52, 26], [6, 30, -40, 32], [7, 10, -27, 36.2],
      [7, 17, -11, 36.5], [7, 19, -5.35, 36.05], [7, 24, -5.35, 36.05], [7, 26, -7.6, 36.2], [8, 3, -11, 39], [8, 10, -10.5, 44.5], [8, 15, -5.9, 48.3], [8, 18, -1.2, 50.62]]),
    ev: {} });
  ships.push({ id: 'curieux', name: 'Curieux', side: 'british', guns: 18, scale: .8, captain: 'Cmdr George Bettesworth', label: [0, -13], noFire: true,
    fate: 'Sent home with Nelson’s dispatches, she sighted the Combined Fleet on 19 June and carried its course to London. The news reached the Admiralty on 9 July.',
    track: track([[6, 12, -61.7, 17.5], [6, 13, -61.7, 17.5], [6, 19, -50.5, 29.2], [6, 28, -30, 42], [7, 7, -4.2, 50.25]]), ev: { hide: [[0, T(6, 12)], [T(7, 9), 101]] } });
  ships.push({ id: 'calder', name: 'Calder', side: 'british', scale: 1.3, flag: 'Vice-Adm. Sir Robert Calder', label: [26, -8, 'start'], noFire: true,
    captain: '15 of the line',
    fate: 'Met Villeneuve in fog off Finisterre on 22 July and took two Spanish ships. Court-martialled and reprimanded for not renewing the action.',
    track: track([[7, 9, -9.4, 44.3], [7, 19, -10.6, 44.1], [7, 22, -11.4, 43.9], [7, 26, -10.4, 45], [8, 4, -6.2, 48.2]]), ev: { fire: [[T(7, 22) - .5, T(7, 22) + .7, 'B']], hide: [[0, T(7, 9)], [T(8, 6), 101]] } });

  function place(lon, lat, text, dx, dy, anchor) { var p = P(lon, lat); return { x: p[0] + (dx || 6), y: p[1] + (dy || 4), text: text, cls: 'place', anchor: anchor || 'start' }; }
  function dot(lon, lat) { var p = P(lon, lat); return { x: p[0], y: p[1], r: 3.2 }; }

  window.NelsonBattle.mount('plan-chase', {
    key: 'chase',
    title: 'The long chase of 1805',
    size: [1110, 650], duration: 80,
    rose: [560, 548], north: 0,
    scale: { px: 109, label: '500 nautical miles', x: 250, y: 624 },
    calendar: [DAY0, Date.UTC(1805, 7, 20)],
    sides: { british: 'British', french: 'Combined Fleet' },
    land: land,
    forts: [dot(5.9, 43.1), dot(-6.3, 36.5), dot(-5.35, 36.1), dot(-8.3, 43.5), dot(-1.1, 50.8), dot(-61, 14.6), dot(-59.55, 13.15), dot(-61.8, 17.1), dot(-17, 32.7)],
    labels: [
      place(5.9, 43.1, 'Toulon', 6, -8), place(-6.3, 36.5, 'Cádiz', -8, -6, 'end'), place(-5.35, 36.1, 'Gibraltar', 4, 16), place(-8.3, 43.5, 'Ferrol', 8, 14),
      place(-9.3, 43, 'C. Finisterre', -8, 2, 'end'), place(-1.1, 50.8, 'Portsmouth', 8, -6), place(-5.1, 48.4, 'Ushant', -8, 2, 'end'),
      place(-17, 32.7, 'Madeira', 8, 4), place(-27, 38.2, 'Azores', -4, -10, 'end'),
      place(-61, 14.6, 'Martinique', -8, 2, 'end'), place(-59.55, 13.15, 'Barbados', 8, 6), place(-61.3, 10.45, 'Trinidad', -12, 6, 'end'), place(-61.8, 17.1, 'Antigua', -8, -4, 'end'),
      { x: 420, y: 250, text: 'ATLANTIC  OCEAN', cls: 'sea' }, { x: 1010, y: 300, text: 'AFRICA', cls: 'caps' }, { x: 930, y: 104, text: 'FRANCE', cls: 'caps' }, { x: 912, y: 200, text: 'SPAIN', cls: 'caps' }
    ],
    ships: ships,
    phases: [
      { t: 0, title: 'Villeneuve slips out of Toulon', text: 'On 30 March eleven of the line get to sea while Nelson’s frigates are out of touch. Nelson, off Sardinia, covers the routes to Sicily and Egypt. The French go the other way.' },
      { t: T(4, 9), title: 'Through the Strait', text: 'Villeneuve passes Gibraltar on 9 April, collects Gravina’s Spanish ships at Cádiz and stands out into the Atlantic. Nelson does not hear of it for another nine days.' },
      { t: T(4, 18), title: 'Dead foul', text: 'It takes Nelson three weeks to beat down the Mediterranean against westerly gales. “My good fortune seems flown away,” he writes. He reaches Gibraltar a month behind.' },
      { t: T(5, 11), title: 'Ten ships after eighteen', text: 'Sure at last that the enemy has gone to the West Indies, he follows from Lagos Bay on 11 May. Villeneuve reaches Martinique three days later and waits there for reinforcements.' },
      { t: T(6, 4), title: 'Barbados, and a false report', text: 'Nelson arrives on 4 June, having gained ten days on the passage. A British general’s report sends him south to Trinidad, where there is nothing. Villeneuve is three hundred miles to the north.' },
      { t: T(6, 8), title: 'Villeneuve hears the name', text: 'Off Antigua the Combined Fleet takes a sugar convoy and learns from its prisoners that Nelson has come. Within two days it is on its way back to Europe.' },
      { t: T(6, 13), title: 'Back across', text: 'Nelson reaches Antigua on the 12th, guesses the rest and sails next day. He sends the brig Curieux ahead with dispatches. She sights the Combined Fleet in mid-ocean and notes its course.' },
      { t: T(7, 8), title: 'The Admiralty moves', text: 'Curieux’s news reaches Lord Barham on 9 July. Within hours Calder’s squadron is ordered to cruise off Cape Finisterre, across Villeneuve’s path.' },
      { t: T(7, 19), title: 'Ashore at Gibraltar', text: 'Nelson anchors on 19 July without having seen the enemy, and next day sets foot on land for the first time in two years, less ten days.' },
      { t: T(7, 22) - .4, title: 'Calder’s action', text: 'In fog off Finisterre on 22 July, Calder’s fifteen meet Villeneuve’s twenty and take two Spanish ships. He does not renew the fight, and is court-martialled for it.' },
      { t: T(7, 28), title: 'Vigo, Ferrol, Cádiz', text: 'Villeneuve puts into Vigo, then Ferrol. He sails on 13 August with orders for the Channel, turns south instead, and enters Cádiz on the 20th. Nelson, by way of Ushant, reached Portsmouth two days before.' }
    ]
  });
})();
