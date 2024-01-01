const axios = require('axios');

// Fungsi untuk mendapatkan berita
async function getBerita() {
  try {
    // Mendapatkan data berita dari API
    const response = await axios.get('https://api-berita-indonesia.vercel.app/republika/islam/');
    // Mengembalikan data berita
    return response.data.data.posts;
  } catch (error) {
    // Menangani kesalahan saat mengambil data berita
    console.error('Error saat mengambil data Berita Islam:', error.message);
    throw error;
  }
}

// Mengekspor fungsi agar dapat digunakan di modul lain
module.exports = {
  getBerita,
};
