"use strict";
// Bahasa Indonesia for the Check page. English stays the source; this layer swaps on-screen text in place
// (static and rendered), remembers the choice per device, and restores the English original when switched back.
// Registry data (names, notes, project names) is never translated. Exact sentences first, then phrase rules.

const ID_EXACT = {
  // header, hero
  "Check": "Periksa", "Hidden buyers": "Pembeli tersembunyi", "About": "Tentang", "Glossary": "Glosarium",
  "876 Mt of carbon credits retired since 2020, searchable by buyer": "876 Mt kredit karbon yang dipensiunkan sejak 2020, bisa dicari per pembeli",
  "See what a carbon claim is really worth.": "Lihat nilai sebenarnya dari sebuah klaim karbon.",
  "Type a company. Netra shows the credits it retired, how many research says are likely real, what it reports emitting, and what independent estimates see. Search":
    "Ketik nama perusahaan. Netra menampilkan kredit yang dipensiunkannya, berapa banyak yang menurut riset kemungkinan nyata, emisi yang dilaporkannya, dan perkiraan independen. Cari di antara",
  "buyers.": "pembeli.",
  "Search a company": "Cari perusahaan", "Paste a claim": "Tempel klaim", "Company name": "Nama perusahaan", "Claim text": "Teks klaim",
  "Example: fuel": "Contoh: BBM", "Example: streaming": "Contoh: streaming",
  "Paste a green claim from an ad, a label or a report. AI reads who claims what, quoting your text; Netra holds it against the registry record.":
    "Tempel klaim hijau dari iklan, label atau laporan. AI membaca siapa mengklaim apa dengan mengutip teks Anda; Netra mencocokkannya dengan catatan registry.",
  "How it works": "Cara kerjanya",
  "No buyer with that name. Try a shorter part of the name.": "Tidak ada pembeli dengan nama itu. Coba sebagian nama yang lebih pendek.",
  // claim strip
  "Paste at least one full sentence (30 characters or more).": "Tempel minimal satu kalimat utuh (30 karakter atau lebih).",
  "Reading the claim…": "Membaca klaim…",
  "The claim reader is not available right now. Pick the company below instead.": "Pembaca klaim sedang tidak tersedia. Pilih perusahaan di bawah sebagai gantinya.",
  "Too many checks from this connection. Try again in an hour.": "Terlalu banyak pemeriksaan dari koneksi ini. Coba lagi dalam satu jam.",
  "Search by company name": "Cari dengan nama perusahaan",
  "The claim is by": "Klaim ini dari",
  ", which is not one of the 94 company groups Netra has reviewed. Its registry record may still be listed.":
    ", yang bukan salah satu dari 94 grup perusahaan yang sudah ditinjau Netra. Catatan registry-nya mungkin tetap ada.",
  "No company could be read from this text with a supporting quote.": "Tidak ada perusahaan yang bisa dibaca dari teks ini dengan kutipan pendukung.",
  "The claim": "Klaimnya", "Against the record": "Dibandingkan dengan catatan",
  "Who": "Siapa", "Says": "Klaim", "Covers": "Cakupan", "Year": "Tahun", "Tonnes": "Ton",
  "product": "produk", "service": "layanan", "event": "acara", "company": "perusahaan", "unclear": "tidak jelas",
  "of credits": "kredit", "; the claim says": "; klaim menyebut", ", yet the claim says": ", padahal klaim menyebut",
  "Roughly": "Sekitar", "of its researched credits are likely real.": "dari kreditnya yang diteliti kemungkinan nyata.",
  "None of its credits are in a project type with a research estimate.": "Tidak satu pun kreditnya berasal dari jenis proyek yang punya estimasi riset.",
  "Offsets do not cut its own emissions:": "Offset tidak mengurangi emisinya sendiri:",
  "EU rule:": "Aturan EU:",
  "since 27 Sep 2026, Directive 2024/825 does not allow a product, service or event sold in the EU to be called climate neutral because of offsets. This claim reads as one.":
    "sejak 27 Sep 2026, Directive 2024/825 tidak mengizinkan produk, layanan atau acara yang dijual di EU disebut netral iklim karena offset. Klaim ini terbaca demikian.",
  // result
  "Part of": "Bagian dari",
  "An offset provider or account that retires credits on behalf of its clients. The end claimants are not named here.": "Penyedia offset atau akun yang memensiunkan kredit atas nama kliennya. Pengklaim akhir tidak disebut di sini.",
  "A crypto wallet address. These credits were retired to back tokens on a blockchain; who holds the climate claim is not visible in the registry.": "Alamat dompet kripto. Kredit ini dipensiunkan untuk mendukung token di blockchain; siapa pemegang klaim iklimnya tidak terlihat di registry.",
  "No identifiable beneficiary. The public record names no one who could be held to claims based on these credits.": "Tidak ada penerima manfaat yang bisa dikenali. Catatan publik tidak menyebut siapa pun yang bisa dimintai tanggung jawab atas klaim berbasis kredit ini.",
  "A code that could not be matched to any organisation from the registry details. Netra does not guess who it is.": "Kode yang tidak cocok dengan organisasi mana pun di detail registry. Netra tidak menebak siapa itu.",
  "Credits retired to create crypto tokens. Verra stopped allowing retired credits to be tokenized in 2022.": "Kredit yang dipensiunkan untuk membuat token kripto. Verra tidak lagi mengizinkan kredit yang dipensiunkan untuk dijadikan token sejak 2022.",
  "A public authority.": "Lembaga publik.",
  "Of every 100 tonnes": "Dari setiap 100 ton yang dipensiunkan",
  "Likely real, in researched project types": "Kemungkinan nyata, pada jenis proyek yang diteliti",
  "Outline: claimed": "Garis: yang diklaim",
  "At the 2024 market average of $6.34 per credit, each likely-real tonne costs about": "Dengan harga rata-rata pasar 2024 sebesar $6,34 per kredit, setiap ton yang kemungkinan nyata berharga sekitar",
  "Price:": "Harga:", ", p. 10. What this buyer paid is not public.": ", hlm. 10. Harga yang dibayar pembeli ini tidak publik.",
  "Research estimate": "Estimasi riset", "Likely real": "Kemungkinan nyata", "Likely not real": "Kemungkinan tidak nyata",
  "No published estimate": "Belum ada estimasi terbit", "No estimate": "Tanpa estimasi", "no estimate": "tanpa estimasi",
  "Project types": "Jenis proyek", "ICVCM integrity label": "Label integritas ICVCM",
  "CCP-approved methodology": "Metodologi berlabel CCP", "Rejected by ICVCM": "Ditolak ICVCM", "Not assessed / not listed": "Belum dinilai / tidak terdaftar",
  "Company-reported emissions": "Emisi yang dilaporkan perusahaan", "reported total": "total yang dilaporkan",
  "Not published, or not readable.": "Tidak diterbitkan, atau tidak terbaca.", "Emissions": "Emisi",
  "This account is not a company, so there is no company report to read.": "Akun ini bukan perusahaan, jadi tidak ada laporan perusahaan untuk dibaca.",
  "This buyer is outside the 167 largest names reviewed by hand, so no emissions report has been matched to it.": "Pembeli ini di luar 167 nama terbesar yang ditinjau manual, jadi belum ada laporan emisi yang dicocokkan.",
  "Independent emissions": "Emisi independen", "Past to present": "Dari masa lalu ke sekarang",
  "Grey bars: tonnes retired per year. Line: likely-real share of research-covered tonnes.": "Batang abu-abu: ton yang dipensiunkan per tahun. Garis: porsi kemungkinan nyata dari ton yang tercakup riset.",
  "Unusual pattern": "Pola tidak biasa",
  "Flagged by an Isolation Forest model among 540 buyers with at least 100,000 t retired. An unusual pattern is a reason to look closer, not proof of wrongdoing.":
    "Ditandai model Isolation Forest di antara 540 pembeli dengan minimal 100.000 t yang dipensiunkan. Pola tidak biasa adalah alasan untuk memeriksa lebih dekat, bukan bukti pelanggaran.",
  "How we know": "Dari mana kami tahu", "Retired": "Dipensiunkan", "Who this is": "Siapa ini", "Grade": "Nilai", "Quality label": "Label kualitas",
  "Reviewed by hand against the registry retirement details and linked to": "Ditinjau manual terhadap detail retirement di registry dan ditautkan ke",
  "Reviewed by hand against the registry retirement details.": "Ditinjau manual terhadap detail retirement di registry.",
  "A type counts only when three sources agree: Berkeley's curated type, CarbonPlan OffsetsDB and the registry methodology code. Otherwise: no estimate.":
    "Jenis proyek hanya dihitung bila tiga sumber sepakat: jenis kurasi Berkeley, CarbonPlan OffsetsDB dan kode metodologi registry. Jika tidak: tanpa estimasi.",
  "Each methodology's status in the ICVCM Core Carbon Principles assessment, snapshot 18 Aug 2026.": "Status tiap metodologi dalam penilaian ICVCM Core Carbon Principles, snapshot 18 Agu 2026.",
  "Read by hand from": "Dibaca manual dari",
  "No figure is shown unless it comes from the company's own document.": "Angka hanya ditampilkan bila berasal dari dokumen perusahaan itu sendiri.",
  "Full rules:": "Aturan lengkap:", ". Plain-English terms:": ". Istilah dalam bahasa sederhana:", "glossary": "glosarium",
  "Selling in the EU?": "Berjualan di EU?",
  "Since 27 September 2026, EU Directive 2024/825 bans calling a product climate neutral, reduced or positive because of offsets, whatever the credit quality.":
    "Sejak 27 September 2026, EU Directive 2024/825 melarang menyebut produk netral iklim, emisinya berkurang, atau positif karena offset, apa pun kualitas kreditnya.",
  "Checking on-chain records…": "Memeriksa catatan on-chain…",
  "Not published on-chain yet. Published checks are listed on": "Belum diterbitkan on-chain. Pemeriksaan yang sudah terbit ada di halaman",
  "⚠ Flagged on-chain as a double claim: at least one serial range also backs an earlier claim.": "⚠ Ditandai on-chain sebagai klaim ganda: minimal satu rentang serial juga mendukung klaim sebelumnya.",
  "On-chain records are not published for this build yet.": "Catatan on-chain belum diterbitkan untuk versi ini.",
  "Link to this result": "Tautan ke hasil ini", "Request a correction": "Minta koreksi",
  // live registry check
  "Live from the registry": "Langsung dari registry",
  "Credits retired in the last hours, checked as they land.": "Kredit yang dipensiunkan beberapa jam terakhir, diperiksa saat masuk.",
  "Netra reads the newest retirements from Verra's public registry every ten minutes and applies the same rules as everywhere else on this site: research share likely real for the project type, ICVCM label, and who the benefit is claimed for.":
    "Netra membaca retirement terbaru dari registry publik Verra setiap sepuluh menit dan menerapkan aturan yang sama dengan bagian lain situs ini: porsi kemungkinan nyata menurut riset untuk jenis proyeknya, label ICVCM, dan untuk siapa manfaatnya diklaim.",
  "Connecting": "Menyambung", "Live": "Langsung", "Reconnecting": "Menyambung ulang",
  "When": "Kapan", "Project": "Proyek", "Claimed for": "Diklaim untuk", "ICVCM": "ICVCM",
  "Not named": "Tidak disebut", "New project": "Proyek baru", "CCP-approved": "Berlabel CCP", "Not approved": "Tidak disetujui",
  "Not assessed": "Belum dinilai", "Not checked": "Belum diperiksa", "Offset-based neutrality claim": "Klaim netral berbasis offset",
  "of it; about": "di antaranya; sekitar",
  "use credits 10 or more years old.": "memakai kredit berumur 10 tahun atau lebih.",
  // market
  "The whole market": "Seluruh pasar", "What was retired since 2020": "Apa yang dipensiunkan sejak 2020",
  "Likely-real share of research-covered tonnes, by year": "Porsi kemungkinan nyata dari ton yang tercakup riset, per tahun",
  "Has the quality of retired credits improved? Central research estimate per retirement year.": "Apakah kualitas kredit yang dipensiunkan membaik? Estimasi riset utama per tahun retirement.",
  "Where the tonnes come from": "Dari mana ton itu berasal",
  "retired on Verra and Gold Standard since 2020": "dipensiunkan di Verra dan Gold Standard sejak 2020",
  "of those tonnes have a blank beneficiary field": "dari ton itu kolom penerima manfaatnya kosong",
  "come from project types with a research estimate": "berasal dari jenis proyek yang punya estimasi riset",
  "use a methodology with the ICVCM CCP label": "memakai metodologi berlabel ICVCM CCP",
  "* 2026 up to August. The likely-real share has stayed between 18% and 22% every year.": "* 2026 hingga Agustus. Porsi kemungkinan nyata bertahan di 18% sampai 22% setiap tahun.",
  "Avoided deforestation (REDD+)": "Deforestasi yang dicegah (REDD+)", "Cookstoves": "Tungku masak", "Wind power in China": "Tenaga angin di Tiongkok",
  "Improved forest management (US)": "Pengelolaan hutan yang ditingkatkan (AS)", "HFC-23 destruction": "Penghancuran HFC-23",
  "SF6 destruction": "Penghancuran SF6", "Grid-connected renewables (outside China wind)": "Energi terbarukan terhubung ke jaringan (di luar angin Tiongkok)",
  "Other project types": "Jenis proyek lain",
  // hidden buyers
  "Who is behind the credits? Most of the time, nobody you can name.": "Siapa di balik kredit itu? Seringnya, tidak ada yang bisa disebut namanya.",
  "A carbon credit is \"retired\" when someone uses it for a climate claim. The registry asks who that someone is. For more than half of all tonnes since 2020, the answer is blank, \"Not Disclosed\", a reseller, a crypto wallet, or a code that matches no organisation. A claim without a name cannot be checked in public.":
    "Kredit karbon \"dipensiunkan\" saat seseorang memakainya untuk klaim iklim. Registry menanyakan siapa orang itu. Untuk lebih dari separuh ton sejak 2020, jawabannya kosong, \"Not Disclosed\", reseller, dompet kripto, atau kode yang tidak cocok dengan organisasi mana pun. Klaim tanpa nama tidak bisa diperiksa secara publik.",
  "Loading…": "Memuat…",
  "Named companies": "Perusahaan bernama", "Other named buyers": "Pembeli bernama lainnya", "Public bodies": "Lembaga publik",
  "Resellers, for clients": "Reseller, untuk klien", "Crypto wallets": "Dompet kripto", "Turned into tokens": "Dijadikan token",
  "Codes that match no organisation": "Kode tanpa organisasi yang cocok", "No name at all": "Tanpa nama sama sekali", "hidden": "tersembunyi",
  "Every tonne retired since 2020, by who claims it": "Setiap ton yang dipensiunkan sejak 2020, menurut siapa yang mengklaimnya",
  "The biggest accounts that hide who claims": "Akun terbesar yang menyembunyikan siapa pengklaimnya",
  "Account as written in the registry": "Akun seperti tertulis di registry", "What it is": "Apa itu",
  "Why it matters": "Kenapa penting", "Double claiming": "Klaim ganda", "What would fix it": "Apa solusinya",
  "A company can say \"we offset our emissions\". If the registry does not name it, no one can check in public which credits back that sentence, or whether the same credits back someone else's.":
    "Perusahaan bisa berkata \"kami mengimbangi emisi kami\". Jika registry tidak menyebut namanya, tak ada yang bisa memeriksa secara publik kredit mana yang mendukung kalimat itu, atau apakah kredit yang sama juga mendukung klaim pihak lain.",
  "Resellers and wallets can pass one retirement to many customers. The registry cannot see it. Netra's on-chain registry lets anyone flag a serial range claimed twice.":
    "Reseller dan dompet bisa meneruskan satu retirement ke banyak pelanggan. Registry tidak melihatnya. Registry on-chain Netra memungkinkan siapa pun menandai rentang serial yang diklaim dua kali.",
  "A mandatory, public beneficiary for every retirement, and claims that point to exact serial numbers. Until then, treat unnamed volume as unverifiable.":
    "Penerima manfaat yang wajib dan publik untuk setiap retirement, serta klaim yang menunjuk nomor serial yang tepat. Sampai saat itu, anggap volume tanpa nama tidak bisa diverifikasi.",
  // on-chain proof
  "On-chain proof": "Bukti on-chain", "Every published check is on the record. No one, not even Netra, can edit it.": "Setiap pemeriksaan yang terbit tercatat. Tidak ada yang bisa mengubahnya, termasuk Netra.",
  "Each published check is anchored in the": "Setiap pemeriksaan yang terbit dijangkarkan di smart contract",
  "smart contract on the Ethereum Sepolia test network. Anyone can recompute the report from the open data and confirm it matches. Each claim commits to the registry serial ranges behind it; if one range shows up in two claims, anyone can prove it on-chain and the later claim is flagged for good.":
    "di jaringan uji Ethereum Sepolia. Siapa pun bisa menghitung ulang laporan dari data terbuka dan memastikan cocok. Setiap klaim terikat pada rentang serial registry di baliknya; jika satu rentang muncul di dua klaim, siapa pun bisa membuktikannya on-chain dan klaim yang belakangan ditandai selamanya.",
  "Contract": "Kontrak", "Checks recorded": "Pemeriksaan tercatat", "Record": "Catatan", "Buyer": "Pembeli", "Report hash": "Hash laporan",
  "Date": "Tanggal", "Report": "Laporan", "Serial ranges": "Rentang serial", "✓ matches data": "✓ cocok dengan data",
  "differs from current data": "berbeda dari data terkini", "not in the dataset (demo claimant)": "tidak ada di dataset (pengklaim demo)",
  "unknown buyer": "pembeli tidak dikenal", "· flagged double claim": "· ditandai klaim ganda", "serial list does not match root": "daftar serial tidak cocok dengan root",
  "No checks published yet.": "Belum ada pemeriksaan yang terbit.", "unavailable": "tidak tersedia",
  "A double claim was just flagged on-chain": "Sebuah klaim ganda baru saja ditandai on-chain",
  // method, footer
  "Method": "Metode", "How Netra grades a buyer": "Cara Netra menilai pembeli",
  "Retirements.": "Retirement.", "Project type.": "Jenis proyek.", "Research estimate.": "Estimasi riset.", "Grade.": "Nilai.",
  "Integrity labels.": "Label integritas.", "Emissions.": "Emisi.",
  "Every Verra and Gold Standard retirement since 2020 from the Berkeley Voluntary Registry Offsets Database (v2026-08, CC BY 4.0), grouped by the named beneficiary.":
    "Setiap retirement Verra dan Gold Standard sejak 2020 dari Berkeley Voluntary Registry Offsets Database (v2026-08, CC BY 4.0), dikelompokkan menurut penerima manfaat yang disebut.",
  "Assigned only when three independent sources agree: Berkeley's curated type, CarbonPlan OffsetsDB, and the registry methodology code. Any disagreement gets no research estimate.":
    "Ditetapkan hanya bila tiga sumber independen sepakat: jenis kurasi Berkeley, CarbonPlan OffsetsDB, dan kode metodologi registry. Setiap ketidaksepakatan berarti tanpa estimasi riset.",
  "Share of credits that achieved real reductions per project type, from Probst et al. 2024 (": "Porsi kredit yang benar-benar menurunkan emisi per jenis proyek, dari Probst et al. 2024 (",
  ", 2,346 projects): cookstoves 10.8%, REDD+ 24.7%, HFC-23 68.3%, wind in China and US improved forest management 0%. Types without a published estimate are shown as \"no estimate\", never filled in.":
    ", 2.346 proyek): tungku masak 10,8%, REDD+ 24,7%, HFC-23 68,3%, angin di Tiongkok dan pengelolaan hutan AS yang ditingkatkan 0%. Jenis tanpa estimasi terbit ditampilkan \"tanpa estimasi\", tidak pernah diisi.",
  "Likely-real share of research-covered tonnes: A ≥ 60%, B 40–60%, C 20–40%, D 10–20%, E < 10%. No grade when research covers under a quarter of a buyer's tonnes.":
    "Porsi kemungkinan nyata dari ton yang tercakup riset: A ≥ 60%, B 40–60%, C 20–40%, D 10–20%, E < 10%. Tanpa nilai bila riset mencakup kurang dari seperempat ton pembeli.",
  "Each methodology's status from the ICVCM Core Carbon Principles assessment (snapshot 18 Aug 2026).": "Status tiap metodologi dari penilaian ICVCM Core Carbon Principles (snapshot 18 Agu 2026).",
  "The company's own figure, read from its primary report, next to Climate TRACE's independent ownership-weighted estimate. Different boundaries; never merged.":
    "Angka perusahaan sendiri, dibaca dari laporan utamanya, di samping estimasi independen Climate TRACE berbobot kepemilikan. Batasan berbeda; tidak pernah digabung.",
  "Estimates from published research (Probst et al. 2024) applied to registry data, per project type. Not a verdict on any single project. Registry names are shown as published; a name may be a broker or a brand. Every number links to its source. Check them.":
    "Estimasi dari riset terbitan (Probst et al. 2024) yang diterapkan ke data registry, per jenis proyek. Bukan vonis atas satu proyek. Nama registry ditampilkan apa adanya; sebuah nama bisa broker atau merek. Setiap angka tertaut ke sumbernya. Periksalah.",
  "Full method, sources and validation:": "Metode lengkap, sumber dan validasi:",
  "No beneficiary named": "Tidak ada penerima manfaat yang disebut",
  "netra · Data: Berkeley Carbon Trading Project VROD (CC BY 4.0), CarbonPlan OffsetsDB, ICVCM, Climate TRACE, Probst et al. 2024, company reports.":
    "netra · Data: Berkeley Carbon Trading Project VROD (CC BY 4.0), CarbonPlan OffsetsDB, ICVCM, Climate TRACE, Probst et al. 2024, laporan perusahaan.",
  "Vintage: the year the emission cut happened": "Vintage: tahun saat pengurangan emisi terjadi",
  // attributes
  "e.g. Shell, Delta, Netflix": "mis. Shell, Delta, Netflix",
  "Paste a green claim, e.g. “Our 2025 flights were carbon neutral: we offset 120,000 tonnes of CO2.”": "Tempel klaim hijau, mis. “Penerbangan kami tahun 2025 netral karbon: kami mengimbangi 120.000 ton CO2.”",
  "What to check": "Yang diperiksa", "Examples": "Contoh", "Example claims": "Contoh klaim", "Netra home": "Beranda Netra", "Main": "Utama",
  "Switch to dark mode": "Ganti ke mode gelap", "Switch to light mode": "Ganti ke mode terang", "Light or dark": "Terang atau gelap",
  "Grade not available": "Nilai tidak tersedia", "Likely-real share by retirement year": "Porsi kemungkinan nyata per tahun retirement",
  "Likely-real share by year": "Porsi kemungkinan nyata per tahun",
  "Example written by Netra: an ad says that filling up at Shell in 2025 is carbon neutral because carbon credits are retired for every litre, about 2 million tonnes of CO2 this year.":
    "Contoh tulisan Netra: sebuah iklan menyebut mengisi BBM di Shell pada 2025 netral karbon karena kredit karbon dipensiunkan untuk setiap liter, sekitar 2 juta ton CO2 tahun ini.",
  "Example written by Netra: a streaming service, Netflix, describes its 2025 operations as net zero after retiring carbon credits from forest protection projects.":
    "Contoh tulisan Netra: layanan streaming Netflix menyebut operasionalnya pada 2025 net zero setelah memensiunkan kredit karbon dari proyek perlindungan hutan.",
};

