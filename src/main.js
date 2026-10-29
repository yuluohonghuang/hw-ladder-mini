import hbSDK from '@heybox/hb-sdk';
import './styles.css';
import LOCAL_DATA from '../data.json';

if (hbSDK && hbSDK.storage) window.__hbStorage = hbSDK.storage;

// ===== 数据区（按经典天梯顺序排列，sort越小越靠前）=====


let FX = 6.6763; // 静态汇率（USD→CNY），更新于 2026-10-21
let currentCat = 'cpu';
let currentVendor = 'all';
let currentSort = 'score';
let currentQuery = '';
let currentBenchmark = 'timespy'; // 默认 Time Spy（游戏向），可选 passmark（综合向）

// Intel Arc 侧边栏展开/收缩状态（GPU 天梯用），持久化记忆
let intelOpen = false;
try { intelOpen = localStorage.getItem('hw_ladder_intel_open') === '1'; } catch(e){}
let showRank = false; // 展开三列模式：只显排名不显跑分
function toggleIntel(){
  intelOpen = !intelOpen;
  try { localStorage.setItem('hw_ladder_intel_open', intelOpen ? '1' : '0'); } catch(e){}
  refresh();
}

function getBenchmarkScore(item){
  if(currentBenchmark === 'timespy' && item.timespy != null) return item.timespy;
  return item.score;
}

function vendorOf(name){
  if(name.indexOf('AMD') !== -1 || name.indexOf('Radeon') !== -1) return 'amd';
  if(name.indexOf('Intel') !== -1) return 'intel';
  return 'nvidia';
}
function shortName(name){
  return name.replace(/^AMD /,'').replace(/^Intel Core /,'').replace(/^Intel /,'')
    .replace(/^GeForce /,'').replace(/^Radeon /,'');
}
function fmtNum(n){ return n == null ? '—' : (n|0).toLocaleString('en-US'); }
function fmtPrice(p){ return p == null ? '—' : '¥' + Math.round(p * FX).toLocaleString('zh-CN'); }
function fmtVal(v){ return v == null ? '—' : v.toFixed(1); }

// 性能档位色块：旗舰 / 高端 / 主流 / 入门
function getCategory(score, allScores){
  if(!allScores || allScores.length < 4) return '';
  const sorted = [...allScores].sort((a,b) => b - a);
  const rank = sorted.indexOf(score);
  const pct = rank / sorted.length;
  if(pct < 0.10) return '<span class="cat-tag cat-flagship"></span>';
  if(pct < 0.30) return '<span class="cat-tag cat-high"></span>';
  if(pct < 0.60) return '<span class="cat-tag cat-mid"></span>';
  return '<span class="cat-tag cat-entry"></span>';
}

function getFiltered(){
  if(currentCat === 'chip') return HW_DATA.chipset;
  let list = HW_DATA[currentCat].filter(it => {
    if(currentVendor !== 'all' && vendorOf(it.name) !== currentVendor) return false;
    if(currentQuery && it.name.toLowerCase().indexOf(currentQuery) === -1) return false;
    return true;
  });
  list.forEach(it => { it.vendor = vendorOf(it.name); });
  if(currentSort === 'value'){
    list.sort((a,b) => {
      if(a.value == null && b.value == null) return getBenchmarkScore(b) - getBenchmarkScore(a);
      if(a.value == null) return 1;
      if(b.value == null) return -1;
      return b.value - a.value;
    });
  } else {
    list.sort((a,b) => getBenchmarkScore(b) - getBenchmarkScore(a));
  }
  return list;
}

