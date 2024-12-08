'use strict'
const {Storage} = require("@google-cloud/storage")
const fs = require('fs')
const path = require('path');

const pathKey = path.resolve('./serviceaccountkey.json')
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

    const gcsname = `${Date.now()}-${fileName}`;
    const fileUpload = bucket.file(gcsname);

    try {
        // Baca file dari disk dan unggah ke Google Cloud Storage
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: 'image/jpeg', // Anda bisa menggunakan MIME type file asli
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

/*
const uploadImageHandler = async (file) => {
    if (!file) {
        throw new Error('Gagal mengunggah gambar. Mohon lampirkan file gambar.');
    }

    // Cek ekstensi file
    if (!file.hapi.filename.match(/\.(jpg|jpeg|png)$/i)) {
        throw new Error('Gagal mengunggah gambar. File harus berupa gambar dengan ekstensi jpg, jpeg, png.');
    }

    const gcsname = `${Date.now()}-${file.hapi.filename}`;
    const fileUpload = bucket.file(gcsname);

    try {
        // Upload file ke Google Cloud Storage
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.hapi.headers['content-type'],
            },
        });

        // Tunggu sampai upload selesai
        await new Promise((resolve, reject) => {
            file.pipe(stream)
                .on('finish', resolve)
                .on('error', reject);
        });

        // Mengembalikan URL publik dari file yang diupload
        return getPublicUrl(gcsname);
    } catch (error) {
        console.error(error);
        throw new Error('Gagal mengunggah gambar. Terjadi kesalahan pada server.');
    }
};


*/
module.exports = { uploadImageHandler };