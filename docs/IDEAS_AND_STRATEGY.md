# Ide lanjutan dari Topik 6, dinilai terhadap kriteria hackathon

Tanggal: 20 Okt 2026. Lanjutan dari `RESEARCH_SWOT.md`. Sumber: Scopus (Elsevier API), abstrak saja; berita via Lightpanda. Skor di bagian 3 adalah penilaian saya, bukan data.

## 1. Temuan baru yang mengubah arah

1. **Forecast karhutla sudah punya prior art kuat dan data gratis.** ProbFire (NHESS 2022) adalah sistem peringatan dini probabilistik untuk Indonesia berbasis ECMWF SEAS5 + peta gambut + data hotspot. ECMWF/Copernicus juga membuka dataset fire danger musiman sampai 7 bulan (Sci. Data 2024). Bersaing di "model forecast" adalah jalan yang salah; forecast cukup jadi komponen.
2. **Masalah "buffer pool" kredit karbon adalah masalah besar yang terbukti, dan api adalah penyebab utamanya.** Nature 2026 (10.1038/s41586-026-10571-y): buffer pool program kredit karbon hutan terbesar di AS kemungkinan terlalu kecil rata-rata 6,3 kali (kisaran 2,2 sampai 8,0). Analisis aktuaria California (Front. For. Glob. Change 2022) menyimpulkan buffer pool-nya kurang modal berat. Studi lain mengusulkan akuntansi berbasis probabilitas karena protokol sekarang hanya menghargai stok terukur dan memindahkan risiko ke buffer pool. Semua kajian ini di hutan AS; saya tidak menemukan versi gambut tropis Indonesia di hasil Scopus (8 dokumen untuk query buffer/reversal/permanence + fire).
3. **Insentif desa bersyarat terbukti mengurangi api.** Studi 10 desa di Sumatera (Global Environmental Change 2021, 10.1016/j.gloenvcha.2020.102154) mengevaluasi paket insentif (hadiah bersyarat kinerja) dan sanksi untuk menekan api gambut.
4. **Asuransi parametrik berbasis blockchain untuk Indonesia sudah ada di sektor pertanian** (FarmFund Pool, ICoDSA 2025): pembayaran otomatis dari data cuaca oracle. Ada presedennya, tetapi untuk api belum terlihat.
5. **Deteksi hotspot satelit cukup bagus untuk gambut tetapi tidak sempurna.** VIIRS 375 m: sekitar 80% kecocokan untuk api kecil (< 14 ha), sampai 90% untuk api besar bila memakai cluster buffer dan menggabungkan malam+siang (Int. J. Digital Earth 2020). Oracle satelit bisa dipakai, tetapi harus ada ambang dan ketidakpastian.
6. **Ketersediaan data diuji hari ini:** CHIRPS, NOAA ONI, indeks IOD (DMI), dan Open-Meteo archive bisa diakses tanpa kunci. NASA FIRMS menolak `DEMO_KEY` (HTTP 400); perlu mendaftar MAP_KEY gratis. Halaman galeri Devpost diblokir Cloudflare sehingga proyek kompetitor tidak terlihat.

## 2. Kandidat ide

**A. BufferChain (nama kerja alternatif: PeatShield) - buffer pool dinamis berbasis risiko api untuk kredit karbon gambut/hutan**
Forecast risiko api (Topik 6) menghitung risiko reversal per area proyek. Risiko itu menentukan berapa persen kredit yang harus dikunci di buffer pool on-chain. Skor risiko di-commit (hash) sebelum periode. Bila terjadi kebakaran terverifikasi satelit (oracle atestasi), buffer pool melepas/membakar kredit untuk menutup kerugian, dan kredit proyek terkait ditandai. Semua dapat diverifikasi publik. Track: 1 (Carbon Markets & Emissions Transparency); menyentuh Track 4.

**B. HazeLedger - jejak rekam forecast commit-reveal (Track 4)**
Forecast risiko hotspot dicatat on-chain sebelum kejadian, lalu dinilai terhadap hotspot aktual dan skor dipublikasikan. Paling sederhana dan paling aman, tetapi juri bisa menganggapnya "dashboard + hash".

**C. Desa Bebas Api - insentif desa bersyarat dari premi risiko**
Forecast menentukan harga risiko; dana insentif otomatis cair ke desa yang tetap bebas hotspot. Dampak sosial kuat, ada dasar studi. Risiko: oracle salah deteksi, desain pembagian dana, kerumitan tata kelola.

**D. Peringatan paparan haze regional (PM2.5)** - ditolak. Pasar penuh (BMKG, ASMC, banyak aplikasi), pembeda lemah.

**E. Atribusi hotspot ke konsesi perusahaan** - ditolak untuk hackathon. Hotspot di konsesi bukan bukti kesalahan; risiko hukum dan reputasi. Simpan sebagai roadmap dengan kerangka hati-hati.

**F. dMRV restorasi gambut (muka air, kanal)** - roadmap. Kebutuhan nyata, tetapi data muka air tidak mudah didapat dalam 5 hari.

## 3. Penilaian terhadap kriteria (1 sampai 5, penilaian saya)

Kriteria Devpost: Climate Impact, Innovation, Technical Execution, Practical Usefulness, Presentation. Ditambah kelayakan 5 hari dan potensi produk/brand.

| Ide | Impact | Inovasi | Teknis | Praktis | Presentasi | Layak 5 hari | Brand/produk | Total /35 |
|---|---|---|---|---|---|---|---|---|
| A BufferChain | 5 | 5 | 4 | 4 | 5 | 3 | 5 | **31** |
| B HazeLedger | 3 | 3 | 3 | 3 | 4 | 5 | 3 | 24 |
| C Desa Bebas Api | 4 | 4 | 3 | 3 | 5 | 2 | 4 | 25 |
| A+C (loop penuh) | 5 | 5 | 4 | 5 | 5 | 2 | 5 | 31 (risiko tinggi) |

