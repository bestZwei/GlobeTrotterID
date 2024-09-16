document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const generateBtn = document.getElementById('generate-btn');
    const nameDiv = document.getElementById('name');
    const genderDiv = document.getElementById('gender');
    const phoneDiv = document.getElementById('phone');
    const addressDiv = document.getElementById('address');
    const mapIframe = document.getElementById('map');
  
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
    ];
  
    countries.forEach(({ name, code }) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = name;
      countrySelect.appendChild(option);
    });
  
    generateBtn.addEventListener('click', generateIdentity);
  
    async function generateIdentity() {
      const country = countrySelect.value;
      const response = await fetch(`/api?country=${country}`);
      const data = await response.json();
  
      nameDiv.textContent = `Name: ${data.name}`;
      genderDiv.textContent = `Gender: ${data.gender}`;
      phoneDiv.textContent = `Phone: ${data.phone}`;
      addressDiv.textContent = `Address: ${data.address}`;
      mapIframe.src = `https://www.google.com/maps?q=${encodeURIComponent(data.address)}&output=embed`;
    }
  
    nameDiv.addEventListener('click', () => copyToClipboard(nameDiv.textContent.split(': ')[1]));
    genderDiv.addEventListener('click', () => copyToClipboard(genderDiv.textContent.split(': ')[1]));
    phoneDiv.addEventListener('click', () => copyToClipboard(phoneDiv.textContent.split(': ')[1]));
    addressDiv.addEventListener('click', () => copyToClipboard(addressDiv.textContent.split(': ')[1]));
  
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        const copied = document.getElementById('copied');
        copied.style.display = 'block';
        setTimeout(() => {
          copied.style.display = 'none';
        }, 2000);
      });
    }
  
    // Initial load
    generateIdentity();
  });
  