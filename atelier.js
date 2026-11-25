/* Mamie Créa — atelier « Composez votre attache-tétine » (démonstration avec des perles d'exemple,
   en attendant les photos des vraies perles de Sandra). */
(function () {
  var zone = document.querySelector('[data-atelier]'); if (!zone || !window.dessinerChaine) return;
  var $ = function (s) { return zone.querySelector(s); };
  var COULEURS = [
    ['Rose poudré', '#f2b8c6'], ['Fuchsia', '#e0498a'], ['Lilas', '#c9b3ef'], ['Ciel', '#a9d2f2'], ['Bleu nuit', '#2f4a7a'], ['Menthe', '#a8e0c5'],
    ['Sauge', '#9db89a'], ['Moutarde', '#e8b84a'], ['Pêche', '#f7c2a2'], ['Blanc', '#ffffff'], ['Gris perle', '#c4c4cc'], ['Terracotta', '#d98a6a'],
  ];
  var MAX = 16;
  var etat = { attache: 'bois', forme: 'ronde', perles: [], prenom: '' };
  var exemple = [['ronde', '#f2b8c6'], ['hexagone', '#c9b3ef'], ['bois'], ['ronde', '#ffffff'], ['lentille', '#e0498a'], ['ronde', '#f2b8c6'], ['bois'], ['hexagone', '#c9b3ef']];

  function dessiner() {
    $('[data-apercu-chaine]').innerHTML = window.dessinerChaine({ attache: etat.attache, perles: etat.perles, prenom: etat.prenom });
    var n = etat.perles.length;
    $('[data-compte]').textContent = n + ' / ' + MAX + ' perles' + (etat.prenom ? ' · prénom ' + etat.prenom.toUpperCase() : '');
  }
  function nuancier() {
    $('[data-nuancier]').innerHTML = (etat.forme === 'bois' ? [['Bois naturel', '#d4ad7f']] : COULEURS).map(function (c) {
      var svg = window.dessinerChaine.perle({ forme: etat.forme, couleur: c[1] });
      return '<button type="button" class="perle-choix" data-couleur="' + c[1] + '" title="' + c[0] + '"><span class="perle-svg">' + svg + '</span><small>' + c[0] + '</small></button>';
    }).join('');
  }
  zone.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-attache]'))) {
      etat.attache = t.getAttribute('data-attache');
      zone.querySelectorAll('[data-attache]').forEach(function (b) { b.classList.toggle('actif', b === t); b.setAttribute('aria-pressed', b === t); });
    }
    if ((t = e.target.closest('[data-forme]'))) {
      etat.forme = t.getAttribute('data-forme');
      zone.querySelectorAll('[data-forme]').forEach(function (b) { b.classList.toggle('actif', b === t); b.setAttribute('aria-pressed', b === t); });
      nuancier();
    }
    if ((t = e.target.closest('[data-couleur]')) && etat.perles.length < MAX) etat.perles.push({ forme: etat.forme, couleur: t.getAttribute('data-couleur') });
    if (e.target.closest('[data-annuler]')) etat.perles.pop();
    if (e.target.closest('[data-effacer]')) etat.perles = [];
    if (e.target.closest('[data-exemple]')) { etat.perles = exemple.map(function (p) { return { forme: p[0], couleur: p[1] }; }); etat.prenom = 'Alya'; $('[name=prenom-perles]').value = 'Alya'; }
    if (e.target.closest('[data-commander-atelier]')) { $('[data-note-atelier]').hidden = false; }
    dessiner();
  });
  $('[name=prenom-perles]').addEventListener('input', function (e) { etat.prenom = e.target.value; dessiner(); });
  etat.perles = exemple.map(function (p) { return { forme: p[0], couleur: p[1] }; }); etat.prenom = 'Alya';
  nuancier(); dessiner();
})();
