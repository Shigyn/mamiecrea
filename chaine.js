/* Mamie Créa — dessin d'une attache-tétine en SVG (attache, perles, prénom en perles-lettres, anneau).
   Servi au navigateur (atelier) et utilisé par build.mjs pour l'illustration du catalogue. */
(function (g) {
  var FORMES = { ronde: 30, hexagone: 30, lentille: 16, bois: 30, lettre: 27 };
  function plus(c, d) { // assombrit une couleur #rrggbb pour le contour
    var n = parseInt(c.slice(1), 16), r = (n >> 16) - d, v = ((n >> 8) & 255) - d, b = (n & 255) - d;
    var x = function (k) { return Math.max(0, Math.min(255, k)).toString(16).padStart(2, '0'); };
    return '#' + x(r) + x(v) + x(b);
  }
  function perle(p, x, y) {
    var c = p.couleur || '#ffffff', s = plus(c, 38), w = FORMES[p.forme] || 30, cx = x + w / 2;
    if (p.forme === 'hexagone') {
      var r = 15, pts = [];
      for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i; pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1)); }
      return '<polygon points="' + pts.join(' ') + '" fill="' + c + '" stroke="' + s + '" stroke-width="1.2"/>';
    }
    if (p.forme === 'lentille') return '<ellipse cx="' + cx + '" cy="' + y + '" rx="7.5" ry="15" fill="' + c + '" stroke="' + s + '" stroke-width="1.2"/>';
    if (p.forme === 'lettre') return '<rect x="' + (x + 0.5) + '" y="' + (y - 13) + '" width="26" height="26" rx="6" fill="#fff" stroke="#d9cfe0" stroke-width="1.2"/>' +
      '<text x="' + cx + '" y="' + (y + 5.5) + '" text-anchor="middle" font-family="Grandstander, Nunito Sans, sans-serif" font-weight="700" font-size="15" fill="' + (p.couleur || '#3d2649') + '">' + p.lettre + '</text>';
    if (p.forme === 'bois') return '<circle cx="' + cx + '" cy="' + y + '" r="14.5" fill="#d4ad7f" stroke="#b08657" stroke-width="1.2"/>' +
      '<path d="M' + (cx - 9) + ' ' + (y - 6) + 'q9 4 18 0M' + (cx - 10) + ' ' + (y + 3) + 'q10 4 20 0" stroke="#b9905f" stroke-width="1" fill="none"/>';
    return '<circle cx="' + cx + '" cy="' + y + '" r="14.5" fill="' + c + '" stroke="' + s + '" stroke-width="1.2"/>' +
      '<circle cx="' + (cx - 5) + '" cy="' + (y - 5) + '" r="3.5" fill="#fff" opacity=".45"/>';
  }
  function attache(type, y) {
    var c = type === 'bois' ? '#d4ad7f' : type === 'metal' ? '#c9ccd3' : '#f2b8c6', s = plus(c, 50);
    return '<rect x="2" y="' + (y - 17) + '" width="52" height="34" rx="9" fill="' + c + '" stroke="' + s + '" stroke-width="1.5"/>' +
      '<rect x="10" y="' + (y - 8) + '" width="36" height="16" rx="5" fill="none" stroke="' + s + '" stroke-width="1.3"/>' +
      '<rect x="54" y="' + (y - 4) + '" width="12" height="8" rx="3" fill="' + s + '"/>';
  }
  function dessinerChaine(c) {
    var y = 40, x = 70, gap = 2, corps = '', perles = (c.perles || []).slice();
    var lettres = String(c.prenom || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 10).split('');
    var milieu = Math.ceil(perles.length / 2);
    var tout = perles.slice(0, milieu).concat(lettres.map(function (l) { return { forme: 'lettre', lettre: l, couleur: c.couleurLettres }; })).concat(perles.slice(milieu));
    tout.forEach(function (p) { corps += perle(p, x, y); x += (FORMES[p.forme] || 30) + gap; });
    var fin = x + 22, w = fin + 22;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' 80" role="img" aria-label="Aperçu de l’attache-tétine">' +
      '<line x1="60" y1="' + y + '" x2="' + (fin - 14) + '" y2="' + y + '" stroke="#cbb89f" stroke-width="3" stroke-linecap="round"/>' +
      attache(c.attache || 'bois', y) + corps +
      '<circle cx="' + fin + '" cy="' + y + '" r="15" fill="none" stroke="' + (c.anneau || '#e0498a') + '" stroke-width="6"/>' +
      '</svg>';
  }
  dessinerChaine.perle = function (p) {
    var w = FORMES[p.forme] || 30;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (w + 4) + ' 34" aria-hidden="true">' + perle(p, 2, 17) + '</svg>';
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = dessinerChaine; else g.dessinerChaine = dessinerChaine;
})(this);
