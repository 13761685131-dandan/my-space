/* =================================================================
   My Space · Sample Data
   ================================================================= */

const MODULES = {
  mood:   { name:'情绪志', icon:'💭' },
  learn:  { name:'学习志', icon:'📚' },
  travel: { name:'旅行志', icon:'✈️' },
  outfit: { name:'穿搭志', icon:'👗' },
  food:   { name:'美食志', icon:'🍜' },
  career: { name:'职场志', icon:'🏆' }
};

const MOOD_TYPES = {
  happy:   { emoji:'😊', label:'开心', c:'mood-happy' },
  calm:    { emoji:'😌', label:'平静', c:'mood-calm' },
  excited: { emoji:'🤩', label:'兴奋', c:'mood-excited' },
  sad:     { emoji:'😢', label:'低落', c:'mood-sad' },
  anxious: { emoji:'😰', label:'焦虑', c:'mood-anxious' },
  angry:   { emoji:'😤', label:'烦躁', c:'mood-angry' }
};

// ===== Mood · March =====
const sampleMoodData = [
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
];

// ===== Learn =====
const sampleLearnData = [
  { date:'2026-03-05', text:'开始读《百年孤独》，马尔克斯的魔幻现实主义世界真是令人着迷' },
  { date:'2026-03-11', text:'读完了《百年孤独》，结尾那段太震撼了，整个家族像风中的尘埃一样消散' },
  { date:'2026-03-18', text:'开始学习 SwiftUI，想做一个自己的小 App' },
  { date:'2026-02-20', text:'读完了《原子习惯》，每天进步1%，一年后就是37倍' },
  { date:'2026-02-08', text:'学完了 Figma 基础课程，做了一套属于自己的设计规范' },
  { date:'2026-01-15', text:'读完《也许你该找个人聊聊》，被心理咨询师和来访者的故事深深打动' },
  { date:'2026-01-03', text:'开始学日语，五十音图背完了！' },
];

// ===== Travel =====
const sampleTravelData = [
  { date:'2026-03-27', text:'厦门 · 第一天：入住海边民宿，推开窗就是大海，海风带着咸味' },
  { date:'2026-03-28', text:'厦门 · 鼓浪屿：老别墅、风琴博物馆、张三疯奶茶，日光岩上俯瞰全岛' },
  { date:'2026-03-29', text:'厦门 · 沙坡尾：逛了很多有趣的小店，在避风坞看了日落' },
  { date:'2026-02-14', text:'苏州 · 拙政园里梅花开了，在平江路听了评弹' },
  { date:'2026-01-25', text:'杭州 · 西湖：雪后的西湖真的好安静，断桥上有情侣在拍照' },
];

// ===== Outfit =====
const sampleOutfitData = [
  { date:'2026-03-25', text:'米色宽松衬衫 + 深绿阔腿裤 + 棕色乐福鞋，春天的配色' },
  { date:'2026-03-19', text:'白色针织开衫 + 牛仔裤 + 帆布鞋，简简单单去咖啡馆' },
  { date:'2026-03-14', text:'新买了一件浅蓝条纹衬衫，搭配白色直筒裤，被同事夸了' },
  { date:'2026-03-08', text:'三八节穿了条碎花长裙，风一吹裙摆飘起来' },
  { date:'2026-03-02', text:'卡其风衣 + 黑色高领 + 阔腿西裤，上班穿搭利落又不失温柔' },
  { date:'2026-02-25', text:'灰色卫衣 + 骑行裤 + 老爹鞋，周末舒服最重要' },
  { date:'2026-02-18', text:'尝试了日系叠穿：白T打底 + 格子衬衫 + 牛仔外套' },
  { date:'2026-02-10', text:'黑色大衣 + 驼色围巾，冬天最后一套厚重穿搭' },
];

