// =============================================================================
// merge-shards.mjs —— 合并 data/shards/*.json 分片结果进 data.json
// -----------------------------------------------------------------------------
// 流程：
//   1. 应用各片 verifications（修正现有条目；new=null 表示移除该字段）
//   2. 追加各片 entries（按 category 强制 laptop 标记；计算 value）
//   3. 按 normName 去重校验（与 auto-correct.mjs 同一归一化规则）
//   4. 重排：CPU 按 score 降序；GPU 按 (timespy ?? score) 降序（与前端默认基准一致），重编号 sort
//   5. 同步写出 data.json 与 data_remote.json，并产出 data/merge-summary.json
// =============================================================================

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = join(ROOT, 'data.json');
const REMOTE_PATH = join(ROOT, 'data_remote.json');
const BASELINE_PATH = join(ROOT, 'data', 'baseline-models.json');
const SHARD_DIR = join(ROOT, 'data', 'shards');
const SUMMARY_PATH = join(ROOT, 'data', 'merge-summary.json');

// 与 auto-correct.mjs 同一归一化规则（已修复：不再剥离 laptop/mobile，避免桌面/笔电误判重复）
const normName = n => String(n || '').toLowerCase()
  .replace(/^(amd|intel\s+core|intel|geforce|radeon|ryzen|core)\s+/g, '')
  .replace(/\s+/g, '').trim();

