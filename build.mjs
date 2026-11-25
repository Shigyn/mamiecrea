// Mamie Créa — aperçu LocWeb. Génère index.html et une page par création (article/<slug>/),
// aux mêmes adresses que la boutique SumUp actuelle. Paiement : bouton « Commander » vers SumUp.
//   node build.mjs
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1');
const P = JSON.parse(fs.readFileSync(path.join(ICI, '_source', 'produits.json'), 'utf8'));

// Aujourd'hui la boutique SumUp répond sur mamiecrea.fr. Quand le nouveau site prendra le domaine,
// la boutique restera sur son adresse SumUp : remplacer par 'https://mamie-crea-62.sumupstore.com/article/'.
const BOUTIQUE = 'https://mamiecrea.fr/article/';
const TEL = '06 29 34 30 54', TEL_LIEN = '+33629343054', WA = 'https://wa.me/33629343054';
const FB = 'https://www.facebook.com/profile.php?id=61575737036183', IG = 'https://www.instagram.com/mamiecrea62/';
const V = '3';

const RUBRIQUES = {
  doudous: 'Doudous & éveil', bain: 'Bain & toilette', nuit: 'Nuit & change', sacs: 'Sacs',
  bapteme: 'Baptême', livrets: 'Livrets & carnets', cadeaux: 'Cadeaux',
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
  fil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20c4-1 6-5 8-8s4-6 8-7"/><circle cx="19.5" cy="5" r="1.5"/></svg>',
};