// data page
// (data.html + strings rendered by data.js)
Object.assign(ID_EXACT, {
  "Data · Netra": "Data · Netra",
  "All the numbers, side by side.": "Semua angka, berdampingan.",
  "Every company group Netra has reviewed, with what it retired, how much research says is likely real, what it reports emitting and what independent estimates see. Sort any column, filter by name, compare up to three. New to a word? See the":
    "Setiap grup perusahaan yang ditinjau Netra, beserta yang dipensiunkannya, berapa menurut riset yang kemungkinan nyata, apa yang dilaporkan sebagai emisi dan apa yang terlihat dari estimasi independen. Urutkan kolom mana pun, filter dengan nama, bandingkan sampai tiga. Kata yang asing? Lihat",
  "Companies": "Perusahaan", "Compare": "Bandingkan", "Unusual patterns": "Pola yang tidak biasa",
  "Years": "Tahun", "Downloads": "Unduhan",
  "Every reviewed company group": "Setiap grup perusahaan yang ditinjau",
  "Names in the registry are grouped by owner (Gucci and Guccio Gucci are counted under Kering). \"Likely real\" is the share of researched tonnes; the hatched range is the research uncertainty. Emissions are shown as published, never merged: the company's own report and the independent Climate TRACE estimate use different boundaries.":
    "Nama di registry dikelompokkan berdasarkan pemilik (Gucci dan Guccio Gucci dihitung di bawah Kering). \"Kemungkinan nyata\" adalah porsi ton yang diteliti; rentang berarsir adalah ketidakpastian riset. Emisi ditampilkan sebagaimana diterbitkan, tidak pernah digabung: laporan perusahaan sendiri dan estimasi independen Climate TRACE memakai batas yang berbeda.",
  "Filter companies": "Filter perusahaan", "Filter by name": "Filter dengan nama",
  "Company group": "Grup perusahaan", "Researched": "Diteliti", "Own report, Scope 1": "Laporan sendiri, Scope 1",
  "Pick up to three companies": "Pilih sampai tiga perusahaan",
  "Tick companies in the table (up to three). Shell, Delta and Netflix are shown to start.": "Centang perusahaan di tabel (sampai tiga). Shell, Delta dan Netflix ditampilkan sebagai awal.",
  "Buyers whose pattern stands out": "Pembeli yang polanya menonjol",
  "An Isolation Forest model (scikit-learn) looks at every buyer with at least 100,000 t retired and finds the few whose mix of old vintages, rejected methodologies, unresearched project types, one-year bursts, low likely-real share and batch size is far from the rest. Each flag lists the plain reasons behind it. Unusual is a reason to look closer, never proof of wrongdoing.":
    "Model Isolation Forest (scikit-learn) memeriksa setiap pembeli dengan minimal 100.000 t dipensiunkan dan menemukan sedikit pembeli yang campuran vintage lama, metodologi yang ditolak, jenis proyek tanpa riset, lonjakan satu tahun, porsi kemungkinan nyata yang rendah dan ukuran batch-nya jauh dari yang lain. Setiap tanda menyebut alasannya dengan jelas. Tidak biasa adalah alasan untuk melihat lebih dekat, bukan bukti kesalahan.",
  "Why it stands out": "Kenapa menonjol", "Score": "Skor",
  "What kind of projects the credits come from": "Jenis proyek asal kreditnya",
  "Research estimates exist for some project types only. Netra never fills in a number where none is published.":
    "Estimasi riset hanya ada untuk sebagian jenis proyek. Netra tidak pernah mengisi angka yang tidak diterbitkan.",
  "Tonnes retired": "Ton dipensiunkan", "Share": "Porsi", "Likely real (research)": "Kemungkinan nyata (riset)",
  "Range": "Rentang", "Year by year": "Tahun per tahun", "Likely real, of researched": "Kemungkinan nyata, dari yang diteliti",
  "Take the data with you": "Bawa datanya",
  "Netra dataset (Excel)": "Dataset Netra (Excel)",
  "Everything in one workbook: companies, hidden buyers, project types, years, reported emissions, with an About sheet.":
    "Semua dalam satu workbook: perusahaan, pembeli tersembunyi, jenis proyek, tahun, emisi terlapor, plus satu sheet About.",
  "Companies (CSV)": "Perusahaan (CSV)",
  "One row per reviewed company group, with sources and the reason when no report exists.":
    "Satu baris per grup perusahaan yang ditinjau, dengan sumber dan alasannya bila tidak ada laporan.",
  "Companies (JSON)": "Perusahaan (JSON)",
  "Same table for code, with Netra's method, sources and licence in the file header.":
    "Tabel yang sama untuk kode, dengan metode, sumber dan lisensi Netra di header file.",
  "Reported emissions (CSV)": "Emisi terlapor (CSV)",
  "Every company figure with its report, section, URL and the date it was checked.":
    "Setiap angka perusahaan beserta laporannya, bagian, URL dan tanggal pemeriksaannya.",
  "All 44,465 buyers (JSON)": "Semua 44.465 pembeli (JSON)",
  "The full dataset behind the search, every figure per buyer.": "Dataset lengkap di balik pencarian, setiap angka per pembeli.",
  "What each file holds, the method, sources, how to cite and the licence.": "Isi tiap file, metode, sumber, cara mengutip dan lisensinya.",
  "Cite as: Netra (2026), carbon claim dataset, IEEE ClimateChain Global Hackathon 2026, netra.rofihosted.space. Registry data: Berkeley Carbon Trading Project VROD v2026-08 (CC BY 4.0).":
    "Kutip sebagai: Netra (2026), carbon claim dataset, IEEE ClimateChain Global Hackathon 2026, netra.rofihosted.space. Data registry: Berkeley Carbon Trading Project VROD v2026-08 (CC BY 4.0).",
  "netra · Estimates from published research (Probst et al. 2024) applied to registry data. Every number links to its source.":
    "netra · Estimasi dari riset yang terbit (Probst et al. 2024) yang diterapkan ke data registry. Setiap angka tertaut ke sumbernya.",
  "not published": "tidak diterbitkan", "Comparing": "Sedang dibandingkan",
  "Research range": "Rentang riset", "Quality label (CCP)": "Label kualitas (CCP)",
  "of that is likely real.": "dari itu kemungkinan nyata.",
  ", none in a project type with a research estimate.": ", tidak ada yang dari jenis proyek dengan estimasi riset.",
  "Nothing picked yet.": "Belum ada yang dipilih.",
  "Three picked. Untick one to swap it.": "Sudah tiga. Hapus centang salah satu untuk menukarnya.",
  "Tick a company in the table above (up to three).": "Centang perusahaan di tabel di atas (sampai tiga).",
  "Three picked. Remove one first.": "Sudah tiga. Hapus satu dulu.",
  "credits retired on Verra and Gold Standard since 2020": "kredit dipensiunkan di Verra dan Gold Standard sejak 2020",
  "buyer accounts in the registry": "akun pembeli di registry",
  "of tonnes come from project types with a research estimate": "ton berasal dari jenis proyek dengan estimasi riset",
  "use a methodology with the ICVCM quality label": "memakai metodologi dengan label kualitas ICVCM",
  "Independent estimate": "Estimasi independen",
  "Project type": "Jenis proyek",
  "Source": "Sumber",
  "No published OAR estimate.": "Tidak ada estimasi OAR yang diterbitkan.",
  "Probst et al. 2024, Nature Communications, doi:10.1038/s41467-024-53645-z (no statistically significant reductions; set to 0%)":
    "Probst et al. 2024, Nature Communications, doi:10.1038/s41467-024-53645-z (tidak ada pengurangan yang signifikan secara statistik; disetel ke 0%)",
  "Isolation Forest (scikit-learn), 300 trees, contamination 2%, seed 7. Population: 540 buyers with at least 100,000 t retired since 2020. Reasons: a feature is named when it is in the top 5% of the population (bottom 5% for likely-real share).":
    "Isolation Forest (scikit-learn), 300 pohon, kontaminasi 2%, seed 7. Populasi: 540 pembeli dengan minimal 100.000 t dipensiunkan sejak 2020. Alasan: sebuah fitur disebut bila berada di 5% teratas populasi (5% terbawah untuk porsi kemungkinan nyata).",
});

