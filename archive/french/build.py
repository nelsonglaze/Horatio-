#!/usr/bin/env python3
"""Wrap each page body with the shared head, masthead and footer and write it to the site.
English bodies live in ../pages and go to the site root; French bodies live in ../pages-fr and go to fr/."""
import re, os, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = "/home/user/Horatio-"
FONTS = "https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap"
ORN = {"battles": "ship", "trafalgar": "ship", "nile": "serpent", "copenhagen": "whale", "cape-st-vincent": "ship", "lesser-actions": "serpent",
       "life": "ship", "timeline": "serpent", "ships": "ship", "reckoning": "whale", "victory": "whale", "words": "serpent", "captains": "ship",
       "legacy": "whale", "sources": "serpent", "glossary": "whale"}
PAGES = ["index", "battles", "life", "timeline", "ships", "reckoning", "victory", "words", "captains", "legacy"]

L = {
 "en": dict(
    dir="pages", out="", pre="", html="en", other="fr", other_name="Français", other_href="fr/",
    nav=["Home", "Battles", "Life", "Timeline", "Ships", "The Reckoning", "HMS Victory", "Words", "Captains", "Legacy"],
    home_title="Horatio Nelson · His life, ships and battles", brand_sub="A chart of his life, ships &amp; battles, 1758&ndash;1805",
    skip="Skip to the text", sections="Sections", lang_label="Language",
    motto="&ldquo;Thank God, I have done my duty.&rdquo;",
    about='A site about Vice-Admiral Horatio, Viscount Nelson, built for reading and for looking at maps. Battle plans are schematic; figures are the commonly cited ones and are discussed on the <a href="sources.html">sources page</a>.',
    f1="The sheets", f1_links=[("battles.html", "Battles &amp; animated plans"), ("life.html", "Life &amp; upbringing"), ("ships.html", "Every ship he served in"),
                               ("reckoning.html", "The reckoning in numbers"), ("glossary.html", "Glossary of sea terms")],
    f2="HMS Victory", f2_links=[("victory.html", "The ship &amp; her story"), ("victory.html#appeal", "Support The Big Repair"), ("sources.html", "Sources &amp; picture credits")]),
 "fr": dict(
    dir="pages-fr", out="fr/", pre="../", html="fr", other="en", other_name="English", other_href="../",
    nav=["Accueil", "Batailles", "Vie", "Chronologie", "Navires", "Le bilan", "HMS Victory", "Paroles", "Capitaines", "Postérité"],
    home_title="Horatio Nelson · Sa vie, ses navires, ses batailles", brand_sub="Carte de sa vie, de ses navires et de ses batailles, 1758&ndash;1805",
    skip="Aller au texte", sections="Rubriques", lang_label="Langue",
    motto="«&nbsp;Dieu merci, j’ai fait mon devoir.&nbsp;»",
    about='Un site consacré au vice-amiral Horatio, vicomte Nelson, fait pour lire et pour regarder des cartes. Les plans de bataille sont schématiques ; les chiffres sont ceux que l’on cite d’ordinaire et sont discutés à la page des <a href="sources.html">sources</a>.',
    f1="Les feuilles", f1_links=[("battles.html", "Batailles et plans animés"), ("life.html", "Vie et jeunesse"), ("ships.html", "Tous les navires où il a servi"),
                                 ("reckoning.html", "Le bilan en chiffres"), ("glossary.html", "Glossaire des termes de marine")],
    f2="HMS Victory", f2_links=[("victory.html", "Le navire et son histoire"), ("victory.html#appeal", "Soutenir The Big Repair"), ("sources.html", "Sources et crédits des images")]),
}

