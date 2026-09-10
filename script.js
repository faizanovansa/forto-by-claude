// ============================================================
// EDIT YOUR DATA HERE
// ============================================================
const certificates = [
  { title: "Ganti dengan sertifikat Coursera kamu", issuer: "Coursera", date: "20XX", icon: "🎓" },
  { title: "Ganti dengan sertifikat Coursera kamu", issuer: "Coursera", date: "20XX", icon: "📜" },
  { title: "Ganti dengan sertifikat Coursera kamu", issuer: "Coursera", date: "20XX", icon: "🧾" },
];

const links = [
  { name: "Instagram", url: "https://instagram.com/", icon: "camera" },
  { name: "Blogger", url: "https://faizanovansa.blogspot.com", icon: "quill" },
  { name: "GitHub", url: "https://github.com/faizanovansa", icon: "code" },
  { name: "LinkedIn", url: "https://linkedin.com/", icon: "brief" },
];
// ============================================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const icons = {
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
  quill: '<path d="M20 4c-6 0-14 4-16 14 4-1 6-3 7-5M20 4c0 6-4 12-9 14M20 4l-9 14"/>',
  code: '<path d="M9 8l-5 4 5 4M15 8l5 4-5 4"/>',
  brief: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'
};

function svgIcon(name){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ''}</svg>`;
}

// ---------- build certificate cards ----------
const certGrid = document.getElementById('certGrid');
certificates.forEach(cert => {
  const card = document.createElement('div');
  card.className = 'cert-card';
  card.innerHTML = `
    <div class="cert-card-inner">
      <div class="cert-face front">
        <span class="icon">${cert.icon}</span>
        <span class="label">ketuk untuk lihat</span>
      </div>
      <div class="cert-face back">
        <h4>${cert.title}</h4>
        <p>${cert.issuer} · ${cert.date}</p>
      </div>
    </div>`;
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  certGrid.appendChild(card);
});

// ---------- build link cards ----------
const linkGrid = document.getElementById('linkGrid');
links.forEach(link => {
  const a = document.createElement('a');
  a.className = 'link-card';
  a.href = link.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.innerHTML = `${svgIcon(link.icon)}<span>${link.name}</span>`;
  linkGrid.appendChild(a);
});

// ---------- footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- rail nav + reveal, single IntersectionObserver ----------
const chapters = Array.from(document.querySelectorAll('.chapter'));
const railDots = Array.from(document.querySelectorAll('.rail-dot'));

function revealChapter(chapter){
  const items = chapter.querySelectorAll('[data-animate]');
  items.forEach((el, i) => {
    el.style.transitionDelay = reduceMotion ? '0ms' : (i * 60) + 'ms';
    el.classList.add('is-visible');
  });
  if (chapter.id === 'party') {
    const fill = document.getElementById('bondFill');
    if (fill) requestAnimationFrame(() => { fill.style.width = '92%'; });
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      const id = entry.target.id;
      railDots.forEach(d => d.classList.toggle('current', d.dataset.target === id));
      revealChapter(entry.target);
    }
  });
}, { threshold: [0.5] });

chapters.forEach(ch => observer.observe(ch));

// ---------- navigation ----------
function goTo(id){
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
railDots.forEach(dot => dot.addEventListener('click', () => goTo(dot.dataset.target)));
document.getElementById('scrollCue')?.addEventListener('click', () => goTo('who'));

// ---------- secret (konami code) ----------
document.getElementById('closeSecret')?.addEventListener('click', () => {
  document.getElementById('secret').classList.remove('show');
});
(function(){
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = (key === seq[pos]) ? pos + 1 : (key === seq[0] ? 1 : 0);
    if (pos === seq.length) {
      document.getElementById('secret').classList.add('show');
      pos = 0;
    }
  });
})();