// about page
// (about.html)
Object.assign(ID_EXACT, {
  "About · Netra": "About · Netra",
  "Companies say they offset. Netra checks what that is worth.": "Perusahaan menyebut mereka offset. Netra memeriksa berapa nilainya.",
  "Netra is a free, open tool that takes a company's carbon credits, the research on those credits, the company's own emissions report and an independent estimate, and puts them on one page in plain words. Each published check is written to a public blockchain, where no one, not even Netra, can change it.":
    "Netra adalah alat gratis dan terbuka yang mengambil kredit karbon sebuah perusahaan, riset tentang kredit itu, laporan emisi perusahaan sendiri dan estimasi independen, lalu menaruhnya di satu halaman dengan kata-kata sederhana. Setiap pemeriksaan yang terbit ditulis ke blockchain publik, yang tidak bisa diubah siapa pun, bahkan Netra.",
  "The problem": "Masalahnya", "What Netra does": "Apa yang dilakukan Netra",
  "The story": "Kisahnya", "Why \"Netra\"": "Kenapa \"Netra\"", "Research": "Riset",
  "Data sources": "Sumber data", "Limits": "Batas",
  "A tonne on paper is not a tonne in the air.": "Satu ton di kertas bukan satu ton di udara.",
  "researched credits retired since 2020 is likely a real reduction (19.4%, range 2.4–68.8%). The share has not improved since 2020.":
    "kredit yang diteliti dan dipensiunkan sejak 2020 kemungkinan adalah pengurangan nyata (19,4%, rentang 2,4–68,8%). Porsinya tidak membaik sejak 2020.",
  "See the numbers": "Lihat angkanya",
  "of retired tonnes cannot be tied to a named claimant: blank, \"Not Disclosed\", resellers, wallets or codes.":
    "ton yang dipensiunkan tidak bisa dikaitkan ke pemegang klaim bernama: kosong, \"Not Disclosed\", reseller, wallet atau kode.",
  "big buyers that research covers well enough to grade reach a B. 36 score C, 11 D, 5 E; the other 42 have too little research for a grade.":
    "pembeli besar yang cukup tercakup riset untuk diberi nilai mencapai B. 36 bernilai C, 11 D, 5 E; 42 sisanya risetnya terlalu sedikit untuk dinilai.",
  "Companies use carbon credits to call products, flights or whole businesses \"carbon neutral\". Peer-reviewed research keeps finding that most of those credits did not cut what they claim. The data to check this is public, but it sits in large spreadsheets that only specialists read. Most people, journalists and even buyers never see it.":
    "Perusahaan memakai kredit karbon untuk menyebut produk, penerbangan atau seluruh bisnisnya \"netral karbon\". Riset yang ditelaah sejawat terus menemukan bahwa sebagian besar kredit itu tidak memangkas seperti yang mereka klaim. Data untuk memeriksa ini bersifat publik, tetapi tersimpan di spreadsheet besar yang hanya dibaca spesialis. Kebanyakan orang, jurnalis dan bahkan pembeli tidak pernah melihatnya.",
  "One search box, six honest answers.": "Satu kotak pencarian, enam jawaban jujur.",
  "What was retired": "Apa yang dipensiunkan",
  "Every Verra and Gold Standard retirement since 2020, grouped by the company it was retired for.":
    "Setiap retirement Verra dan Gold Standard sejak 2020, dikelompokkan berdasarkan perusahaan yang dipensiunkan untuknya.",
  "How much is likely real": "Berapa yang kemungkinan nyata",
  "Published research per project type, applied to those tonnes, with a range and a grade from A to E.":
    "Riset yang terbit per jenis proyek, diterapkan ke ton itu, dengan rentang dan nilai dari A sampai E.",
  "What the company emits": "Apa yang dipancarkan perusahaan",
  "Its own reported emissions, read from its primary report, next to Climate TRACE's independent estimate.":
    "Emisi terlapornya sendiri, dibaca dari laporan utamanya, di samping estimasi independen Climate TRACE.",
  "AI that reads claims": "AI yang membaca klaim",
  "Paste a green claim: a language model pulls out who claims what, with quotes. Netra's data gives the verdict, and a machine-learning model flags unusual retirement patterns.":
    "Tempel klaim hijau: sebuah model bahasa menarik siapa yang mengklaim apa, beserta kutipannya. Data Netra memberi vonis, dan sebuah model machine learning menandai pola retirement yang tidak biasa.",
  "Proof no one can edit": "Bukti yang tidak bisa diedit siapa pun",
  "A fingerprint of each published check and its serial numbers on a public blockchain, where no one, not even Netra, can change it. An always-on watcher reads new checks every 30 seconds and flags a serial range claimed by two of them about ten seconds after reading it (tested on Sepolia).":
    "Sidik jari setiap pemeriksaan yang terbit dan nomor serialnya di blockchain publik, yang tidak bisa diubah siapa pun, bahkan Netra. Sebuah pengamat yang selalu hidup membaca pemeriksaan baru setiap 30 detik dan menandai rentang serial yang diklaim dua pemeriksaan sekitar sepuluh detik setelah membacanya (diuji di Sepolia).",
  "Live from the registry": "Langsung dari registry",
  "Every ten minutes Netra reads the newest retirements on Verra and checks each one with the same rules, as it lands.":
    "Setiap sepuluh menit Netra membaca retirement terbaru di Verra dan memeriksa masing-masing dengan aturan yang sama, saat datang.",
  "Who it is for: anyone who reads a \"carbon neutral\" label; journalists and NGOs; scientists who want open data and method; buyers and auditors doing due diligence; regulators enforcing the EU ban on offset-based product claims (Directive 2024/825).":
    "Untuk siapa: siapa pun yang membaca label \"netral karbon\"; jurnalis dan LSM; ilmuwan yang ingin data dan metode terbuka; pembeli dan auditor yang melakukan uji tuntas; regulator yang menegakkan larangan UE atas klaim produk berbasis offset (Directive 2024/825).",
  "From registry spreadsheet to plain sentence.": "Dari spreadsheet registry ke kalimat sederhana.",
  "Collect.": "Kumpulkan.",
  "342,012 retirement records (876 Mt) from Berkeley's Voluntary Registry Offsets Database, project types from CarbonPlan OffsetsDB, methodology labels from ICVCM.":
    "342.012 catatan retirement (876 Mt) dari Voluntary Registry Offsets Database milik Berkeley, jenis proyek dari CarbonPlan OffsetsDB, label metodologi dari ICVCM.",
  "Classify, carefully.": "Klasifikasikan, hati-hati.",
  "A project type counts only when three sources agree: Berkeley's type, CarbonPlan's type and the methodology code. 234 projects disagree; they get no estimate instead of a guess.":
    "Sebuah jenis proyek dihitung hanya bila tiga sumber setuju: jenis dari Berkeley, jenis dari CarbonPlan dan kode metodologi. 234 proyek berbeda pendapat; mereka tidak dapat estimasi, bukan tebakan.",
  "Estimate.": "Estimasi.",
  "Tonnes × the share research found real for that type (Probst et al. 2024), with the published range. Types with no research stay \"no estimate\".":
    "Ton × porsi yang menurut riset nyata untuk jenis itu (Probst et al. 2024), dengan rentang yang terbit. Jenis tanpa riset tetap \"tanpa estimasi\".",
  "Name the buyer.": "Namai pembelinya.",
  "167 of the largest buyer names reviewed by hand and grouped by owner. Resellers, wallets and anonymous accounts are labelled, never guessed.":
    "167 nama pembeli terbesar ditinjau manual dan dikelompokkan berdasarkan pemilik. Reseller, wallet dan akun anonim diberi label, tidak pernah ditebak.",
  "Add emissions.": "Tambahkan emisi.",
  "Company figures read from 79 groups, each with its URL and page. Independent emissions from Climate TRACE's ownership data.":
    "Angka perusahaan dibaca dari 79 grup, masing-masing dengan URL dan halamannya. Emisi independen dari data kepemilikan Climate TRACE.",
  "Record.": "Catat.",
  "Each published check is hashed and written to the ClaimRegistry smart contract, together with a Merkle root of its serial ranges. Anyone can recompute both from the open data.":
    "Setiap pemeriksaan yang terbit di-hash dan ditulis ke smart contract ClaimRegistry, bersama Merkle root dari rentang serialnya. Siapa pun bisa menghitung ulang keduanya dari data terbuka.",
  "AI reads. Data decides.": "AI membaca. Data memutuskan.",
  "Where": "Di mana", "Model": "Model", "What it does": "Apa yang dilakukannya", "What it never does": "Apa yang tidak pernah dilakukannya",
  "Paste a claim": "Tempel klaim",
  "Gemini 3.5 Flash-Lite, through the project's own model gateway (9router)":
    "Gemini 3.5 Flash-Lite, lewat gateway model milik proyek sendiri (9router)",
  "Reads who claims what, the scope, the year and the tonnes, each with a word-for-word quote. A field whose quote is not in the pasted text is dropped.":
    "Membaca siapa yang mengklaim apa, cakupan, tahun dan tonnya, masing-masing dengan kutipan kata per kata. Kolom yang kutipannya tidak ada di teks yang ditempel dibuang.",
  "Give a number. Grades, tonnes and emissions come only from Netra's data. The text is not stored.":
    "Memberi angka. Nilai, ton dan emisi hanya berasal dari data Netra. Teksnya tidak disimpan.",
  "Isolation Forest (scikit-learn), 300 trees": "Isolation Forest (scikit-learn), 300 pohon",
  "Flags the 8 of 540 large buyers whose retirement pattern stands out, with readable reasons.":
    "Menandai 8 dari 540 pembeli besar yang pola retirement-nya menonjol, dengan alasan yang mudah dibaca.",
  "Call anything fraud. A flag is a reason to look closer.":
    "Menyebut sesuatu sebagai penipuan. Sebuah tanda adalah alasan untuk melihat lebih dekat.",
  "Live registry check": "Pemeriksaan registry langsung",
  "No model: Netra's published rules": "Tanpa model: aturan terbitan Netra",
  "Every ten minutes, reads the newest Verra retirements and scores each by project type, ICVCM label and beneficiary.":
    "Setiap sepuluh menit, membaca retirement Verra terbaru dan menilai masing-masing berdasarkan jenis proyek, label ICVCM dan penerima manfaat.",
  "Estimate a project that is not in the research snapshot. It shows \"New project\" instead.":
    "Mengestimasi proyek yang tidak ada di snapshot riset. Yang ditampilkan \"Proyek baru\" sebagai gantinya.",
  "Name review (internal)": "Tinjauan nama (internal)",
  "Suggests which company an unreviewed registry name may belong to, for a person to check.":
    "Menyarankan perusahaan mana yang mungkin dimiliki nama registry yang belum ditinjau, untuk diperiksa orang.",
  "Appear on the site. About one in five suggestions on real names was wrong.":
    "Muncul di situs. Sekitar satu dari lima saran untuk nama nyata keliru.",
  "How Netra was built": "Bagaimana Netra dibangun",
  "Aug–Oct 2026": "Agu–Okt 2026", "20 Oct, morning": "20 Okt, pagi", "20 Oct": "20 Okt",
  "20–21 Oct": "20–21 Okt", "21 Oct": "21 Okt", "25 Oct": "25 Okt",
  "The hackathon.": "Hackathon-nya.",
  "IEEE ClimateChain Global Hackathon 2026 opens, with five training sessions on AI, blockchain, ethics and good practice for climate.":
    "IEEE ClimateChain Global Hackathon 2026 dibuka, dengan lima sesi pelatihan tentang AI, blockchain, etika dan praktik baik untuk iklim.",
  "First idea, dropped.": "Ide pertama, dibuang.",
  "AI forecasting of forest and peat fires in Indonesia. Research showed strong existing systems (ProbFire, Copernicus fire danger). Competing on a forecast model was the wrong fight.":
    "Prediksi AI untuk kebakaran hutan dan lahan gambut di Indonesia. Riset menunjukkan sistem yang sudah kuat (ProbFire, Copernicus fire danger). Bersaing di model prediksi adalah pertarungan yang salah.",
  "Second idea, parked.": "Ide kedua, diparkir.",
  "Fire-risk \"buffer pools\" for forest carbon credits. A real problem (Nature, 2026: US forest buffer pools about 6× too small), but no open map of real projects to build on in five days.":
    "\"Buffer pools\" risiko kebakaran untuk kredit karbon hutan. Masalah nyata (Nature, 2026: buffer pool hutan AS sekitar 6× terlalu kecil), tetapi tidak ada peta terbuka proyek nyata untuk dibangun dalam lima hari.",
  "The pivot to carbon credit retirement.": "Belok ke retirement kredit karbon.",
  "20 searches in Scopus returned 704 papers; 50 were kept. The strongest finding: companies keep buying low-quality credits, and research can measure how low.":
    "20 pencarian di Scopus menghasilkan 704 makalah; 50 disimpan. Temuan terkuat: perusahaan terus membeli kredit berkualitas rendah, dan riset bisa mengukur seberapa rendahnya.",
  "What the data said.": "Apa yang dikatakan data.",
  "In Verra's own data, no serial range was retired twice: double counting inside one registry is not the problem. The problem is what happens around it: 44.7% of retirement records name no beneficiary (57% of tonnes once resellers, wallets and unmatched codes are counted), and one credit can back several claims outside the registry.":
    "Di data Verra sendiri, tidak ada rentang serial yang dipensiunkan dua kali: double counting di dalam satu registry bukan masalahnya. Masalahnya adalah apa yang terjadi di sekitarnya: 44,7% catatan retirement tidak menyebut penerima manfaat (57% dari ton bila reseller, dompet dan kode yang tidak cocok ikut dihitung), dan satu kredit bisa menopang beberapa klaim di luar registry.",
  "Red team.": "Tim merah.",
  "14 weaknesses written down and fixed. Three changed the design: build on open data instead of copying it; record claims on-chain instead of minting tokens (which can itself create double counting); and target double":
    "14 kelemahan ditulis dan diperbaiki. Tiga mengubah desain: bangun di atas data terbuka alih-alih menyalinnya; catat klaim on-chain alih-alih mencetak token (yang bisa sendiri menciptakan double counting); dan bidik double",
  "claiming": "claiming",
  ", not double issuing.": ", bukan double issuing.",
  "The name.": "Namanya.",
  "Working names ClaimCheck and Proofset were descriptive but forgettable. Netra was chosen (see below).":
    "Nama kerja ClaimCheck dan Proofset deskriptif tapi mudah dilupakan. Netra dipilih (lihat di bawah).",
  "Data and contract.": "Data dan kontrak.",
  "Three-signal classification, research ranges from the source data, Climate TRACE ownership attribution, emissions from 79 company groups, and ClaimRegistry v2 with Merkle-root claims and on-chain challenges (8 tests passing).":
    "Klasifikasi tiga sinyal, rentang riset dari data sumber, atribusi kepemilikan Climate TRACE, emisi dari 79 grup perusahaan, dan ClaimRegistry v2 dengan klaim Merkle root dan tantangan on-chain (8 tes lulus).",
  "Brand and site.": "Brand dan situs.",
  "Ink, paper and one orange signal; the claimed-vs-real bar; no green, because green is the colour of greenwashing.":
    "Tinta, kertas dan satu sinyal oranye; batang claimed-vs-real; tanpa hijau, karena hijau adalah warna greenwashing.",
  "Live.": "Langsung.",
  "A claim checker that reads green claims with AI and lets the data decide, and a live check of every new Verra retirement as it lands.":
    "Sebuah pemeriksa klaim yang membaca klaim hijau dengan AI dan membiarkan data memutuskan, plus pemeriksaan langsung setiap retirement Verra baru saat datang.",
  "Submission": "Pengumpulan",
  "to Track 1: Carbon Markets & Emissions Transparency.": "ke Track 1: Carbon Markets & Emissions Transparency.",
  "Netra means \"eye\".": "Netra berarti \"mata\".",
  "In Sanskrit,": "Dalam bahasa Sanskerta,",
  "(नेत्र) means eye; the word also lives on in Indonesian and other languages of South and Southeast Asia. It is short, easy to say in any language, and says exactly what the tool does: look closely, and show what is there.":
    "(नेत्र) berarti mata; kata itu juga hidup dalam bahasa Indonesia dan bahasa lain di Asia Selatan dan Tenggara. Kata ini pendek, mudah diucapkan dalam bahasa apa pun, dan menyebut persis apa yang dilakukan alat ini: melihat dekat, dan menampilkan apa yang ada.",
  "The mark is an eye whose iris is only half filled. The filled part is the share of a claim that holds up, the same idea as the claimed-vs-real bar on every company page.":
    "Logonya adalah mata yang irisnya hanya terisi separuh. Bagian yang terisi adalah porsi klaim yang bertahan, ide yang sama dengan batang claimed-vs-real di setiap halaman perusahaan.",
  "The papers Netra stands on": "Makalah yang menjadi pijakan Netra",
  "All 50 papers from the literature review (newest first)": "Semua 50 makalah dari tinjauan literatur (terbaru dulu)",
  "Found through 20 Scopus queries (704 unique documents), screened by hand to 50. Titles and metadata read for all; full text for the four papers above.":
    "Ditemukan lewat 20 kueri Scopus (704 dokumen unik), disaring manual menjadi 50. Judul dan metadata dibaca untuk semuanya; teks lengkap untuk empat makalah di atas.",
  "Where every number comes from": "Dari mana setiap angka berasal",
  "What Netra takes from it": "Apa yang diambil Netra darinya", "Version, licence": "Versi, lisensi",
  "Registry methodology codes": "Kode metodologi registry",
  "ICVCM assessment status": "Status penilaian ICVCM",
  "Company reports": "Laporan perusahaan",
  "Every Verra and Gold Standard retirement since 2020; Berkeley's project type":
    "Setiap retirement Verra dan Gold Standard sejak 2020; jenis proyek dari Berkeley",
  "Second project-type signal": "Sinyal jenis proyek kedua",
  "Third project-type signal": "Sinyal jenis proyek ketiga",
  "Which methodologies carry the CCP quality label": "Metodologi mana yang membawa label kualitas CCP",
  "Share of real reductions per project type, with ranges": "Porsi pengurangan nyata per jenis proyek, dengan rentangnya",
  "Independent, ownership-weighted emissions per company": "Emisi independen per perusahaan, dibobot kepemilikan",
  "Reported emissions for 79 company groups, each with URL and section":
    "Emisi terlapor untuk 79 grup perusahaan, masing-masing dengan URL dan bagiannya",
  "Snapshot 2026 (updates paused upstream)": "Snapshot 2026 (pembaruan dijeda di hulu)",
  "From the registry records": "Dari catatan registry",
  "Snapshot 18 Aug 2026, 174 entries": "Snapshot 18 Agu 2026, 174 entri",
  "Annual and sustainability reports, assurance statements, checked Oct 2026":
    "Laporan tahunan dan keberlanjutan, pernyataan assurance, diperiksa Okt 2026",
  "What Netra does not claim": "Apa yang tidak diklaim Netra",
  "Averages, not verdicts.": "Rata-rata, bukan vonis.",
  "Research shares are averages per project type. A single project can be better or worse. Netra estimates risk; it does not judge any one project or company.":
    "Porsi riset adalah rata-rata per jenis proyek. Satu proyek bisa lebih baik atau lebih buruk. Netra mengestimasi risiko; Netra tidak menghakimi satu proyek atau perusahaan mana pun.",
  "Only researched types are scored.": "Hanya jenis yang diteliti yang dinilai.",
  "62% of retired tonnes come from project types without a published estimate. They are shown as \"no estimate\", never filled in.":
    "62% ton yang dipensiunkan berasal dari jenis proyek tanpa estimasi yang terbit. Mereka ditampilkan sebagai \"tanpa estimasi\", tidak pernah diisi.",
  "The registry name is not always the claimant.": "Nama registry tidak selalu pemegang klaimnya.",
  "A beneficiary can be a reseller, a brand or a subsidiary. Netra labels these and does not guess.":
    "Penerima manfaat bisa berupa reseller, brand atau anak perusahaan. Netra memberi label pada ini dan tidak menebak.",
  "Emissions use different boundaries.": "Emisi memakai batas yang berbeda.",
  "Company reports and Climate TRACE count different assets. They are shown side by side and never merged into one ratio.":
    "Laporan perusahaan dan Climate TRACE menghitung aset yang berbeda. Keduanya ditampilkan berdampingan dan tidak pernah digabung jadi satu rasio.",
  "Two registries.": "Dua registry.",
  "Netra covers Verra and Gold Standard, the two largest. Other registries (ACR, CAR, ART, national registries) are not yet included.":
    "Netra mencakup Verra dan Gold Standard, yang terbesar. Registry lain (ACR, CAR, ART, registry nasional) belum termasuk.",
  "Testnet records.": "Catatan testnet.",
  "On-chain records live on the Ethereum Sepolia test network, which works like the real one but costs nothing.":
    "Catatan on-chain disimpan di jaringan uji Ethereum Sepolia, yang bekerja seperti yang asli tetapi tidak berbiaya.",
  // team section (T4)
  "Team": "Tim", "Who made Netra": "Siapa yang membuat Netra",
  "Developer: pipeline, contract, web app, deployment.": "Developer: pipeline, kontrak, aplikasi web, deployment.",
  "QA: testing, edge cases, security review.": "QA: pengujian, kasus tepi, review keamanan.",
  "Project Lead and Project Manager: scope, research direction, story.": "Project Lead dan Project Manager: cakupan, arah riset, cerita.",
  "Found a mistake?": "Menemukan kesalahan?",
  "Open an issue": "Buka sebuah issue",
  ". Corrections are welcome and logged in public.": ". Koreksi diterima dan dicatat di publik.",
  "netra · Built by the Netra team for the IEEE ClimateChain Global Hackathon 2026. Code open on GitHub.":
    "netra · Dibuat oleh tim Netra untuk IEEE ClimateChain Global Hackathon 2026. Kode terbuka di GitHub.",
  "Pooled 2,346 projects (about 1 billion tonnes). Fewer than 16% of credits were real reductions. Gives the share per type that Netra uses: cookstoves 10.8%, REDD+ 24.7%, HFC-23 68.3%, SF6 16.4%, wind in China and US forest management 0%. Netra applies the share for each project type to the mix of credits actually retired since 2020, so its overall figure (about 19%) differs from the study's average.":
    "Menggabungkan 2.346 proyek (sekitar 1 miliar ton). Kurang dari 16% kredit adalah pengurangan nyata. Memberi porsi per jenis yang dipakai Netra: tungku masak 10,8%, REDD+ 24,7%, HFC-23 68,3%, SF6 16,4%, tenaga angin di Tiongkok dan pengelolaan hutan AS 0%. Netra menerapkan porsi tiap jenis proyek ke campuran kredit yang benar-benar dipensiunkan sejak 2020, jadi angka keseluruhannya (sekitar 19%) berbeda dari rata-rata studi itu.",
  "The 20 companies that retired the most credits in 2020–2023: 87% of what they retired carried a high risk of not being real. Netra's vintage and project-type flags follow this work.":
    "20 perusahaan yang paling banyak memensiunkan kredit pada 2020–2023: 87% dari yang mereka pensiunkan berisiko tinggi tidak nyata. Penanda vintage dan jenis proyek Netra mengikuti karya ini.",
  "27 forest-protection (REDD+) projects in 6 countries: 68% of potential credits came from projects that did not reduce deforestation significantly.":
    "27 proyek perlindungan hutan (REDD+) di 6 negara: 68% kredit potensial berasal dari proyek yang tidak menurunkan deforestasi secara signifikan.",
  "Cookstove projects were over-credited about 9 times. Consistent with the 10.8% share Netra uses.":
    "Proyek tungku masak mendapat kredit berlebih sekitar 9 kali. Konsisten dengan porsi 10,8% yang dipakai Netra.",
  "v5.7.0, 2025 emissions": "v5.7.0, emisi 2025",
});

