/* Mamie Créa — aperçu LocWeb : menu, filtres des créations, galerie de la fiche, apparitions. */
(function () {
  document.documentElement.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var tete = $('[data-tete]'), burger = $('[data-burger]'), menu = $('[data-menu]');
  addEventListener('scroll', function () { tete.classList.toggle('colle', scrollY > 8); }, { passive: true });
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('ouvert'); burger.setAttribute('aria-expanded', o);
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('ouvert'); burger.setAttribute('aria-expanded', 'false'); }); });

  // Filtres : par rubrique, ou « moins de 15 € ».
  var filtres = $('[data-filtres]');
  if (filtres) filtres.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filtre]'); if (!b) return;
    var f = b.getAttribute('data-filtre');
    $$('[data-filtre]', filtres).forEach(function (x) { x.classList.toggle('actif', x === b); x.setAttribute('aria-pressed', x === b); });
    $$('[data-grille] .carte').forEach(function (c) {
      c.hidden = !(f === 'tout' || (f === 'petits' ? +c.getAttribute('data-prix') < 15 : c.getAttribute('data-rubrique') === f));
    });
  });

  // Galerie de la fiche.
  var grande = $('[data-grande]');
  $$('[data-photo]').forEach(function (v) {
    v.addEventListener('click', function () {
      grande.src = v.getAttribute('data-photo');
      $$('[data-photo]').forEach(function (x) { x.classList.toggle('actif', x === v); });
    });
  });

  // Apparitions douces au défilement.
  var el = $$('.titre-section, .etapes-liste li, .avis-carte, .histoire-texte, .contact-lien');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    el.forEach(function (x) { x.classList.add('revele'); io.observe(x); });
  }
})();
