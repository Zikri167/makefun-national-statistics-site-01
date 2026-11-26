// Statistik Nusantara — data statistik Indonesia, disusun dari publikasi resmi.
// Setiap angka di bawah ini memakai sumber dan tahun yang dicantumkan di sampingnya
// (BPS, Bank Indonesia, World Bank). Angka provinsi adalah estimasi pertengahan tahun
// yang dibulatkan; lihat halaman Tentang untuk metodologi lengkap.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SOURCES = {
  bps: 'BPS — Badan Pusat Statistik',
  bi: 'Bank Indonesia',
  wb: 'World Bank',
  kemkes: 'Kementerian Kesehatan RI',
  kemdikbud: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
};

// Seri tahunan nasional, 2015-2024. Nilai disusun sejajar dengan YEARS.
export const SERIES = {
  population: {
    label: 'Jumlah Penduduk',
    unit: 'juta jiwa',
    source: 'BPS 2024',
    values: [255.6, 258.7, 261.9, 265.0, 268.1, 271.3, 274.0, 275.8, 278.7, 281.6],
    note: 'Hasil Sensus Penduduk 2020 dan proyeksi penduduk BPS.',
  },
  gdpGrowth: {
    label: 'Pertumbuhan Ekonomi (PDB)',
    unit: '% per tahun',
    source: 'BPS 2024',
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
    note: 'Pertumbuhan PDB harga konstan 2010; 2020 terkontraksi karena pandemi COVID-19.',
  },
  gdpPerCapita: {
    label: 'PDB per Kapita',
    unit: 'USD',
    source: 'BPS & Bank Indonesia 2024',
    values: [3346, 3570, 3840, 3927, 4152, 3880, 4349, 4788, 4920, 4960],
    note: 'PDB per kapita atas dasar harga berlaku, dikonversi ke dolar AS.',
  },
  inflation: {
    label: 'Inflasi (y-on-y)',
    unit: '%',
    source: 'BPS 2024',
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    note: 'Inflasi Desember terhadap Desember tahun sebelumnya (IHK).',
  },
  unemployment: {
    label: 'Tingkat Pengangguran Terbuka',
    unit: '%',
    source: 'BPS 2024',
    values: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.45, 4.82],
    note: 'Survei Angkatan Kerja Nasional (Sakernas), Februari/Agustus tiap tahun.',
  },
  poverty: {
    label: 'Tingkat Kemiskinan',
    unit: '% penduduk',
    source: 'BPS 2024',
    values: [11.22, 10.86, 10.64, 9.82, 9.41, 10.19, 9.71, 9.57, 9.36, 9.03],
    note: 'Persentase penduduk di bawah garis kemiskinan, Maret tiap tahun.',
  },
  lifeExpectancy: {
    label: 'Harapan Hidup saat Lahir',
    unit: 'tahun',
    source: 'BPS 2024',
    values: [71.1, 71.3, 71.5, 71.7, 71.9, 72.0, 72.4, 73.0, 73.6, 74.2],
    note: 'Angka harapan hidup (AHH) hasil proyeksi dan survei BPS.',
  },
  literacy: {
    label: 'Angka Melek Huruf (15+)',
    unit: '%',
    source: 'BPS 2024',
    values: [95.2, 95.4, 95.6, 95.7, 95.9, 96.0, 96.1, 96.4, 96.7, 96.9],
    note: 'Penduduk usia 15 tahun ke atas yang dapat membaca dan menulis.',
  },
  hdi: {
    label: 'Indeks Pembangunan Manusia',
    unit: 'skor 0-100',
    source: 'BPS 2024',
    values: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.37, 74.39, 75.02],
    note: 'IPM gabungan kesehatan, pendidikan, dan standar hidup layak.',
  },
};

// Struktur umur 2024 (persen penduduk) — BPS 2024.
export const AGE_STRUCTURE = [
  { group: '0-14 tahun', share: 24.5, note: 'Anak-anak' },
  { group: '15-64 tahun', share: 68.7, note: 'Usia produktif' },
  { group: '65+ tahun', share: 6.8, note: 'Lansia' },
];

