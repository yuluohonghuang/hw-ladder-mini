import hbSDK from '@heybox/hb-sdk';
import './styles.css';

if (hbSDK && hbSDK.storage) window.__hbStorage = hbSDK.storage;

// ===== 数据区（按经典天梯顺序排列，sort越小越靠前）=====
const HW_DATA = {
  cpu: [
    // ===== 桌面 CPU（经典天梯顺序）=====
    {name:'AMD Ryzen 9 9950X3D',score:70105,price:691.99,value:101.3,sort:1},
    {name:'AMD Ryzen 9 9950X3D2 Dual Edition',score:72000,price:899.0,value:80.1,sort:0.5},
    {name:'AMD Ryzen 9 9900X3D',score:62000,price:499.0,value:124.2,sort:1.5},
    {name:'Intel Core Ultra 9 285K',score:67229,price:499.78,value:134.5,sort:2},
    {name:'AMD Ryzen 9 9950X',score:65695,price:539.0,value:121.9,sort:3},
    {name:'AMD Ryzen 9 7950X3D',score:62302,price:376.16,value:165.6,sort:4},
    {name:'AMD Ryzen 9 7950X',score:62126,price:353.59,value:175.7,sort:5},
    {name:'Intel Core Ultra 7 265K',score:58571,price:350.0,value:167.3,sort:6},
    {name:'Intel Core Ultra 7 270K Plus',score:61000,price:344.0,value:177.3,sort:5.5},
    {name:'Intel Core Ultra 7 270KF Plus',score:60800,price:324.0,value:187.7,sort:5.6},
    {name:'Intel Core i9-14900K',score:58183,price:449.99,value:129.3,sort:7},
    {name:'Intel Core i9-14900KF',score:58067,price:439.0,value:132.3,sort:8},
    {name:'Intel Core i9-13900K',score:58048,price:627.99,value:92.4,sort:9},
    {name:'Intel Core i9-13900KF',score:57800,price:599.0,value:96.5,sort:9.5},
    {name:'AMD Ryzen 9 9900X',score:54287,price:326.0,value:166.5,sort:10},
    {name:'Intel Core i7-14700KF',score:51927,price:348.37,value:149.1,sort:11},
    {name:'Intel Core i7-14700K',score:51912,price:359.99,value:144.2,sort:12},
    {name:'Intel Core Ultra 5 250K Plus',score:51558,price:219.0,value:235.4,sort:12.5},
    {name:'Intel Core Ultra 5 250KF Plus',score:51400,price:199.0,value:258.3,sort:12.6},
    {name:'AMD Ryzen 9 7900X',score:51207,price:309.0,value:165.7,sort:13},
    {name:'Intel Core i7-13700K',score:45591,price:449.99,value:101.3,sort:14},
    {name:'Intel Core i7-13700KF',score:45400,price:429.0,value:105.8,sort:14.5},
    {name:'AMD Ryzen 9 5950X',score:45243,price:399.99,value:113.1,sort:15},
    {name:'Intel Core Ultra 5 245K',score:44000,price:254.0,value:173.2,sort:15.5},
    {name:'Intel Core Ultra 5 245KF',score:43800,price:234.0,value:187.2,sort:15.6},
    {name:'AMD Ryzen 7 9850X3D',score:41294,price:null,value:null,sort:16},
    {name:'Intel Core i9-12900K',score:41094,price:384.6,value:106.8,sort:17},
    {name:'Intel Core i9-12900KF',score:40900,price:369.0,value:110.8,sort:17.5},
    {name:'AMD Ryzen 7 9800X3D',score:39914,price:444.0,value:89.9,sort:18},
    {name:'AMD Ryzen 9 5900X',score:38885,price:255.33,value:152.3,sort:19},
    {name:'Intel Core Ultra 5 235',score:38000,price:189.0,value:201.1,sort:19.5},
    {name:'AMD Ryzen 7 9700X',score:36923,price:309.99,value:119.1,sort:20},
    {name:'Intel Core i5-14600K',score:37000,price:289.0,value:128.0,sort:21},
    {name:'Intel Core i5-14600KF',score:36800,price:269.0,value:136.8,sort:21.5},
    {name:'Intel Core i5-13600K',score:36500,price:289.0,value:126.3,sort:22},
    {name:'Intel Core i5-13600KF',score:36392,price:274.0,value:132.8,sort:22.5},
    {name:'AMD Ryzen 7 7700X',score:35472,price:228.5,value:155.2,sort:23},
    {name:'AMD Ryzen 7 7700',score:34307,price:223.75,value:153.3,sort:24},
    {name:'AMD Ryzen 7 7800X3D',score:34287,price:338.76,value:101.2,sort:25},
    {name:'Intel Core i7-12700K',score:34234,price:409.0,value:83.7,sort:26},
    {name:'Intel Core i7-12700KF',score:33899,price:265.0,value:127.9,sort:27},
    {name:'AMD Ryzen 9 3900X',score:32464,price:145.32,value:223.4,sort:28},
    {name:'AMD Ryzen 5 9600X',score:30034,price:179.67,value:167.2,sort:29},
    {name:'AMD Ryzen 5 9500F',score:28500,price:129.0,value:220.9,sort:29.5},
    {name:'Intel Core i7-12700',score:29747,price:336.5,value:88.4,sort:30},
    {name:'AMD Ryzen 7 5800X3D',score:28285,price:339.95,value:83.2,sort:31},
    {name:'AMD Ryzen 5 7600X',score:28263,price:139.08,value:203.2,sort:32},
    {name:'AMD Ryzen 7 5800X',score:27656,price:220.32,value:125.5,sort:33},
    {name:'Intel Core i5-12600K',score:27497,price:288.0,value:95.5,sort:34},
    {name:'Intel Core i5-12600KF',score:27300,price:269.0,value:101.5,sort:34.5},
    {name:'AMD Ryzen 5 7600',score:26962,price:209.8,value:128.5,sort:35},
    {name:'Intel Core i5-14490F',score:27059,price:159.0,value:170.2,sort:35.5},
    {name:'Intel Core i5-13490F',score:26762,price:189.0,value:141.6,sort:36},
    {name:'Intel Core i5-13400F',score:25800,price:169.0,value:152.7,sort:36.5},
    {name:'AMD Ryzen 7 5700X',score:26540,price:154.71,value:171.5,sort:37},
    {name:'AMD Ryzen 5 7500F',score:26509,price:161.42,value:164.2,sort:38},
    {name:'AMD Ryzen 7 5700X3D',score:26309,price:329.99,value:79.7,sort:39},
    {name:'Intel Core i5-14400F',score:25398,price:161.1,value:157.7,sort:40},
    {name:'Intel Core i5-14400',score:25200,price:179.0,value:140.8,sort:40.5},
    {name:'AMD Ryzen 7 5700G',score:24209,price:196.9,value:123.0,sort:40},
    {name:'AMD Ryzen 7 8700G',score:24000,price:329.0,value:72.9,sort:40.2},
    {name:'AMD Ryzen 5 8600G',score:21000,price:229.0,value:91.7,sort:44.5},
    {name:'AMD Ryzen 7 3800X',score:22946,price:429.99,value:53.4,sort:41},
    {name:'AMD Ryzen 7 3700X',score:22377,price:104.96,value:213.2,sort:42},
    {name:'AMD Ryzen 5 5600X',score:21821,price:149.99,value:145.5,sort:43},
    {name:'AMD Ryzen 5 5600',score:21488,price:99.38,value:216.2,sort:44},
    {name:'AMD Ryzen 5 5600G',score:19618,price:199.99,value:98.1,sort:45},
    {name:'Intel Core i5-12400F',score:19532,price:154.99,value:126.0,sort:46},
    {name:'AMD Ryzen 5 5500',score:19250,price:88.95,value:216.4,sort:47},
    {name:'AMD Ryzen 5 5500GT',score:19500,price:119.0,value:163.9,sort:47.5},
    {name:'Intel Core i5-12400',score:18826,price:192.0,value:98.1,sort:48},
    {name:'AMD Ryzen 5 3600X',score:18112,price:83.53,value:216.8,sort:49},
    {name:'AMD Ryzen 5 3600',score:17648,price:100.96,value:174.8,sort:50},
    {name:'AMD Ryzen 7 2700X',score:17412,price:265.0,value:65.7,sort:51},
    {name:'Intel Core i5-11400F',score:16865,price:129.0,value:130.7,sort:52},
    {name:'AMD Ryzen 5 2600',score:13119,price:265.0,value:49.5,sort:53},
    {name:'Intel Core i5-10400F',score:12092,price:225.0,value:53.7,sort:54},
    {name:'Intel Core i5-10400',score:11961,price:122.99,value:97.3,sort:55},
    {name:'AMD Ryzen 5 1600',score:11000,price:null,value:null,sort:56},
    // ===== 老桌面 CPU =====
    {name:'Intel Core i5-9400F',score:9464,price:108.0,value:87.6,sort:57,old:true},
    {name:'Intel Core i5-8400',score:9235,price:73.44,value:125.7,sort:58,old:true},
    {name:'Intel Core i7-7700',score:8639,price:78.2,value:110.5,sort:59,old:true},
    {name:'AMD FX-8350',score:8500,price:null,value:null,sort:60,old:true},
    {name:'Intel Core i7-6700',score:8032,price:93.0,value:86.4,sort:61,old:true},
    {name:'AMD FX-6300',score:6000,price:null,value:null,sort:62,old:true},
    {name:'Intel Core i5-6500',score:5599,price:59.0,value:94.9,sort:63,old:true},
    {name:'Intel Core i7-4790K',score:5200,price:null,value:null,sort:64,old:true},
    {name:'Intel Core i7-4770K',score:4800,price:null,value:null,sort:65,old:true},
    {name:'AMD Phenom II X4 955',score:4500,price:null,value:null,sort:66,old:true},
    {name:'Intel Core i7-3770K',score:4200,price:null,value:null,sort:67,old:true},
    {name:'Intel Core i7-2600K',score:3800,price:null,value:null,sort:68,old:true},
    {name:'Intel Core i5-4590',score:3500,price:null,value:null,sort:69,old:true},
    {name:'Intel Core i5-3570K',score:3200,price:null,value:null,sort:70,old:true},
    {name:'Intel Core i5-2500K',score:3000,price:null,value:null,sort:71,old:true},
    {name:'AMD Athlon II X4 640',score:2800,price:null,value:null,sort:72,old:true},
    {name:'Intel Core 2 Quad Q9550',score:1800,price:null,value:null,sort:73,old:true},
    {name:'AMD Athlon 64 X2 5000+',score:1500,price:null,value:null,sort:74,old:true},
    {name:'Intel Core 2 Duo E8400',score:1200,price:null,value:null,sort:75,old:true},
    {name:'Intel Core 2 Duo E7500',score:900,price:null,value:null,sort:76,old:true},
    {name:'Intel Pentium E5200',score:600,price:null,value:null,sort:77,old:true},
    {name:'AMD Athlon XP 3200+',score:500,price:null,value:null,sort:78,old:true},
    {name:'Intel Pentium 4 631',score:300,price:null,value:null,sort:79,old:true},
    // ===== 笔电 CPU（按性能混排到桌面CPU中，用小数sort插入）=====
    {name:'AMD Ryzen 9 7945HX',score:38000,price:null,value:null,sort:19.5,laptop:true},
    {name:'Intel Core i9-14900HX',score:35000,price:null,value:null,sort:22.5,laptop:true},
    {name:'Intel Core i9-13980HX',score:33000,price:null,value:null,sort:26.5,laptop:true},
    {name:'AMD Ryzen 9 7845HX',score:30000,price:null,value:null,sort:28.5,laptop:true},
    {name:'Intel Core i9-13900HX',score:29000,price:null,value:null,sort:29.5,laptop:true},
    {name:'Intel Core i7-14650HX',score:27000,price:null,value:null,sort:32.5,laptop:true},
    {name:'Intel Core i7-13700HX',score:26000,price:null,value:null,sort:38.5,laptop:true},
    {name:'AMD Ryzen 9 8945HS',score:24000,price:null,value:null,sort:40.5,laptop:true},
    {name:'AMD Ryzen AI 9 HX 370',score:28000,price:null,value:null,sort:31,laptop:true},
    {name:'AMD Ryzen AI 9 HX 375',score:29000,price:null,value:null,sort:30.5,laptop:true},
    {name:'AMD Ryzen AI 7 350',score:23000,price:null,value:null,sort:41,laptop:true},
    {name:'AMD Ryzen AI 5 330',score:18000,price:null,value:null,sort:50,laptop:true},
    {name:'AMD Ryzen AI Max+ 392',score:33000,price:null,value:null,sort:26,laptop:true},
    {name:'AMD Ryzen AI Max PRO 385',score:32000,price:null,value:null,sort:27.5,laptop:true},
    {name:'AMD Ryzen AI Max+ 388',score:31000,price:null,value:null,sort:28.5,laptop:true},
    {name:'AMD Ryzen AI 9 HX 475',score:30000,price:null,value:null,sort:29,laptop:true},
    {name:'AMD Ryzen AI 9 HX 470',score:29500,price:null,value:null,sort:29.5,laptop:true},
    {name:'AMD Ryzen AI 9 465',score:27000,price:null,value:null,sort:32,laptop:true},
    {name:'AMD Ryzen AI 7 445',score:22000,price:null,value:null,sort:43,laptop:true},
    {name:'AMD Ryzen AI 5 430',score:17000,price:null,value:null,sort:51,laptop:true},
    {name:'AMD Ryzen AI Max+ 395',score:32000,price:null,value:null,sort:27,laptop:true},
    {name:'AMD Ryzen 9 6900HX',score:23000,price:null,value:null,sort:41.5,laptop:true},
    {name:'AMD Ryzen 7 8845HS',score:22000,price:null,value:null,sort:42.5,laptop:true},
    {name:'Intel Core Ultra 9 285H',score:22000,price:null,value:null,sort:42.6,laptop:true},
    {name:'Intel Core Ultra 7 265H',score:20500,price:null,value:null,sort:43.5,laptop:true},
    {name:'Intel Core Ultra X9 388H',score:26000,price:null,value:null,sort:33,laptop:true},
    {name:'Intel Core Ultra X9 378H',score:24500,price:null,value:null,sort:37,laptop:true},
    {name:'Intel Core Ultra X7 368H',score:23000,price:null,value:null,sort:40,laptop:true},
    {name:'Intel Core Ultra 7 366H',score:20000,price:null,value:null,sort:45,laptop:true},
    {name:'Intel Core Ultra 5 338H',score:16000,price:null,value:null,sort:54,laptop:true},
    {name:'Intel Core Ultra 9 386H',score:24000,price:null,value:null,sort:38,laptop:true},
    {name:'Intel Core Ultra X7 358H',score:21000,price:null,value:null,sort:44,laptop:true},
    {name:'Intel Core Ultra 7 355H',score:19000,price:null,value:null,sort:48,laptop:true},
    {name:'Intel Core Ultra 5 325H',score:15000,price:null,value:null,sort:55,laptop:true},
    {name:'Intel Core Ultra 7 255H',score:19500,price:null,value:null,sort:46.3,laptop:true},
    {name:'Intel Core Ultra 5 235H',score:16500,price:null,value:null,sort:52.4,laptop:true},
    {name:'Intel Core i7-13700H',score:21000,price:null,value:null,sort:44.5,laptop:true},
    {name:'AMD Ryzen 7 7840HS',score:20000,price:null,value:null,sort:45.5,laptop:true},
    {name:'Intel Core i7-12700H',score:19500,price:null,value:null,sort:46.5,laptop:true},
    {name:'Intel Core Ultra 7 155H',score:19000,price:null,value:null,sort:47.5,laptop:true},
    {name:'Intel Core i7-13620H',score:18000,price:null,value:null,sort:49.5,laptop:true},
    {name:'Intel Core i5-13500H',score:18000,price:null,value:null,sort:49.6,laptop:true},
    {name:'AMD Ryzen 5 7640HS',score:17000,price:null,value:null,sort:51.5,laptop:true},
    {name:'Intel Core i5-12500H',score:16500,price:null,value:null,sort:52.5,laptop:true},
    {name:'Intel Core Ultra 5 125H',score:16000,price:null,value:null,sort:53.1,laptop:true},
    {name:'AMD Ryzen 7 7735HS',score:16000,price:null,value:null,sort:53.2,laptop:true},
    {name:'AMD Ryzen 7 5800H',score:15000,price:null,value:null,sort:53.5,laptop:true},
    {name:'AMD Ryzen 5 7535HS',score:14000,price:null,value:null,sort:53.6,laptop:true},
    {name:'AMD Ryzen 5 5600H',score:12000,price:null,value:null,sort:55.5,laptop:true},
    {name:'AMD Ryzen 9 9955HX',score:40000,sort:17.75,laptop:true},
    {name:'AMD Ryzen 9 9955HX3D',score:42000,sort:17.6,laptop:true},
    {name:'AMD Ryzen 9 9950HX3D',score:41500,sort:17.65,laptop:true},
    {name:'AMD Ryzen 9 9845HX',score:37000,sort:21,laptop:true},
    {name:'AMD Ryzen 7 8745HX',score:31000,sort:28.5,laptop:true},
    {name:'Intel Core Ultra 9 290HX Plus',score:43000,sort:17.5,laptop:true},
    {name:'Intel Core Ultra 7 270HX Plus',score:40500,sort:17.8,laptop:true},
    {name:'Intel Core Ultra 9 285HX',score:41000,sort:17.7,laptop:true},
    {name:'Intel Core Ultra 9 275HX',score:39000,sort:17.85,laptop:true},
    {name:'Intel Core Ultra 7 251HX',score:36000,sort:22.5,laptop:true},
    {name:'AMD Ryzen 9 3950X',score:39500,sort:18.5},
    {name:'AMD Ryzen 7 9850HX',score:36000,sort:22.49,laptop:true},
    {name:'Intel Core i7-14700HX',score:34000,sort:26.25,laptop:true},
    {name:'Intel Core i7-14700H',score:31000,sort:28.25,laptop:true},
    {name:'AMD Ryzen 7 9700HS',score:30000,sort:29.25,laptop:true},
    {name:'Intel Core i9-12900HX',score:30000,sort:29.375,laptop:true},
    {name:'Intel Core i7-12800HX',score:29000,sort:29.438,laptop:true},
    {name:'Intel Core i9-12900H',score:28000,sort:32.25,laptop:true},
    {name:'AMD Ryzen 7 7745HX',score:26000,sort:36.25,laptop:true},
    {name:'Intel Core i9-10900K',score:24500,sort:39.99},
    {name:'Intel Core i9-10900KF',score:24500,sort:39.98},
    {name:'AMD Ryzen 5 9600HS',score:24000,sort:40.75,laptop:true},
    {name:'Intel Core i5-14500H',score:24000,sort:40.875,laptop:true},
    {name:'AMD Ryzen 5 7645HX',score:22000,sort:42.8,laptop:true},
    {name:'Intel Core i5-13450HX',score:22000,sort:42.9,laptop:true},
    {name:'Intel Core i9-11900K',score:21500,sort:43.5},
    {name:'Intel Core i9-11900KF',score:21500,sort:43.75},
    {name:'AMD Ryzen 7 6800H',score:21000,sort:44.75,laptop:true},
    {name:'Intel Core i5-14450HX',score:21000,sort:44.875,laptop:true},
    {name:'Intel Core i7-10700K',score:20500,sort:44.938},
    {name:'Intel Core i7-10700KF',score:20500,sort:44.969},
    {name:'Intel Core i9-9900K',score:20000,sort:44.984},
    {name:'Intel Core i9-9900KF',score:20000,sort:44.992},
    {name:'Intel Core i7-11700K',score:20000,sort:44.996},
    {name:'Intel Core i7-11700KF',score:20000,sort:44.998},
    {name:'AMD Ryzen 9 5900HX',score:20000,sort:44.999,laptop:true},
    {name:'AMD Ryzen 7 6800U',score:20000,sort:44.989,laptop:true},
    {name:'Intel Core i7-10700',score:19000,sort:47.75},
    {name:'AMD Ryzen 9 5900H',score:19000,sort:47.875,laptop:true},
    {name:'Intel Core i7-11700',score:18500,sort:48.5},
    {name:'Intel Core i9-11980HK',score:17500,sort:50.5,laptop:true},
    {name:'AMD Ryzen 9 4900H',score:17000,sort:51.75,laptop:true},
    {name:'Intel Core i7-11800H',score:17000,sort:51.875,laptop:true},
    {name:'Intel Core i5-12450H',score:17000,sort:51.938,laptop:true},
    {name:'Intel Core i7-9700K',score:16500,sort:52.75},
    {name:'Intel Core i7-9700KF',score:16500,sort:52.875},
    {name:'Intel Core i9-10980HK',score:16500,sort:52.938,laptop:true},
    {name:'AMD Ryzen 7 4800H',score:16000,sort:52.969,laptop:true},
    {name:'AMD Ryzen 5 6600H',score:16000,sort:52.984,laptop:true},
    {name:'Intel Core i7-10875H',score:16000,sort:52.992,laptop:true},
    {name:'AMD Ryzen 7 4800U',score:15000,sort:52.996,laptop:true},
    {name:'AMD Ryzen 5 6600U',score:15000,sort:52.998,laptop:true},
    {name:'Intel Core i5-11400H',score:15000,sort:52.999,laptop:true},
    {name:'Intel Core i5-11600K',score:14500,sort:52.989},
    {name:'Intel Core i5-11600KF',score:14500,sort:52.979},
    {name:'Intel Core i5-10600K',score:14000,sort:52.959},
    {name:'Intel Core i5-10600KF',score:14000,sort:52.949},
    {name:'AMD Ryzen 7 1800X',score:13000,sort:53.8},
    {name:'Intel Core i5-11500',score:13000,sort:53.9},
    {name:'AMD Ryzen 5 4600H',score:13000,sort:53.95,laptop:true},
    {name:'Intel Core i7-10750H',score:13000,sort:53.975,laptop:true},
    {name:'Intel Core i5-10500',score:12500,sort:53.987},
    {name:'Intel Core i7-8700K',score:12500,sort:53.993},
    {name:'Intel Core i5-9600K',score:12000,sort:54.5},
    {name:'AMD Ryzen 5 4600U',score:12000,sort:54.75,laptop:true},
    {name:'Intel Core i5-11300H',score:12000,sort:54.875,laptop:true},
    {name:'AMD Ryzen 7 1700X',score:11800,sort:55.75},
    {name:'AMD Ryzen 7 1700',score:11300,sort:55.875},
    {name:'AMD Ryzen 5 3500X',score:11000,sort:56.5},
    {name:'Intel Core i5-9600',score:11000,sort:56.75},
    {name:'Intel Core i3-14100F',score:11000,sort:56.875},
    {name:'Intel Core i3-14100',score:11000,sort:56.938},
    {name:'Intel Core i7-11370H',score:11000,sort:56.969,laptop:true},
    {name:'AMD Ryzen 5 3400G',score:10500,sort:56.984},
    {name:'Intel Core i3-13100F',score:10500,sort:56.992},
    {name:'Intel Core i3-13100',score:10500,sort:56.996},
    {name:'AMD Ryzen 5 2400G',score:10000,sort:56.998},
    {name:'Intel Core i3-12300',score:10000,sort:56.999},
    {name:'AMD Ryzen 3 5400U',score:10000,sort:56.989,laptop:true},
    {name:'AMD Ryzen 3 5300G',score:9500,sort:56.979},
    {name:'Intel Core i3-12100F',score:9500,sort:56.959},
    {name:'Intel Core i3-12100',score:9500,sort:56.949},
    {name:'AMD Ryzen 3 3300X',score:9000,sort:58.5},
    {name:'AMD Ryzen 3 5100',score:9000,sort:58.75},
    {name:'Intel Core i5-10400H',score:9000,sort:58.875,laptop:true},
    {name:'AMD Ryzen 3 3100',score:8500,sort:60.5},
    {name:'Intel Core i3-10325',score:8500,sort:60.75},
    {name:'Intel Core i3-11300',score:8500,sort:60.875},
    {name:'Intel Core i5-10300H',score:8500,sort:60.938,laptop:true},
    {name:'Intel Core i3-10105F',score:8000,sort:61.5},
    {name:'Intel Core i3-11100F',score:8000,sort:61.75},
    {name:'AMD Ryzen 3 4300U',score:8000,sort:61.875,laptop:true},
    {name:'AMD Ryzen 3 2300X',score:7500,sort:61.938,old:true},
    {name:'AMD Ryzen 3 1300X',score:7300,sort:61.969,old:true},
    {name:'AMD FX-8300',score:7000,sort:61.984,old:true},
    {name:'Intel Xeon E3-1230 V5',score:7000,sort:61.992,old:true},
    {name:'AMD Ryzen 3 3200G',score:6500,sort:61.996,old:true},
    {name:'Intel Core i3-9100F',score:6500,sort:61.998,old:true},
    {name:'Intel Core i3-9100',score:6500,sort:61.999,old:true},
    {name:'AMD Ryzen 3 1200',score:6300,sort:61.989,old:true},
    {name:'AMD Phenom II X6 1090T',score:6000,sort:62.5,old:true},
    {name:'AMD FX-4300',score:4500,sort:66.5,old:true},
    {name:'Intel Pentium G6400',score:4000,sort:67.5,old:true},
    {name:'Intel Pentium G5400',score:3800,sort:68.5,old:true},
    {name:'Intel Celeron G5905',score:2700,sort:72.5,old:true},
    {name:'Intel Celeron G4900',score:2500,sort:72.75,old:true},
],
  gpu: [
    // ===== 桌面 GPU（经典天梯顺序）=====
    {name:'GeForce RTX 5090',score:38995,price:2869.36,value:13.6,sort:1},
    {name:'GeForce RTX 5090 D',score:36500,price:1649.0,value:22.1,sort:2},
    {name:'GeForce RTX 5090 D v2',score:37500,price:1749.0,value:21.4,sort:2.5},
    {name:'GeForce RTX 4090',score:38032,price:4399.0,value:8.6,sort:2},
    {name:'GeForce RTX 5080',score:35643,price:1869.46,value:19.1,sort:3},
    {name:'GeForce RTX 4080 SUPER',score:34214,price:1790.0,value:19.1,sort:4},
    {name:'GeForce RTX 4080',score:34441,price:1594.2,value:21.6,sort:5},
    {name:'GeForce RTX 5070 Ti',score:32335,price:1249.99,value:25.9,sort:6},
    {name:'GeForce RTX 4070 Ti SUPER',score:31845,price:1455.0,value:21.9,sort:7},
    {name:'GeForce RTX 4070 Ti',score:31511,price:1345.0,value:23.4,sort:8},
    {name:'Radeon RX 7900 XTX',score:31477,price:1820.99,value:17.3,sort:9},
    {name:'GeForce RTX 5070',score:28671,price:849.0,value:33.8,sort:10},
    {name:'GeForce RTX 4070 SUPER',score:29941,price:969.0,value:30.9,sort:11},
    {name:'GeForce RTX 3090 Ti',score:29206,price:2465.0,value:11.8,sort:12},
    {name:'Radeon RX 7900 XT',score:29117,price:849.99,value:34.3,sort:13},
    {name:'Radeon RX 6950 XT',score:28070,price:1190.0,value:23.6,sort:14},
    {name:'Radeon RX 9070 XT',score:26930,price:829.99,value:32.4,sort:15},
    {name:'Radeon RX 9070 GRE',score:23434,price:729.0,value:32.1,sort:22.5},
    {name:'Radeon RX 7900 GRE',score:27465,price:979.0,value:28.1,sort:17},
    {name:'GeForce RTX 4070',score:26854,price:849.0,value:31.6,sort:18},
    {name:'GeForce RTX 3080 Ti',score:26729,price:999.99,value:26.7,sort:19},
    {name:'Radeon RX 6900 XT',score:26634,price:985.0,value:27.0,sort:20},
    {name:'GeForce RTX 3090',score:26469,price:2199.0,value:12.0,sort:21},
    {name:'Radeon RX 9070',score:25401,price:579.99,value:43.8,sort:22},
    {name:'Radeon RX 7800 XT',score:24474,price:798.0,value:30.7,sort:23},
    {name:'Radeon RX 6800 XT',score:25118,price:945.0,value:26.6,sort:24},
    {name:'GeForce RTX 3080',score:24971,price:641.37,value:38.9,sort:25},
    {name:'GeForce RTX 3070 Ti',score:23158,price:795.0,value:29.1,sort:25},
    {name:'Radeon RX 7700 XT',score:22773,price:749.0,value:30.4,sort:26},
    {name:'GeForce RTX 5060 Ti 16GB',score:22625,price:768.19,value:29.5,sort:27},
    {name:'GeForce RTX 4060 Ti',score:22592,price:629.95,value:35.9,sort:28},
    {name:'GeForce RTX 4060 Ti 16GB',score:22538,price:459.99,value:49.0,sort:29},
    {name:'GeForce RTX 3070',score:22064,price:585.0,value:37.7,sort:30},
    {name:'Radeon RX 6800',score:22061,price:799.0,value:27.6,sort:31},
    {name:'GeForce RTX 5060 Ti 8GB',score:21834,price:490.86,value:44.5,sort:32},
    {name:'GeForce RTX 2080 Ti',score:21401,price:699.0,value:30.6,sort:33},
    {name:'Radeon RX 6750 XT',score:20696,price:685.0,value:30.2,sort:34},
    {name:'GeForce RTX 5060',score:20610,price:459.99,value:44.8,sort:35},
    {name:'GeForce RTX 3060 Ti',score:20212,price:399.99,value:50.5,sort:36},
    {name:'Radeon RX 9060 XT 16GB',score:20120,price:542.99,value:37.1,sort:37},
    {name:'Radeon RX 9060',score:16500,price:329.0,value:50.2,sort:48},
    {name:'Radeon RX 9050',score:13500,price:249.0,value:54.2,sort:60},
    {name:'Radeon RX 9050 4GB',score:11000,price:199.0,value:55.3,sort:72},
    {name:'Radeon RX 6700 XT',score:19717,price:659.0,value:29.9,sort:38},
    {name:'Radeon RX 9060 XT 8GB',score:19669,price:459.99,value:42.8,sort:39},
    {name:'Radeon RX 9060 XT LP',score:18500,price:399.0,value:46.4,sort:42},
    {name:'GeForce RTX 4060',score:19482,price:539.0,value:36.1,sort:40},
    {name:'GeForce RTX 2080 SUPER',score:19387,price:486.96,value:39.8,sort:41},
    {name:'GeForce GTX 1080 Ti',score:18596,price:479.0,value:38.8,sort:42},
    {name:'GeForce RTX 2080',score:18568,price:382.94,value:48.5,sort:43},
    {name:'Radeon RX 7650 GRE',score:18140,price:279.0,value:65.0,sort:44},
    {name:'GeForce RTX 2070 SUPER',score:18122,price:459.0,value:39.5,sort:45},
    {name:'Radeon RX 7600 XT',score:17359,price:779.0,value:22.3,sort:46},
    {name:'Radeon RX 6650 XT',score:17104,price:540.0,value:31.7,sort:47},
    {name:'GeForce RTX 5050',score:16737,price:409.99,value:40.8,sort:48},
    {name:'GeForce RTX 3060 12GB',score:16700,price:459.99,value:36.3,sort:49},
    {name:'GeForce RTX 2060 SUPER',score:16456,price:575.0,value:28.6,sort:50},
    {name:'Radeon RX 6600 XT',score:16446,price:495.0,value:33.2,sort:51},
    {name:'Radeon RX 7600',score:16438,price:339.99,value:48.3,sort:52},
    {name:'Intel Arc B580',score:16101,price:249.99,value:64.4,sort:53},
    {name:'Intel Arc B570',score:14500,price:219.0,value:66.2,sort:53.5},
    {name:'GeForce RTX 2070',score:16051,price:585.0,value:27.4,sort:54},
    {name:'Radeon RX 5700 XT',score:16025,price:229.99,value:69.7,sort:55},
    {name:'Radeon RX 5600 XT',score:15800,price:299.0,value:52.8,sort:55.5},
    {name:'Radeon RX 5500 XT',score:12500,price:169.0,value:74.0,sort:67.5},
    {name:'GeForce GTX 1080',score:15606,price:379.0,value:41.2,sort:56},
    {name:'Radeon RX 6600',score:15039,price:459.0,value:32.8,sort:57},
    {name:'GeForce GTX 1070 Ti',score:14680,price:320.0,value:45.9,sort:58},
    {name:'Radeon RX 5700',score:14193,price:647.0,value:21.9,sort:59},
    {name:'GeForce RTX 2060',score:14073,price:339.0,value:41.5,sort:60},
    {name:'GeForce GTX 980 Ti',score:13615,price:399.0,value:34.1,sort:61},
    {name:'GeForce GTX 1070',score:13510,price:299.0,value:45.2,sort:62},
    {name:'Intel Arc A770',score:13371,price:359.0,value:37.2,sort:63},
    {name:'GeForce GTX 1660 SUPER',score:12657,price:194.99,value:64.9,sort:64},
    {name:'Intel Arc A750',score:12648,price:206.46,value:61.3,sort:65},
    {name:'GeForce GTX 1660 Ti',score:12555,price:199.99,value:62.8,sort:66},
    {name:'GeForce RTX 3050 8GB',score:12459,price:259.99,value:47.9,sort:67},
    {name:'Intel Arc A580',score:12079,price:199.99,value:60.4,sort:68},
    {name:'Intel Arc A380',score:7500,price:139.0,value:54.0,sort:75},
    {name:'Intel Arc A310',score:5500,price:99.0,value:55.6,sort:78},
    {name:'GeForce GTX 1660',score:11610,price:262.62,value:44.2,sort:69},
    {name:'GeForce GTX 980',score:11071,price:248.45,value:44.6,sort:70},
    {name:'GeForce RTX 3050 6GB',score:10739,price:249.99,value:43.0,sort:71},
    {name:'GeForce GTX 1650 SUPER',score:10191,price:395.0,value:25.8,sort:72},
    {name:'GeForce GTX 1060',score:10016,price:299.0,value:33.5,sort:73},
    {name:'GeForce GTX 970',score:9637,price:359.0,value:26.8,sort:74},
    {name:'Radeon RX 6500 XT',score:9615,price:249.99,value:38.5,sort:75},
    {name:'Radeon RX 580',score:8782,price:169.99,value:51.7,sort:76},
    {name:'GeForce GTX 1650',score:7868,price:289.0,value:27.2,sort:77},
    {name:'Radeon RX 6400',score:7756,price:305.02,value:25.4,sort:78},
    {name:'GeForce GTX 1050 Ti',score:6368,price:213.1,value:29.9,sort:79},
    {name:'GeForce GTX 1050',score:5053,price:134.99,value:37.4,sort:80},
    {name:'GeForce GTX 1630',score:4972,price:189.99,value:26.2,sort:81},
    // ===== 老桌面 GPU =====
    {name:'Radeon R9 290',score:8000,price:null,value:null,sort:82,old:true},
    {name:'Radeon R9 380',score:7000,price:null,value:null,sort:83,old:true},
    {name:'GeForce GTX 960',score:6500,price:null,value:null,sort:84,old:true},
    {name:'Radeon RX 560',score:5500,price:null,value:null,sort:85,old:true},
    {name:'GeForce GTX 750 Ti',score:4500,price:null,value:null,sort:86,old:true},
    {name:'GeForce GTX 660',score:4000,price:null,value:null,sort:87,old:true},
    {name:'Radeon HD 7870',score:4000,price:null,value:null,sort:88,old:true},
    {name:'GeForce GTX 750',score:3500,price:null,value:null,sort:89,old:true},
    {name:'GeForce GTX 560 Ti',score:3000,price:null,value:null,sort:90,old:true},
    {name:'Radeon HD 6850',score:2500,price:null,value:null,sort:91,old:true},
    {name:'GeForce GTX 460',score:2000,price:null,value:null,sort:92,old:true},
    {name:'Radeon HD 5770',score:1500,price:null,value:null,sort:93,old:true},
    {name:'GeForce 8800 GT',score:1200,price:null,value:null,sort:94,old:true},
    {name:'GeForce GTS 450',score:1000,price:null,value:null,sort:95,old:true},
    {name:'GeForce 9800 GT',score:800,price:null,value:null,sort:96,old:true},
    {name:'Radeon X1950 Pro',score:800,price:null,value:null,sort:97,old:true},
    // ===== 笔电 GPU =====
    {name:'GeForce RTX 5090 Laptop',score:22000,price:null,value:null,sort:98,laptop:true},
    {name:'Radeon RX 7900M',score:16000,price:null,value:null,sort:99.5,laptop:true},
    {name:'Radeon RX 9080M',score:20000,price:null,value:null,sort:96,laptop:true},
    {name:'Radeon RX 9070M XT',score:16500,price:null,value:null,sort:99,laptop:true},
    {name:'Radeon RX 9070M',score:13500,price:null,value:null,sort:103,laptop:true},
    {name:'Radeon RX 9070S',score:12500,price:null,value:null,sort:105,laptop:true},
    {name:'Radeon RX 9060M',score:10500,price:null,value:null,sort:108,laptop:true},
    {name:'Radeon RX 9060S',score:9500,price:null,value:null,sort:110,laptop:true},
    {name:'Intel Arc G3',score:7000,price:null,value:null,sort:113,laptop:true},
    {name:'Intel Arc G3 Extreme',score:9000,price:null,value:null,sort:111,laptop:true},
    {name:'Radeon RX 7800M',score:13000,price:null,value:null,sort:103.5,laptop:true},
    {name:'GeForce RTX 4090 Laptop',score:18000,price:null,value:null,sort:99,laptop:true},
    {name:'GeForce RTX 5080 Laptop',score:17000,price:null,value:null,sort:100,laptop:true},
    {name:'GeForce RTX 4080 Laptop',score:15000,price:null,value:null,sort:101,laptop:true},
    {name:'GeForce RTX 5070 Ti Laptop',score:14000,price:null,value:null,sort:102,laptop:true},
    {name:'GeForce RTX 4070 Ti Laptop',score:13000,price:null,value:null,sort:103,laptop:true},
    {name:'GeForce RTX 5070 Laptop',score:12000,price:null,value:null,sort:104,laptop:true},
    {name:'GeForce RTX 5070 Laptop 12GB',score:12500,price:null,value:null,sort:103.5,laptop:true},
    {name:'GeForce RTX 5060 Ti Laptop',score:11500,price:null,value:null,sort:104.5,laptop:true},
    {name:'GeForce RTX 4070 Laptop',score:11000,price:null,value:null,sort:105,laptop:true},
    {name:'GeForce RTX 5060 Laptop',score:10000,price:null,value:null,sort:106,laptop:true},
    {name:'Radeon RX 7700S',score:9500,price:null,value:null,sort:107,laptop:true},
    {name:'GeForce RTX 4060 Laptop',score:9000,price:null,value:null,sort:108,laptop:true},
    {name:'Radeon RX 7600M XT',score:8500,price:null,value:null,sort:109,laptop:true},
    {name:'Radeon RX 7600M',score:7500,price:null,value:null,sort:111.5,laptop:true},
    {name:'GeForce RTX 5050 Laptop',score:8000,price:null,value:null,sort:110,laptop:true},
    {name:'GeForce RTX 5050 Laptop 9GB',score:8500,price:null,value:null,sort:109.5,laptop:true},
    {name:'Radeon RX 7600S',score:7500,price:null,value:null,sort:111,laptop:true},
    {name:'GeForce RTX 4050 Laptop',score:7000,price:null,value:null,sort:112,laptop:true},
    {name:'GeForce RTX 3050 Laptop',score:5500,price:null,value:null,sort:113,laptop:true},
    {name:'GeForce GTX 1650 Laptop',score:4000,price:null,value:null,sort:114,laptop:true},
    {name:'Radeon RX Vega 64',score:15400,sort:56.5},
    {name:'Radeon RX 590',score:9500,sort:75.5},
    {name:'Radeon RX 480',score:8200,sort:76.5},
    {name:'Radeon RX 570',score:7250,sort:78.5},
    {name:'Radeon RX 470',score:7000,sort:78.75},
    {name:'GeForce GTX 950',score:5700,sort:79.5},
],
  chipset: [
    {year:'2024',intel:'Z890 / B860',amd:'X870 / B850'},
    {year:'2022',intel:'Z790 / B760',amd:'X670 / B650'},
    {year:'2021',intel:'Z690 / B660',amd:'X570 / B550'},
    {year:'2020',intel:'Z590 / B560',amd:'X570 / B550'},
    {year:'2019',intel:'Z490 / B460',amd:'X570 / B450'},
    {year:'2018',intel:'Z390 / B360',amd:'X470 / B450'},
    {year:'2017',intel:'Z370 / B250',amd:'X370 / B350'},
    {year:'2016',intel:'Z270 / B250',amd:'X370 / B350'},
    {year:'2015',intel:'Z170 / B150',amd:'990X / 970'},
    {year:'2013',intel:'Z87 / B85',amd:'990FX / 970'},
    {year:'2011',intel:'Z68 / H67',amd:'990FX / 890GX'},
    {year:'2010',intel:'P55 / H55',amd:'790FX / 785G'},
    {year:'2009',intel:'X58',amd:'790FX / 790GX'},
    {year:'2007',intel:'P35 / P45',amd:'790FX / 770'},
    {year:'2006',intel:'975X / 965P',amd:'590SLI / 570X'},
    {year:'2005',intel:'955X / 945P',amd:'CrossFire Xpress 3200'},
    {year:'2004',intel:'915P / 865PE',amd:'nForce3 / K8T800'},
    {year:'2003',intel:'875P / 865P',amd:'nForce2 / KT400'},
    {year:'2002',intel:'850E / 845D',amd:'nForce2 / KT266A'},
    {year:'2001',intel:'850 / 845',amd:'nForce / KT266'},
    {year:'2000',intel:'815E / 815EP',amd:'KT133A / Apollo KT133'},
    {year:'1999',intel:'440BX / 440ZX',amd:'KX133 / Apollo KX133'},
    {year:'1998',intel:'440LX / 440EX',amd:'--'},
    {year:'1997',intel:'430TX / 430VX',amd:'--'},
    {year:'1996',intel:'430HX / 430VX',amd:'--'},
    {year:'1995',intel:'430NX / 420EX',amd:'--'}
  ]
};

