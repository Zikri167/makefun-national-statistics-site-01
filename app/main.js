// Statistik Nusantara — router hash dan pengendali interaksi.
// Rute: #/ beranda, #/population, #/economy, #/health, #/education,
// #/regions, #/about. Semua kontrol (pemilih indikator, jenis grafik, tahun,
// cari provinsi, saring kepulauan, urut tabel) bekerja tanpa network.

import { home, populationPage, economyPage, healthPage, educationPage, regionsPage, aboutPage, notFound } from './views.js';

const app = document.getElementById('app');

// State per halaman, bertahan selama sesi agar kontrol tidak reset saat pindah halaman.
const state = {
  home: { metric: 'population', chart: 'line', mapMetric: 'population' },
  population: { metric: 'population', chart: 'line', year: 2024, pyramidYear: 2024 },
  economy: { metric: 'gdpGrowth', chart: 'line', donutHighlight: null },
  health: { metric: 'lifeExpectancy', chart: 'line' },
  education: { metric: 'literacy', chart: 'line' },
  regions: { q: '', island: 'Semua', sort: 'population', dir: 'desc', mapMetric: 'population', compareA: 'DKI Jakarta', compareB: 'Papua Pegunungan' },
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
  if (ctl === 'compareA') s.compareA = el.value;
  if (ctl === 'compareB') s.compareB = el.value;
  if (ctl === 'pyramidYear') s.pyramidYear = Number(el.value);
  if (ctl === 'mapMetric') {
    state.home.mapMetric = el.value;
    state.regions.mapMetric = el.value;
  }
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
  const clearBtn = e.target.closest('[data-clear-filter]');
  if (clearBtn) {
    state.regions.q = '';
    render();
    return;
  }
  const swapBtn = e.target.closest('[data-swap-compare]');
  if (swapBtn) {
    const s = state.regions;
    const tmp = s.compareA;
    s.compareA = s.compareB;
    s.compareB = tmp;
    render();
    return;
  }
  const donutBtn = e.target.closest('[data-donut]');
  if (donutBtn) {
    const s = state.economy;
    const idx = Number(donutBtn.dataset.donut);
    // Klik yang sama lagi membatalkan sorotan.
    s.donutHighlight = s.donutHighlight === idx ? null : idx;
    render();
    // Kembalikan fokus ke tombol legenda agar pengguna keyboard tidak kehilangan posisi.
    const btn = document.querySelector(`.legend-btn[data-donut="${idx}"]`);
    if (btn) btn.focus();
    return;
  }
  const tile = e.target.closest('[data-province]');
  if (tile) {
    const name = tile.dataset.province;
    // Klik ubin yang sama lagi membatalkan filter.
    state.regions.q = state.regions.q === name ? '' : name;
    if (route() !== 'regions') {
      location.hash = '#/regions';
      render();
    } else {
      render();
    }
    const table = document.querySelector('.table-wrap');
    if (table) table.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
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

// Info hover peta: tampilkan nilai provinsi di bawah peta tanpa render ulang.
app.addEventListener('mouseover', (e) => {
  const tile = e.target.closest('[data-province]');
  const info = document.getElementById('map-info');
  if (!tile || !info) return;
  const title = tile.querySelector('title');
  if (title) info.textContent = `${title.textContent} — klik untuk menyaring tabel.`;
});

// Ubin peta bisa dipakai lewat keyboard (Enter/Spasi).
app.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const tile = e.target.closest('[data-province]');
  if (!tile) return;
  e.preventDefault();
  tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
const navEl = document.getElementById('nav');
navEl.innerHTML = NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('');

window.addEventListener('hashchange', render);
render();
