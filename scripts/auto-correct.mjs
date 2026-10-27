// =============================================================================
// 硬件天梯图 · 数据自动纠错机制 (auto-correct.mjs)
// -----------------------------------------------------------------------------
// 双模式：
//   check  （默认，只读）  —— 审计 data.json 质量，产出可读报告 + 结构化报告文件
//   fix    （--fix，写盘） —— 仅应用"确定性可自动修复"的纠正，绝不篡改跑分/价格
//
// 覆盖面（对应交接文档待办6：缺失型号 / 缺失跑分 / 排序紊乱）：
//   A. 缺失型号  —— 对照 data/baseline-models.json（含桌面+笔电全部 9 类）逐一比对，
//                   给出精确缺失清单 + 模糊候选；【无法自动补跑分，需人工录入】
//   B. 缺失跑分  —— CPU 缺 score、GPU 缺 score/timespy、score 非正数等；【需人工】
//   C. 排序紊乱  —— 检测 sort 连续性/重复、按所选基准体系检测相邻逆序并定位型号对；
//                   fix 可确定性重建 sort 序列（--align-sort=score|timespy）
//   D. 确定性自动修复（fix 模式）：型号去重、laptop 标记推断、字段类型归一、sort 重建
//
// 核心原则（文档 Q3）：跑分是"事实"，位置由跑分推导。纠错绝不为了位置去改跑分，
// 只报告异常跑分供人工核验；可自动修的是排序序列、重复、标记、字段类型这些结构问题。
// =============================================================================

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(ROOT, 'data.json');
const BASELINE_PATH = join(ROOT, 'data', 'baseline-models.json');
const REPORT_PATH = join(ROOT, 'data', 'auto-correct-report.json');

// ---------- 参数解析 ----------
const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');
const STRICT = argv.includes('--strict');   // 硬错误时 exit 1（CI 阻断用）
const ALIGN = argv.includes('--align-sort');
const NO_REPORT = argv.includes('--no-write-report');
const TOL = 0.05; // 逆序容忍度：相邻降序偏差超过 5% 记为逆序

// ---------- 工具 ----------
function load(path, fallback) {
  if (!existsSync(path)) {
    console.error(`[auto-correct] 找不到文件: ${path}`);
    return fallback ?? null;
  }
  try { return JSON.parse(readFileSync(path, 'utf-8')); }
  catch (e) { console.error(`[auto-correct] 解析失败 ${path}: ${e.message}`); return fallback ?? null; }
}

// 归一化：去掉厂商前缀、空白，用于跨清单比对。
// 注意：不剥离 laptop/mobile 词——否则桌面版与笔电版同型号（如 RTX 5090 与 RTX 5090 Laptop）
// 会被误判为同一型号，导致笔电型号漏检、--fix 去重误删笔电条目。
const normName = n => String(n || '').toLowerCase()
  .replace(/^(amd|intel\s+core|intel|geforce|radeon|ryzen|core)\s+/g, '')
  .replace(/\s+/g, '').trim();

// 笔电命名模式（用于推断 laptop 标记）
const LAPTOP_GPU_RE = /laptop|笔记本|mobile/i;
const LAPTOP_CPU_RE = /(^|[-\s])(HX|HK|HS|H|U|P)$/i; // 结尾笔电后缀（如 i9-14900HX、Ryzen 9 7945HX）

const isLaptopName = (name, kind) =>
  kind === 'gpu' ? LAPTOP_GPU_RE.test(name) : LAPTOP_CPU_RE.test(name);

// 厂商推断（与前端 vendorOf 对齐）
const vendorOf = name => {
  if (/AMD|Radeon/i.test(name)) return 'amd';
  if (/Intel/i.test(name)) return 'intel';
  return 'nvidia';
};

