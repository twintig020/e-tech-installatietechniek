// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-list');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
  navMenu.classList.toggle('open');
});

// i18n: load translations
const translations = { nl: {}, en: {} };
async function loadTranslations() {
  try {
    const [nl, en] = await Promise.all([
      fetch('assets/i18n/nl.json').then(r => r.json()),
      fetch('assets/i18n/en.json').then(r => r.json())
    ]);
    translations.nl = nl; translations.en = en;
    applyTranslations('nl');
  } catch (e) { console.warn('i18n load failed:', e); }
}
function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang]?.[key]) el.textContent = translations[lang][key];
  });
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
  });
}
document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
});
loadTranslations();

// Formspree form handling
const form = document.querySelector('form[data-formspree]');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = 'Verzenden...';
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
    if (res.ok) { form.reset(); alert('Bedankt! We nemen zo spoedig mogelijk contact op.'); }
    else { alert('Er ging iets mis. Probeer het later opnieuw of bel ons.'); }
  } catch { alert('Netwerkfout. Probeer later of bel ons direct.'); }
  finally { btn.disabled = false; btn.textContent = original; }
});