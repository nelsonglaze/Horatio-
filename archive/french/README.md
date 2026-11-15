# French translation (shelved)

A French version of the site was started and then dropped. Nothing in this folder is used by the live site; it is kept so the work is not lost.

## What is here

| File | Contents | State |
| --- | --- | --- |
| `pages/index.html` | Home page | Translated |
| `pages/battles.html` | Battles index | Translated |
| `pages/trafalgar.html` | Trafalgar | Translated |
| `pages/nile.html` | Aboukir (the Nile) | Translated |
| `pages/copenhagen.html` | Copenhagen | Translated |
| `pages/cape-st-vincent.html` | Cape St Vincent | Translated |
| `fr.js` | Animated plans: button labels, map labels and phase captions for all seven plans | Complete |
| `fr-ships.js` | Animated plans: the note shown for every ship in all seven plans | Complete |
| `build.py` | The page builder with French support | Reference only |

Not translated: lesser actions, life, timeline, ships, the reckoning, HMS Victory, words, captains, legacy, sources, glossary.

## Notes for anyone picking it up

- The files in `pages/` are page bodies, not whole pages. They have no `<head>`, masthead or footer; the builder added those. Lines like `<!--title: ... -->` at the top carry the page title and description.
- `<!--TABLE 0-->` marks where a table from the English page was dropped in, with its headings translated by a word list in `build.py`.
- The engine in `assets/js/battle.js` still accepts translations. Load `fr.js` and `fr-ships.js` before `battle.js` on a page and its plan appears in French.
- A French site would live in a `fr/` folder, with links to `../assets/`.
