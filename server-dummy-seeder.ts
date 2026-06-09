import { doc, setDoc } from "firebase/firestore";

const DUMMY_PRESETS: Record<string, { titles: string[]; images: string[]; summaries: string[] }> = {
  "Politik": {
    titles: [
      "Peta Koalisi Politik Menatap Transisi Pemerintahan Baru: Stabilitas dan Dinamika Reformasi",
      "Reformasi Digital Sistem Birokrasi Nasional: Menuju Government 4.0 yang Transparan",
      "RUU Perlindungan Hak Konsumen Digital Resmi Disahkan: Perlindungan Kuat di Era Transaksi Modern",
      "Mendalami Visi Ketahanan Pangan Nasional: Antara Subsidi Pupuk dan Kedaulatan Agraria",
      "Dinamika Pemilihan Kepala Daerah Serentak: Kesiapan Penyelenggara dan Partisipasi Pemilih Pemuda",
      "Meningkatkan Diplomasi Luar Negeri Indonesia di Kancah Global: Poros Perdamaian Dunia",
      "Efektivitas Peningkatan Kesejahteraan ASN Melalui Sistem Penilaian Kinerja Berbasis Digital",
      "Menyoal Kebijakan Transisi Energi Bersih: Tarik Menarik Antara Target Emisi dan Realitas Industri",
      "Urgensi Regulasi Tata Ruang Perkotaan Responsif Bencana: Menatap Tantangan Perubahan Iklim",
      "Membangun Budaya Demokrasi Sehat di Ruang Siber: Penangkal Misinformasi Jelang Agenda Nasional"
    ],
    images: [
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505664194779-8bebcb95ce84?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1425421598808-4a22ce59cc97?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=800&fit=crop&q=80"
    ],
    summaries: [
      "Analisis mendalam mengenai peta koalisi partai politik menjelang transisi kepemimpinan nasional demi menjamin keberlanjutan stabilitas makro.",
      "Langkah strategis pemerintah mempercepat perizinan satu pintu digital terintegrasi guna mewujudkan tata kelola birokrasi bebas pungutan liar.",
      "Dewan Perwakilan Rakyat mengetuk palu pengesahan regulasi perlindungan konsumen digital guna meminimalisir tindak kejahatan transaksi online.",
      "Kajian komprehensif mengenai strategi pemenuhan bahan pangan pokok mandiri melalui modernisasi alat pertanian serta optimalisasi alokasi lahan.",
      "Tinjauan kesiapan panitia penyelenggara pemilu daerah dalam menggaet generasi z dan milenial agar tidak bersikap apatis terhadap pemungutan suara.",
      "Peran diplomatik Indonesia sebagai inisiator penengah perdamaian dalam penyelesaian ketegangan politik dan sengketa dagang lintas batas negara.",
      "Uji coba aplikasi sistem penilaian kinerja pegawai negeri sipil berbasis kecerdasan buatan demi meningkatkan produktivitas pelayanan publik.",
      "Dilema implementasi program konversi pembangkit listrik batu bara ke sumber energi ramah lingkungan yang membutuhkan pendanaan triliunan rupiah.",
      "Rekomendasi ahli tata kota dalam merancang regulasi wilayah ramah lingkungan yang mampu memitigasi dampak banjir bandang akibat cuaca ekstrem.",
      "Kolaborasi multi-pihak antara platform media sosial, lembaga jurnalisme, and pemerintah dalam menekan penyebaran berita bohong berbau rasisme."
    ]
  },
  "Ekonomi": {
    titles: [
      "Menjaga Stabilitas Rupiah di Tengah Tekanan Geopolitik Global: Strategi Moneter Bank Sentral",
      "Hilirisasi Komoditas Nikel dan Sektor Energi Terbarukan: Masa Depan Kedaulatan Industri RI",
      "Akselerasi Pembiayaan Hijau: Geliat Perbankan Nasional Mendukung Proyek Berkelanjutan",
      "Peluang dan Tantangan Kebijakan Pajak Karbon Nasional: Optimalisasi Penerimaan dan Penurunan Emisi",
      "Geliat Rebound Industri Manufaktur Pasca Penyesuaian Tarif Logistik Global: Harapan Baru Ekspor",
      "Inovasi UMKM Go-Digital: Mendorong Perekonomian Kerakyatan Menembus Pasar Ekspor Lintas Negara",
      "Masa Depan Ekonomi Sirkular di Indonesia: Pengolahan Limbah Industri Sebagai Mesin Pertumbuhan",
      "Subsidi Tepat Sasaran: Solusi Anggaran Berkeadilan bagi Masyarakat Golongan Bawah",
      "Pembangunan Infrastruktur Konektivitas Maritim: Mengikis Ketimpangan Harga di Wilayah Terdepan",
      "Membaca Arah Investasi Asing Langsung di Sektor Teknologi Tinggi: Magnet Baru Asia Tenggara"
    ],
    images: [
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1444653389962-8149286c578a?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&fit=crop&q=80"
    ],
    summaries: [
      "Langkah-langkah taktis Bank Indonesia dalam mengintervensi pasar valuta asing guna meredam volatilitas nilai tukar rupiah domestik.",
      "Dampak luas kebijakan pelarangan ekspor bijih mentah tambang nikel terhadap pembentukan rantai pasok ekosistem baterai kendaraan listrik.",
      "Komitmen sektor keuangan perbankan pelat merah mengucurkan kredit lunak khusus bagi kontraktor pembangunan proyek ramah lingkungan.",
      "Anatribusi penerapan tarif pungutan emisi karbon bagi korporasi raksasa demi mempercepat tercapainya target target Net Zero Emission.",
      "Lonjakan pesanan produk ekspor tekstil dan furnitur nasional seiring turunnya tarif sewa peti kemas di pelabuhan laut internasional.",
      "Kisah sukses klaster pengrajin keramik lokal menembus pasar Eropa berkat pendampingan pemasaran digital and pengemasan modern.",
      "Bagaimana model bisnis ekonomi restorasi tanpa limbah mampu menghemat biaya operasional pabrik manufaktur sekaligus melestarikan lingkungan.",
      "Skema restrukturisasi alokasi bantuan sosial energi agar sepenuhnya dinikmati oleh rumah tangga miskin and pelaku usaha mikro saja.",
      "Evaluasi beroperasinya armada kapal tol laut dalam memangkas kesenjangan harga bahan makanan pokok di wilayah terluar Papua.",
      "Daya tarik iklim regulasi perpajakan khusus yang sukses menarik raksasa chip semikonduktor dunia menanam modal jangka panjang."
    ]
  },
  "Teknologi": {
    titles: [
      "Kedaulatan Data Cloud Nasional: Langkah Strategis Mengamankan Infrastruktur Digital Kritis",
      "Kesiapan Industri FinTech Menghadapi Ancaman Keamanan Siber Generasi Terbaru",
      "Integrasi Kecerdasan Buatan (AI) Dalam Sektor Layanan Kesehatan: Akurasi Diagnosis Masa Depan",
      "Penerapan Jaringan 6G Pertama: Lompatan Epik Konektivitas IoT di Kawasan Perkotaan modern",
      "Menuju Era Mobil Listrik Massal: Pembangunan Ekosistem Baterai Solid-State Nasional",
      "Transformasi EdTech Pasca-Pandemi: Merumuskan Kurikulum Adaptif Berbasis Pembelajaran Personal",
      "Tantangan Kemanusiaan di Era Otomatisasi Robotik: Re-Skilling Tenaga Kerja di Sektor Manufaktur",
      "Perkembangan Teknologi Komputasi Kuantum: Peluang Indonesia Memulai Riset Fundamental Komputasi",
      "Mengukur Efektivitas Implementasi Smart City di Berbagai Kota Besar Indonesia: Antara Visi dan Realitas",
      "Teknologi Pertanian Presisi (Smart Farming): Menjamin Ketahanan Pangan Melalui Sensor IoT"
    ],
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&fit=crop&q=80"
    ],
    summaries: [
      "Pentingnya percepatan pembangunan pusat data lokal berstandar tier IV untuk menghindari kebocoran data rahasia instansi negara.",
      "Kolaborasi badan siber sandi negara dengan asosiasi keuangan digital dalam menyusun arsitektur sistem pertahanan siber multi-lapis.",
      "Uji klinis algoritma pintar yang mampu mendeteksi gejala tumor sejak dini dengan akurasi melampaui metode diagnosa manual.",
      "Uji coba teknologi pemancar sinyal 6G berfrekuensi ultra tinggi yang menjanjikan kecepatan transfer data 100 kali lipat dari 5G.",
      "Kemitraan konsorsium badan usaha milik negara dalam mendirikan pabrik perakitan sel baterai jenis solid-state yang jauh lebih aman.",
      "Implementasi platform bimbingan belajar berbasis pemetaan kebiasaan siswa demi menghasilkan materi pembelajaran yang sangat khusus.",
      "Lembaga vokasi menyelenggarakan sertifikasi gratis guna menyelamatkan buruh pabrik yang terancam digantikan lengan robot mekanik.",
      "Investasi universitas negeri dalam menyediakan laboratorium riset dasar algoritma kuantum demi mempersiapkan masa depan komputasi.",
      "Evaluasi kritis sistem pemantauan kemacetan jalur lintas perkotaan and tantangan integrasi sensor kamera pemantau di jalan protokol.",
      "Penerapan teknologi penyiram air otomatis berbasis sensor kelembaban tanah terbukti menghemat penggunaan pupuk and melipatgandakan hasil panen kelapa sawit."
    ]
  },
  "Pariwisata": {
    titles: [
      "Pengembangan Ekowisata Berkelanjutan Labuan Bajo: Menjaga Komodo Melalui Pariwisata Berkualitas",
      "Daya Tarik Geopark Ciletuh Sukabumi: Surga Wisata Geologi Warisan Dunia UNESCO",
      "Menjejaki Keindahan Desa Wisata Mandiri Energi: Destinasi Ramah Lingkungan Berbasis Komunitas",
      "Revitalisasi Wisata Sejarah Kota Tua Jakarta: Menghidupkan Kembali Kejayaan Ruang Publik Kreatif",
      "Sinergi Sport Tourism di Mandalika: Menyatukan Keindahan Balap Motor dan Atraksi Budaya Lombok",
      "Pesona Gastronomi Tradisional Nusantara: Daya Tarik Utama Wisatawan Kuliner Mancanegara",
      "Konservasi Alam dan Pariwisata di Raja Ampat: Strategi Wisata Terbatas untuk Keindahan Abadi",
      "Eksotisme Festival Budaya Bali: Harmoni Nilai Leluhur dan Geliat Ekonomi Kreatif Masyarakat",
      "Mengeksplorasi Keindahan Tersembunyi Bukit Tinggi: Sensasi Wisata Kuliner dan Eksotisme Alam Sumatra",
      "Pengaruh Kemudahan Visa Kunjungan Terhadap Lonjakan Arus Turis Berkualitas ke Indonesia"
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&fit=crop&q=80"
    ],
    summaries: [
      "Penetapan zonasi kawasan konservasi komodo guna menghindari eksploitasi berlebihan akibat gelombang turis kapal pesiar.",
      "Pesona formasi batuan purba di Geopark Ciletuh Sukabumi Jawa Barat yang sukses mendatangkan perhatian besar ilmuwan luar negeri.",
      "Inisiatif desa adat di lereng gunung beralih memanfaatkan sel surya and biogas mandiri guna menarik minat pelancong asing.",
      "Penataan jalur pedestrian and pembukaan gedung cagar budaya peninggalan kolonial Belanda sebagai pusat kreativitas seniman muda.",
      "Dampak positif penyelenggaraan ajang balap motor internasional terhadap okupansi kamar akomodasi penginapan warga sekitar sirkuit.",
      "Promosi bumbu rempah autentik khas indonesia dalam ajang eksibisi makanan internasional demi melipatgandakan kunjungan pelancong mancanegara.",
      "Skema pembatasan kuota penyelaman harian di situs Raja Ampat demi menjaga kelestarian terumbu karang and bentang biodiversitas laut.",
      "Semarak tarian adat bali bersatu dengan tata lampu modern dalam event perayaan seni budaya yang menghidupkan kembali industri lokal.",
      "Pesona alam pemandangan Ngarai Sianok berpadu dengan sensasi menyantap kuliner khas nasi kapau legendaris yang memanjakan lidah.",
      "Analisis perbandingan perubahan jumlah belanja pelancong asing setelah diluncurkannya program golden visa khusus eksekutif papan atas."
    ]
  },
  "Olahraga": {
    titles: [
      "Persiapan Matang Indonesia Menjelang Olimpiade: Target Emas Terus Dipantau Ketat",
      "Gelaran MotoGP Mandalika Kembali Hadir: Magnet Pariwisata dan Kebangkitan Ekonomi Nusa Tenggara",
      "Evaluasi Pembinaan Atlet Usia Dini Cabang Bulu Tangkis: Menjaga Tradisi Emas Dunia",
      "Piala Asia Sepak Bola: Kiprah Garuda Muda Menembus Babak Eliminasi dan Dukungan Fans Fanatik",
      "Industri Sport Tourism Nasional: Potensi Besar Menggabungkan Olahraga Ekstrem dan Pariwisata Alam",
      "Teknologi VAR dalam Liga Sepak Bola Nasional: Upaya Meningkatkan Integritas Keputusan Wasit",
      "Kebangkitan Olahraga Panahan Indonesia: Regenerasi Atlet Berbakat dengan Fasilitas Modern",
      "Pentingnya Manajemen Nutrisi Modern bagi Peningkatan Performa Atlet di Kancah Internasional",
      "Perkembangan Ekosistem E-Sports Indonesia: Dari Turnamen Amatir Menuju Industri Global Miliaran Rupiah",
      "Menyoroti Pentingnya Fasilitas Olahraga Ramah Disabilitas di Seluruh Fasilitas Publik Tanah Air"
    ],
    images: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1471295268307-f10d8463307?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1526676001074-6feada2f6cf9?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&fit=crop&q=80"
    ],
    summaries: [
      "Laporan khusus pemusatan latihan nasional para atlet unggulan cabang angkat besi and bulu tangkis di fasilitas berstandar dunia.",
      "Antusiasme ribuan penggemar balap motor sirkuit mandalika lombok yang sukses memberikan devisa miliaran rupiah bagi pelaku akomodasi lokal.",
      "Strategi klub pembina legenda bulutangkis menyaring bakat terpendam di pelosok desa melalui turnamen beasiswa terstruktur.",
      "Perjuangan gigih dan strategi taktis tim nasional sepak bola dalam menaklukkan tim-tim raksasa teluk dalam kejuaraan asia.",
      "Maraknya kompetisi lari alam bebas lintas perbukitan yang berhasil merangkai promosi keindahan geografi alam lokal dengan olahraga fisik.",
      "Uji kelaikan perangkat asisten video referee wasit sepak bola domestik demi mencegah kecurangan and kontroversi keputusan lapangan.",
      "Prestasi membanggakan tim regu panahan nasional yang sukses memborong medali di turnamen akbar tingkat regional asia tenggara.",
      "Bagaimana asupan pola makan and kalori khusus berbasis sains membantu atlet mempercepat pemulihan massa otot yang aus pascalatihan berat.",
      "Transformasi komunitas gamer komputer menjadi atlet berdedikasi tinggi dengan dukungan gaji resmi korporat and klub profesional.",
      "Seruan para atlet paralimpiade nasional agar pemerintah merenovasi stadion olahraga daerah agar ramah akses bagi penyandang tuna daksa."
    ]
  },
  "Internasional": {
    titles: [
      "KTT G20 Menyoroti Krisis Iklim dan Solusi Ketahanan Energi Global Berkelanjutan",
      "Kerja Sama Multilateral ASEAN: Menjaga Stabilitas Keamanan Laut dan Pertumbuhan Kawasan",
      "Arah Baru Hubungan Diplomatik Indonesia-Uni Eropa: Negosiasi Perjanjian Perdagangan Bebas",
      "Tantangan Krisis Pangan Global: Langkah Strategis Kerja Sama Impor-Ekspor Komoditas Utama PBB",
      "Menakar Dampak Fluktuasi Harga Minyak Dunia Terhadap APBN Negara-Negara Berkembang",
      "Inisiatif Green Belt Dunia: Kerja Sama Infrastruktur Ramah Lingkungan Lintas Benua Asia-Afrika",
      "Peran Aktif Pasukan Perdamaian Indonesia di Bawah Bendera PBB: Apresiasi Internasional Terus Mengalir",
      "Membaca Perkembangan Geopolitik Timur Tengah: Pengaruhnya Terhadap Rantai Pasokan Logistik Global",
      "Kerja Sama Teknologi Antariksa Regional: Satelit Pemantau Cuaca dan Mitigasi Bencana ASEAN",
      "Upaya Diplomasi Kemanusiaan Lintas Batas: Pengiriman Bantuan Medis bagi Korban Konflik"
    ],
    images: [
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569424693801-a73ac2a8b7ef?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&fit=crop&q=80"
    ],
    summaries: [
      "Klaim kesepakatan para pemimpin negara dunia dalam mempercepat pendanaan transisi sistem energi hijau bagi negara berkembang.",
      "Hasil deklarasi menteri keamanan pertahanan asia tenggara dalam menjaga perbatasan laut internasional bebas sengketa.",
      "Ulasan progres negosiasi tarif impor komoditas kelapa sawit domestik yang sempat mengalami hambatan regulasi uni eropa.",
      "Program ketahanan pangan terpadu PBB dalam mendistribusikan cadangan biji gandum and jagung bagi negara rawan kekeringan di Afrika.",
      "Kekhawatiran pakar ekonomi mengenai pembengkakan nilai subsidi BBM nasional seiring meningkatnya ketegangan kartel minyak bumi.",
      "Peluang investasi pembangunan infrastruktur transportasi berbasis kereta listrik bertenaga surya yang menghubungkan pusat logistik lintas negara.",
      "Dedikasi prajurit garuda dalam mengelola kamp pengungsian and fasilitas sekolah darurat di wilayah bergejolak afrika tengah.",
      "Analisis ancaman terhambatnya pelayaran kapal kontainer pembawa komoditas strategis akibat konflik jalur maritim navigasi penting.",
      "Konsorsium teknologi meluncurkan proyek konstelasi satelit mikro cuaca guna mendeteksi ancaman bencana tsunami secara dini di kepulauan.",
      "Langkah nyata palang merah internasional and pemerintah mengirimkan obat-obatan esensial and tim bedah darurat ke daerah rawan kemanusiaan."
    ]
  },
  "Hiburan": {
    titles: [
      "Kebangkitan Sinema Indonesia di Festival Film Internasional: Gelombang Baru Karya Kreatif",
      "Konser Akbar Orkestra Filharmoni Nasional: Merayakan Keindahan Kolaborasi Klasik-Tradisional",
      "Eksistensi Musik Indie Indonesia di Era Layanan Streaming Digital: Berdiri di Atas Kaki Sendiri",
      "Industri Kreatif Pengembang Gim Lokal: Menembus Pasar Global Melalui Karya Bernuansa Budaya",
      "Tren Dokumenter Sejarah Populer: Menelusuri Jejak Kejayaan Nusantara Melalui Layar Kaca",
      "Festival Musik Lintas Generasi: Ruang Ekspresi Keberagaman Genre dan Daya Tarik Anak Muda",
      "Perkembangan Seni Pertunjukan Teater Kontemporer: Sinergi Seni Peran dan Teknologi Visual Panggung",
      "Potensi Kekayaan Kekayaan Intelektual (IP) Animasi Lokal: Bersiap Bersaing dengan Raksasa Global",
      "Eksplorasi Tren Desain Busana Berkelanjutan (Sustainable Fashion) di Kalangan Desainer Muda Indonesia",
      "Merekam Keindahan Arsitektur Gedung Kesenian Bersejarah Sebagai Pusat Ekosistem Kreatif Kota"
    ],
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513829096999-4978602297f7?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1612282130134-49784d98ac61?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&fit=crop&q=80"
    ],
    summaries: [
      "Kesuksesan luar biasa sutradara wanita nasional membawa pulang penghargaan tertinggi dalam ajang kompetisi gambar bergengsi Eropa.",
      "Kemegahan musik gesek biola and tiup bertemu harmonis dengan instrumen kuno gamelan and angklung di gedung konser utama.",
      "Bagaimana musisi lokal merintis jalur komersial mandiri tanpa bantuan label korporasi raksasa di tengah ketatnya algoritma pemutar lagu.",
      "Studio pengembang gim pc asal bandung sukses meraup untung miliaran rupiah berkat cerita fantasi bumbu dongeng kuno pewayangan.",
      "Fenomena populernya tayangan dokumenter berseri yang meneliti misteri and sejarah kebesaran dinasti kerajaan masa silam di nusantara.",
      "Semarak panggung konser luar ruangan berkumpulnya ratusan ribu penonton bernostalgia menyanyikan lagu-lagu legendaris tanah air.",
      "Kolaborasi dramatis aktor kawakan dengan sistem visual projection mapping 3D yang menghasilkan sensasi panggung imersif luar biasa.",
      "Peluncuran cuplikan serial animasi anak buatan kreator lokal yang langsung mendapat kontrak hak tayang di jaringan global.",
      "Gencarnya kampanye berpakaian ramah lingkungan menggunakan serat tenun serat nanas pewarna alami di kalangan perancang busana muda.",
      "Upaya restorasi and perawatan gedung pertunjukan seni peninggalan zaman kolonial sebagai pusat inkubasi talenta kreatif anak muda."
    ]
  }
};

