/* ==========================================================
   DATA MENU, TESTIMONI, GALERI, FAQ
   layers: lapisan minuman dari BAWAH ke ATAS -> [warna, proporsi]
   type: 'iced' (cup plastik) | 'hot' (paper cup)
   deco: 'foam' | 'boba' | 'drizzle' | 'crumble' (hiasan bawaan)
   badge: 'best' | 'new' | null
   ========================================================== */
window.NGOPS_DATA = {
  categories: [
    { id: 'all', label: 'Semua' },
    { id: 'kopi-susu', label: 'Kopi Susu' },
    { id: 'kopi-hitam', label: 'Kopi Hitam' },
    { id: 'non-kopi', label: 'Non-Kopi' },
    { id: 'signature', label: 'Signature' },
  ],

  menu: [
    {
      id: 'kopi-susu-aren', name: 'Kopi Susu Gula Aren', category: 'kopi-susu', price: 18000,
      desc: 'Espresso blend lokal, susu segar, dan gula aren asli. Favorit sejuta umat.',
      type: 'iced', layers: [['#5a3416', .22], ['#c08a5b', .58], ['#ead3b6', .2]],
      tint: '#f6e3cc', straw: '#ff6b35', badge: 'best', rating: 4.9, sold: 8200,
    },
    {
      id: 'kopi-susu-ngops', name: 'Es Kopi Susu Ngops', category: 'kopi-susu', price: 16000,
      desc: 'Kopi susu klasik racikan rumah. Creamy, ringan, cocok buat segala suasana.',
      type: 'iced', layers: [['#7a4e2d', .5], ['#d9b38c', .5]],
      tint: '#f3e6d6', straw: '#6f4e37', badge: null, rating: 4.8, sold: 6400,
    },
    {
      id: 'caramel-latte', name: 'Caramel Macchiato', category: 'kopi-susu', price: 22000,
      desc: 'Susu vanila, espresso yang dituang di atasnya, dan siraman saus karamel.',
      type: 'iced', layers: [['#f1e2cc', .45], ['#a8714a', .4], ['#f7efe3', .15]], deco: 'drizzle',
      tint: '#fbe7c8', straw: '#e8963c', badge: null, rating: 4.8, sold: 3900,
    },
    {
      id: 'hazelnut-latte', name: 'Hazelnut Latte', category: 'kopi-susu', price: 21000,
      desc: 'Latte lembut dengan sirup hazelnut yang gurih dan wangi.',
      type: 'iced', layers: [['#8a5a3a', .6], ['#d7b08b', .4]],
      tint: '#f2e0cf', straw: '#a47551', badge: null, rating: 4.7, sold: 2100,
    },
    {
      id: 'americano', name: 'Es Americano', category: 'kopi-hitam', price: 15000,
      desc: 'Double shot espresso dan air dingin. Bold, segar, tanpa basa-basi.',
      type: 'iced', layers: [['#1f0f06', .8], ['#3d2112', .2]],
      tint: '#ead9c7', straw: '#2b1a12', badge: null, rating: 4.8, sold: 5200,
    },
    {
      id: 'kopi-tubruk', name: 'Kopi Tubruk Panas', category: 'kopi-hitam', price: 12000,
      desc: 'Robusta Temanggung diseduh ala tubruk. Pahit mantap, hangat sampai hati.',
      type: 'hot', sleeve: '#6f4e37',
      tint: '#efe0cf', badge: null, rating: 4.7, sold: 1800,
    },
    {
      id: 'v60', name: 'Manual Brew V60', category: 'kopi-hitam', price: 25000,
      desc: 'Arabika Gayo single origin, diseduh manual. Notes fruity dan clean.',
      type: 'hot', sleeve: '#2b1a12',
      tint: '#e9dccd', badge: null, rating: 4.9, sold: 950,
    },
    {
      id: 'matcha-latte', name: 'Matcha Latte', category: 'non-kopi', price: 22000,
      desc: 'Matcha premium Jepang di atas susu segar. Earthy, creamy, menenangkan.',
      type: 'iced', layers: [['#f4efe2', .4], ['#7fae4f', .6]],
      tint: '#e3f1d6', straw: '#4f8a2b', badge: null, rating: 4.8, sold: 3100,
    },
    {
      id: 'taro-latte', name: 'Taro Boba Latte', category: 'non-kopi', price: 22000,
      desc: 'Taro creamy manis gurih plus boba brown sugar yang kenyal.',
      type: 'iced', layers: [['#b48fd6', .65], ['#e7d6f5', .35]], deco: 'boba',
      tint: '#efe3fa', straw: '#8b5cf6', badge: 'new', rating: 4.7, sold: 1400,
    },
    {
      id: 'red-velvet', name: 'Red Velvet Latte', category: 'non-kopi', price: 22000,
      desc: 'Rasa kue red velvet dalam segelas susu dingin. Manis, lembut, cantik.',
      type: 'iced', layers: [['#a8324a', .6], ['#f3d2d8', .4]],
      tint: '#fbe1e5', straw: '#e5484d', badge: null, rating: 4.6, sold: 1200,
    },
    {
      id: 'choco-hazel', name: 'Coklat Ngops', category: 'non-kopi', price: 19000,
      desc: 'Dark chocolate tebal dengan susu segar. Pelarian terbaik buat yang anti kafein.',
      type: 'iced', layers: [['#3e2015', .6], ['#7b4a33', .4]], deco: 'foam',
      tint: '#efdcd0', straw: '#7b4a33', badge: null, rating: 4.8, sold: 2600,
    },
    {
      id: 'butterscotch', name: 'Yumk Butterscotch', category: 'signature', price: 24000,
      desc: 'Signature kami: kopi susu, saus butterscotch homemade, dan sea salt cream.',
      type: 'iced', layers: [['#d98a2b', .2], ['#c99a6b', .55], ['#fff3df', .25]], deco: 'drizzle',
      tint: '#fde6c4', straw: '#ff6b35', badge: 'best', rating: 4.9, sold: 4700,
    },
    {
      id: 'kopi-pandan', name: 'Kopi Susu Pandan', category: 'signature', price: 23000,
      desc: 'Perpaduan kopi susu dan sirup pandan wangi. Rasa Nusantara banget!',
      type: 'iced', layers: [['#6aa84f', .25], ['#c9a27c', .55], ['#f0e6d0', .2]],
      tint: '#e7f3dc', straw: '#6aa84f', badge: 'new', rating: 4.8, sold: 1600,
    },
    {
      id: 'regal-crumble', name: 'Kopi Regal Crumble', category: 'signature', price: 25000,
      desc: 'Kopi susu dengan cream biskuit Regal dan taburan crumble renyah.',
      type: 'iced', layers: [['#a87a52', .6], ['#f6ead8', .4]], deco: 'crumble',
      tint: '#f4e4d0', straw: '#a47551', badge: null, rating: 4.8, sold: 2300,
    },
  ],

  heroCups: ['kopi-susu-aren', 'butterscotch', 'matcha-latte', 'taro-latte', 'red-velvet'],

  options: {
    sizes: [
      { id: 'regular', label: 'Regular', note: '350 ml', price: 0 },
      { id: 'large', label: 'Large', note: '500 ml', price: 5000 },
    ],
    sugar: [
      { id: 'normal', label: 'Normal' },
      { id: 'less', label: 'Less Sugar' },
      { id: 'no', label: 'No Sugar' },
    ],
    ice: [
      { id: 'normal', label: 'Normal Ice' },
      { id: 'less', label: 'Less Ice' },
      { id: 'no', label: 'No Ice' },
    ],
    toppings: [
      { id: 'boba', label: 'Boba Brown Sugar', price: 4000, icedOnly: true },
      { id: 'cheese', label: 'Cheese Foam', price: 5000 },
      { id: 'shot', label: 'Extra Shot', price: 5000 },
      { id: 'oat', label: 'Ganti Oat Milk', price: 6000 },
    ],
  },

  promos: [
    {
      tag: 'Paket Bestie', title: 'Ngopi Berdua Lebih Hemat',
      desc: 'Diskon 15% untuk pembelian minimal 2 cup. Ajak bestie, bagi struknya!',
      code: 'BESTIE', c1: '#ff8a4c', c2: '#ff5b2e', cups: ['kopi-susu-aren', 'caramel-latte'],
    },
    {
      tag: 'Happy Hour', title: 'Jam 2–4 Sore Diskon 20%',
      desc: 'Ngantuk siang? Lawan pakai kopi. Berlaku setiap hari pukul 14.00–16.00.',
      code: 'HAPPYHOUR', c1: '#7a5440', c2: '#3b2418', cups: ['americano'], happy: true,
    },
    {
      tag: 'Member Baru', title: 'Potongan Rp5.000',
      desc: 'Untuk order pertama minimal Rp30.000. Daftar member gratis di bawah!',
      code: 'YUMK5K', c1: '#36b07a', c2: '#1f7a4f', cups: ['matcha-latte', 'taro-latte'],
    },
  ],

  testimonials: [
    { name: 'Nadia Putri', role: 'Mahasiswi', rating: 5, color: '#ff8a4c', fav: 'Kopi Susu Gula Aren',
      text: 'Kopi susu gula arennya juara! Manisnya pas, kopinya tetap kerasa. Udah langganan dari semester 3.' },
    { name: 'Raka Pratama', role: 'Software Engineer', rating: 5, color: '#6f4e37', fav: 'Es Americano',
      text: 'Americano-nya jadi bahan bakar wajib pas lembur. Order lewat WA cepet banget, 15 menit udah sampai.' },
    { name: 'Sinta Maharani', role: 'Content Creator', rating: 5, color: '#8b5cf6', fav: 'Taro Boba Latte',
      text: 'Taro latte plus boba-nya creamy parah. Cup-nya juga lucu, aesthetic buat konten!' },
    { name: 'Bu Wulan', role: 'Guru SD', rating: 4, color: '#2fa36b', fav: 'Kopi Susu Pandan',
      text: 'Harganya ramah di kantong, rasanya nggak kalah sama kedai besar. Adminnya juga ramah dan sabar.' },
    { name: 'Dimas Aditya', role: 'Driver Ojol', rating: 5, color: '#e8963c', fav: 'Kopi Tubruk Panas',
      text: 'Sering ambil orderan Ngops Yumk, packing-nya rapi dan nggak pernah tumpah. Saya sendiri juga ketagihan.' },
    { name: 'Alya Rahman', role: 'Pekerja Kantoran', rating: 5, color: '#e5484d', fav: 'Yumk Butterscotch',
      text: 'Butterscotch signature-nya wajib coba! Happy hour jam 2 siang jadi penyelamat produktivitas.' },
  ],

  gallery: [
    { title: 'Racikan Barista', caption: 'Setiap cup diseduh fresh saat kamu pesan', cups: ['kopi-susu-aren'], bg: 'linear-gradient(160deg,#f7d9b5,#e8963c)', span: 'tall' },
    { title: 'Signature Series', caption: 'Butterscotch, pandan, dan regal crumble', cups: ['butterscotch', 'kopi-pandan', 'regal-crumble'], bg: 'linear-gradient(135deg,#4a2f20,#2b1a12)', span: 'wide' },
    { title: 'Teman Nugas', caption: 'Kafein pas buat nemenin deadline', cups: ['americano'], bg: 'linear-gradient(160deg,#ffe3d1,#ff8a4c)' },
    { title: 'Non-Kopi Juga Ada', caption: 'Matcha, taro, dan red velvet', cups: ['matcha-latte', 'red-velvet'], bg: 'linear-gradient(160deg,#d8f0dc,#7cc49a)' },
    { title: 'Pojok Hangat', caption: 'Kopi tubruk dan manual brew panas', cups: ['kopi-tubruk'], bg: 'linear-gradient(160deg,#efe1d1,#a47551)', span: 'tall' },
    { title: 'Biji Kopi Lokal', caption: 'Arabika Gayo & Robusta Temanggung', cups: [], text: '100% Lokal', bg: 'radial-gradient(circle at 30% 20%,#6f4e37,#1f120c)' },
    { title: 'Ngopi Bareng Bestie', caption: 'Lebih seru ramean, lebih hemat pakai BESTIE', cups: ['kopi-susu-ngops', 'choco-hazel'], bg: 'linear-gradient(135deg,#fff1c9,#f2b84b)', span: 'wide' },
    { title: 'Takeaway Friendly', caption: 'Cup tersegel, aman dibawa ke mana aja', cups: ['caramel-latte'], bg: 'linear-gradient(160deg,#ece6ff,#a78bfa)' },
  ],

  faq: [
    { q: 'Bagaimana cara pesan lewat website?',
      a: 'Pilih menu, atur ukuran, gula, es, dan topping, lalu masukkan ke keranjang. Isi nama dan metode pengambilan, kemudian klik "Pesan via WhatsApp". Pesananmu otomatis tersusun rapi di chat WhatsApp kami.' },
    { q: 'Apakah bisa diantar?',
      a: 'Bisa! Pilih "Diantar" saat checkout untuk area sekitar 5 km dari kedai, ongkir dikonfirmasi admin. Kamu juga bisa pesan lewat GoFood, GrabFood, atau ShopeeFood.' },
    { q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Tunai, QRIS (semua e-wallet dan mobile banking), serta transfer bank. Detail pembayaran dikirim admin saat konfirmasi pesanan.' },
    { q: 'Biji kopinya dari mana?',
      a: '100% biji kopi lokal: blend Arabika Gayo dan Robusta Temanggung yang disangrai setiap minggu supaya rasanya selalu fresh.' },
    { q: 'Bisa pesan dalam jumlah banyak untuk acara?',
      a: 'Bisa banget! Untuk pesanan di atas 20 cup (rapat, ulang tahun, event kampus) hubungi kami minimal H-1 lewat WhatsApp untuk harga spesial.' },
    { q: 'Bagaimana cara memakai kode promo?',
      a: 'Masukkan kode di kolom promo pada keranjang, atau klik "Pakai Kode" di bagian Promo. Satu kode berlaku untuk satu transaksi.' },
  ],
};