# words and phrases in the tables that are shared with the English pages
TABLE_FR = [
    ("British fleet: weather column", "Flotte britannique : colonne au vent"), ("British fleet: lee column", "Flotte britannique : colonne sous le vent"),
    ("Combined Fleet, from van (north) to rear (south)", "Flotte combinée, de l’avant-garde (nord) à l’arrière-garde (sud)"),
    ("British squadron, in order of attack", "Escadre britannique, dans l’ordre d’attaque"), ("French fleet, from van to rear", "Flotte française, de l’avant-garde à l’arrière-garde"),
    ("Nelson's division, south to north as anchored", "Division de Nelson, du sud au nord, au mouillage"), ("Danish line, south to north", "Ligne danoise, du sud au nord"),
    ("British line, van to rear", "Ligne britannique, de l’avant-garde à l’arrière-garde"), ("Spanish fleet", "Flotte espagnole"), ("Her guns at Trafalgar", "Son artillerie à Trafalgar"),
    ("What it cost him", "Ce qu’il lui en a coûté"),
    ("<th>Ship</th>", "<th>Navire</th>"), ("<th>Vessel</th>", "<th>Bâtiment</th>"), ("<th>Kind</th>", "<th>Type</th>"), (">Guns</th>", ">Canons</th>"), ("<th>Captain</th>", "<th>Capitaine</th>"),
    ("<th>Commander</th>", "<th>Commandant</th>"), ("<th>Flag officer or commander</th>", "<th>Officier général ou commandant</th>"), (">Killed</th>", ">Tués</th>"), (">Wounded</th>", ">Blessés</th>"),
    ("<th>Nation</th>", "<th>Nation</th>"), ("<th>Fate in the battle</th>", "<th>Sort dans la bataille</th>"), ("<th>Afterwards</th>", "<th>Par la suite</th>"), ("<th>Fate</th>", "<th>Sort</th>"),
    ("<th>Deck</th>", "<th>Pont</th>"), ("<th>Weight of shot</th>", "<th>Calibre</th>"), ("<th>When</th>", "<th>Date</th>"), ("<th>Where</th>", "<th>Lieu</th>"), ("<th>Wound</th>", "<th>Blessure</th>"),
    ('<span class="tag taken">Taken</span> burnt', '<span class="tag taken">Pris</span> brûlé'), ('<span class="tag taken">Taken</span> kept', '<span class="tag taken">Pris</span> conservé'),
    ('<span class="tag taken">Taken</span> 3 Aug.', '<span class="tag taken">Pris</span> le 3 août'), ('<span class="tag taken">Taken</span>', '<span class="tag taken">Pris</span>'),
    ('<span class="tag escaped">Escaped</span>', '<span class="tag escaped">Échappé</span>'), ('<span class="tag escaped">Withdrew</span>', '<span class="tag escaped">Retiré</span>'),
    ('<span class="tag escaped">aground</span>', '<span class="tag escaped">échoué</span>'), ('<span class="tag lost">Blew up</span>', '<span class="tag lost">Explosé</span>'),
    ('<span class="tag lost">Burnt</span> by her crew', '<span class="tag lost">Brûlé</span> par son équipage'), ('<span class="tag lost">Burnt</span>', '<span class="tag lost">Brûlé</span>'),
    ('<span class="tag lost">Sunk</span>', '<span class="tag lost">Coulé</span>'), ("<td>Badly damaged</td>", "<td>Gravement avarié</td>"),
    ("<td>Spanish</td>", "<td>Espagnol</td>"), ("<td>French</td>", "<td>Français</td>"), (", frigate</td>", ", frégate</td>"), (", brig</td>", ", brick</td>"),
    ("Retaken 23 Oct., wrecked", "Repris le 23 oct., naufragé"), ("Taken off Cape Ortegal, 4 Nov.", "Pris au cap Ortegal, le 4 nov."), ("Taken off Cape Ortegal; HMS Implacable until 1949", "Pris au cap Ortegal ; HMS Implacable jusqu’en 1949"),
    ("Taken off Cape Ortegal", "Pris au cap Ortegal"), ("Burnt by the British", "Brûlé par les Britanniques"), ("Wrecked after the sortie of 23 Oct.", "Naufragé après la sortie du 23 oct."),
    ("Wrecked in the storm", "Naufragé dans la tempête"), ("Reached Cádiz; Gravina died of his wound in March 1806", "Rallie Cadix ; Gravina meurt de sa blessure en mars 1806"), ("Reached Cádiz", "Rallie Cadix"),
    ("Scuttled in the storm", "Sabordé dans la tempête"), ("Sank under tow, 22 Oct.", "Coule en remorque, le 22 oct."), ("Retaken 23 Oct.", "Repris le 23 oct."), ("Retaken by her crew", "Repris par son équipage"),
    ("Reached Gibraltar", "Atteint Gibraltar"), ("<td>Scuttled</td>", "<td>Sabordé</td>"),
    ("<td>blockship</td>", "<td>ponton armé</td>"), ("<td>pram</td>", "<td>prame</td>"), ("<td>floating battery</td>", "<td>batterie flottante</td>"), ("<td>frigate hulk</td>", "<td>frégate rasée</td>"),
    ("<td>sloop</td>", "<td>corvette</td>"), ("<td>ship of the line</td>", "<td>vaisseau de ligne</td>"), ("<td>old Indiaman</td>", "<td>ancien navire des Indes</td>"), ("<td>frigate</td>", "<td>frégate</td>"),
    ("And sixteen more of 74 guns:", "Et seize autres vaisseaux de 74 canons :"), (" and Terrible.", " et Terrible."),
    ("Lower gun deck", "Batterie basse"), ("Middle gun deck", "Deuxième batterie"), ("Upper gun deck", "Troisième batterie"), ("<td>Quarterdeck</td>", "<td>Gaillard d’arrière</td>"),
    ("<td>Forecastle</td>", "<td>Gaillard d’avant</td>"), ("32-pounders", "pièces de 32 livres"), ("24-pounders", "pièces de 24 livres"), ("long 12-pounders", "pièces longues de 12 livres"),
    ("short 12-pounders", "pièces courtes de 12 livres"), ("<td>12-pounders</td>", "<td>pièces de 12 livres</td>"), ("68-pounder carronades", "caronades de 68 livres"),
    ("<b>Total</b>", "<b>Total</b>"), ("One broadside: 1,148 lb of iron", "Une bordée : 1 148 livres de fonte"),
    ("12 July 1794", "12 juillet 1794"), ("14 Feb. 1797", "14 févr. 1797"), ("24 July 1797", "24 juillet 1797"), ("1 Aug. 1798", "1er août 1798"), ("21 Oct. 1805", "21 oct. 1805"),
    ("<td>Cape St Vincent</td>", "<td>Cap Saint-Vincent</td>"), ("<td>Tenerife</td>", "<td>Ténérife</td>"), ("<td>The Nile</td>", "<td>Aboukir</td>"),
    ("Right eye: sight lost", "Œil droit : vue perdue"), ("Blow to the abdomen: a rupture for life", "Coup à l’abdomen : une hernie à vie"), ("Right arm: amputated", "Bras droit : amputé"),
    ("Forehead laid open; concussion", "Front ouvert ; commotion"), ("Musket ball through shoulder, lung and spine: fatal", "Balle de mousquet dans l’épaule, le poumon et la colonne : mortelle"),
    ("Lt John ", "Lt John "), (" †", " †"),
]

