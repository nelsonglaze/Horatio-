/* Texte français des plans animés. Chargé avant battle.js sur les pages françaises :
   les libellés du moteur, puis, pour chaque plan, titres, légendes et récit des phases.
   Le sort de chaque navire est dans fr-ships.js. */
window.NelsonBattleUI = {
  play: 'Lecture', pause: 'Pause', replay: 'Rejouer', restart: 'Recommencer', speed: 'Vitesse ', names: ' Noms des navires', wakes: ' Sillages',
  struck: 'A amené son pavillon', flagship: 'Vaisseau amiral', aground: 'Échoué', hint: 'Cliquez sur un navire pour voir son nom, ses canons et son capitaine.',
  ship: 'Navire', pick: 'Cliquez sur un navire du plan pour voir son nom, ses canons, son capitaine et son sort.', flagTag: 'vaisseau amiral', guns: ' canons',
  flagOf: 'Pavillon de ', scrub: 'Position dans la bataille', aria: ' : plan animé des flottes vues du ciel',
  months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  swap: [['Vice-Adm. ', 'V.-am. '], ['Rear-Adm. ', 'C.-am. '], ['Adm. ', 'Am. '], ['Lt-Cmdr ', 'Lt de vaisseau '], ['Sub-Lt ', 'Enseigne '], ['Lt-Gen. ', 'Lt-gén. '],
    ['Capts ', 'Cap. '], ['Capt. ', 'Cap. '], ['Cmdr ', 'Cdt '], ['Lieut. ', 'Lt '], ['Maj. ', 'Major '], ['(killed)', '(tué)'], ['(wounded)', '(blessé)'], ['(drowned)', '(noyé)'],
    ['(acting)', '(par intérim)'], [' and ', ' et '], ['Frigate', 'Frégate'], [', in Victory', ', sur le Victory'], [', Royal Marines', ', Royal Marines']]
};

