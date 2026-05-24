const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const SECRET_KEY = 'cinemania_secret_key';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abdul.karim122198@gmail.com',
        pass: 'cbfuuggjrjdraixo'
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Autentikasi gagal. Token tidak ditemukan.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Autentikasi gagal. Token tidak valid.' });
    }
};

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/movies', authMiddleware, (req, res) => {
    const { genre, sortBy, search } = req.query;

    let sql = `
        SELECT sf.id, sf.judul, sf.tahun_rilis, sf.image, 
               GROUP_CONCAT(g.nama_genre SEPARATOR ', ') AS genre
        FROM Series_Film sf
        LEFT JOIN Series_Genre sg ON sf.id = sg.id_series
        LEFT JOIN Genre g ON sg.id_genre = g.id
    `;

    const params = [];

    if (genre) {
        sql += ` WHERE g.nama_genre = ?`;
        params.push(genre);
    }

    sql += ` GROUP BY sf.id`;

    if (search) {
        sql += ` HAVING sf.judul LIKE ?`;
        params.push(`%${search}%`);
    }

    if (sortBy) {
        const allowedSort = ['judul', 'tahun_rilis'];
        if (allowedSort.includes(sortBy)) {
            sql += ` ORDER BY sf.${sortBy}`;
        }
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post('/movies', upload.single('image'), (req, res) => {
    const { title, genre, year } = req.body;
    const image = req.file ? req.file.filename : null;

    const sqlFilm = "INSERT INTO Series_Film (judul, tahun_rilis, image) VALUES (?, ?, ?)";
    db.query(sqlFilm, [title, year, image], (err, resultFilm) => {
        if (err) return res.status(500).send(err);

        const newFilmId = resultFilm.insertId;
        const genreArray = genre.split(',').map(g => g.trim());

        genreArray.forEach(namaGenre => {
            if (!namaGenre) return;

            const sqlCheckGenre = "SELECT id FROM Genre WHERE nama_genre = ?";
            db.query(sqlCheckGenre, [namaGenre], (err, resultGenre) => {
                if (err) return;

                if (resultGenre.length > 0) {
                    insertSeriesGenre(newFilmId, resultGenre[0].id);
                } else {
                    const sqlInsertGenre = "INSERT INTO Genre (nama_genre) VALUES (?)";
                    db.query(sqlInsertGenre, [namaGenre], (err, resultNewGenre) => {
                        if (err) return;
                        insertSeriesGenre(newFilmId, resultNewGenre.insertId);
                    });
                }
            });
        });

        res.status(201).send("Film dan multigenre berhasil ditambahkan!");
    });
});

function insertSeriesGenre(seriesId, genreId) {
    const sql = "INSERT INTO Series_Genre (id_series, id_genre) VALUES (?, ?)";
    db.query(sql, [seriesId, genreId], (err) => {
        if (err) console.error("Error INSERT Series_Genre:", err);
    });
}

app.delete('/movies/:id', (req, res) => {
    const sql = "DELETE FROM Series_Film WHERE id = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).send("Film berhasil dihapus!");
    });
});

app.put('/movies/:id', upload.single('image'), (req, res) => {
    const { title, year } = req.body;
    const movieId = req.params.id;

    if (req.file) {
        const sql = "UPDATE Series_Film SET judul=?, tahun_rilis=?, image=? WHERE id=?";
        db.query(sql, [title, year, req.file.filename, movieId], (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film dan poster berhasil diupdate!");
        });
    } else {
        const sql = "UPDATE Series_Film SET judul=?, tahun_rilis=? WHERE id=?";
        db.query(sql, [title, year, movieId], (err) => {
            if (err) return res.status(500).send(err);
            res.send("Data film berhasil diupdate!");
        });
    }
});

app.post('/register', async (req, res) => {
    const { fullname, username, password, email } = req.body;

    if (!fullname || !username || !password || !email) {
        return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = uuidv4();

        const sql = "INSERT INTO user (fullname, username, password, email, token) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [fullname, username, hashedPassword, email, token], async (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Email atau username sudah terdaftar.' });
                }
                return res.status(500).json({ message: 'Terjadi kesalahan server.' });
            }

            const mailOptions = {
                from: 'abdul.karim122198@gmail.com',
                to: email,
                subject: 'Verifikasi Email Cinemania',
                html: `<h2>Halo ${fullname}!</h2>
                       <p>Klik link berikut untuk memverifikasi akunmu:</p>
                       <a href="http://localhost:3000/verify-email?token=${token}">Verifikasi Email</a>`
            };

            await transporter.sendMail(mailOptions);
            res.status(201).json({ message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    try {
        const sql = "SELECT * FROM user WHERE email = ?";
        db.query(sql, [email], async (err, result) => {
            if (err) return res.status(500).json({ message: 'Terjadi kesalahan server.' });

            if (result.length === 0) {
                return res.status(401).json({ message: 'Email atau password yang dimasukkan salah.' });
            }

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Email atau password yang dimasukkan salah.' });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                SECRET_KEY,
                { expiresIn: '24h' }
            );

            res.status(200).json({ message: 'Login berhasil!', token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
});

app.get('/verify-email', (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token tidak ditemukan.' });
    }

    const sql = "SELECT * FROM user WHERE token = ?";
    db.query(sql, [token], (err, result) => {
        if (err) return res.status(500).json({ message: 'Terjadi kesalahan server.' });

        if (result.length === 0) {
            return res.status(400).json({ message: 'Invalid Verification Token' });
        }

        const sqlUpdate = "UPDATE user SET token = NULL WHERE token = ?";
        db.query(sqlUpdate, [token], (err) => {
            if (err) return res.status(500).json({ message: 'Terjadi kesalahan server.' });
            res.status(200).json({ message: 'Email Verified Successfully' });
        });
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Tidak ada file yang diupload.' });
    }
    res.status(200).json({
        message: 'Upload berhasil!',
        filename: req.file.filename
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});