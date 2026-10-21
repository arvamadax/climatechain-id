"use strict";
// Bahasa Indonesia for the Check page. English stays the source; this layer swaps on-screen text in place
// (static and rendered), remembers the choice per device, and restores the English original when switched back.
// Registry data (names, notes, project names) is never translated. Exact sentences first, then phrase rules.

const ID_EXACT = {
  // header, hero
  "Check": "Periksa", "Hidden buyers": "Pembeli tersembunyi", "About": "Tentang", "Glossary": "Glosarium",
  "876 Mt of carbon credits retired since 2020, checked": "876 Mt kredit karbon yang dipensiunkan sejak 2020, diperiksa",
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
  "The claim reader is not available right now. Pick the company below instead.": "Pembaca klaim sedang tidak tersedia.",
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
  "Roughly": "Sekitar", "of its researched credits are likely real.": "kredit risetnya kemungkinan nyata.",
  "None of its credits are in a project type with a research estimate.": "Tidak satu pun kreditnya berasal dari jenis proyek yang punya estimasi riset.",
  "Offsets do not cut its own emissions:": "Offset tidak mengurangi emisinya sendiri:",
  "EU rule:": "Aturan EU:",
  "since 27 Sep 2026, Directive 2024/825 bans calling a product, service or event climate neutral because of offsets. This claim reads as one.":
    "sejak 27 Sep 2026, Directive 2024/825 melarang menyebut produk, layanan atau acara netral iklim karena offset. Klaim ini terbaca demikian.",
  // result
  "Part of": "Bagian dari",
  "An offset provider or account that retires credits on behalf of its clients. The end claimants are not named here.": "Penyedia offset atau akun yang memensiunkan kredit atas nama kliennya. Pengklaim akhirnya tidak disebut di sini.",
  "A crypto wallet address. These credits were retired to back tokens on a blockchain; who holds the climate claim is not visible in the registry.": "Alamat dompet kripto. Kredit ini dipensiunkan untuk mendukung token di blockchain; siapa pemegang klaim iklimnya tidak terlihat di registry.",
  "No identifiable beneficiary. Nobody can be held to claims based on these credits.": "Tidak ada penerima manfaat yang bisa dikenali. Tidak ada yang bisa dimintai tanggung jawab atas klaim berbasis kredit ini.",
  "A code that could not be matched to any organisation from the registry details. Netra does not guess who it is.": "Kode yang tidak cocok dengan organisasi mana pun di detail registry. Netra tidak menebak siapa itu.",
  "Credits retired to create crypto tokens. Verra stopped allowing retired credits to be tokenized in 2022.": "Kredit yang dipensiunkan untuk membuat token kripto. Verra berhenti mengizinkannya pada 2022.",
  "A public authority.": "Lembaga publik.",
  "Of every 100 tonnes": "Dari setiap 100 ton yang dipensiunkan",
  "Likely real, in researched project types": "Kemungkinan nyata, pada jenis proyek yang diteliti",
  "Outline: claimed": "Garis: yang diklaim",
  "At the 2024 market average of $6.34 per credit, each likely-real tonne costs about": "Dengan harga rata-rata pasar 2024 sebesar $6.34 per kredit, setiap ton yang kemungkinan nyata berharga sekitar",
  "Price:": "Harga:", ", p. 10. What this buyer paid is not public.": ", hlm. 10. Harga yang dibayar pembeli ini tidak publik.",
  "Research estimate": "Estimasi riset", "Likely real": "Kemungkinan nyata", "Likely not real": "Kemungkinan tidak nyata",
  "No published estimate": "Belum ada estimasi terbit", "No estimate": "Tanpa estimasi", "no estimate": "tanpa estimasi",
  "Project types": "Jenis proyek", "ICVCM integrity label": "Label integritas ICVCM",
  "CCP-approved methodology": "Metodologi berlabel CCP", "Rejected by ICVCM": "Ditolak ICVCM", "Not assessed / not listed": "Belum dinilai / tidak terdaftar",
  "Company-reported emissions": "Emisi yang dilaporkan perusahaan", "reported total": "total dilaporkan",
  "Not published, or not readable.": "Tidak diterbitkan, atau tidak terbaca.", "Emissions": "Emisi",
  "This account is not a company, so there is no company report to read.": "Akun ini bukan perusahaan, jadi tidak ada laporan perusahaan untuk dibaca.",
  "This buyer is outside the 167 largest names reviewed by hand, so no emissions report has been matched to it.": "Pembeli ini di luar 167 nama terbesar yang ditinjau manual, jadi belum ada laporan emisi yang dicocokkan.",
  "Independent emissions": "Emisi independen", "Past to present": "Dari masa ke masa",
  "Grey bars: tonnes retired per year. Line: likely-real share of research-covered tonnes.": "Batang abu-abu: ton yang dipensiunkan per tahun. Garis: porsi kemungkinan nyata dari ton yang tercakup riset.",
  "Unusual pattern": "Pola tidak biasa",
  "Flagged by an Isolation Forest model among 540 buyers with at least 100,000 t retired. An unusual pattern is a reason to look closer, not proof of wrongdoing.":
    "Ditandai model Isolation Forest di antara 540 pembeli dengan minimal 100.000 t dipensiunkan. Pola tidak biasa adalah alasan untuk memeriksa lebih dekat, bukan bukti pelanggaran.",
  "How we know": "Dari mana kami tahu", "Retired": "Dipensiunkan", "Who this is": "Siapa ini", "Grade": "Nilai", "Quality label": "Label kualitas",
  "Reviewed by hand against the registry retirement details and linked to": "Ditinjau manual terhadap detail retirement di registry dan ditautkan ke",
  "Reviewed by hand against the registry retirement details.": "Ditinjau manual terhadap detail retirement di registry.",
  "A type counts only when three sources agree: Berkeley's curated type, CarbonPlan OffsetsDB and the registry methodology code. Otherwise: no estimate.":
    "Jenis proyek hanya dihitung bila tiga sumber sepakat: tipe kurasi Berkeley, CarbonPlan OffsetsDB dan kode metodologi registry. Jika tidak: tanpa estimasi.",
  "Each methodology's status in the ICVCM Core Carbon Principles assessment, snapshot 18 Aug 2026.": "Status tiap metodologi dalam penilaian ICVCM Core Carbon Principles, snapshot 18 Agu 2026.",
  "Read by hand from": "Dibaca manual dari",
  "No figure is shown unless it comes from the company's own document.": "Angka hanya ditampilkan bila berasal dari dokumen perusahaan itu sendiri.",
  "Full rules:": "Aturan lengkap:", ". Plain-English terms:": ". Istilah dalam bahasa sederhana:", "glossary": "glosarium",
  "Selling in the EU?": "Berjualan di EU?",
  "Since 27 September 2026, EU Directive 2024/825 bans calling a product climate neutral, reduced or positive because of offsets, whatever the credit quality.":
    "Sejak 27 September 2026, EU Directive 2024/825 melarang menyebut produk netral iklim, rendah emisi atau positif karena offset, apa pun kualitas kreditnya.",
  "Checking on-chain records…": "Memeriksa catatan on-chain…",
  "Not published on-chain yet. Published checks are listed under On-chain proof.": "Belum diterbitkan on-chain. Pemeriksaan yang sudah terbit ada di bagian Bukti on-chain.",
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
  "of those tonnes name no beneficiary at all": "dari ton itu tidak menyebut penerima manfaat sama sekali",
  "come from project types with a research estimate": "berasal dari jenis proyek yang punya estimasi riset",
  "use a methodology with the ICVCM CCP label": "memakai metodologi berlabel ICVCM CCP",
  "* 2026 up to August. The likely-real share has stayed between 18% and 22% every year.": "* 2026 hingga Agustus. Porsi kemungkinan nyata bertahan di 18% sampai 22% setiap tahun.",
  "Avoided deforestation (REDD+)": "Deforestasi yang dicegah (REDD+)", "Cookstoves": "Tungku masak", "Wind power in China": "Tenaga angin di Tiongkok",
  "Improved forest management (US)": "Pengelolaan hutan yang ditingkatkan (AS)", "HFC-23 destruction": "Penghancuran HFC-23",
  "SF6 destruction": "Penghancuran SF6", "Grid-connected renewables (outside China wind)": "Energi terbarukan terhubung jaringan (di luar angin Tiongkok)",
  "Other project types": "Jenis proyek lain",
  // hidden buyers
  "Who is behind the credits? Most of the time, nobody you can name.": "Siapa di balik kredit itu? Seringnya, tidak ada yang bisa disebut namanya.",
  "A carbon credit is \"retired\" when someone uses it for a climate claim. The registry asks who that someone is. For more than half of all tonnes since 2020, the answer is blank, \"Not Disclosed\", a reseller, a crypto wallet, or a code nobody can trace. A claim without a name cannot be checked by anyone.":
    "Kredit karbon \"dipensiunkan\" saat seseorang memakainya untuk klaim iklim. Registry menanyakan siapa orang itu. Untuk lebih dari separuh ton sejak 2020, jawabannya kosong, \"Not Disclosed\", reseller, dompet kripto, atau kode yang tidak bisa dilacak. Klaim tanpa nama tidak bisa diperiksa siapa pun.",
  "Loading…": "Memuat…",
  "Named companies": "Perusahaan bernama", "Other named buyers": "Pembeli bernama lainnya", "Public bodies": "Lembaga publik",
  "Resellers, for clients": "Reseller, untuk klien", "Crypto wallets": "Dompet kripto", "Turned into tokens": "Dijadikan token",
  "Codes nobody can trace": "Kode yang tak bisa dilacak", "No name at all": "Tanpa nama sama sekali", "hidden": "tersembunyi",
  "Every tonne retired since 2020, by who claims it": "Setiap ton yang dipensiunkan sejak 2020, menurut siapa yang mengklaimnya",
  "The biggest accounts that hide who claims": "Akun terbesar yang menyembunyikan siapa pengklaimnya",
  "Account as written in the registry": "Akun seperti tertulis di registry", "What it is": "Apa itu",
  "Why it matters": "Kenapa penting", "Double claiming": "Klaim ganda", "What would fix it": "Apa solusinya",
  "A company can say \"we offset our emissions\". If the registry does not name it, nobody can check which credits back that sentence, or whether the same credits back someone else's.":
    "Perusahaan bisa berkata \"kami mengimbangi emisi kami\". Jika registry tidak menyebut namanya, tak ada yang bisa memeriksa kredit mana yang mendukung kalimat itu, atau apakah kredit yang sama juga mendukung klaim pihak lain.",
  "Resellers and wallets can pass one retirement to many customers. The registry cannot see it. Netra's on-chain registry lets anyone flag a serial range claimed twice.":
    "Reseller dan dompet bisa meneruskan satu retirement ke banyak pelanggan. Registry tidak melihatnya. Registry on-chain Netra memungkinkan siapa pun menandai rentang serial yang diklaim dua kali.",
  "A mandatory, public beneficiary for every retirement, and claims that point to exact serial numbers. Until then, treat unnamed volume as unverifiable.":
    "Penerima manfaat yang wajib dan publik untuk setiap retirement, serta klaim yang menunjuk nomor serial yang tepat. Sampai saat itu, anggap volume tanpa nama tidak bisa diverifikasi.",
  // on-chain proof
  "On-chain proof": "Bukti on-chain", "Every check is on the record. Nobody can edit it later.": "Setiap pemeriksaan tercatat. Tidak ada yang bisa mengubahnya nanti.",
  "Each published check is anchored in the": "Setiap pemeriksaan yang terbit dijangkarkan di smart contract",
  "smart contract on a public test network. Anyone can recompute the report from the open data and confirm it matches. Each claim commits to the registry serial ranges behind it; if one range shows up in two claims, anyone can prove it on-chain and the later claim is flagged for good.":
    "di jaringan uji publik. Siapa pun bisa menghitung ulang laporan dari data terbuka dan memastikan cocok. Setiap klaim terikat pada rentang serial registry di baliknya; jika satu rentang muncul di dua klaim, siapa pun bisa membuktikannya on-chain dan klaim yang belakangan ditandai selamanya.",
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
    "Ditetapkan hanya bila tiga sumber independen sepakat: tipe kurasi Berkeley, CarbonPlan OffsetsDB, dan kode metodologi registry. Setiap ketidaksepakatan berarti tanpa estimasi riset.",
  "Share of credits that achieved real reductions per project type, from Probst et al. 2024 (": "Porsi kredit yang benar-benar menurunkan emisi per jenis proyek, dari Probst et al. 2024 (",
  ", 2,346 projects): cookstoves 10.8%, REDD+ 24.7%, HFC-23 68.3%, wind in China and US improved forest management 0%. Types without a published estimate are shown as \"no estimate\", never filled in.":
    ", 2.346 proyek): tungku masak 10,8%, REDD+ 24,7%, HFC-23 68,3%, angin di Tiongkok dan pengelolaan hutan AS 0%. Jenis tanpa estimasi terbit ditampilkan \"tanpa estimasi\", tidak pernah diisi.",
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

// Sentences with numbers or names inside: [pattern, replacement]. Applied in order to text that has no exact match.
const ago = (s) => s.replace(/(\d+) min ago/g, "$1 menit lalu").replace(/(\d+) h ago/g, "$1 jam lalu").replace(/(\d+) d ago/g, "$1 hari lalu");
const ID_RULES = [
  [/^(\d+ (?:min|h|d) ago)$/, (m, a) => ago(a)],
  [/^Checked (.+) · (\d+) newest retirements, (.+) to (.+)$/, (m, a, n, b, c) => `Diperiksa ${ago(a)} · ${n} retirement terbaru, ${ago(b)} sampai ${ago(c)}`],
  [/^retired in the (\d+) newest retirements\. Research covers$/, "dipensiunkan dalam $1 retirement terbaru. Riset mencakup"],
  [/^is likely real(?: \(([\d.]+%)\))?\.(?: (\d+) name a company Netra has reviewed\.)?$/, (m, p, n) => `kemungkinan nyata${p ? ` (${p})` : ""}.${n ? ` ${n} menyebut perusahaan yang sudah ditinjau Netra.` : ""}`],
  [/^of the newest notes call a product, service or event neutral because of offsets \(banned in the EU since 27 Sep 2026\)\.$/, "catatan terbaru menyebut produk, layanan atau acara netral karena offset (dilarang di EU sejak 27 Sep 2026)."],
  [/^Zombie credit · (\d+)$/, "Kredit zombie · $1"],
  [/^Vintage (\d+): the reduction happened 10 or more years before retirement$/, "Vintage $1: pengurangan emisinya terjadi 10 tahun atau lebih sebelum dipensiunkan"],
  [/^Offset-based neutrality claims for products.*$/, "Klaim netral berbasis offset untuk produk, layanan dan acara dilarang di EU sejak 27 Sep 2026 (Directive 2024/825)"],
  [/^New retirement on Verra: (.+)$/, "Retirement baru di Verra: $1"],
  [/^New on-chain check #(\d+) recorded$/, "Pemeriksaan on-chain baru #$1 tercatat"],
  [/^Source: Verra Registry, public retirements \(registry\.verra\.org\)\..*$/, "Sumber: Verra Registry, retirement publik (registry.verra.org). Kemungkinan nyata: Probst et al. 2024 per jenis proyek, sama seperti di setiap hasil; \"Proyek baru\" berarti proyek belum ada di snapshot Berkeley VROD. Klaim netral berbasis offset: catatan retirement, dibaca AI pembaca klaim dengan kutipan, menyebut produk, layanan atau acara netral (atau zero, positif, terkompensasi) karena offset; klaim seperti itu dilarang di EU sejak 27 Sep 2026 (Directive 2024/825). Kredit zombie: vintage 10 tahun atau lebih sebelum dipensiunkan. Gold Standard tidak termasuk dalam pemeriksaan langsung."],
  [/^Search “(.+)” instead$/, "Cari “$1”"],
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
  [/^of credits were retired since (\d{4}) without naming who the climate benefit belongs to\. Nobody can be held to these claims\.$/, "kredit dipensiunkan sejak $1 tanpa menyebut siapa pemilik manfaat iklimnya. Tidak ada yang bisa dimintai tanggung jawab atas klaim ini."],
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
// Hidden-buyer explanations (KIND in app.js) are matched inside the "N accounts." sentence via tr().
Object.assign(ID_EXACT, {
  "A real company, reviewed by hand and matched to its group (Gucci is counted under Kering).": "Perusahaan nyata, ditinjau manual dan dicocokkan ke grupnya (Gucci dihitung di bawah Kering).",
  "A name is given, but it is one of 44,000+ smaller names Netra has not reviewed one by one.": "Ada nama, tetapi termasuk 44.000+ nama kecil yang belum ditinjau Netra satu per satu.",
  "A government or public authority.": "Pemerintah atau lembaga publik.",
  "An offset seller retires credits on behalf of its customers. Who the customers are is not in the registry.": "Penjual offset memensiunkan kredit atas nama pelanggannya. Siapa pelanggannya tidak ada di registry.",
  "Retired to a blockchain address. Who holds the climate claim cannot be seen.": "Dipensiunkan ke alamat blockchain. Siapa pemegang klaim iklimnya tidak terlihat.",
  "Retired to create crypto tokens. Verra stopped allowing this in 2022.": "Dipensiunkan untuk membuat token kripto. Verra berhenti mengizinkannya pada 2022.",
  "A short code (for example \"DL\") that matches no organisation in the registry details. Netra does not guess.": "Kode pendek (misalnya \"DL\") yang tidak cocok dengan organisasi mana pun di detail registry. Netra tidak menebak.",
  "The beneficiary field is blank or says \"Not Disclosed\". Nobody can be held to this claim.": "Kolom penerima manfaat kosong atau berisi \"Not Disclosed\". Tidak ada yang bisa dimintai tanggung jawab atas klaim ini.",
});

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
    if (!p || p.closest("script, style, code, .mono, [data-raw], #suggest, #examples, .res-id, td > a, #regList td:nth-child(3), .quote")) return;
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
  function apply() {
    document.documentElement.lang = lang;
    document.title = lang === "id" ? "Netra · Lihat nilai sebenarnya dari sebuah klaim karbon" : "Netra · See what a carbon claim is really worth";
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