function page({ titre, description, racine, corps, ld = [] }) {
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
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Grandstander:wght@600;700&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${racine}style.css?v=${V}">
${ld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<header class="tete" data-tete>
  <a class="logo" href="${racine}" aria-label="Mamie Créa, accueil"><img src="${racine}photos/logo.webp" alt="Mamie Créa" width="612" height="408"></a>
  <nav class="menu" data-menu aria-label="Menu">
    <a href="${racine}#creations">Créations</a>
    <a href="${racine}#personnaliser">Personnaliser</a>
    <a href="${racine}#histoire">Mon histoire</a>
    <a href="${racine}#avis">Avis</a>
    <a href="${racine}#contact">Contact</a>
  </nav>
  <a class="bouton bouton-petit tete-wa" href="${WA}" rel="noopener">${ICONES.wa}<span>Me contacter</span></a>
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
      <a href="${racine}#personnaliser">Comment commander</a>
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
<a class="flottant" href="${WA}" rel="noopener" aria-label="Écrire à Mamie Créa sur WhatsApp">${ICONES.wa}</a>
<script src="${racine}app.js?v=${V}" defer></script>
</body>
</html>
`;
}

const carte = (p, racine) => `
    <article class="carte" data-rubrique="${p.rubrique}" data-prix="${p.prix}">
      <a class="carte-photo" href="${racine}article/${p.slug}/"><img src="${racine}photos/${p.photos[0]}" alt="${esc(p.nom)}, Mamie Créa" loading="lazy"></a>
      <div class="carte-corps">
        <p class="carte-rubrique">${RUBRIQUES[p.rubrique]}</p>
        <h3><a href="${racine}article/${p.slug}/">${esc(p.nom)}</a></h3>
        <p class="carte-prix">${p.ancien ? `<s>${prix(p.ancien)}</s> ` : ''}${prix(p.prix)}</p>
      </div>
    </article>`;

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
  corps: `
<section class="hero">
  <div class="hero-texte">
    <p class="surtitre">Fait main à Vendin-lès-Béthune</p>
    <h1>Des créations brodées <span class="main">au prénom</span> de votre enfant</h1>
    <p class="hero-chapo">Doudous, protège carnets de santé, gigoteuses, sacs de crèche, coffrets de naissance : chaque pièce est cousue et brodée à la main, comme si c’était pour mon propre enfant.</p>
    <div class="actions">
      <a class="bouton" href="#creations">Voir les créations</a>
      <a class="bouton bouton-clair" href="${WA}" rel="noopener">Une idée en tête ? Écrivez-moi</a>
    </div>
    <ul class="promesses">
      <li>Fait main, pièce par pièce</li>
      <li>Prénom, couleurs, motif au choix</li>
      <li>Paiement sécurisé</li>
    </ul>
  </div>
  <figure class="hero-photo">
    <img src="photos/hero.webp" alt="Ensemble bavoir, attache-tétine et couverture brodés au prénom Alya" width="1600" height="1245">
    <figcaption>Ensemble naissance brodé pour Alya</figcaption>
  </figure>
</section>

<a class="bandeau-noel" href="article/${lutin.slug}/">
  <img src="photos/${lutin.photos[0]}" alt="" loading="lazy">
  <span><b>Noël approche</b> Le lutin farceur arrive avec sa carte de bienvenue gravée, ${prix(lutin.prix)}.</span>
  <span class="fleche" aria-hidden="true">→</span>
</a>

<section class="creations" id="creations">
  <div class="titre-section">
    <h2>Les créations</h2>
    <p>${P.length} créations à personnaliser. Cliquez sur une création pour voir les photos et commander.</p>
  </div>
  <div class="filtres" role="toolbar" aria-label="Filtrer les créations" data-filtres>
    <button type="button" class="pastille actif" data-filtre="tout" aria-pressed="true">Tout voir</button>
    ${Object.entries(RUBRIQUES).filter(([k]) => P.some((p) => p.rubrique === k)).map(([k, v]) => `<button type="button" class="pastille" data-filtre="${k}" aria-pressed="false">${v}</button>`).join('\n    ')}
    <button type="button" class="pastille" data-filtre="petits" aria-pressed="false">Moins de 15 €</button>
  </div>
  <div class="grille" data-grille>${P.map((p) => carte(p, './')).join('')}
  </div>
</section>

<section class="etapes" id="personnaliser">
  <div class="titre-section">
    <h2>Comment commander</h2>
    <p>Une création personnalisée, c’est simple, et je réponds à toutes vos questions avant de coudre.</p>
  </div>
  <ol class="etapes-liste">
    <li><span class="etape-num">1</span><h3>Choisissez votre création</h3><p>Parcourez les créations et ouvrez celle qui vous plaît pour voir toutes les photos.</p></li>
    <li><span class="etape-num">2</span><h3>Indiquez le prénom</h3><p>Au moment de commander, précisez le prénom, les couleurs ou le motif souhaités.</p></li>
    <li><span class="etape-num">3</span><h3>Je couds et je brode</h3><p>Votre création est réalisée à la main. Retrait ou envoi : les options s’affichent au moment du paiement.</p></li>
  </ol>
  <p class="etapes-note">Un modèle qui n’est pas sur le site, une couleur particulière, un cadeau à composer ? <a href="${WA}" rel="noopener">Écrivez-moi sur WhatsApp</a>, on en parle.</p>
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
  <p class="avis-note">Vous avez offert une création Mamie Créa ? Votre avis sur Google m’aide énormément.</p>
</section>

<section class="contact" id="contact">
  <div class="titre-section">
    <h2>Me contacter</h2>
    <p>Pour une question, une commande sur mesure ou pour me retrouver sur les marchés et réderies de la région.</p>
  </div>
  <div class="contact-liens">
    <a class="contact-lien" href="${WA}" rel="noopener">${ICONES.wa}<span><small>WhatsApp</small>Écrire un message</span></a>
    <a class="contact-lien" href="tel:${TEL_LIEN}">${ICONES.tel}<span><small>Téléphone</small>${TEL}</span></a>
    <a class="contact-lien" href="${FB}" rel="noopener">${ICONES.fb}<span><small>Facebook</small>Mamie Créa</span></a>
    <a class="contact-lien" href="${IG}" rel="noopener">${ICONES.ig}<span><small>Instagram</small>@mamiecrea62</span></a>
  </div>
  <p class="contact-lieu">Vendin-lès-Béthune, Pas-de-Calais (62)</p>
</section>`,
});

/* ---------- une page par création ---------- */
const pages = [['index.html', accueil]];
for (const p of P) {
  const autres = P.filter((x) => x.rubrique === p.rubrique && x.slug !== p.slug).concat(P.filter((x) => x.rubrique !== p.rubrique)).slice(0, 4);
  const description = p.texte[0].slice(0, 155);
  pages.push([`article/${p.slug}/index.html`, page({
    titre: `${p.nom} — Mamie Créa`,
    description,
    racine: '../../',
    ld: [{
      '@context': 'https://schema.org', '@type': 'Product', name: p.titre, description: p.texte.join(' '),
      image: p.photos.map((f) => `../../photos/${f}`), brand: { '@type': 'Brand', name: 'Mamie Créa' },
      offers: { '@type': 'Offer', price: p.prix.toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: BOUTIQUE + p.slug },
    }, {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Créations', item: '../../#creations' },
        { '@type': 'ListItem', position: 2, name: p.nom },
      ],
    }],
    corps: `
<nav class="fil" aria-label="Fil d’Ariane"><a href="../../#creations">Créations</a> <span aria-hidden="true">›</span> ${RUBRIQUES[p.rubrique]}</nav>
<section class="fiche">
  <div class="fiche-photos" data-galerie>
    <figure class="fiche-grande"><img src="../../photos/${p.photos[0]}" alt="${esc(p.nom)}" data-grande></figure>
    ${p.photos.length > 1 ? `<div class="fiche-vignettes">${p.photos.map((f, i) => `<button type="button" class="vignette${i ? '' : ' actif'}" data-photo="../../photos/${f}" aria-label="Photo ${i + 1}"><img src="../../photos/${f}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
  </div>
  <div class="fiche-texte">
    <p class="carte-rubrique">${RUBRIQUES[p.rubrique]}</p>
    <h1>${esc(p.nom)}</h1>
    <p class="fiche-prix">${p.ancien ? `<s>${prix(p.ancien)}</s> ` : ''}${prix(p.prix)}</p>
    <div class="actions">
      <a class="bouton" href="${BOUTIQUE}${p.slug}" rel="noopener">Commander</a>
      <a class="bouton bouton-clair" href="${WA}?text=${encodeURIComponent(`Bonjour, une question sur : ${p.nom}`)}" rel="noopener">${ICONES.wa}<span>Poser une question</span></a>
    </div>
    <p class="fiche-paiement">Prénom et couleurs se précisent au moment de commander. Paiement sécurisé par SumUp.</p>
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
fs.writeFileSync(path.join(ICI, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(pages.length, 'pages');