let FX = 6.6763; // 静态汇率（USD→CNY），更新于 2026-10-21
let currentCat = 'cpu';
let currentVendor = 'all';
let currentSort = 'score';
let currentQuery = '';

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

// 性能档位标签：旗舰 / 高端 / 主流 / 入门
function getCategory(score, allScores){
  if(!allScores || allScores.length < 4) return '';
  const sorted = [...allScores].sort((a,b) => b - a);
  const rank = sorted.indexOf(score);
  const pct = rank / sorted.length;
  if(pct < 0.05) return '<span class="cat-tag cat-flagship">旗舰</span>';
  if(pct < 0.20) return '<span class="cat-tag cat-high">高端</span>';
  if(pct < 0.50) return '<span class="cat-tag cat-mid">主流</span>';
  return '<span class="cat-tag cat-entry">入门</span>';
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
      if(a.value == null && b.value == null) return b.score - a.score;
      if(a.value == null) return 1;
      if(b.value == null) return -1;
      return b.value - a.value;
    });
  } else {
    list.sort((a,b) => b.score - a.score);
  }
  return list;
}

function renderLadder(list){
  const container = document.getElementById('mainContent');
  const allScores = list.map(it => it.score);
  
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
  
  let leftModels = [];
  let midModels = [];
  let rightModels = [];
  
  if(currentCat === 'cpu'){
    leftModels = list.filter(it => it.vendor === 'intel');
    rightModels = list.filter(it => it.vendor === 'amd');
  } else {
    leftModels = list.filter(it => it.vendor === 'intel');
    midModels = list.filter(it => it.vendor === 'nvidia');
    rightModels = list.filter(it => it.vendor === 'amd');
  }
  
  let leftHtml = `<div class="vendor-header ${currentCat === 'cpu' ? 'intel' : 'intel'}">${currentCat === 'cpu' ? 'Intel' : 'Intel Arc'}</div><div class="model-list">`;
  leftModels.forEach((it, i) => {
    const laptopTag = it.laptop ? '<span class="laptop-tag">笔电</span>' : '';
    const catTag = getCategory(it.score, allScores);
    leftHtml += `<div class="model ${i === 0 ? 'top' : ''} ${it.old ? 'old' : ''}" title="${it.name}"><span>${shortName(it.name)}${catTag}${laptopTag}</span><span class="score num">${fmtNum(it.score)}</span></div>`;
  });
  leftHtml += '</div>';
  
  let midHtml = '';
  if(currentCat === 'gpu' && midModels.length){
    midHtml = `<div class="vendor-header nvidia">NVIDIA</div><div class="model-list">`;
    midModels.forEach((it, i) => {
      const laptopTag = it.laptop ? '<span class="laptop-tag">笔电</span>' : '';
      const catTag = getCategory(it.score, allScores);
      midHtml += `<div class="model ${i === 0 ? 'top' : ''} ${it.old ? 'old' : ''}" title="${it.name}"><span>${shortName(it.name)}${catTag}${laptopTag}</span><span class="score num">${fmtNum(it.score)}</span></div>`;
    });
    midHtml += '</div>';
  }
  
  let rightHtml = `<div class="vendor-header amd">AMD</div><div class="model-list">`;
  rightModels.forEach((it, i) => {
    const laptopTag = it.laptop ? '<span class="laptop-tag">笔电</span>' : '';
    const catTag = getCategory(it.score, allScores);
    rightHtml += `<div class="model ${i === 0 ? 'top' : ''} ${it.old ? 'old' : ''}" title="${it.name}"><span>${shortName(it.name)}${catTag}${laptopTag}</span><span class="score num">${fmtNum(it.score)}</span></div>`;
  });
  rightHtml += '</div>';
  
  const gridCols = currentCat === 'gpu' ? '1fr 1fr 40px 1fr' : '1fr 50px 1fr';
  container.innerHTML = `
    <div class="ladder" style="grid-template-columns:${gridCols}">
      <div class="ladder-left">${leftHtml}</div>
      ${midHtml ? `<div class="ladder-mid">${midHtml}</div>` : ''}
      <div class="ladder-center">
        <span class="perf-label">最高性能</span>
        <span class="perf-label">高性能</span>
        <span class="perf-label">中性能</span>
        <span class="perf-label">低性能</span>
        <span class="perf-label">入门性能</span>
        <span class="perf-label">最低性能</span>
      </div>
      <div class="ladder-right">${rightHtml}</div>
    </div>
  `;
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
    html += `<tr>
      <td class="rank num">${i+1}</td>
      <td class="name">${it.name}${laptopTag}</td>
      <td><span class="vchip ${it.vendor}">${it.vendor === 'amd' ? 'AMD' : it.vendor === 'intel' ? 'Intel' : 'NVIDIA'}</span></td>
      <td class="score num">${fmtNum(it.score)}</td>
      <td class="price num">${fmtPrice(it.price)}</td>
      <td class="value num">${fmtVal(it.value)}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
  document.getElementById('fCount').textContent = list.length;
}

function refresh(){
  const list = getFiltered();
  renderLadder(list);
  renderTable(list);
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

// 初始化（等 DOM 完全加载后再渲染）
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => { setTimeout(refresh, 0); });
} else {
  setTimeout(refresh, 0);
}

// 汇率采用内置静态值（见上方 FX 定义），更新于 2026-10-21，无外部网络请求
