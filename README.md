# Ngops Yumk — Website Kopi Cup

Website one-page untuk UMKM kopi cup **Ngops Yumk**. Dibuat dengan HTML, CSS, dan JavaScript murni, tanpa build tool dan tanpa library.

## Fitur

- Preloader animasi, navbar sticky dengan scroll-spy, menu mobile, dark mode
- Hero interaktif: klik cup untuk ganti rasa, parallax biji kopi, counter statistik
- Menu dengan filter kategori, pencarian, dan urutan; kartu bergerak miring (tilt 3D) saat disorot
- Modal kustomisasi: ukuran, gula, es, topping, catatan. Harga dan ilustrasi cup berubah langsung
- Keranjang tersimpan di browser, kode promo, checkout otomatis ke WhatsApp
- Promo dengan countdown dan status Happy Hour
- Slider testimoni (bisa di-swipe), galeri dengan lightbox, FAQ accordion
- Peta lokasi, jam buka dengan status buka/tutup otomatis, tombol GoFood/GrabFood/ShopeeFood
- Form member (newsletter), toast notifikasi, tombol WhatsApp melayang
- SEO (meta, Open Graph, JSON-LD), aksesibel (keyboard, fokus, `prefers-reduced-motion`)

## Menjalankan

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Mengubah data

| Yang ingin diubah | File |
|---|---|
| Nomor WhatsApp, alamat, jam buka, link sosmed & ojol, kode promo | `js/config.js` |
| Menu, harga, warna cup, testimoni, galeri, FAQ, kartu promo | `js/data.js` |
| Warna tema & tampilan | variabel CSS di bagian atas `css/style.css` |

> Data JSON-LD (SEO) di `<head>` pada `index.html` juga berisi alamat, nomor telepon, dan jam buka. Samakan dengan `config.js`.

### Menambah menu

Tambahkan objek baru ke `menu` di `js/data.js`:

```js
{
  id: 'kopi-baru', name: 'Kopi Baru', category: 'kopi-susu', price: 20000,
  desc: 'Deskripsi singkat.',
  type: 'iced',                                   // 'iced' atau 'hot'
  layers: [['#5a3416', .3], ['#d9b38c', .7]],     // lapisan minuman dari bawah ke atas
  tint: '#f3e6d6', straw: '#ff6b35',              // warna latar kartu & sedotan
  badge: 'new', rating: 4.8, sold: 100,
}
```

Untuk `type: 'hot'`, ganti `layers`/`straw` dengan `sleeve: '#6f4e37'`.

## Deploy

Upload seluruh folder ke hosting statis apa pun (Netlify, Vercel, GitHub Pages, Cloudflare Pages, atau cPanel).
