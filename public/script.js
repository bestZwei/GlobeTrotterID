document.getElementById('generate-btn').addEventListener('click', generateIdentity);

async function generateIdentity() {
  const country = document.getElementById('country-select').value;
  const response = await fetch(`/api?country=${country}`);
  const data = await response.json();

  document.getElementById('name').textContent = `Name: ${data.name}`;
  document.getElementById('gender').textContent = `Gender: ${data.gender}`;
  document.getElementById('phone').textContent = `Phone: ${data.phone}`;
  document.getElementById('address').textContent = `Address: ${data.address}`;
}

// Initial load
generateIdentity();
