# ClaimCheck - rencana build (21-25 Okt 2026)

Deadline Devpost: 25 Okt 2026 07:00 PDT = 21:00 WIB. Target submit: 25 Okt 12:00 WIB.
Track: 1 - Carbon Markets & Emissions Transparency.

## Satu kalimat
Masukkan klaim iklim sebuah perusahaan atau produk; ClaimCheck menelusuri kredit yang di-retire, menilai kemungkinan dampaknya berdasarkan riset, membandingkannya dengan emisi yang dilacak independen, dan mencatat hasilnya on-chain agar siapa pun bisa memeriksa.

## Alur pengguna (satu alur demo)
1. Pengguna awam mengetik nama perusahaan atau memilih klaim contoh ("Delta Air Lines", "Shell", produk berlabel carbon neutral).
2. ClaimCheck menampilkan: kredit yang di-retire atas nama itu (VROD), jenis proyek, ton nominal vs ton efektif (OAR Probst), status ICVCM, umur vintage.
3. Emisi independen (Climate TRACE, cache) bila ada; bila tidak, emisi yang dilaporkan sendiri dengan label; bila tidak ada, "tidak bisa dihitung".
4. Hasil: label A-E + satu kalimat + rentang; untuk klaim produk di UE, tanda risiko Directive 2024/825.
5. Tombol "Catat pemeriksaan": hash laporan + nullifier per klaim ke `ClaimRegistry` di Polygon Amoy; halaman verifikasi publik.
6. Mode ilmuwan: metode, DOI tiap faktor, unduh dataset olahan, notebook.

## Pemetaan Track 1
- Verification: skor berbasis riset + atestasi on-chain.
- Double counting: nullifier per (registry, rentang serial) yang mencegah rentang yang sama dipakai dua klaim.
- Emissions tracking: emisi independen Climate TRACE dibandingkan dengan klaim.
- Transparent platform: semua pemeriksaan dan metode publik.

## Arsitektur (paling sederhana yang bekerja)
- `data/` Python (pandas): VROD -> `retirements_by_beneficiary.json`, `projects.json`, `factors.json` (OAR, ICVCM, vintage), cache Climate TRACE untuk 5-10 perusahaan demo.
- `contracts/` Hardhat: `ClaimRegistry.sol` (record attestation hash + nullifier per serial range, role ATTESTER) + tes. Reuse pola NullifierRegistry dari starter kit.
- `web/` static (HTML + JS, ethers.js dari CDN): pencarian, kartu hasil, halaman verifikasi, mode ilmuwan. Tanpa backend; JSON statis dihosting bersama.
- Deploy: GitHub Pages atau Vercel; kontrak di Amoy.

## Jadwal
| Hari | Pekerjaan | Hasil yang bisa dicek |
|---|---|---|
| Sel 21 | Pipeline data VROD (Verra + Gold), tabel faktor dari paper, uji nama perusahaan demo | JSON + notebook; 5 perusahaan demo terpilih |
| Rab 22 | `ClaimRegistry.sol` + tes; deploy Amoy; cache Climate TRACE | tes lulus, alamat kontrak |
| Kam 23 | Frontend: pencarian, kartu A-E, verifikasi, mode ilmuwan | demo lokal penuh |
| Jum 24 | Integrasi ethers, user testing 3-5 orang awam, dokumen (model card, security, impact) | catatan user test |
| Sab 25 pagi | Video 3 menit, repo publik, isi Devpost, submit | konfirmasi submit |

## Di luar scope (sengaja)
Marketplace, token kredit, bridge, NLP iklan, skor per proyek individual, scope 3 independen, data bulanan.

## Risiko utama dan cadangan
- Climate TRACE API beta mati: pakai cache.
- Amoy/faucet bermasalah: jalankan di Hardhat lokal + rekam video; tampilkan tes.
- Nama perusahaan tidak cocok: pilih perusahaan demo yang sudah diverifikasi manual.
- Skor dipersoalkan: tampilkan rentang, DOI, dan disclaimer wajib.

