/* =================================================================
   My Space · Data Store · localStorage powered
   ================================================================= */
const MODULES = {
  mood:   { name:'情绪志', icon:'💭', emoji:'💭' },
  learn:  { name:'学习志', icon:'📚', emoji:'📚' },
  travel: { name:'旅行志', icon:'✈️', emoji:'✈️' },
  outfit: { name:'穿搭志', icon:'👗', emoji:'👗' },
  food:   { name:'美食志', icon:'🍜', emoji:'🍜' },
  career: { name:'职场志', icon:'🏆', emoji:'🏆' }
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
