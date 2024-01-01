const axios = require('axios');

// URL API untuk Al-Qur'an
const quranAPI = 'https://equran.id/api/v2/surat';

// Mendapatkan daftar surah
const getSurahList = async () => {
  try {
    const response = await axios.get(quranAPI);
    // Mengembalikan data daftar surah
    return response.data.data;
  } catch (error) {
    // Menangani kesalahan saat mengambil daftar surah
    console.error('Error saat mengambil daftar surah:', error.message);
    throw new Error('Gagal mengambil daftar surah');
  }
};

// Mendapatkan detail surah berdasarkan nomor surah
const getSurahDetail = async (surahNumber) => {
  const surahDetailAPI = `${quranAPI}/${surahNumber}`;

  try {
    const response = await axios.get(surahDetailAPI);
    // Mengembalikan data detail surah
    return response.data.data;
  } catch (error) {
    // Menangani kesalahan saat mengambil detail surah
    console.error('Error saat mengambil detail surah:', error.message);
    throw new Error('Gagal mengambil detail surah');
  }
};

// Mengekspor fungsi agar dapat digunakan di modul lain
module.exports = {
  getSurahList,
  getSurahDetail,
};