// glossary
// (glossary.html)
Object.assign(ID_EXACT, {
  "Every word, in plain English.": "Setiap kata, dalam bahasa sederhana.",
  "Carbon markets are full of jargon. Each term below has a one-line meaning and a real example. If you only read one, read":
    "Pasar karbon penuh jargon. Setiap istilah di bawah punya arti satu baris dan contoh nyata. Kalau hanya membaca satu, baca",
  "carbon credit": "kredit karbon", "retirement": "retirement",
  "and": "dan", "over-crediting": "over-crediting",
  "Filter terms": "Filter istilah",
  "Filter, e.g. scope, REDD, hash": "Filter, mis. scope, REDD, hash",
  "The basics": "Dasar-dasar",
  "A certificate that says one tonne of CO₂ (or the same warming from another gas) was kept out of the air or taken out of it.":
    "Sertifikat yang menyatakan satu ton CO₂ (atau pemanasan yang sama dari gas lain) dicegah masuk udara atau dikeluarkan dari udara.",
  "Example: a wind farm in India sells one credit for every tonne of coal power it claims to replace.":
    "Contoh: pembangkit angin di India menjual satu kredit untuk setiap ton batu bara yang diklaimnya menggantikan.",
  "Using carbon credits to \"cancel out\" your own emissions on paper.":
    "Memakai kredit karbon untuk \"membatalkan\" emisi sendiri di atas kertas.",
  "Example: an airline emits 10 tonnes and buys 10 credits, then calls the flight \"carbon neutral\".":
    "Contoh: maskapai menghasilkan 10 ton emisi, membeli 10 kredit, lalu menyebut penerbangan itu \"netral karbon\".",
  "Using up a credit for good, so nobody can sell or use it again. This is the moment a climate claim is made.":
    "Memakai kredit untuk selamanya, supaya tidak ada yang bisa menjual atau memakainya lagi. Inilah saat klaim iklim dibuat.",
  "Example: Shell retired 42.3 million tonnes of credits since 2020.":
    "Contoh: Shell memensiunkan 42,3 juta ton kredit sejak 2020.",
  "The person or company the registry says the retired credits are for: the one who gets to make the claim.":
    "Orang atau perusahaan yang menurut registry kredit yang dipensiunkan itu miliknya: pihak yang berhak membuat klaim.",
  "Example: for 40% of tonnes this field is blank. That is what Netra calls \"hidden\".":
    "Contoh: untuk 40% ton kolom ini kosong. Itulah yang Netra sebut \"tersembunyi\".",
  "The official database that issues credits, tracks who holds them, and records retirements. Verra and Gold Standard are the two biggest.":
    "Basis data resmi yang menerbitkan kredit, mencatat siapa pemegangnya, dan mencatat retirement. Verra dan Gold Standard adalah dua yang terbesar.",
  "Example: every credit has an entry like \"VCS1477\", meaning Verra project number 1477.":
    "Contoh: setiap kredit punya entri seperti \"VCS1477\", artinya nomor proyek Verra 1477.",
  "tCO₂e = one tonne of CO₂ or the same amount of warming from other gases. Mt = a million tonnes.":
    "tCO₂e = satu ton CO₂ atau jumlah pemanasan yang sama dari gas lain. Mt = satu juta ton.",
  "Example: 876 Mt = 876 million tonnes, the total retired on Verra and Gold Standard since 2020.":
    "Contoh: 876 Mt = 876 juta ton, total yang dipensiunkan di Verra dan Gold Standard sejak 2020.",
  "Where companies buy credits because they choose to, not because a law forces them. Netra covers this market.":
    "Tempat perusahaan membeli kredit karena pilihan sendiri, bukan karena dipaksa undang-undang. Pasar inilah yang dicakup Netra.",
  "Example: a streaming company buying credits to meet its own climate goal.":
    "Contoh: perusahaan streaming membeli kredit untuk memenuhi target iklimnya sendiri.",
  "When a registry creates new credits for a project, after an auditor has checked its reported reductions for a period.":
    "Saat registry membuat kredit baru untuk sebuah proyek, setelah auditor memeriksa pengurangan yang dilaporkannya untuk sebuah periode.",
  "Example: a solar farm gets 50,000 credits for the reductions it claimed in 2022.":
    "Contoh: pembangkit surya mendapat 50.000 kredit untuk pengurangan yang diklaimnya pada 2022.",
  "The largest voluntary registry. Its standard is the Verified Carbon Standard; project IDs start with VCS. Netra's live check reads its public retirements.":
    "Registry sukarela terbesar. Standarnya adalah Verified Carbon Standard; ID proyek diawali VCS. Cek langsung Netra membaca retirement publiknya.",
  "Example: VCS1792 is a solar project in India listed on Verra.":
    "Contoh: VCS1792 adalah proyek surya di India yang terdaftar di Verra.",
  "The second-largest voluntary registry, with a focus on projects that also help people locally, such as cookstoves. Project IDs start with GS.":
    "Registry sukarela terbesar kedua, fokus pada proyek yang juga membantu warga sekitar, seperti tungku masak. ID proyek diawali GS.",
  "Example: GS1021 is a cookstove project on Gold Standard.":
    "Contoh: GS1021 adalah proyek tungku masak di Gold Standard.",
  "Taking credits out of circulation without making a claim for anyone, for example to correct an error or to cover a country's own target. Not the same as a retirement.":
    "Mengeluarkan kredit dari peredaran tanpa klaim untuk siapa pun, misalnya untuk memperbaiki kesalahan atau memenuhi target negara sendiri. Tidak sama dengan retirement.",
  "Example: Netra counts retirements only; cancellations are left out.":
    "Contoh: Netra hanya menghitung retirement; pembatalan tidak dihitung.",
  "What a buyer pays per credit. Prices are mostly private; market reports publish averages.":
    "Yang dibayar pembeli per kredit. Harga sebagian besar tertutup; laporan pasar menerbitkan rata-ratanya.",
  "Example: the average voluntary credit sold for $6.34 in 2024 (Ecosystem Marketplace, 2025).":
    "Contoh: rata-rata kredit sukarela terjual seharga $6,34 pada 2024 (Ecosystem Marketplace, 2025).",
  "Is the credit real?": "Apakah kreditnya nyata?",
  "Would the cut in emissions have happened anyway, without the credit money? If yes, the credit is not \"additional\" and changes nothing.":
    "Apakah pemotongan emisi itu tetap terjadi tanpa uang kredit? Kalau ya, kredit itu bukan \"additional\" dan tidak mengubah apa pun.",
  "Example: a big wind farm that was already profitable would have been built anyway.":
    "Contoh: pembangkit angin besar yang sudah untung tetap akan dibangun.",
  "A project gets more credits than the real tonnes it saved, usually because its \"what would have happened\" guess was too pessimistic.":
    "Proyek mendapat kredit lebih banyak daripada ton yang benar-benar dihematnya, biasanya karena tebakan \"apa yang akan terjadi\" terlalu pesimis.",
  "Example: research found cookstove projects were credited about 9 times more than their real effect.":
    "Contoh: riset menemukan proyek tungku masak diberi kredit sekitar 9 kali lebih besar dari efek sebenarnya.",
  "The guess of what would have happened without the project. Credits = baseline minus what really happened, so an inflated baseline means fake credits.":
    "Tebakan tentang apa yang akan terjadi tanpa proyek. Kredit = baseline dikurangi yang benar-benar terjadi, jadi baseline yang digembungkan berarti kredit palsu.",
  "Example: claiming a forest would have been fully cut down when it was never under threat.":
    "Contoh: mengklaim hutan akan ditebang habis padahal hutan itu tidak pernah terancam.",
  "The share of credits that research found were real reductions, per project type. Netra multiplies tonnes by this number.":
    "Porsi kredit yang menurut riset adalah pengurangan nyata, per jenis proyek. Netra mengalikan ton dengan angka ini.",
  "Example: REDD+ OAR 24.7%, so 100 tonnes of REDD+ credits ≈ 25 real tonnes.":
    "Contoh: OAR REDD+ 24,7%, jadi 100 ton kredit REDD+ ≈ 25 ton nyata.",
  "Netra's best estimate of how many retired tonnes actually cut emissions: tonnes × OAR.":
    "Estimasi terbaik Netra berapa ton yang dipensiunkan benar-benar memotong emisi: ton × OAR.",
  "Example: Shell has 23.3 Mt in researched project types; about 5.3 Mt are likely real.":
    "Contoh: Shell punya 23,3 Mt pada jenis proyek yang diteliti; sekitar 5,3 Mt kemungkinan nyata.",
  "The low and high estimate around the best guess. Netra always shows it, because research is never exact.":
    "Estimasi terendah dan tertinggi di sekitar tebakan terbaik. Netra selalu menampilkannya, karena riset tidak pernah persis.",
  "Example: Shell's likely real tonnes range from 0.3 to 19.9 Mt.":
    "Contoh: ton kemungkinan nyata Shell berkisar dari 0,3 sampai 19,9 Mt.",
  "Will the saved carbon stay saved? A forest that burns down later \"reverses\" the credit.":
    "Akankah karbon yang disimpan tetap tersimpan? Hutan yang terbakar kemudian \"membalik\" kredit itu.",
  "Example: in 2021 the Bootleg Fire in Oregon burned a forest project that had already sold credits.":
    "Contoh: pada 2021 kebakaran Bootleg di Oregon membakar proyek hutan yang sudah menjual kredit.",
  "A reserve of unsold credits kept as insurance against reversals.":
    "Cadangan kredit yang belum terjual sebagai asuransi dari pembalikan.",
  "Example: research in Nature (2026) found US forest buffer pools are about 6 times too small.":
    "Contoh: riset di Nature (2026) menemukan buffer pool hutan AS sekitar 6 kali terlalu kecil.",
  "When protecting one place just moves the damage somewhere else.":
    "Saat melindungi satu tempat hanya memindahkan kerusakan ke tempat lain.",
  "Example: logging stops in a protected forest and moves to the next valley.":
    "Contoh: penebangan berhenti di hutan lindung lalu pindah ke lembah berikutnya.",
  "The year the emission cut happened. Old vintages are cheaper and often lower quality.":
    "Tahun terjadinya pemotongan emisi. Vintage lama lebih murah dan sering kualitasnya lebih rendah.",
  "Example: the aviation scheme CORSIA does not accept credits with vintages before 2016.":
    "Contoh: skema penerbangan CORSIA tidak menerima kredit dengan vintage sebelum 2016.",
  "Avoidance credits pay for emissions that would otherwise have happened (a forest not cut, a stove that burns less wood). Removal credits pay for CO₂ taken out of the air (new trees, direct capture).":
    "Kredit avoidance membayar emisi yang seharusnya terjadi (hutan yang tidak ditebang, tungku yang memakai kayu lebih sedikit). Kredit removal membayar CO₂ yang dikeluarkan dari udara (pohon baru, penangkapan langsung).",
  "Example: REDD+ is avoidance; planting trees on bare land is removal.":
    "Contoh: REDD+ adalah avoidance; menanam pohon di lahan gundul adalah removal.",
  "Credits from forests, soils, wetlands or oceans, rather than from technology such as wind farms or gas destruction.":
    "Kredit dari hutan, tanah, lahan basah atau laut, bukan dari teknologi seperti pembangkit angin atau penghancuran gas.",
  "Example: mangrove restoration in Myanmar is a nature-based project.":
    "Contoh: restorasi mangrove di Myanmar adalah proyek nature-based.",
  "Netra's label for a credit retired 10 or more years after its vintage. Old credits are cheap and often come from projects that would have run anyway.":
    "Label Netra untuk kredit yang dipensiunkan 10 tahun atau lebih setelah vintagenya. Kredit lama murah dan sering datang dari proyek yang tetap akan berjalan.",
  "Example: a 2012 vintage retired in 2026 for a \"carbon neutral 2025\" claim.":
    "Contoh: vintage 2012 yang dipensiunkan pada 2026 untuk klaim \"netral karbon 2025\".",
  "The market price divided by the share of a credit that research says is real. It shows what one tonne of real climate benefit costs.":
    "Harga pasar dibagi porsi kredit yang menurut riset nyata. Ini menunjukkan berapa biaya satu ton manfaat iklim yang nyata.",
  "Example: at $6.34 per credit and 23% likely real, one real tonne costs about $27.60.":
    "Contoh: pada $6,34 per kredit dan 23% kemungkinan nyata, satu ton nyata berbiaya sekitar $27,60.",
  "\"Reducing Emissions from Deforestation and forest Degradation\": credits for protecting forests that were said to be under threat.":
    "\"Reducing Emissions from Deforestation and forest Degradation\": kredit untuk melindungi hutan yang dikatakan terancam.",
  "Example: 26% of all tonnes retired since 2020 are REDD+. Research says about 25% of them are real.":
    "Contoh: 26% dari semua ton yang dipensiunkan sejak 2020 adalah REDD+. Riset menyebut sekitar 25% di antaranya nyata.",
  "Credits for giving families cleaner stoves, so they burn less wood or charcoal.":
    "Kredit untuk memberi keluarga tungku yang lebih bersih, supaya mereka membakar lebih sedikit kayu atau arang.",
  "Example: research estimates 10.8% of cookstove credits are real.":
    "Contoh: riset memperkirakan 10,8% kredit tungku masak nyata.",
  "Destroying a very strong warming gas made as a by-product in factories.":
    "Menghancurkan gas pemanasan yang sangat kuat, produk sampingan di pabrik.",
  "Example: the best-performing type in the research: 68.3% real.":
    "Contoh: jenis dengan kinerja terbaik dalam riset: 68,3% nyata.",
  "Credits for logging less or more carefully than planned.":
    "Kredit untuk menebang lebih sedikit atau lebih hati-hati dari rencana.",
  "Example: research found no significant real effect for US IFM projects (0%).":
    "Contoh: riset tidak menemukan efek nyata yang berarti untuk proyek IFM AS (0%).",
  "Credits from wind, solar or hydro plants that feed the power grid. Often fail additionality because the plants pay for themselves.":
    "Kredit dari pembangkit angin, surya atau air yang masuk ke jaringan listrik. Sering gagal additionality karena pembangkit itu menguntungkan sendiri.",
  "Example: research found 0% real for wind in China. 35% of retired tonnes are renewables without a published estimate.":
    "Contoh: riset menemukan 0% nyata untuk angin di China. 35% ton yang dipensiunkan adalah energi terbarukan tanpa estimasi terbit.",
  "The rulebook a project uses to count its credits. Different rulebooks for the same project type can give very different numbers.":
    "Aturan main yang dipakai proyek untuk menghitung kreditnya. Aturan berbeda untuk jenis proyek yang sama bisa memberi angka yang sangat berbeda.",
  "Example: VM0007 is a Verra methodology for REDD+.": "Contoh: VM0007 adalah metodologi Verra untuk REDD+.",
  "Planting trees on land that has no forest, or bringing a lost forest back. A removal type; trees can later burn or be cut, so permanence matters.":
    "Menanam pohon di lahan tanpa hutan, atau mengembalikan hutan yang hilang. Jenis removal; pohon bisa terbakar atau ditebang nanti, jadi keawetannya penting.",
  "Example: a mangrove replanting project on degraded coastal land.":
    "Contoh: proyek penanaman kembali mangrove di pesisir yang terdegradasi.",
  "Carbon stored in coastal ecosystems such as mangroves, seagrass and salt marshes.":
    "Karbon yang tersimpan di ekosistem pesisir seperti mangrove, lamun dan rawa asin.",
  "Example: Delta Blue Carbon in Pakistan, a mangrove project on Verra (VCS2250).":
    "Contoh: Delta Blue Carbon di Pakistan, proyek mangrove di Verra (VCS2250).",
  "Capturing methane from rubbish dumps and burning it or using it for power. Methane warms the planet far more than CO₂ in the short term.":
    "Menangkap metana dari tempat pembuangan sampah lalu membakarnya atau memakainya untuk listrik. Dalam jangka pendek metana memanaskan planet jauh lebih kuat dari CO₂.",
  "Example: a landfill gas power plant in China earning credits on Verra.":
    "Contoh: pembangkit listrik gas TPA di China yang mendapat kredit di Verra.",
  "Destroying sulphur hexafluoride, a very strong industrial greenhouse gas used in electrical equipment.":
    "Menghancurkan sulphur hexafluoride, gas rumah kaca industri yang sangat kuat, dipakai di peralatan listrik.",
  "Example: research found about 16% of SF6 destruction credits matched real reductions (Probst et al. 2024).":
    "Contoh: riset menemukan sekitar 16% kredit penghancuran SF6 sesuai dengan pengurangan nyata (Probst et al. 2024).",
  "Quality labels and rules": "Label kualitas dan aturan",
  "The Integrity Council for the Voluntary Carbon Market checks methodologies. Approved ones get the Core Carbon Principles (CCP) label.":
    "Integrity Council for the Voluntary Carbon Market memeriksa metodologi. Yang disetujui mendapat label Core Carbon Principles (CCP).",
  "Example: only 4.5% of tonnes retired since 2020 use a CCP-approved methodology.":
    "Contoh: hanya 4,5% ton yang dipensiunkan sejak 2020 memakai metodologi yang disetujui CCP.",
  "The Voluntary Carbon Markets Integrity Initiative sets rules for what companies may claim when they use credits.":
    "Voluntary Carbon Markets Integrity Initiative menetapkan aturan tentang apa yang boleh diklaim perusahaan saat memakai kredit.",
  "Example: its Claims Code requires a science-based target before any offset claim.":
    "Contoh: Claims Code-nya mewajibkan target berbasis sains sebelum klaim offset apa pun.",
  "The UN aviation scheme in which airlines must offset some of their growth in emissions, with stricter credit rules.":
    "Skema penerbangan PBB di mana maskapai harus meng-offset sebagian pertumbuhan emisinya, dengan aturan kredit yang lebih ketat.",
  "Example: Netra flags buyers whose credits are mostly pre-2016 vintages, which CORSIA rejects.":
    "Contoh: Netra menandai pembeli yang kreditnya sebagian besar vintage pra-2016, yang ditolak CORSIA.",
  "An EU consumer law, in force since 27 September 2026, that bans calling a product climate neutral, reduced or positive because of offsets.":
    "Undang-undang konsumen UE, berlaku sejak 27 September 2026, yang melarang menyebut produk netral iklim, berkurang atau positif karena offset.",
  "Example: \"This flight is carbon neutral because we plant trees\" is no longer allowed in the EU.":
    "Contoh: \"Penerbangan ini netral karbon karena kami menanam pohon\" tidak lagi diizinkan di UE.",
  "Making something look greener than it is.": "Membuat sesuatu tampak lebih hijau dari kenyataannya.",
  "Example: a \"carbon neutral\" label backed by credits that research says are mostly not real.":
    "Contoh: label \"netral karbon\" yang ditopang kredit yang menurut riset sebagian besar tidak nyata.",
  "Carbon neutral: emissions balanced with credits, often now. Net zero: cutting emissions deeply by a target year and only removing what is left.":
    "Netral karbon: emisi diseimbangkan dengan kredit, sering sejak sekarang. Net zero: memangkas emisi dalam-dalam sampai tahun target, dan sisanya hanya dikeluarkan dari udara.",
  "Example: a company can be \"carbon neutral\" today through offsets while its emissions keep rising.":
    "Contoh: perusahaan bisa \"netral karbon\" hari ini lewat offset sementara emisinya terus naik.",
  "The Paris Agreement rules for countries trading emission cuts. A corresponding adjustment stops the host country from also counting the same cut.":
    "Aturan Paris Agreement untuk negara yang memperdagangkan pemotongan emisi. Corresponding adjustment mencegah negara tuan rumah juga menghitung pemotongan yang sama.",
  "Example: without it, Indonesia and a buyer in Japan could both claim the same forest tonne.":
    "Contoh: tanpa itu, Indonesia dan pembeli di Jepang bisa sama-sama mengklaim satu ton hutan yang sama.",
  "The Science Based Targets initiative, which checks company climate targets. Under its net-zero standard, carbon credits do not count toward cutting a company's own emissions.":
    "Science Based Targets initiative, yang memeriksa target iklim perusahaan. Di bawah standar net-zero-nya, kredit karbon tidak dihitung untuk memangkas emisi perusahaan sendiri.",
  "Example: a company with an SBTi target must reduce its Scope 1 and 2 emissions, whatever credits it buys.":
    "Contoh: perusahaan dengan target SBTi harus mengurangi emisi Scope 1 dan 2-nya, kredit apa pun yang dibeli.",
  "Calling a product, service or event neutral, zero or positive for the climate because credits were retired. Not allowed for products sold in the EU since 27 September 2026.":
    "Menyebut produk, layanan atau acara netral, nol atau positif untuk iklim karena kredit dipensiunkan. Tidak diizinkan untuk produk yang dijual di UE sejak 27 September 2026.",
  "Example: a retirement note for a credit card \"carbon neutral 2024\", flagged by Netra's live check.":
    "Contoh: retirement note untuk kartu kredit \"netral karbon 2024\", ditandai cek langsung Netra.",
  "Company emissions": "Emisi perusahaan",
  "Emissions a company produces directly: its own fuel, factories, vehicles and planes.":
    "Emisi yang dihasilkan perusahaan secara langsung: bahan bakar, pabrik, kendaraan dan pesawatnya sendiri.",
  "Example: Air Canada's Scope 1 in 2025: 12.0 Mt, almost all jet fuel.":
    "Contoh: Scope 1 Air Canada pada 2025: 12,0 Mt, hampir semua bahan bakar jet.",
  "Emissions from the electricity, heat or steam a company buys.":
    "Emisi dari listrik, panas atau uap yang dibeli perusahaan.",
  "Example: an office building's electricity bill, turned into tonnes.":
    "Contoh: tagihan listrik gedung kantor, diubah menjadi ton.",
  "Everything else in the value chain: suppliers, and customers using the product. Usually the biggest part.":
    "Sisanya di rantai nilai: pemasok, dan pelanggan yang memakai produk. Biasanya bagian terbesar.",
  "Example: the petrol customers burn in their cars is in an oil company's Scope 3.":
    "Contoh: bensin yang dibakar pelanggan di mobil masuk Scope 3 perusahaan minyak.",
  "Two ways to count Scope 2. Location-based uses the local grid's average; market-based counts green power contracts the company bought.":
    "Dua cara menghitung Scope 2. Location-based memakai rata-rata jaringan setempat; market-based menghitung kontrak listrik hijau yang dibeli perusahaan.",
  "Example: Natura's 2025 Scope 2 is 11,433 t location-based but 0.2 t market-based.":
    "Contoh: Scope 2 Natura 2025 adalah 11.433 t location-based tapi 0,2 t market-based.",
  "Which assets count as the company's. Operational control: what it runs. Equity share: what it owns, in proportion.":
    "Aset mana yang dihitung milik perusahaan. Operational control: apa yang dijalankannya. Equity share: apa yang dimilikinya, menurut porsi.",
  "Example: Chevron's Scope 1 is 52 Mt by equity share but 55 Mt by operational control.":
    "Contoh: Scope 1 Chevron 52 Mt menurut equity share tapi 55 Mt menurut operational control.",
  "A coalition that estimates emissions of power plants, mines, refineries and other assets from satellites and models, independent of what companies report.":
    "Koalisi yang memperkirakan emisi pembangkit, tambang, kilang dan aset lain dari satelit dan model, independen dari laporan perusahaan.",
  "Example: Climate TRACE puts Shell's ownership-weighted 2025 emissions at 123–151 Mt; Shell reports 46 Mt Scope 1. Different boundaries, shown side by side.":
    "Contoh: Climate TRACE menempatkan emisi Shell 2025 yang tertimbang kepemilikan di 123–151 Mt; Shell melaporkan 46 Mt Scope 1. Batas berbeda, ditampilkan berdampingan.",
  "The company's own document (annual report, sustainability statement, auditor's statement), not a third-party summary.":
    "Dokumen milik perusahaan sendiri (laporan tahunan, pernyataan keberlanjutan, pernyataan auditor), bukan ringkasan pihak ketiga.",
  "Example: Netra only uses emissions figures read from primary sources.":
    "Contoh: Netra hanya memakai angka emisi yang dibaca dari sumber primer.",
  "Hidden claims and double counting": "Klaim tersembunyi dan double counting",
  "The same tonne used for two claims. Double claiming: two companies (or a company and a country) both say one credit is theirs.":
    "Satu ton yang sama dipakai untuk dua klaim. Double claiming: dua perusahaan (atau perusahaan dan negara) sama-sama menyebut satu kredit miliknya.",
  "Example: a reseller retires one batch and tells two customers it is for them.":
    "Contoh: reseller memensiunkan satu batch dan memberi tahu dua pelanggan bahwa itu untuk mereka.",
  "A company that buys and retires credits on behalf of its customers. The registry shows the reseller, not the customer.":
    "Perusahaan yang membeli dan memensiunkan kredit atas nama pelanggannya. Registry menampilkan resellernya, bukan pelanggannya.",
  "Example: \"4AIR Client\" retired 3.9 Mt for clients who are not named.":
    "Contoh: \"4AIR Client\" memensiunkan 3,9 Mt untuk klien yang tidak disebut namanya.",
  "Turning a credit into a crypto token that can be traded on a blockchain. Verra banned tokenizing retired credits in 2022.":
    "Mengubah kredit menjadi token kripto yang bisa diperdagangkan di blockchain. Verra melarang tokenisasi kredit yang sudah dipensiunkan pada 2022.",
  "Example: about 22 million Verra credits were moved into tokens before the ban.":
    "Contoh: sekitar 22 juta kredit Verra dipindahkan menjadi token sebelum larangan itu.",
  "Each credit has a unique number. A retirement covers a range, from one number to another.":
    "Setiap kredit punya nomor unik. Satu retirement mencakup satu rentang, dari satu nomor ke nomor lain.",
  "Example: Shell's retirements cover 684 serial ranges.":
    "Contoh: retirement Shell mencakup 684 rentang serial.",
  "What some registry entries say instead of a beneficiary name. The credits were used for a claim, but the public record does not say whose.":
    "Tulisan di sebagian entri registry sebagai ganti nama beneficiary. Kredit dipakai untuk klaim, tapi catatan publik tidak menyebut milik siapa.",
  "Example: 89.4 Mt were retired to \"Not Disclosed\" since 2020, more than to any company (Shell: 42.3 Mt).":
    "Contoh: 89,4 Mt dipensiunkan ke \"Not Disclosed\" sejak 2020, lebih banyak daripada ke perusahaan mana pun (Shell: 42,3 Mt).",
  "The free-text reason a buyer can add when retiring credits. It often names the product or the year the claim covers.":
    "Alasan teks bebas yang bisa ditambah pembeli saat memensiunkan kredit. Sering menyebut produk atau tahun yang dicakup klaim.",
  "Example: \"Annual Carbon Offsetting to be Carbon Neutral\".":
    "Contoh: \"Annual Carbon Offsetting to be Carbon Neutral\".",
  "The blockchain part": "Bagian blockchain",
  "A public record that thousands of computers keep identical copies of. Once something is written, nobody can quietly change it.":
    "Catatan publik yang salinannya dipegang ribuan komputer. Setelah sesuatu ditulis, tidak ada yang bisa mengubah diam-diam.",
  "Example: Netra writes each check there, so it can be compared with the open data later.":
    "Contoh: Netra menulis setiap cek di sana, supaya bisa dibandingkan dengan data terbuka nanti.",
  "A small program that lives on the blockchain and runs exactly as written. Netra's is called ClaimRegistry.":
    "Program kecil yang hidup di blockchain dan berjalan persis seperti yang ditulis. Punya Netra bernama ClaimRegistry.",
  "Example: ClaimRegistry refuses a claim if its serial ranges were already claimed.":
    "Contoh: ClaimRegistry menolak klaim bila rentang serialnya sudah pernah diklaim.",
  "A public practice copy of a blockchain. It works the same, but its coins have no money value.":
    "Salinan latihan publik dari sebuah blockchain. Cara kerjanya sama, tapi koinnya tidak punya nilai uang.",
  "Example: Netra's records go to Ethereum Sepolia, so anyone can check them for free on Etherscan.":
    "Contoh: catatan Netra masuk ke Ethereum Sepolia, jadi siapa pun bisa memeriksanya gratis di Etherscan.",
  "A short fingerprint of a file. Change one character and the fingerprint is completely different.":
    "Sidik jari pendek dari sebuah berkas. Ubah satu karakter dan sidik jarinya berubah total.",
  "Example: the report hash on Netra proves the published grade matches the data.":
    "Contoh: hash laporan di Netra membuktikan nilai yang terbit cocok dengan datanya.",
  "One fingerprint that stands for a whole list. Anyone can prove one item is in the list without seeing the rest.":
    "Satu sidik jari yang mewakili seluruh daftar. Siapa pun bisa membuktikan satu item ada di daftar tanpa melihat sisanya.",
  "Example: Shell's 684 serial ranges are stored on-chain as one Merkle root.":
    "Contoh: 684 rentang serial Shell disimpan on-chain sebagai satu Merkle root.",
  "A fingerprint of one serial range. If the same nullifier appears in two claims, the second is a double claim.":
    "Sidik jari dari satu rentang serial. Kalau nullifier yang sama muncul di dua klaim, klaim kedua adalah double claim.",
  "Example: Netra's demo shows a duplicate claimant flagged this way.":
    "Contoh: demo Netra menampilkan pengklaim ganda yang ditandai dengan cara ini.",
  "The small fee paid to write to a blockchain. On a testnet it is paid with free practice coins.":
    "Biaya kecil untuk menulis ke blockchain. Di testnet biayanya dibayar dengan koin latihan gratis.",
  "Example: one Netra check costs about 590,000 gas on Sepolia, whether it covers 10 serial ranges or 684.":
    "Contoh: satu cek Netra memakan biaya sekitar 590.000 gas di Sepolia, mau mencakup 10 rentang serial atau 684.",
  "An account on a blockchain, written as a long code starting with 0x.":
    "Akun di blockchain, ditulis sebagai kode panjang yang diawali 0x.",
  "Example: 0xAf52…81B0 retired 2.0 Mt of credits. Who owns it is unknown.":
    "Contoh: 0xAf52…81B0 memensiunkan 2,0 Mt kredit. Siapa pemiliknya tidak diketahui.",
  "A call to the ClaimRegistry contract that proves one serial range sits in two published claims. The contract checks both proofs itself and flags the later claim for good.":
    "Panggilan ke kontrak ClaimRegistry yang membuktikan satu rentang serial ada di dua klaim terbit. Kontrak memeriksa kedua buktinya sendiri dan menandai klaim yang lebih baru untuk selamanya.",
  "Example: Netra's watcher challenged demo check #7 about ten seconds after it read it.":
    "Contoh: watcher Netra menantang cek demo #7 sekitar sepuluh detik setelah membacanya.",
  "A public website that shows every transaction and contract on a blockchain.":
    "Situs publik yang menampilkan setiap transaksi dan kontrak di sebuah blockchain.",
  "Example: Etherscan for Sepolia shows each ClaimRegistry record Netra published.":
    "Contoh: Etherscan untuk Sepolia menampilkan setiap catatan ClaimRegistry yang diterbitkan Netra.",
  "AI and live checks": "AI dan cek langsung",
  "Software trained on large amounts of text that can read a sentence and pull out its facts. Netra uses one only to read claims; it never supplies numbers.":
    "Perangkat lunak yang dilatih pada banyak teks dan bisa membaca kalimat lalu menarik faktanya. Netra memakainya hanya untuk membaca klaim; tidak pernah memberi angka.",
  "Example: from \"our 2025 flights were carbon neutral\" it reads the year 2025 and the wording \"carbon neutral\", each with a quote.":
    "Contoh: dari \"penerbangan kami 2025 netral karbon\" ia membaca tahun 2025 dan frasa \"netral karbon\", masing-masing dengan kutipan.",
  "A machine-learning method that finds the few cases that differ most from the rest, by how quickly random splits can isolate them.":
    "Metode machine learning yang menemukan sedikit kasus yang paling berbeda dari yang lain, lewat seberapa cepat pembagian acak bisa mengisolasi mereka.",
  "Example: 8 of 540 large buyers stand out, such as a wallet whose credits are all pre-2016 vintages from rejected methodologies.":
    "Contoh: 8 dari 540 pembeli besar menonjol, seperti wallet yang kreditnya semua vintage pra-2016 dari metodologi yang ditolak.",
  "A program that runs all the time, reads every new on-chain check and flags any serial range used twice.":
    "Program yang berjalan terus, membaca setiap cek on-chain baru dan menandai rentang serial yang dipakai dua kali.",
  "Example: a demo duplicate reusing five of Shell's serial ranges was flagged about ten seconds after the watcher read it.":
    "Contoh: duplikat demo yang memakai ulang lima rentang serial Shell ditandai sekitar sepuluh detik setelah watcher membacanya.",
  "A public server that lets a website read the blockchain. Netra tries three in turn in case one is down.":
    "Server publik yang memungkinkan situs membaca blockchain. Netra mencoba tiga server bergantian kalau satu sedang mati.",
  "Example: the \"Live\" dot on the on-chain proof section shows the connection.":
    "Contoh: titik \"Langsung\" di bagian bukti on-chain menampilkan koneksi itu.",
  "Every ten minutes Netra reads the newest Verra retirements and scores each with the same rules as the rest of the site.":
    "Setiap sepuluh menit Netra membaca retirement Verra terbaru dan menilai tiap retirement dengan aturan yang sama seperti bagian lain di situs.",
  "Example: a retirement made 4 minutes ago, shown with its likely-real share and ICVCM label.":
    "Contoh: retirement yang dibuat 4 menit lalu, ditampilkan dengan porsi kemungkinan nyata dan label ICVCM-nya.",
  "The part of the live check that reads retirement notes with the AI claim reader and flags offset-based neutrality claims.":
    "Bagian dari cek langsung yang membaca retirement note dengan AI claim reader dan menandai klaim netral berbasis offset.",
  "Example: a bank's note \"credit card carbon neutral\" is flagged; a note that only says \"offset\" is not.":
    "Contoh: catatan bank \"kartu kredit netral karbon\" ditandai; catatan yang hanya menyebut \"offset\" tidak.",
  "Paste a green claim; the AI reads who claims what, with quotes from your text, and Netra's data gives the verdict.":
    "Tempel klaim hijau; AI membaca siapa mengklaim apa, dengan kutipan dari teks Anda, dan data Netra memberi putusan.",
  "Example: \"Our 2025 flights were carbon neutral\" is read as company, year and wording, then checked against the registry.":
    "Contoh: \"Penerbangan kami 2025 netral karbon\" dibaca sebagai perusahaan, tahun dan frasa, lalu diperiksa terhadap registry.",
  "Netra's own terms and sources": "Istilah dan sumber milik Netra",
  "Netra's letter for the share of researched tonnes that are likely real: A ≥ 60%, B 40–60%, C 20–40%, D 10–20%, E < 10%. No grade if research covers less than a quarter.":
    "Huruf Netra untuk porsi ton yang diteliti yang kemungkinan nyata: A ≥ 60%, B 40–60%, C 20–40%, D 10–20%, E < 10%. Tidak ada nilai bila riset mencakup kurang dari seperempat.",
  "Example: Shell gets C (22.8%).": "Contoh: Shell dapat C (22,8%).",
  "Netra only assigns a project type when three sources agree: Berkeley's type, CarbonPlan's type and the methodology code. Any disagreement means no estimate.":
    "Netra hanya menetapkan jenis proyek bila tiga sumber setuju: jenis dari Berkeley, jenis dari CarbonPlan dan kode metodologi. Tidak sepakat berarti tanpa estimasi.",
  "Example: 234 projects disagree and get no estimate rather than a guess.":
    "Contoh: 234 proyek tidak sepakat dan tidak dapat estimasi, bukan tebakan.",
  "The Voluntary Registry Offsets Database from UC Berkeley: every Verra and Gold Standard credit and retirement, cleaned and free to use (CC BY 4.0).":
    "Voluntary Registry Offsets Database dari UC Berkeley: semua kredit dan retirement Verra dan Gold Standard, sudah dibersihkan dan bebas dipakai (CC BY 4.0).",
  "Example: Netra uses version 2026-08.": "Contoh: Netra memakai versi 2026-08.",
  "An open database of carbon projects from the non-profit CarbonPlan. Netra uses its project types as the second signal.":
    "Basis data terbuka proyek karbon dari nirlaba CarbonPlan. Netra memakai jenis proyeknya sebagai sinyal kedua.",
  "Example: it disagrees with Berkeley on Katingan (VCS1477), so Netra gives that project no estimate.":
    "Contoh: tidak sepakat dengan Berkeley soal Katingan (VCS1477), jadi Netra tidak memberi estimasi untuk proyek itu.",
  "A study in Nature Communications that pooled 2,346 projects and found fewer than 16% of credits were real reductions. Netra's OARs come from it.":
    "Studi di Nature Communications yang menggabungkan 2.346 proyek dan menemukan kurang dari 16% kredit adalah pengurangan nyata. OAR Netra berasal dari studi ini.",
  "Shown when no peer-reviewed study measured how many credits of that project type are real. Netra leaves it empty instead of guessing.":
    "Ditampilkan bila tidak ada studi peer-review yang mengukur berapa kredit jenis proyek itu yang nyata. Netra membiarkannya kosong alih-alih menebak.",
  "Example: most solar and hydro credits show \"No estimate\".":
    "Contoh: sebagian besar kredit surya dan air menampilkan \"Tanpa estimasi\".",
  "In the live check: a project that is not yet in the Berkeley VROD snapshot, so its type has not been checked three ways. No estimate is shown.":
    "Dalam cek langsung: proyek yang belum ada di snapshot Berkeley VROD, jadi jenisnya belum diperiksa lewat tiga cara. Tidak ada estimasi yang ditampilkan.",
  "Example: a project registered after August 2026.": "Contoh: proyek yang terdaftar setelah Agustus 2026.",
  "A non-profit that publishes the yearly State of the Voluntary Carbon Market report with volumes and average prices.":
    "Nirlaba yang menerbitkan laporan tahunan State of the Voluntary Carbon Market berisi volume dan harga rata-rata.",
  "Example: the source of the $6.34 average price for 2024.":
    "Contoh: sumber harga rata-rata $6,34 untuk 2024.",
  "No term matches. Try a shorter word.":
    "Tidak ada istilah yang cocok. Coba kata yang lebih pendek.",
  "netra · Missing a word?": "netra · Ada istilah yang kurang?",
  "Ask for it": "Ajukan",
});

