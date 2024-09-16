addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') || getRandomCountry()
    let address, name, gender, phone
  
    for (let i = 0; i < 10; i++) {
      const location = getRandomLocationInCountry(country)
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`
  
      const response = await fetch(apiUrl, {
        headers: { 'User-Agent': 'Cloudflare Worker' }
      })
      const data = await response.json()
  
      if (data && data.address && data.address.road && (data.address.city || data.address.town)) {
        address = formatAddress(data.address, country)
        break
      }
    }
  
    if (!address) {
      return new Response('Failed to retrieve detailed address', { status: 500 })
    }
  
    const userData = await fetch(`https://randomuser.me/api/?nat=${country.toLowerCase()}`)
    const userJson = await userData.json()
    if (userJson && userJson.results && userJson.results.length > 0) {
      const user = userJson.results[0]
      name = `${user.name.first} ${user.name.last}`
      gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
      phone = getRandomPhoneNumber(country)
    } else {
      name = "Unknown"
      gender = "Unknown"
      phone = getRandomPhoneNumber(country)
    }
  
    const html = generateHTML(name, gender, phone, address, country)
    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    })
  }
  
  function getRandomLocationInCountry(country) {
    const countryCoordinates = {
      "US": [{ lat: 37.7749, lng: -122.4194 }, { lat: 34.0522, lng: -118.2437 }],
      "UK": [{ lat: 51.5074, lng: -0.1278 }, { lat: 53.4808, lng: -2.2426 }],
      "FR": [{ lat: 48.8566, lng: 2.3522 }, { lat: 45.7640, lng: 4.8357 }],
      "DE": [{ lat: 52.5200, lng: 13.4050 }, { lat: 48.1351, lng: 11.5820 }],
      "CN": [{ lat: 39.9042, lng: 116.4074 }, { lat: 31.2304, lng: 121.4737 }],
      "JP": [{ lat: 35.6895, lng: 139.6917 }, { lat: 34.6937, lng: 135.5023 }],
      "IN": [{ lat: 28.6139, lng: 77.2090 }, { lat: 19.0760, lng: 72.8777 }],
      "AU": [{ lat: -33.8688, lng: 151.2093 }, { lat: -37.8136, lng: 144.9631 }],
      "BR": [{ lat: -23.5505, lng: -46.6333 }, { lat: -22.9068, lng: -43.1729 }],
      "CA": [{ lat: 43.651070, lng: -79.347015 }, { lat: 45.501690, lng: -73.567253 }],
      "RU": [{ lat: 55.7558, lng: 37.6173 }, { lat: 59.9343, lng: 30.3351 }],
      "ZA": [{ lat: -33.9249, lng: 18.4241 }, { lat: -26.2041, lng: 28.0473 }],
      "MX": [{ lat: 19.4326, lng: -99.1332 }, { lat: 20.6597, lng: -103.3496 }],
      "KR": [{ lat: 37.5665, lng: 126.9780 }, { lat: 35.1796, lng: 129.0756 }],
      "IT": [{ lat: 41.9028, lng: 12.4964 }, { lat: 45.4642, lng: 9.1900 }],
      "ES": [{ lat: 40.4168, lng: -3.7038 }, { lat: 41.3851, lng: 2.1734 }],
      "TR": [{ lat: 41.0082, lng: 28.9784 }, { lat: 39.9334, lng: 32.8597 }],
      "SA": [{ lat: 24.7136, lng: 46.6753 }, { lat: 21.3891, lng: 39.8579 }],
      "AR": [{ lat: -34.6037, lng: -58.3816 }, { lat: -31.4201, lng: -64.1888 }],
      "EG": [{ lat: 30.0444, lng: 31.2357 }, { lat: 31.2156, lng: 29.9553 }],
      "NG": [{ lat: 6.5244, lng: 3.3792 }, { lat: 9.0579, lng: 7.4951 }],
      "ID": [{ lat: -6.2088, lng: 106.8456 }, { lat: -7.7956, lng: 110.3695 }]
    }
    const coordsArray = countryCoordinates[country]
    const randomCity = coordsArray[Math.floor(Math.random() * coordsArray.length)]
    const lat = randomCity.lat + (Math.random() - 0.5) * 0.1
    const lng = randomCity.lng + (Math.random() - 0.5) * 0.1
    return { lat, lng }
  }
  
  function formatAddress(address, country) {
    return `${address.house_number || ''} ${address.road}, ${address.city || address.town}, ${address.postcode || ''}, ${country}`
  }
  
  function getRandomPhoneNumber(country) {
    const phoneFormats = {
      "US": () => `+1 (${randomDigits(3)}) ${randomDigits(3)}-${randomDigits(4)}`,
      "UK": () => `+44 ${randomDigits(4)} ${randomDigits(6)}`,
      "FR": () => `+33 ${randomDigits(1)} ${randomDigits(8)}`,
      "DE": () => `+49 ${randomDigits(3)} ${randomDigits(7)}`,
      "CN": () => `+86 ${randomDigits(3)} ${randomDigits(8)}`,
      "JP": () => `+81 ${randomDigits(2)} ${randomDigits(8)}`,
      "IN": () => `+91 ${randomDigits(3)} ${randomDigits(7)}`,
      "AU": () => `+61 ${randomDigits(1)} ${randomDigits(8)}`,
      "BR": () => `+55 ${randomDigits(2)} ${randomDigits(8)}`,
      "CA": () => `+1 (${randomDigits(3)}) ${randomDigits(3)}-${randomDigits(4)}`,
      "RU": () => `+7 ${randomDigits(3)} ${randomDigits(7)}`,
      "ZA": () => `+27 ${randomDigits(2)} ${randomDigits(7)}`,
      "MX": () => `+52 ${randomDigits(2)} ${randomDigits(8)}`,
      "KR": () => `+82 ${randomDigits(2)} ${randomDigits(8)}`,
      "IT": () => `+39 ${randomDigits(2)} ${randomDigits(8)}`,
      "ES": () => `+34 ${randomDigits(2)} ${randomDigits(8)}`,
      "TR": () => `+90 ${randomDigits(3)} ${randomDigits(7)}`,
      "SA": () => `+966 ${randomDigits(2)} ${randomDigits(7)}`,
      "AR": () => `+54 ${randomDigits(2)} ${randomDigits(8)}`,
      "EG": () => `+20 ${randomDigits(2)} ${randomDigits(8)}`,
      "NG": () => `+234 ${randomDigits(2)} ${randomDigits(8)}`,
      "ID": () => `+62 ${randomDigits(2)} ${randomDigits(8)}`
    }
    return phoneFormats[country]()
  }
  
  function randomDigits(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
  }
  
  function getRandomCountry() {
    const countries = ["US", "UK", "FR", "DE", "CN", "JP", "IN", "AU", "BR", "CA", "RU", "ZA", "MX", "KR", "IT", "ES", "TR", "SA", "AR", "EG", "NG", "ID"]
    return countries[Math.floor(Math.random() * countries.length)]
  }
  
  function generateHTML(name, gender, phone, address, country) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Real Address Generator</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f0f0f0;
          margin: 0;
        }
        .container {
          text-align: center;
          background: white;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 600px;
          margin: 20px;
          box-sizing: border-box;
          position: relative;
        }
        .name, .gender, .phone, .address {
          font-size: 1.5em;
          margin-bottom: 10px;
          cursor: pointer;
        }
        .refresh-btn {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        .refresh-btn:hover {
          background-color: #0056b3;
        }
        .country-select {
          margin-bottom: 20px;
        }
        .map {
          width: 100%;
          height: 400px;
          border: 0;
        }
        .title {
          font-size: 2em;
          margin: 20px 0;
        }
        .subtitle {
          font-size: 1.5em;
          margin-bottom: 20px;
        }
        .footer {
          margin-top: auto;
          padding: 10px 0;
          background-color: #f0f0f0;
          width: 100%;
          text-align: center;
          font-size: 0.9em;
        }
        .footer a {
          color: #007bff;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
        .copied {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #28a745;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          display: none;
        }
        .subtitle-small {
          font-size: 1.2em;
          margin-bottom: 20px;
        }    
      </style>
    </head>
    <body>
      <div class="title">Real Address Generator</div>
      <div class="subtitle">真实地址生成器</div>
      <div class="subtitle-small">Click to copy information（点击即可复制信息）</div>
      <div class="container">
        <div class="copied" id="copied">Copied!</div>
        <div class="name" onclick="copyToClipboard('${name}')">${name}</div>
        <div class="gender" onclick="copyToClipboard('${gender}')">${gender}</div>
        <div class="phone" onclick="copyToClipboard('${phone.replace(/[()\s-]/g, '')}')">${phone}</div>
        <div class="address" onclick="copyToClipboard('${address}')">${address}</div>
        <button class="refresh-btn" onclick="window.location.reload();">Get Another Address 获取新地址</button>
        <div class="country-select">
          <label for="country">Select country, new address will be generated automatically after checking the box</label><br>
          <span>选择国家，在勾选后将自动生成新地址</span>
          <select id="country" onchange="changeCountry(this.value)">
            ${getCountryOptions(country)}
          </select>
        </div>
        <iframe class="map" src="https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed"></iframe>
      </div>
      <div class="footer">
        Original version by chatgpt.org.uk, modified by Adonis142857 ｜ <a href="https://github.com/Adonis142857/Real-Address-Generator" target="_blank"><img src="https://pic.imgdb.cn/item/66e7ab36d9c307b7e9cefd24.png" alt="GitHub" style="width: 20px; height: 20px; vertical-align: middle; position: relative; top: -3px;"></a>
      </div>
      <script>
        function copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
            const copied = document.getElementById('copied')
            copied.style.display = 'block'
            setTimeout(() => {
              copied.style.display = 'none'
            }, 2000)
          })
        }
        function changeCountry(country) {
          window.location.href = \`?country=\${country}\`
        }
      </script>
    </body>
    </html>
    `
  }
  
  function getCountryOptions(selectedCountry) {
    const countries = [
      { name: "United States 美国", code: "US" },
      { name: "United Kingdom 英国", code: "UK" },
      { name: "France 法国", code: "FR" },
      { name: "Germany 德国", code: "DE" },
      { name: "China 中国", code: "CN" },
      { name: "Japan 日本", code: "JP" },
      { name: "India 印度", code: "IN" },
      { name: "Australia 澳大利亚", code: "AU" },
      { name: "Brazil 巴西", code: "BR" },
      { name: "Canada 加拿大", code: "CA" },
      { name: "Russia 俄罗斯", code: "RU" },
      { name: "South Africa 南非", code: "ZA" },
      { name: "Mexico 墨西哥", code: "MX" },
      { name: "South Korea 韩国", code: "KR" },
      { name: "Italy 意大利", code: "IT" },
      { name: "Spain 西班牙", code: "ES" },
      { name: "Turkey 土耳其", code: "TR" },
      { name: "Saudi Arabia 沙特阿拉伯", code: "SA" },
      { name: "Argentina 阿根廷", code: "AR" },
      { name: "Egypt 埃及", code: "EG" },
      { name: "Nigeria 尼日利亚", code: "NG" },
      { name: "Indonesia 印度尼西亚", code: "ID" }
    ]
    return countries.map(({ name, code }) => `<option value="${code}" ${code === selectedCountry ? 'selected' : ''}>${name}</option>`).join('')
  }
  