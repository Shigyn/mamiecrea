// Mamie Créa — aperçu LocWeb. Génère index.html et une page par création (article/<slug>/),
// aux mêmes adresses que la boutique SumUp actuelle.
// Commande : on choisit taille, tissus (en photo) et prénom sur le site, puis on paie le panier sur la page
// SumUp de Mamie Créa (à brancher sur son compte SumUp à la livraison ; dans l'aperçu, le bouton Payer l'explique).
//   node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const dessinerChaine = createRequire(import.meta.url)('./chaine.js');

const ICI = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');
const P = JSON.parse(fs.readFileSync(path.join(ICI, '_source', 'produits.json'), 'utf8'));
const TISSUS = JSON.parse(fs.readFileSync(path.join(ICI, '_source', 'tissus.json'), 'utf8'));

const TEL = '06 29 34 30 54', TEL_LIEN = '+33629343054', WA = 'https://wa.me/33629343054';
const FB = 'https://www.facebook.com/profile.php?id=61575737036183', IG = 'https://www.instagram.com/mamiecrea62/';
const V = '9';

const RUBRIQUES = {
  attaches: ['Attaches-tétines', 'peche'],
  doudous: ['Doudous & éveil', 'rose'], bain: ['Bain & toilette', 'ciel'], nuit: ['Nuit & change', 'lilas'],
  sacs: ['Sacs', 'menthe'], bapteme: ['Baptême', 'citron'], livrets: ['Livrets & carnets', 'peche'], cadeaux: ['Cadeaux', 'rose'],
};

// Ce qu'on choisit pour chaque création (repris des options de sa boutique SumUp, en clair).
const CHOIX = {
  'peignoir-enfant': { variantes: ['1 mois – 6 ans', '7 – 14 ans'], titreVariante: 'Taille', prenom: true },
  'protege-livrets-de-famille': { variantes: ['1 livret', '2 livrets', '3 livrets', '4 livrets'], titreVariante: 'Nombre de livrets', tissus: 2, prenom: 'Prénoms à broder' },
  'chouchou': { tissus: 1 },
  'gigoteuse-bebe': { variantes: ['0 – 6 mois', '6 – 12 mois', '12 – 18 mois', '18 – 24 mois'], titreVariante: 'Taille', tissus: 2, prenom: true },
  'gigoteuse': { variantes: ['Loup', 'Lion'], titreVariante: 'Modèle', prenom: true },
  'lot-de-8': { variantes: ['Savane', 'Savane 2', 'Loup', 'Loutre', 'Lapin', 'Gecko'], titreVariante: 'Motif' },
  'lutin-farceur': {},
  'culbuto': { tissus: 2 },
  'coffret-cadeau': { tissus: 2, prenom: true },
  'chale-de-bapteme': { prenom: 'Prénom et date à broder' },
  'etole-de-bapteme': { prenom: 'Prénom et date à broder' },
  'serviette-a-main': { prenom: true },
  'oreiller-en-forme': { tissus: 2 },
};
const choixDe = (slug) => {
  const k = Object.keys(CHOIX).filter((x) => slug.startsWith(x)).sort((a, b) => b.length - a.length)[0];
  return k ? CHOIX[k] : { tissus: 2, prenom: true };
};

const AVIS = [
  ['Camille L.', 'Si vous cherchez une créatrice d’objets personnalisés dans le coin, je vous recommande Mamie Créa. Une personne à l’écoute de vos besoins, avec du choix et de très bons conseils.'],
  ['Nathalie M.', 'Personne très à l’écoute. Vous conseille également quand vous avez un doute. Très bon travail, je vous la recommande pour vos projets à venir. Et d’une gentillesse…'],
  ['Juhstyne T.', 'Merci beaucoup pour votre réactivité et votre rapidité pour ce beau petit sac, je l’adore : pratique et grand, parfait.'],
  ['Eugénie P.', 'Merci à Mamie Créa pour ce bel attache-tétine. N’hésitez pas à visiter la page, de très jolies créations.'],
  ['Anaïs L.', 'Je recommande à 100 % !'],
];

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const prix = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',')) + ' €';

