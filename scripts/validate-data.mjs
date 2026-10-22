// 数据质量校验：自动检测缺失型号、必填字段为空、排序紊乱、型号重复等问题
import { readFileSync } from 'fs';

const src = readFileSync('./src/main.js', 'utf-8');
const errors = [];
const warnings = [];

// 提取 cpu 数据块
function extractArray(name) {
  const start = src.indexOf(`${name}: [`);
  if (start < 0) return [];
  let depth = 1, i = start + `${name}: [`.length;
  while (depth > 0 && i < src.length) {
    if (src[i] === '[') depth++;
    if (src[i] === ']') depth--;
    i++;
  }
  const block = src.slice(start + `${name}: [`.length, i - 1);
  const items = [];
  const re = /\{[^}]+\}/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    try {
      items.push(eval('(' + m[0] + ')'));
    } catch(e) {}
  }
  return items;
}

const cpu = extractArray('cpu');
const gpu = extractArray('gpu');

// 1. 必填字段检查
[['CPU', cpu], ['GPU', gpu]].forEach(([label, list]) => {
  list.forEach((it, idx) => {
    if (!it.name) errors.push(`${label}[${idx}]: name 为空`);
    if (typeof it.score !== 'number' || it.score <= 0) errors.push(`${label}[${idx}] ${it.name || '?'}: score 缺失或异常 (${it.score})`);
  });
});

// 2. 型号重复检查
[['CPU', cpu], ['GPU', gpu]].forEach(([label, list]) => {
  const seen = {};
  list.forEach(it => {
    if (seen[it.name]) errors.push(`${label}: 型号重复 - ${it.name}`);
    seen[it.name] = true;
  });
});

// 3. 排序一致性检查（按 score 降序，允许 5% 误差）
[['CPU', cpu], ['GPU', gpu]].forEach(([label, list]) => {
  const desktop = list.filter(it => !it.laptop);
  for (let i = 0; i < desktop.length - 1; i++) {
    const a = desktop[i], b = desktop[i + 1];
    if (b.score > a.score * 1.05) {
      warnings.push(`${label} 排序异常: ${a.name} (${a.score}) 排在 ${b.name} (${b.score}) 之前，差距 ${((b.score/a.score-1)*100).toFixed(1)}%`);
    }
  }
});

// 4. 笔电型号检查（必须标 laptop:true）
gpu.filter(it => /laptop|笔记本/i.test(it.name)).forEach(it => {
  if (!it.laptop) warnings.push(`GPU: ${it.name} 疑似笔电型号但未标 laptop:true`);
});
cpu.filter(it => /H$|HS$|HX$/i.test(it.name)).forEach(it => {
  if (!it.laptop) warnings.push(`CPU: ${it.name} 疑似笔电型号但未标 laptop:true`);
});

// 输出
console.log('=== 数据质量校验 ===');
console.log(`CPU: ${cpu.length} 款, GPU: ${gpu.length} 款`);
if (errors.length) {
  console.error(`\n❌ 错误 (${errors.length}):`);
  errors.forEach(e => console.error('  - ' + e));
}
if (warnings.length) {
  console.log(`\n⚠️ 警告 (${warnings.length}):`);
  warnings.forEach(w => console.log('  - ' + w));
}
if (!errors.length && !warnings.length) console.log('✅ 全部通过');

process.exit(errors.length ? 1 : 0);
