// Statistik Nusantara — perender halaman. Setiap halaman dirender dari data.js
// dan digambar ulang oleh main.js saat hash berubah atau kontrol diubah.

import {
  YEARS, SERIES, AGE_STRUCTURE, PYRAMID, PYRAMID_GROUPS, SECTORS, TRADE_PARTNERS,
  PROVINCES, KPI_2024, COUNTRY_FACTS, fmt, fmtInt,
} from './data.js';
import { lineChart, barChart, hbarChart, donutChart, sparkline, pyramidChart } from './charts.js';
import { provinceMap, MAP_METRICS } from './map.js';

const DONUT_COLORS = ['#0e7490', '#059669', '#d97706', '#dc2626', '#7c3aed', '#2563eb', '#0891b2', '#65a30d', '#ea580c'];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const KPI_COLORS = { population: '#0e7490', gdpGrowth: '#059669', inflation: '#d97706', unemployment: '#dc2626', poverty: '#7c3aed', lifeExpectancy: '#2563eb', literacy: '#0891b2', hdi: '#65a30d' };

function kpiCards() {
  return `<section class="kpi-grid" aria-label="Indikator utama 2024">` +
    KPI_2024.map((k) => {
      const s = SERIES[k.key];
      const first = s.values[0], last = s.values[s.values.length - 1];
      const chg = (((last - first) / Math.abs(first)) * 100).toFixed(1).replace('.', ',');
      const up = last >= first;
      const good = ['unemployment', 'poverty', 'inflation'].includes(k.key) ? !up : up;
      return `<article class="kpi"><div class="kpi-top"><div><div class="kpi-value">${k.value}</div>` +
      `<div class="kpi-label">${k.label}</div></div>${sparkline(s.values, KPI_COLORS[k.key] || '#0e7490')}</div>` +
      `<div class="kpi-trend ${good ? 'good' : 'bad'}">${up ? '▲' : '▼'} ${chg.replace('-', '')}% sejak 2015</div>` +
      `<div class="kpi-src">${k.source}</div></article>`;
    }).join('') +
    `</section>`;
}

export function mapSection(metric, selectId) {
  const opts = Object.entries(MAP_METRICS).map(([k, m]) => `<option value="${k}"${k === metric ? ' selected' : ''}>${m.label}</option>`).join('');
  return `<section class="card map-card">
    <h2>Peta Provinsi</h2>
    <p class="card-sub">38 provinsi dalam peta ubin — tiap ubin satu provinsi, diwarnai menurut indikator yang dipilih. Klik ubin untuk menyaring tabel provinsi.</p>
    <div class="controls">
      <label>Warnai menurut <select id="${selectId}" data-control="mapMetric">${opts}</select></label>
    </div>
    ${provinceMap(metric)}
    <p class="source">Sumber: ${esc(MAP_METRICS[metric].source)}; IPM memakai data 2023. Bentuk grid mengikuti letak kepulauan, bukan skala geografis sebenarnya.</p>
  </section>`;
}

function sourceLine(series) {
  return `<p class="source">Sumber: ${esc(series.source)}. ${esc(series.note)}</p>`;
}

function chartControls(id, metricKeys, currentKey, chartType, showType = true) {
  const opts = metricKeys.map((k) => `<option value="${k}"${k === currentKey ? ' selected' : ''}>${SERIES[k].label}</option>`).join('');
  const typeBtns = showType
    ? `<div class="seg" role="group" aria-label="Jenis grafik">
        <button type="button" data-chart="line" class="${chartType === 'line' ? 'active' : ''}">Garis</button>
        <button type="button" data-chart="bar" class="${chartType === 'bar' ? 'active' : ''}">Batang</button>
      </div>`
    : '';
  return `<div class="controls">
    <label>Indikator <select id="${id}-metric" data-control="metric">${opts}</select></label>
    ${typeBtns}
  </div>`;
}