Alasan A teratas: menempel pada masalah yang diakui di jurnal level tinggi (buffer pool kurang modal), memakai forecast Topik 6 sebagai mesin harga risiko, cocok dengan contoh "carbon credit verification, double counting" di Track 1, dan cerita berita (asap, Singapura, label hijau APP) memberi konteks mengapa risiko api penting bagi pembeli kredit.

## 4. SWOT untuk A (BufferChain)

**Strengths**
- Masalah terbukti dan bernilai uang: buffer pool undercapitalized (Nature 2026; Front. For. Glob. Change 2022).
- Forecast tidak harus sempurna: yang dijual adalah cara mengubah risiko menjadi aturan buffer yang transparan.
- Starter kit sudah punya kontrak CarbonCreditToken, RetirementVault, NullifierRegistry, MRVOracle, RetirementCertificate, dan ForecastRegistry (12 tes Hardhat saya jalankan sendiri: 12 passing).
- Cerita demo kuat dan lokal.

**Weaknesses**
- Tidak ada data peta proyek karbon nyata; area proyek harus disimulasikan atas wilayah gambut sungguhan dan dinyatakan jelas sebagai demo.
- Skill forecast sedang; kalibrasi risiko harus jujur (interval, baseline, backtest).
- Dua bidang sekaligus (ML + kontrak + oracle) dalam 5 hari.
- Oracle satelit tetap titik kepercayaan; hash on-chain tidak membuktikan kebenaran model.

**Opportunities**
- Celah literatur: versi gambut tropis Indonesia belum ditemukan di Scopus.
- Pembeli kredit, penerbit registry, asuransi, dan pemberi pinjaman butuh angka risiko reversal yang dapat diaudit.
- Perluasan: restorasi gambut (dMRV), insentif desa (ide C), API risiko untuk registry.
- Momentum berita karhutla dan tekanan regional (Singapura).

**Threats**
- Juri bertanya "mengapa blockchain": jawaban harus jelas (komitmen forecast sebelum kejadian, buffer yang tidak bisa diubah diam-diam, verifikasi publik).
- Ahli karbon bisa menyerang model aktuaria yang terlalu sederhana; klaim harus dibatasi ("prototipe, bukan metodologi terakreditasi").
- Kompetitor akan memilih tema serupa (peserta 980+); gaya presentasi menentukan.
- Aturan hackathon ambigu (eligibility, jam deadline) dan belum dijawab panitia.

## 5. Pro dan kontra: A vs B vs C

| | Pro | Kontra |
|---|---|---|
| A | Masalah terbukti; nilai uang jelas; selaras Track 1; brand kuat; kontrak sudah ada | Paling kompleks; area proyek simulasi; perlu cerita aktuaria yang rapi |
| B | Paling mudah selesai; mudah dijelaskan | Dampak dan inovasi terbatas; mirip dashboard biasa |
| C | Dampak sosial dan dasar studi insentif | Oracle dan tata kelola dana rumit; sulit rampung 5 hari |

## 6. Rekomendasi

Pilih **A**, dibangun bertingkat agar selalu ada versi yang bisa disubmit:

1. **Tingkat 1 (hari 1-2):** pipeline data (CHIRPS, ONI/IOD, hotspot FIRMS bila MAP_KEY sudah ada; jika belum, backtest pakai arsip yang tersedia dan akui batasnya) dan model risiko per wilayah (baseline persistensi/klimatologi + XGBoost/LightGBM, split waktu, interval kuantil). Output: skor risiko reversal dan persen buffer.
2. **Tingkat 2 (hari 2-3):** kontrak `BufferPool` di atas CarbonCreditToken/MRVOracle yang ada: kunci kredit sesuai pita risiko, komitmen hash skor lewat ForecastRegistry, pelepasan buffer saat atestasi kebakaran lolos ambang.
3. **Tingkat 3 (hari 3-4):** dashboard (peta risiko, kolam buffer, bukti verifikasi publik) dan skenario demo kebakaran (area proyek simulasi di atas gambut nyata).
4. **Tingkat 4 (hari 4-5):** model card, security assessment, user testing 3 orang, video 3 menit, submit paling lambat 25 Okt 17:00 WIB (batas keras 21:00 WIB; target jauh lebih awal).
5. **Bila waktu ada:** modul insentif desa (ide C) sebagai satu slide roadmap, bukan kode.

Nama dan branding (usulan; belum dicek ketersediaan domain/merek):
- **BufferChain** - jelas dan teknis.
- **PeatShield** - mudah diingat, mengikat ke gambut.
- **Pagar Api** - lokal dan mudah dilafalkan; tagline: "Risk you can audit."

Tagline pitch: "Karhutla bukan hanya asap. Bagi pembeli kredit karbon, itu risiko reversal yang tidak pernah dihitung benar. BufferChain mengubah risiko api menjadi buffer yang transparan dan dapat diaudit."

## 7. Belum diverifikasi / batasan

- Hanya abstrak yang dibaca; belum ada full text.
- Tidak ada klaim spesifik tentang registry karbon Indonesia karena belum diperiksa.
- Galeri proyek Devpost tidak bisa diakses (Cloudflare), jadi pesaing tidak terlihat.
- NASA FIRMS membutuhkan MAP_KEY gratis (belum ada).
- Tes kontrak starter kit: 12 passing (dijalankan lokal 20 Okt); belum diaudit.