function renderLadder(list){
  const container = document.getElementById('mainContent');
  const allScores = list.map(it => getBenchmarkScore(it));
  
  if(currentCat === 'chip'){
    let html = `<div class="ladder" style="grid-template-columns:1fr">
      <div style="padding:20px">
        <h3 style="margin-bottom:16px;font-size:16px">台式机主板芯片组年代表（1995–2024）</h3>
        <table class="chip-table">
          <thead><tr><th>年代</th><th>Intel 芯片组</th><th>AMD 芯片组</th></tr></thead>
          <tbody>`;
    list.forEach(row => {
      html += `<tr><td class="chip-year">${row.year}</td><td>${row.intel}</td><td>${row.amd}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;
    container.innerHTML = html;
    return;
  }
  
  // 按全局跑分排名对齐三列：第 N 行放全局第 N 名的型号，其他厂商该位置留空
  const maxLen = list.length;
  let leftArr = new Array(maxLen).fill(null);
  let midArr = new Array(maxLen).fill(null);
  let rightArr = new Array(maxLen).fill(null);
  
  list.forEach((it, rank) => {
    if(currentCat === 'cpu'){
      if(it.vendor === 'intel') leftArr[rank] = it;
      else rightArr[rank] = it;
    } else {
      if(it.vendor === 'intel') leftArr[rank] = it;
      else if(it.vendor === 'nvidia') midArr[rank] = it;
      else rightArr[rank] = it;
    }
  });
  
  // 去掉尾部连续的 null，让列表紧凑
  function trimTail(arr){
    let last = arr.length - 1;
    while(last >= 0 && !arr[last]) last--;
    return arr.slice(0, last + 1);
  }
  leftArr = trimTail(leftArr);
  midArr = trimTail(midArr);
  rightArr = trimTail(rightArr);
  
  function renderRow(it, rank){
    if(!it) return '<div class="model" style="visibility:hidden"></div>';
    const laptopTag = it.laptop ? '<span class="laptop-tag">笔电</span>' : '';
    const unreleasedTag = it.unreleased ? '<span class="unreleased-tag">未发布</span>' : '';
    const estTag = it.est ? '<span class="est-tag">估算</span>' : '';
    const score = getBenchmarkScore(it);
    const catTag = getCategory(score, allScores);
    // 展开三列模式只显全局排名；收缩两列模式带跑分
    const right = showRank
      ? `<span class="rank-num num">#${rank + 1}</span>`
      : `<span class="score num">${fmtNum(score)}</span>`;
    return `<div class="model ${rank === 0 ? 'top' : ''} ${it.old ? 'old' : ''}" title="${it.name}"><span>${shortName(it.name)}${catTag}${laptopTag}${unreleasedTag}${estTag}</span>${right}</div>`;
  }
  
  const rowCount = Math.max(leftArr.length, midArr.length, rightArr.length);
  const perfCenter = `
    <div class="ladder-center">
      <span class="perf-label">最高性能</span>
      <span class="perf-label">高性能</span>
      <span class="perf-label">中性能</span>
      <span class="perf-label">低性能</span>
      <span class="perf-label">入门性能</span>
      <span class="perf-label">最低性能</span>
    </div>`;

  let gridCols = '', leftHtml = '', midHtml = '', rightHtml = '';

  if(currentCat === 'gpu'){
    showRank = intelOpen; // 展开三列：只显排名
    if(intelOpen){
      // 展开：Intel 全列 + NVIDIA + AMD 三列并排，均只显全局排名
      gridCols = 'minmax(158px,1fr) minmax(158px,1fr) 40px minmax(158px,1fr)';
      leftHtml = `<div class="vendor-header intel" id="intelToggle" title="点击收起 Intel Arc">Intel Arc <span class="tg-arrow">▾</span></div><div class="model-list">`;
      for(let i = 0; i < rowCount; i++) leftHtml += renderRow(leftArr[i], i);
      leftHtml += '</div>';
    } else {
      // 收缩：Intel 侧边栏（点击展开），主区 NVIDIA + AMD 两列带跑分
      gridCols = 'minmax(58px,auto) minmax(150px,1fr) 40px minmax(150px,1fr)';
      leftHtml = `<div class="intel-sidebar" id="intelToggle" title="点击展开 Intel Arc"><span class="sb-label">Intel Arc</span><span class="sb-arrow">▶</span></div>`;
    }
    midHtml = `<div class="vendor-header nvidia">NVIDIA</div><div class="model-list">`;
    for(let i = 0; i < rowCount; i++) midHtml += renderRow(midArr[i], i);
    midHtml += '</div>';
    rightHtml = `<div class="vendor-header amd">AMD</div><div class="model-list">`;
    for(let i = 0; i < rowCount; i++) rightHtml += renderRow(rightArr[i], i);
    rightHtml += '</div>';
  } else {
    // CPU / 芯片组：保持原有两列布局，正常显跑分（chip 在函数开头已提前返回）
    showRank = false;
    gridCols = currentCat === 'cpu' ? '1fr 50px 1fr' : '1fr';
    leftHtml = `<div class="vendor-header ${currentCat === 'cpu' ? 'intel' : ''}">${currentCat === 'cpu' ? 'Intel' : '台式机主板芯片组年代表（1995–2024）'}</div><div class="model-list">`;
    for(let i = 0; i < rowCount; i++) leftHtml += renderRow(leftArr[i], i);
    leftHtml += '</div>';
    if(currentCat === 'cpu'){
      rightHtml = `<div class="vendor-header amd">AMD</div><div class="model-list">`;
      for(let i = 0; i < rowCount; i++) rightHtml += renderRow(rightArr[i], i);
      rightHtml += '</div>';
    }
  }

  container.innerHTML = `
    <div class="ladder" style="grid-template-columns:${gridCols}">
      <div class="ladder-left">${leftHtml}</div>
      ${midHtml ? `<div class="ladder-mid">${midHtml}</div>` : ''}
      ${currentCat !== 'chip' ? perfCenter : ''}
      ${rightHtml ? `<div class="ladder-right">${rightHtml}</div>` : ''}
    </div>
  `;

  const tg = document.getElementById('intelToggle');
  if(tg) tg.addEventListener('click', toggleIntel);
}

function renderTable(list){
  const tbody = document.getElementById('tblBody');
  if(currentCat === 'chip'){
    tbody.innerHTML = '<tr><td colspan="6" style="color:var(--dim)">芯片组年代表无跑分数据</td></tr>';
    document.getElementById('fCount').textContent = list.length;
    return;
  }
  let html = '';
  list.forEach((it, i) => {
    const laptopTag = it.laptop ? '<span class="laptop-tag" style="font-size:10px;margin-left:4px">笔电</span>' : '';
    const unreleasedTag = it.unreleased ? '<span class="unreleased-tag" style="font-size:10px;margin-left:4px">未发布</span>' : '';
    const estTag = it.est ? '<span class="est-tag" style="font-size:10px;margin-left:4px">估算</span>' : '';
    const score = getBenchmarkScore(it);
    html += `<tr>
      <td class="rank num">${i+1}</td>
      <td class="name">${it.name}${laptopTag}${unreleasedTag}${estTag}</td>
      <td><span class="vchip ${it.vendor}">${it.vendor === 'amd' ? 'AMD' : it.vendor === 'intel' ? 'Intel' : 'NVIDIA'}</span></td>
      <td class="score num">${fmtNum(score)}</td>
      <td class="price num">${fmtPrice(it.price)}</td>
      <td class="value num">${fmtVal(it.value)}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
  document.getElementById('fCount').textContent = list.length;
}

// ===== 数据区（本地兜底 + 远程更新）=====
let HW_DATA = LOCAL_DATA;

async function loadData(){
  // 先用本地数据渲染（已在初始化时渲染），再异步拉远程更新
  try {
    const res = await fetch('https://yuluohonghuang.github.io/hw-ladder-mini/data.json?t=' + Date.now());
    const remote = await res.json();
    HW_DATA = remote;
    // 更新右上角数据更新日期
    const updateEl = document.getElementById('updateDate');
    if(updateEl) updateEl.textContent = '数据更新于 2026-10-26（远程同步）';
    refresh();
  } catch(e) {
    console.warn('远程数据加载失败，使用内置数据', e);
    const updateEl = document.getElementById('updateDate');
    if(updateEl) updateEl.textContent = '数据更新于 2026-10-26（本地模式，远程加载失败: ' + e.message + '）';
  }
}

function refresh(){
  const list = getFiltered();
  renderLadder(list);
  renderTable(list);
  // 只有 GPU 分类才显示跑分体系切换按钮（CPU/芯片组没有 Time Spy 分数）
  const btn = document.getElementById('fBenchmark');
  if(btn) btn.style.display = currentCat === 'gpu' ? '' : 'none';
}

// 事件绑定
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCat = tab.dataset.cat;
    refresh();
  });
});
document.getElementById('fVendor').addEventListener('change', e => { currentVendor = e.target.value; refresh(); });
document.getElementById('fSort').addEventListener('change', e => { currentSort = e.target.value; refresh(); });
document.getElementById('fSearch').addEventListener('input', e => { currentQuery = e.target.value.toLowerCase(); refresh(); });
document.getElementById('fBenchmark').addEventListener('click', e => {
  currentBenchmark = currentBenchmark === 'timespy' ? 'passmark' : 'timespy';
  e.target.textContent = currentBenchmark === 'timespy' ? 'Time Spy' : 'PassMark';
  e.target.style.background = currentBenchmark === 'timespy' ? 'var(--amber)' : 'var(--cyan)';
  refresh();
});

// 生成粒子背景
(function(){
  const container = document.getElementById('particles');
  if(!container) return;
  for(let i = 0; i < 30; i++){
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 15) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
})();

// 初始化：先用本地数据渲染，再异步拉远程更新
refresh();
loadData();

// 汇率采用内置静态值（见上方 FX 定义），更新于 2026-10-21，无外部网络请求