## Keputusan yang dibutuhkan dari tim
1. Anggota tim dan pembagian peran (data, kontrak, frontend, video/pitch).
2. Wallet EVM testnet + MATIC Amoy dari faucet.
3. Konfirmasi eligibility ke panitia (overview "students only" vs rules).
4. Nama final (ClaimCheck / Proofset) dan cek domain.
5. Perusahaan demo yang aman secara reputasi (pakai data registry apa adanya, tanpa label menuduh).

## Keputusan (20 Okt 2026)
1. Tim: solo (Rofi). Semua peran dipegang satu orang; scope dijaga ketat.
2. Wallet testnet dibuat: `0x7d981e2E4D46c4bF302476893A7Ef41f120CD6e5`, kunci di `.env` (gitignored, testnet saja). Perlu MATIC Amoy dari faucet.
3. Eligibility: peserta mahasiswa, aman.
4. Nama: kandidat baru (cek DNS kasar, bukan bukti domain tersedia): **NetGrade** (netgrade.io, getnetgrade.com tidak resolve; netgrade.com sudah dipakai), **RealTon** (realton.io tidak resolve), TrueTon (trueton.io tidak resolve). ClaimLens tersingkir (domain .com dan .io aktif).
5. Perusahaan demo (ada di VROD sebagai beneficiary dan di Climate TRACE sebagai pemilik; ton = total retirement Verra yang namanya cocok substring, perlu pembersihan nama):

| Perusahaan | Ton di-retire (Verra, kasar) | Climate TRACE owner |
|---|---|---|
| Shell | 40,1 juta | Shell PLC |
| Eni | 30,3 juta | Eni SpA |
| Delta Air Lines | 12,7 juta | Delta Air Lines Inc |
| Volkswagen | 10,4 juta | Volkswagen AG |
| PetroChina | 5,8 juta | PetroChina Co Ltd |
| Chevron | 5,5 juta | Chevron Corp |
| Engie | 2,2 juta | ENGIE SA |
| CPC Taiwan | 2,2 juta | CPC Corporation Taiwan |
| TotalEnergies | 1,4 juta | TotalEnergies SE |

## Kandidat nama lengkap (cek DNS kasar 20 Okt 2026; "bebas?" = tidak resolve, bukan bukti tersedia)

| Nama | Konsep | .com | .io |
|---|---|---|---|
| RealTonne | ton nyata vs ton nominal (inti riset) | bebas? | bebas? |
| TonProof | bukti per ton | bebas? | bebas? |
| TonneTrue | ton yang benar | bebas? | bebas? |
| GroundTon | ground truth per ton | bebas? | bebas? |
| TonWise | bijak memilih ton | bebas? | bebas? |
| FactCarbon | cek fakta karbon | bebas? | bebas? |
| GradeCO2 | nilai A-E untuk klaim | bebas? | bebas? |
| CekKlaim / KlaimCek | lokal Indonesia, sangat jelas | bebas? | bebas? |
| NetGrade | nilai klaim net-zero | dipakai | bebas? |
| RealTon | ton nyata | dipakai | bebas? |
| TrueTon | ton benar | dipakai | bebas? |
| TallyTon | hitungan ton | dipakai | bebas? |
| ClaimTrue | klaim benar | dipakai | bebas? |
| OffsetIQ | kecerdasan offset | dipakai | bebas? |
| CreditLens | lensa kredit | dipakai | bebas? |
| ClearTon | ton yang jelas | dipakai | bebas? |
| CarbonReceipt | struk untuk klaim karbon | dipakai | bebas? |
| CarbonGrade | nilai karbon | dipakai | bebas? |
| NetFact | fakta net-zero | dipakai | bebas? |
| Tonsure | (arti Inggris: cukur rambut biarawan; hindari) | dipakai | bebas? |
| TrueTally, Receipted, Verdikt, Sahih, Provably, NetProof | - | dipakai | dipakai |

## Cakupan perusahaan: semua perusahaan asli, bukan daftar pilihan (20 Okt 2026)

Keputusan: pencarian mencakup **semua** nama pemilik retirement di VROD (Verra "Beneficial Owner" + Gold Standard "Using Entity"), nama asli apa adanya. Daftar 9 perusahaan sebelumnya hanya "contoh unggulan" di halaman depan.