export function home(state) {
  const key = state.metric || 'population';
  const s = SERIES[key];
  const chart = state.chart === 'bar'
    ? barChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit })
    : lineChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit });
  const latest = s.values[s.values.length - 1];
  const prev = s.values[s.values.length - 2];
  const delta = latest - prev;
  const deltaTxt = (delta >= 0 ? '+' : '') + fmt(delta) + ' ' + s.unit + ' vs 2023';
  return `<section class="hero">
    <p class="hero-kicker">Data resmi 2015–2024 &nbsp;•&nbsp; 38 provinsi &nbsp;•&nbsp; 8 indikator utama</p>
    <h1>Indonesia dalam Angka</h1>
    <p class="lede">Statistik nasional Indonesia 2015–2024: penduduk, ekonomi, kesehatan,
    pendidikan, dan 38 provinsi — semua angka bersumber dan bisa dijelajahi.</p>
    <nav class="quick-nav" aria-label="Jelajahi cepat">
      <a href="#/population">👥 Penduduk</a>
      <a href="#/economy">📈 Ekonomi</a>
      <a href="#/health">❤️ Kesehatan</a>
      <a href="#/education">🎓 Pendidikan</a>
      <a href="#/regions">🗺️ 38 Provinsi</a>
    </nav>
    <p class="hero-facts"><strong>281,6 juta</strong> penduduk &nbsp;•&nbsp; <strong>5,03%</strong> pertumbuhan PDB &nbsp;•&nbsp; <strong>9,03%</strong> kemiskinan, terendah sepanjang sejarah &nbsp;•&nbsp; <strong>IPM 75,02</strong></p>
  </section>
  ${kpiCards()}
  ${mapSection(state.mapMetric || 'population', 'home-map-metric')}
  <section class="card">
    <h2>Tren Nasional</h2>
    ${chartControls('home', ['population', 'gdpGrowth', 'inflation', 'unemployment', 'poverty', 'lifeExpectancy', 'hdi'], key, state.chart || 'line')}
    <p class="big-number">${fmt(latest)} <span>${esc(s.unit)}</span></p>
    <p class="delta">${esc(s.label)} 2024 — ${deltaTxt}</p>
    ${chart}
    ${sourceLine(s)}
  </section>
  <section class="card-grid">
    <article class="card"><h2>Siapa yang tinggal di mana?</h2>
      <p>Jawa Barat adalah provinsi terpadat dengan 49,9 juta jiwa; Kalimantan Utara paling sedikit, 0,76 juta jiwa. Lihat tabel lengkap 38 provinsi.</p>
      <a class="btn" href="#/regions">Buka data provinsi →</a></article>
    <article class="card"><h2>Ekonomi tumbuh 5,03%</h2>
      <p>PDB 2024 tumbuh 5,03% dengan inflasi hanya 1,57% — terendah dalam satu dekade. Industri pengolahan tetap penyumbang terbesar.</p>
      <a class="btn" href="#/economy">Buka data ekonomi →</a></article>
    <article class="card"><h2>Kemiskinan di bawah 10%</h2>
      <p>Tingkat kemiskinan turun ke 9,03% pada Maret 2024, pertama kalinya di bawah satu digit dalam sejarah pencatatan BPS.</p>
      <a class="btn" href="#/health">Buka data kesehatan →</a></article>
  </section>`;
}

export function populationPage(state) {
  const key = state.metric || 'population';
  const s = SERIES[key];
  const chart = state.chart === 'bar'
    ? barChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit })
    : lineChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit });
  const yr = state.year || 2024;
  const idx = YEARS.indexOf(yr);
  const popVal = SERIES.population.values[idx];
  const popPrev = idx > 0 ? SERIES.population.values[idx - 1] : null;
  const growth = popPrev !== null ? (((popVal - popPrev) / popPrev) * 100) : 0;
  const yearOpts = YEARS.map((y) => `<option value="${y}"${y === yr ? ' selected' : ''}>${y}</option>`).join('');
  const pyrYear = state.pyramidYear || 2024;
  const pyr = PYRAMID[pyrYear];
  const pyrOpts = Object.keys(PYRAMID).map((y) => `<option value="${y}"${Number(y) === pyrYear ? ' selected' : ''}>${y}</option>`).join('');
  const maleTotal = pyr.male.reduce((a, b) => a + b, 0);
  const femaleTotal = pyr.female.reduce((a, b) => a + b, 0);
  return `<h1>Penduduk</h1>
  <p class="lede">Indonesia adalah negara terpadat keempat di dunia. Pertumbuhan penduduk melambat
  dari sekitar 1,5% per tahun pada 2015 menjadi sekitar 1,0% pada 2024.</p>
  <section class="card">
    <h2>Jumlah penduduk, 2015–2024</h2>
    ${chartControls('pop', ['population', 'lifeExpectancy', 'literacy'], state.metric || 'population', state.chart || 'line')}
    ${chart}
    ${sourceLine(SERIES[state.metric || 'population'])}
  </section>
  <section class="card-grid">
    <article class="card"><h2>Penduduk per tahun</h2>
      <label>Tahun <select id="pop-year" data-control="year">${yearOpts}</select></label>
      <p class="big-number">${fmt(popVal, 1)} <span>juta jiwa</span></p>
      <p class="delta">${yr === 2015 ? 'Tahun awal seri.' : 'Tumbuh ' + fmt(growth) + '% dibanding ' + (yr - 1) + '.'}</p>
      <p class="source">Sumber: BPS ${yr}.</p></article>
    <article class="card"><h2>Struktur umur 2024</h2>
      ${donutChart({ items: AGE_STRUCTURE.map((a) => ({ label: a.group, value: a.share })), valueKey: 'value', labelKey: 'label', colors: DONUT_COLORS })}
      <p class="source">Sumber: BPS 2024. Bonus demografi: 68,7% penduduk berusia produktif.</p></article>
  </section>
  <section class="card">
    <h2>Piramida Penduduk</h2>
    <p class="card-sub">Bentuk piramida yang melebar di usia muda menunjukkan bonus demografi: penduduk usia produktif jauh lebih banyak daripada anak dan lansia.</p>
    <div class="controls">
      <label>Tahun piramida <select id="pyramid-year" data-control="pyramidYear">${pyrOpts}</select></label>
      <span class="pyr-totals">Laki-laki <strong>${fmt(maleTotal, 1)}%</strong> &nbsp;•&nbsp; Perempuan <strong>${fmt(femaleTotal, 1)}%</strong></span>
    </div>
    ${pyramidChart({ groups: PYRAMID_GROUPS, male: pyr.male, female: pyr.female, year: pyrYear })}
    <p class="source">Sumber: ${esc(pyr.source)}. Persen penduduk per kelompok umur; dibulatkan sehingga jumlahnya 100%.</p>
  </section>`;
}