// ---------- 审计 ----------
function audit(data, baseline) {
  const errors = [];     // 必须人工处理 / 结构性硬伤
  const warnings = [];   // 提示性
  const fixes = [];      // fix 模式将执行的确定性修复
  const missingModels = {}; // { 分类: [型号] }
  const missingScores = [];
  const inversions = [];   // 排序逆序对
  const laptopFixed = [];
  const deduped = [];
  const seenNames = {};

  for (const kind of ['cpu', 'gpu']) {
    const arr = data[kind];
    if (!Array.isArray(arr)) { errors.push(`${kind}: data.json 中不是数组`); continue; }

    // ---- 必填字段 / 缺失跑分 ----
    arr.forEach((it, idx) => {
      if (!it || typeof it.name !== 'string' || !it.name.trim()) {
        errors.push(`${kind}[${idx}]: 缺少 name`); return;
      }
      if (typeof it.score !== 'number' || !(it.score > 0)) {
        missingScores.push(`${kind}: ${it.name} — score 缺失或异常 (${it.score})`);
        errors.push(`${kind}: ${it.name} — score 缺失或异常，需补跑分`);
      }
      if (kind === 'gpu' && (typeof it.timespy !== 'number' || !(it.timespy > 0))) {
        warnings.push(`GPU: ${it.name} — 缺 timespy（默认 Time Spy 体系下将显示 PassMark）`);
      }
    });

    // ---- 型号重复 ----
    arr.forEach(it => {
      const k = normName(it.name);
      if (!k) return;
      if (seenNames[k]) { deduped.push(`${kind}: ${it.name}（与 ${seenNames[k]} 重复）`); }
      else seenNames[k] = it.name;
    });

    // ---- laptop 标记推断（确定性）----
    arr.forEach(it => {
      if (isLaptopName(it.name, kind) && it.laptop !== true) {
        laptopFixed.push(`${kind}: ${it.name} 标记 laptop:true`);
      }
    });

    // ---- 排序审计：桌面段按 sort 顺序检查跑分是否降序 ----
    const bySort = [...arr].sort((a, b) => (a.sort ?? Infinity) - (b.sort ?? Infinity));
    // sort 连续性 / 重复
    const sorts = bySort.map(x => x.sort).filter(x => typeof x === 'number');
    const unique = new Set(sorts);
    if (sorts.length && (sorts.some((s, i) => s !== i + 1))) {
      warnings.push(`${kind}: sort 序列不连续`);
      fixes.push(`${kind}: 重建 sort 为连续序列 1..N`);
    }
    if (unique.size !== sorts.length) {
      errors.push(`${kind}: sort 存在重复`);
      fixes.push(`${kind}: 重建 sort 消除重复`);
    }
    // 前端按当前基准动态排序（getBenchmarkScore：GPU 默认 timespy，缺失则回退 score；CPU 为 score）。
    // 审计按数组顺序（sort 序）检查各体系相邻逆序（>5%），覆盖桌面+笔电全部条目：
    //   - CPU：score 序
    //   - GPU：timespy 序（缺失 timespy 时按回退值 score 参与）与 score 序
    // gpu-score 的数组序差异可能源于两基准体系天然排序不同（跨体系差异，非数据错误，
    // 前端动态重排保证显示正确）；gpu-timespy / cpu-score 应为 0（数组序与默认体系一致）。
    const effKey = it => (kind === 'gpu' && typeof it.timespy === 'number') ? it.timespy : it.score;
    const systems = kind === 'gpu'
      ? [['gpu-timespy', effKey], ['gpu-score', it => (typeof it.score === 'number' ? it.score : 0)]]
      : [['cpu-score', it => (typeof it.score === 'number' ? it.score : 0)]];
    for (const [sys, keyOf] of systems) {
      for (let i = 0; i < bySort.length - 1; i++) {
        const a = bySort[i], b = bySort[i + 1];
        const sa = keyOf(a), sb = keyOf(b);
        if (sa && sb && sb > sa * (1 + TOL)) {
          inversions.push({ kind, system: sys, a: a.name, b: b.name, aScore: sa, bScore: sb,
            diffPct: ((sb / sa - 1) * 100).toFixed(1) });
        }
      }
    }
  }

  // ---- 基准清单比对（缺失型号，含笔电全 9 类）----
  const cpuNames = new Set(data.cpu.map(it => normName(it.name)));
  const gpuNames = new Set(data.gpu.map(it => normName(it.name)));
  const expect = {
    cpu_desktop_intel: baseline.cpu_desktop_intel ?? [],
    cpu_desktop_amd: baseline.cpu_desktop_amd ?? [],
    cpu_laptop_intel: baseline.cpu_laptop_intel ?? [],
    cpu_laptop_amd: baseline.cpu_laptop_amd ?? [],
    gpu_desktop_nvidia: baseline.gpu_desktop_nvidia ?? [],
    gpu_desktop_amd: baseline.gpu_desktop_amd ?? [],
    gpu_desktop_intel: baseline.gpu_desktop_intel ?? [],
    gpu_laptop_nvidia: baseline.gpu_laptop_nvidia ?? [],
    gpu_laptop_amd: baseline.gpu_laptop_amd ?? [],
  };
  for (const [cat, list] of Object.entries(expect)) {
    const pool = cat.startsWith('cpu') ? cpuNames : gpuNames;
    const missing = list.filter(m => !pool.has(normName(m)));
    if (missing.length) {
      missingModels[cat] = missing;
      warnings.push(`${cat}: 缺失 ${missing.length} 款（需人工补跑分后录入）`);
    }
  }

  return { errors, warnings, fixes, missingModels, missingScores, inversions, laptopFixed, deduped };
}

