# Backend PlantLens (Cloud Computing)

Panduan langkah demi langkah untuk menyiapkan dan menjalankan proyek ini.

## 1. Clone Repository

Langkah pertama adalah meng-clone repository ini ke komputer Anda. Gunakan perintah berikut di terminal:
```bash
git clone -b CC https://github.com/haniffal/BANGKIT-PLANTLENS.git
```

### 2. Instalasi Dependensi Node.js

Masuk ke direktori proyek dan instal dependensi Node.js yang diperlukan dengan menjalankan perintah berikut:
```bash
npm install
```

### 3. Periksa Instalasi Python dan pip

Pastikan bahwa Python 3 dan pip sudah terinstal dengan menjalankan perintah berikut:
```bash
python3 --version
pip3 --version
```
Jika perintah ini menghasilkan versi dari Python dan pip, itu berarti mereka sudah terinstal dengan benar.

### 4. Membuat Virtual Environment

Buat virtual environment untuk proyek ini dengan menjalankan perintah berikut:
```bash
python3 -m venv venv
```

### 5. Aktifkan Virtual Environment

Setelah virtual environment dibuat, aktifkan dengan mengikuti langkah-langkah sesuai dengan sistem operasi yang Anda gunakan:

#### Linux/macOS:
```bash
source venv/bin/activate
```
#### Windows (menggunakan Command Prompt):
```bach
.\venv\Scripts\activate
```

### 6. Verifikasi Aktivasi Virtual Environment

Setelah berhasil mengaktifkan virtual environment, prompt Anda akan berubah untuk menunjukkan bahwa virtual environment aktif, misalnya:
```bash
(venv) user@hostname:/path/to/repository-name$
```

### 7. Instal Dependensi Python

Dengan virtual environment aktif, instal dependensi Python yang diperlukan dengan perintah berikut:

```bash
pip install tensorflow numpy Pillow
```

### 8. Jalankan Proyek

Untuk menjalankan proyek, gunakan perintah berikut:
```bash
npm run start
```
### 9. Menonaktifkan Virtual Environment

Setelah selesai, Anda dapat menonaktifkan virtual environment dengan perintah:
```bash
deactivate
```

# Penting

jangan lupa untuk mengkonfigurasi database di db.js dan menambahkan serviceaccountkey.json 





