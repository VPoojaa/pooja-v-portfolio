// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}));

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Active navigation highlight
const links = [...navLinks.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Back-to-top button
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 500));
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Contact form validation (no email is sent: connect a form service for that)
const form = document.getElementById('form');
const status = document.getElementById('status');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  ['name', 'email', 'subject', 'message'].forEach(id => {
    const f = form.elements[id];
    const err = form.querySelector(`[data-for="${id}"]`);
    let msg = '';
    if (!f.value.trim()) msg = 'This field is required.';
    else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) msg = 'Enter a valid email address.';
    err.textContent = msg;
    if (msg) ok = false;
  });
  if (!ok) { status.textContent = ''; return; }
  const endpoint = form.dataset.endpoint;
  if (!endpoint) {  // no form service connected yet
    status.textContent = 'Form works, but no email service is connected yet.';
    return;
  }
  status.textContent = 'Sending...';
  fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
    .then(r => { if (r.ok) { status.textContent = 'Thank you! Your message was sent.'; form.reset(); } else throw new Error(); })
    .catch(() => { status.textContent = 'Sorry, message not sent. Please email me directly.'; });
});

document.getElementById('year').textContent = new Date().getFullYear();
