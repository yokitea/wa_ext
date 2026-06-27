# WhatsApp Web Helper Extension 🚀

Ekstensi Google Chrome super canggih yang dirancang khusus untuk mempermudah pebisnis, importir, dan negosiator saat bertransaksi melalui **WhatsApp Web**.

Ekstensi ini menyulap WhatsApp Web kamu menjadi alat bisnis yang sangat kuat dengan fitur perhitungan otomatis, konversi mata uang, dan terjemahan langsung di dalam layar chat!

---

## ✨ Fitur Utama

1. **📊 Smart Deal Calculator (Kalkulator Bisnis Pintar)**
   Ekstensi akan otomatis mendeteksi chat yang mengandung format negosiasi/dealing (Kuantitas × Harga - Diskon) dan memunculkan kartu kalkulator instan langsung di bawah pesan chat tersebut.
2. **💱 Konversi Mata Uang Otomatis (Auto Currency)**
   Otomatis mendeteksi mata uang asing (seperti `¥`, `$`, `€`, `SGD`, `RMB`) pada pesan masuk maupun keluar, dan menampilkan perkiraan konversinya ke IDR (Rupiah) atau mata uang pilihanmu.
3. **🌐 Terjemahan Pesan Sekali Klik (Inline Translation)**
   Terdapat tombol globe (🌐) tersembunyi di sebelah kiri setiap balon obrolan. Klik tombol tersebut untuk menerjemahkan pesan secara instan tanpa perlu membuka tab Google Translate.
4. **🌙 Dark Mode & UI Modern**
   Tampilan ekstensi sangat mulus, responsif, hemat ruang (*collapsible*), dan 100% mendukung mode gelap (Dark Mode) bawaan WhatsApp Web.

---

## 📥 Cara Pemasangan (Instalasi)

Karena ekstensi ini belum di-publish ke Chrome Web Store, kamu bisa memasangnya secara manual (Developer Mode) dengan sangat mudah:

1. **Download/Clone** repository ini ke komputermu, lalu ekstrak foldernya.
2. Buka browser **Google Chrome** dan ketik alamat berikut di *address bar*:
   `chrome://extensions/`
3. Di pojok kanan atas halaman, aktifkan saklar **Developer mode** (Mode Pengembang).
4. Akan muncul beberapa tombol baru di kiri atas. Klik tombol **Load unpacked** (Muat yang belum dikemas).
5. Pilih folder tempat kode ekstensi ini berada (misalnya folder `wa_ext`).
6. Selesai! Ekstensi berhasil dipasang. Jangan lupa klik ikon *puzzle* (🧩) di Chrome dan **Pin (📌)** ekstensi "WhatsApp Web Helper" agar mudah diakses.

> **Note:** Setiap kali kamu melakukan update pada kode di folder tersebut, cukup kembali ke `chrome://extensions/` dan klik tombol **Reload** (ikon panah melingkar) pada kartu ekstensi ini.

---

## 🧮 Cara Penggunaan Smart Deal Calculator

Fitur andalan dari ekstensi ini! Cukup ketik pesan dengan format matematika tertentu, dan ekstensi akan membacanya secara otomatis.

### **Format Dasar:**
`[Jumlah] pcs x [Harga] diskon [Diskon]%`

### **1. Contoh Transaksi Simpel**
> **Chat:** `10 pcs x ¥5.800.000`
> **Hasil:** Menghitung total ¥58.000.000 dan menampilkan ekuivalen harganya dalam Rupiah.

### **2. Transaksi dengan Diskon**
> **Chat:** `10 pcs x $125 diskon 15%`
> **Hasil:** Menghitung subtotal, memotong 15%, menampilkan total harga bersih, dan harga per satuan.

### **3. Negosiasi Tingkat Lanjut (Diskon Ganda / Double Discount)**
Supplier sering menggunakan diskon bertingkat (potong X%, lalu dari sisanya dipotong Y%).
> **Chat:** `10 pcs x ¥5.800.000 diskon 10% + 5%`
> **Hasil:** Ekstensi akan memotong 10% pertama, kemudian secara akurat memotong 5% lagi dari sisa subtotal tersebut.

### **4. Menggunakan Singkatan Cepat (Suffix Multiplier)**
Males ngetik angka nol (0) banyak-banyak? Gunakan singkatan:
- `jt` atau `juta` atau `m` = Juta (× 1.000.000)
- `k` atau `rb` atau `ribu` = Ribu (× 1.000)

> **Chat:** `10x5.8jt-10%`
> **Hasil:** Otomatis terbaca sebagai `10 pcs x 5.800.000 diskon 10%`. Sangat cepat dan efisien!

### **📋 Tombol Salin (Copy)**
Setelah mengeklik panel **"📊 Lihat Kalkulasi Deal ▼"** untuk membukanya, terdapat tombol **Salin** di pojok kanan bawah. Klik tombol tersebut untuk menyalin seluruh rincian transaksi (bersih, rapi, beserta hasil konversinya) yang siap di-*paste* ke dokumen Invoice atau Purchase Order.

---

## ⚙️ Pengaturan Ekstensi (Popup Settings)

Klik ikon ekstensi di pojok kanan atas browser Chrome kamu untuk membuka menu pengaturan:
- **Konversi Mata Uang:** Nyalakan/matikan fitur konversi otomatis.
- **Kalkulator Bisnis (Deal Calc):** Nyalakan/matikan fitur pembacaan rumus Smart Deal Calculator.
- **Mata Uang Target:** Ubah mata uang tujuan (Default: `IDR`).
- **Terjemahan Pesan:** Nyalakan/matikan tombol terjemahan (🌐).
- **Bahasa Tujuan Terjemahan:** Ubah bahasa hasil terjemahan (Default: `Indonesian`).

Semua pengaturan akan otomatis tersimpan. Cukup *refresh* (F5) tab WhatsApp Web kamu jika ada perubahan yang tidak langsung muncul.

---
*Dibuat untuk mempercepat negosiasi impor & bisnis lintas negara! 🍻*
