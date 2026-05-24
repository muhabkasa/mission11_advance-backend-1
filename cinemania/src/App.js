import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

const theme = {
  bg: '#0a0a0f',
  surface: '#12121a',
  surfaceHover: '#1a1a26',
  border: '#1e1e2e',
  accent: '#e63946',
  accentHover: '#ff4757',
  accentGlow: 'rgba(230, 57, 70, 0.25)',
  gold: '#f4a261',
  text: '#e8e8f0',
  textMuted: '#6b6b8a',
  textDim: '#3a3a5c',
  glass: 'rgba(255,255,255,0.03)',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  /* ── AUTH ── */
  .auth-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(230,57,70,0.18) 0%, transparent 70%),
      ${theme.bg};
    padding: 24px;
  }

  .auth-card {
    width: 100%;
    max-width: 400px;
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 20px;
    padding: 40px 36px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  }

  .auth-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.6rem;
    letter-spacing: 3px;
    color: ${theme.text};
    text-align: center;
    margin-bottom: 6px;
  }

  .auth-logo span { color: ${theme.accent}; }

  .auth-sub {
    text-align: center;
    color: ${theme.textMuted};
    font-size: 0.82rem;
    margin-bottom: 28px;
    letter-spacing: 0.5px;
  }

  .tab-bar {
    display: flex;
    background: ${theme.bg};
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 24px;
  }

  .tab-btn {
    flex: 1;
    padding: 9px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: ${theme.textMuted};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-btn.active {
    background: ${theme.accent};
    color: #fff;
    box-shadow: 0 4px 16px ${theme.accentGlow};
  }

  .field {
    margin-bottom: 14px;
  }

  .field input {
    width: 100%;
    background: ${theme.bg};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 12px 16px;
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field input:focus {
    border-color: ${theme.accent};
    box-shadow: 0 0 0 3px ${theme.accentGlow};
  }

  .field input::placeholder { color: ${theme.textDim}; }

  .btn-primary-red {
    width: 100%;
    padding: 13px;
    background: ${theme.accent};
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    letter-spacing: 0.3px;
  }

  .btn-primary-red:hover {
    background: ${theme.accentHover};
    box-shadow: 0 6px 24px ${theme.accentGlow};
    transform: translateY(-1px);
  }

  .auth-error {
    background: rgba(230,57,70,0.12);
    border: 1px solid rgba(230,57,70,0.3);
    color: #ff6b7a;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 0.84rem;
    margin-bottom: 14px;
    text-align: center;
  }

  /* ── NAVBAR ── */
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid ${theme.border};
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 3px;
    color: ${theme.text};
  }

  .nav-logo span { color: ${theme.accent}; }

  .nav-actions { display: flex; gap: 10px; align-items: center; }

  .btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: ${theme.accent};
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
  }

  .btn-add:hover {
    background: ${theme.accentHover};
    box-shadow: 0 4px 16px ${theme.accentGlow};
  }

  .btn-logout {
    padding: 9px 16px;
    background: transparent;
    color: ${theme.textMuted};
    border: 1px solid ${theme.border};
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-logout:hover { color: ${theme.accent}; border-color: ${theme.accent}; }

  /* ── SEARCH & FILTER BAR ── */
  .filter-bar {
    padding: 20px 32px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-wrap {
    flex: 1;
    min-width: 200px;
    position: relative;
  }

  .search-wrap input {
    width: 100%;
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 10px 16px 10px 40px;
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .search-wrap input:focus {
    border-color: ${theme.accent};
    box-shadow: 0 0 0 3px ${theme.accentGlow};
  }

  .search-wrap input::placeholder { color: ${theme.textDim}; }

  .search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.textMuted};
    font-size: 0.9rem;
    pointer-events: none;
  }

  .filter-select {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 10px;
    padding: 10px 14px;
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
    min-width: 150px;
  }

  .filter-select:focus { border-color: ${theme.accent}; }
  .filter-select option { background: ${theme.surface}; }

  .result-count {
    color: ${theme.textMuted};
    font-size: 0.82rem;
    white-space: nowrap;
  }

  .result-count span { color: ${theme.accent}; font-weight: 500; }

  /* ── MAIN GRID ── */
  .main { padding: 0 32px 48px; }

  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  /* ── MOVIE CARD ── */
  .movie-card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
    cursor: pointer;
    position: relative;
  }

  .movie-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(230,57,70,0.2);
    border-color: rgba(230,57,70,0.3);
  }

  .movie-card:hover .card-actions { opacity: 1; transform: translateY(0); }

  .card-poster {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    display: block;
    background: ${theme.bg};
  }

  .card-body {
    padding: 14px;
  }

  .card-title {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.95rem;
    color: ${theme.text};
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-genre {
    font-size: 0.75rem;
    color: ${theme.textMuted};
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-year {
    font-size: 0.75rem;
    color: ${theme.textDim};
    font-weight: 300;
  }

  .card-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 6px;
    padding: 10px;
    background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 100%);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.25s, transform 0.25s;
    padding-top: 40px;
  }

  .action-btn {
    flex: 1;
    padding: 7px 4px;
    border: none;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .action-detail { background: rgba(255,255,255,0.08); color: ${theme.text}; }
  .action-detail:hover { background: rgba(255,255,255,0.15); }
  .action-edit { background: rgba(244,162,97,0.15); color: ${theme.gold}; }
  .action-edit:hover { background: rgba(244,162,97,0.3); }
  .action-delete { background: rgba(230,57,70,0.15); color: ${theme.accent}; }
  .action-delete:hover { background: rgba(230,57,70,0.3); }

  /* ── EMPTY STATE ── */
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: ${theme.textMuted};
  }

  .empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.4; }
  .empty-title { font-size: 1.1rem; margin-bottom: 8px; }
  .empty-sub { font-size: 0.85rem; color: ${theme.textDim}; }

  /* ── LOADING ── */
  .loading-wrap {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
    padding: 80px;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid ${theme.border};
    border-top-color: ${theme.accent};
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .modal-box {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 18px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.7);
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px 0;
  }

  .modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 1.5px;
    color: ${theme.text};
  }

  .modal-close {
    background: ${theme.bg};
    border: 1px solid ${theme.border};
    color: ${theme.textMuted};
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .modal-close:hover { color: ${theme.accent}; border-color: ${theme.accent}; }

  .modal-body { padding: 20px 24px 24px; }

  .modal-field { margin-bottom: 14px; }

  .modal-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 500;
    color: ${theme.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
  }

  .modal-input {
    width: 100%;
    background: ${theme.bg};
    border: 1px solid ${theme.border};
    border-radius: 9px;
    padding: 11px 14px;
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .modal-input:focus {
    border-color: ${theme.accent};
    box-shadow: 0 0 0 3px ${theme.accentGlow};
  }

  .modal-input::placeholder { color: ${theme.textDim}; }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .btn-cancel {
    padding: 10px 18px;
    background: transparent;
    border: 1px solid ${theme.border};
    border-radius: 9px;
    color: ${theme.textMuted};
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-cancel:hover { border-color: ${theme.textMuted}; color: ${theme.text}; }

  .btn-save {
    padding: 10px 22px;
    background: ${theme.accent};
    border: none;
    border-radius: 9px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
  }

  .btn-save:hover {
    background: ${theme.accentHover};
    box-shadow: 0 4px 16px ${theme.accentGlow};
  }

  /* ── DETAIL MODAL ── */
  .detail-poster {
    width: 100%;
    max-height: 320px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 16px;
  }

  .detail-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 1px;
    color: ${theme.text};
    margin-bottom: 8px;
  }

  .detail-badge {
    display: inline-block;
    background: rgba(230,57,70,0.15);
    color: ${theme.accent};
    border: 1px solid rgba(230,57,70,0.3);
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 0.78rem;
    margin: 3px 3px 3px 0;
  }

  .detail-year {
    color: ${theme.gold};
    font-size: 0.9rem;
    margin-top: 8px;
  }

  @media (max-width: 640px) {
    .navbar { padding: 0 16px; }
    .filter-bar { padding: 16px; }
    .main { padding: 0 16px 40px; }
    .movies-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
  }
`;

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortBy, setSortBy] = useState('');

  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ fullname: '', username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => { if (token) fetchMovies(); }, [token, search, filterGenre, sortBy]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterGenre) params.genre = filterGenre;
      if (sortBy) params.sortBy = sortBy;
      const res = await axios.get(`${API}/movies`, {
        headers: { authorization: token },
        params
      });
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        const res = await axios.post(`${API}/login`, { email: authData.email, password: authData.password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      } else {
        await axios.post(`${API}/register`, authData);
        alert('Registrasi berhasil! Cek email untuk verifikasi, lalu login.');
        setAuthMode('login');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Terjadi kesalahan.');
    }
  };

  const handleLogout = () => { localStorage.removeItem('token'); setToken(null); setMovies([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('year', year);
    if (image) formData.append('image', image);
    try {
      if (editId) {
        await axios.put(`${API}/movies/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post(`${API}/movies`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      resetForm();
      fetchMovies();
    } catch { alert("Terjadi kesalahan."); }
  };

  const handleEditClick = (movie) => {
    setTitle(movie.judul); setGenre(movie.genre); setYear(movie.tahun_rilis);
    setEditId(movie.id); setImage(null); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus film ini?")) return;
    await axios.delete(`${API}/movies/${id}`);
    fetchMovies();
  };

  const resetForm = () => {
    setShowForm(false); setTitle(''); setGenre(''); setYear('');
    setImage(null); setEditId(null);
  };

  if (!token) return (
    <>
      <style>{css}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">CINE<span>MANIA</span></div>
          <div className="auth-sub">Your personal movie universe</div>
          <div className="tab-bar">
            <button className={`tab-btn ${authMode === 'login' ? 'active' : ''}`} onClick={() => { setAuthMode('login'); setAuthError(''); }}>Login</button>
            <button className={`tab-btn ${authMode === 'register' ? 'active' : ''}`} onClick={() => { setAuthMode('register'); setAuthError(''); }}>Register</button>
          </div>
          {authError && <div className="auth-error">{authError}</div>}
          <form onSubmit={handleAuth}>
            {authMode === 'register' && <>
              <div className="field"><input type="text" placeholder="Nama Lengkap" value={authData.fullname} onChange={e => setAuthData({ ...authData, fullname: e.target.value })} required /></div>
              <div className="field"><input type="text" placeholder="Username" value={authData.username} onChange={e => setAuthData({ ...authData, username: e.target.value })} required /></div>
            </>}
            <div className="field"><input type="email" placeholder="Email" value={authData.email} onChange={e => setAuthData({ ...authData, email: e.target.value })} required /></div>
            <div className="field"><input type="password" placeholder="Password" value={authData.password} onChange={e => setAuthData({ ...authData, password: e.target.value })} required /></div>
            <button type="submit" className="btn-primary-red">{authMode === 'login' ? 'Masuk' : 'Buat Akun'}</button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">CINE<span>MANIA</span></div>
        <div className="nav-actions">
          <button className="btn-add" onClick={() => setShowForm(true)}>＋ Tambah Film</button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Cari judul film..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filterGenre} onChange={e => setFilterGenre(e.target.value)}>
          <option value="">Semua Genre</option>
          <option value="Action">Action</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Horror">Horror</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Animation">Animation</option>
          <option value="Adventure">Adventure</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Family">Family</option>
          <option value="Thriller">Thriller</option>
        </select>
        <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">Urutan Default</option>
          <option value="judul">A–Z Judul</option>
          <option value="tahun_rilis">Tahun Rilis</option>
        </select>
        <div className="result-count"><span>{movies.length}</span> film ditemukan</div>
      </div>

      {/* Grid */}
      <main className="main">
        <div className="movies-grid">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : movies.length > 0 ? movies.map(movie => (
            <div className="movie-card" key={movie.id}>
              <img
                className="card-poster"
                src={movie.image ? `${API}/uploads/${movie.image}` : `https://via.placeholder.com/300x450/12121a/3a3a5c?text=No+Poster`}
                alt={movie.judul}
              />
              <div className="card-body">
                <div className="card-title">{movie.judul}</div>
                <div className="card-genre">{movie.genre || '—'}</div>
                <div className="card-year">{movie.tahun_rilis}</div>
              </div>
              <div className="card-actions">
                <button className="action-btn action-detail" onClick={() => setShowDetail(movie)}>Detail</button>
                <button className="action-btn action-edit" onClick={() => handleEditClick(movie)}>Edit</button>
                <button className="action-btn action-delete" onClick={() => handleDelete(movie.id)}>Hapus</button>
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <div className="empty-title">Tidak ada film ditemukan</div>
              <div className="empty-sub">Coba ubah filter atau tambahkan film baru</div>
            </div>
          )}
        </div>
      </main>

      {/* Tambah/Edit */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && resetForm()}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">{editId ? 'Edit Film' : 'Tambah Film'}</div>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="modal-field">
                  <label className="modal-label">Judul Film</label>
                  <input className="modal-input" type="text" placeholder="Contoh: Inception" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Genre</label>
                  <input className="modal-input" type="text" placeholder="Contoh: Action, Drama" value={genre} onChange={e => setGenre(e.target.value)} required />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Tahun Rilis</label>
                  <input className="modal-input" type="number" placeholder="Contoh: 2024" value={year} onChange={e => setYear(e.target.value)} required />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Poster {editId && '(kosongkan jika tidak diganti)'}</label>
                  <input className="modal-input" type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required={!editId} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={resetForm}>Batal</button>
                  <button type="submit" className="btn-save">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Detail */}
      {showDetail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowDetail(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">Detail Film</div>
              <button className="modal-close" onClick={() => setShowDetail(null)}>✕</button>
            </div>
            <div className="modal-body">
              <img
                className="detail-poster"
                src={showDetail.image ? `${API}/uploads/${showDetail.image}` : `https://via.placeholder.com/460x280/12121a/3a3a5c?text=No+Poster`}
                alt={showDetail.judul}
              />
              <div className="detail-title">{showDetail.judul}</div>
              <div>
                {(showDetail.genre || '').split(',').map(g => (
                  <span key={g} className="detail-badge">{g.trim()}</span>
                ))}
              </div>
              <div className="detail-year">📅 {showDetail.tahun_rilis}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}