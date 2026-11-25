/* Mamie Créa — aperçu LocWeb : menu, filtres, galerie, fenêtre de choix (taille, tissus, prénom),
   panier gardé dans le navigateur, envoi de la commande à Sandra sur WhatsApp. */
(function () {
  document.documentElement.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var D = JSON.parse($('#donnees').textContent);
  var R = document.body.getAttribute('data-racine') || './';
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var euros = function (n) { return (Math.round(n * 100) % 100 ? n.toFixed(2).replace('.', ',') : String(Math.round(n))) + ' €'; };
  var produit = function (slug) { return D.produits.filter(function (p) { return p.slug === slug; })[0]; };

  /* ---------- menu, filtres, galerie ---------- */
  var tete = $('[data-tete]'), burger = $('[data-burger]'), menu = $('[data-menu]');
  addEventListener('scroll', function () { tete.classList.toggle('colle', scrollY > 8); }, { passive: true });
  burger.addEventListener('click', function () { var o = menu.classList.toggle('ouvert'); burger.setAttribute('aria-expanded', o); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('ouvert'); burger.setAttribute('aria-expanded', 'false'); }); });

  var filtres = $('[data-filtres]');
  if (filtres) filtres.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filtre]'); if (!b) return;
    var f = b.getAttribute('data-filtre');
    $$('[data-filtre]', filtres).forEach(function (x) { x.classList.toggle('actif', x === b); x.setAttribute('aria-pressed', x === b); });
    $$('[data-grille] .carte').forEach(function (c) {
      c.hidden = !(f === 'tout' || (f === 'petits' ? +c.getAttribute('data-prix') < 15 : c.getAttribute('data-rubrique') === f));
    });
  });

  var grande = $('[data-grande]');
  $$('[data-photo]').forEach(function (v) {
    v.addEventListener('click', function () {
      grande.src = v.getAttribute('data-photo');
      $$('[data-photo]').forEach(function (x) { x.classList.toggle('actif', x === v); });
    });
  });

  /* ---------- panier (gardé dans ce navigateur) ---------- */
  var CLE = 'mamiecrea-panier', panier = [];
  try { panier = JSON.parse(localStorage.getItem(CLE)) || []; } catch (e) { panier = []; }
  function garder() { try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) {} majResume(); }
  function total() { return panier.reduce(function (s, l) { return s + l.prix * l.qte; }, 0); }
  function nb() { return panier.reduce(function (s, l) { return s + l.qte; }, 0); }
  function majResume() {
    var n = nb();
    $$('[data-nb]').forEach(function (b) { b.hidden = !n; b.textContent = n; });
    var f = $('.panier-flottant'); f.hidden = !n;
    $('[data-panier-resume]').textContent = 'Mon panier · ' + n + (n > 1 ? ' articles · ' : ' article · ') + euros(total());
    document.body.classList.toggle('avec-panier', !!n);
  }
  function details(l) {
    var d = [];
    if (l.variante) d.push(l.variante);
    if (l.tissus && l.tissus.length) d.push('tissu' + (l.tissus.length > 1 ? 's' : '') + ' n°' + l.tissus.join(' et n°'));
    if (l.prenom) d.push('« ' + l.prenom + ' »');
    if (l.note) d.push(l.note);
    return d.join(' · ');
  }

  /* ---------- fenêtre de choix ---------- */
  var fen = $('[data-fenetre]');
  function ouvrir(d) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); document.body.classList.add('fige'); }
  function fermer(d) { if (d.close) d.close(); else d.removeAttribute('open'); document.body.classList.remove('fige'); }
  [fen, $('[data-panier]')].forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-fermer]')) fermer(d); });
    d.addEventListener('close', function () { document.body.classList.remove('fige'); });
  });

  function choisir(slug) {
    var p = produit(slug); if (!p) return;
    if (dp.open) fermer(dp);
    var etat = { variante: p.variantes ? p.variantes[0] : '', tissus: [], qte: 1 };
    var max = p.tissus || 0;
    var labelPrenom = p.prenom === true ? 'Prénom à broder' : p.prenom;
    fen.innerHTML =
      '<form method="dialog" class="choix" data-choix>' +
      '<div class="fenetre-tete"><img src="' + R + 'photos/' + p.photo + '" alt=""><div><h2 id="fenetre-titre">' + esc(p.nom) + '</h2><p class="fenetre-prix">' + euros(p.prix) + '</p></div>' +
      '<button type="button" class="fermer" data-fermer aria-label="Fermer">×</button></div>' +
      '<div class="fenetre-corps">' +
      (p.variantes ? '<fieldset><legend>' + esc(p.titreVariante) + '</legend><div class="choix-pastilles">' + p.variantes.map(function (v, i) {
        return '<label class="choix-pastille"><input type="radio" name="variante" value="' + esc(v) + '"' + (i ? '' : ' checked') + '><span>' + esc(v) + '</span></label>';
      }).join('') + '</div></fieldset>' : '') +
      (max ? '<fieldset><legend>' + (max > 1 ? 'Vos tissus <small>1 ou 2, facultatif</small>' : 'Votre tissu <small>facultatif</small>') + '</legend>' +
        '<p class="aide" data-tissus-choisis>Touchez un tissu pour le choisir. Sans choix, Sandra vous conseille.</p>' +
        '<div class="choix-tissus">' + D.tissus.map(function (t) {
          return '<button type="button" class="tissu" data-tissu="' + esc(t.n) + '" aria-pressed="false"><img src="' + R + 'photos/tissus/' + t.img + '" alt="" loading="lazy"><span>n°' + esc(t.n) + '</span></button>';
        }).join('') + '</div></fieldset>' : '') +
      (labelPrenom ? '<label class="champ"><span>' + esc(labelPrenom) + '</span><input name="prenom" maxlength="60" autocomplete="off" placeholder="Ex. : Alya"></label>' : '') +
      '<label class="champ"><span>Un petit mot pour Sandra <small>facultatif</small></span><input name="note" maxlength="140" placeholder="Couleur du fil, date, une idée…"></label>' +
      '</div>' +
      '<div class="fenetre-pied"><div class="quantite"><button type="button" data-moins aria-label="Un de moins">−</button><output data-qte>1</output><button type="button" data-plus aria-label="Un de plus">+</button></div>' +
      '<button type="submit" class="bouton bouton-grand" data-ajouter>Ajouter au panier · ' + euros(p.prix) + '</button></div>' +
      '</form>';
    var f = $('[data-choix]', fen);
    function majBouton() { $('[data-ajouter]', f).textContent = 'Ajouter au panier · ' + euros(p.prix * etat.qte); $('[data-qte]', f).textContent = etat.qte; }
    f.addEventListener('change', function (e) { if (e.target.name === 'variante') etat.variante = e.target.value; });
    f.addEventListener('click', function (e) {
      var t = e.target.closest('[data-tissu]');
      if (t) {
        var n = t.getAttribute('data-tissu'), i = etat.tissus.indexOf(n);
        if (i >= 0) etat.tissus.splice(i, 1);
        else { etat.tissus.push(n); if (etat.tissus.length > max) etat.tissus.shift(); }
        $$('[data-tissu]', f).forEach(function (b) { var on = etat.tissus.indexOf(b.getAttribute('data-tissu')) >= 0; b.classList.toggle('choisi', on); b.setAttribute('aria-pressed', on); });
        $('[data-tissus-choisis]', f).innerHTML = etat.tissus.length ? 'Choisi : <b>n°' + etat.tissus.join(' et n°') + '</b>' : 'Touchez un tissu pour le choisir. Sans choix, Sandra vous conseille.';
      }
      if (e.target.closest('[data-plus]')) { etat.qte = Math.min(20, etat.qte + 1); majBouton(); }
      if (e.target.closest('[data-moins]')) { etat.qte = Math.max(1, etat.qte - 1); majBouton(); }
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      panier.push({ slug: p.slug, nom: p.nom, prix: p.prix, photo: p.photo, qte: etat.qte, variante: etat.variante, tissus: etat.tissus.slice(),
        prenom: f.prenom ? f.prenom.value.trim() : '', note: f.note.value.trim() });
      garder();
      fen.innerHTML = '<div class="ajoute"><p class="ajoute-coche" aria-hidden="true">✓</p><h2 id="fenetre-titre">Ajouté au panier</h2><p>' + esc(p.nom) + '</p>' +
        '<div class="actions"><button type="button" class="bouton bouton-clair" data-fermer>Continuer</button><button type="button" class="bouton" data-voir-panier>Voir mon panier</button></div></div>';
    });
    ouvrir(fen);
  }

  /* ---------- panier ---------- */
  var dp = $('[data-panier]');
  function afficherPanier() {
    if (!panier.length) {
      dp.innerHTML = '<div class="fenetre-tete"><h2 id="panier-titre">Mon panier</h2><button type="button" class="fermer" data-fermer aria-label="Fermer">×</button></div>' +
        '<div class="fenetre-corps vide"><p>Votre panier est vide.</p><a class="bouton" href="' + R + '#creations" data-fermer>Voir les créations</a></div>';
      return;
    }
    var moi = {};
    try { moi = JSON.parse(localStorage.getItem('mamiecrea-client')) || {}; } catch (e) {}
    var v = function (k) { return esc(moi[k] || ''); };
    dp.innerHTML = '<form class="panier" data-envoi>' +
      '<div class="fenetre-tete"><h2 id="panier-titre">Mon panier</h2><button type="button" class="fermer" data-fermer aria-label="Fermer">×</button></div>' +
      '<div class="fenetre-corps"><ul class="lignes">' + panier.map(function (l, i) {
        return '<li><img src="' + R + 'photos/' + l.photo + '" alt=""><div><p class="ligne-nom">' + esc(l.nom) + (l.qte > 1 ? ' × ' + l.qte : '') + '</p>' +
          (details(l) ? '<p class="ligne-details">' + esc(details(l)) + '</p>' : '') + '</div><p class="ligne-prix">' + euros(l.prix * l.qte) + '</p>' +
          '<button type="button" class="retirer" data-retirer="' + i + '" aria-label="Retirer ' + esc(l.nom) + '">×</button></li>';
      }).join('') + '</ul>' +
      '<p class="panier-total"><span>Total</span><b data-total>' + euros(total()) + '</b></p>' +
      '<fieldset><legend>Retrait ou envoi</legend><div class="choix-pastilles">' +
      ['Retrait à Vendin-lès-Béthune', 'Envoi par la Poste'].map(function (m, i) {
        return '<label class="choix-pastille"><input type="radio" name="mode" value="' + m + '"' + ((moi.mode ? moi.mode === m : !i) ? ' checked' : '') + '><span>' + m + '</span></label>';
      }).join('') + '</div><p class="aide" data-aide-mode></p></fieldset>' +
      '<div class="champs-deux"><label class="champ"><span>Prénom et nom</span><input name="nom" required maxlength="80" autocomplete="name" value="' + v('nom') + '"></label>' +
      '<label class="champ"><span>Téléphone</span><input name="tel" type="tel" required maxlength="20" autocomplete="tel" value="' + v('tel') + '"></label></div>' +
      '<label class="champ"><span>E-mail <small>pour le reçu</small></span><input name="email" type="email" required maxlength="120" autocomplete="email" value="' + v('email') + '"></label>' +
      '<label class="champ" data-adresse hidden><span>Adresse de livraison</span><input name="adresse" maxlength="200" autocomplete="street-address" placeholder="N°, rue, code postal, ville" value="' + v('adresse') + '"></label>' +
      '<p class="note-apercu" data-apercu hidden></p>' +
      '</div><div class="fenetre-pied fenetre-pied-col"><button type="submit" class="bouton bouton-grand"><span>Payer ' + euros(total()) + '</span></button>' +
      '<p class="aide">Paiement sécurisé par carte bancaire sur la page SumUp de Mamie Créa. Sandra reçoit votre commande avec tous les détails.</p></div></form>';
    majMode();
  }
  function majMode() {
    var f = $('[data-envoi]', dp); if (!f) return;
    var envoi = f.mode.value === 'Envoi par la Poste';
    $('[data-adresse]', f).hidden = !envoi; f.adresse.required = envoi;
    $('[data-aide-mode]', f).textContent = envoi ? 'Les frais de port sont ajoutés au paiement.' : 'Sandra vous prévient quand votre création est prête.';
  }
  dp.addEventListener('change', function (e) { if (e.target.name === 'mode') majMode(); });
  dp.addEventListener('click', function (e) {
    var r = e.target.closest('[data-retirer]');
    if (r) { panier.splice(+r.getAttribute('data-retirer'), 1); garder(); afficherPanier(); }
  });
  dp.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, moi = { mode: f.mode.value, nom: f.nom.value.trim(), tel: f.tel.value.trim(), email: f.email.value.trim(), adresse: f.adresse.value.trim() };
    try { localStorage.setItem('mamiecrea-client', JSON.stringify(moi)); } catch (x) {}
    // Sur le vrai site : création du paiement SumUp au montant du panier (fonction serveur, clé SumUp de Mamie Créa),
    // puis ouverture de la page de paiement sécurisée ; la commande détaillée part chez Sandra une fois payée.
    var n = $('[data-apercu]', f);
    n.hidden = false;
    n.innerHTML = '<b>Aperçu :</b> sur votre vrai site, ce bouton ouvre ici la page de paiement sécurisée SumUp de Mamie Créa, au montant de ' + euros(total()) +
      '. Une fois payé, Sandra reçoit la commande : ' + panier.map(function (l) { return esc(l.nom) + (details(l) ? ' (' + esc(details(l)) + ')' : ''); }).join(', ') + '.';
    n.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-choisir]');
    if (c) { e.preventDefault(); choisir(c.getAttribute('data-choisir')); return; }
    if (e.target.closest('[data-ouvrir-panier]') || e.target.closest('[data-voir-panier]')) {
      if (fen.open) fermer(fen);
      afficherPanier(); ouvrir(dp);
    }
  });
  majResume();

  /* ---------- apparitions douces ---------- */
  var el = $$('.titre-section, .etapes-liste li, .avis-carte, .histoire-texte, .contact-lien');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    el.forEach(function (x) { x.classList.add('revele'); io.observe(x); });
  }
})();