// ---------- 确定性修复 ----------
function applyFixes(data, alignMode, fixLog) {
  let changed = 0;
  // alignMode: 'none'（不重建排序）| 'auto'（cpu→score，gpu→timespy优先）| 'score' | 'timespy'
  const alignKeyOf = (kind) => {
    if (alignMode === 'score') return 'score';
    if (alignMode === 'timespy') return 'timespy';
    if (alignMode === 'auto') return kind === 'gpu' && data.gpu.some(x => typeof x.timespy === 'number') ? 'timespy' : 'score';
    return null;
  };

  for (const kind of ['cpu', 'gpu']) {
    const arr = data[kind];
    if (!Array.isArray(arr)) continue;

    // 1. laptop 标记推断
    const beforeLap = arr.filter(x => x.laptop).length;
    arr.forEach(it => { if (isLaptopName(it.name, kind)) it.laptop = true; });
    const afterLap = arr.filter(x => x.laptop).length;
    if (afterLap !== beforeLap) { changed++; fixLog.push(`${kind}: 更新 laptop 标记 (${beforeLap}->${afterLap})`); }

    // 2. 字段类型归一（score/price/value/timespy → 数值；非数值且不可转则留待人工）
    arr.forEach(it => {
      for (const f of ['score', 'price', 'value', 'timespy']) {
        if (it[f] != null && typeof it[f] !== 'number') {
          const v = Number(it[f]);
          if (!Number.isNaN(v) && isFinite(v)) { it[f] = v; changed++; }
        }
      }
    });

    // 3. 排序序列重建
    const alignKey = alignKeyOf(kind);
    if (alignKey) {
      // 与前端 getBenchmarkScore 语义一致：GPU 默认 Time Spy，缺失则回退 PassMark score，
      // 避免 timespy 缺失的条目被排到末尾造成 CI 每次自动回写
      const keyOf = it => {
        if (kind === 'gpu' && typeof it.timespy === 'number') return it.timespy;
        if (kind === 'gpu' && typeof it.score === 'number') return it.score; // timespy 缺失回退 PassMark
        return typeof it[alignKey] === 'number' ? it[alignKey] : -1;
      };
      arr.sort((a, b) => keyOf(b) - keyOf(a));
      arr.forEach((it, i) => { if (it.sort !== i + 1) { it.sort = i + 1; changed++; } });
      fixLog.push(`${kind}: 已按 ${alignKey} 降序重建 sort 序列`);
    }
  }

  // 4. 型号去重（保留首个）
  const seen = new Set();
  for (const kind of ['cpu', 'gpu']) {
    const arr = data[kind];
    const out = [];
    for (const it of arr) {
      const k = normName(it.name);
      if (!k || seen.has(k)) { changed++; continue; }
      seen.add(k); out.push(it);
    }
    data[kind] = out;
  }
  if (changed) fixLog.push('已执行去重（保留每个型号首个）');
  return changed;
}

