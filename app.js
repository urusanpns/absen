document.getElementById('submitButton').addEventListener('click', function() {
  const selectedName = document.getElementById('namaDropdown').value;

  if (!selectedName) {
    alert("Pilih nama terlebih dahulu.");
    return;
  }

  // Ambil tanggal dan waktu saat ini
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // yyyy-mm-dd
  const timeString = today.toTimeString().split(' ')[0]; // hh:mm:ss

  // Siapkan data yang akan dikirim
  const requestData = {
    name: selectedName,
    date: dateString,
    time: timeString
  };

  // URL Google Apps Script Web App Anda
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzQsq-L0c89VipnDPgwDT8ZdGgJOeMuL6XE0ThjV2gFUGnrAttOmN7RoDyUnefGvtGHVg/exec'; // Ganti dengan URL script Anda

  // Kirim data ke Google Apps Script (Google Sheets)
  fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  }).then(response => response.json())
    .then(data => {
      document.getElementById('message').innerHTML = "Pendaftaran berhasil!";
    })
    .catch(error => {
      document.getElementById('message').innerHTML = "Terjadi kesalahan. Coba lagi.";
    });
});
