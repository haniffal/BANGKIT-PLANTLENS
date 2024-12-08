const { nanoid } = require('nanoid');
const connection  = require('./db');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { uploadImageHandler } = require('./ImageUpload');  // Import the image upload handler


const predictImageWithPython = (imagePath) => {
    return new Promise((resolve, reject) => {
        const command = `python3 ./src/predict.py "${imagePath}"`;
        exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(stderr);
            }
            
            // Membersihkan output dari karakter escape yang tidak diinginkan
            const cleanedOutput = stdout
                .replace(/\x1b\[[0-9;]*m/g, '') // Menghapus escape sequences ANSI
                .replace(/\b/g, '')             // Menghapus backspaces (\b)
                .trim();                        // Menghapus spasi di awal dan akhir

            // Hanya mengambil nama kelas yang diprediksi
            const prediction = cleanedOutput.split('\n').pop().trim();

            resolve(prediction);
        });
    });
};
/*
const getSolusiForPenyakit = async (id_penyakit) => {
    const query = `
        SELECT id_solusi 
        FROM solusi 
        WHERE id_penyakit = ? 
        LIMIT 1;
    `;

    try {
        const [rows] = await connection.promise().query(query, [id_penyakit]);
        if (rows.length > 0) {
            return rows[0].id_solusi;
        } else {
            throw new Error(`Solusi untuk penyakit dengan ID '${id_penyakit}' tidak ditemukan.`);
        }
    } catch (error) {
        console.error('Error mencari solusi:', error);
        throw error;
    }
};

*/

// Endpoint /predict untuk menerima file gambar
const uploadImageAndPredictHandler = async (request, h) => {
    const { file } = request.payload;

    if (!file || !file.hapi.filename) {
        return h.response({
            status: 'fail',
            message: 'Gagal mengunggah gambar. Mohon lampirkan file gambar.',
        }).code(400);
    }

    // Menyimpan file sementara di server
    const fileName = file.hapi.filename;
    const uploadPath = path.join(__dirname, 'uploads', fileName);
    const fileStream = fs.createWriteStream(uploadPath);

    await new Promise((resolve, reject) => {
        file.pipe(fileStream);
        file.on('end', resolve);
        file.on('error', reject);
    });

    try {

        // Jalankan prediksi menggunakan model Python
        const prediction = await predictImageWithPython(uploadPath);

        // Upload gambar ke Google Cloud Storage menggunakan path lokal
        const publicUrl = await uploadImageHandler(uploadPath, fileName);

        // Ambil id_tanaman, id_penyakit, dan id_solusi berdasarkan prediction
        const [nama_tanaman, nama_penyakit] = prediction.split('___');

        const getIdTanamanQuery = 'SELECT id_tanaman FROM tanaman WHERE nama_tanaman = ?';
        const [tanamanResult] = await connection.promise().query(getIdTanamanQuery, [nama_tanaman]);
        if (tanamanResult.length === 0) throw new Error(`Tanaman "${nama_tanaman}" tidak ditemukan.`);
        const id_tanaman = tanamanResult[0].id_tanaman;

        const getIdPenyakitQuery = 'SELECT id_penyakit FROM penyakit WHERE nama_penyakit = ? AND id_tanaman = ?';
        const [penyakitResult] = await connection.promise().query(getIdPenyakitQuery, [nama_penyakit, id_tanaman]);
        if (penyakitResult.length === 0) throw new Error(`Penyakit "${nama_penyakit}" untuk tanaman "${nama_tanaman}" tidak ditemukan.`);
        const id_penyakit = penyakitResult[0].id_penyakit;

        const getDescSolusiQuery = 'SELECT desc_solusi FROM solusi WHERE id_penyakit = ?';
        const [solusiResult] = await connection.promise().query(getDescSolusiQuery, [id_penyakit]);
        if (solusiResult.length === 0) throw new Error(`Solusi untuk penyakit "${nama_penyakit}" tidak ditemukan.`);
        const desc_solusi = solusiResult[0].desc_solusi;


        //const id_solusi = await getSolusiForPenyakit(id_penyakit);

        // Simpan data ke tabel history
        const historyId = nanoid();
        const tgl_history = new Date().toISOString().split('T')[0];
        const insertQuery = `
        INSERT INTO history (id_history, tgl_history, id_tanaman, id_penyakit, id_solusi, image)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.promise().query(insertQuery, [historyId, tgl_history, id_tanaman, id_penyakit, solusiResult[0].id_solusi, publicUrl]);


        // Hapus file setelah digunakan
        fs.unlinkSync(uploadPath);

        return h.response({
            status: 'success',
            message: 'Gambar berhasil diprediksi dan diupload.',
            data: {
                nama_tanaman,
                nama_penyakit,
                penanganan: desc_solusi,
                image_url: publicUrl,
            },
        }).code(200);
        
    } catch (error) {
        console.error(error);

        // Hapus file jika ada error
        if (fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }

        return h.response({
            status: 'fail',
            message: 'Gagal memproses gambar.',
        }).code(500);
    }
};


const getHistoryHandler = async (request, h) => {
    const query = `
    SELECT 
        h.id_history,
        t.nama_tanaman, 
        p.nama_penyakit, 
        s.desc_solusi,   -- Menambahkan join dengan tabel solusi untuk mendapatkan desc_solusi
        h.image,
        h.tgl_history
    FROM 
        history h
    JOIN 
        tanaman t ON h.id_tanaman = t.id_tanaman
    JOIN 
        penyakit p ON h.id_penyakit = p.id_penyakit
    JOIN 
        solusi s ON h.id_solusi = s.id_solusi   -- Join dengan tabel solusi
    ORDER BY 
        h.tgl_history DESC;
`;

    try {
        const [rows] = await connection.promise().query(query);
        console.log(rows); // Debugging data query

        return h.response({
            status: 'success',
            data: rows, // Data dari tabel history dengan nama tanaman dan penyakit
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Gagal mengambil data history.',
        }).code(500);
    }
};




module.exports = { getHistoryHandler, uploadImageAndPredictHandler  };