def table_fr(html):
    for a, b in TABLE_FR:
        html = html.replace(a, b)
    return html

def page(lang, name, body):
    c = L[lang]
    meta = dict(re.findall(r"<!--(\w+):\s*(.*?)\s*-->", body))
    body = re.sub(r"<!--\w+:.*?-->\n?", "", body).strip("\n")
    if lang == "fr":                        # tables shared with the English page
        en = open(os.path.join(HERE, "..", "pages", name), encoding="utf-8").read()
        tables = re.findall(r'<div class="table-wrap[^"]*">.*?</table>\s*</div>', en, flags=re.S)
        body = re.sub(r"<!--TABLE (\d+)-->", lambda m: table_fr(tables[int(m.group(1))]), body)
        body = body.replace('="assets/', '="../assets/')
    title = meta["title"]; cur = meta.get("nav", "")
    orn = ORN.get(name[:-5])
    if orn: body = body.replace('<header class="page-head">', '<header class="page-head orn-%s">' % orn, 1)
    full = c["home_title"] if name == "index.html" else f"{title} · Horatio Nelson"
    nav = "\n".join(f'        <li><a href="{p}.html"{" aria-current=\"page\"" if p == ("index" if cur == "home" else cur) else ""}>{t}</a></li>' for p, t in zip(PAGES, c["nav"]))
    names = meta.get("scripts", "").split()
    if lang == "fr" and "battle.js" in names: names = ["fr.js", "fr-ships.js"] + names
    scripts = "\n".join(f'<script src="{c["pre"]}assets/js/{s}"></script>' for s in names)
    other_dir = L[c["other"]]["dir"]
    has_other = os.path.exists(os.path.join(HERE, "..", other_dir, name))
    switch = (f'<a href="{c["other_href"]}{name}" lang="{c["other"]}" hreflang="{c["other"]}">{c["other_name"]}</a>' if has_other else "")
    alt = f'<link rel="alternate" hreflang="{c["other"]}" href="{c["other_href"]}{name}">\n' if has_other else ""
    def links(items): return "\n".join(f'        <li><a href="{h}">{t}</a></li>' for h, t in items)
    return f"""<!DOCTYPE html>
<html lang="{c['html']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full}</title>
<meta name="description" content="{meta['desc']}">
{alt}<link rel="icon" href="{c['pre']}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="{c['pre']}assets/css/style.css">
</head>
<body>
<a class="skip" href="#main">{c['skip']}</a>
<div class="neatline" aria-hidden="true"></div>
<header class="masthead">
  <div class="masthead-in">
    <a class="brand" href="index.html">
      <span class="brand-name">Horatio Nelson</span>
      <span class="brand-sub">{c['brand_sub']}</span>
    </a>
    <nav class="nav" aria-label="{c['sections']}">
      <ul>
{nav}
      </ul>
    </nav>
    <p class="langs" aria-label="{c['lang_label']}"><span aria-current="true">{c['html'].upper()}</span>{switch}</p>
  </div>
</header>

<main id="main">
{body}
</main>

<footer class="foot">
  <div class="foot-in">
    <div>
      <p class="motto">{c['motto']}</p>
      <p>{c['about']}</p>
    </div>
    <div>
      <h2>{c['f1']}</h2>
      <ul>
{links(c['f1_links'])}
      </ul>
    </div>
    <div>
      <h2>{c['f2']}</h2>
      <ul>
{links(c['f2_links'])}
      </ul>
    </div>
  </div>
  <div class="neatline" aria-hidden="true"></div>
</footer>
{scripts}
</body>
</html>
"""

only = sys.argv[1:]
for lang in ("en", "fr"):
    c = L[lang]
    src = os.path.join(HERE, "..", c["dir"])
    if not os.path.isdir(src): continue
    os.makedirs(os.path.join(OUT, c["out"]), exist_ok=True)
    for f in sorted(glob.glob(os.path.join(src, "*.html"))):
        name = os.path.basename(f)
        if only and name not in only: continue
        open(os.path.join(OUT, c["out"], name), "w", encoding="utf-8").write(page(lang, name, open(f, encoding="utf-8").read()))
        print("built", c["out"] + name)
