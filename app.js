let isRegisteredToday = false;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      checkLocation(userLocation);
    });
  } else {
    alert("Geolocation not supported by this browser.");
  }
}

function checkLocation(userLocation) {
  const targetLocation = { lat: -6.908275, lng: 107.616378 }; // Koordinat lokasi target
  const distance = getDistance(userLocation, targetLocation);
  
  if (distance > 500) {
    document.getElementById('message').innerHTML = "Anda terlalu jauh dari lokasi yang diperbolehkan (500 meter).";
    return;
  }

  checkIfAlreadyRegistered();
}

function getDistance(loc1, loc2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // in meters
  return distance;
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function checkIfAlreadyRegistered() {
  const selectedName = document.getElementById('namaDropdown').value;
  if (!selectedName) {
    alert("Pilih nama terlebih dahulu.");
    return;
  }

  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // yyyy-mm-dd

  const lastRegistrationDate = localStorage.getItem("lastRegistrationDate");
  const lastRegistrationName = localStorage.getItem("lastRegistrationName");

  if (lastRegistrationDate === dateString && lastRegistrationName === selectedName) {
    document.getElementById('message').innerHTML = "Anda sudah mendaftar hari ini.";
    return;
  }

  localStorage.setItem("lastRegistrationDate", dateString);
  localStorage.setItem("lastRegistrationName", selectedName);
  registerToGoogleSheets(selectedName);
}

function registerToGoogleSheets(name) {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0]; // yyyy-mm-dd
  const timeString = today.toTimeString().split(' ')[0]; // hh:mm:ss

  const requestData = {
    name: name,
    date: dateString,
    time: timeString
  };

  // Kirim data ke Google Apps Script (Google Sheets)
  fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
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
}

document.getElementById('submitButton').addEventListener('click', initMap);