function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  let baseline = {};
  try { baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')); } catch (e) { console.warn('[merge] baseline 读取失败，跳过 baseline 同步:', e.message); }
  const shardFiles = readdirSync(SHARD_DIR).filter(f => f.endsWith('.json')).sort();
  if (!shardFiles.length) { console.error('[merge] 没有分片文件可合并'); process.exit(1); }
  console.log('[merge] 读取分片:', shardFiles.join(', '));

  const idx = { cpu: new Map(), gpu: new Map() };
  for (const kind of ['cpu', 'gpu']) for (const it of data[kind]) idx[kind].set(normName(it.name), it);

  const summary = { additions: [], corrections: [], noData: [], sources: {}, notes: [], resolutions: [] };
  // 全量汇总：additions/corrections 从分片一次性重建（不依赖本次是否实际应用/追加），
  // 保证 merge-summary.json 可作全量清单查询（新增 172 / 修正 198 / sources / noData 全可查）
  const allAdd = [], allCorr = [];
  let verifCount = 0, addCount = 0, skipDup = [], laptopForced = 0;

  for (const f of shardFiles) {
    const s = JSON.parse(readFileSync(join(SHARD_DIR, f), 'utf8'));
    const kind = s.kind === 'gpu' ? 'gpu' : 'cpu';
    const cat = s.category || '';
    if (s.sources) Object.assign(summary.sources, s.sources);
    if (s.noData) summary.noData.push(...s.noData);
    if (s.notes) summary.notes.push(`[${f}] ${s.notes}`);
    for (const e of (s.entries || [])) {
      if (typeof e.score !== 'number') continue; // 防御：无 score 的条目视为核验清单
      allAdd.push({
        name: e.name, kind, score: e.score,
        timespy: (e.timespy != null && e.timespy > 0) ? e.timespy : null,
        price: e.price != null ? e.price : null,
        laptop: !!(e.laptop === true || (e.laptop !== false && cat.includes('laptop'))),
        old: e.old === true,
      });
    }
    for (const v of (s.verifications || [])) {
      if (String(v.old) !== String(v.new)) allCorr.push({ name: v.name, field: v.field, old: v.old, new: v.new, url: v.url, note: v.note || '' });
    }

    // ---- 1. verifications ----
    for (const v of (s.verifications || [])) {
      const it = idx[kind].get(normName(v.name));
      if (!it) { console.warn(`[merge] verification 目标不存在: ${v.name} (${f})`); continue; }
      const oldVal = it[v.field];
      if (String(v.new) === String(oldVal) && v.new != null) continue; // 核验无误
      it[v.field] = v.new; // new=null 移除字段（如老卡 timespy）
      verifCount++;
      summary.corrections.push({ name: v.name, field: v.field, old: oldVal, new: v.new, url: v.url, note: v.note || '' });
    }

    // ---- 1.5 resolutions（残量片：removed / rename，同步 baseline）----
    for (const r of (s.resolutions || [])) {
      if (r.conclusion === 'removed' && r.baselineRemove) {
        const arr = data[kind];
        const i = arr.findIndex(it => it.name === r.name);
        if (i >= 0) { arr.splice(i, 1); summary.resolutions.push({ name: r.name, action: 'removed-from-data' }); }
        let hit = false;
        for (const [cat, list] of Object.entries(baseline)) {
          if (Array.isArray(list) && list.includes(r.name)) {
            list.splice(list.indexOf(r.name), 1); hit = true;
            summary.resolutions.push({ name: r.name, action: 'removed-from-baseline', category: cat, reason: r.reason || '' });
          }
        }
        if (!hit) console.warn(`[merge] baseline 未找到待移除型号: ${r.name}`);
      }
      if (r.conclusion === 'rename' && r.renameTo) {
        const arr = data[kind];
        const it = arr.find(x => x.name === r.name);
        if (it) { it.name = r.renameTo; summary.resolutions.push({ name: r.name, action: 'renamed', to: r.renameTo }); }
        for (const [cat, list] of Object.entries(baseline)) {
          if (Array.isArray(list) && list.includes(r.name)) {
            list[list.indexOf(r.name)] = r.renameTo;
            summary.resolutions.push({ name: r.name, action: 'renamed-in-baseline', to: r.renameTo, category: cat, reason: r.reason || '' });
          }
        }
      }
    }

    // ---- 2. entries ----
    for (const e of (s.entries || [])) {
      // 防御：无 score 的条目视为"核验清单"而非新增条目（某些核验片会附带清单）
      if (typeof e.score !== 'number') continue;
      const k = normName(e.name);
      if (idx[kind].has(k)) { skipDup.push(e.name); continue; }
      const entry = { name: e.name, score: e.score };
      if (kind === 'gpu') entry.timespy = (e.timespy != null && e.timespy > 0) ? e.timespy : null;
      entry.price = e.price != null ? e.price : null;
      entry.value = (entry.price != null && entry.score > 0) ? Math.round((entry.score / entry.price) * 10) / 10 : null;
      // laptop 标记：尊重分片显式 laptop:false（桌面卡），仅对笔电分类且未显式声明桌面的条目强制
      if (e.laptop === true || (e.laptop !== false && cat.includes('laptop'))) { entry.laptop = true; laptopForced++; }
      if (e.old === true) entry.old = true;
      data[kind].push(entry);
      idx[kind].set(k, entry);
      addCount++;
      summary.additions.push({ name: e.name, kind, score: e.score, timespy: entry.timespy, price: entry.price, laptop: !!entry.laptop, old: !!entry.old });
    }
  }

  // ---- 3. 去重校验（不应出现；出现则阻断）----
  for (const kind of ['cpu', 'gpu']) {
    const seen = new Set();
    for (const it of data[kind]) {
      const k = normName(it.name);
      if (seen.has(k)) { console.error(`[merge] 严重错误：${kind} 中存在重复型号 ${it.name}`); process.exit(1); }
      seen.add(k);
    }
  }

  // ---- 4. 重排 + value 重算 + sort 重编号 ----
  for (const kind of ['cpu', 'gpu']) {
    const eff = it => (kind === 'gpu' && typeof it.timespy === 'number') ? it.timespy : it.score;
    data[kind].sort((a, b) => {
      const d = (b && eff(b) || 0) - (a && eff(a) || 0);
      return d !== 0 ? d : normName(a.name).localeCompare(normName(b.name));
    });
    data[kind].forEach((it, i) => {
      it.value = (it.price != null && it.score > 0) ? Math.round((it.score / it.price) * 10) / 10 : null;
      it.sort = i + 1;
    });
  }

  // ---- 5. 写出 ----
  // 全量汇总写回（新增/修正清单以分片为准，与本次增量运行无关）
  summary.additions = allAdd;
  summary.corrections = allCorr;
  const out = JSON.stringify(data, null, 2) + '\n';
  writeFileSync(DATA_PATH, out);
  writeFileSync(REMOTE_PATH, out);
  // baseline 同步（removed/rename 已就地修改对象；有变化才写回）
  const baseOut = JSON.stringify(baseline, null, 2) + '\n';
  if (baseOut !== JSON.stringify(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')), null, 2) + '\n') {
    writeFileSync(BASELINE_PATH, baseOut);
    console.log('[merge] baseline-models.json 已同步（移除/改名）');
  }
  summary.counts = {
    cpu: data.cpu.length, gpu: data.gpu.length, chipset: (data.chipset || []).length,
    additions: addCount, verifications: verifCount, laptopForced: laptopForced, skippedDuplicates: skipDup,
    resolutions: summary.resolutions.length,
  };
  writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2) + '\n');

  console.log(`[merge] 完成：新增 ${addCount} 款、修正 ${verifCount} 处、强制 laptop ${laptopForced} 款、跳过重复 ${skipDup.length} 款、resolutions ${summary.resolutions.length} 条`);
  if (skipDup.length) console.log('[merge] 跳过的重复:', skipDup.join(', '));
  console.log(`[merge] CPU ${data.cpu.length} 款 / GPU ${data.gpu.length} 款 / chipset ${(data.chipset||[]).length}`);
  console.log(`[merge] 已写出 data.json / data_remote.json / data/merge-summary.json / baseline-models.json`);
}

main();
