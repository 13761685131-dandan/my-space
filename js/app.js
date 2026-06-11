/* =================================================================
   My Space · App Logic v5
   localStorage 持久化 + 按日期导出
   ================================================================= */
let currentPage = 'home', currentPhoto = null, currentModule = 'mood';
let shareMode = 'month';       // 'month' | 'date'
let shareDate = '';            // YYYY-MM-DD
let shareTemplate = 'grid', shareRatio = '3:4';
let selectedIndices = new Set();

// ===== Navigation =====
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('page-' + page);
  if (t) t.classList.add('active');
  window.scrollTo({ top:0, behavior:'smooth' });
  if (page === 'home') renderHome();
  else if (page === 'mood') renderMoodDetail();
  else renderModuleDetail(page);
}

// ===== Home =====
function renderHome() {
  renderDate(); renderCuts(); renderStats(); renderMoodCompact(); renderExplore();
}

function renderDate() {
  const el = document.getElementById('headerDate'); if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

function renderCuts() {
  const el = document.getElementById('cutsScroll'); if (!el) return;
  const cuts = getRecentCuts();
  el.innerHTML = cuts.map(c =>
    `<div class="cut-card" onclick="navigateTo('${c.module}')"><span class="cut-emoji">${c.icon}</span><p class="cut-text">${c.text}</p><p class="cut-tag">${c.tag_en||c.tag}</p><p class="cut-date">${c.date_en||c.date}</p></div>`
  ).join('');
}

function renderStats() {
  const el = document.getElementById('statsGrid'); if (!el) return;
  const icons = { mood:'💭', learn:'📚', travel:'✈️', outfit:'👗', food:'🍜', career:'🏆' };
  const names = { mood:'Mood', learn:'Learn', travel:'Travel', outfit:'Style', food:'Food', career:'Career' };
  el.innerHTML = Object.keys(MODULES).map(k =>
    `<div class="stat-card" onclick="navigateTo('${k}')"><span class="stat-icon">${icons[k]}</span><span class="stat-num">${getCurrentMonthCount(k)}</span><span class="stat-label">${names[k]}</span></div>`
  ).join('');
}

function renderMoodCompact() {
  const el = document.getElementById('moodCalendarCompact'); if (!el) return;
  const now = new Date(); const y = now.getFullYear(), m = now.getMonth();
  const dim = new Date(y,m+1,0).getDate(), fd = new Date(y,m,1).getDay();
  let h = '<div class="cal-grid">';
  ['S','M','T','W','T','F','S'].forEach(d => h += `<div class="cal-day-header">${d}</div>`);
  for (let i=0;i<fd;i++) h+='<div class="cal-day empty"></div>';
  const moodData = getModuleData('mood');
  for (let d=1;d<=dim;d++){
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec = moodData.find(r=>r.date===ds);
    if(rec) h+=`<div class="cal-day ${MOOD_TYPES[rec.mood].c}" title="${rec.text}">${MOOD_TYPES[rec.mood].emoji}</div>`;
    else h+=`<div class="cal-day empty">${d}</div>`;
  }
  h+='</div>'; el.innerHTML = h;
  const leg = document.getElementById('moodLegend');
  if(leg) leg.innerHTML = Object.entries(MOOD_TYPES).map(([k,v])=>`<span><span class="mood-dot ${k}"></span>${v.label}</span>`).join('');
}

function renderExplore() {
  const el = document.getElementById('exploreGrid'); if (!el) return;
  const enNames = { mood:'Mood Journal', learn:'Learning', travel:'Travel', outfit:'Style', food:'Food', career:'Career' };
  el.innerHTML = Object.keys(MODULES).map(k =>
    `<div class="explore-card" onclick="navigateTo('${k}')"><span class="ec-icon">${MODULES[k].icon}</span><span class="ec-name">${MODULES[k].name}</span><span class="ec-name-en">${enNames[k]}</span><span class="ec-count">${getCurrentMonthCount(k)} this month</span></div>`
  ).join('');
}

// ===== Module Detail =====
function renderMoodDetail() {
  const now = new Date(); const y = now.getFullYear(), m = now.getMonth();
  const dim = new Date(y,m+1,0).getDate(), fd = new Date(y,m,1).getDay(), today = now.getDate();
  const moodData = getModuleData('mood');
  const cal = document.getElementById('moodCalendar');
  if(cal){
    let h='<div class="mood-calendar-compact"><div class="cal-grid">';
    ['S','M','T','W','T','F','S'].forEach(d=>h+=`<div class="cal-day-header">${d}</div>`);
    for(let i=0;i<fd;i++)h+='<div class="cal-day empty"></div>';
    for(let d=1;d<=dim;d++){
      const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const rec = moodData.find(r=>r.date===ds);
      if(rec) h+=`<div class="cal-day ${MOOD_TYPES[rec.mood].c}${d===today?' today':''}">${MOOD_TYPES[rec.mood].emoji}</div>`;
      else h+=`<div class="cal-day empty">${d}</div>`;
    }
    h+='</div></div><div class="mood-legend" style="margin-top:8px">${Object.entries(MOOD_TYPES).map(([k,v])=>`<span><span class="mood-dot ${k}"></span>${v.label}</span>`).join('')}</div>';
    cal.innerHTML = h;
  }
  renderRecordList('moodRecords', 'mood');
}

function renderModuleDetail(module) {
  const enNames = { learn:'Learning Log', travel:'Travel Log', outfit:'Style Log', food:'Food Log', career:'Career Log' };
  const data = getModuleData(module);
  const thisM = getCurrentMonthCount(module);
  const summary = document.getElementById(module+'Summary');
  if(summary) summary.innerHTML = `<span class="en-tag">${enNames[module]}</span>本月 ${thisM} 条 · 共 ${data.length} 条记录`;
  renderRecordList(module+'Records', module);
}

function renderRecordList(containerId, moduleKey) {
  const el = document.getElementById(containerId); if (!el) return;
  const data = getModuleData(moduleKey);
  const sorted = [...data].sort((a,b) => b.date.localeCompare(a.date));
  const icons = { mood:'💭', learn:'📚', travel:'✈️', outfit:'👗', food:'🍜', career:'🏆' };
  el.innerHTML = sorted.map((r, idx) => {
    const actualIdx = data.indexOf(r);
    const d = new Date(r.date);
    const emoji = (r.mood && MOOD_TYPES[r.mood]) ? MOOD_TYPES[r.mood].emoji : (icons[moduleKey]||'🌿');
    const tag = (r.mood && MOOD_TYPES[r.mood]) ? MOOD_TYPES[r.mood].label : '';
    const photoHtml = r.photo ? `<div class="record-thumb"><img src="${r.photo}" alt="photo"></div>` : '';
    return `<div class="record-item"><div class="record-icon">${emoji}</div>${photoHtml}<div class="record-body"><p class="record-text">${r.text||''}</p><div class="record-meta"><span class="record-date">${d.getMonth()+1}.${d.getDate()}</span>${tag?`<span class="record-tag">${tag}</span>`:''}</div></div><button class="record-delete" onclick="deleteRecord('${moduleKey}', ${actualIdx})" title="Delete">×</button></div>`;
  }).join('');
}

// ===== Delete =====
function deleteRecord(moduleKey, idx) {
  const arr = Store[moduleKey]; if (!arr || idx<0||idx>=arr.length) return;
  const preview = (arr[idx].text||'').slice(0,20);
  if (!confirm(`删除这条记录？\n"${preview}..."`)) return;
  removeRecord(moduleKey, idx);
  showToast('deleted');
  if (currentPage === 'home') renderHome();
  else if (currentPage === 'mood') renderMoodDetail();
  else renderModuleDetail(currentPage);
}

// ===== Module Picker =====
function openModulePicker() { document.getElementById('modulePicker').classList.add('active'); }
function closeModulePicker() { document.getElementById('modulePicker').classList.remove('active'); }
function pickModule(m) { closeModulePicker(); openAddModal(m); }
function quickMood(mood) {
  closeModulePicker();
  const now = new Date();
  const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  addRecord('mood', { date:ds, mood, text:MOOD_TYPES[mood].label });
  showToast('saved · '+MOOD_TYPES[mood].emoji);
  if (currentPage === 'home') renderHome();
  else if (currentPage === 'mood') renderMoodDetail();
}

// ===== Add Modal =====
function openAddModal(module) {
  currentModule = module; currentPhoto = null;
  const mod = document.getElementById('addModal'), title = document.getElementById('modalTitle'), body = document.getElementById('modalBody');
  title.textContent = 'New ' + MODULES[module].name;
  if (module === 'mood') {
    body.innerHTML=`<div class="fg"><label class="fg-label">How do you feel?</label><div class="mood-selector" id="moodSelector">${Object.entries(MOOD_TYPES).map(([k,v])=>`<div class="mood-opt" data-mood="${k}" onclick="selectMood(this)"><span class="moji">${v.emoji}</span><span class="mlabel">${v.label}</span></div>`).join('')}</div></div><div class="fg"><label class="fg-label">A few words</label><textarea class="fg-textarea" id="recordText" placeholder="what happened today..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else if (module === 'travel') {
    body.innerHTML=`<div class="fg"><label class="fg-label">Photo</label><div class="photo-upload" id="photoUpload" onclick="document.getElementById('photoInput').click()"><span class="upload-icon">📷</span><span class="upload-text">Tap to add photo</span></div></div><div class="fg"><label class="fg-label">Where?</label><input class="fg-input" id="recordLocation" placeholder="location..."></div><div class="fg"><label class="fg-label">Story</label><textarea class="fg-textarea" id="recordText" placeholder="what happened..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else if (module === 'food') {
    body.innerHTML=`<div class="fg"><label class="fg-label">Photo</label><div class="photo-upload" id="photoUpload" onclick="document.getElementById('photoInput').click()"><span class="upload-icon">📷</span><span class="upload-text">Tap to add photo</span></div></div><div class="fg"><label class="fg-label">What did you eat?</label><input class="fg-input" id="recordDish" placeholder="dish name..."></div><div class="fg"><label class="fg-label">Thoughts</label><textarea class="fg-textarea" id="recordText" placeholder="how was it..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else if (module === 'outfit') {
    body.innerHTML=`<div class="fg"><label class="fg-label">Photo</label><div class="photo-upload" id="photoUpload" onclick="document.getElementById('photoInput').click()"><span class="upload-icon">📷</span><span class="upload-text">Tap to add photo</span></div></div><div class="fg"><label class="fg-label">Outfit details</label><textarea class="fg-textarea" id="recordText" placeholder="describe your look..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else {
    body.innerHTML=`<div class="fg"><label class="fg-label">Note</label><textarea class="fg-textarea" id="recordText" placeholder="write something..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  }
  mod.classList.add('active');
}
function closeAddModal() { document.getElementById('addModal').classList.remove('active'); currentPhoto=null; }
function selectMood(el) { document.querySelectorAll('.mood-opt').forEach(o=>o.classList.remove('selected')); el.classList.add('selected'); }

function handlePhotoUpload(event) {
  const file = event.target.files[0]; if(!file) return;
  const fr = new FileReader();
  fr.onload = function(e) {
    currentPhoto = e.target.result;
    const upload = document.getElementById('photoUpload');
    if(upload){ upload.innerHTML=`<img src="${currentPhoto}" alt="photo">`; upload.classList.add('has-photo'); }
  };
  fr.readAsDataURL(file); event.target.value='';
}

function saveRecord() {
  const textEl = document.getElementById('recordText'); const text = textEl?textEl.value.trim():'';
  if (!text && currentModule!=='mood') { showToast('write something first'); return; }
  const now = new Date();
  const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  let record = { date:ds, text, photo:currentPhoto||null };
  if (currentModule === 'mood') {
    const sel = document.querySelector('.mood-opt.selected');
    if (!sel) { const s = document.getElementById('moodSelector'); s.style.animation='none';s.offsetHeight;s.style.animation='shake .4s ease'; return; }
    record.mood = sel.dataset.mood;
    record.text = text || MOOD_TYPES[sel.dataset.mood].label;
  } else if (currentModule === 'travel') {
    const loc = document.getElementById('recordLocation')?.value.trim()||'';
    record.text = loc ? `${loc} · ${text}` : text;
  } else if (currentModule === 'food') {
    const dish = document.getElementById('recordDish')?.value.trim()||'';
    record.text = dish ? `${dish}：${text}` : text;
  }
  addRecord(currentModule, record); currentPhoto=null; closeAddModal(); showToast('saved');
  if (currentPage==='home') renderHome();
  else if (currentPage==='mood') renderMoodDetail();
  else renderModuleDetail(currentPage);
}

// =================================================================
// SHARE V3 · 按日期 + 月度多模块选择
// =================================================================
function openShareModal(module) {
  currentModule = module; shareMode = 'month'; shareTemplate = 'grid'; shareRatio = '3:4'; selectedIndices = new Set();
  document.getElementById('shareModal').classList.add('active');
  // reset UI
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.mode-btn[data-mode="month"]').classList.add('active');
  document.querySelectorAll('.ratio-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.ratio-btn[data-ratio="3:4"]').classList.add('active');
  document.querySelectorAll('.template-card').forEach(c=>c.classList.remove('selected'));
  document.querySelector('.template-card').classList.add('selected');
  renderShareModulePicker();
  renderShareDatePicker();
  renderSelectRecords();
}
function closeShareModal() { document.getElementById('shareModal').classList.remove('active'); }

function selectMode(mode, btn) {
  shareMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  selectedIndices = new Set();
  renderShareModulePicker();
  renderShareDatePicker();
  renderSelectRecords();
}
function selectRatio(ratio, btn) {
  shareRatio = ratio;
  document.querySelectorAll('.ratio-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
function selectTemplate(tmpl) {
  shareTemplate = tmpl;
  document.querySelectorAll('.template-card').forEach(c=>c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  renderSelectRecords();
}

// 月度模式 → 多模块选择
let shareSelectedModules = new Set();
function renderShareModulePicker() {
  const el = document.getElementById('shareModulePicker');
  if (!el) return;
  if (shareMode === 'date') { el.style.display='none'; return; }
  el.style.display='block';
  if (shareSelectedModules.size === 0) Object.keys(MODULES).forEach(k => shareSelectedModules.add(k));
  el.innerHTML = Object.keys(MODULES).map(k => {
    const c = shareSelectedModules.has(k) ? 'checked' : '';
    return `<div class="select-record ${c}" onclick="toggleShareModule('${k}',this)"><div class="sr-check">✓</div><span class="sr-emoji">${MODULES[k].icon}</span><span class="sr-text">${MODULES[k].name}</span><span class="sr-module">${getCurrentMonthCount(k)} this month</span></div>`;
  }).join('');
}
function toggleShareModule(k, el) {
  if (shareSelectedModules.has(k)) { shareSelectedModules.delete(k); el.classList.remove('checked'); }
  else { shareSelectedModules.add(k); el.classList.add('checked'); }
  selectedIndices = new Set();
  renderSelectRecords();
}

// 日期模式 → 日期选择
function renderShareDatePicker() {
  const el = document.getElementById('shareDatePicker');
  if (!el) return;
  if (shareMode !== 'date') { el.style.display='none'; return; }
  el.style.display='block';
  if (!shareDate) {
    const now = new Date();
    shareDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  }
  document.getElementById('shareDateInput').value = shareDate;
}
function onDateChange(val) {
  shareDate = val;
  selectedIndices = new Set();
  renderSelectRecords();
}

// 记录选择列表
function renderSelectRecords() {
  const el = document.getElementById('selectRecords');
  if (!el) return;
  let all;
  if (shareMode === 'date') {
    all = getDateAll(shareDate);
  } else {
    all = [];
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    shareSelectedModules.forEach(k => {
      getModuleData(k).filter(r => r.date.startsWith(ym)).forEach(r => all.push({...r, module:k}));
    });
    all.sort((a,b) => b.date.localeCompare(a.date));
  }
  selectedIndices = new Set();
  const autoN = Math.min(all.length, shareTemplate==='grid'?9:shareTemplate==='film'?8:9);
  for (let i=0;i<autoN;i++) selectedIndices.add(i);

  if (all.length === 0) { el.innerHTML = '<p style="color:var(--t4);font-size:12px;text-align:center;padding:12px;">暂无记录</p>'; return; }

  el.innerHTML = all.map((item,i) => {
    const c = selectedIndices.has(i)?'checked':'';
    const hasPhoto = item.photo ? '📷' : getModuleIcon(item.module);
    return `<div class="select-record ${c}" onclick="toggleRecord(${i}, this, ${all.length})" data-idx="${i}"><div class="sr-check">✓</div><span class="sr-emoji">${hasPhoto}</span><span class="sr-text">${(item.text||'').slice(0,30)}</span><span class="sr-module">${getModuleTag(item.module)}</span></div>`;
  }).join('');
  // store all for later
  window._shareAll = all;
}

function toggleRecord(idx, el, total) {
  if (selectedIndices.has(idx)) { selectedIndices.delete(idx); el.classList.remove('checked'); }
  else { selectedIndices.add(idx); el.classList.add('checked'); }
}

function getAllShareableRecords() {
  return window._shareAll || [];
}

function getModuleIcon(m) { const m2={mood:'💭',learn:'📚',travel:'✈️',outfit:'👗',food:'🍜',career:'🏆'}; return m2[m]||'🌿'; }
function getModuleTag(m) { const m2={mood:'mood',learn:'learn',travel:'travel',outfit:'style',food:'food',career:'career'}; return m2[m]||''; }

// =================================================================
// EXPORT · 生成
// =================================================================
function generateShare() {
  if (selectedIndices.size===0) { showToast('请至少选择一条记录'); return; }
  const all = getAllShareableRecords();
  if (!all || all.length===0) { showToast('没有可导出的记录'); return; }
  const selected = [];
  for (let idx of selectedIndices) { if (idx<all.length) selected.push(all[idx]); }
  selected.sort((a,b)=>b.date.localeCompare(a.date));
  closeShareModal();

  // preload photos
  const photos = selected.filter(s=>s.photo).map(s=>s.photo);
  loadAllPhotos(photos).then(loadedImgs => {
    window._shareLoaded = loadedImgs;
    doExport(selected);
  }).catch(() => { doExport(selected); });
}

function loadAllPhotos(srcs) {
  return Promise.all(srcs.map(s => new Promise((resolve,reject) => {
    const img = new Image(); img.onload=()=>resolve(img); img.onerror=reject; img.src=s;
  })));
}

function doExport(selected) {
  const canvas = document.getElementById('shareCanvas');
  setupCanvasSize(canvas);
  if (shareTemplate==='grid') drawGridV3(canvas, selected);
  else if (shareTemplate==='film') drawFilmV3(canvas, selected);
  else if (shareTemplate==='mood') drawMoodCardV3(canvas);
  else if (shareTemplate==='poster') drawPosterV3(canvas);
  const dataUrl = canvas.toDataURL('image/jpeg',0.92);
  document.getElementById('previewImage').src = dataUrl;
  document.getElementById('previewModal').classList.add('active');
}

function closePreviewModal() { document.getElementById('previewModal').classList.remove('active'); }

function saveShareImage() {
  const link = document.createElement('a');
  link.download = `my-space-${shareTemplate}-${new Date().toISOString().slice(0,10)}.jpg`;
  link.href = document.getElementById('previewImage').src;
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  showToast('image saved');
}

function setupCanvasSize(canvas) {
  const base = 900;
  if (shareRatio==='3:4') { canvas.width=base; canvas.height=Math.round(base*4/3); }
  else if (shareRatio==='9:16') { canvas.width=base; canvas.height=Math.round(base*16/9); }
  else { canvas.width=base; canvas.height=base; }
}

// ===== TEMPLATES =====
function drawGridV3(canvas, items) {
  const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');
  ctx.fillStyle='#FBFBF8'; ctx.fillRect(0,0,W,H);

  const n=items.length;
  let cols=n<=4?2:n<=9?3:4;
  const rows=Math.ceil(n/cols), margin=40, gap=8;
  const cellW=(W-margin*2-gap*(cols-1))/cols;
  const cellH=(H-margin*2-gap*(rows-1)-90)/rows;
  const startY=70;

  ctx.fillStyle='#3D7044'; ctx.font='300 32px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText('MY SPACE', W/2, 40);

  items.forEach((item,i)=>{
    const col=i%cols, row=Math.floor(i/cols);
    const x=margin+col*(cellW+gap), y=startY+row*(cellH+gap);

    if (item.photo) {
      // 照片 fill
      const img = new Image(); img.src = item.photo;
      ctx.save(); roundRect(ctx,x,y,cellW,cellH,12); ctx.clip();
      const scale=Math.max(cellW/img.width, cellH/img.height);
      ctx.drawImage(img, x-(img.width*scale-cellW)/2, y-(img.height*scale-cellH)/2, img.width*scale, img.height*scale);
      ctx.restore();
    } else {
      // emoji card
      ctx.fillStyle='#FFFFFF'; ctx.strokeStyle='#D4E5D6'; ctx.lineWidth=1;
      roundRect(ctx,x,y,cellW,cellH,12); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#1A2B1D'; ctx.font='28px sans-serif'; ctx.textAlign='center';
      ctx.fillText(getModuleIcon(item.module)||'🌿', x+cellW/2, y+38);
      ctx.fillStyle='#556B58'; ctx.font='300 15px PingFang SC,sans-serif';
      wrapText(ctx, (item.text||'').slice(0,16), x+cellW/2, y+60, cellW-16, 20);
    }

    // 底部日期
    ctx.fillStyle='rgba(255,255,255,0.88)';
    ctx.fillRect(x, y+cellH-26, cellW, 26);
    ctx.fillStyle='#B8C9BA'; ctx.font='300 13px Lato,sans-serif'; ctx.textAlign='center';
    ctx.fillText(item.date?.slice(5)||'', x+cellW/2, y+cellH-7);
  });
}

function drawFilmV3(canvas, items) {
  const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');
  ctx.fillStyle='#FBFBF8'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2A4F2F'; ctx.font='300 32px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText('MY SPACE', W/2, 50);
  ctx.fillStyle='#D4E5D6'; ctx.fillRect(W/2-30,62,60,1);

  const usableH=H-100;
  const nShow=Math.min(items.length, 8);
  const perH=Math.min(usableH/nShow, 120);
  let ty=90;

  items.slice(0,nShow).forEach(item=>{
    const ih=perH-10;
    ctx.fillStyle='#FFFFFF'; ctx.strokeStyle='#D4E5D6'; ctx.lineWidth=1;
    roundRect(ctx,40,ty,W-80,ih,12); ctx.fill(); ctx.stroke();
    // holes
    ctx.fillStyle='#FBFBF8'; ctx.strokeStyle='#D4E5D6';
    ctx.beginPath(); ctx.arc(56,ty+ih/2,6,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(W-56,ty+ih/2,6,0,Math.PI*2); ctx.fill(); ctx.stroke();

    if (item.photo) {
      const img=new Image(); img.src=item.photo;
      ctx.save(); roundRect(ctx,78,ty+8,104,ih-16,8); ctx.clip();
      const s=Math.max(104/img.width,(ih-16)/img.height);
      ctx.drawImage(img,78-(img.width*s-104)/2,ty+8-(img.height*s-(ih-16))/2,img.width*s,img.height*s);
      ctx.restore();
      ctx.fillStyle='#1A2B1D'; ctx.font='300 17px PingFang SC,sans-serif';
      wrapText(ctx,(item.text||'').slice(0,30),200,ty+30,W-240,26);
    } else {
      ctx.fillStyle='#1A2B1D'; ctx.font='26px sans-serif'; ctx.textAlign='left';
      ctx.fillText(getModuleIcon(item.module)||'',90,ty+ih/2+6);
      ctx.fillStyle='#1A2B1D'; ctx.font='300 17px PingFang SC,sans-serif';
      wrapText(ctx,(item.text||'').slice(0,35),130,ty+30,W-160,26);
    }
    ctx.fillStyle='#B8C9BA'; ctx.font='300 14px Lato,sans-serif';
    ctx.fillText(item.date?.slice(5)||'', item.photo?200:130, ty+ih-18);
    ty+=perH;
  });
  ctx.fillStyle='#B8C9BA'; ctx.font='italic 300 18px Lato,serif'; ctx.textAlign='center';
  ctx.fillText('grow a little every day', W/2, H-30);
}

// 情绪卡片 v3：环形图 + 情绪折线
function drawMoodCardV3(canvas) {
  const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#EBF3EC'); grad.addColorStop(1,'#FBFBF8');
  ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);

  ctx.fillStyle='#2A4F2F'; ctx.font='300 42px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText('MY MOOD', W/2, 70);
  ctx.fillStyle='#8CA590'; ctx.font='italic 300 20px Lato,serif';
  const now=new Date(); const mon=['January','February','March','April','May','June','July','August','September','October','November','December'];
  ctx.fillText(mon[now.getMonth()]+' '+now.getFullYear(), W/2, 100);

  // 环形图
  const pct=calcHappiness();
  drawDonut(ctx, W/2-80, 210, 55, pct, '#3D7044');

  // 右侧指标
  const moods=getModuleData('mood');
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const thisMonthMoods = moods.filter(d=>d.date.startsWith(ym));
  let happy=0, calm=0, sad=0;
  thisMonthMoods.forEach(d=>{ if(d.mood==='happy'||d.mood==='excited') happy++; else if(d.mood==='calm') calm++; else if(d.mood==='sad'||d.mood==='anxious'||d.mood==='angry') sad++; });
  const indicators = [
    {label:'😊 Happy', val:happy, color:'#5A9460'},
    {label:'😌 Calm',  val:calm,  color:'#8CA590'},
    {label:'😢 Low',   val:sad,   color:'#B8C9BA'},
  ];
  let iy=180;
  indicators.forEach(ind=>{
    ctx.fillStyle=ind.color; ctx.font='300 28px Lato,sans-serif'; ctx.textAlign='left';
    ctx.fillText(String(ind.val), W/2+30, iy+18);
    ctx.fillStyle='#8CA590'; ctx.font='300 16px Lato,sans-serif';
    ctx.fillText(ind.label, W/2+70, iy+18);
    iy+=40;
  });

  // 折线图
  const lineY=300, lineH=150, lineX0=80, lineX1=W-60;
  ctx.strokeStyle='#D4E5D6'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(lineX0,lineY+lineH); ctx.lineTo(lineX1,lineY+lineH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lineX0,lineY); ctx.lineTo(lineX0,lineY+lineH); ctx.stroke();

  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const stepX = (lineX1-lineX0) / Math.max(daysInMonth-1,1);
  const pts = [];
  for (let d=1; d<=daysInMonth; d++) {
    const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec = moods.find(r=>r.date===ds);
    if (rec) {
      const v = MOOD_TYPES[rec.mood]?.v||3;
      pts.push({ x:lineX0+(d-1)*stepX, y:lineY+lineH-(v/5)*lineH, v });
    }
  }

  if (pts.length>1) {
    // fill area
    ctx.beginPath();
    ctx.moveTo(pts[0].x, lineY+lineH);
    pts.forEach(p=>ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length-1].x, lineY+lineH);
    ctx.closePath();
    ctx.fillStyle='rgba(123,174,110,0.12)'; ctx.fill();
    // line
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i=1;i<pts.length;i++) {
      const xc=(pts[i].x+pts[i-1].x)/2;
      ctx.quadraticCurveTo(pts[i-1].x, pts[i-1].y, xc, (pts[i].y+pts[i-1].y)/2);
    }
    ctx.lineTo(pts[pts.length-1].x, pts[pts.length-1].y);
    ctx.strokeStyle='#5A9460'; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.stroke();
    // dots
    pts.forEach(p=>{
      ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2);
      ctx.fillStyle='#5A9460'; ctx.fill();
    });
  }

  // 情绪图例
  ctx.fillStyle='#8CA590'; ctx.font='300 14px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText('MOOD CURVE', W/2, lineY+lineH+30);
  ctx.fillStyle='#8CA590'; ctx.font='300 12px PingFang SC,sans-serif';
  ctx.fillText('↑ 愉悦度', lineX0, lineY-8);
  ctx.fillText(`${daysInMonth} days →`, lineX1-40, lineY+lineH+16);

  // 关键词
  const kw=extractKeywords(thisMonthMoods);
  ctx.fillStyle='#8CA590'; ctx.font='400 14px Lato,sans-serif';
  ctx.fillText('KEY WORDS', W/2, 530);
  ctx.fillStyle='#2A4F2F'; ctx.font='300 20px PingFang SC,sans-serif';
  ctx.fillText(kw.slice(0,4).join(' · '), W/2, 558);

  ctx.fillStyle='#B8C9BA'; ctx.font='italic 300 18px Lato,serif';
  ctx.fillText('my space · grow a little every day', W/2, H-30);
}

function drawPosterV3(canvas) {
  const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');
  ctx.fillStyle='#FBFBF8'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#EBF3EC'; ctx.fillRect(0,0,W,300);
  const now=new Date();
  const mon=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  ctx.fillStyle='#2A4F2F'; ctx.font='300 100px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText(mon[now.getMonth()], W/2, 170);
  ctx.fillStyle='#8CA590'; ctx.font='300 26px Lato,serif'; ctx.fillText(String(now.getFullYear()), W/2, 210);

  // 环形
  drawDonut(ctx, W/2-100, 400, 50, calcHappiness(), '#3D7044');
  // 数字
  const nums=[{l:'MOOD',v:getCurrentMonthCount('mood')},{l:'LEARN',v:getCurrentMonthCount('learn')},{l:'FOOD',v:getCurrentMonthCount('food')},{l:'TRAVEL',v:getCurrentMonthCount('travel')}];
  let ny=360;
  nums.forEach(n=>{
    ctx.fillStyle='#3D7044'; ctx.font='300 34px Lato,sans-serif'; ctx.textAlign='left';
    ctx.fillText(String(n.v), W/2+20, ny+20);
    ctx.fillStyle='#8CA590'; ctx.font='400 13px Lato,sans-serif'; ctx.fillText(n.l, W/2+70, ny+20);
    ny+=44;
  });

  // 情绪折线（简化）
  const moods=getModuleData('mood');
  const ym=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const lineY=500, lineH=100, lx0=40, lx1=W-40;
  const daysInM=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const stepX=(lx1-lx0)/Math.max(daysInM-1,1);

  ctx.strokeStyle='#D4E5D6'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(lx0,lineY+lineH); ctx.lineTo(lx1,lineY+lineH); ctx.stroke();

  ctx.beginPath(); let first=true;
  for (let d=1; d<=daysInM; d++) {
    const ds=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec=moods.find(r=>r.date===ds);
    if (rec) {
      const vy=lineY+lineH-(MOOD_TYPES[rec.mood].v/5)*lineH;
      if (first) { ctx.moveTo(lx0+(d-1)*stepX, vy); first=false; }
      else ctx.lineTo(lx0+(d-1)*stepX, vy);
    }
  }
  ctx.strokeStyle='#5A9460'; ctx.lineWidth=2; ctx.stroke();

  // kw
  const allRecs=getThisMonthAll();
  const kw=extractKeywords(allRecs);
  ctx.fillStyle='#2A4F2F'; ctx.font='300 26px PingFang SC,serif'; ctx.textAlign='center';
  ctx.fillText(kw.slice(0,4).join(' · '), W/2, 660);

  ctx.fillStyle='#8CA590'; ctx.font='italic 300 20px Lato,serif';
  ctx.fillText('my space · grow a little every day', W/2, H-40);
}

function drawDonut(ctx,cx,cy,r,pct,color) {
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle='rgba(180,200,186,0.3)'; ctx.lineWidth=10; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(pct/100)*Math.PI*2);
  ctx.strokeStyle=color; ctx.lineWidth=10; ctx.lineCap='round'; ctx.stroke();
  ctx.fillStyle=color; ctx.font='300 36px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText(pct+'%', cx, cy+5);
  ctx.fillStyle='#8CA590'; ctx.font='300 14px PingFang SC,sans-serif';
  ctx.fillText('幸福指数', cx, cy+28);
}

// ===== Helpers =====
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function wrapText(ctx,text,x,y,maxW,lineH){
  const words=text.split(''); let line=''; const lines=[];
  for(let i=0;i<words.length;i++){const test=line+words[i]; if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=words[i];}else line=test;}
  lines.push(line); lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineH));
}

function showToast(msg){
  const old=document.querySelector('.toast'); if(old)old.remove();
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),250)},1600);
}

document.addEventListener('DOMContentLoaded', renderHome);
