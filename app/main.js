// Statistik Nusantara — router hash dan pengendali interaksi.
// Rute: #/ beranda, #/population, #/economy, #/health, #/education,
// #/regions, #/about. Semua kontrol (pemilih indikator, jenis grafik, tahun,
// cari provinsi, saring kepulauan, urut tabel) bekerja tanpa network.

import { home, populationPage, economyPage, healthPage, educationPage, regionsPage, aboutPage, notFound } from './views.js';

const app = document.getElementById('app');

// State per halaman, bertahan selama sesi agar kontrol tidak reset saat pindah halaman.
const state = {
  home: { metric: 'population', chart: 'line' },
  population: { metric: 'population', chart: 'line', year: 2024 },
  economy: { metric: 'gdpGrowth', chart: 'line' },
  health: { metric: 'lifeExpectancy', chart: 'line' },
  education: { metric: 'literacy', chart: 'line' },
  regions: { q: '', island: 'Semua', sort: 'population', dir: 'desc' },
};

const TITLES = {
  home: 'Statistik Nusantara — Data Indonesia',
  population: 'Penduduk | Statistik Nusantara',
  economy: 'Ekonomi | Statistik Nusantara',
  health: 'Kesehatan | Statistik Nusantara',
  education: 'Pendidikan | Statistik Nusantara',
  regions: 'Provinsi | Statistik Nusantara',
  about: 'Tentang | Statistik Nusantara',
};

const NAV = [
  ['#/', 'Beranda'],
  ['#/population', 'Penduduk'],
  ['#/economy', 'Ekonomi'],
  ['#/health', 'Kesehatan'],
  ['#/education', 'Pendidikan'],
  ['#/regions', 'Provinsi'],
  ['#/about', 'Tentang'],
];

function route() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  return hash === '' ? 'home' : hash;
}

function render(focusId) {
  window.__shotReady = false;
  const r = route();
  const pages = {
    home, population: populationPage, economy: economyPage, health: healthPage,
    education: educationPage, regions: regionsPage, about: aboutPage,
  };
  const fn = pages[r];
  document.title = TITLES[r] || 'Statistik Nusantara';
  app.innerHTML = fn ? fn(state[r] || {}) : notFound();
  // Tandai tautan navigasi aktif.
  document.querySelectorAll('.nav a').forEach((a) => {
    const target = a.getAttribute('href').replace(/^#\/?/, '') || 'home';
    a.classList.toggle('active', target === r);
    if (target === r) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) el.focus();
  }
  window.__shotReady = true;
}

// Delegasi event: satu listener untuk semua kontrol di dalam #app.
app.addEventListener('change', (e) => {
  const el = e.target;
  const ctl = el.dataset.control;
  if (!ctl) return;
  const r = route();
  const s = state[r];
  if (!s) return;
  if (ctl === 'metric') s.metric = el.value;
  if (ctl === 'year') s.year = Number(el.value);
  if (ctl === 'island') s.island = el.value;
  render(el.id);
});

app.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.control !== 'search') return;
  const s = state.regions;
  s.q = el.value;
  // Render ulang tabel tapi jaga fokus dan posisi kursor di kotak cari.
  const pos = el.selectionStart;
  render();
  const box = document.getElementById('region-search');
  if (box) {
    box.focus();
    box.setSelectionRange(pos, pos);
  }
});

app.addEventListener('click', (e) => {
  const sortBtn = e.target.closest('[data-sort]');
  if (sortBtn) {
    const s = state.regions;
    const key = sortBtn.dataset.sort;
    if (s.sort === key) s.dir = s.dir === 'desc' ? 'asc' : 'desc';
    else { s.sort = key; s.dir = key === 'name' || key === 'island' ? 'asc' : 'desc'; }
    render();
    return;
  }
  const chartBtn = e.target.closest('[data-chart]');
  if (chartBtn) {
    const s = state[route()];
    if (s) s.chart = chartBtn.dataset.chart;
    render();
  }
});

// Navigasi: bangun tautan dari daftar NAV agar header konsisten di semua halaman.
const navEl = document.getElementById('nav');
navEl.innerHTML = NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('');

window.addEventListener('hashchange', render);
render();
