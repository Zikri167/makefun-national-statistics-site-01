// Statistik Nusantara — peta ubin (tile-grid) 38 provinsi.
// Setiap provinsi digambar sebagai satu ubin berlabel dalam grid yang
// kira-kira mengikuti bentuk kepulauan Indonesia: Sumatera miring dari
// barat laut ke tenggara, Jawa memanjang di bawahnya, Kalimantan di utara
// Jawa, Sulawesi di timur, dan Maluku–Papua di ujung timur. Ubin diwarnai
// menurut metrik yang dipilih; klik ubin menyaring tabel provinsi.

import { PROVINCES, fmt, fmtInt } from './data.js';

// Posisi ubin (baris, kolom) di grid 7 baris x 16 kolom.
const TILES = {
  'Aceh': [0, 0], 'Sumatera Utara': [1, 1], 'Sumatera Barat': [2, 2],
  'Riau': [2, 4], 'Jambi': [3, 3], 'Sumatera Selatan': [3, 4],
  'Bengkulu': [4, 2], 'Lampung': [4, 4], 'Kepulauan Bangka Belitung': [3, 6],
  'Kepulauan Riau': [2, 5], 'Banten': [5, 4], 'DKI Jakarta': [5, 5],
  'Jawa Barat': [5, 6], 'Jawa Tengah': [5, 7], 'DI Yogyakarta': [6, 7],
  'Jawa Timur': [5, 8], 'Bali': [5, 9], 'Nusa Tenggara Barat': [6, 9],
  'Nusa Tenggara Timur': [6, 10], 'Kalimantan Barat': [2, 7],
  'Kalimantan Tengah': [2, 8], 'Kalimantan Selatan': [3, 8],
  'Kalimantan Timur': [2, 9], 'Kalimantan Utara': [1, 9],
  'Sulawesi Utara': [2, 11], 'Gorontalo': [3, 11], 'Sulawesi Tengah': [3, 10],
  'Sulawesi Barat': [4, 10], 'Sulawesi Selatan': [4, 11],
  'Sulawesi Tenggara': [4, 12], 'Maluku Utara': [1, 13], 'Maluku': [4, 13],
  'Papua Barat Daya': [2, 14], 'Papua Barat': [3, 14], 'Papua': [2, 15],
  'Papua Pegunungan': [3, 15], 'Papua Tengah': [4, 15], 'Papua Selatan': [4, 14],
};

// Label singkat agar muat di ubin; nama yang panjang memakai dua baris.
const SHORT = {
  'Kepulauan Bangka Belitung': ['Babel'], 'Kepulauan Riau': ['Kepri'],
  'DKI Jakarta': ['DKI', 'Jakarta'], 'DI Yogyakarta': ['DIY'],
  'Jawa Barat': ['Jabar'], 'Jawa Tengah': ['Jateng'], 'Jawa Timur': ['Jatim'],
  'Sumatera Utara': ['Sumut'], 'Sumatera Barat': ['Sumbar'],
  'Sumatera Selatan': ['Sumsel'], 'Nusa Tenggara Barat': ['NTB'],
  'Nusa Tenggara Timur': ['NTT'], 'Kalimantan Barat': ['Kalbar'],
  'Kalimantan Tengah': ['Kalteng'], 'Kalimantan Selatan': ['Kalsel'],
  'Kalimantan Timur': ['Kaltim'], 'Kalimantan Utara': ['Kaltara'],
  'Sulawesi Utara': ['Sulut'], 'Sulawesi Tengah': ['Sulteng'],
  'Sulawesi Selatan': ['Sulsel'], 'Sulawesi Tenggara': ['Sultra'],
  'Sulawesi Barat': ['Sulbar'], 'Papua Pegunungan': ['Papua', 'Pgg'],
  'Papua Selatan': ['Papua', 'Sel'], 'Papua Tengah': ['Papua', 'Teng'],
  'Papua Barat Daya': ['Papua', 'B. Daya'], 'Papua Barat': ['Papua', 'Barat'],
  'Maluku Utara': ['Malut'],
};

export const MAP_METRICS = {
  population: { label: 'Jumlah penduduk', unit: 'ribu jiwa', source: 'BPS 2024' },
  poverty: { label: 'Tingkat kemiskinan', unit: '%', source: 'BPS, Maret 2024' },
  hdi: { label: 'Indeks Pembangunan Manusia', unit: 'skor 0–100', source: 'BPS 2023' },
};

const TILE_W = 56, TILE_H = 38, GAP = 3, COLS = 16, ROWS = 7;
const MAP_W = COLS * (TILE_W + GAP) - GAP;
const MAP_H = ROWS * (TILE_H + GAP) - GAP;

