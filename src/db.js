const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: '',            // Ganti dengan IP instance MySQL Anda
    user: 'root',        // Ganti dengan username MySQL Anda
    database: '',        // Ganti dengan nama database Anda
    password: ''         // Ganti dengan password MySQL Anda
    
});


connection.connect((err) => {
    if (err) {
        console.error('Koneksi gagal:', err.message);
    } else {
        console.log('Berhasil terhubung ke database.');
    }
    
});

module.exports = connection ;
