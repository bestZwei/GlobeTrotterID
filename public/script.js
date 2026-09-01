document.addEventListener('DOMContentLoaded', () => {
  const DOMAIN = 'https://globetrotterid.is-an.org/';

  const countrySelect = document.getElementById('country');
  const countInput = document.getElementById('count');
  const generateBtn = document.getElementById('generate-btn');
  const clearBtn = document.getElementById('clear-btn');
  const tableEl = document.getElementById('result-table');
  const emptyState = document.getElementById('empty-state');
  const metaEl = document.getElementById('meta');
  const copyCsvBtn = document.getElementById('copy-csv');
  const downloadCsvBtn = document.getElementById('download-csv');
  const paginationEl = document.getElementById('pagination');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  const toast = document.getElementById('toast');

  // 国家电话区号（mock，真实场景建议接入专业库/API）
  const COUNTRY_CODES = {
    AU: '+61', BR: '+55', CA: '+1', CH: '+41', DE: '+49', DK: '+45',
    ES: '+34', FI: '+358', FR: '+33', GB: '+44', IE: '+353', IN: '+91',
    IR: '+98', MX: '+52', NL: '+31', NO: '+47', NZ: '+64', RS: '+381',
    TR: '+90', UA: '+380', US: '+1'
  };

  const FLAGS = {
    AU: '🇦🇺', BR: '🇧🇷', CA: '🇨🇦', CH: '🇨🇭', DE: '🇩🇪', DK: '🇩🇰',
    ES: '🇪🇸', FI: '🇫🇮', FR: '🇫🇷', GB: '🇬🇧', IE: '🇮🇪', IN: '🇮🇳',
    IR: '🇮🇷', MX: '🇲🇽', NL: '🇳🇱', NO: '🇳🇴', NZ: '🇳🇿', RS: '🇷🇸',
    TR: '🇹🇷', UA: '🇺🇦', US: '🇺🇸'
  };

  const I18N = {
    zh: {
      brand: 'Globetrotter ID 无界行者',
      tagline: '无界行者 · 全球随机身份与地址生成',
      country: '国家',
      count: '数量',
      generate: '生成',
      generating: '生成中…',
      clear: '清空',
      export: '导出',
      copyCsv: '📋 复制 CSV',
      downloadCsv: '💾 下载 CSV',
      empty: '点击「生成」开始创建随机身份 ✨',
      records: '已生成 {n} 条记录',
      prev: '上一页',
      next: '下一页',
      pageInfo: '第 {cur} / {total} 页 · 共 {n} 条',
      avatar: '头像',
      name: '姓名',
      gender: '性别',
      nationality: '国籍',
      email: '邮箱',
      phone: '电话',
      mobile: '手机',
      address: '地址',
      poweredBy: 'Powered by',
      dataSource: '数据来源',
      errorFetch: '获取数据失败，请稍后重试',
      noDataCopy: '暂无数据可复制',
      noDataDownload: '暂无数据可下载',
      copySuccess: 'CSV 已复制到剪贴板',
      copyFail: '复制失败，请尝试下载 CSV',
      downloadStart: 'CSV 下载已开始',
      docTitle: 'Globetrotter ID · 全球随机身份与地址生成器',
      docDesc: 'Globetrotter ID（无界行者）是一个免费的全球随机身份与地址生成器，支持 20+ 国家/地区，一键生成带头像、姓名、邮箱、电话和地址的虚拟身份数据，适用于原型设计、测试与演示。',
      ogDesc: '免费的全球随机身份与地址生成器，支持 20+ 国家/地区，一键生成虚拟身份数据。',
      ogLocale: 'zh_CN',
      countries: {
        random: '随机', AU: '澳大利亚', BR: '巴西', CA: '加拿大', CH: '瑞士', DE: '德国',
        DK: '丹麦', ES: '西班牙', FI: '芬兰', FR: '法国', GB: '英国', IE: '爱尔兰',
        IN: '印度', IR: '伊朗', MX: '墨西哥', NL: '荷兰', NO: '挪威', NZ: '新西兰',
        RS: '塞尔维亚', TR: '土耳其', UA: '乌克兰', US: '美国'
      }
    },
    en: {
      brand: 'Globetrotter ID',
      tagline: 'Globetrotter · Global Random Identity & Address Generator',
      country: 'Country',
      count: 'Count',
      generate: 'Generate',
      generating: 'Generating…',
      clear: 'Clear',
      export: 'Export',
      copyCsv: '📋 Copy CSV',
      downloadCsv: '💾 Download CSV',
      empty: 'Click "Generate" to create random identities ✨',
      records: '{n} records generated',
      prev: 'Prev',
      next: 'Next',
      pageInfo: 'Page {cur} / {total} · {n} records',
      avatar: 'Avatar',
      name: 'Name',
      gender: 'Gender',
      nationality: 'Nationality',
      email: 'Email',
      phone: 'Phone',
      mobile: 'Mobile',
      address: 'Address',
      poweredBy: 'Powered by',
      dataSource: 'Data source',
      errorFetch: 'Failed to fetch data, please try again',
      noDataCopy: 'No data to copy',
      noDataDownload: 'No data to download',
      copySuccess: 'CSV copied to clipboard',
      copyFail: 'Copy failed, try downloading CSV',
      downloadStart: 'CSV download started',
      docTitle: 'Globetrotter ID · Global Random Identity & Address Generator',
      docDesc: 'Globetrotter ID is a free global random identity & address generator supporting 20+ countries/regions. One click to generate mock identities with avatar, name, email, phone and address for prototyping, testing and demos.',
      ogDesc: 'A free global random identity & address generator supporting 20+ countries/regions. Generate mock identities in one click.',
      ogLocale: 'en_US',
      countries: {
        random: 'Random', AU: 'Australia', BR: 'Brazil', CA: 'Canada', CH: 'Switzerland', DE: 'Germany',
        DK: 'Denmark', ES: 'Spain', FI: 'Finland', FR: 'France', GB: 'United Kingdom', IE: 'Ireland',
        IN: 'India', IR: 'Iran', MX: 'Mexico', NL: 'Netherlands', NO: 'Norway', NZ: 'New Zealand',
        RS: 'Serbia', TR: 'Turkey', UA: 'Ukraine', US: 'United States'
      }
    }
  };

  const MAX_COUNT = 20;
  const PAGE_SIZE = 10;
  let totalCount = 0;
  let currentPage = 1;
  let currentLang = 'zh';
  let toastTimer = null;
  const generatedUsers = []; // 最新在前，供导出使用

  generateBtn.addEventListener('click', generateIdentities);
  clearBtn.addEventListener('click', clearResults);
  copyCsvBtn.addEventListener('click', copyCsv);
  downloadCsvBtn.addEventListener('click', downloadCsv);
  prevPageBtn.addEventListener('click', () => changePage(-1));
  nextPageBtn.addEventListener('click', () => changePage(1));
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  // ===== 国际化 =====
  function getI18n() {
    return I18N[currentLang];
  }

  function t(key, vars) {
    let str = getI18n()[key] ?? key;
    if (vars) {
      str = str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`));
    }
    return str;
  }

  function applyLanguage(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    try { localStorage.setItem('gt-lang', lang); } catch (e) { /* ignore */ }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });

    applyHeadMeta();
    updateCountryOptions();
    updateCount();
    renderPage();

    document.querySelectorAll('.lang-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang)
    );
  }

  function applyHeadMeta() {
    const d = getI18n();
    document.title = d.docTitle;
    setMeta('description', d.docDesc);
    setMetaProperty('og:title', d.docTitle);
    setMetaProperty('og:description', d.ogDesc);
    setMetaProperty('og:locale', d.ogLocale);
    setMetaProperty('og:url', DOMAIN);
    setMetaProperty('og:image', DOMAIN + 'og.svg');
    setMetaName('twitter:title', d.docTitle);
    setMetaName('twitter:description', d.ogDesc);
    setMetaName('twitter:image', DOMAIN + 'og.svg');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', DOMAIN);
    updateLdJson(d);
  }

  function setMeta(name, content) {
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute('content', content);
  }

  function setMetaProperty(prop, content) {
    const el = document.querySelector(`meta[property="${prop}"]`);
    if (el) el.setAttribute('content', content);
  }

  function setMetaName(name, content) {
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute('content', content);
  }

  function updateLdJson(d) {
    const el = document.getElementById('ld-json');
    if (!el) return;
    try {
      const data = JSON.parse(el.textContent);
      data.name = 'Globetrotter ID';
      data.alternateName = '无界行者';
      data.description = d.docDesc;
      data.url = DOMAIN;
      data.inLanguage = d.ogLocale;
      el.textContent = JSON.stringify(data);
    } catch (e) {
      console.error(e);
    }
  }

  function updateCountryOptions() {
    const dict = getI18n().countries;
    Array.from(countrySelect.options).forEach(opt => {
      const key = opt.value || 'random';
      opt.textContent = (opt.value ? FLAGS[opt.value] + ' ' : '🌍 ') + dict[key];
    });
  }

  // ===== 生成 =====
  async function generateIdentities() {
    const country = countrySelect.value;
    const requested = clampCount(countInput.value);
    let url = `https://randomuser.me/api/?results=${requested}`;
    if (country) url += `&nat=${country.toLowerCase()}`;

    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error('No results returned');
      }
      data.results.forEach(user => generatedUsers.unshift(user));
      totalCount += data.results.length;
      currentPage = 1; // 新生成跳回第一页查看最新记录
      updateCount();
      renderPage();
    } catch (error) {
      showToast(t('errorFetch'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 每人一张卡片：所有字段以带标签的条目展示
  function buildPerson(user) {
    const tbody = document.createElement('tbody');
    tbody.className = 'person';

    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.className = 'detail';

    const grid = document.createElement('div');
    grid.className = 'detail-grid';

    // 头像（带加载失败兜底）
    const avatarItem = document.createElement('div');
    avatarItem.className = 'detail-item';
    const avatarLabel = document.createElement('span');
    avatarLabel.className = 'detail-label';
    avatarLabel.textContent = t('avatar');
    const avatarValue = document.createElement('span');
    avatarValue.className = 'detail-value';
    const img = document.createElement('img');
    img.className = 'avatar';
    img.src = user.picture.thumbnail;
    img.alt = `${user.name.first} ${user.name.last}`;
    img.loading = 'lazy';
    img.addEventListener('error', () => img.replaceWith(buildFallbackAvatar(user)), { once: true });
    avatarValue.appendChild(img);
    avatarItem.append(avatarLabel, avatarValue);

    grid.append(
      avatarItem,
      detailItem(t('name'), `${user.name.first} ${user.name.last}`),
      detailItem(t('gender'), capitalize(user.gender)),
      detailItem(t('nationality'), user.nat),
      detailItem(t('email'), user.email),
      detailItem(t('phone'), formatPhoneNumber(user.phone, user.nat)),
      detailItem(t('mobile'), formatPhoneNumber(user.cell, user.nat)),
      detailItem(t('address'), formatAddress(user.location), true)
    );

    td.appendChild(grid);
    tr.appendChild(td);
    tbody.append(tr);
    return tbody;
  }

  function detailItem(label, value, full) {
    const item = document.createElement('div');
    item.className = 'detail-item' + (full ? ' detail-item--full' : '');
    const l = document.createElement('span');
    l.className = 'detail-label';
    l.textContent = label;
    const v = document.createElement('span');
    v.className = 'detail-value';
    v.textContent = value ?? '';
    item.append(l, v);
    return item;
  }

  function buildFallbackAvatar(user) {
    const span = document.createElement('span');
    span.className = 'avatar avatar-fallback';
    span.textContent = (user.name.first?.[0] || '?').toUpperCase();
    return span;
  }

  function formatAddress(loc) {
    const parts = [
      loc.street.number,
      loc.street.name,
      loc.city,
      loc.state,
      loc.country,
      loc.postcode
    ];
    return parts
      .filter(p => p !== undefined && p !== null && p !== '')
      .join(', ');
  }

  function formatPhoneNumber(phone, country) {
    const code = COUNTRY_CODES[country];
    return code ? `${code} ${phone}` : phone;
  }

  function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function clampCount(value) {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 1) return 1;
    return Math.min(n, MAX_COUNT);
  }

  function updateCount() {
    metaEl.textContent = t('records', { n: totalCount });
    emptyState.hidden = totalCount > 0;
  }

  function clearResults() {
    Array.from(tableEl.tBodies).forEach(tb => tb.remove());
    generatedUsers.length = 0;
    totalCount = 0;
    currentPage = 1;
    updateCount();
    renderPage();
  }

  // ===== 分页渲染 =====
  function renderPage() {
    Array.from(tableEl.tBodies).forEach(tb => tb.remove());
    const totalPages = Math.max(1, Math.ceil(generatedUsers.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PAGE_SIZE;
    generatedUsers
      .slice(start, start + PAGE_SIZE)
      .forEach(user => tableEl.appendChild(buildPerson(user)));
    updatePagination(totalPages);
  }

  function updatePagination(totalPages) {
    if (totalCount === 0 || totalPages <= 1) {
      paginationEl.hidden = true;
      return;
    }
    paginationEl.hidden = false;
    pageInfo.textContent = t('pageInfo', { cur: currentPage, total: totalPages, n: totalCount });
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
  }

  function changePage(delta) {
    const totalPages = Math.max(1, Math.ceil(generatedUsers.length / PAGE_SIZE));
    const next = currentPage + delta;
    if (next < 1 || next > totalPages) return;
    currentPage = next;
    renderPage();
  }

  function setLoading(loading) {
    generateBtn.disabled = loading;
    generateBtn.classList.toggle('btn-loading', loading);
    generateBtn.textContent = loading ? t('generating') : t('generate');
  }

  // ===== 导出 =====
  function generateCsv() {
    const rows = [
      ['头像URL', '姓名', '性别', '邮箱', '电话', '手机', '地址', '国籍']
    ];
    generatedUsers.forEach(user => {
      rows.push([
        user.picture.thumbnail,
        `${user.name.first} ${user.name.last}`,
        user.gender,
        user.email,
        formatPhoneNumber(user.phone, user.nat),
        formatPhoneNumber(user.cell, user.nat),
        formatAddress(user.location),
        user.nat
      ]);
    });
    return rows.map(row => row.map(escapeCsv).join(',')).join('\n');
  }

  function escapeCsv(field) {
    const str = String(field);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  async function copyCsv() {
    if (totalCount === 0) {
      showToast(t('noDataCopy'));
      return;
    }
    const csv = generateCsv();
    try {
      await navigator.clipboard.writeText(csv);
      showToast(t('copySuccess'), 'success');
    } catch (err) {
      console.error(err);
      showToast(t('copyFail'));
    }
  }

  function downloadCsv() {
    if (totalCount === 0) {
      showToast(t('noDataDownload'));
      return;
    }
    const csv = generateCsv();
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `globetrotter-id-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('downloadStart'), 'success');
  }

  function showToast(message, type = 'error') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
  }

  // ===== 初始化 =====
  const saved = localStorage.getItem('gt-lang');
  const initialLang = saved || (navigator.language && navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en');
  applyLanguage(initialLang);
});
