// ============================================================
// EDIT YOUR DATA HERE
// ============================================================
const certificates = [
  // { title: "Nama Sertifikat", issuer: "Coursera / Nama Penerbit", date: "2026", icon: "🎓" },
  { title: "Ganti dengan sertifikat Coursera kamu", issuer: "Coursera", date: "20XX", icon: "🎓" },
  { title: "Ganti dengan sertifikat Coursera kamu", issuer: "Coursera", date: "20XX", icon: "📜" },
  { title: "Ganti dengan sertifikat Coursera kamu", issuer: "Coursera", date: "20XX", icon: "🧾" },
];

const links = [
  { name: "Instagram", url: "https://instagram.com/", color: "#c9749b", x: 14, y: 30 },
  { name: "Blogger", url: "https://faizanovansa.blogspot.com", color: "#e8b95f", x: 40, y: 68 },
  { name: "GitHub", url: "https://github.com/faizanovansa", color: "#948dab", x: 66, y: 24 },
  { name: "LinkedIn", url: "https://linkedin.com/", color: "#6f9bd1", x: 88, y: 62 },
];
// ============================================================

document.getElementById('closeSecret')?.addEventListener('click', () => {
  document.getElementById('secretPage').classList.remove('show');
});

const pageOrder = ['who', 'party', 'quests', 'map'];
let currentIndex = 0;

function buildDots(){
  const wrap = document.getElementById('pageDots');
  wrap.innerHTML = pageOrder.map((_, i) => `<span class="dot${i===0?' current':''}"></span>`).join('');
}

function goToPage(id){
  const idx = pageOrder.indexOf(id);
  if (idx === -1) return;
  currentIndex = idx;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');

  document.querySelectorAll('.bm').forEach(b => b.classList.toggle('current', b.dataset.page === id));
  document.querySelectorAll('.page-dots .dot').forEach((d, i) => d.classList.toggle('current', i === idx));

  if (id === 'party') {
    requestAnimationFrame(() => {
      document.querySelector('.bond-fill').style.width = '92%';
    });
  }
  if (id === 'who') startTypewriter();
}

document.querySelectorAll('.bm').forEach(btn => {
  btn.addEventListener('click', () => goToPage(btn.dataset.page));
});
document.getElementById('prevPage').addEventListener('click', () => {
  goToPage(pageOrder[(currentIndex - 1 + pageOrder.length) % pageOrder.length]);
});
document.getElementById('nextPage').addEventListener('click', () => {
  goToPage(pageOrder[(currentIndex + 1) % pageOrder.length]);
});

// ---------- cover -> book ----------
document.getElementById('openBook').addEventListener('click', () => {
  document.getElementById('cover').classList.remove('active');
  document.getElementById('book').classList.add('active');
  buildDots();
  goToPage('who');
});

// ---------- typewriter ----------
let twTimer = null;
function startTypewriter(){
  const el = document.getElementById('whoText');
  if (el.dataset.done === '1') return;
  const full = el.dataset.text;
  el.textContent = '';
  el.classList.remove('done');
  let i = 0;
  clearInterval(twTimer);
  twTimer = setInterval(() => {
    el.textContent = full.slice(0, i);
    i++;
    if (i > full.length) {
      clearInterval(twTimer);
      el.classList.add('done');
      el.dataset.done = '1';
      document.getElementById('skipTw').classList.add('hidden');
    }
  }, 18);
}
document.getElementById('skipTw').addEventListener('click', () => {
  clearInterval(twTimer);
  const el = document.getElementById('whoText');
  el.textContent = el.dataset.text;
  el.classList.add('done');
  el.dataset.done = '1';
  document.getElementById('skipTw').classList.add('hidden');
});

// ---------- wax seals (certificates) ----------
const sealsGrid = document.getElementById('sealsGrid');
certificates.forEach((cert, i) => {
  const btn = document.createElement('button');
  btn.className = 'seal';
  btn.innerHTML = `<span><span class="seal-icon">${cert.icon}</span>buka segel</span>`;
  btn.addEventListener('click', () => {
    btn.classList.add('broken');
    btn.innerHTML = `<span><span class="seal-icon">✓</span>terbuka</span>`;
    showCertDetail(cert, i);
  });
  sealsGrid.appendChild(btn);
});

function showCertDetail(cert, i){
  let box = document.getElementById('cert-detail-box');
  if (!box) {
    box = document.createElement('div');
    box.id = 'cert-detail-box';
    box.className = 'cert-detail';
    document.getElementById('page-quests').insertBefore(box, document.getElementById('sealEditHint'));
  }
  box.classList.remove('show');
  void box.offsetWidth;
  box.innerHTML = `<h4>${cert.title}</h4><p>${cert.issuer} · ${cert.date}</p>`;
  box.classList.add('show');
}

// ---------- map pins ----------
const pinsWrap = document.getElementById('pinsWrap');
links.forEach(link => {
  const a = document.createElement('a');
  a.className = 'pin';
  a.href = link.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.style.left = link.x + '%';
  a.style.top = link.y + '%';
  a.style.setProperty('--pin-color', link.color);
  a.innerHTML = `<span class="pin-dot"></span><span class="pin-label">${link.name}</span>`;
  pinsWrap.appendChild(a);
});

// ---------- footer year ----------
const footerP = document.querySelector('.journal-footer p');
if (footerP) footerP.textContent = footerP.textContent.replace('{{YEAR}}', new Date().getFullYear());

// ---------- magic dust cursor trail ----------
(function(){
  const canvas = document.getElementById('dust');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('pointermove', (e) => {
    if (reduceMotion) return;
    for (let n = 0; n < 2; n++) {
      particles.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.6 - 0.2,
        life: 1,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() > 0.5 ? '232,185,95' : '160,107,176'
      });
    }
    if (particles.length > 160) particles.splice(0, particles.length - 160);
  }, { passive: true });

  function tick(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life -= 0.018;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.hue},${Math.max(p.life,0)*0.7})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    requestAnimationFrame(tick);
  }
  if (!reduceMotion) tick();
})();

// ---------- konami code easter egg ----------
(function(){
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[pos]) {
      pos++;
      if (pos === seq.length) {
        document.getElementById('secretPage').classList.add('show');
        pos = 0;
      }
    } else {
      pos = (key === seq[0]) ? 1 : 0;
    }
  });
})();
