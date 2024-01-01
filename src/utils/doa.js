const axios = require('axios');

// Fungsi untuk mendapatkan daftar Doa
async function getDoaList() {
  try {
    // Mendapatkan data Doa dari API
    const response = await axios.get('https://doa-doa-api-ahmadramadhan.fly.dev/api');
    // Mengembalikan data Doa
    return response.data;
  } catch (error) {
    // Menangani kesalahan saat mengambil data Doa
    console.error('Error saat mengambil data Doa:', error.message);
    throw error;
  }
}

// Mengekspor fungsi agar dapat digunakan di modul lain
module.exports = {
  getDoaList,
};
