# 🎬 Cinemania

Aplikasi manajemen film dan series berbasis web yang dibangun menggunakan **React**, **Node.js**, **Express**, dan **MySQL**.

---

## 📋 Deskripsi

Cinemania adalah web application full-stack yang memungkinkan pengguna untuk mengelola koleksi film dan series. Aplikasi ini dilengkapi dengan sistem autentikasi, verifikasi email, dan berbagai fitur pencarian data.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express |
| Database | MySQL |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Email | Nodemailer |
| Upload | Multer |

---

## ✨ Fitur

- ✅ Register & Login dengan enkripsi password (bcrypt)
- ✅ Autentikasi berbasis JWT Token
- ✅ Middleware proteksi endpoint
- ✅ Verifikasi email setelah registrasi (Nodemailer + UUID)
- ✅ CRUD Film (Create, Read, Update, Delete)
- ✅ Multi-genre per film
- ✅ Upload poster film (Multer)
- ✅ Query Params: Filter by genre, Search by judul, Sort by field
- ✅ Responsive dark cinema UI

---

## 📁 Struktur Proyek

```
Tugas 9/
├── cinemania/                  # Frontend React
│   ├── src/
│   │   ├── App.js              # Komponen utama
│   │   └── index.js
│   └── package.json
├── uploads/                    # Folder penyimpanan gambar
├── db.js                       # Koneksi database MySQL
├── index.js                    # Server Express + semua endpoint
├── package.json
└── README.md
```

---

## ⚙️ Cara Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/muhabkasa/mission11_advance-backend-1.git
cd mission11_advance-backend-1
```

### 2. Setup Database
- Buka phpMyAdmin
- Buat database baru bernama `movie_app`
- Import atau jalankan SQL berikut:

```sql
CREATE TABLE Series_Film (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    tahun_rilis YEAR,
    image VARCHAR(255)
);

CREATE TABLE Genre (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_genre VARCHAR(50) NOT NULL
);

CREATE TABLE Series_Genre (
    id_series INT,
    id_genre INT,
    PRIMARY KEY (id_series, id_genre),
    FOREIGN KEY (id_series) REFERENCES Series_Film(id),
    FOREIGN KEY (id_genre) REFERENCES Genre(id)
);

CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    token VARCHAR(255) DEFAULT NULL
);
```

### 3. Konfigurasi Environment
Edit file `db.js` sesuai konfigurasi MySQL lokal:
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',         // sesuaikan
    database: 'movie_app',
    port: 3306
});
```

Edit konfigurasi email di `index.js`:
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'EMAIL_KAMU@gmail.com',
        pass: 'APP_PASSWORD_GMAIL'
    }
});
```

### 4. Install & Jalankan Backend
```bash
# Di folder root (Tugas 9)
npm install
node index.js
```
Server berjalan di: `http://localhost:3000`

### 5. Install & Jalankan Frontend
```bash
cd cinemania
npm install
npm start
```
Aplikasi berjalan di: `http://localhost:3001`

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/register` | Registrasi user baru + kirim email verifikasi | ❌ |
| POST | `/login` | Login & mendapatkan JWT token | ❌ |
| GET | `/verify-email?token=` | Verifikasi token dari email | ❌ |
| GET | `/movies` | Ambil semua film (support filter, sort, search) | ✅ |
| POST | `/movies` | Tambah film baru + multi genre | ❌ |
| PUT | `/movies/:id` | Update data film | ❌ |
| DELETE | `/movies/:id` | Hapus film | ❌ |
| POST | `/upload` | Upload gambar | ❌ |

### Query Params untuk GET /movies

```
GET /movies?genre=Action           → filter by genre
GET /movies?search=star            → search by judul
GET /movies?sortBy=judul           → sort A-Z by judul
GET /movies?sortBy=tahun_rilis     → sort by tahun
GET /movies?genre=Action&search=res&sortBy=judul  → kombinasi
```

---

## 📦 Dependencies

### Backend
```json
"bcrypt": "^5.x",
"cors": "^2.8.x",
"express": "^5.x",
"jsonwebtoken": "^9.x",
"multer": "^2.x",
"mysql2": "^3.x",
"nodemailer": "^6.x",
"uuid": "^9.x"
```

### Frontend
```json
"axios": "^1.x",
"react": "^18.x"
```

---

## 👤 Author

**Muhammad Abdul Karim Satha**
Bootcamp Full Stack Web Developer - Harisenin.com

---

## 📄 License

Project ini dibuat untuk keperluan tugas akhir bootcamp.