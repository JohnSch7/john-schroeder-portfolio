document.addEventListener('DOMContentLoaded', function () {
  const cards = Array.from(document.querySelectorAll('[data-reveal]'));
  if (cards.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    cards.forEach(card => card.classList.add('is-visible'));
    return;
  }

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('is-visible');
    }, 80 * index);
  });
});