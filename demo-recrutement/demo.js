(function(){
  var F = window.DEMO_FLOW || {};
  var toast = document.getElementById('demo-toast'), tt;
  function say(msg){ toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function(){ toast.classList.remove('show'); }, 3200); }
  var MSG = 'Démo visuelle : dans la vraie version, cette action est enregistrée en base de données.';
  function txt(el){ return (el.textContent || '').trim().toLowerCase(); }

  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if (a && a.getAttribute('href') === '#') {
      e.preventDefault();
      say(a.dataset.demo === 'download' ? 'Démo visuelle : les téléchargements (CV, dossier PDF, export Excel) fonctionnent dans la vraie version.' : 'Démo visuelle : cette page n’existe pas dans la démonstration.');
      return;
    }
    var d = e.target.closest('[data-href]');
    if (d) { location.href = d.getAttribute('data-href'); return; }
    var b = e.target.closest('button');
    if (!b) return;
    var t = txt(b);
    if (F.next && /continuer|envoyer|transmettre|valider/.test(t)) { e.preventDefault(); location.href = F.next; return; }
    if (F.prev && /retour|précédent|annuler/.test(t)) { e.preventDefault(); location.href = F.prev; return; }
    if (F.login && /connexion|connecter|se connecter/.test(t)) { e.preventDefault(); location.href = F.login; return; }
    if (/déconnexion/.test(t)) { e.preventDefault(); location.href = 'admin-login.html'; return; }
    if (/effacer/.test(t)) { var i = document.querySelector('input[type=search], main input'); if (i) { i.value=''; filter(''); } return; }
    e.preventDefault();
    if (/recrut|présélection|entretien|retenue|refus|étudier|statut/.test(t)) say('Démo visuelle : dans la vraie version, le statut change, l’historique est horodaté et le candidat reçoit un e-mail.');
    else say(MSG);
  }, true);

  document.addEventListener('submit', function(e){
    e.preventDefault();
    if (F.login) { location.href = F.login; return; }
    say(MSG);
  }, true);

  document.addEventListener('change', function(e){
    if (e.target.matches('select') && !F.next) say('Démo visuelle : les filtres par secteur fonctionnent dans la vraie version.');
  });

  // Recherche côté candidat
  var cards = Array.prototype.slice.call(document.querySelectorAll('button.card[data-href]'));
  function filter(q){
    q = q.trim().toLowerCase(); var n = 0;
    cards.forEach(function(c){ var ok = !q || txt(c).indexOf(q) >= 0; c.style.display = ok ? '' : 'none'; if (ok) n++; });
    var cnt = Array.prototype.find.call(document.querySelectorAll('p'), function(p){ return /offres? ouvertes?/.test(p.textContent); });
    if (cnt && cnt.querySelector('span')) cnt.querySelector('span').textContent = n;
  }
  if (cards.length) {
    var input = document.querySelector('main input');
    if (input) input.addEventListener('input', function(){ filter(input.value); });
  }
  if (F.login) {
    var ins = document.querySelectorAll('input:not([type=hidden])');
    if (ins[0]) ins[0].value = 'rh';
    if (ins[1]) ins[1].value = 'mairie2026';
  }
})();
