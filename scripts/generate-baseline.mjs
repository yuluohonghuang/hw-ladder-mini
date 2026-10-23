// 从 main.js 提取所有型号，生成完整基准清单
import { readFileSync, writeFileSync } from 'fs';

const src = readFileSync('./src/main.js', 'utf-8');

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
    try { items.push(eval('(' + m[0] + ')')); } catch(e) {}
  }
  return items;
}

const cpu = extractArray('cpu');
const gpu = extractArray('gpu');

// 按厂商和类型分组
const cpuIntelDesktop = cpu.filter(it => !it.laptop && /Intel/i.test(it.name)).map(it => it.name);
const cpuAmdDesktop = cpu.filter(it => !it.laptop && /AMD|Ryzen/i.test(it.name)).map(it => it.name);
const cpuIntelLaptop = cpu.filter(it => it.laptop && /Intel/i.test(it.name)).map(it => it.name);
const cpuAmdLaptop = cpu.filter(it => it.laptop && /AMD|Ryzen/i.test(it.name)).map(it => it.name);

const gpuNvidiaDesktop = gpu.filter(it => !it.laptop && /GeForce|NVIDIA/i.test(it.name)).map(it => it.name);
const gpuAmdDesktop = gpu.filter(it => !it.laptop && /Radeon|AMD/i.test(it.name)).map(it => it.name);
const gpuIntelDesktop = gpu.filter(it => !it.laptop && /Arc|Intel/i.test(it.name)).map(it => it.name);
const gpuNvidiaLaptop = gpu.filter(it => it.laptop && /GeForce|NVIDIA/i.test(it.name)).map(it => it.name);
const gpuAmdLaptop = gpu.filter(it => it.laptop && /Radeon|AMD/i.test(it.name)).map(it => it.name);

const baseline = {
  _comment: "型号基准清单：从 main.js 实际收录型号自动生成。新增型号时同时更新此文件。",
  cpu_desktop_intel: cpuIntelDesktop,
  cpu_desktop_amd: cpuAmdDesktop,
  cpu_laptop_intel: cpuIntelLaptop,
  cpu_laptop_amd: cpuAmdLaptop,
  gpu_desktop_nvidia: gpuNvidiaDesktop,
  gpu_desktop_amd: gpuAmdDesktop,
  gpu_desktop_intel: gpuIntelDesktop,
  gpu_laptop_nvidia: gpuNvidiaLaptop,
  gpu_laptop_amd: gpuAmdLaptop,
};

writeFileSync('./data/baseline-models.json', JSON.stringify(baseline, null, 2) + '\n', 'utf-8');

console.log('✅ 基准清单已生成');
console.log('CPU 桌面 Intel:', cpuIntelDesktop.length);
console.log('CPU 桌面 AMD:', cpuAmdDesktop.length);
console.log('CPU 笔电 Intel:', cpuIntelLaptop.length);
console.log('CPU 笔电 AMD:', cpuAmdLaptop.length);
console.log('GPU 桌面 NVIDIA:', gpuNvidiaDesktop.length);
console.log('GPU 桌面 AMD:', gpuAmdDesktop.length);
console.log('GPU 桌面 Intel:', gpuIntelDesktop.length);
console.log('GPU 笔电 NVIDIA:', gpuNvidiaLaptop.length);
console.log('GPU 笔电 AMD:', gpuAmdLaptop.length);
