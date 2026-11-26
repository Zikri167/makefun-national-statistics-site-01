// Statistik Nusantara — pembuat grafik SVG murni (tanpa library, tanpa network).
// Semua grafik digambar dari data yang di-embed di data.js.

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const s = nice * mag;
  const lo = Math.floor(min / s) * s;
  const out = [];
  for (let v = lo; v <= max + s * 0.001; v += s) out.push(v);
  return out;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

export function lineChart({ years, values, label, unit, color = '#0e7490', height = 260 }) {
  const W = 640, H = height, PL = 56, PR = 16, PT = 14, PB = 30;
  const min = Math.min(...values), max = Math.max(...values);
  const pad = (max - min) * 0.12 || 1;
  const lo = min - pad, hi = max + pad;
  const x = (i) => PL + (i * (W - PL - PR)) / (years.length - 1);
  const y = (v) => PT + ((hi - v) * (H - PT - PB)) / (hi - lo);
  const ticks = niceTicks(lo, hi);
  let grid = '';
  for (const t of ticks) {
    grid += `<line x1="${PL}" y1="${y(t)}" x2="${W - PR}" y2="${y(t)}" stroke="#e2e8f0" stroke-width="1"/>` +
      `<text x="${PL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${esc(fmtTick(t))}</text>`;
  }
  let labels = '';
  years.forEach((yr, i) => {
    if (i % 2 === 0 || i === years.length - 1) {
      const anchor = i === 0 ? 'start' : i === years.length - 1 ? 'end' : 'middle';
      labels += `<text x="${x(i)}" y="${H - 8}" text-anchor="${anchor}" font-size="11" fill="#64748b">${yr}</text>`;
    }
  });
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${PL},${y(lo)} ${pts} ${x(values.length - 1).toFixed(1)},${y(lo)}`;
  const lastLabel = `<text x="${x(values.length - 1)}" y="${Math.max(y(values[values.length - 1]) - 10, 12)}" text-anchor="end" font-size="12" font-weight="700" fill="${color}">${fmtNum(values[values.length - 1])}</text>`;
  let dots = '';
  values.forEach((v, i) => {
    dots += `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${color}"><title>${years[i]}: ${fmtNum(v)} ${esc(unit)}</title></circle>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik garis ${esc(label)}" class="chart-svg">` +
    `<polygon points="${area}" fill="${color}" opacity="0.10"/>` + grid +
    `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` +
    dots + lastLabel + labels + `</svg>`;
}

export function barChart({ years, values, label, unit, color = '#059669', height = 260 }) {
  const W = 640, H = height, PL = 56, PR = 16, PT = 14, PB = 30;
  const min = Math.min(0, ...values), max = Math.max(...values);
  const pad = (max - min) * 0.08 || 1;
  const lo = min - pad * 0.2, hi = max + pad;
  const slot = (W - PL - PR) / years.length;
  const bw = Math.min(34, slot * 0.62);
  const x = (i) => PL + i * slot + (slot - bw) / 2;
  const y = (v) => PT + ((hi - v) * (H - PT - PB)) / (hi - lo);
  const ticks = niceTicks(lo, hi);
  let grid = '';
  for (const t of ticks) {
    grid += `<line x1="${PL}" y1="${y(t)}" x2="${W - PR}" y2="${y(t)}" stroke="#e2e8f0" stroke-width="1"/>` +
      `<text x="${PL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#64748b">${esc(fmtTick(t))}</text>`;
  }
  let bars = '';
  values.forEach((v, i) => {
    const negative = v < 0;
    const top = negative ? y(0) : y(v);
    const h = Math.abs(y(v) - y(0));
    bars += `<rect x="${x(i)}" y="${top}" width="${bw}" height="${Math.max(h, 1)}" rx="3" fill="${negative ? '#dc2626' : color}"><title>${years[i]}: ${fmtNum(v)} ${esc(unit)}</title></rect>` +
      `<text x="${x(i) + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#64748b">${years[i]}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang ${esc(label)}" class="chart-svg">` +
    grid + `<line x1="${PL}" y1="${y(0)}" x2="${W - PR}" y2="${y(0)}" stroke="#94a3b8" stroke-width="1"/>` +
    bars + `</svg>`;
}