// leftovers on index, result, report and proof: aria-labels, project-type names, gap reasons
Object.assign(ID_EXACT, {
  "Ganti ke Bahasa Indonesia": "Ganti ke Bahasa Indonesia",
  "· Data:": "· Data:", "doi": "doi",
  "About · Netra": "About · Netra", "Glossary · Netra": "Glossary · Netra",
  "What these credits are likely worth": "Berapa nilai sebenarnya dari kredit ini",
  "Evidence": "Bukti", "Chapters": "Bagian",
  // project-type names (owners.json bt keys)
  "Afforestation/Reforestation": "Penghutanan kembali",
  "Avoided Grassland Conversion": "Konversi padang rumput yang dicegah",
  "Bicycles": "Sepeda", "Biochar": "Biochar", "Biodigesters": "Biodigester", "Biomass": "Biomassa",
  "Brick Manufacturing Emission Reductions": "Pengurangan emisi pembuatan bata",
  "Bundled Energy Efficiency": "Efisiensi energi terpadu",
  "Carbon Capture in Concrete": "Penangkapan karbon dalam beton",
  "Carbon-Absorbing Concrete": "Beton penyerap karbon",
  "Clean Water": "Air bersih", "Community Boreholes": "Sumur bor komunitas", "Composting": "Pengomposan",
  "Electric Vehicles & Charging": "Kendaraan listrik dan pengisian daya",
  "Energy Efficiency": "Efisiensi energi", "Feed Additives": "Aditif pakan", "Fleet Efficiency": "Efisiensi armada",
  "Fuel Switching": "Perpindahan bahan bakar", "Geothermal": "Panas bumi",
  "HFC23 Destruction": "Penghancuran HFC23", "Hydropower": "Tenaga air",
  "Improved Forest Management": "Pengelolaan hutan yang ditingkatkan",
  "Improved Irrigation Management": "Pengelolaan irigasi yang ditingkatkan",
  "Improved irrigation management": "Pengelolaan irigasi yang ditingkatkan",
  "Landfill Methane": "Metana dari TPA",
  "Leak Detection & Repair in Gas Systems": "Deteksi dan perbaikan kebocoran sistem gas",
  "Lighting": "Penerangan", "Manure Methane Digester": "Digester metana kotoran ternak",
  "Methane Recovery in Wastewater": "Pemulihan metana di air limbah",
  "Mine Methane Capture": "Penangkapan metana tambang",
  "N2O Destruction in Nitric Acid Production": "Penghancuran N2O pada produksi asam nitrat",
  "Natural Gas Electricity Generation": "Pembangkit listrik gas alam",
  "Ozone Depleting Substances Recovery & Destruction": "Pemulihan dan penghancuran zat perusak ozon",
  "RE Bundled": "Energi terbarukan terpadu", "REDD+": "REDD+",
  "Refrigerant Leak Detection": "Deteksi kebocoran refrigeran",
  "Rice Emission Reductions": "Pengurangan emisi padi",
  "Road Construction Emission Reductions": "Pengurangan emisi pembangunan jalan",
  "SF6 Replacement": "Penggantian SF6", "Shipping": "Perkapalan",
  "Solar - Centralized": "Surya - terpusat", "Solar - Distributed": "Surya - terdistribusi",
  "Solar - centralized": "Surya - terpusat", "Solar Lighting": "Penerangan surya",
  "Solar Water Heaters": "Pemanas air surya", "Solid Waste Separation": "Pemilahan sampah padat",
  "Sustainable Agriculture": "Pertanian berkelanjutan",
  "Sustainable Grassland Management": "Pengelolaan padang rumput berkelanjutan",
  "University Campus Emission Reductions": "Pengurangan emisi kampus universitas",
  "Waste Diversion": "Pengalihan sampah", "Waste Gas Recovery": "Pemulihan gas buang",
  "Waste Heat Recovery": "Pemulihan panas buang", "Waste Incineration": "Insinerasi sampah",
  "Waste Recycling": "Daur ulang sampah", "Weatherization": "Penyesuaian bangunan terhadap cuaca",
  "Wetland Restoration": "Pemulihan lahan basah", "Wind": "Tenaga angin",
  // gap reasons (companies.json gap.reason, shown as title and in "No reported figure:")
  "Civitas merged into SM Energy; its 2025 Corporate Sustainability Report was removed from civitasresources.com (HTTP 404) and the web archive copy could not be read.":
    "Civitas bergabung ke SM Energy; laporan Corporate Sustainability Report 2025 miliknya dihapus dari civitasresources.com (HTTP 404) dan salinan di arsip web tidak dapat dibaca.",
  "Greenchoice publishes CO2 Performance Ladder reports (full year 2024, first half 2025), but its file server refused connections from our network, so the figures could not be read and verified.":
    "Greenchoice menerbitkan laporan CO2 Performance Ladder (tahun penuh 2024, paruh pertama 2025), tetapi file servernya menolak koneksi dari jaringan kami, jadi angkanya tidak bisa dibaca dan diverifikasi.",
  "Powershop Australia belongs to Shell Energy Australia; its emissions are inside Shell's group reporting, with no separate figure.":
    "Powershop Australia milik Shell Energy Australia; emisinya ada di dalam laporan grup Shell, tanpa angka terpisah.",
  "LichtBlick's audited management report for 1 Apr 2025 to 31 Mar 2026 contains no emissions figures; its parent Eneco reports only one total for the whole group.":
    "Laporan manajemen LichtBlick yang diaudit untuk 1 Apr 2025 sampai 31 Mar 2026 tidak memuat angka emisi; induknya Eneco hanya melaporkan satu total untuk seluruh grup.",
  "The most recent GASAG sustainability report available is for 2019/2020; no current emissions figure is published.":
    "Laporan keberlanjutan GASAG terbaru yang tersedia adalah untuk 2019/2020; tidak ada angka emisi terkini yang diterbitkan.",
  "The \"Hörmann Gruppe\" sustainability report belongs to HÖRMANN Industries, a different company, so it was not used. No report from Hörmann KG itself was found.":
    "Laporan keberlanjutan \"Hörmann Gruppe\" milik HÖRMANN Industries, perusahaan lain, jadi tidak dipakai. Tidak ditemukan laporan dari Hörmann KG sendiri.",
  "ESWE publishes a 2025 annual report and sustainability brochure, but its website refused connections from our network, so they could not be read.":
    "ESWE menerbitkan laporan tahunan 2025 dan brosur keberlanjutan, tetapi situsnya menolak koneksi dari jaringan kami, jadi keduanya tidak bisa dibaca.",
  "BCG's 2025 Annual Sustainability Report shows Scope 1 only as an unlabelled chart segment; the value cannot be read as a sourced figure, so it is left out.":
    "Annual Sustainability Report 2025 dari BCG hanya menampilkan Scope 1 sebagai segmen grafik tanpa label; nilainya tidak bisa dibaca sebagai angka bersumber, jadi ditinggalkan.",
  "Arcadian (trading as Hewitt) publishes product-level Climate Active disclosures for its lamb, pork and chicken, not a company total, so there is no company figure to show.":
    "Arcadian (berdagang sebagai Hewitt) menerbitkan pengungkapan Climate Active tingkat produk untuk domba, babi dan ayamnya, bukan total perusahaan, jadi tidak ada angka perusahaan untuk ditampilkan.",
  "Kelar is a single gas power plant in Chile retiring credits under Chile's carbon tax law; it publishes no company report. Plant-level data in Chile's national emissions register (RETC) has not been read yet.":
    "Kelar adalah satu pembangkit listrik gas di Chile yang memensiunkan kredit di bawah hukum pajak karbon Chile; tidak menerbitkan laporan perusahaan. Data tingkat pembangkit di register emisi nasional Chile (RETC) belum dibaca.",
  "The audited 2024 accounts mention the cost of CO2 allowances under the EU emissions trading scheme but give no emissions in tonnes, and the company website has no sustainability report. Plant-level EU ETS data has not been read yet.":
    "Laporan keuangan 2024 yang diaudit menyebut biaya izin CO2 di bawah skema perdagangan emisi EU, tetapi tidak memberikan emisi dalam ton, dan situs perusahaan tidak punya laporan keberlanjutan. Data EU ETS tingkat pembangkit belum dibaca.",
  "The registry name alone does not identify which company this is (several firms use the name), so no report can be matched safely.":
    "Nama registry saja tidak mengidentifikasi perusahaan yang mana ini (beberapa firma memakai nama itu), jadi tidak ada laporan yang bisa dicocokkan dengan aman.",
  "Traxys's ESG page publishes policies and a conflict-minerals report, but no emissions figure in tonnes.":
    "Halaman ESG Traxys menerbitkan kebijakan dan laporan mineral konflik, tetapi tidak ada angka emisi dalam ton.",
  "Bonnier reports emissions per business unit only (for example Bonnier Books gives percentage reductions); no group total in tonnes is published.":
    "Bonnier hanya melaporkan emisi per unit bisnis (misalnya Bonnier Books memberikan penurunan dalam persen); tidak ada total grup dalam ton yang diterbitkan.",
  "No separate figure for the Australian entity was found; Holcim's group figure is shown under Holcim AG.":
    "Tidak ditemukan angka terpisah untuk entitas Australia; angka grup Holcim ditampilkan di bawah Holcim AG.",
});

