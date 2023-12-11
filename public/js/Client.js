console.log("Client.js 加载成功");

document.addEventListener('DOMContentLoaded', function () {
    fetchLatestUpload();
});

function fetchLatestUpload() {
    fetch('/api/latest-upload')
      .then(response => {
        return response.json();
      })
      .then(data => {
        displayUpload(data);
      })
      .catch(error => {
        console.error('Error fetching latest upload:', error);
      });
  }
  
  function displayUpload(data) {
    const table = document.querySelector('table');
  
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const row = table.insertRow(i + 1); // Insert a new row for each record
  
        const pictureCell = row.insertCell(0);
        const animalCell = row.insertCell(1);
        const sizeCell = row.insertCell(2);
        const colorCell = row.insertCell(3);
        const cityCell = row.insertCell(4);
        const detailCell = row.insertCell(5);
        const zipcodeCell = row.insertCell(6);
  
        // Populate the cells with data from the records
        pictureCell.innerHTML = `<img src="${data[i].picture}" alt="Uploaded Picture" style="width: 30%;">`;
        animalCell.textContent = data[i].animal;
        sizeCell.textContent = data[i].size;
        colorCell.textContent = data[i].color;
        cityCell.textContent = data[i].city;
        detailCell.textContent = data[i].detail;
        zipcodeCell.textContent = data[i].zipcode;
      }
    }
  }
  