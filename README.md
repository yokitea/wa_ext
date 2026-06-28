# WhatsApp Web Helper Extension 🚀

Ekstensi Google Chrome yang dirancang khusus untuk mempermudah pebisnis, importir, dan negosiator saat bertransaksi melalui **WhatsApp Web**.

Ekstensi ini membantu aktivitas bisnis kamu dengan fitur perhitungan otomatis, konversi mata uang, dan terjemahan langsung di dalam layar chat!

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
5. **📄 Cetak Deal Summary (Export PDF)**
   Setiap hasil kalkulasi bisnis dapat dicetak menjadi format *Deal Summary* profesional (atau PDF) hanya dengan satu klik.
6. **🏛️ Kalkulasi Pajak Otomatis (PPN & PPH)**
   Dilengkapi pengaturan pajak fleksibel (PPN & PPH) yang mendukung sistem harga *Exclude* (Pajak di luar) maupun *Include* (Pajak di dalam/dipotong otomatis untuk mencari Dasar Pengenaan Pajak). Bisa dinyalakan/dimatikan kapan saja!

---

## 📥 Cara Pemasangan (Instalasi Super Mudah)

Karena ekstensi ini dirancang khusus dan belum ada di Chrome Web Store, instalasinya dilakukan secara manual. Jangan khawatir, caranya **sangat gampang** dan dijamin aman! Ikuti 3 langkah berikut:

### Langkah 1: Download File Ekstensi
1. Buka halaman utama web ini (Github: https://github.com/yokitea/wa_ext).
2. Cari tombol hijau bertuliskan **"<> Code"** di kanan atas, lalu klik.
3. Pilih menu **"Download ZIP"**.
4. Setelah file `.zip` selesai didownload, buka file tersebut dan **Extract (Keluarkan)** foldernya ke tempat yang aman di komputermu (misalnya di folder `Documents` atau `Desktop`). Pastikan kamu ingat di mana kamu menaruh folder hasil ekstrak tersebut!

### Langkah 2: Pasang di Google Chrome
1. Buka browser **Google Chrome**.
2. Ketik alamat ini di *address bar* (tempat biasa ngetik alamat website seperti www...) lalu tekan Enter:
   **`chrome://extensions/`**
3. Di halaman yang terbuka, perhatikan pojok kanan atas. Cari tulisan **"Developer mode"** (atau "Mode Pengembang") dan **Aktifkan saklarnya** (geser ke kanan sampai warna biru).
4. Setelah aktif, akan muncul tiga tombol baru di kiri atas. Klik tombol paling kiri: **"Load unpacked"** (atau "Muat yang belum dikemas").
5. Jendela pencarian file akan terbuka. Cari dan pilih **folder hasil ekstrak** tadi (biasanya bernama `wa_ext-main` atau `wa_ext`), lalu klik tombol **Select Folder** di kanan bawah.
6. **🎉 Selesai!** Ekstensi berhasil terpasang dan otomatis aktif.

### Langkah 3: Munculkan Ikon di Layar (Opsional tapi Penting!)
Agar ekstensinya gampang diatur sewaktu-waktu:
1. Klik ikon **Puzzle (🧩)** di pojok kanan atas Chrome (di sebelah foto profil/baris pencarian).
2. Cari nama ekstensi "WhatsApp Web Helper".
3. Klik ikon **Pin (📌)** di sebelahnya sampai berubah warna. Ikon ekstensi kini akan selalu terlihat di layar komputermu!

> **Tips Update ke Versi Baru:** Kalau ada versi terbaru di masa depan, cukup tiban/replace folder lama dengan file baru hasil ekstrak yang baru di-download. Lalu buka `chrome://extensions/` dan klik tombol **Reload** (ikon panah melingkar 🔄) pada kotak ekstensi ini.

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

### **📄 Export ke PDF (Deal Summary)**
Di sebelah tombol Salin, terdapat tombol **📄 PDF**. Jika diklik, ekstensi akan membuka tab baru berisi rincian transaksi dalam format struk *Deal Summary* yang bersih dan profesional. Jendela cetak (*Print*) akan otomatis terbuka sehingga kamu bisa langsung menyimpannya sebagai file PDF.

### **⌨️ Shortcut Keyboard**
Tekan **`Alt + Shift + E`** pada *keyboard* saat berada di layar WhatsApp Web untuk memekarkan (expand) atau menciutkan (collapse) semua kartu kalkulator yang ada secara bersamaan.

---

## ⚙️ Pengaturan Ekstensi (Popup Settings)

Klik ikon ekstensi di pojok kanan atas browser Chrome kamu untuk membuka menu pengaturan:
- **Konversi Mata Uang:** Nyalakan/matikan fitur konversi otomatis.
- **Kalkulator Bisnis (Deal Calc):** Nyalakan/matikan fitur pembacaan rumus Smart Deal Calculator.
- **Tampilan Default:** Mengatur apakah kartu kalkulator baru muncul dalam kondisi tertutup (Ciut) atau terbuka lebar (Mekar).
- **Mata Uang Target:** Ubah mata uang tujuan (Default: `IDR`).
- **Terjemahan Pesan:** Nyalakan/matikan tombol terjemahan (🌐).
- **Bahasa Tujuan Terjemahan:** Ubah bahasa hasil terjemahan (Default: `Indonesian`).
- **Mekar Semua / Ciut Semua:** Tombol cepat untuk membuka/menutup seluruh kartu kalkulator secara massal.

Semua pengaturan akan otomatis tersimpan. Cukup *refresh* (F5) tab WhatsApp Web kamu jika ada perubahan yang tidak langsung muncul.

---
*Dibuat untuk mempercepat negosiasi impor & bisnis lintas negara! 🍻*