// ---------- 报告 ----------
function renderReport(r, alignLabel, didFix) {
  const lines = [];
  lines.push('===== 硬件天梯图 · 数据自动纠错报告 =====');
  lines.push(`跑分体系: 默认 Time Spy(GPU) / PassMark(CPU)，逆序容忍度 ${(TOL*100)}%`);
  lines.push('');

  const totalMissing = Object.values(r.missingModels).reduce((s, a) => s + a.length, 0);
  lines.push(`【缺失型号】共 ${totalMissing} 款（对照基准清单，需人工补跑分后录入）`);
  for (const [cat, list] of Object.entries(r.missingModels)) {
    lines.push(`  · ${cat} (${list.length})`);
    lines.push(`      ${list.join(', ')}`);
  }
  lines.push('');

  lines.push(`【缺失/异常跑分】${r.missingScores.length}`);
  r.missingScores.forEach(s => lines.push(`  · ${s}`));
  lines.push('');

  if (r.inversions.length) {
    lines.push(`【排序逆序】${r.inversions.length} 处（仅报告，不自动改跑分）`);
    lines.push(`  （gpu-score 的数组序差异多为两基准体系天然排序不同，属跨体系差异而非数据错误；gpu-timespy / cpu-score 应为 0）`);
    r.inversions.forEach(v => lines.push(`  · [${v.system}] ${v.kind}: ${v.a} (${v.aScore}) 排在 ${v.b} (${v.bScore}) 之前，差 ${v.diffPct}%`));
  } else {
    lines.push('【排序逆序】0 处（无 >5% 逆序）');
  }
  lines.push('');

  lines.push(`【确定性修复】${r.fixes.length} 项（--fix 时执行）`);
  r.fixes.forEach(f => lines.push(`  · ${f}`));
  if (r.laptopFixed.length) {
    lines.push(`【laptop 标记推断】${r.laptopFixed.length} 项`);
    lines.push(`  · ${r.laptopFixed.slice(0, 8).join('; ')}${r.laptopFixed.length > 8 ? ` 等共${r.laptopFixed.length}项` : ''}`);
  }
  if (r.deduped.length) {
    lines.push(`【型号重复】${r.deduped.length} 项`);
    r.deduped.forEach(d => lines.push(`  · ${d}`));
  }
  lines.push('');

  lines.push(`【错误】(需人工/阻断) ${r.errors.length}`);
  r.errors.forEach(e => lines.push(`  ✗ ${e}`));
  lines.push(`【警告】${r.warnings.length}`);
  r.warnings.forEach(w => lines.push(`  ⚠ ${w}`));
  lines.push('');
  lines.push(didFix
    ? `✅ fix 完成${alignLabel !== '无' ? `：已按 ${alignLabel} 重建 sort 序列` : ''}`
    : '（运行 --fix 可应用上方确定性修复）');
  return lines.join('\n');
}

// ---------- 主流程 ----------
function main() {
  const data = load(DATA_PATH);
  const baseline = load(BASELINE_PATH);
  if (!data || !baseline) { process.exit(2); }
  if (!data.cpu || !data.gpu) { console.error('data.json 缺少 cpu/gpu 数组'); process.exit(2); }

  const ALIGN_MODE = argv.includes('--align-sort') ? 'auto' : 'none'; // 是否重建 sort 序列
  const r = audit(data, baseline);
  let fixLog = [];
  if (FIX) {
    applyFixes(data, ALIGN_MODE, fixLog);
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');
  }

  const alignLabel = ALIGN_MODE === 'auto' ? 'cpu→score / gpu→timespy' : '无';
  const text = renderReport(r, alignLabel, FIX);
  console.log(text);
  if (fixLog.length) console.log('\n[fix 变更]\n' + fixLog.map(l => '  · ' + l).join('\n'));

  if (!NO_REPORT) {
    writeFileSync(REPORT_PATH, JSON.stringify({
      generatedAt: new Date().toISOString(),
      alignMode: ALIGN_MODE,
      counts: {
        cpu: data.cpu.length, gpu: data.gpu.length, chipset: (data.chipset || []).length,
        missingModels: Object.values(r.missingModels).reduce((s, a) => s + a.length, 0),
        missingScores: r.missingScores.length,
        inversions: r.inversions.length,
        errors: r.errors.length, warnings: r.warnings.length,
      },
      missingModels: r.missingModels,
      missingScores: r.missingScores,
      inversions: r.inversions,
      errors: r.errors, warnings: r.warnings,
      fixes: r.fixes, laptopFixed: r.laptopFixed, deduped: r.deduped,
    }, null, 2) + '\n');
    console.log(`\n[报告已写入] ${REPORT_PATH}`);
  }

  // 退出码：--strict 且存在硬错误 → 1（CI 阻断）；否则 0（监督，不阻断）
  if (STRICT && r.errors.length) process.exit(1);
  process.exit(0);
}

main();
