
//  DOMContentLoaded memastikan bahwa JavaScript dijalankan setelah HTML sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', function () {
  console.log('App.js dimuat dengan sukses.');
});

function showNotification(message, type) {
  const notificationDiv = document.getElementById('notification');
  notificationDiv.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-3">
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      <strong>${type === 'success' ? 'Berhasil!' : 'Error!'}</strong> ${message}
    </div>
  `;

  // Hapus notifikasi setelah beberapa detik
  setTimeout(() => {
    notificationDiv.innerHTML = '';
  }, 5000);
}

async function submitForm(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/lapor', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      // Tampilkan notifikasi berhasil
      showNotification(result.message, 'success');
      // Reset formulir
      form.reset();
    } else {
      // Tampilkan notifikasi gagal
      showNotification(result.message, 'danger');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('Terjadi kesalahan. Silakan coba lagi.', 'danger');
  }
}
