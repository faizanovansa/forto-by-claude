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

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('closeSecret')?.addEventListener('click', () => {
  document.getElementById('secretPage').classList.remove('show');
});

// ---------- page navigation with real flip transition ----------
const pageOrder = ['who', 'party', 'quests', 'map'];
let currentIndex = 0;
let flipping = false;

function buildDots(){
  const wrap = document.getElementById('pageDots');
  wrap.innerHTML = pageOrder.map((_, i) => `<span class="dot${i===0?' current':''}"></span>`).join('');
}

function goToPage(id){
  const idx = pageOrder.indexOf(id);
  if (idx === -1 || flipping) return;
  const outgoing = document.querySelector('.page.active');
  const incoming = document.getElementById('page-' + id);
  if (outgoing === incoming) return;

  currentIndex = idx;
  document.querySelectorAll('.bm').forEach(b => b.classList.toggle('current', b.dataset.page === id));
  document.querySelectorAll('.page-dots .dot').forEach((d, i) => d.classList.toggle('current', i === idx));

  if (reduceMotion || !outgoing) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active','flip-in','flip-out'));
    incoming.classList.add('active');
    afterPageShown(id);
    return;
  }

  flipping = true;
  outgoing.classList.add('flip-out');
  const onOutEnd = () => {
    outgoing.removeEventListener('animationend', onOutEnd);
    outgoing.classList.remove('active','flip-out');
    incoming.classList.add('active','flip-in');
    const onInEnd = () => {
      incoming.removeEventListener('animationend', onInEnd);
      incoming.classList.remove('flip-in');
      flipping = false;
    };
    incoming.addEventListener('animationend', onInEnd);
    afterPageShown(id);
  };
  outgoing.addEventListener('animationend', onOutEnd);
}

function afterPageShown(id){
  if (id === 'party') {
    requestAnimationFrame(() => { document.querySelector('.bond-fill').style.width = '92%'; });
  }
  if (id === 'who') { startTypewriter(); replay('#page-who .tag', 'stagger-pop', 60); }
  if (id === 'quests') replay('.seal', null, 70, true);
  if (id === 'map') replay('.pin', null, 90, true);
}

// restart CSS animations on elements each time a page is (re)visited
function replay(selector, addClass, stepDelay, useOwnAnim){
  document.querySelectorAll(selector).forEach((el, i) => {
    if (addClass) el.classList.remove(addClass);
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animationDelay = (i * stepDelay) + 'ms';
    el.style.animation = '';
    if (addClass) {
      requestAnimationFrame(() => el.classList.add(addClass));
    }
  });
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
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('book').classList.contains('active')) return;
  if (e.key === 'ArrowRight') document.getElementById('nextPage').click();
  if (e.key === 'ArrowLeft') document.getElementById('prevPage').click();
});

// ---------- cover -> book ----------
document.getElementById('openBook').addEventListener('click', () => {
  document.getElementById('cover').classList.remove('active');
  document.getElementById('book').classList.add('active');
  buildDots();
  const first = document.getElementById('page-who');
  first.classList.add('active');
  document.querySelectorAll('.bm')[0].classList.add('current');
  document.querySelector('.page-dots .dot').classList.add('current');
  afterPageShown('who');
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
  btn.style.animationDelay = (i * 70) + 'ms';
  btn.innerHTML = `<span><span class="seal-icon">${cert.icon}</span>buka segel</span>`;
  btn.addEventListener('click', (e) => {
    if (btn.classList.contains('broken')) { showCertDetail(cert, i); return; }
    btn.classList.add('breaking');
    setTimeout(() => {
      btn.classList.remove('breaking');
      btn.classList.add('broken');
      btn.innerHTML = `<span><span class="seal-icon">✓</span>terbuka</span>`;
    }, 200);
    const r = btn.getBoundingClientRect();
    spawnBurst(r.left + r.width/2, r.top + r.height/2, 26, '232,185,95');
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
links.forEach((link, i) => {
  const a = document.createElement('a');
  a.className = 'pin';
  a.href = link.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.style.left = link.x + '%';
  a.style.top = link.y + '%';
  a.style.animationDelay = (i * 90) + 'ms';
  a.style.setProperty('--pin-color', link.color);
  a.innerHTML = `<span class="pin-dot"></span><span class="pin-label">${link.name}</span>`;
  a.addEventListener('click', (e) => {
    const r = a.getBoundingClientRect();
    spawnBurst(r.left + r.width/2, r.top, 16, '232,185,95');
  });
  pinsWrap.appendChild(a);
});

// ---------- footer year ----------
const footerP = document.querySelector('.journal-footer p');
if (footerP) footerP.textContent = footerP.textContent.replace('{{YEAR}}', new Date().getFullYear());

// ---------- floating embers on cover ----------
(function(){
  if (reduceMotion) return;
  const wrap = document.querySelector('.embers');
  if (!wrap) return;
  const count = 16;
  for (let i = 0; i < count; i++) {
    const e = document.createElement('span');
    e.className = 'ember';
    const size = Math.random() * 4 + 2;
    e.style.width = size + 'px';
    e.style.height = size + 'px';
    e.style.left = Math.random() * 100 + '%';
    e.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    e.style.animationDuration = (Math.random() * 6 + 7) + 's';
    e.style.animationDelay = (Math.random() * 8) + 's';
    wrap.appendChild(e);
  }
})();

// ---------- magic dust cursor trail + click bursts ----------
const canvas = document.getElementById('dust');
const ctx = canvas.getContext('2d');
let w, h, particles = [];
function resizeCanvas(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
  if (particles.length > 220) particles.splice(0, particles.length - 220);
}, { passive: true });

function spawnBurst(x, y, count, hue){
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = Math.random() * 2.6 + 1.2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      r: Math.random() * 2 + 1,
      hue: hue || (Math.random() > 0.5 ? '232,185,95' : '160,107,176')
    });
  }
}
window.addEventListener('click', (e) => {
  if (reduceMotion) return;
  if (e.target.closest('.seal, .pin')) return; // those spawn their own themed burst
  spawnBurst(e.clientX, e.clientY, 10, null);
});

function tick(){
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.01; p.life -= 0.02;
    ctx.beginPath();
    ctx.fillStyle = `rgba(${p.hue},${Math.max(p.life,0)*0.75})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  particles = particles.filter(p => p.life > 0);
  requestAnimationFrame(tick);
}
if (!reduceMotion) tick();

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
        spawnBurst(window.innerWidth/2, window.innerHeight/2, 40, '232,185,95');
        pos = 0;
      }
    } else {
      pos = (key === seq[0]) ? 1 : 0;
    }
  });
})();