// Interpolasi warna antara dua warna heksadesimal.
function lerpColor(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const mix = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return '#' + mix.map((v) => v.toString(16).padStart(2, '0')).join('');
}

function scaleColor(metric, value, min, max) {
  const stops = {
    population: ['#ecfeff', '#67e8f9', '#0891b2', '#155e75'],
    poverty: ['#fef3c7', '#fca5a5', '#dc2626', '#7f1d1d'],
    hdi: ['#fef9c3', '#86efac', '#059669', '#14532d'],
  }[metric];
  let t;
  if (metric === 'population') {
    const lo = Math.log10(Math.max(min, 1)), hi = Math.log10(Math.max(max, 2));
    t = (Math.log10(Math.max(value, 1)) - lo) / (hi - lo || 1);
  } else {
    t = (value - min) / (max - min || 1);
  }
  t = Math.max(0, Math.min(1, t));
  const seg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)));
  const local = t * (stops.length - 1) - seg;
  return lerpColor(stops[seg], stops[seg + 1], local);
}

function metricValue(p, metric) {
  return p[metric];
}

function metricText(p, metric) {
  if (metric === 'population') return `${fmtInt(p.population)} ribu jiwa`;
  if (metric === 'poverty') return `${fmt(p.poverty)}% miskin`;
  return `IPM ${fmt(p.hdi)}`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function provinceMap(metric) {
  const m = MAP_METRICS[metric] ? metric : 'population';
  const values = PROVINCES.map((p) => metricValue(p, m));
  const min = Math.min(...values), max = Math.max(...values);
  let tiles = '';
  for (const p of PROVINCES) {
    const pos = TILES[p.name];
    if (!pos) continue;
    const [r, c] = pos;
    const x = c * (TILE_W + GAP), y = r * (TILE_H + GAP);
    const fill = scaleColor(m, metricValue(p, m), min, max);
    const lines = SHORT[p.name] || [p.name];
    const dark = m === 'population' ? metricValue(p, m) > 9000 : (m === 'poverty' ? metricValue(p, m) > 13 : metricValue(p, m) < 70);
    const fg = dark ? '#ffffff' : '#0f172a';
    const labelSvg = lines.length === 1
      ? `<text x="${x + TILE_W / 2}" y="${y + TILE_H / 2 + 3.5}" text-anchor="middle" font-size="9.5" font-weight="600" fill="${fg}" pointer-events="none">${esc(lines[0])}</text>`
      : lines.map((ln, li) => `<text x="${x + TILE_W / 2}" y="${y + TILE_H / 2 + (li === 0 ? -1 : 11)}" text-anchor="middle" font-size="9" font-weight="600" fill="${fg}" pointer-events="none">${esc(ln)}</text>`).join('');
    tiles += `<g class="map-tile" data-province="${esc(p.name)}" tabindex="0" role="button" aria-label="${esc(p.name)}: ${esc(metricText(p, m))}. Klik untuk menyaring tabel.">` +
      `<rect x="${x}" y="${y}" width="${TILE_W}" height="${TILE_H}" rx="5" fill="${fill}" stroke="#ffffff" stroke-width="1.5"><title>${esc(p.name)} — ${esc(metricText(p, m))} (${esc(MAP_METRICS[m].source)})</title></rect>` +
      labelSvg + `</g>`;
  }
  // Legenda: lima tingkat dari rendah ke tinggi.
  const legendStops = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const v = m === 'population'
      ? Math.round(Math.pow(10, Math.log10(Math.max(min, 1)) + t * (Math.log10(Math.max(max, 2)) - Math.log10(Math.max(min, 1)))))
      : min + t * (max - min);
    const label = m === 'population' ? fmtInt(v) : fmt(v, m === 'hdi' ? 0 : 1);
    return `<span class="legend-step"><span class="swatch" style="background:${scaleColor(m, v, min, max)}"></span>${label}</span>`;
  }).join('');
  return `<div class="map-wrap"><svg viewBox="0 0 ${MAP_W} ${MAP_H}" role="img" aria-label="Peta ubin 38 provinsi Indonesia" class="tile-map">${tiles}</svg>` +
    `<div class="map-legend" aria-label="Legenda peta"><span class="legend-title">${esc(MAP_METRICS[m].label)} (${esc(MAP_METRICS[m].unit)})</span>${legendStops}</div>` +
    `<p class="map-info" id="map-info">Arahkan kursor ke ubin untuk melihat nilainya; klik ubin untuk menyaring tabel provinsi.</p></div>`;
}
