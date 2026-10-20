# Validasi ide: forecast karhutla Indonesia + bukti on-chain (Track 4)

Tanggal riset: 20 Okt 2026. Sumber: Scopus Search + Abstract Retrieval API (Elsevier), berita via Lightpanda. Catatan batas: yang dibaca hanya abstrak, bukan full text. Jumlah hasil adalah jumlah dokumen Scopus 2020+ untuk query yang dipakai, bukan ukuran kualitas.

## 1. Apa yang literatur bilang

| Pertanyaan | Temuan | Sumber |
|---|---|---|
| Apakah prediksi api gambut dengan ML sudah ada? | Ramai. 33 dokumen untuk query peat+fire+ML+Indonesia. XGBoost/RF/LSTM/LightGBM sudah standar. Sudah ada paket R `peatfr` (2025) untuk forecast risiko api gambut (ARIMA, LSTM, GRU). | Ecol. Informatics 2025 (10.1016/j.ecoinf.2025.103532); JAG 2025 (10.1016/j.jag.2025.104435); Earth Space Sci 2021 (10.1029/2021EA001873); Wetl. Ecol. Manag. 2025 (10.1007/s11273-025-10058-z) |
| Seberapa bagus prediksi hotspot? | Terbatas. Model Bayesian untuk hotspot Kalimantan naik dari R² 28,6% ke 61,1% setelah perbaikan. Artinya skill nyata sedang, bukan tinggi. | Atmosphere 2023 (10.3390/atmos14020286) |
| Pendorong utama | ENSO/IOD, curah hujan, muka air tanah, drainase gambut. Indeks kekeringan-api yang memakai muka air tanah lebih baik dari indeks cuaca saja. Tahun El Nino berkorelasi kuat dengan lonjakan api. | Agric. For. Meteorol. 2022 (10.1016/j.agrformet.2021.108738); JGR Atmos 2023 (10.1029/2023JD039688) |
| Biaya | Kebakaran 2015 merugikan sekitar US$28 miliar; enam kebakaran terbesar 2004-2015 sekitar US$93,9 miliar. Restorasi gambut yang sudah selesai akan menurunkan CO2 18%, PM2.5 24%, mencegah sekitar 12.000 kematian dini. | Nat. Commun. 2021 (10.1038/s41467-021-27353-x) |
| Dampak ke tetangga | Dampak ekonomi haze 2015 ke Singapura sudah dikuantifikasi (kesehatan, pariwisata, produktivitas). | J. Asian Econ. 2021 (10.1016/j.asieco.2021.101329) |
| Data emisi kebakaran dipercaya? | Tidak seragam. Inventori emisi global berbeda besar di Indonesia (bias spasial dan ketidakpastian). | Remote Sens. Environ. 2020 (10.1016/j.rse.2019.111557) |
| Blockchain untuk kebakaran/kehutanan | Ada systematic review: tiga domain, yaitu manajemen hutan, traceability produk hutan, deteksi kebakaran. Aplikasi nyata untuk forecast/haze hampir tidak ada. Literatur blockchain+MRV iklim besar (622 dokumen) tetapi fokus energi, bangunan, karbon. | Appl. Sci. 2022 (10.3390/app12083723); Build. Environ. 2021 (10.1016/j.buildenv.2021.108199) |
| Atribusi ke konsesi/perusahaan | Literatur tipis (11 dokumen), dominan hukum, tata kelola, RSPO. Ini celah, tetapi juga sensitif. | Land 2020; ERL 2022 (10.1088/1748-9326/ac8b96) |

Konteks berita (20 Okt 2026): Singapura menambah perusahaan Indonesia yang dikirimi surat peringatan (dilaporkan 10 perusahaan), label hijau APP di Singapura dibatasi sementara dengan kewajiban lapor kebakaran harian, penerbangan Malaysia-Singapura sempat dibatalkan, asap Kalimantan mencapai Malaysia dan Singapura (detik, Kompas, CNBC Indonesia, Disway, Koran Jakarta).

## 2. Verdict

Ide "ML memprediksi api gambut" saja tidak cukup untuk menang: sudah ramai dan tidak baru. Yang masih belum terisi di literatur adalah gabungan (a) forecast yang jujur soal ketidakpastian, (b) jejak bukti yang tidak bisa diubah belakangan, dan (c) skor akurasi publik. Jadi yang layak dijual adalah akuntabilitas forecast, bukan akurasi model.

Usulan bentuk: commit-reveal forecast. Setiap hari/minggu sistem mengeluarkan risiko hotspot per provinsi (interval P10/P50/P90). Hash forecast, hash data, dan CID IPFS dicatat on-chain sebelum kejadian. Setelah periode selesai, hotspot aktual (NASA FIRMS) dibandingkan dan skor hit/miss dipublikasikan. Ini penggunaan blockchain yang masuk akal: bukti waktu bahwa prediksi dibuat sebelum kejadian.

