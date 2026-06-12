/* =================================================================
   My Space · Data Store · localStorage powered
   ================================================================= */

// SVG line-art icons (stroke only, no fill)
const ICONS = {
  mood:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><circle cx="12" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="10" r="1" fill="currentColor" stroke="none"/></svg>`,
  learn:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  travel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  outfit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L9 6H4l2 5-2 11h16l-2-11 2-5h-5l-3-4z"/></svg>`,
  food:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  career: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`
};

const MODULES = {
  mood:   { name:'情绪志', icon: ICONS.mood, emoji:'💭' },
  learn:  { name:'学习志', icon: ICONS.learn, emoji:'📚' },
  travel: { name:'旅行志', icon: ICONS.travel, emoji:'✈️' },
  outfit: { name:'穿搭志', icon: ICONS.outfit, emoji:'👗' },
  food:   { name:'美食志', icon: ICONS.food, emoji:'🍜' },
  career: { name:'职场志', icon: ICONS.career, emoji:'🏆' }
};

const MOOD_TYPES = {
  happy:   { emoji:'😊', label:'开心', c:'mood-happy', v:5 },
  calm:    { emoji:'😌', label:'平静', c:'mood-calm', v:3 },
  excited: { emoji:'🤩', label:'兴奋', c:'mood-excited', v:5 },
  sad:     { emoji:'😢', label:'低落', c:'mood-sad', v:1 },
  anxious: { emoji:'😰', label:'焦虑', c:'mood-anxious', v:2 },
  angry:   { emoji:'😤', label:'烦躁', c:'mood-angry', v:1 }
};

// ===== localStorage 核心 =====
const STORE_KEY = 'my-space-data';

function seedData() {
  // 首次使用为空，数据由用户创建
  return {
    mood: [],
    learn: [],
    travel: [],
    outfit: [],
    food: [],
    career: []
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  const s = seedData();
  saveStore(s);
  return s;
}

function saveStore(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch(e) {}
}

// 全局数据（所有读写通过这里）
const Store = loadStore();

// 辅助 getter
function getModuleData(key) { return Store[key] || []; }
function getModuleCount(key) { return getModuleData(key).length; }
function getCurrentMonthCount(key) {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  return getModuleData(key).filter(d => d.date.startsWith(ym)).length;
}

// 添加记录
function addRecord(key, record) {
  if (!Store[key]) Store[key] = [];
  Store[key].push(record);
  saveStore(Store);
}

// 删除记录
function removeRecord(key, idx) {
  if (idx >= 0 && idx < Store[key].length) {
    Store[key].splice(idx, 1);
    saveStore(Store);
  }
}

// 获取本月所有记录（混合）
function getThisMonthAll() {
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const all = [];
  Object.keys(Store).forEach(k => {
    Store[k].forEach(r => {
      if (r.date.startsWith(ym)) all.push({ ...r, module: k });
    });
  });
  return all.sort((a,b) => b.date.localeCompare(a.date));
}

// 获取某天所有记录
function getDateAll(dateStr) {
  const all = [];
  Object.keys(Store).forEach(k => {
    Store[k].filter(r => r.date === dateStr).forEach(r => {
      all.push({ ...r, module: k });
    });
  });
  return all;
}

// 动态生成最近剪影
function getRecentCuts(n = 8) {
  const all = [];
  Object.keys(Store).forEach(k => {
    Store[k].forEach(r => { all.push({ ...r, module: k }); });
  });
  all.sort((a,b) => b.date.localeCompare(a.date));
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return all.slice(0, n).map(r => {
    const d = new Date(r.date);
    const icons = { mood:'💭', learn:'📚', travel:'✈️', outfit:'👗', food:'🍜', career:'🏆' };
    const tags = { mood:'mood', learn:'learn', travel:'travel', outfit:'style', food:'food', career:'career' };
    const names = { mood:'情绪志', learn:'学习志', travel:'旅行志', outfit:'穿搭志', food:'美食志', career:'职场志' };
    return {
      module: r.module,
      icon: icons[r.module]||'🌿',
      text: r.text||'',
      date: mon[d.getMonth()]+' '+d.getDate(),
      tag: names[r.module],
      tag_en: tags[r.module]||'',
      date_en: mon[d.getMonth()]+' '+d.getDate()
    };
  });
}

// 幸福指数
function calcHappiness() {
  const moods = getModuleData('mood');
  if (!moods.length) return 0;
  const good = moods.filter(d => d.mood==='happy'||d.mood==='excited').length;
  return Math.round(good / moods.length * 100);
}

// 关键词提取
function extractKeywords(records) {
  const stopWords = new Set(['今天','觉得','感觉','一个','非常','已经','什么','有点','一些','很多','这个','那个','因为','所以','但是','不过','很好','好看','好吃','好舒服','开心','去了','到了','吃了','穿了','看了一','了一','了新','了好','了很']);
  const freq = {};
  for (let r of records) {
    const t = r.text||'';
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i <= t.length - len; i++) {
        const chunk = t.slice(i, i+len);
        if (/^[\u4e00-\u9fa5]+$/.test(chunk) && !stopWords.has(chunk)) {
          freq[chunk] = (freq[chunk]||0) + 1;
        }
      }
    }
  }
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,6).map(e=>e[0]);
}