// ===== Food =====
const sampleFoodData = [
  { date:'2026-03-29', text:'厦门海蛎煎！在中山路附近的小摊，海蛎超级新鲜' },
  { date:'2026-03-28', text:'鼓浪屿上的叶氏麻糍，糯叽叽的，芝麻馅好香' },
  { date:'2026-03-27', text:'厦门的沙茶面，汤底浓郁，加了鱿鱼和虾' },
  { date:'2026-03-19', text:'新发现的咖啡馆，拿铁拉花是一只天鹅，坐了一下午' },
  { date:'2026-03-12', text:'公司附近新开的拉面店，猪骨汤熬了12小时，叉烧入口即化' },
  { date:'2026-03-09', text:'自己做了番茄牛腩，炖了2小时，配米饭绝了' },
  { date:'2026-03-02', text:'和朋友吃了火锅，毛肚、鹅肠、黄喉，辣得过瘾' },
  { date:'2026-02-28', text:'尝试做了提拉米苏，手指饼干泡咖啡的时候手抖泡多了' },
  { date:'2026-02-20', text:'打卡了一家日料店，刺身拼盘很新鲜，海胆寿司入口即化' },
  { date:'2026-02-12', text:'元宵节吃了汤圆，黑芝麻馅，还是小时候的味道' },
  { date:'2026-01-28', text:'烤了一个巴斯克芝士蛋糕，流心的质感太棒了' },
  { date:'2026-01-20', text:'东北菜馆里的锅包肉，外酥里嫩，酸甜口好开胃' },
];

// ===== Career =====
const sampleCareerData = [
  { date:'2026-03-20', text:'季度项目上线了，用户反馈不错，第一次独立负责一个完整的 feature' },
  { date:'2026-03-06', text:'评审通过了！准备了很久的晋升答辩，终于等到了好消息' },
  { date:'2026-02-15', text:'开始带新人了，第一次做 mentor，发现自己还挺喜欢教别人的' },
  { date:'2026-01-10', text:'年初定了 OKR，今年的目标是成为高级工程师' },
];

// ===== Counts =====
const sampleModuleCounts = {
  mood: 31, learn: 3, travel: 1, outfit: 8, food: 12, career: 2
};

// ===== Recent Cuts (with English) =====
const sampleCuts = [
  { module:'travel', icon:'✈️', text:'厦门 · 鼓浪屿：老别墅、风琴博物馆，日光岩上俯瞰全岛', date:'Mar 28', date_en:'Mar 28', tag:'旅行志', tag_en:'travel' },
  { module:'food',   icon:'🍜', text:'厦门海蛎煎！海蛎超级新鲜，老板说凌晨刚到的货', date:'Mar 29', date_en:'Mar 29', tag:'美食志', tag_en:'food' },
  { module:'mood',   icon:'💭', text:'春分到了，白昼比黑夜长了，感觉一切都在生长', date:'Mar 20', date_en:'Mar 20', tag:'情绪志', tag_en:'mood' },
  { module:'learn',  icon:'📚', text:'读完了《百年孤独》，魔幻现实主义太震撼了', date:'Mar 11', date_en:'Mar 11', tag:'学习志', tag_en:'learn' },
  { module:'career', icon:'🏆', text:'评审通过！准备了很久终于等到了好消息', date:'Mar 6', date_en:'Mar 6', tag:'职场志', tag_en:'career' },
  { module:'outfit', icon:'👗', text:'米色衬衫 + 深绿阔腿裤 + 棕色乐福鞋，春天的配色', date:'Mar 25', date_en:'Mar 25', tag:'穿搭志', tag_en:'style' },
  { module:'food',   icon:'🍜', text:'新开的拉面店，猪骨汤熬了12小时，叉烧入口即化', date:'Mar 12', date_en:'Mar 12', tag:'美食志', tag_en:'food' },
  { module:'mood',   icon:'💭', text:'到了厦门，海风好舒服，推开窗就是大海', date:'Mar 27', date_en:'Mar 27', tag:'情绪志', tag_en:'mood' },
];