## 3. SWOT

**Strengths**
- Masalah nyata, sedang viral, dampak terukur (US$28 miliar, 12.000 kematian dini pada 2015).
- Fit dengan Track 4 (verifikasi data iklim, tools riset) dan kriteria Climate Impact.
- Commit-reveal membedakan dari puluhan paper ML yang tidak punya jejak audit.
- Relevan secara lokal dan regional; mudah diceritakan di video.
- `ForecastRegistry.sol` dan tes dasar sudah ada di starter kit.

**Weaknesses**
- Dataset di zip Topik 6 tidak cocok: Climate TRACE di zip adalah emisi tahunan per negara (16 negara x 11 tahun), terlalu kasar untuk karhutla. Perlu data baru (hotspot harian NASA FIRMS, curah hujan CHIRPS/BMKG, indeks ENSO/IOD, muka air gambut jika ada).
- Skill prediksi hotspot terbatas (R² sekitar 0,6 pada studi terbaik di abstrak yang dibaca). Klaim akurasi harus kecil dan jujur.
- Sisa waktu sekitar 5 hari; model, kontrak, dashboard, dan video harus selesai.
- Hash on-chain hanya membuktikan "ini yang dipublikasikan pada waktu itu", bukan bahwa model benar.

**Opportunities**
- Berita saat ini membuat juri mudah relate; isu lintas negara menarik perhatian IEEE internasional.
- Celah literatur: forecast terverifikasi + skor publik; atribusi hotspot-konsesi masih tipis.
- Tautan ke pasar karbon: emisi dari prediksi luas terbakar x faktor emisi gambut; restorasi gambut sebagai kredit (Track 1 sebagai cerita lanjutan).
- Bisa dijalankan terus setelah hackathon (track record yang menumpuk adalah aset).

**Threats**
- Kompetitor: BMKG, SiPongi KLHK, ASMC, Global Forest Watch, dan paket seperti `peatfr` sudah ada; juri mungkin bertanya "apa bedanya".
- Risiko hukum/politik bila dibingkai sebagai penuduhan perusahaan; hotspot di konsesi bukan bukti kesalahan.
- Hotspot satelit bukan sama dengan kebakaran (awan, asap, overpass); validasi bisa berisik.
- Juri bisa menilai blockchain sebagai tempelan bila tidak ada alasan jelas.
- Aturan keikutsertaan di Devpost saling bertentangan (siswa saja vs terbuka) dan belum dijawab panitia.

## 4. Pro dan kontra (berdasarkan verdict paper)

| Pro | Kontra |
|---|---|
| Driver dan metode sudah mapan, risiko riset rendah (RF/XGBoost/LSTM terbukti dipakai) | Tidak baru; mudah dianggap duplikat |
| Data publik gratis (NASA FIRMS, CHIRPS, NOAA ENSO) | Perlu pipeline data baru, bukan dataset di zip |
| Dampak ekonomi dan kesehatan terdokumentasi, memperkuat Climate Impact | Skill forecast sedang; harus pakai interval dan baseline |
| Commit-reveal memberi alasan teknis nyata untuk blockchain | Hash bukan bukti kebenaran model |
| Cerita regional kuat (Singapura, Malaysia, label APP) | Sensitif bila menyentuh atribusi perusahaan |
| Kontrak dasar sudah ada, tinggal deploy ke Polygon Amoy | Waktu sekitar 5 hari |

## 5. Rekomendasi scope (5 hari)

1. Satu wilayah dulu (Sumatera Selatan dan Kalimantan Barat atau Riau), horizon 7 hari, level provinsi/kabupaten.
2. Baseline wajib: persistensi dan klimatologi musiman. Model: XGBoost atau LightGBM dengan lag hotspot, curah hujan, dry-spell, ENSO/IOD. Split berdasarkan waktu. Laporkan skill terhadap baseline.
3. Quantile output (P10/P50/P90), model card, batasan yang jujur.
4. `ForecastRegistry` di Polygon Amoy + halaman verifikasi publik + skor hit/miss historis (backtest) dan live.
5. Lewati atribusi perusahaan; sebut sebagai roadmap dengan kerangka hati-hati.
6. Video 3 menit: berita -> forecast -> hash on-chain -> skor.

## 6. Yang belum diverifikasi

- Full text paper (hanya abstrak).
- Ketersediaan dan lisensi peta konsesi, data muka air gambut, dan API SiPongi.
- Apakah panitia akan menjawab soal eligibility dan waktu deadline.