// Kontribusi sektor terhadap PDB 2024 (persen) — BPS 2024.
export const SECTORS = [
  { name: 'Industri pengolahan', share: 18.9 },
  { name: 'Perdagangan besar & eceran', share: 13.0 },
  { name: 'Pertanian, kehutanan, perikanan', share: 12.5 },
  { name: 'Konstruksi', share: 9.9 },
  { name: 'Pertambangan & penggalian', share: 8.4 },
  { name: 'Transportasi & pergudangan', share: 6.3 },
  { name: 'Informasi & komunikasi', share: 4.1 },
  { name: 'Jasa keuangan & asuransi', share: 4.0 },
  { name: 'Sektor lainnya', share: 22.9 },
];

// Mitra dagang utama 2024 (pangsa ekspor, persen) — BPS 2024.
export const TRADE_PARTNERS = [
  { country: 'Tiongkok', share: 24.6 },
  { country: 'Amerika Serikat', share: 10.6 },
  { country: 'Jepang', share: 7.6 },
  { country: 'India', share: 6.7 },
  { country: 'Singapura', share: 5.8 },
  { country: 'Malaysia', share: 5.2 },
];

// 38 provinsi. population dalam ribu jiwa (estimasi pertengahan 2024, BPS),
// area dalam km2, poverty persen (Maret 2024, BPS), gdpPc dalam juta rupiah
// per kapita (2023, BPS). Angka dibulatkan; lihat halaman Tentang.
export const PROVINCES = [
  { name: 'Aceh', island: 'Sumatera', population: 5532, area: 57957, poverty: 14.23, gdpPc: 48.2 },
  { name: 'Sumatera Utara', island: 'Sumatera', population: 15663, area: 72981, poverty: 8.15, gdpPc: 62.5 },
  { name: 'Sumatera Barat', island: 'Sumatera', population: 5906, area: 42013, poverty: 5.97, gdpPc: 56.8 },
  { name: 'Riau', island: 'Sumatera', population: 6912, area: 87024, poverty: 6.67, gdpPc: 132.4 },
  { name: 'Jambi', island: 'Sumatera', population: 3711, area: 50058, poverty: 7.58, gdpPc: 68.9 },
  { name: 'Sumatera Selatan', island: 'Sumatera', population: 9024, area: 91592, poverty: 11.78, gdpPc: 69.3 },
  { name: 'Bengkulu', island: 'Sumatera', population: 2109, area: 19935, poverty: 14.43, gdpPc: 45.1 },
  { name: 'Lampung', island: 'Sumatera', population: 9277, area: 34624, poverty: 11.62, gdpPc: 48.7 },
  { name: 'Kepulauan Bangka Belitung', island: 'Sumatera', population: 1524, area: 16424, poverty: 4.42, gdpPc: 72.4 },
  { name: 'Kepulauan Riau', island: 'Sumatera', population: 2222, area: 8202, poverty: 5.37, gdpPc: 158.6 },
  { name: 'DKI Jakarta', island: 'Jawa', population: 10702, area: 664, poverty: 4.34, gdpPc: 298.5 },
  { name: 'Jawa Barat', island: 'Jawa', population: 49936, area: 35378, poverty: 7.46, gdpPc: 61.2 },
  { name: 'Jawa Tengah', island: 'Jawa', population: 37993, area: 32801, poverty: 10.47, gdpPc: 52.3 },
  { name: 'DI Yogyakarta', island: 'Jawa', population: 3822, area: 3134, poverty: 10.83, gdpPc: 55.9 },
  { name: 'Jawa Timur', island: 'Jawa', population: 41814, area: 47799, poverty: 10.35, gdpPc: 74.8 },
  { name: 'Banten', island: 'Jawa', population: 12364, area: 9663, poverty: 5.84, gdpPc: 79.6 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', population: 4410, area: 5780, poverty: 4.25, gdpPc: 71.5 },
  { name: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', population: 5660, area: 18572, poverty: 12.11, gdpPc: 38.4 },
  { name: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', population: 5724, area: 48718, poverty: 19.96, gdpPc: 27.9 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', population: 5804, area: 147307, poverty: 6.74, gdpPc: 55.3 },
  { name: 'Kalimantan Tengah', island: 'Kalimantan', population: 2879, area: 153565, poverty: 5.11, gdpPc: 74.2 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', population: 4319, area: 38744, poverty: 4.29, gdpPc: 71.8 },
  { name: 'Kalimantan Timur', island: 'Kalimantan', population: 4024, area: 127347, poverty: 6.11, gdpPc: 211.7 },
  { name: 'Kalimantan Utara', island: 'Kalimantan', population: 757, area: 75467, poverty: 6.64, gdpPc: 168.9 },
  { name: 'Sulawesi Utara', island: 'Sulawesi', population: 2743, area: 13892, poverty: 7.09, gdpPc: 62.1 },
  { name: 'Sulawesi Tengah', island: 'Sulawesi', population: 3147, area: 61841, poverty: 11.72, gdpPc: 78.5 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', population: 9541, area: 46717, poverty: 8.06, gdpPc: 68.4 },
  { name: 'Sulawesi Tenggara', island: 'Sulawesi', population: 2838, area: 38068, poverty: 11.04, gdpPc: 66.7 },
  { name: 'Gorontalo', island: 'Sulawesi', population: 1231, area: 11257, poverty: 15.15, gdpPc: 41.3 },
  { name: 'Sulawesi Barat', island: 'Sulawesi', population: 1610, area: 16788, poverty: 11.27, gdpPc: 43.6 },
  { name: 'Maluku', island: 'Maluku & Papua', population: 1983, area: 46914, poverty: 16.42, gdpPc: 34.8 },
  { name: 'Maluku Utara', island: 'Maluku & Papua', population: 1406, area: 31983, poverty: 6.28, gdpPc: 78.9 },
  { name: 'Papua', island: 'Maluku & Papua', population: 1131, area: 82406, poverty: 21.49, gdpPc: 68.2 },
  { name: 'Papua Pegunungan', island: 'Maluku & Papua', population: 1492, area: 51311, poverty: 34.79, gdpPc: 19.4 },
  { name: 'Papua Selatan', island: 'Maluku & Papua', population: 580, area: 118811, poverty: 18.25, gdpPc: 41.7 },
  { name: 'Papua Tengah', island: 'Maluku & Papua', population: 1352, area: 61446, poverty: 29.69, gdpPc: 88.3 },
  { name: 'Papua Barat', island: 'Maluku & Papua', population: 573, area: 64029, poverty: 20.03, gdpPc: 72.6 },
  { name: 'Papua Barat Daya', island: 'Maluku & Papua', population: 618, area: 38308, poverty: 17.35, gdpPc: 118.4 },
];

export const KPI_2024 = [
  { key: 'population', value: '281,6 jt', label: 'Penduduk', source: 'BPS 2024' },
  { key: 'gdpGrowth', value: '5,03%', label: 'Pertumbuhan PDB', source: 'BPS 2024' },
  { key: 'inflation', value: '1,57%', label: 'Inflasi', source: 'BPS 2024' },
  { key: 'unemployment', value: '4,82%', label: 'Pengangguran', source: 'BPS 2024' },
  { key: 'poverty', value: '9,03%', label: 'Kemiskinan', source: 'BPS 2024' },
  { key: 'lifeExpectancy', value: '74,2 thn', label: 'Harapan Hidup', source: 'BPS 2024' },
  { key: 'literacy', value: '96,9%', label: 'Melek Huruf', source: 'BPS 2024' },
  { key: 'hdi', value: '75,02', label: 'IPM', source: 'BPS 2024' },
];

export const COUNTRY_FACTS = [
  { label: 'Luas daratan', value: '1,9 juta km²', source: 'BPS 2024' },
  { label: 'Jumlah pulau', value: '17.508 pulau', source: 'BPS 2024' },
  { label: 'Ibu kota', value: 'Jakarta (Nusantara dalam pembangunan)', source: 'UU IKN 2022' },
  { label: 'Bahasa resmi', value: 'Bahasa Indonesia', source: 'UUD 1945' },
  { label: 'Mata uang', value: 'Rupiah (IDR)', source: 'Bank Indonesia' },
  { label: 'Zona waktu', value: 'WIB, WITA, WIT', source: 'Keppres 41/1987' },
];

export function fmt(n, digits = 2) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtInt(n) {
  return n.toLocaleString('id-ID');
}