export function economyPage(state) {
  const key = state.metric || 'gdpGrowth';
  const s = SERIES[key];
  const chart = state.chart === 'bar'
    ? barChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit })
    : lineChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit });
  return `<h1>Ekonomi</h1>
  <p class="lede">PDB Indonesia 2024 mencapai Rp22.139 triliun. Ekonomi tumbuh stabil di atas 5%
  selama tiga tahun berturut-turut, dengan inflasi yang terjaga rendah.</p>
  <section class="card">
    <h2>Tren ekonomi, 2015–2024</h2>
    ${chartControls('econ', ['gdpGrowth', 'gdpPerCapita', 'inflation', 'unemployment', 'poverty'], key, state.chart || 'line')}
    ${chart}
    ${sourceLine(s)}
  </section>
  <section class="card-grid">
    <article class="card"><h2>Sektor penyumbang PDB 2024</h2>
      ${hbarChart({ items: SECTORS, valueKey: 'share', labelKey: 'name', unit: '%' })}
      <p class="source">Sumber: BPS 2024, pangsa PDB harga berlaku.</p></article>
    <article class="card"><h2>Tujuan ekspor utama 2024</h2>
      ${hbarChart({ items: TRADE_PARTNERS, valueKey: 'share', labelKey: 'country', unit: '%', color: '#059669' })}
      <p class="source">Sumber: BPS 2024, pangsa nilai ekspor nonmigas dan migas.</p>
      <h3 style="margin-top:1.2rem">Fakta cepat</h3>
      <ul class="facts">
        <li><strong>Rp22.139 triliun</strong> — PDB harga berlaku 2024 (BPS).</li>
        <li><strong>US$4.960</strong> — PDB per kapita 2024 (BPS &amp; Bank Indonesia).</li>
        <li><strong>2,61% → 1,57%</strong> — inflasi turun dari 2023 ke 2024 (BPS).</li>
        <li><strong>4,82%</strong> — pengangguran terendah sejak 2015 (BPS, Agustus 2024).</li>
      </ul></article>
  </section>`;
}