function texte(lignes) {
  const [chapo, ...reste] = lignes;
  let h = `<p class="fiche-chapo">${esc(chapo)}</p>`, liste = [];
  const vider = () => { if (liste.length) { h += `<ul class="points">${liste.join('')}</ul>`; liste = []; } };
  for (const l of reste) {
    const m = l.match(/^([^:]{3,40}) : (.+)$/);
    if (m) liste.push(`<li><b>${esc(m[1])}</b> : ${esc(m[2])}</li>`);
    else if (l.length < 70 && !/[.!:]$/.test(l)) liste.push(`<li>${esc(l)}</li>`);
    else { vider(); h += `<p>${esc(l)}</p>`; }
  }
  vider();
  return h;
}

const ICONES = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M8.8 8.2c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6a6 6 0 0 0 2.9 2.6c.2.1.4 0 .5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.3.3.3.5 0 .9-.7 1.8-1.6 1.9-1 .2-2.4-.1-4.2-1.4a10 10 0 0 1-3-3.4c-.6-1.2-.6-2.3-.2-3.1z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5h3l1.5 4.2-2 1.3a11 11 0 0 0 5.9 5.9l1.3-2 4.2 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h2.5V4.5H14c-2.2 0-3.8 1.7-3.8 3.9V10H8v3.5h2.2V21h3.5v-7.5h2.6l.5-3.5h-3.1V8.6c0-.4.2-.6.6-.6z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8"/></svg>',
  panier: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
};

// Données pour la fenêtre de choix et le panier (app.js).
const DONNEES = JSON.stringify({
  wa: WA,
  tissus: TISSUS,
  produits: P.map((p) => ({ slug: p.slug, nom: p.nom, prix: p.prix, photo: p.photos[0], ...choixDe(p.slug) })),
}).replace(/</g, '\\u003c');

