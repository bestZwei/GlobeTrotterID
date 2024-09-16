document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const generateBtn = document.getElementById('generate-btn');
    const resultTableBody = document.querySelector('#result-table tbody');
    const loadingModal = document.getElementById('loading-modal');
  
    generateBtn.addEventListener('click', generateIdentity);
  
    async function generateIdentity() {
      const country = countrySelect.value;
      let apiUrl = 'https://randomuser.me/api/';
      if (country) {
        apiUrl += `?nat=${country.toLowerCase()}`;
      }
  
      showLoadingModal();
  
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const user = data.results[0];
      
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td class="text-center"><img src="${user.picture.thumbnail}" alt="User Picture"></td>
          <td>${user.name.first} ${user.name.last}</td>
          <td>${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.cell}</td>
          <td>${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country} ${user.location.postcode}</td>
          <td>${user.nat}</td>
        `;
  
        // Insert new row at the top
        resultTableBody.insertBefore(newRow, resultTableBody.firstChild);
      } catch (error) {
        alert("Error fetching data. Please try again later.");
        console.error(error);
      } finally {
        hideLoadingModal();
      }
    }
  
    function showLoadingModal() {
      loadingModal.classList.remove('hidden');
    }
  
    function hideLoadingModal() {
      loadingModal.classList.add('hidden');
    }
  });
  