export function hbarChart({ items, valueKey, labelKey, unit, color = '#0e7490', heightPer = 30 }) {
  const W = 640, rowH = heightPer, H = items.length * rowH + 12;
  const max = Math.max(...items.map((d) => d[valueKey]));
  let rows = '';
  items.forEach((d, i) => {
    const y = 6 + i * rowH;
    const w = Math.max(2, ((W - 190) * d[valueKey]) / max);
    // Label panjang dipotong agar tidak tertutup batang; nama lengkap ada di tooltip.
    const lab = d[labelKey].length > 27 ? d[labelKey].slice(0, 26) + '…' : d[labelKey];
    rows += `<text x="0" y="${y + 15}" font-size="12" fill="#334155"><title>${esc(d[labelKey])}</title>${esc(lab)}</text>` +
      `<rect x="180" y="${y + 2}" width="${w}" height="18" rx="3" fill="${color}"/>` +
      `<text x="${186 + w}" y="${y + 16}" font-size="12" fill="#0f172a">${fmtNum(d[valueKey])}${unit ? ' ' + esc(unit) : ''}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang horizontal" class="chart-svg">${rows}</svg>`;
}

export function donutChart({ items, valueKey, labelKey, colors, interactive = false, highlight = null }) {
  const size = 220, cx = 110, cy = 110, r = 82, inner = 52;
  const total = items.reduce((s, d) => s + d[valueKey], 0);
  let angle = -Math.PI / 2, paths = '', legend = '';
  const hl = highlight !== null && highlight >= 0 && highlight < items.length ? highlight : null;
  items.forEach((d, i) => {
    const frac = d[valueKey] / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const dim = hl !== null && hl !== i ? ' donut-dim' : '';
    const click = interactive ? ` data-donut="${i}"` : '';
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${colors[i % colors.length]}" class="donut-slice${dim}"${click}><title>${esc(d[labelKey])}: ${fmtNum(d[valueKey])}% — klik untuk menyorot</title></path>`;
    const row = `<span class="swatch" style="background:${colors[i % colors.length]}"></span>${esc(d[labelKey])} — <strong>${fmtNum(d[valueKey])}%</strong>`;
    legend += interactive
      ? `<li><button type="button" class="legend-btn${hl === i ? ' active' : ''}" data-donut="${i}" aria-pressed="${hl === i}">${row}</button></li>`
      : `<li>${row}</li>`;
  });
  const centerMain = hl !== null ? fmtNum(items[hl][valueKey]) + '%' : fmtNum(total, 1) + '%';
  const centerSub = hl !== null ? 'dari PDB' : 'total';
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Diagram donat" class="donut-svg">${paths}` +
    `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="700" fill="#0f172a">${centerMain}</text>` +
    `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#64748b">${esc(centerSub)}</text></svg>` +
    `<ul class="legend">${legend}</ul></div>`;
}

// Garis tren mini untuk kartu KPI: seri 2015-2024 sebagai SVG kecil.
export function sparkline(values, color = '#0e7490') {
  const W = 120, H = 34, P = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const span = (max - min) || 1;
  const x = (i) => P + (i * (W - 2 * P)) / (values.length - 1);
  const y = (v) => P + ((max - v) * (H - 2 * P)) / span;
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" class="spark" role="img" aria-label="Tren 2015–2024" preserveAspectRatio="none">` +
    `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<circle cx="${x(values.length - 1)}" cy="${y(last)}" r="3" fill="${color}"/></svg>`;
}

// Piramida penduduk: batang horizontal dua arah, laki-laki ke kiri,
// perempuan ke kanan, per kelompok umur. Nilai dalam persen penduduk.
export function pyramidChart({ groups, male, female, year }) {
  const W = 640, labelW = 52, rowH = 21, PT = 30, PB = 8;
  const H = PT + groups.length * rowH + PB;
  const cx = W / 2;
  const max = Math.max(...male, ...female);
  const half = (W - labelW * 2) / 2 - 14;
  const w = (v) => (v / max) * half;
  const maleColor = '#0e7490', femaleColor = '#be185d';
  // Celah tengah 46px memberi ruang label kelompok umur tanpa tertutup batang.
  const GAP = 23;
  let rows = '';
  groups.forEach((g, i) => {
    const y = PT + i * rowH;
    const mw = w(male[i]), fw = w(female[i]);
    rows += `<rect x="${(cx - GAP - mw).toFixed(1)}" y="${y + 2}" width="${mw.toFixed(1)}" height="15" rx="2" fill="${maleColor}"><title>${esc(g)} laki-laki: ${fmtNum(male[i])}%</title></rect>` +
      `<rect x="${cx + GAP}" y="${y + 2}" width="${fw.toFixed(1)}" height="15" rx="2" fill="${femaleColor}"><title>${esc(g)} perempuan: ${fmtNum(female[i])}%</title></rect>` +
      `<text x="${cx}" y="${y + 14}" text-anchor="middle" font-size="11" fill="#0f172a" font-weight="600">${esc(g)}</text>` +
      `<text x="${(cx - GAP - 4 - mw).toFixed(1)}" y="${y + 14}" text-anchor="end" font-size="10.5" fill="#334155">${fmtNum(male[i])}%</text>` +
      `<text x="${(cx + GAP + 4 + fw).toFixed(1)}" y="${y + 14}" font-size="10.5" fill="#334155">${fmtNum(female[i])}%</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Piramida penduduk ${year}" class="chart-svg">` +
    `<text x="${cx - GAP}" y="14" text-anchor="end" font-size="12" font-weight="700" fill="${maleColor}">◀ Laki-laki</text>` +
    `<text x="${cx + GAP}" y="14" font-size="12" font-weight="700" fill="${femaleColor}">Perempuan ▶</text>` +
    `<line x1="${cx}" y1="${PT - 6}" x2="${cx}" y2="${H - PB}" stroke="#cbd5e1" stroke-width="1"/>` +
    rows + `</svg>`;
}

function fmtTick(v) {
  const a = Math.abs(v);
  if (a >= 1000) return v.toLocaleString('id-ID', { maximumFractionDigits: 0 });
  if (a >= 100) return v.toLocaleString('id-ID', { maximumFractionDigits: 0 });
  return v.toLocaleString('id-ID', { maximumFractionDigits: 1 });
}

function fmtNum(v, digits) {
  return v.toLocaleString('id-ID', {
    minimumFractionDigits: digits ?? (Number.isInteger(v) ? 0 : 2),
    maximumFractionDigits: digits ?? 2,
  });
}