function page({ titre, description, racine, corps, ld = [], scripts = [] }) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titre)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="${esc(titre)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${racine}photos/hero.webp">
<link rel="icon" href="${racine}photos/logo.webp">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Grandstander:wght@600;700&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=Pacifico&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${racine}style.css?v=${V}">
${ld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body data-racine="${racine}">
<header class="tete" data-tete>
  <a class="logo" href="${racine}" aria-label="Mamie Créa, accueil"><img src="${racine}photos/logo.webp" alt="Mamie Créa" width="612" height="408"></a>
  <nav class="menu" data-menu aria-label="Menu">
    <a href="${racine}#creations">Créations</a>
    <a href="${racine}#tissus">Les tissus</a>
    <a href="${racine}#commander">Comment commander</a>
    <a href="${racine}#histoire">Mon histoire</a>
    <a href="${racine}#contact">Contact</a>
  </nav>
  <button type="button" class="bouton-panier" data-ouvrir-panier aria-label="Voir mon panier">${ICONES.panier}<span class="pastille-nb" data-nb hidden>0</span></button>
  <button class="burger" data-burger aria-label="Ouvrir le menu" aria-expanded="false"><span></span></button>
</header>
<main>
${corps}
</main>
<footer class="pied">
  <div class="pied-haut">
    <div>
      <p class="pied-nom">Mamie Créa</p>
      <p>Créations faites main pour bébés et enfants, brodées au prénom.<br>Vendin-lès-Béthune, Pas-de-Calais.</p>
    </div>
    <nav aria-label="Liens">
      <a href="${racine}#creations">Les créations</a>
      <a href="${racine}#tissus">Les tissus</a>
      <a href="${racine}#contact">Contact</a>
    </nav>
    <div class="pied-reseaux">
      <a href="${FB}" rel="noopener" aria-label="Facebook">${ICONES.fb}</a>
      <a href="${IG}" rel="noopener" aria-label="Instagram">${ICONES.ig}</a>
      <a href="tel:${TEL_LIEN}" aria-label="Téléphone">${ICONES.tel}</a>
    </div>
  </div>
  <p class="pied-bas">© 2026 Mamie Créa · Paiement sécurisé par SumUp</p>
</footer>

<button type="button" class="panier-flottant" data-ouvrir-panier hidden>${ICONES.panier}<span data-panier-resume>Mon panier</span></button>
<a class="flottant" href="${WA}" rel="noopener" aria-label="Écrire à Mamie Créa sur WhatsApp" data-wa-flottant>${ICONES.wa}</a>

<dialog class="fenetre" data-fenetre aria-labelledby="fenetre-titre"></dialog>
<dialog class="fenetre fenetre-panier" data-panier aria-labelledby="panier-titre"></dialog>
<script type="application/json" id="donnees">${DONNEES}</script>
${scripts.map((f) => `<script src="${racine}${f}?v=${V}" defer></script>`).join('')}<script src="${racine}app.js?v=${V}" defer></script>
</body>
</html>
`;
}

const carte = (p, racine) => {
  const [rub, teinte] = RUBRIQUES[p.rubrique];
  return `
    <article class="carte teinte-${teinte}" data-rubrique="${p.rubrique}" data-prix="${p.prix}">
      <a class="carte-photo" href="${racine}article/${p.slug}/"><img src="${racine}photos/${p.photos[0]}" alt="${esc(p.nom)}, Mamie Créa" loading="lazy"></a>
      <div class="carte-corps">
        <p class="carte-rubrique">${rub}</p>
        <h3><a href="${racine}article/${p.slug}/">${esc(p.nom)}</a></h3>
        <div class="carte-bas">
          <p class="carte-prix">${p.ancien ? `<s>${prix(p.ancien)}</s> ` : ''}${prix(p.prix)}</p>
          <button type="button" class="bouton bouton-petit" data-choisir="${p.slug}">Choisir</button>
        </div>
      </div>
    </article>`;
};

const ldMagasin = {
  '@context': 'https://schema.org', '@type': 'Store', name: 'Mamie Créa',
  description: 'Créations faites main pour bébés et enfants, personnalisées et brodées au prénom : doudous, protège carnets de santé, gigoteuses, sacs de crèche, coffrets naissance.',
  telephone: TEL_LIEN, image: 'photos/hero.webp',
  address: { '@type': 'PostalAddress', addressLocality: 'Vendin-lès-Béthune', postalCode: '62232', addressRegion: 'Pas-de-Calais', addressCountry: 'FR' },
  sameAs: [FB, IG],
};

/* ---------- accueil ---------- */
const lutin = P.find((p) => p.slug.startsWith('lutin'));
const accueil = page({
  titre: 'Mamie Créa — créations bébé personnalisées, brodées au prénom',
  description: 'Doudous, protège carnets de santé, gigoteuses, sacs de crèche et coffrets naissance faits main et brodés au prénom, à Vendin-lès-Béthune (62).',
  racine: './',
  ld: [ldMagasin],
  scripts: ['chaine.js', 'atelier.js'],
  corps: `
<section class="hero">
  <div class="hero-texte">
    <p class="surtitre">Fait main à Vendin-lès-Béthune</p>
    <h1>Des créations brodées <span class="main">au prénom</span> de votre enfant</h1>
    <p class="hero-chapo">Attaches-tétines, doudous, protège carnets de santé, gigoteuses, sacs de crèche, coffrets de naissance : vous choisissez la création, le tissu et le prénom, je couds et je brode.</p>
    <div class="actions">
      <a class="bouton" href="#creations">Voir les créations</a>
      <a class="bouton bouton-clair" href="#tissus">Voir les tissus</a>
    </div>
  </div>
  <figure class="hero-photo">
    <img src="photos/hero.webp" alt="Ensemble bavoir, attache-tétine et couverture brodés au prénom Alya" width="1600" height="1245">
    <figcaption>Ensemble naissance pour Alya</figcaption>
  </figure>
</section>

<a class="bandeau-noel" href="article/${lutin.slug}/">
  <img src="photos/${lutin.photos[0]}" alt="" loading="lazy">
  <span><b>Noël approche</b> Le lutin farceur arrive avec sa carte de bienvenue gravée, ${prix(lutin.prix)}.</span>
  <span class="fleche" aria-hidden="true">→</span>
</a>


<section class="atelier" id="atelier" data-atelier>
  <div class="titre-section">
    <h2>Composez votre attache-tétine</h2>
    <p>Choisissez l’attache, vos perles une par une et le prénom : votre attache-tétine se dessine sous vos yeux.</p>
  </div>
  <p class="demo-bandeau"><b>Démonstration</b> Les perles et les attaches ci-dessous sont des exemples. Les vraies perles de Mamie Créa, en photo, arrivent très bientôt.</p>
  <div class="atelier-grille">
    <div class="atelier-apercu">
      <div class="apercu-chaine" data-apercu-chaine></div>
      <p class="atelier-compte" data-compte></p>
      <div class="atelier-outils">
        <button type="button" class="pastille" data-annuler>Retirer la dernière perle</button>
        <button type="button" class="pastille" data-effacer>Tout effacer</button>
        <button type="button" class="pastille pastille-rose" data-exemple>Voir un exemple</button>
      </div>
    </div>
    <div class="atelier-etapes">
      <fieldset>
        <legend><span class="etape-mini">1</span> L’attache</legend>
        <div class="attaches">
          ${[['bois', 'Bois'], ['silicone', 'Silicone'], ['metal', 'Métal']].map(([k, n], i) => `<button type="button" class="attache${i ? '' : ' actif'}" data-attache="${k}" aria-pressed="${!i}"><span class="photo-a-venir"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><small>Photo à venir</small></span><b>${n}</b></button>`).join('')}
        </div>
      </fieldset>
      <fieldset>
        <legend><span class="etape-mini">2</span> Les perles <small>touchez une perle pour l’ajouter</small></legend>
        <div class="choix-pastilles formes">
          ${[['ronde', 'Rondes'], ['hexagone', 'Hexagones'], ['lentille', 'Lentilles'], ['bois', 'Bois']].map(([k, n], i) => `<button type="button" class="pastille${i ? '' : ' actif'}" data-forme="${k}" aria-pressed="${!i}">${n}</button>`).join('')}
        </div>
        <div class="nuancier" data-nuancier></div>
      </fieldset>
      <label class="champ">
        <span><span class="etape-mini">3</span> Le prénom en perles-lettres <small>10 lettres au plus</small></span>
        <input name="prenom-perles" maxlength="10" autocomplete="off" placeholder="Ex. : Alya">
      </label>
      <div class="atelier-bas">
        <p class="carte-prix-venir">Prix à venir</p>
        <button type="button" class="bouton bouton-grand" data-commander-atelier>Ajouter au panier</button>
      </div>
      <p class="note-apercu" data-note-atelier hidden><b>Aperçu :</b> dès que Sandra aura envoyé ses perles et ses prix, ce bouton ajoutera votre attache-tétine au panier, avec sa composition perle par perle.</p>
    </div>
  </div>
  <div class="a-venir">
    <h3>Les perles de Mamie Créa</h3>
    <div class="a-venir-grille">
      ${['Perles rondes', 'Hexagones', 'Lentilles', 'Perles en bois', 'Perles-lettres', 'Motifs : cœurs, étoiles…', 'Attaches', 'Attaches-tétines réalisées'].map((n) => `<figure class="photo-a-venir"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><figcaption>${n}<small>Photo à venir</small></figcaption></figure>`).join('')}
    </div>
  </div>
</section>

<section class="creations" id="creations">
  <div class="titre-section">
    <h2>Les créations</h2>
    <p>Appuyez sur « Choisir » : taille, tissu et prénom en quelques secondes.</p>
  </div>
  <div class="filtres" role="toolbar" aria-label="Filtrer les créations" data-filtres>
    <button type="button" class="pastille actif" data-filtre="tout" aria-pressed="true">Tout voir</button>
    ${Object.entries(RUBRIQUES).filter(([k]) => P.some((p) => p.rubrique === k)).map(([k, [v, t]]) => `<button type="button" class="pastille pastille-${t}" data-filtre="${k}" aria-pressed="false">${v}</button>`).join('\n    ')}
    <button type="button" class="pastille pastille-citron" data-filtre="petits" aria-pressed="false">Moins de 15 €</button>
  </div>
  <div class="grille" data-grille>
    <article class="carte teinte-peche" data-rubrique="attaches" data-prix="NaN">
      <a class="carte-photo carte-a-venir" href="#atelier"><img src="photos/attache-exemple.svg" alt="Illustration d’une attache-tétine personnalisée" loading="lazy"><span class="etiquette-venir">Photo à venir</span></a>
      <div class="carte-corps">
        <p class="carte-rubrique">Attaches-tétines</p>
        <h3><a href="#atelier">Attache-tétine à composer</a></h3>
        <div class="carte-bas">
          <p class="carte-prix carte-prix-venir">Prix à venir</p>
          <a class="bouton bouton-petit" href="#atelier">Composer</a>
        </div>
      </div>
    </article>${P.map((p) => carte(p, './')).join('')}
  </div>
</section>

<section class="tissus" id="tissus">
  <div class="titre-section">
    <h2>Les tissus</h2>
    <p>${TISSUS.length} tissus au choix pour vos créations : fleuris, animaux, véhicules, unis… Vous les retrouvez en photo au moment de choisir. Le choix peut varier selon les stocks.</p>
  </div>
  <div class="tissus-ruban">
    ${TISSUS.map((t) => `<figure><img src="photos/tissus/${t.img}" alt="Tissu n°${t.n}" loading="lazy" width="220" height="220"><figcaption>n°${t.n}</figcaption></figure>`).join('\n    ')}
  </div>
</section>

<section class="etapes" id="commander">
  <div class="titre-section">
    <h2>Comment commander</h2>
    <p>Pas de compte à créer : vous choisissez, vous payez, c’est parti.</p>
  </div>
  <ol class="etapes-liste">
    <li><span class="etape-num">1</span><h3>Choisissez</h3><p>La création, la taille, un ou deux tissus en photo, et le prénom à broder.</p></li>
    <li><span class="etape-num">2</span><h3>Payez en ligne</h3><p>Paiement sécurisé par carte sur la page SumUp de Mamie Créa. Retrait à Vendin ou envoi par la Poste.</p></li>
    <li><span class="etape-num">3</span><h3>Je couds et je brode</h3><p>Je reçois votre commande avec le tissu et le prénom, et je vous préviens quand elle est prête ou envoyée.</p></li>
  </ol>
</section>

<section class="histoire" id="histoire">
  <figure class="histoire-image"><img src="photos/logo.webp" alt="Illustration de Sandra, Mamie Créa, en train de coudre" loading="lazy" width="612" height="408"></figure>
  <div class="histoire-texte">
    <p class="surtitre">Mon histoire</p>
    <h2>Tout a commencé pour ma famille</h2>
    <p>Depuis plus de deux ans, je crée des articles pour enfants. Au début, c’était pour les bébés qui m’entouraient : des doudous, des petits cadeaux, des accessoires. Les compliments et les demandes se sont multipliés, alors j’ai ouvert Mamie Créa pour partager mes créations avec vous.</p>
    <p>Quand je personnalise un article, je le réalise comme si c’était pour moi, avec le même soin et les mêmes exigences : le choix des couleurs, la broderie du prénom, les finitions.</p>
    <p class="signature">Sandra, alias Mamie Créa</p>
  </div>
</section>

<section class="avis" id="avis">
  <div class="titre-section">
    <h2>Elles en parlent</h2>
    <p>Quelques mots laissés par des clientes sur Facebook.</p>
  </div>
  <div class="avis-grille">
    ${AVIS.map(([n, t]) => `<figure class="avis-carte"><blockquote>${esc(t)}</blockquote><figcaption>${esc(n)}</figcaption></figure>`).join('\n    ')}
  </div>
</section>

<section class="contact" id="contact">
  <div class="titre-section">
    <h2>Me contacter</h2>
    <p>Pour une question, une création sur mesure, ou pour me retrouver sur les marchés et réderies de la région.</p>
  </div>
  <div class="contact-liens">
    <a class="contact-lien teinte-menthe" href="${WA}" rel="noopener">${ICONES.wa}<span><small>WhatsApp</small>Écrire un message</span></a>
    <a class="contact-lien teinte-rose" href="tel:${TEL_LIEN}">${ICONES.tel}<span><small>Téléphone</small>${TEL}</span></a>
    <a class="contact-lien teinte-ciel" href="${FB}" rel="noopener">${ICONES.fb}<span><small>Facebook</small>Mamie Créa</span></a>
    <a class="contact-lien teinte-lilas" href="${IG}" rel="noopener">${ICONES.ig}<span><small>Instagram</small>@mamiecrea62</span></a>
  </div>
  <p class="contact-lieu">Vendin-lès-Béthune, Pas-de-Calais (62)</p>
</section>`,
});

/* ---------- une page par création ---------- */
const pages = [['index.html', accueil]];
for (const p of P) {
  const autres = P.filter((x) => x.rubrique === p.rubrique && x.slug !== p.slug).concat(P.filter((x) => x.rubrique !== p.rubrique)).slice(0, 4);
  const [rub, teinte] = RUBRIQUES[p.rubrique];
  pages.push([`article/${p.slug}/index.html`, page({
    titre: `${p.nom} — Mamie Créa`,
    description: p.texte[0].slice(0, 155),
    racine: '../../',
    ld: [{
      '@context': 'https://schema.org', '@type': 'Product', name: p.titre, description: p.texte.join(' '),
      image: p.photos.map((f) => `../../photos/${f}`), brand: { '@type': 'Brand', name: 'Mamie Créa' },
      offers: { '@type': 'Offer', price: p.prix.toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    }, {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Créations', item: '../../#creations' },
        { '@type': 'ListItem', position: 2, name: p.nom },
      ],
    }],
    corps: `
<nav class="fil" aria-label="Fil d’Ariane"><a href="../../#creations">Créations</a> <span aria-hidden="true">›</span> ${rub}</nav>
<section class="fiche">
  <div class="fiche-photos teinte-${teinte}" data-galerie>
    <figure class="fiche-grande"><img src="../../photos/${p.photos[0]}" alt="${esc(p.nom)}" data-grande></figure>
    ${p.photos.length > 1 ? `<div class="fiche-vignettes">${p.photos.map((f, i) => `<button type="button" class="vignette${i ? '' : ' actif'}" data-photo="../../photos/${f}" aria-label="Photo ${i + 1}"><img src="../../photos/${f}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
  </div>
  <div class="fiche-texte">
    <p class="carte-rubrique">${rub}</p>
    <h1>${esc(p.nom)}</h1>
    <p class="fiche-prix">${p.ancien ? `<s>${prix(p.ancien)}</s> ` : ''}${prix(p.prix)}</p>
    <button type="button" class="bouton bouton-grand" data-choisir="${p.slug}">Choisir et ajouter au panier</button>
    <p class="fiche-paiement">Taille, tissu et prénom se choisissent à l’étape suivante. Paiement sécurisé par carte avec SumUp.</p>
    <div class="fiche-description">${texte(p.texte)}</div>
  </div>
</section>
<section class="creations creations-autres">
  <div class="titre-section"><h2>Vous aimerez aussi</h2></div>
  <div class="grille">${autres.map((x) => carte(x, '../../')).join('')}
  </div>
</section>`,
  })]);
}

fs.rmSync(path.join(ICI, 'article'), { recursive: true, force: true });
for (const [f, html] of pages) {
  fs.mkdirSync(path.dirname(path.join(ICI, f)), { recursive: true });
  fs.writeFileSync(path.join(ICI, f), html);
}
{
  const ch = dessinerChaine({ attache: 'bois', prenom: 'Alya', perles: [['ronde', '#f2b8c6'], ['hexagone', '#c9b3ef'], ['bois'], ['lentille', '#e0498a'], ['ronde', '#ffffff'], ['hexagone', '#c9b3ef']].map(([forme, couleur]) => ({ forme, couleur })) });
  const vb = ch.match(/viewBox="0 0 (\d+(?:\.\d+)?) 80"/)[1];
  const h = 360 * 80 / vb;
  fs.writeFileSync(path.join(ICI, 'photos', 'attache-exemple.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#ffe9dc"/><circle cx="70" cy="80" r="6" fill="#fff"/><circle cx="330" cy="320" r="9" fill="#f2b8c6"/><circle cx="345" cy="70" r="5" fill="#c9b3ef"/>` +
    ch.replace('<svg xmlns="http://www.w3.org/2000/svg"', `<svg x="20" y="${(400 - h) / 2}" width="360" height="${h}"`) + '</svg>');
}
fs.writeFileSync(path.join(ICI, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(pages.length, 'pages');
