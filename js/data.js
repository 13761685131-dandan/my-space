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
  return {
    mood: [
      { date:'2026-03-01', mood:'calm',    text:'周末在家看书，窗外有阳光，很安静' },
      { date:'2026-03-02', mood:'happy',   text:'和朋友吃了火锅，聊了很多近况' },
      { date:'2026-03-03', mood:'happy',   text:'今天工作效率很高' },
      { date:'2026-03-04', mood:'calm',    text:'早起跑了步，空气很好' },
      { date:'2026-03-05', mood:'anxious', text:'项目评审明天，有点紧张' },
      { date:'2026-03-06', mood:'excited', text:'评审通过了！团队一起庆祝' },
      { date:'2026-03-07', mood:'happy',   text:'周六去了公园，樱花开了' },
      { date:'2026-03-08', mood:'happy',   text:'收到了一束花，很惊喜' },
      { date:'2026-03-09', mood:'calm',    text:'在家做了一顿饭，慢慢享受' },
      { date:'2026-03-10', mood:'sad',     text:'看了一部很感动的电影' },
      { date:'2026-03-11', mood:'calm',    text:'读完了《百年孤独》，很震撼' },
      { date:'2026-03-12', mood:'happy',   text:'发现了一家超棒的拉面店' },
      { date:'2026-03-13', mood:'excited', text:'订了去厦门的机票！' },
      { date:'2026-03-14', mood:'happy',   text:'今天穿了一件新衬衫，被夸了' },
      { date:'2026-03-15', mood:'calm',    text:'写完了本周的读书笔记' },
      { date:'2026-03-16', mood:'happy',   text:'和妈妈打了电话，她身体不错' },
      { date:'2026-03-17', mood:'anxious', text:'工作上的事情有点多' },
      { date:'2026-03-18', mood:'calm',    text:'整理了房间，断舍离了一些旧东西' },
      { date:'2026-03-19', mood:'happy',   text:'尝试了一家新的咖啡馆' },
      { date:'2026-03-20', mood:'excited', text:'春分！今天白昼比黑夜长了' },
      { date:'2026-03-21', mood:'calm',    text:'下班后散步，看到了很美的晚霞' },
      { date:'2026-03-22', mood:'happy',   text:'学了一个新的吉他和弦' },
      { date:'2026-03-23', mood:'sad',     text:'有点想家' },
      { date:'2026-03-24', mood:'happy',   text:'收到了朋友的明信片' },
      { date:'2026-03-25', mood:'calm',    text:'今天什么都没做，就是休息' },
      { date:'2026-03-26', mood:'excited', text:'厦门旅行明天出发！' },
      { date:'2026-03-27', mood:'happy',   text:'到了厦门，海风好舒服' },
      { date:'2026-03-28', mood:'excited', text:'鼓浪屿太美了' },
      { date:'2026-03-29', mood:'happy',   text:'吃到了超新鲜的海蛎煎' },
      { date:'2026-03-30', mood:'calm',    text:'坐在海边发呆' },
      { date:'2026-03-31', mood:'happy',   text:'旅行虽然累但很充实' },
    ],
    learn: [
      { date:'2026-03-05', text:'开始读《百年孤独》' },
      { date:'2026-03-11', text:'读完了《百年孤独》，结尾太震撼' },
      { date:'2026-03-18', text:'开始学习 SwiftUI' },
    ],
    travel: [
      { date:'2026-03-27', text:'厦门 · 入住海边民宿，推开窗就是大海' },
      { date:'2026-03-28', text:'鼓浪屿：老别墅、日光岩俯瞰全岛' },
      { date:'2026-03-29', text:'沙坡尾：逛小店，看日落' },
    ],
    outfit: [
      { date:'2026-03-25', text:'米色衬衫+深绿阔腿裤+棕色乐福鞋' },
      { date:'2026-03-19', text:'白色针织开衫+牛仔裤+帆布鞋' },
      { date:'2026-03-14', text:'浅蓝条纹衬衫+白色直筒裤' },
      { date:'2026-03-08', text:'碎花长裙，风一吹裙摆飘起来' },
      { date:'2026-03-02', text:'卡其风衣+黑色高领+阔腿西裤' },
    ],
    food: [
      { date:'2026-03-29', text:'厦门海蛎煎！海蛎超级新鲜' },
      { date:'2026-03-28', text:'鼓浪屿叶氏麻糍，糯叽叽' },
      { date:'2026-03-27', text:'沙茶面，汤底浓郁' },
      { date:'2026-03-19', text:'新咖啡馆，拿铁拉花是一只天鹅' },
      { date:'2026-03-12', text:'公司附近拉面店，猪骨汤熬了12小时' },
      { date:'2026-03-09', text:'自制番茄牛腩，炖了2小时' },
      { date:'2026-03-02', text:'火锅，毛肚鹅肠黄喉辣得过瘾' },
    ],
    career: [
      { date:'2026-03-20', text:'季度项目上线，用户反馈不错' },
      { date:'2026-03-06', text:'评审通过！等了很久的好消息' },
    ]
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
