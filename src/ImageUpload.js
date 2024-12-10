'use strict'
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

const pathKey = path.resolve('./serviceaccountkey.json');
const gcs = new Storage({
    projectId: 'bangkit-plantlens',
    keyFilename: pathKey
});

const bucketName = 'history-image';
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
    return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

const uploadImageHandler = async (filePath, fileName) => {
    if (!fs.existsSync(filePath)) {
        throw new Error('Gagal mengunggah gambar. File tidak ditemukan.');
    }

    // Ekstensi file yang diizinkan
    const allowedExtensions = ['jpeg', 'jpg', 'png'];
    const fileExtension = path.extname(fileName).toLowerCase().slice(1); 

    if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Format file tidak didukung. Hanya mendukung JPEG, JPG, dan PNG.');
    }

    const gcsname = `${Date.now()}-${fileName}`;
    const fileUpload = bucket.file(gcsname);

    try {
        // Buat stream untuk mengunggah file ke GCS
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: `image/${fileExtension}`, // Menggunakan ekstensi sebagai content type
            },
        });

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(stream)
                .on('finish', resolve)
                .on('error', reject);
        });

        // Mengembalikan URL publik dari file yang diunggah
        return getPublicUrl(gcsname);
    } catch (error) {
        console.error(error);
        throw new Error('Gagal mengunggah gambar. Terjadi kesalahan pada server.');
    }
};

module.exports = { uploadImageHandler };
