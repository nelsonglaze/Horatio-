/* HMS Victory, deck by deck: choose a deck on the cutaway to read about it.
   Without this script every deck's text is simply shown in a list. */
(function () {
  'use strict';
  var root = document.querySelector('.decks');
  if (!root) return;
  var hits = root.querySelectorAll('.dk-hit');
  var bands = root.querySelectorAll('.dk-band');
  var cards = root.querySelectorAll('.decks-panel article');

  function show(id) {
    var i;
    for (i = 0; i < bands.length; i++) bands[i].classList.toggle('on', bands[i].getAttribute('data-deck') === id);
    for (i = 0; i < hits.length; i++) hits[i].setAttribute('aria-pressed', hits[i].getAttribute('data-deck') === id ? 'true' : 'false');
    for (i = 0; i < cards.length; i++) cards[i].hidden = cards[i].getAttribute('data-deck') !== id;
  }

  Array.prototype.forEach.call(hits, function (h) {
    var id = h.getAttribute('data-deck');
    h.addEventListener('click', function () { show(id); });
    h.addEventListener('focus', function () { show(id); });
    h.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(id); }
    });
  });

  root.classList.add('js');
  show('quarterdeck');
})();
