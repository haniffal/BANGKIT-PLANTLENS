# Backend PlantLens (Cloud Computing) Branch
ini merupakan branch dari Cloud Computing Capstone Project PlantLens


# Panduan langkah demi langkah untuk menyiapkan dan menjalankan proyek ini.

disarankan menggunakan wsl seperti ubuntu atau yang lainnya pada windows jika mengalami error pada saat menjalankan proyek

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
Membuat virtual environment jika anda bermasalah pada saat Instal Dependensi Python pada step 7

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


# API Documentation
#### Endpoint: `http://localhost:<PORT>`
#### Tools : Postman


## **Show History**
- **Endpoint**: `/history`
- **Method**: `GET`
Penjelasan
Endpoint ini digunakan untuk mendapatkan data riwayat prediksi yang pernah dilakukan. Data yang dikembalikan mencakup informasi tentang tanaman, penyakit, solusi, gambar, dan tanggal riwayat.

```json
{
  "status": "success",
  "data": [
{
	  "id_history": "7_parN10S2O6XAPqRYKIU",
	  "nama_tanaman": "Apple",
	  "nama_penyakit": "Black_rot",
	  "desc_solusi": "Gunakan fungisida berbahan aktif kaptan atau chlorothalonil secara teratur, bersihkan kebun, dan pangkas bagian tanaman yang sakit",
	  "image": "https://storage.googleapis.com/history/1733663952583-image(55).JPG",
	  "tgl_history": "2024-12-07T17:00:00.000Z"
},
{
	  "id_history": "Z02MDteWmQGTkZ51Cfr17",
	  "nama_tanaman": "Tomato",
	  "nama_penyakit": "Spider_mites Two-spotted_spider_mite",
	  "desc_solusi": "Semprotkan fungisida berbahan aktif mankozeb atau sulfur secara rutin",
	  "image": "https://storage.googleapis.com/history/1733664283684-image(208).JPG",
	  "tgl_history": "2024-12-07T17:00:00.000Z"
}
  ]
}
```
Error Response
Kode 500:
```json
{
  "status": "fail",
  "message": "Gagal mengambil data history."
}
```
## **Kirim Gambar**
- **Endpoint**: `/predict`
- **Method**: `POST`
- **Options**:
    - Payload Type: `multipart/form-data`
    - File Upload: Mendukung file dalam format multipart.
    - Ukuran Maksimal: 5 MB.
####Penjelasan
Endpoint ini menerima file gambar dari pengguna, memproses gambar untuk melakukan prediksi menggunakan model Python, dan menyimpan hasil prediksi ke dalam database. Selain itu, gambar akan diunggah ke Google Cloud Storage.
#### Request Format
- Headers:
```bash
Content-Type: multipart/form-data
```
-Body: Field yang harus dikirimkan:
    - `file`: File gambar yang akan diunggah dan diprediksi. Format harus `image/jpeg` atau `image/jpg`.

#### Response Format
- Success (Kode 200):
```json
{
  "status": "success",
  "message": "Gambar berhasil diprediksi dan diupload.",
  "data": {
    "nama_tanaman": "Apple",     
    "nama_penyakit": "Black_rot",    
    "penanganan": "Gunakan fungisida berbahan aktif kaptan atau chlorothalonil secara teratur, bersihkan kebun, dan pangkas bagian tanaman yang sakit",       
    "image_url": "https://storage.googleapis.com/history/1733665089415-image.JPG"     
  }
}
```
- Error Response:
    - Kode 400: Jika file tidak dikirim.
```json
{
  "status": "fail",
  "message": "Gagal mengunggah gambar. Mohon lampirkan file gambar."
}
```
  - Kode 500: Jika ada error dalam proses prediksi atau penyimpanan.
```json
{
  "status": "fail",
  "message": "Gagal memproses gambar."
}
```


# Penting

jangan lupa untuk mengkonfigurasi database di db.js dan  serviceaccountkey.json 