/**
 * Generates an Indonesia news article content exceeding 500 words
 * @param category Category of the article
 * @param title Title of the article
 * @param index Number context for variation
 */
function createIndonesianArticleBody(category: string, title: string, index: number): string {
  const intro = `Dengan mengemukanya isu mengenai "${title}", sektor ${category} di tanah air kini kembali menjadi sorotan tajam bagi banyak kalangan. Perkembangan ini tidak terjadi di ruang hampa melainkan dipicu oleh tuntutan adaptasi, percepatan fungsional, and dinamika makro di tingkat akar rumput yang sedang mendesak dicarikan jalan tengahnya. Forum-forum diskusi nasional, pengamat profesional, and para pelaku usaha terus menggarisbawahi urgensi pembenahan regulasi serta integrasi operasional yang menyeluruh agar target jangka panjang dapat tercapai secara berkelanjutan. Di tengah gelombang perubahan global yang terus berjalan pesat, inisiatif ini dirasa hadir pada waktu yang sangat krusial guna memperkuat pilar pembangunan nasional sektor ${category} agar mampu bersaing tangguh dengan negara-negara tetangga di kawasan regional maupun di tingkat mancanegara secara memuaskan.`;

  const background = `Jika ditilik lebih jauh dari kacamata historis, perkembangan ${category} di Indonesia memang selalu dihadapkan pada tantangan klasik berupa keterbatasan sistem infrastruktur fisik serta kendala birokrasi yang kompleks di tingkat lapangan. Selama bertahun-tahun, program penyelarasan terhambat oleh tidak sinkronnya kebijakan antara instansi pusat and pemerintah daerah di berbagai provinsi. Hal ini sering kali memicu tumpang tindih kewenangan yang membingungkan para investor and merugikan masyarakat luas sebagai penerima manfaat utama. Namun, dengan dicanangkannya langkah restrukturisasi menyeluruh and integrasi teknologi informasi akhir-akhir ini, benang kusut yang selama ini mengikat mulai terurai dengan baik. Berbagai studi independen memvalidasi bahwa modernisasi proses and pemangkasan prosedur administrasi berkontribusi langsung pada lonjakan indeks efisiensi nasional di sektor ini secara berlipat ganda.`;

  const interview = `Menyikapi urgensi ini, Dr. Ir. Haryo Pranoto, M.Sc., selaku pengamat senior and deputi riset strategis nasional bidang ${category}, memberikan pandangannya dalam sesi dialog eksklusif khusus dengan Fakta Faktual. "Kita harus berani meninggalkan paradigma lama yang lamban and menggantinya dengan model kerja kolaboratif, progresif, and berbasis data akurat. Keberhasilan pelaksanaan agenda '${title}' sangat bergantung pada keterpaduan komitmen dari semua unsur pemangku kepentingan, mulai dari jajaran kementerian teknis, pelaku industri modern, hingga partisipasi langsung warga masyarakat di lapangan," ujarnya tegas. Beliau juga menambahkan bahwa transparansi anggaran, penyusunan peta jalan (roadmap) yang logis, and pembentukan tim pengawas independen yang berintegritas mutlak diperlukan agar setiap alokasi dana and tenaga terwujud nyata and bersih dari segala potensi penyimpangan birokrasi maupun administrasi.`;

  const analysis = `Dari kacamata keberpihakan and analisis ekonomi dampak, penguatan fondasi ${category} ini diproyeksikan akan membawa multiplier effect (efek berganda) yang sangat positif bagi kesejahteraan domestik. Akselerasi sektor ini diyakini mampu menyerap puluhan ribu tenaga kerja terdidik baru, menghidupkan ekosistem UMKM pendukung di sekitar pusat proyek, serta berkontribusi langsung pada peningkatan pendapatan asli daerah (PAD). Meski demikian, pengamat mengingatkan agar mitigasi risiko terhadap dampak sosial and lingkungan tetap menjadi prioritas utama yang tidak boleh diabaikan demi kenyamanan bersama. Harus ada jaring pengaman sosial yang dirancang kokoh and dialog yang intim serta berkala antara pihak manajemen dengan representasi masyarakat adat setempat guna memastikan transisi besar ini berjalan harmonis tanpa melahirkan ketimpangan baru bagi warga marjinal.`;

  const technologyRole = `Peran teknologi and digitalisasi juga menjadi faktor pembeda yang sangat menentukan dalam akselerasi sektor ${category} di era modern ini. Berbagai platform digital, otomatisasi sistem berbasis kecerdasan buatan, serta sensor pemantauan real-time kini mulai diaplikasikan untuk menggantikan sistem pencatatan manual yang rawan kesalahan. Penggunaan analitik big data memudahkan para perumus kebijakan dalam memprediksi tren masa depan, mengantisipasi potensi krisis logistik, and membuat keputusan taktis dalam hitungan detik. Meskipun investasi awal untuk pengadaan teknologi ini tergolong tidak sedikit, efisiensi jangka panjang serta pencegahan kebocoran anggaran yang berhasil ditekan membuktikan bahwa langkah digitalisasi ini merupakan keputusan investasi yang sangat rasional, menguntungkan, and visioner bagi kemajuan peradaban masa depan Indonesia yang gemilang.`;

  const futureOutlook = `Sebagai kesimpulan and pandangan ke depan, masa depan keberhasilan sektor ${category} pasca-penerapan konsep "${title}" akan ditentukan oleh ketekunan, integritas kolektif, and kesiapan mentalitas seluruh komponen bangsa untuk terus berinovasi tiada henti. Rekomendasi konkret yang digagas oleh forum ilmuwan menyarankan agar dilakukan audit berkala terhadap jalannya program, pemenuhan hak-hak pekerja secara adil, and pelibatan riset universitas lokal dalam pengembangan inovasi bernilai tambah. Kita harus memandang tantangan ini bukan sebagai beban operasional melainkan sebagai peluang emas untuk meletakkan fondasi kemakmuran jangka panjang bagi generasi penerus. Dengan diiringi komitmen tulus, kerja keras yang disiplin, and keterbukaan terhadap kritik yang membangun, optimisme publik akan terwujudnya kejayaan anyar di bidang ini akan segera menjadi kenyataan indah yang dirasakan merata oleh seluruh rakyat Indonesia.`;

  // Concatenate paragraphs to yield around 635 words total
  return `${intro}\n\n${background}\n\n${interview}\n\n${analysis}\n\n${technologyRole}\n\n${futureOutlook}`;
}

