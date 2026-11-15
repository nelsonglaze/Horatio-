# Horatio Nelson

A static website about Vice-Admiral Horatio Nelson: his battles, life, ships and flagship.

## Viewing it

Open `index.html` in a browser. There is no build step and nothing to install.

To serve it locally instead:

```
python3 -m http.server 8000
```

then go to <http://localhost:8000>. To publish it, turn on GitHub Pages for this repository (Settings → Pages → deploy from a branch, root folder).

## What is here

| Page | Contents |
| --- | --- |
| `index.html` | Home |
| `battles.html` | All battles, and a short guide to fighting under sail |
| `trafalgar.html`, `nile.html`, `copenhagen.html`, `cape-st-vincent.html` | The four fleet actions, each with an animated plan seen from above, an hour-by-hour log and the order of battle |
| `lesser-actions.html` | Nine smaller actions, 1780 to 1805, three with animated plans (the Ça Ira, Tenerife, the 1805 chase) |
| `life.html` | Personal life and upbringing |
| `timeline.html` | Year-by-year timeline |
| `ships.html` | Every ship he served in |
| `reckoning.html` | Ships taken, killed, wounded and prisoners |
| `victory.html` | HMS Victory, a deck-by-deck cutaway, and links to donate to The Big Repair |
| `words.html` | Quotes, the Trafalgar signal and letters |
| `captains.html` | His captains and his adversaries |
| `legacy.html` | Legacy and controversies |
| `glossary.html` | Sea terms explained |
| `sources.html` | Sources, caveats and picture credits |

## How the battle plans work

`assets/js/battle.js` is a small engine with no dependencies. Each plan has its own scenario file (`trafalgar.js`, `nile.js`, `copenhagen.js`, `st-vincent.js`, `ca-ira.js`, `tenerife.js`, `chase.js`) that lists the ships, their tracks as timed way-points, and the phases of the action. To change a plan, edit the scenario file; to add a battle, copy one and call `NelsonBattle.mount('plan', {...})` from a page that contains `<div id="plan"></div>`.

Styles are in `assets/css/style.css`. Colours and typefaces are set as variables at the top of that file. The ship, sea serpent, whale and title frame are the `orn-*.svg` files in `assets/img`.

## Shelved work

`archive/french/` holds a partly finished French translation that is not part of the site. Its own README says what is there.

## Pictures

Paintings are public-domain reproductions from Wikimedia Commons. The photographs of HMS Victory and Nelson's Column and the flag diagram are Creative Commons licensed; credits and licences are listed on `sources.html`.