export function healthPage(state) {
  const key = state.metric || 'lifeExpectancy';
  const s = SERIES[key];
  const chart = state.chart === 'bar'
    ? barChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit })
    : lineChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit });
  return `<h1>Kesehatan</h1>
  <p class="lede">Harapan hidup naik dari 71,1 tahun (2015) menjadi 74,2 tahun (2024).
  Kemiskinan — yang erat kaitannya dengan gizi dan akses layanan kesehatan — turun ke 9,03%.</p>
  <section class="card">
    <h2>Tren kesehatan, 2015–2024</h2>
    ${chartControls('health', ['lifeExpectancy', 'poverty', 'hdi'], key, state.chart || 'line')}
    ${chart}
    ${sourceLine(s)}
  </section>
  <section class="card-grid">
    <article class="card"><h2>Angka kunci 2024</h2>
      <ul class="facts">
        <li><strong>74,2 tahun</strong> — harapan hidup saat lahir (BPS 2024).</li>
        <li><strong>75,02</strong> — Indeks Pembangunan Manusia (BPS 2024).</li>
        <li><strong>9,03%</strong> — penduduk miskin, terendah sepanjang sejarah (BPS, Maret 2024).</li>
        <li><strong>6,8%</strong> — penduduk lansia 65 tahun ke atas (BPS 2024).</li>
      </ul></article>
    <article class="card"><h2>Mengapa ini penting?</h2>
      <p>Harapan hidup adalah salah satu dari tiga komponen IPM, bersama pendidikan dan
      standar hidup layak. Kenaikan 3,1 tahun dalam satu dekade mencerminkan perbaikan
      gizi, sanitasi, dan akses layanan kesehatan dasar di seluruh provinsi.</p>
      <p class="source">Sumber: BPS 2024; Kementerian Kesehatan RI.</p></article>
  </section>`;
}

export function educationPage(state) {
  const key = state.metric || 'literacy';
  const s = SERIES[key];
  const chart = state.chart === 'bar'
    ? barChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit })
    : lineChart({ years: YEARS, values: s.values, label: s.label, unit: s.unit });
  return `<h1>Pendidikan</h1>
  <p class="lede">Melek huruf penduduk usia 15 tahun ke atas mencapai 96,9% pada 2024.
  Rata-rata lama sekolah naik seiring wajib belajar 12 tahun dan perluasan akses perguruan tinggi.</p>
  <section class="card">
    <h2>Tren pendidikan, 2015–2024</h2>
    ${chartControls('edu', ['literacy', 'hdi', 'lifeExpectancy'], key, state.chart || 'line')}
    ${chart}
    ${sourceLine(s)}
  </section>
  <section class="card-grid">
    <article class="card"><h2>Angka kunci 2024</h2>
      <ul class="facts">
        <li><strong>96,9%</strong> — angka melek huruf usia 15+ (BPS 2024).</li>
        <li><strong>75,02</strong> — IPM, dengan komponen pendidikan yang terus membaik (BPS 2024).</li>
        <li><strong>68,7%</strong> — penduduk usia produktif, sebagian besar lulusan sekolah menengah (BPS 2024).</li>
      </ul></article>
    <article class="card"><h2>Apa yang diukur?</h2>
      <p>Angka melek huruf mengukur penduduk usia 15 tahun ke atas yang dapat membaca dan
      menulis huruf Latin atau huruf lainnya. IPM memakai rata-rata lama sekolah dan harapan
      lama sekolah sebagai komponen pendidikannya.</p>
      <p class="source">Sumber: BPS 2024; Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi.</p></article>
  </section>`;
}

export function regionsPage(state) {
  const q = (state.q || '').toLowerCase();
  const island = state.island || 'Semua';
  const sortKey = state.sort || 'population';
  const sortDir = state.dir || 'desc';
  let rows = PROVINCES.filter((p) => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.island.toLowerCase().includes(q);
    const matchIsland = island === 'Semua' || p.island === island;
    return matchQ && matchIsland;
  });
  const val = (p) => (sortKey === 'density' ? (p.population * 1000) / p.area : p[sortKey]);
  rows = [...rows].sort((a, b) => (sortDir === 'asc' ? val(a) - val(b) : val(b) - val(a)));
  const islands = ['Semua', ...new Set(PROVINCES.map((p) => p.island))];
  const islandOpts = islands.map((i) => `<option${i === island ? ' selected' : ''}>${i}</option>`).join('');
  const totalPop = PROVINCES.reduce((s, p) => s + p.population, 0);
  const th = (key, label) => {
    const arrow = sortKey === key ? (sortDir === 'desc' ? ' ▼' : ' ▲') : '';
    return `<th><button type="button" data-sort="${key}">${label}${arrow}</button></th>`;
  };
  return `<h1>Provinsi</h1>
  <p class="lede">38 provinsi Indonesia — sekitar 282 juta jiwa penduduk (estimasi 2024;
  jumlah angka provinsi yang dibulatkan dapat sedikit berbeda dari total nasional 281,6 juta jiwa).
  Cari nama provinsi, saring per kepulauan, dan klik judul kolom untuk mengurutkan.</p>
  ${mapSection(state.mapMetric || 'population', 'regions-map-metric')}
  <section class="card">
    <div class="controls">
      <label>Cari provinsi <input id="region-search" type="search" data-control="search" value="${esc(state.q || '')}" placeholder="mis. Jawa Barat"></label>
      <label>Kepulauan <select id="region-island" data-control="island">${islandOpts}</select></label>
      ${state.q ? `<button type="button" class="btn btn-ghost" data-clear-filter>Hapus filter ✕</button>` : ''}
    </div>
    <p class="result-count">${rows.length} dari 38 provinsi ditampilkan.</p>
    <div class="table-wrap"><table>
      <thead><tr>
        ${th('name', 'Provinsi')}
        ${th('island', 'Kepulauan')}
        ${th('population', 'Penduduk (ribu)')}
        ${th('area', 'Luas (km²)')}
        ${th('density', 'Kepadatan (jiwa/km²)')}
        ${th('poverty', 'Kemiskinan (%)')}
        ${th('hdi', 'IPM 2023')}
        ${th('gdpPc', 'PDB/kapita (Rp jt)')}
      </tr></thead>
      <tbody>${rows.map((p) => `<tr>
        <td><strong>${esc(p.name)}</strong></td>
        <td>${esc(p.island)}</td>
        <td class="num">${fmtInt(p.population)}</td>
        <td class="num">${fmtInt(p.area)}</td>
        <td class="num">${fmtInt(Math.round((p.population * 1000) / p.area))}</td>
        <td class="num">${fmt(p.poverty)}</td>
        <td class="num">${fmt(p.hdi)}</td>
        <td class="num">${fmt(p.gdpPc, 1)}</td>
      </tr>`).join('') || '<tr><td colspan="8">Tidak ada provinsi yang cocok. Coba kata kunci lain.</td></tr>'}</tbody>
    </table></div>
    <p class="source">Sumber: BPS 2024 (penduduk estimasi pertengahan tahun; kemiskinan Maret 2024) dan BPS 2023 (PDB per kapita). Kepadatan dihitung dari penduduk dibagi luas. Angka dibulatkan — lihat Tentang.</p>
  </section>`;
}