window.NelsonBattleLocale = {
  trafalgar: {
    title: 'La bataille de Trafalgar', days: ['21 octobre 1805'],
    sides: { british: 'Britanniques', french: 'Français', spanish: 'Espagnols' },
    wind: 'Vent ONO, très faible', scale: '1 mille marin',
    labels: ['Cap Trafalgar, à 21 milles à l’est →', 'vers Cadix ↗', 'Colonne au vent', 'Colonne sous le vent', 'Flotte combinée', 'OCÉAN  ATLANTIQUE'],
    phases: [
      ['Deux colonnes laissent porter', 'Vingt-sept vaisseaux britanniques courent sous une faible brise d’ouest-nord-ouest, en deux colonnes, perpendiculairement à la flotte combinée. Les trente-trois de Villeneuve se traînent vers Cadix, au nord, en un croissant irrégulier long de cinq milles.'],
      ['« England expects »', 'Vers 11 h 45, le Victory hisse le signal de Nelson à la flotte, puis le no 16, « Engagez l’ennemi de plus près », qui reste battant jusqu’à ce qu’un boulet l’emporte.'],
      ['Le Fougueux ouvre le feu', 'À midi, la ligne alliée tire sur le Royal Sovereign. Arrivant par l’avant, les vaisseaux de tête britanniques ne peuvent pas riposter et encaissent un feu d’enfilade pendant le dernier demi-mille.'],
      ['Collingwood coupe la ligne', 'Le Royal Sovereign passe sous la poupe de la Santa Ana, la prend en enfilade d’une bordée à double charge et vient se ranger sous son vent. Il combat seul pendant un quart d’heure.'],
      ['La colonne sous le vent s’engouffre', 'Le Belleisle, le Mars, le Tonnant, le Bellerophon et les autres frappent l’arrière-garde alliée l’un après l’autre. La ligne se défait en duels de vaisseau à vaisseau dans la fumée.'],
      ['Le Victory passe derrière le Bucentaure', 'Une caronade de 68 livres et une bordée à triple charge traversent les fenêtres de poupe de Villeneuve à quelques mètres. Le Victory aborde ensuite le Redoutable.'],
      ['Nelson est touché', 'Vers 13 h 15, une balle de mousquet tirée de la hune d’artimon du Redoutable atteint Nelson sur le gaillard d’arrière. Le Téméraire serre le Redoutable de l’autre bord, et le Fougueux dérive sur le Téméraire.'],
      ['Le centre s’effondre', 'Le Redoutable, le Fougueux et le Bucentaure amènent à quelques minutes d’intervalle. Villeneuve rend son épée. La Santísima Trinidad, cernée par des trois-ponts, perd tous ses mâts.'],
      ['La Santa Ana amène', 'Le vaisseau amiral d’Álava amène son pavillon devant le Royal Sovereign. À l’arrière-garde, les prises s’accumulent : l’Algésiras, le Monarca, le Bahama, le Swiftsure, l’Aigle.'],
      ['Dumanoir fait demi-tour', 'L’avant-garde alliée a continué sa route, intacte, pendant deux heures. Dumanoir vire enfin ; quatre vaisseaux français passent au vent, à longue portée, et s’éloignent vers le sud-ouest. L’Intrépide et le Neptuno, eux, gouvernent sur le combat.'],
      ['Gravina rompt le combat', 'Mortellement blessé, Gravina signale la retraite. Onze vaisseaux se rallient au Príncipe de Asturias et font route sur Cadix.'],
      ['Mort de Nelson', '« Dieu merci, j’ai fait mon devoir. » Nelson meurt dans le poste des blessés du Victory vers 16 h 30, sachant que quatorze ou quinze ennemis ont amené.'],
      ['Les derniers à se rendre', 'L’Intrépide se rend à l’Orion après avoir combattu une demi-douzaine de vaisseaux. Le Neptuno, coupé par le Minotaur et le Spartiate, le suit.'],
      ['L’Achille saute', 'L’Achille français, en feu depuis le milieu de l’après-midi, explose vers 17 h 45. Dix-sept prises sont aux mains des Britanniques, qui n’ont pas perdu un seul navire.']
    ]
  },
  nile: {
    title: 'La bataille d’Aboukir', days: ['1er août 1798', '2 août 1798'],
    sides: { british: 'Britanniques', french: 'Français' }, wind: 'Vent NNO',
    labels: ['ÉGYPTE', 'Fort d’Aboukir', 'Île d’Aboukir', 'hauts-fonds', 'BAIE  D’ABOUKIR', '← Alexandrie, 13 milles', 'Bouche de Rosette (Nil) →'],
    phases: [
      ['On double l’île au coucher du soleil', 'Après dix semaines de recherche, Nelson trouve Brueys à l’ancre dans la baie d’Aboukir. Il n’attend ni le matin ni ses traînards : l’escadre contourne le haut-fond de l’île d’Aboukir, vent arrière.'],
      ['Les Français ouvrent le feu', 'Treize vaisseaux sont mouillés en une ligne brisée, l’avant au nord-ouest, les canons en batterie du côté du large. Beaucoup de leurs hommes sont à terre à creuser des puits. Le Guerrier et le Conquérant tirent les premiers, vers 18 h 20.'],
      ['Foley passe à terre de la ligne', 'Le Goliath coupe la route du Guerrier par l’avant. Foley se dit que là où un vaisseau français peut éviter sur une seule ancre, un vaisseau britannique peut passer. Les canons du côté de la terre ne sont même pas dégagés.'],
      ['Cinq vaisseaux côté terre', 'Le Zealous, l’Orion, l’Audacious et le Theseus suivent le Goliath. Au passage, l’Orion coule la frégate la Sérieuse.'],
      ['Nelson double l’avant-garde', 'Le Vanguard mouille du côté du large ; le Minotaur et le Defence viennent se placer derrière lui. Chacun des vaisseaux français de tête a maintenant un ennemi par chaque travers, et l’arrière-garde ne peut pas remonter au vent pour l’aider.'],
      ['Le Bellerophon contre l’Orient', 'Le Bellerophon s’arrête contre le trois-ponts amiral, deux fois plus fort que lui. En moins d’une heure il est démâté et part à la dérive. Le Culloden est planté sur le haut-fond ; le Majestic perd son capitaine.'],
      ['Des renforts dans la nuit', 'L’Alexander et le Swiftsure, de retour d’Alexandrie, gouvernent sur les éclairs des canons. Le Leander mouille en travers de l’avant du Franklin. Vers 20 h 30, Nelson a le front ouvert jusqu’à l’os au-dessus de son œil aveugle ; on le descend.'],
      ['L’Orient est en feu', 'Les flammes montent dans le gréement du vaisseau amiral. Brueys est déjà mort. Des deux côtés, on coupe les câbles ou l’on ferme les sabords pour s’écarter de ce qui va suivre.'],
      ['L’explosion', 'Vers 22 heures, l’Orient saute, avec une secousse entendue jusqu’à Alexandrie. Pendant plusieurs minutes, plus un canon ne tire dans la baie.'],
      ['Le Franklin amène', 'Au centre, le combat se traîne jusque vers minuit. Les équipages sont si épuisés que des hommes s’endorment à leurs pièces.'],
      ['L’aube du 2 août', 'L’avant-garde et le centre français ne sont plus que prises ou épaves. Les vaisseaux britanniques les moins éprouvés descendent vers l’arrière-garde, où l’Heureux et le Mercure sont échoués. Tous deux amènent.'],
      ['Villeneuve s’échappe', 'Le Guillaume Tell, le Généreux et deux frégates coupent leurs câbles et gagnent le large. Seul le Zealous est en état de chasser, et Nelson le rappelle. Le Timoléon est jeté à la côte et brûlé.']
    ]
  },
  copenhagen: {
    title: 'La bataille de Copenhague', days: ['2 avril 1801'],
    sides: { british: 'Britanniques', danish: 'Danois' }, wind: 'Vent SSE', scale: '½ mille marin',
    labels: ['AMAGER', 'COPENHAGUE', 'Hauts-fonds d’Amager', 'MIDDLE  GROUND', 'Passe du Roi', 'PASSE  EXTÉRIEURE', 'Mouillage de Nelson, nuit du 1er avril', 'port'],
    phases: [
      ['Le vent devient favorable', 'Nelson a passé la nuit à l’ancre à l’extrémité du banc du Middle Ground, à deux milles de la ligne danoise. À 9 h 30, le vent étant au sud-sud-est, il fait le signal d’appareiller successivement.'],
      ['L’Edgar ouvre la marche', 'L’Edgar double le banc, seul, et longe sous le feu toutes les batteries du sud avant de mouiller par l’arrière en face du Jylland. Les pilotes ont refusé de guider ; un maître de manœuvre s’est porté volontaire.'],
      ['Trois vaisseaux échoués', 'L’Agamemnon ne parvient pas à doubler le banc. Le Bellona et le Russell serrent de trop près son bord ouest et s’y plantent. Un quart de la ligne de Nelson est hors de combat avant le premier coup.'],
      ['La ligne se forme', 'Chaque vaisseau passe à l’extérieur de ceux qui sont déjà mouillés et prend le poste suivant. Nelson réordonne sa ligne en marche. Riou mène ses frégates contre Trekroner, à la place des 74 manquants.'],
      ['Une canonnade à une encablure', 'À 11 h 30, tous les vaisseaux sont engagés, à quelque deux cents mètres. Il n’y a plus de manœuvre possible : les pontons ne peuvent pas fuir et les Britanniques ne peuvent pas partir. Le Dannebrog brûle déjà.'],
      ['Le signal no 39', 'À quatre milles au nord, Parker voit trois vaisseaux échoués et un feu danois qui ne faiblit pas. Vers 13 h 15 il signale : cessez le combat. Nelson porte la lunette à son œil aveugle. « Vraiment, je ne vois pas le signal. »'],
      ['Riou obéit', 'Les frégates, bien en vue du vaisseau amiral, se retirent. Au moment où l’Amazon présente sa poupe à Trekroner, un boulet tue Riou. Aucun vaisseau de ligne ne bouge.'],
      ['Le feu danois faiblit', 'L’un après l’autre, les pontons du sud se taisent. Certains amènent, sont réarmés depuis la terre et tirent de nouveau, si bien qu’on ne peut prendre possession des prises sans tuer encore.'],
      ['Une lettre sous pavillon parlementaire', 'Nelson écrit « Aux frères des Anglais, les Danois » : cessez le feu, ou il devra brûler les batteries flottantes qu’il a prises, avec les hommes qui s’y trouvent. Il tient à la cacheter proprement à la cire.'],
      ['Cessez-le-feu', 'Le prince héritier accepte une trêve. Le feu s’arrête vers 15 heures. Les Britanniques peuvent dégager leurs vaisseaux meurtris de sous les canons de Trekroner.'],
      ['Le Dannebrog saute', 'Le vaisseau amiral en flammes, à la dérive depuis qu’il a amené, explose vers 16 h 30. Sur dix-huit bâtiments embossés, douze sont des prises ; tous seront brûlés, sauf le Holsteen.']
    ]
  },
  stvincent: {
    title: 'La bataille du cap Saint-Vincent', days: ['14 février 1797'],
    sides: { british: 'Britanniques', spanish: 'Espagnols' }, wind: 'Vent O¼SO', scale: '1 mille marin',
    labels: ['Cap Saint-Vincent, à 25 milles au nord-est ↗', 'vers Cadix →', 'OCÉAN  ATLANTIQUE', 'Corps principal espagnol, 18 voiles', 'Division sous le vent'],
    phases: [
      ['Jervis gouverne sur la brèche', 'De la brume du matin sort la grande flotte espagnole, en deux groupes lâches qui courent sur Cadix par vent d’ouest : vingt-sept vaisseaux contre les quinze de Jervis. Il forme une seule ligne de file et gouverne au sud, vers l’eau libre qui les sépare.'],
      ['Le Culloden coupe la flotte en deux', 'À 11 h 30, Troubridge passe en tête. Le plus gros des deux corps espagnols serre le vent et remonte au nord le long de la ligne britannique, à contre-bord, en tirant au passage. Le plus petit est coupé, sous le vent.'],
      ['Virer par la contremarche', 'Quelques minutes après midi, Jervis signale à la ligne de virer de bord et de suivre le corps principal. Le Culloden a déjà son aperçu prêt et vire aussitôt. Chaque vaisseau derrière lui doit atteindre le même point avant de tourner.'],
      ['La division sous le vent est repoussée', 'Les vaisseaux de Moreno se dirigent vers le point de virement pour percer et rallier. Le Victory masque ses huniers et prend le Príncipe de Asturias en enfilade ; la division laisse porter.'],
      ['Nelson quitte la ligne', 'Troisième à partir de la queue, Nelson voit l’avant-garde espagnole arriver pour contourner l’arrière britannique. Sans ordre, il fait virer le Captain lof pour lof, passe entre le Diadem et l’Excellent, et jette un 74 en travers de la route de sept vaisseaux, dont un de 130 canons.'],
      ['Le Culloden arrive', 'Après une heure de chasse, Troubridge le rejoint. Le Blenheim passe entre le Captain et l’ennemi pour lui donner quelques minutes de répit. Le Captain a perdu son petit mât de hune et sa roue.'],
      ['Collingwood entre en scène', 'Jervis a fait sortir l’Excellent de la ligne à son tour. En une demi-heure, il fait amener le Salvador del Mundo et le San Ysidro, sans s’arrêter pour en prendre possession.'],
      ['Le « pont breveté »', 'L’Excellent passe à trois mètres du San Nicolás en tirant. L’Espagnol lofe et tombe sur le San Josef. Le Captain, ingouvernable, est jeté contre le San Nicolás ; Nelson l’aborde par la galerie de poupe, le prend, puis traverse son pont pour monter sur le trois-ponts qui est derrière.'],
      ['Le San Josef se rend', 'Sur le gaillard d’arrière d’un trois-ponts espagnol, Nelson reçoit les épées des officiers et les passe à son canotier William Fearney, qui les met sous son bras. La flotte appelle cela « le pont breveté de Nelson pour aborder les premiers rangs ».'],
      ['Jervis couvre ses prises', 'La Santísima Trinidad, démâtée, aurait amené lorsque la division sous le vent et deux vaisseaux frais arrivent. Jervis reforme sa ligne pour protéger quatre prises et ses éclopés, et les flottes se séparent à la tombée du jour.']
    ]
  },
  caira: {
    title: 'L’Agamemnon et le Ça Ira', days: ['13 mars 1795'],
    sides: { british: 'Britanniques', french: 'Français' }, wind: 'Vent SO, frais',
    labels: ['GOLFE  DE  GÊNES', '← la flotte française, vers Toulon', 'La flotte de Hotham en chasse →'],
    phases: [
      ['Un abordage dans la ligne française', 'Au lever du jour, le Ça Ira, de 80 canons, aborde son matelot d’avant et perd ses mâts de hune de misaine et de grand mât. Il tombe en arrière tandis que la flotte française s’éloigne vers l’ouest.'],
      ['L’Inconstant frappe le premier', 'Le capitaine Fremantle amène une frégate de 36 canons sous la hanche du gros vaisseau, tire, vire de bord et tire encore, jusqu’à ce que la batterie basse le chasse. La frégate la Vestale prend le Ça Ira en remorque.'],
      ['L’Agamemnon arrive', 'Le 64 de Nelson a distancé le reste de la flotte. Il compte ne pas tirer avant de toucher la poupe du Français, mais les canons de retraite hachent son gréement, et il ouvre le feu à cent mètres.'],
      ['Embarder, tirer, suivre', 'L’Agamemnon met la barre dessous jusqu’à ce que toute sa bordée porte sur la poupe du Français, tire, puis revient dans son sillage et se rapproche de nouveau. Le Ça Ira ne peut pointer sur lui aucun canon de ses batteries.'],
      ['Deux heures et demie', 'Le manège continue sans interruption. Le Ça Ira, « une épave complète » selon Nelson, a 110 tués et blessés. L’Agamemnon a sept blessés.'],
      ['Rappelé', 'À 13 h 15, le Sans-Culotte, de 120 canons, et le Jean-Bart laissent porter pour couvrir leur conserve, et Hotham signale à l’Agamemnon de rallier. Le lendemain matin, le Ça Ira et le Censeur, qui le remorque, sont coupés et pris.']
    ]
  },
  tenerife: {
    title: 'Santa Cruz de Ténérife', days: ['24 juillet 1797', '25 juillet 1797'],
    sides: { british: 'Britanniques', spanish: 'Espagnols' }, scale: '1 mille marin',
    labels: ['TÉNÉRIFE', 'Santa Cruz', 'le môle', 'Santo Domingo', 'forte houle', 'OCÉAN  ATLANTIQUE'],
    phases: [
      ['Mille hommes dans les canots', 'La première tentative, deux jours plus tôt, a échoué et donné l’alerte. Nelson veut maintenant aller droit sur le môle, de nuit, avec un millier de marins et de soldats de marine, les canots amarrés entre eux en six divisions, les avirons garnis.'],
      ['Découverts', 'À une heure et demie, à demi-portée de canon du môle, les canots sont aperçus. Les cloches sonnent ; une quarantaine de pièces et les mousquets de la garnison tirent ensemble. Les canots larguent leurs amarres, poussent un hourra et nagent vers la côte.'],
      ['Le môle', 'Les canots de Nelson, de Fremantle et de Bowen atteignent le môle, l’enlèvent et enclouent ses canons. La mitraille de la citadelle balaie la jetée. Bowen et son premier lieutenant sont tués.'],
      ['Nelson est touché', 'Au moment où il met pied à terre en tirant son épée, une balle lui fracasse le bras droit au-dessus du coude. Son beau-fils Josiah Nisbet lui pose un garrot et dégage le canot de la plage.'],
      ['Le Fox coule', 'Le cotre Fox, qui arrive avec 180 hommes, est touché sous la flottaison et coule aussitôt. Quatre-vingt-dix-sept se noient. Le canot de Nelson s’arrête pour repêcher des survivants.'],
      ['Troubridge débarque dans le ressac', 'La plupart des canots ont manqué le môle et sont jetés sur les rochers, au sud, poudre noyée et échelles perdues. Troubridge rassemble quelque 340 hommes et se bat de rue en rue jusqu’à la place.'],
      ['Santo Domingo', 'Le jour le trouve dans le couvent de Santo Domingo, sans poudre sèche, entouré de plusieurs milliers d’Espagnols. Il fait dire qu’il brûlera la ville si on ne le laisse pas rembarquer.'],
      ['Les conditions', 'Gutiérrez sait que c’est un bluff et accepte quand même. Les Britanniques marchent jusqu’au môle avec leurs armes et sont rembarqués, en partie dans des canots espagnols. À bord du Theseus, le bras de Nelson est déjà coupé.']
    ]
  },
  chase: {
    title: 'La longue poursuite de 1805',
    sides: { british: 'Britanniques', french: 'Flotte combinée' }, scale: '500 milles marins',
    labels: ['Toulon', 'Cadix', 'Gibraltar', 'Le Ferrol', 'C. Finisterre', 'Portsmouth', 'Ouessant', 'Madère', 'Açores', 'Martinique', 'Barbade', 'Trinité', 'Antigua', 'OCÉAN  ATLANTIQUE', 'AFRIQUE', 'FRANCE', 'ESPAGNE'],
    phases: [
      ['Villeneuve s’échappe de Toulon', 'Le 30 mars, onze vaisseaux prennent la mer alors que les frégates de Nelson ont perdu le contact. Nelson, au large de la Sardaigne, couvre les routes de la Sicile et de l’Égypte. Les Français partent de l’autre côté.'],
      ['Le détroit', 'Villeneuve passe Gibraltar le 9 avril, rallie à Cadix les vaisseaux espagnols de Gravina et s’enfonce dans l’Atlantique. Nelson ne l’apprend que neuf jours plus tard.'],
      ['Vent debout', 'Il faut trois semaines à Nelson pour descendre la Méditerranée contre des coups de vent d’ouest. « Ma bonne fortune semble s’être envolée », écrit-il. Il atteint Gibraltar avec un mois de retard.'],
      ['Dix vaisseaux derrière dix-huit', 'Enfin certain que l’ennemi est parti pour les Antilles, il le suit depuis la baie de Lagos le 11 mai. Villeneuve arrive à la Martinique trois jours plus tard et y attend des renforts.'],
      ['La Barbade, et un faux renseignement', 'Nelson arrive le 4 juin : il a gagné dix jours sur la traversée. Le rapport d’un général britannique l’envoie au sud, à la Trinité, où il n’y a rien. Villeneuve est à trois cents milles au nord.'],
      ['Villeneuve entend le nom', 'Au large d’Antigua, la flotte combinée prend un convoi de sucre et apprend par ses prisonniers que Nelson est là. Deux jours plus tard, elle fait route vers l’Europe.'],
      ['Le retour', 'Nelson atteint Antigua le 12, devine le reste et appareille le lendemain. Il envoie en avant le brick Curieux avec ses dépêches. Celui-ci aperçoit la flotte combinée en plein océan et relève sa route.'],
      ['L’Amirauté réagit', 'La nouvelle du Curieux parvient à Lord Barham le 9 juillet. En quelques heures, l’escadre de Calder reçoit l’ordre de croiser au large du cap Finisterre, sur la route de Villeneuve.'],
      ['À terre à Gibraltar', 'Nelson mouille le 19 juillet sans avoir vu l’ennemi et, le lendemain, met pied à terre pour la première fois depuis deux ans, à dix jours près.'],
      ['Le combat de Calder', 'Dans la brume, au large du Finisterre, le 22 juillet, les quinze vaisseaux de Calder rencontrent les vingt de Villeneuve et prennent deux Espagnols. Il ne reprend pas le combat et passe en conseil de guerre.'],
      ['Vigo, Le Ferrol, Cadix', 'Villeneuve relâche à Vigo, puis au Ferrol. Il appareille le 13 août avec ordre de gagner la Manche, vire au sud, et entre à Cadix le 20. Nelson, par Ouessant, est arrivé à Portsmouth deux jours plus tôt.']
    ]
  }
};
