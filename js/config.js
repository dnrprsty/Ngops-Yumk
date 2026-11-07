/* ==========================================================
   KONFIGURASI BRAND — ubah data di file ini saja
   ========================================================== */
window.NGOPS_CONFIG = {
  brand: 'Ngops Yumk',
  tagline: 'Ngopi Santai, Rasa Juara',

  // Nomor WhatsApp format internasional TANPA tanda + dan TANPA 0 di depan
  whatsapp: '6281234567890',
  whatsappDisplay: '0812-3456-7890',
  email: 'halo@ngopsyumk.id',

  address: 'Jl. Kaliurang KM 5 No. 12, Sleman, Yogyakarta',
  // Teks pencarian untuk Google Maps (embed & petunjuk arah)
  mapsQuery: 'Jl. Kaliurang KM 5, Sleman, Yogyakarta',

  // Jam buka: index 0 = Minggu ... 6 = Sabtu. Isi null jika tutup.
  hours: [
    ['09:00', '22:00'], // Minggu
    ['08:00', '22:00'], // Senin
    ['08:00', '22:00'], // Selasa
    ['08:00', '22:00'], // Rabu
    ['08:00', '22:00'], // Kamis
    ['08:00', '23:00'], // Jumat
    ['08:00', '23:00'], // Sabtu
  ],

  social: {
    instagram: 'https://instagram.com/ngopsyumk',
    tiktok: 'https://tiktok.com/@ngopsyumk',
  },

  // Ganti dengan link toko Anda di masing-masing aplikasi
  ojol: {
    gofood: 'https://gofood.co.id/',
    grabfood: 'https://food.grab.com/id/id/',
    shopeefood: 'https://shopee.co.id/m/shopeefood',
  },

  // Kode promo yang bisa dipakai di keranjang
  // type: 'percent' | 'flat'; min = minimal subtotal; minQty = minimal jumlah cup; hours = [jamMulai, jamSelesai)
  promoCodes: {
    NGOPSHEMAT: { type: 'percent', value: 10, label: 'Diskon 10%' },
    YUMK5K: { type: 'flat', value: 5000, min: 30000, label: 'Potongan Rp5.000' },
    BESTIE: { type: 'percent', value: 15, minQty: 2, label: 'Diskon 15% (min. 2 cup)' },
    HAPPYHOUR: { type: 'percent', value: 20, hours: [14, 16], label: 'Diskon 20% Happy Hour' },
  },

  stats: { sold: 25000, rating: 4.9 },
  foundedYear: 2021,
};
