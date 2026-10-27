// =============================================================================
// validate-data.mjs —— 数据质量校验入口（严格模式）
// -----------------------------------------------------------------------------
// 说明：原实现从 src/main.js 源码正则提取 cpu/gpu 数组，但 main.js 已改为
// `import data.json`，不再内嵌数据，导致原校验实际对"空数组"执行、形同虚设。
// 现改为委托 scripts/auto-correct.mjs 以严格模式运行：
//   - 只读审计（不写盘），产出 data/auto-correct-report.json
//   - 存在硬错误（缺失 name / score 异常等）时 exit 1，供 CI 阻断
// 缺失型号（对照基准清单）作为"警告"输出、不阻断——它们需要人工补跑分后录入，
// 不属于自动纠错能安全修复的范围（见文档 Q3：不为位置改跑分）。
// =============================================================================

import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const res = spawnSync(
  process.execPath,
  [join(ROOT, 'scripts', 'auto-correct.mjs'), '--strict'],
  { stdio: 'inherit', cwd: ROOT }
);

process.exit(res.status === null ? 1 : res.status);