// Sentences with numbers or names inside: [pattern, replacement]. Applied in order to text that has no exact match.
const ago = (s) => s.replace(/(\d+) min ago/g, "$1 menit lalu").replace(/(\d+) h ago/g, "$1 jam lalu").replace(/(\d+) d ago/g, "$1 hari lalu");
const ID_RULES = [
  [/^(\d+ (?:min|h|d) ago)$/, (m, a) => ago(a)],
  [/^Checked (.+) · (\d+) newest retirements, (.+) to (.+)$/, (m, a, n, b, c) => `Diperiksa ${ago(a)} · ${n} retirement terbaru, ${ago(b)} sampai ${ago(c)}`],
  [/^retired in the (\d+) newest retirements\. Research covers$/, "dipensiunkan dalam $1 retirement terbaru. Riset mencakup"],
  [/^is likely real(?: \(([\d.]+%)\))?\.(?: (\d+) name a company Netra has reviewed\.)?$/, (m, p, n) => `kemungkinan nyata${p ? ` (${p})` : ""}.${n ? ` ${n} menyebut perusahaan yang sudah ditinjau Netra.` : ""}`],
  [/^of the newest notes call a product, service or event neutral because of offsets \(not allowed for products sold in the EU since 27 Sep 2026\)\.$/, "catatan terbaru menyebut produk, layanan atau acara netral karena offset (tidak boleh untuk produk yang dijual di EU sejak 27 Sep 2026)."],
  [/^Zombie credit · (\d+)$/, "Kredit zombie · $1"],
  [/^Vintage (\d+): the reduction happened 10 or more years before retirement$/, "Vintage $1: pengurangan emisinya terjadi 10 tahun atau lebih sebelum retirement"],
  [/^Since 27 Sep 2026, a product, service or event sold in the EU.*$/, "Sejak 27 Sep 2026, produk, layanan atau acara yang dijual di EU tidak boleh disebut netral karena offset (Directive 2024/825). Tidak diperiksa apakah yang ini dijual di EU."],
  [/^New retirement on Verra: (.+)$/, "Retirement baru di Verra: $1"],
  [/^New on-chain check #(\d+) recorded$/, "Pemeriksaan on-chain baru #$1 tercatat"],
  [/^Source: Verra Registry, public retirements \(registry\.verra\.org\)\..*$/, "Sumber: Verra Registry, retirement publik (registry.verra.org). Kemungkinan nyata: Probst et al. 2024 per jenis proyek, sama seperti di setiap hasil; \"Proyek baru\" berarti proyek belum ada di snapshot Berkeley VROD. Klaim netral berbasis offset: catatan retirement, dibaca AI pembaca klaim dengan kutipan, menyebut produk, layanan atau acara netral (atau zero, positif, terkompensasi) karena offset; sejak 27 Sep 2026 klaim seperti itu tidak boleh untuk produk yang dijual di EU (Directive 2024/825), dan Netra tidak memeriksa di mana produk ini dijual. Kredit zombie: vintage 10 tahun atau lebih sebelum retirement. Gold Standard tidak termasuk dalam pemeriksaan langsung."],
  [/^Search “(.+)” instead$/, "Cari “$1” saja"],
  [/^of credits(; the claim says)?\.?$/, (m, c) => `kredit${c ? "; klaim menyebut" : "."}`],
  [/^Offsets do not cut its own emissions: (.*)$/, "Offset tidak mengurangi emisinya sendiri: $1"],
  [/^in (\d{4})\.$/, "pada $1."],
  [/^Read by AI; each item is quoted from your text\. Every figure comes from Netra's data\. Full result for (.+) below\.$/, "Dibaca AI; setiap butir dikutip dari teks Anda. Setiap angka berasal dari data Netra. Hasil lengkap untuk $1 ada di bawah."],
  [/^In (\d{4}), (.+) retired$/, "Pada $1, $2 memensiunkan"],
  [/^No retirement by (.+) is recorded for (\d{4}) on Verra or Gold Standard(.*)$/, (m, n, y, rest) => `Tidak ada retirement oleh ${n} yang tercatat untuk ${y} di Verra atau Gold Standard${rest === "." ? "." : rest.replace(", yet the claim says", ", padahal klaim menyebut")}`],
  [/^Paste between (\d+) and (\d+) characters\.$/, "Tempel antara $1 dan $2 karakter."],
  [/^Retired (\S+) · ([\d,]+) retirements$/, "Dipensiunkan $1 · $2 retirement"],
  [/^(.+) retired · grade on the (\S+) covered by research$/, "$1 dipensiunkan · nilai untuk $2 yang tercakup riset"],
  [/^(.+) retired · not enough research coverage for a grade$/, "$1 dipensiunkan · cakupan riset belum cukup untuk nilai"],
  [/^Grade ([A-E])$/, "Nilai $1"],
  [/^retired (since|in) (\d{4}), research covers$/, (m, w, y) => `${w === "since" ? "sejak" : "pada"} ${y}, riset mencakup`],
  [/^(, too few for a grade)?\. Of those, about$/, (m, few) => `${few ? ", terlalu sedikit untuk nilai" : ""}. Dari jumlah itu, sekitar`],
  [/^likely cut real emissions(?: \(research range ([\d–-]+)\))?\.$/, (m, r) => `kemungkinan benar-benar mengurangi emisi${r ? ` (rentang riset ${r})` : ""}.`],
  [/^of credits were retired since (\d{4}) without naming who the climate benefit belongs to\. The public record names no one who could be held to these claims\.$/, "kredit dipensiunkan sejak $1 tanpa menyebut siapa pemilik manfaat iklimnya. Catatan publik tidak menyebut siapa pun yang bisa dimintai tanggung jawab atas klaim ini."],
  [/^None of the (.+)$/, "Tidak satu pun dari $1"],
  [/^retired (since|in) (\d{4}) comes from a project type with a published research estimate, so Netra cannot estimate how much was real\.$/, (m, w, y) => `yang dipensiunkan ${w === "since" ? "sejak" : "pada"} ${y} berasal dari jenis proyek dengan estimasi riset terbit, jadi Netra tidak bisa memperkirakan berapa yang nyata.`],
  [/^Filled: best estimate (\S+)$/, "Terisi: estimasi terbaik $1"],
  [/^Hatched: research range (\S+)$/, "Arsir: rentang riset $1"],
  [/^\(range (\S+)\)\.$/, "(rentang $1)."],
  [/^([\d.,]+ [kMG]?t) of ([\d.,]+ [kMG]?t)$/, "$1 dari $2"],
  [/^Scope 1$/, "Scope 1"],
  [/^ ?in (\d{4})$/, "pada $1"],
  [/^(.+)\. Source:$/, "$1. Sumber:"],
  [/^Credits retired since (\d{4}): (.+); of those, research suggests about (.+) were real reductions\.$/, "Kredit dipensiunkan sejak $1: $2; dari jumlah itu, riset memperkirakan sekitar $3 benar-benar mengurangi emisi."],
  [/^Climate TRACE's ownership-weighted estimate for the same group: (.+)\. The two use different boundaries, so neither replaces the other\.$/, "Estimasi Climate TRACE berbobot kepemilikan untuk grup yang sama: $1. Keduanya memakai batasan berbeda, jadi tidak saling menggantikan."],
  [/^What we checked: (.*)$/, "Yang kami periksa: $1"],
  [/^CO₂e in (\d{4})$/, "CO₂e pada $1"],
  [/^Ownership-weighted emissions of ([\d,]+) assets linked to$/, "Emisi berbobot kepemilikan dari $1 aset yang terkait dengan"],
  [/^\((.+)\) in Climate TRACE v5\.7\.0\. The range is wide.*$/, "($1) di Climate TRACE v5.7.0. Rentangnya lebar bila porsi kepemilikan tidak diketahui. Ini estimasi berbasis porsi ekuitas dari data satelit dan model, bukan Scope 1 yang dilaporkan perusahaan, jadi keduanya bisa berbeda dua kali lipat atau lebih."],
  [/^⚠ Climate TRACE's ownership data covers .+? (\S.+)'s main emissions .*$/, "⚠ Data kepemilikan Climate TRACE mencakup migas, batu bara, listrik, semen, baja, aluminium, kimia, pulp dan kertas, serta tambang. Emisi utama $1 (misalnya produksi kendaraan atau penerbangan) di luar cakupan itu, jadi angka ini jauh di bawah jejak sebenarnya."],
  [/^All retirements were in (\d{4}), so there is no trend to show\.$/, "Semua retirement terjadi pada $1, jadi tidak ada tren untuk ditampilkan."],
  [/^(\d{4}): (\S+) likely real$/, "$1: $2 kemungkinan nyata"],
  [/^⚠ (\S+) of these credits have a vintage before 2016, which the aviation scheme CORSIA does not accept\.$/, "⚠ $1 kredit ini ber-vintage sebelum 2016, yang tidak diterima skema penerbangan CORSIA."],
  [/^⚠ (\S+) come from methodologies ICVCM found do not meet its Core Carbon Principles\.$/, "⚠ $1 berasal dari metodologi yang menurut ICVCM tidak memenuhi Core Carbon Principles."],
  [/^([\d,]+) retirement records naming "(.+)" as beneficiary on Verra and Gold Standard, (\S+), from the Berkeley Voluntary Registry Offsets Database v2026-08 \(CC BY 4\.0\)\. Names are shown as published\.$/,
    "$1 catatan retirement yang menyebut \"$2\" sebagai penerima manfaat di Verra dan Gold Standard, $3, dari Berkeley Voluntary Registry Offsets Database v2026-08 (CC BY 4.0). Nama ditampilkan apa adanya."],
  [/^(.+): (.+), no published estimate, so not scored$/, (m, l, t) => `${tr(l)}: ${t}, belum ada estimasi terbit, jadi tidak dinilai`],
  [/^(.+): (.+), (\S+) likely real \(range (\S+)\); (.+)$/, (m, l, t, p, r, s) => `${tr(l)}: ${t}, ${p} kemungkinan nyata (rentang ${r}); ${s}`],
  [/^Tonnes × the share of real reductions measured for that type in peer-reviewed research\. The range is the study's uncertainty\. (.*)$/, (m, rest) => "Ton × porsi pengurangan nyata yang diukur untuk jenis itu dalam riset peer-reviewed. Rentangnya adalah ketidakpastian studi. " +
    rest.replace(/^Here: (.+) of (.+) researched tonnes \(range (.+)\)\.$/, "Di sini: $1 dari $2 ton yang diteliti (rentang $3).").replace("None of these tonnes are in a researched type.", "Tidak satu pun ton ini berasal dari jenis yang diteliti.")],
  [/^([A-E]), because (\S+) of researched tonnes are likely real\. Bands: (.+)$/, "$1, karena $2 ton yang diteliti kemungkinan nyata. Rentang: $3"],
  [/^No grade: research covers less than a quarter of the tonnes\. Bands: (.+)$/, "Tanpa nilai: riset mencakup kurang dari seperempat ton. Rentang: $1"],
  [/^, (.+); checked (\S+)\.(.*)$/, (m, sec, d, rest) => `, ${sec}; diperiksa ${d}.${rest.replace(/ Independent estimate: Climate TRACE v5\.7\.0 ownership data, ([\d,]+) assets of (.+)\./, " Estimasi independen: data kepemilikan Climate TRACE v5.7.0, $1 aset milik $2.")}`],
  [/^Independent estimate: Climate TRACE v5\.7\.0 ownership data, ([\d,]+) assets of (.+)\.$/, "Estimasi independen: data kepemilikan Climate TRACE v5.7.0, $1 aset milik $2."],
  [/^✓ Published on-chain (\S+) and matches the open data\.$/, "✓ Diterbitkan on-chain $1 dan cocok dengan data terbuka."],
  [/^See record #(\d+)$/, "Lihat catatan #$1"],
  [/^On-chain record #(\d+) exists but does not match the current data.*$/, "Catatan on-chain #$1 ada, tetapi tidak cocok dengan data terkini (dataset diperbarui setelah diterbitkan)."],
  [/^Could not reach the (.+?) to check on-chain records\.$/, "Tidak bisa menjangkau $1 untuk memeriksa catatan on-chain."],
  [/^report (0x\S+)$/, "laporan $1"],
  [/^of covered tonnes likely real \(range (\S+)\)$/, "dari ton yang tercakup kemungkinan nyata (rentang $1)"],
  [/^(\S+) · (\S+) real$/, "$1 · $2 nyata"],
  [/^(\S+) · no estimate$/, "$1 · tanpa estimasi"],
  [/^of (.+) retired cannot be tied to a named claimant$/, "dari $1 yang dipensiunkan tidak bisa dikaitkan ke pengklaim bernama"],
  [/^name someone\. Only (\S+) are companies Netra has reviewed$/, "menyebut seseorang. Hanya $1 yang merupakan perusahaan yang sudah ditinjau Netra"],
  [/^(.+) ([\d,]+) accounts?\.$/, (m, s, n) => `${tr(s)} ${n} akun.`],
  [/^(\S+) of (.+) researched$/, "$1 dari $2 yang diteliti"],
  [/^✓ ([\d,]+) serial ranges match$/, "✓ $1 rentang serial cocok"],
  [/^([\d,]+) ranges \(list unavailable\)$/, "$1 rentang (daftar tidak tersedia)"],
  [/^([\d,]+) ranges \(strict\)$/, "$1 rentang (ketat)"],
  [/^(.+) · vintage (\S+)$/, "$1 · vintage $2"],
];
// Phrases whose numbers change with the data: [pattern, replacement].
ID_RULES.push(
  [/^([A-Z]{3,5}) · ([\d.,]+ [KMG]?B)$/, "$1 · $2"],
  [/^total ([\d.,]+ (?:Mt|kt|t))(?: \((\d{4})\))?$/, (m, a, b) => `total ${a}${b ? ` (${b})` : ""}`],
  [/^Compare (.+)$/, (m, a) => `Bandingkan ${tr(a) || a}`],
  [/^No reported figure: (.+)$/, (m, a) => `Tidak ada angka terlapor: ${tr(a) || a}`],
  [/^\. Research covers ([\d.,]+ (?:Mt|kt|t)); about$/, ". Riset mencakup $1; sekitar"],
  [/^company groups reviewed; ([\d,]+) with emissions from their own reports$/, "grup perusahaan ditinjau; $1 dengan emisi dari laporan mereka sendiri"],
  [/^of researched tonnes are likely real \(range ([\d.,]+%–[\d.,]+%)\)$/, "dari ton yang diteliti kemungkinan nyata (rentang $1)"],
  [/^(\d{4}) \(to August\)$/, "$1 (hingga Agustus)"],
  [/^Best estimate ([\d.,]+%) likely real, research range ([\d.,]+%) to ([\d.,]+%)$/, "Estimasi terbaik $1 kemungkinan nyata, rentang riset $2 sampai $3"],
  [/^Retired on Verra and Gold Standard since 2020: ([\d.,]+ (?:Mt|kt|t)); From project types with a published research estimate: ([\d.,]+ (?:Mt|kt|t)); Likely real, best estimate: ([\d.,]+ (?:Mt|kt|t))$/,
    "Dipensiunkan di Verra dan Gold Standard sejak 2020: $1; Dari jenis proyek dengan estimasi riset yang terbit: $2; Kemungkinan nyata, estimasi terbaik: $3"],
  [/^(0x\S+) \(Ethereum Sepolia testnet\)$/, "$1 (jaringan uji Ethereum Sepolia)"],
  [/^([\d.,]+)% use methodologies ICVCM found do not meet its Core Carbon Principles(\.)?$/, "$1% memakai metodologi yang menurut ICVCM tidak memenuhi Core Carbon Principles$2"],
  [/^([\d.,]+)% of the volume was retired in a single year(\.)?$/, "$1% volumenya dipensiunkan dalam satu tahun$2"],
  [/^Only ([\d.,]+%) of researched tonnes are likely real(\.)?$/, "Hanya $1 dari ton yang diteliti kemungkinan nyata$2"],
  [/^Average retirement of ([\d,]+ t), far above typical(\.)?$/, "Rata-rata retirement $1, jauh di atas biasanya$2"],
  [/^([\d.,]+)% of credits have a vintage before 2016(\.)?$/, "$1% kredit memiliki vintage sebelum 2016$2"],
);
// Hidden-buyer explanations (KIND in app.js) are matched inside the "N accounts." sentence via tr().
Object.assign(ID_EXACT, {
  "A real company, reviewed by hand and matched to its group (Gucci is counted under Kering).": "Perusahaan nyata, ditinjau manual dan dicocokkan ke grupnya (Gucci dihitung di bawah Kering).",
  "A name is given, but it is one of 44,000+ smaller names Netra has not reviewed one by one.": "Ada nama, tetapi termasuk 44.000+ nama kecil yang belum ditinjau Netra satu per satu.",
  "A government or public authority.": "Pemerintah atau lembaga publik.",
  "An offset seller retires credits on behalf of its customers. Who the customers are is not in the registry.": "Penjual offset memensiunkan kredit atas nama pelanggannya. Siapa pelanggannya tidak ada di registry.",
  "Retired to a blockchain address. Who holds the climate claim cannot be seen.": "Dipensiunkan ke alamat blockchain. Siapa pemegang klaim iklimnya tidak terlihat.",
  "Retired to create crypto tokens. Verra stopped allowing this in 2022.": "Dipensiunkan untuk membuat token kripto. Verra berhenti mengizinkannya pada 2022.",
  "A short code (for example \"DL\") that matches no organisation in the registry details. Netra does not guess.": "Kode pendek (misalnya \"DL\") yang tidak cocok dengan organisasi mana pun di detail registry. Netra tidak menebak.",
  "The beneficiary field is blank or says \"Not Disclosed\". The public record names no one who could be held to this claim.": "Kolom penerima manfaat kosong atau berisi \"Not Disclosed\". Catatan publik tidak menyebut siapa pun yang bisa dimintai tanggung jawab atas klaim ini.",
});

// Report, Proof and the redesigned result.
Object.assign(ID_EXACT, {
  "Netra · See what a carbon claim is really worth": "Netra · Lihat nilai sebenarnya dari sebuah klaim karbon",
  "Report · Netra": "Laporan · Netra", "Proof · Netra": "Bukti · Netra",
  "Report": "Laporan", "Proof": "Bukti", "Read the report": "Baca laporannya", "Source:": "Sumber:",
  // result: claim receipt and evidence tabs
  "not covered by published research": "tidak tercakup riset yang terbit",
  "research says likely not real": "menurut riset kemungkinan tidak nyata",
  "Likely real, best estimate": "Kemungkinan nyata, estimasi terbaik",
  "Credits": "Kredit", "Over time": "Dari waktu ke waktu", "On-chain": "On-chain",
  "Fingerprint of this result": "Sidik jari hasil ini",
  "keccak256 of this buyer's record, exactly as published in": "keccak256 dari catatan pembeli ini, persis seperti diterbitkan di",
  "Recompute in your browser": "Hitung ulang di browser Anda",
  "No on-chain record for this buyer yet, so there is nothing to compare.": "Belum ada catatan on-chain untuk pembeli ini, jadi belum ada yang bisa dibandingkan.",
  // report
  "What 876 Mt of retired credits were really worth.": "Berapa nilai sebenarnya dari 876 Mt kredit yang dipensiunkan.",
  "Every Verra and Gold Standard retirement since 2020, followed from the registry to what research says was real, and to who claims it.":
    "Setiap retirement Verra dan Gold Standard sejak 2020, ditelusuri dari registry ke apa yang menurut riset nyata, dan ke siapa yang mengklaimnya.",
  "The market": "Pasar", "Has it improved?": "Apakah membaik?", "Who is hidden": "Siapa yang tersembunyi",
  "From 876 Mt retired to what was likely real": "Dari 876 Mt yang dipensiunkan ke yang kemungkinan nyata",
  "Retired on Verra and Gold Standard since 2020": "Dipensiunkan di Verra dan Gold Standard sejak 2020",
  "From project types with a published research estimate": "Dari jenis proyek dengan estimasi riset yang terbit",
  "Has the quality of retired credits improved?": "Apakah kualitas kredit yang dipensiunkan membaik?",
  // proof
  "Check it yourself in three steps": "Periksa sendiri dalam tiga langkah",
  "Get the report.": "Ambil laporannya.", "Hash it.": "Hitung hash-nya.", "Compare.": "Bandingkan.",
  "Each record points to its file, for example": "Setiap catatan menunjuk ke filenya, misalnya",
  "Take the report object in that file as JSON, exactly as stored, and compute its keccak256:": "Ambil objek report di file itu sebagai JSON, persis seperti tersimpan, lalu hitung keccak256-nya:",
  "On the block explorer, read the record: its report hash must be the same, and the serial list in the file must give its serial root. This page does both for every record above.":
    "Di block explorer, baca catatannya: hash laporannya harus sama, dan daftar serial di file harus menghasilkan serial root-nya. Halaman ini melakukan keduanya untuk setiap catatan di atas.",
  "Who can do what": "Siapa bisa melakukan apa",
  "Publishing needs Netra's key.": "Menerbitkan butuh kunci Netra.",
  "Only an address holding the attester role can record a check.": "Hanya alamat pemegang peran attester yang bisa mencatat pemeriksaan.",
  "Flagging needs only proof.": "Menandai cukup dengan bukti.",
  "Anyone can challenge a record with two Merkle proofs; the contract checks them itself, so a wrong challenge fails.": "Siapa pun bisa menantang sebuah catatan dengan dua bukti Merkle; kontrak memeriksanya sendiri, jadi tantangan yang salah gagal.",
  "No one can edit or delete a check.": "Tidak ada yang bisa mengubah atau menghapus pemeriksaan.",
  "The contract has no function for it. The only change possible is the double-claim flag, and only with valid proofs.": "Kontrak tidak punya fungsi untuk itu. Satu-satunya perubahan yang mungkin adalah tanda klaim ganda, dan hanya dengan bukti yang sah.",
  "What it does not prove.": "Yang tidak dibuktikannya.",
  "That a report is accurate, or that its serial ranges were retired as stated: the contract stores fingerprints and reads nothing outside itself.": "Bahwa laporan itu akurat, atau bahwa rentang serialnya dipensiunkan seperti yang dinyatakan: kontrak menyimpan sidik jari dan tidak membaca apa pun di luar dirinya.",
});
ID_RULES.unshift( // checked before the general rules above (e.g. "None of the …")
  [/^None of the (\d+) big buyers that research covers well enough to grade reaches a B\.$/, "Tidak satu pun dari $1 pembeli besar yang cukup tercakup riset untuk diberi nilai mencapai B."],
  [/^(\d+) of the (\d+) big buyers that research covers well enough to grade reach a B or better\.$/, "$1 dari $2 pembeli besar yang cukup tercakup riset untuk diberi nilai mencapai B atau lebih baik."],
  [/^Retired for (.+), (\S+)$/, "Dipensiunkan untuk $1, $2"],
  [/^Filled: best estimate (\S+) of researched$/, "Terisi: estimasi terbaik $1 dari yang diteliti"],
  [/^Hatched: range (.+)$/, "Arsir: rentang $1"],
  [/^Outline: researched (.+)$/, "Garis: diteliti $1"],
  [/^\(entry (\d+)\)\.$/, "(entri $1)."],
  [/^✓ Same as on-chain record #(\d+)\.$/, "✓ Sama dengan catatan on-chain #$1."],
  [/^On-chain record #(\d+) holds (\S+): the data changed after it was published\.$/, "Catatan on-chain #$1 berisi $2: datanya berubah setelah diterbitkan."],
  [/^(\S+) of all tonnes$/, "$1 dari semua ton"],
  [/^(\S+) of researched tonnes; range (.+)$/, "$1 dari ton yang diteliti; rentang $2"],
  [/^(\S+) of all tonnes have a blank beneficiary field, and only (\S+) use a methodology with the ICVCM quality label\.$/,
    "$1 dari semua ton kolom penerima manfaatnya kosong, dan hanya $2 memakai metodologi berlabel kualitas ICVCM."],
);

// Home as a story (overhaul): hero, chapters, the figure, and where to go next.
Object.assign(ID_EXACT, {
  "Netra · A tonne on paper is not a tonne in the air": "Netra · Satu ton di atas kertas bukan satu ton di udara",
  "Story": "Cerita", "The story": "Cerita",
  "Field notes on the carbon market": "Catatan lapangan tentang pasar karbon",
  "A tonne on paper is not a tonne in the air.": "Satu ton di atas kertas bukan satu ton di udara.",
  "Since 2020, companies retired 876 million tonnes of carbon credits to call themselves greener. We followed every one of them, from the registry to the research.":
    "Sejak 2020, perusahaan memensiunkan 876 juta ton kredit karbon untuk menyebut diri mereka lebih hijau. Kami menelusuri semuanya, dari registry sampai riset.",
  "Check a company": "Periksa perusahaan",
  "What gets counted": "Apa yang dihitung",
  "A carbon credit is supposed to be one tonne of CO₂ kept out of the air. When a company uses one for a climate claim, the credit is":
    "Satu kredit karbon seharusnya berarti satu ton CO₂ yang tidak sampai ke udara. Saat perusahaan memakainya untuk klaim iklim, kredit itu",
  "retired": "dipensiunkan",
  "in a public registry, and that tonne counts as the company's.": "di registry publik, dan ton itu dihitung sebagai milik perusahaan tersebut.",
  "Since 2020,": "Sejak 2020,", "876 million tonnes": "876 juta ton",
  "were retired on Verra and Gold Standard, the two largest registries.": "dipensiunkan di Verra dan Gold Standard, dua registry terbesar.",
  "What research can measure": "Apa yang bisa diukur riset",
  "Researchers have measured how much a credit really cut for some kinds of project: cookstoves, forest protection, wind farms, industrial gases. For the rest there is no published estimate, and Netra does not invent one.":
    "Peneliti sudah mengukur berapa yang benar-benar dikurangi sebuah kredit untuk sebagian jenis proyek: kompor masak, perlindungan hutan, ladang angin, gas industri. Untuk sisanya belum ada estimasi terbit, dan Netra tidak mengarangnya.",
  "The measured kinds cover": "Jenis yang sudah diukur mencakup", "38 in 100": "38 dari 100", "of the tonnes.": "ton.",
  "What holds up": "Apa yang bertahan",
  "A study of 2,346 projects (Probst et al.,": "Studi atas 2.346 proyek (Probst et al.,",
  ", 2024) measured the real reductions behind each kind of project. Applied to the measured tonnes, about":
    ", 2024) mengukur pengurangan nyata di balik tiap jenis proyek. Diterapkan pada ton yang sudah diukur, sekitar",
  "19 in 100": "19 dari 100", "cut real emissions.": "benar-benar mengurangi emisi.",
  "The research range is wide, so every result on Netra shows the range next to the best estimate.":
    "Rentang risetnya lebar, jadi setiap hasil di Netra menampilkan rentang di samping estimasi terbaik.",
  "Has it improved?": "Apakah membaik?",
  "No. If anything it slipped: from": "Tidak. Malah sedikit merosot: dari",
  "of measured tonnes in 2021 to": "ton terukur pada 2021 menjadi",
  "Who is counting": "Siapa yang mengklaim",
  "Every retirement has a field for who the climate benefit belongs to. For": "Setiap retirement punya kolom untuk siapa pemilik manfaat iklimnya. Untuk",
  "57 in 100": "57 dari 100",
  "tonnes, it names no one you could hold to the claim: it is blank, says \"Not Disclosed\", or points to a reseller, a crypto wallet or a code.":
    "ton, kolom itu tidak menyebut siapa pun yang bisa dimintai tanggung jawab atas klaimnya: kosong, berisi \"Not Disclosed\", atau menunjuk ke reseller, dompet kripto, atau sebuah kode.",
  "The biggest buyers": "Pembeli terbesar",
  "Netra reviewed the largest buyers by hand and grouped them by owner. Research covers": "Netra meninjau pembeli terbesar satu per satu dan mengelompokkannya per pemilik. Riset mencakup",
  "of them well enough for a grade from A to E.": "di antaranya cukup baik untuk diberi nilai A sampai E.",
  "None reaches a B.": "Tidak satu pun mencapai B.",
  "A record no one can edit": "Catatan yang tidak bisa diubah siapa pun",
  "Every published check is written to a public blockchain, with a fingerprint of the report and of the serial numbers behind it. No one, not even Netra, can change it.":
    "Setiap pemeriksaan yang terbit ditulis ke blockchain publik, bersama sidik jari laporan dan nomor serial di baliknya. Tidak ada yang bisa mengubahnya, termasuk Netra.",
  "If one serial range shows up in two claims, anyone can prove it, and the later claim is flagged for good.":
    "Jika satu rentang serial muncul di dua klaim, siapa pun bisa membuktikannya, dan klaim yang lebih baru ditandai selamanya.",
  "See the records": "Lihat catatannya",
  "Check a company yourself.": "Periksa sendiri sebuah perusahaan.",
  "Go deeper.": "Lebih dalam.",
  "The whole market as charts: project types, years, and every account that hides who claims.": "Seluruh pasar dalam grafik: jenis proyek, tahun, dan setiap akun yang menyembunyikan siapa pengklaimnya.",
  "Every published check on a public blockchain, and how to verify one yourself.": "Setiap pemeriksaan yang terbit di blockchain publik, dan cara memverifikasinya sendiri.",
  "All reviewed companies side by side, with downloads.": "Semua perusahaan yang ditinjau, berdampingan, dengan unduhan.",
  "Every carbon-market and blockchain word on this site, in plain English.": "Setiap istilah pasar karbon dan blockchain di situs ini, dalam bahasa sederhana.",
  "Who made Netra, the method, the sources and the limits.": "Siapa pembuat Netra, metodenya, sumbernya, dan batasannya.",
  "netra · Data: Berkeley Carbon Trading Project VROD (CC BY 4.0), CarbonPlan OffsetsDB, ICVCM, Climate TRACE, Probst et al. 2024, company reports. Photo: Paul Jarvis on Unsplash.":
    "netra · Data: Berkeley Carbon Trading Project VROD (CC BY 4.0), CarbonPlan OffsetsDB, ICVCM, Climate TRACE, Probst et al. 2024, laporan perusahaan. Foto: Paul Jarvis di Unsplash.",
  // the story figure
  "retired since 2020, each counted as a real tonne": "dipensiunkan sejak 2020, masing-masing dihitung sebagai satu ton nyata",
  "Verra and Gold Standard, Berkeley Voluntary Registry Offsets Database v2026-08": "Verra dan Gold Standard, Berkeley Voluntary Registry Offsets Database v2026-08",
  "each dot: 1 in 100 tonnes, all counted as real": "setiap titik: 1 dari 100 ton, semuanya dihitung nyata",
  "tonnes come from kinds of project that research has measured": "ton berasal dari jenis proyek yang sudah diukur riset",
  "A kind counts only when Berkeley, CarbonPlan and the methodology code agree": "Sebuah jenis dihitung hanya bila Berkeley, CarbonPlan, dan kode metodologi sepakat",
  "measured by research": "diukur riset", "no published estimate": "belum ada estimasi terbit",
  "Probst et al. 2024, Nature Communications, applied per kind of project": "Probst et al. 2024, Nature Communications, diterapkan per jenis proyek",
  "likely a real cut": "kemungkinan pengurangan nyata", "counted, not real": "dihitung, tidak nyata",
  "likely real, every year since 2020": "kemungkinan nyata, setiap tahun sejak 2020",
  "Measured tonnes by year of retirement; 2026 up to August": "Ton terukur per tahun retirement; 2026 sampai Agustus",
  "tonnes since 2020 name no one you could hold to the claim": "ton sejak 2020 tidak menyebut siapa pun yang bisa dimintai tanggung jawab",
  "Beneficiary field of every retirement, reviewed by hand for the largest accounts": "Kolom penerima manfaat setiap retirement, ditinjau satu per satu untuk akun terbesar",
  "a named claimant": "pengklaim bernama", "no one named": "tidak ada nama",
  "big buyers that research covers well enough to grade reach a B": "pembeli besar yang cukup tercakup riset untuk dinilai mencapai B",
  "Netra grades: A at least 60% likely real, B 40 to 60%, C 20 to 40%, D 10 to 20%, E under 10%":
    "Nilai Netra: A minimal 60% kemungkinan nyata, B 40 sampai 60%, C 20 sampai 40%, D 10 sampai 20%, E di bawah 10%",
  "checks on a public blockchain": "pemeriksaan di blockchain publik",
  "ClaimRegistry on the Ethereum Sepolia test network": "ClaimRegistry di jaringan uji Ethereum Sepolia",
  "a published check": "pemeriksaan yang terbit", "flagged: serials claimed twice": "ditandai: serial diklaim dua kali",
  "Offline": "Luring", "the test network did not answer; the records stay public on the block explorer": "jaringan uji tidak menjawab; catatannya tetap publik di block explorer",
  "Likely-real share by year": "Porsi kemungkinan nyata per tahun",
});
ID_RULES.unshift(
  [/^(\d+) of (\d+)$/, "$1 dari $2"],
  [/^(\d+) checks$/, "$1 pemeriksaan"],
  [/^(\S+%) to (\S+%)$/, "$1 sampai $2"],
  [/^measured tonnes likely cut real emissions \(range (\S+) to (\S+)\)$/, "ton terukur kemungkinan benar-benar mengurangi emisi (rentang $1 sampai $2)"],
  [/^on a public blockchain; (\d+) flagged as double claims$/, "di blockchain publik; $1 ditandai sebagai klaim ganda"],
);

// T4: content fixes and new chapters
Object.assign(ID_EXACT, {
  "every year since 2024.": "setiap tahun sejak 2024.",
  "It works: in a test on Sepolia, a demo claim that reused five of Shell's serial ranges was flagged about ten seconds after Netra's watcher read it.":
    "Ini berhasil: dalam uji di Sepolia, klaim demo yang memakai ulang lima rentang serial Shell ditandai sekitar sepuluh detik setelah watcher Netra membacanya.",
  "What they report, what others see": "Apa yang mereka laporkan, apa yang pihak lain lihat",
  "Netra reads each company's own Scope 1 figure from its report and puts it next to Climate TRACE's independent estimate.":
    "Netra membaca angka Scope 1 milik tiap perusahaan dari laporannya dan menaruhnya di samping estimasi independen Climate TRACE.",
  "reviewed groups have both.": "grup yang ditinjau punya keduanya.",
  "For": "Untuk",
  "of them, Shell, Chevron, E.ON and Eni, the independent estimate is": "di antaranya, Shell, Chevron, E.ON dan Eni, estimasi independennya",
  "3 to 6 times": "3 sampai 6 kali",
  "higher. The two count different assets, so this is a question to ask, not a verdict.":
    "lebih tinggi. Keduanya menghitung aset yang berbeda, jadi ini pertanyaan yang perlu ditanyakan, bukan vonis.",
  "reviewed groups whose independent estimate is at least twice their own Scope 1 report":
    "grup yang ditinjau dengan estimasi independen setidaknya dua kali laporan Scope 1 mereka sendiri",
  "Company reports, read by hand; Climate TRACE v5.7.0 ownership data. Different boundaries, never merged":
    "Laporan perusahaan, dibaca manual; data kepemilikan Climate TRACE v5.7.0. Batasan berbeda; tidak pernah digabung",
  "own report, Scope 1": "laporan sendiri, Scope 1",
  "independent estimate (Climate TRACE)": "estimasi independen (Climate TRACE)",
  "Reported Scope 1 next to the independent estimate": "Scope 1 yang dilaporkan di samping estimasi independen",
  "Why it matters now": "Mengapa ini penting sekarang",
  "Since": "Sejak",
  "27 September 2026": "27 September 2026",
  ", EU Directive 2024/825 bans calling a product, service or event sold in the EU climate neutral because of offsets, whatever the credit quality.":
    ", Directive (EU) 2024/825 melarang menyebut produk, layanan atau acara yang dijual di EU netral iklim karena offset, apa pun kualitas kreditnya.",
  "Claims like that can now be checked. Netra flags them in every result and in the live registry check.":
    "Klaim seperti itu kini bisa diperiksa. Netra menandainya di setiap hasil dan di pemeriksaan registry langsung.",
  "27 Sep 2026": "27 Sep 2026",
  "EU ban on offset-based climate-neutral claims for products": "Larangan EU atas klaim netral iklim berbasis offset untuk produk",
  "Directive (EU) 2024/825": "Directive (EU) 2024/825",
});
ID_RULES.push([/^(?:doi:)?10\.\d{4,9}\/\S+$/, "$&"]); // DOI strings are identifiers

// T6: shortcut cards beside the search
Object.assign(ID_EXACT, {
  "Start with one of these": "Mulai dari salah satu ini", "Or try an example claim": "Atau coba contoh klaim",
  "The biggest named buyer": "Pembeli bernama terbesar", "An airline's offsets": "Offset sebuah maskapai",
  "A streaming company": "Perusahaan streaming", "A car maker": "Produsen mobil",
  "Own report vs independent estimate": "Laporan sendiri vs estimasi independen", "No one named as the claimant": "Tak ada nama pemegang klaim",
});
ID_RULES.unshift([/^(\d+(?:\.\d+)?%) likely real$/, (m, p) => `${p.replace(".", ",")} kemungkinan nyata`]); // "23% likely real" on a card

// T7: glossary layout
Object.assign(ID_EXACT, { "Start here": "Mulai dari sini", "Sections": "Bagian" });

// T8: glossary tooltips
Object.assign(ID_EXACT, {
  "A carbon credit": "Satu kredit karbon",
  "is supposed to be one tonne of CO₂ kept out of the air. When a company uses one for a climate claim, the credit is":
    "seharusnya berarti satu ton CO₂ yang tidak sampai ke udara. Saat perusahaan memakainya untuk klaim iklim, kredit itu",
  "tonnes, it names no one you could hold to the claim: it is blank, says \"":
    "ton, kolom itu tidak menyebut siapa pun yang bisa dimintai tanggung jawab atas klaimnya: kosong, berisi \"",
  "Not Disclosed": "Not Disclosed",
  "\", or points to a reseller, a crypto wallet or a code.": "\", atau menunjuk ke reseller, dompet kripto, atau sebuah kode.",
  "of them well enough for a": "di antaranya cukup baik untuk diberi",
  "grade from A to E": "nilai A sampai E",
  ".": ".",
  "Netra reads each company's own": "Netra membaca angka",
  "Scope 1": "Scope 1",
  "figure from its report and puts it next to Climate TRACE's independent estimate.":
    "milik tiap perusahaan dari laporannya dan menaruhnya di samping estimasi independen Climate TRACE.",
  "Every published check is written to a": "Setiap pemeriksaan yang terbit ditulis ke",
  "public blockchain": "blockchain publik",
  ", with a fingerprint of the report and of the serial numbers behind it. No one, not even Netra, can change it.":
    ", bersama sidik jari laporan dan nomor serial di baliknya. Tidak ada yang bisa mengubahnya, termasuk Netra.",
  ",": ",",
  "EU Directive 2024/825": "Directive (EU) 2024/825",
  "bans calling a product, service or event sold in the EU climate neutral because of offsets, whatever the credit quality.":
    "melarang menyebut produk, layanan atau acara yang dijual di EU netral iklim karena offset, apa pun kualitas kreditnya.",
  "Netra reads the newest retirements from Verra's public registry every ten minutes and applies the same rules as everywhere else on this site: research share likely real for the project type,":
    "Netra membaca retirement terbaru dari registry publik Verra setiap sepuluh menit dan menerapkan aturan yang sama dengan bagian lain situs ini: porsi kemungkinan nyata menurut riset untuk jenis proyeknya,",
  "ICVCM label": "label ICVCM",
  ", and who the benefit is claimed for.": ", dan untuk siapa manfaatnya diklaim.",
  "Each published check is anchored in the": "Setiap pemeriksaan yang terbit dijangkarkan di",
  "smart contract": "smart contract",
  "on the": "di",
  "Ethereum Sepolia test network": "jaringan uji Ethereum Sepolia",
  ". Anyone can recompute the report from the open data and confirm it matches. Each claim commits to the registry serial ranges behind it; if one range shows up in two claims, anyone can prove it on-chain and the later claim is flagged for good.":
    ". Siapa pun bisa menghitung ulang laporan dari data terbuka dan memastikan cocok. Setiap klaim terikat pada rentang serial registry di baliknya; jika satu rentang muncul di dua klaim, siapa pun bisa membuktikannya on-chain dan klaim yang belakangan ditandai selamanya.",
  "In the glossary →": "Di glosarium →",
});

// T9: compare tray
Object.assign(ID_EXACT, { "Compare →": "Bandingkan →", "Add to the comparison": "Tambahkan ke perbandingan" });
ID_RULES.push([/^Remove (.+)$/, "Hapus $1"]);

function tr(s) {
  const key = s.replace(/\s+/g, " ").trim();
  if (!key) return s;
  if (ID_EXACT[key]) return ID_EXACT[key];
  for (const [re, rep] of ID_RULES) if (re.test(key)) return key.replace(re, rep);
  return null;
}

(function () {
  const ATTRS = ["placeholder", "aria-label", "title", "data-ex", "data-l"];
  const orig = new WeakMap(); // text node -> English original
  let lang = "en";
  try { lang = localStorage.getItem("netra-lang") === "id" ? "id" : "en"; } catch (e) { /* storage blocked */ }

  function textNode(n) {
    const p = n.parentElement;
    if (!p || p.closest("script, style, code, .mono, [data-raw], #suggest, #examples .pc-name, .res-id, td > a, #regList td:nth-child(3), .quote")) return;
    if (!orig.has(n)) orig.set(n, n.nodeValue);
    const en = orig.get(n);
    if (lang === "en") { if (n.nodeValue !== en) n.nodeValue = en; return; }
    const t = tr(en);
    if (t === null) return;
    const lead = en.match(/^\s*/)[0], trail = en.match(/\s*$/)[0];
    const out = lead + t + trail;
    if (n.nodeValue !== out) n.nodeValue = out;
  }
  function element(el) {
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const k = `data-en-${a}`;
      if (!el.hasAttribute(k) || (el.getAttribute(a) !== el.getAttribute(k) && el.getAttribute(a) !== tr(el.getAttribute(k)))) el.setAttribute(k, el.getAttribute(a));
      const en = el.getAttribute(k), t = lang === "id" ? tr(en) : null;
      const want = t === null ? en : t;
      if (el.getAttribute(a) !== want) el.setAttribute(a, want);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return textNode(root);
    if (root.nodeType !== 1) return;
    element(root);
    root.querySelectorAll("*").forEach(element);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) textNode(n);
  }
  let busy = false;
  const mo = new MutationObserver((list) => {
    if (busy) return;
    busy = true;
    for (const m of list) {
      if (m.type === "characterData") { orig.delete(m.target); textNode(m.target); }
      else if (m.type === "attributes") element(m.target);
      else m.addedNodes.forEach(walk);
    }
    mo.takeRecords();
    busy = false;
  });

  const btn = document.querySelector(".lang");
  const TITLE = document.title; // each page keeps its own title, translated when a key exists
  function apply() {
    document.documentElement.lang = lang;
    document.title = lang === "id" ? (tr(TITLE) || TITLE) : TITLE;
    busy = true; walk(document.body); mo.takeRecords(); busy = false;
    if (btn) { btn.textContent = lang === "id" ? "EN" : "ID"; btn.setAttribute("aria-label", lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"); btn.setAttribute("lang", lang === "id" ? "en" : "id"); }
  }
  if (btn) btn.addEventListener("click", () => {
    lang = lang === "id" ? "en" : "id";
    try { localStorage.setItem("netra-lang", lang); } catch (e) { /* storage blocked */ }
    apply();
  });
  mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  apply();
})();
