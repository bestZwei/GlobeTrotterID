export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const country = url.searchParams.get('country') || getRandomCountry();
  
    let address, name, gender, phone;
  
    for (let i = 0; i < 20; i++) {
      const location = getRandomLocationInCountry(country);
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`;
  
      const response = await fetch(apiUrl, {
        headers: { 'User-Agent': 'GlobeTrotterID' }
      });
      const data = await response.json();
  
      if (data && data.address && data.address.road && data.address.city) {
        address = formatAddress(data.address, country);
        break;
      }
    }
  
    if (!address) {
      return new Response('Failed to retrieve detailed address', { status: 500 });
    }
  
    const userData = await fetch('https://randomuser.me/api/');
    const userJson = await userData.json();
    if (userJson && userJson.results && userJson.results.length > 0) {
      const user = userJson.results[0];
      name = `${user.name.first} ${user.name.last}`;
      gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
      phone = user.phone;
    } else {
      name = "Unknown";
      gender = "Unknown";
      phone = "Unknown";
    }
  
    return new Response(JSON.stringify({ address, name, gender, phone }), {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    });
  }
  
  function getRandomLocationInCountry(country) {
    return { lat: Math.random() * 180 - 90, lng: Math.random() * 360 - 180 };
  }
  
  function formatAddress(address, country) {
    return `${address.road}, ${address.city}, ${country}`;
  }
  
  function getRandomCountry() {
    const countries = ["USA", "Canada", "Germany", "France", "Australia"];
    return countries[Math.floor(Math.random() * countries.length)];
  }
  