Hasil pengolahan (Verra + Gold, retirement sejak 2020-01-01, VROD v2026-08):
- 342.012 baris, 876 juta t.
- Hanya **59,6% ton** (62,9% baris) yang menyebut pemilik. Sisanya tanpa pemilik.
- Setelah normalisasi nama sederhana: **44.577** pemilik berbeda. Top 10 = 39,7% ton bernama; top 100 = 65,5%; top 500 = 84,8%; top 1.000 = 91,0%.
- Entri terbesar adalah **"Not Disclosed": 89,4 juta t**, lebih besar dari Shell (42,3 juta t). Ini temuan utama untuk transparansi.
- Gold Standard punya kolom `Article Six Authorization` dan `Aeroplane Operator Name`; berguna untuk penanda Article 6 dan klaim penerbangan.

Sisi emisi (Climate TRACE): pencocokan otomatis nama ke 300 pemilik teratas hanya 29 cocok (17,8% ton dari 300 itu): Shell, Delta, CPC Taiwan, Apple, dll. Gagal untuk nama dengan sufiks/varian (Eni Upstream, Chevron Petroleum Company, "VW PKW"), brand/jasa (Netflix, Gucci, Takeda, Boeing), alamat wallet (0xAf52..., 0xF367...), dan perantara (4AIR, Ecologi). Rencana: tabel alias manual untuk ±100 pemilik teratas (Eni = Eni SpA, Chevron Petroleum Company = Chevron Corp, VW/Audi = Volkswagen AG, dll.); sisanya hanya sisi retirement dengan teks "emisi independen tidak tersedia".

Catatan hukum/reputasi: data pemilik adalah data publik registry yang dicatat sebagai pihak yang di-retire atas namanya; halaman hanya menampilkan fakta + metode, tanpa label yang menuduh, dengan tombol hak jawab.

## Riset branding (20 Okt 2026)

Pola nama pemain iklim/karbon yang sudah jadi brand: Sylvera, Pachama, Watershed, Isometric, Puro, Calyx, BeZero, Persefoni. Semuanya kata nyata yang dipinjam atau kata ciptaan yang evokatif, 2-3 suku kata, tidak deskriptif (bukan "CarbonChecker"). Nama deskriptif + "Ton/Grade/Proof" terdengar seperti fitur, bukan produk. Arah baru: metafora dari dunia **menimbang dan menguji kemurnian** (metrologi dan uji logam mulia), karena produknya menimbang klaim dan menguji kemurnian kredit.

| Nama | Arti dan cerita | Domain bebas? (DNS kasar) | Risiko |
|---|---|---|---|
| **Tare** | Istilah timbangan: berat wadah yang dikurangi agar tersisa berat bersih (net). "Kami mengurangi ton yang tidak nyata dari klaim; yang tersisa adalah net yang sebenarnya." Menyambung langsung ke "net zero". | tare.eco, usetare.io, tareco2.com, tarecarbon.com | Kata umum; tare.com/.io dipakai |
| **Assay** | Uji kemurnian logam mulia. "Assay your climate claim." | assay.eco, assaycarbon.com | assay.com/.io/.app dipakai; istilah lab umum |
| **Takar** | Bahasa Indonesia: menakar/mengukur. Asal tim Indonesia; mudah diucapkan global. | takar.io, takar.app, takar.earth | Makna tidak terbaca bagi juri internasional tanpa cerita |
| **Touchstone** | Batu uji emas; arti kiasan "standar acuan". | touchstone.earth, touchstone.app | Panjang; banyak merek lain |
| **Karat** | Ukuran kemurnian emas; cocok dengan label A-E. | karat.earth | Merek fintech "Karat" sudah ada (risiko merek) |
| **Tera** | Bahasa Indonesia "tera ulang": kalibrasi resmi timbangan oleh negara. | tera.eco | Mirip "Terra" (kripto yang runtuh 2022); hindari di proyek blockchain |

Rekomendasi: **Tare** (global, metafora paling pas dengan "net zero") atau **Takar** (cerita asal Indonesia). Belum ada cek merek dagang; wajib dicek (PDKI/WIPO) sebelum dipakai di luar hackathon.