export function aboutPage() {
  return `<h1>Tentang</h1>
  <p class="lede">Statistik Nusantara adalah situs statistik nasional Indonesia yang disusun
  secara independen untuk keperluan edukasi. Situs ini bukan situs resmi pemerintah dan
  tidak berafiliasi dengan Badan Pusat Statistik atau instansi mana pun.</p>
  <section class="card">
    <h2>Indonesia sekilas</h2>
    <ul class="facts">
      ${COUNTRY_FACTS.map((f) => `<li><strong>${esc(f.value)}</strong> — ${esc(f.label)} (${esc(f.source)}).</li>`).join('')}
    </ul>
  </section>
  <section class="card">
    <h2>Sumber data</h2>
    <ul class="facts">
      <li><strong>BPS — Badan Pusat Statistik</strong>: penduduk, PDB, inflasi, pengangguran, kemiskinan, harapan hidup, melek huruf, IPM, data provinsi (2023–2024).</li>
      <li><strong>Bank Indonesia</strong>: PDB per kapita dalam dolar AS dan indikator moneter (2024).</li>
      <li><strong>World Bank</strong>: pembanding internasional dan definisi indikator (2023).</li>
      <li><strong>Kementerian Kesehatan RI</strong>: konteks layanan kesehatan.</li>
      <li><strong>Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</strong>: konteks pendidikan.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Metodologi</h2>
    <ul class="facts">
      <li>Semua grafik digambar dari data yang tertanam di situs ini — tidak ada data yang diambil dari internet saat halaman dibuka.</li>
      <li>Angka provinsi adalah estimasi pertengahan tahun 2024 yang dibulatkan ke ribuan jiwa; kepadatan dihitung dari penduduk dibagi luas wilayah.</li>
      <li>Seri tahunan 2015–2024 memakai definisi BPS yang berlaku pada tahun terbitnya; revisi BPS di tahun berikutnya dapat mengubah angka historis.</li>
      <li>Angka 2024 untuk beberapa indikator adalah angka sementara atau hasil proyeksi BPS.</li>
      <li>Nilai dalam dolar AS memakai kurs rata-rata tahun berjalan.</li>
    </ul>
  </section>
  <section class="card">
    <h2>Kontak &amp; lisensi</h2>
    <p>Situs ini dibuat sebagai entri kompetisi make.fun "Make the best national statistics site".
    Kode situs berlisensi MIT. Data yang ditampilkan adalah data publik dari sumber-sumber di atas.</p>
  </section>`;
}

export function notFound() {
  return `<h1>Halaman tidak ditemukan</h1>
  <p class="lede">Tautan yang Anda buka tidak ada di situs ini.</p>
  <p><a class="btn" href="#/">Kembali ke beranda →</a></p>`;
}