export async function seedSeventyDummyArticles(
  db: any, 
  articlesArray: any[], 
  generateIntegrityHash: (title: string, content: string) => string
): Promise<{ count: number; messages: string[] }> {
  const messages: string[] = [];
  let seedCount = 0;
  
  // Clean start - determine pre-existing ids inside memory
  const existingTitles = new Set(articlesArray.map(a => a.title.toLowerCase()));

  const categories = ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan"];
  const authorNames = ["Rendra Kusuma", "Siti Rahmawati", "Budi Santoso", "Dewi Lestari", "Irfan Wijaya"];
  const authorIds = ["u-jour", "u-editor", "e2", "e3", "e1"];
  const authorRoles = ["journalist", "editor", "Executive Editor", "Senior Editor Politik", "Editor-in-Chief"];

  for (const cat of categories) {
    const preset = DUMMY_PRESETS[cat];
    if (!preset) continue;

    for (let i = 0; i < 10; i++) {
      const title = preset.titles[i];
      
      // Check if duplicate title exists to avoid seeding identical dummy entries
      if (existingTitles.has(title.toLowerCase())) {
        continue;
      }

      const imageUrl = preset.images[i] || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&fit=crop&q=80";
      const summary = preset.summaries[i] || `${title.substring(0, 100)}...`;
      const content = createIndonesianArticleBody(cat, title, i);

      const generatedId = `art-dummy-${cat.toLowerCase().substring(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      
      // Author selection cycle
      const authorIdx = i % authorNames.length;
      const authorId = authorIds[authorIdx];
      const authorName = authorNames[authorIdx];
      const authorRole = authorRoles[authorIdx];
      
      const isPremium = (i % 3 === 0); // 30% of articles are premium
      const publishedAt = new Date(Date.now() - (i * 2 * 3600 * 1000) - (categories.indexOf(cat) * 24 * 3600 * 1000)).toISOString();

      // Generating clean keywords
      const seoKeywords = [cat.toLowerCase(), "fakta aktual", title.split(" ")[0].toLowerCase(), title.split(" ")[1].toLowerCase() || "berita"];

      const articleObj = {
        id: generatedId,
        title,
        content,
        summary,
        category: cat,
        authorId,
        authorName,
        authorRole,
        imageUrl,
        isPremium,
        status: "published",
        publishedAt,
        seoTitle: `${title.substring(0, 50)} | Fakta Faktual`,
        seoDescription: summary.substring(0, 150),
        seoKeywords,
        views: Math.floor(Math.random() * 15000) + 1200,
        commentsCount: 0,
        encryptedHash: generateIntegrityHash(title, content)
      };

      // Push to in-memory server state
      articlesArray.push(articleObj);

      // Write to Firebase Firestore
      if (db) {
        try {
          await setDoc(doc(db, "articles", articleObj.id), articleObj);
        } catch (e) {
          console.error(`[Seeder] Gagal menulis dummy article ${generatedId} ke Firestore:`, e);
        }
      }

      seedCount++;
    }
    messages.push(`Berhasil menggenerasi 10 dummy artikel kategori ${cat}`);
  }

  return {
    count: seedCount,
    messages
  };
}
