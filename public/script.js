document.addEventListener('DOMContentLoaded', () => {
  const countrySelect = document.getElementById('country');
  const countInput = document.getElementById('count');
  const generateBtn = document.getElementById('generate-btn');
  const clearBtn = document.getElementById('clear-btn');
  const tableEl = document.getElementById('result-table');
  const emptyState = document.getElementById('empty-state');
  const countBadge = document.getElementById('count-badge');
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

  const MAX_COUNT = 20;
  const PAGE_SIZE = 10;
  let totalCount = 0;
  let currentPage = 1;
  let toastTimer = null;
  const generatedUsers = []; // 最新在前，供导出使用

  generateBtn.addEventListener('click', generateIdentities);
  clearBtn.addEventListener('click', clearResults);
  copyCsvBtn.addEventListener('click', copyCsv);
  downloadCsvBtn.addEventListener('click', downloadCsv);
  prevPageBtn.addEventListener('click', () => changePage(-1));
  nextPageBtn.addEventListener('click', () => changePage(1));

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
      showToast('获取数据失败，请稍后重试');
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
    avatarLabel.textContent = '头像';
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
      detailItem('姓名', `${user.name.first} ${user.name.last}`),
      detailItem('性别', capitalize(user.gender)),
      detailItem('国籍', user.nat),
      detailItem('邮箱', user.email),
      detailItem('电话', formatPhoneNumber(user.phone, user.nat)),
      detailItem('手机', formatPhoneNumber(user.cell, user.nat)),
      detailItem('地址', formatAddress(user.location), true)
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
    countBadge.textContent = String(totalCount);
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
    pageInfo.textContent = `第 ${currentPage} / ${totalPages} 页 · 共 ${totalCount} 条`;
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
    generateBtn.textContent = loading ? '生成中…' : '生成';
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
      showToast('暂无数据可复制');
      return;
    }
    const csv = generateCsv();
    try {
      await navigator.clipboard.writeText(csv);
      showToast('CSV 已复制到剪贴板', 'success');
    } catch (err) {
      console.error(err);
      showToast('复制失败，请尝试下载 CSV');
    }
  }

  function downloadCsv() {
    if (totalCount === 0) {
      showToast('暂无数据可下载');
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
    showToast('CSV 下载已开始', 'success');
  }

  function showToast(message, type = 'error') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
  }
});
