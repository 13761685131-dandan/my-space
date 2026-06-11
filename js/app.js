/* =================================================================
   My Space · App Logic v4
   + 删除功能 + 分享图用真实照片
   ================================================================= */

let currentPage = 'home';
let currentPhoto = null;
let shareScope = 'month';
let shareModule = 'mood';
let shareTemplate = 'grid';
let shareRatio = '3:4';
let selectedIndices = new Set();

// ===== Navigation =====
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const t = document.getElementById('page-' + page);
  if (t) t.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'home') renderHome();
  else if (page === 'mood') renderMoodDetail();
  else renderModuleDetail(page);
}

function renderHome() { renderDate(); renderCuts(); renderStats(); renderMoodCompact(); renderExplore(); }

function renderDate() {
  const el = document.getElementById('headerDate');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
}

function renderCuts() {
  const el = document.getElementById('cutsScroll');
  if (!el) return;
  el.innerHTML = sampleCuts.map(c => `<div class="cut-card" onclick="navigateTo('${c.module}')"><span class="cut-emoji">${c.icon}</span><p class="cut-text">${c.text}</p><p class="cut-tag">${c.tag_en||c.tag}</p><p class="cut-date">${c.date_en||c.date}</p></div>`).join('');
}

function renderStats() {
  const el = document.getElementById('statsGrid');
  if (!el) return;
  const icons = { mood:'💭', learn:'📚', travel:'✈️', outfit:'👗', food:'🍜', career:'🏆' };
  const names = { mood:'Mood', learn:'Learn', travel:'Travel', outfit:'Style', food:'Food', career:'Career' };
  el.innerHTML = ['mood','learn','travel','outfit','food','career'].map(k =>
    `<div class="stat-card" onclick="navigateTo('${k}')"><span class="stat-icon">${icons[k]}</span><span class="stat-num">${sampleModuleCounts[k]}</span><span class="stat-label">${names[k]}</span></div>`
  ).join('');
}

function renderMoodCompact() {
  const el = document.getElementById('moodCalendarCompact');
  if (!el) return;
  const now = new Date(); const y = now.getFullYear(), m = now.getMonth();
  const dim = new Date(y,m+1,0).getDate(), fd = new Date(y,m,1).getDay();
  let h = '<div class="cal-grid">';
  ['S','M','T','W','T','F','S'].forEach(d => h += `<div class="cal-day-header">${d}</div>`);
  for (let i=0;i<fd;i++) h+='<div class="cal-day empty"></div>';
  for (let d=1;d<=dim;d++){
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const rec = sampleMoodData.find(r=>r.date===ds);
    if(rec) h+=`<div class="cal-day ${MOOD_TYPES[rec.mood].c}" title="${rec.text}">${MOOD_TYPES[rec.mood].emoji}</div>`;
    else h+=`<div class="cal-day empty">${d}</div>`;
  }
  h+='</div>'; el.innerHTML = h;
  const leg = document.getElementById('moodLegend');
  if(leg) leg.innerHTML = Object.entries(MOOD_TYPES).map(([k,v])=>`<span><span class="mood-dot ${k}"></span>${v.label}</span>`).join('');
}

function renderExplore() {
  const el = document.getElementById('exploreGrid');
  if (!el) return;
  const icons = { mood:'💭', learn:'📚', travel:'✈️', outfit:'👗', food:'🍜', career:'🏆' };
  const names = { mood:'情绪志', learn:'学习志', travel:'旅行志', outfit:'穿搭志', food:'美食志', career:'职场志' };
  const enNames = { mood:'Mood Journal', learn:'Learning', travel:'Travel', outfit:'Style', food:'Food', career:'Career' };
  el.innerHTML = Object.keys(MODULES).map(k =>
    `<div class="explore-card" onclick="navigateTo('${k}')"><span class="ec-icon">${icons[k]}</span><span class="ec-name">${names[k]}</span><span class="ec-name-en">${enNames[k]}</span><span class="ec-count">${sampleModuleCounts[k]} this month</span></div>`
  ).join('');
}

// ===== Module Detail Render (with delete) =====
function renderMoodDetail() {
  const now = new Date(); const y = now.getFullYear(), m = now.getMonth();
  const dim = new Date(y,m+1,0).getDate(), fd = new Date(y,m,1).getDay(), today = now.getDate();
  const cal = document.getElementById('moodCalendar');
  if(cal){
    let h='<div class="mood-calendar-compact"><div class="cal-grid">';
    ['S','M','T','W','T','F','S'].forEach(d=>h+=`<div class="cal-day-header">${d}</div>`);
    for(let i=0;i<fd;i++)h+='<div class="cal-day empty"></div>';
    for(let d=1;d<=dim;d++){
      const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const rec = sampleMoodData.find(r=>r.date===ds);
      if(rec) h+=`<div class="cal-day ${MOOD_TYPES[rec.mood].c}${d===today?' today':''}">${MOOD_TYPES[rec.mood].emoji}</div>`;
      else h+=`<div class="cal-day empty">${d}</div>`;
    }
    h+='</div></div>';
    h+=`<div class="mood-legend" style="margin-top:8px">${Object.entries(MOOD_TYPES).map(([k,v])=>`<span><span class="mood-dot ${k}"></span>${v.label}</span>`).join('')}</div>`;
    cal.innerHTML = h;
  }
  renderRecordList('moodRecords', 'mood', sampleMoodData, 'mood');
}

function renderModuleDetail(module) {
  const dataMap = { learn:sampleLearnData, travel:sampleTravelData, outfit:sampleOutfitData, food:sampleFoodData, career:sampleCareerData };
  const enNames = { learn:'Learning Log', travel:'Travel Log', outfit:'Style Log', food:'Food Log', career:'Career Log' };
  const data = dataMap[module]||[];
  const sorted = [...data].sort((a,b)=>b.date.localeCompare(a.date));
  const thisMonth = sorted.filter(d=>d.date.startsWith('2026-03')).length;
  const summary = document.getElementById(module+'Summary');
  if(summary) summary.innerHTML = `<span class="en-tag">${enNames[module]}</span>本月 ${thisMonth} 条 · 共 ${sorted.length} 条记录`;
  renderRecordList(module+'Records', module, data, module);
}

// 统一渲染记录列表（含删除按钮 + 图片缩略图）
function renderRecordList(containerId, moduleKey, dataArr, deleteScope) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const icons = { mood:'💭', learn:'📚', travel:'✈️', outfit:'👗', food:'🍜', career:'🏆' };
  const sorted = [...dataArr].sort((a,b)=>b.date.localeCompare(a.date));
  el.innerHTML = sorted.map((r, idx) => {
    const d = new Date(r.date);
    const origIdx = dataArr.indexOf(r);
    const emoji = (r.mood && MOOD_TYPES[r.mood]) ? MOOD_TYPES[r.mood].emoji : (icons[moduleKey]||'🌿');
    const tag = (r.mood && MOOD_TYPES[r.mood]) ? MOOD_TYPES[r.mood].label : '';
    const photoHtml = r.photo
      ? `<div class="record-thumb"><img src="${r.photo}" alt="photo"></div>`
      : '';
    return `<div class="record-item" id="rec-${deleteScope}-${origIdx}">
      <div class="record-icon">${emoji}</div>
      ${photoHtml}
      <div class="record-body">
        <p class="record-text">${r.text||''}</p>
        <div class="record-meta">
          <span class="record-date">${d.getMonth()+1}.${d.getDate()}</span>
          ${tag?`<span class="record-tag">${tag}</span>`:''}
        </div>
      </div>
      <button class="record-delete" onclick="deleteRecord('${deleteScope}', ${origIdx})" title="Delete">×</button>
    </div>`;
  }).join('');
}

// ===== 删除记录 =====
function deleteRecord(module, idx) {
  const dataMap = {
    mood: sampleMoodData, learn: sampleLearnData, travel: sampleTravelData,
    outfit: sampleOutfitData, food: sampleFoodData, career: sampleCareerData
  };
  const arr = dataMap[module];
  if (!arr || idx < 0 || idx >= arr.length) return;

  // 弹确认
  const item = arr[idx];
  const preview = (item.text||'').slice(0, 20);
  if (!confirm(`删除这条记录？\n"${preview}..."`)) return;

  arr.splice(idx, 1);
  sampleModuleCounts[module] = Math.max(0, sampleModuleCounts[module] - 1);
  showToast('deleted');

  // 刷新
  if (currentPage === 'home') renderHome();
  else if (currentPage === 'mood') renderMoodDetail();
  else renderModuleDetail(currentPage);
}

// ===== Module Picker =====
function openModulePicker() { document.getElementById('modulePicker').classList.add('active'); }
function closeModulePicker() { document.getElementById('modulePicker').classList.remove('active'); }
function pickModule(module) { closeModulePicker(); openAddModal(module); }
function quickMood(mood) {
  closeModulePicker();
  const now = new Date();
  const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  sampleMoodData.push({ date: ds, mood, text: MOOD_TYPES[mood].label });
  sampleModuleCounts.mood++;
  showToast('saved · ' + MOOD_TYPES[mood].emoji);
  if (currentPage === 'home') renderHome(); else if (currentPage === 'mood') renderMoodDetail();
}

// ===== Add Modal =====
let currentModule = 'mood';
function openAddModal(module) {
  currentModule = module; currentPhoto = null;
  const mod = document.getElementById('addModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  title.textContent = 'New ' + MODULES[module].name;
  if (module === 'mood') {
    body.innerHTML = `<div class="fg"><label class="fg-label">How do you feel?</label><div class="mood-selector" id="moodSelector">${Object.entries(MOOD_TYPES).map(([k,v])=>`<div class="mood-opt" data-mood="${k}" onclick="selectMood(this)"><span class="moji">${v.emoji}</span><span class="mlabel">${v.label}</span></div>`).join('')}</div></div><div class="fg"><label class="fg-label">A few words</label><textarea class="fg-textarea" id="recordText" placeholder="what happened today..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else if (module === 'travel') {
    body.innerHTML = `<div class="fg"><label class="fg-label">Photo</label><div class="photo-upload" id="photoUpload" onclick="document.getElementById('photoInput').click()"><span class="upload-icon">📷</span><span class="upload-text">Tap to add photo</span></div></div><div class="fg"><label class="fg-label">Where?</label><input class="fg-input" id="recordLocation" placeholder="location..."></div><div class="fg"><label class="fg-label">Story</label><textarea class="fg-textarea" id="recordText" placeholder="what happened..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else if (module === 'food') {
    body.innerHTML = `<div class="fg"><label class="fg-label">Photo</label><div class="photo-upload" id="photoUpload" onclick="document.getElementById('photoInput').click()"><span class="upload-icon">📷</span><span class="upload-text">Tap to add photo</span></div></div><div class="fg"><label class="fg-label">What did you eat?</label><input class="fg-input" id="recordDish" placeholder="dish name..."></div><div class="fg"><label class="fg-label">Thoughts</label><textarea class="fg-textarea" id="recordText" placeholder="how was it..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else if (module === 'outfit') {
    body.innerHTML = `<div class="fg"><label class="fg-label">Photo</label><div class="photo-upload" id="photoUpload" onclick="document.getElementById('photoInput').click()"><span class="upload-icon">📷</span><span class="upload-text">Tap to add photo</span></div></div><div class="fg"><label class="fg-label">Outfit details</label><textarea class="fg-textarea" id="recordText" placeholder="describe your look..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  } else {
    body.innerHTML = `<div class="fg"><label class="fg-label">Note</label><textarea class="fg-textarea" id="recordText" placeholder="write something..."></textarea></div><button class="submit-btn" onclick="saveRecord()">Save</button>`;
  }
  mod.classList.add('active');
}
function closeAddModal() { document.getElementById('addModal').classList.remove('active'); currentPhoto = null; }
function selectMood(el) { document.querySelectorAll('.mood-opt').forEach(o=>o.classList.remove('selected')); el.classList.add('selected'); }

function handlePhotoUpload(event) {
  const file = event.target.files[0]; if(!file) return;
  const fr = new FileReader();
  fr.onload = function(e){
    currentPhoto = e.target.result;
    const upload = document.getElementById('photoUpload');
    if(upload){ upload.innerHTML = `<img src="${currentPhoto}" alt="photo">`; upload.classList.add('has-photo'); }
  };
  fr.readAsDataURL(file); event.target.value = '';
}

function saveRecord() {
  const textEl = document.getElementById('recordText'); const text = textEl ? textEl.value.trim() : '';
  if (!text && currentModule !== 'mood') { showToast('write something first'); return; }
  const now = new Date();
  const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  if (currentModule === 'mood') {
    const sel = document.querySelector('.mood-opt.selected');
    if (!sel) { const s = document.getElementById('moodSelector'); s.style.animation='none'; s.offsetHeight; s.style.animation='shake .4s ease'; return; }
    sampleMoodData.push({ date:ds, mood:sel.dataset.mood, text:text||MOOD_TYPES[sel.dataset.mood].label, photo:currentPhoto||null });
  } else if (currentModule === 'travel') {
    const loc = document.getElementById('recordLocation')?.value.trim()||'';
    sampleTravelData.push({ date:ds, text:loc?`${loc} · ${text}`:text, photo:currentPhoto||null });
  } else if (currentModule === 'food') {
    const dish = document.getElementById('recordDish')?.value.trim()||'';
    sampleFoodData.push({ date:ds, text:dish?`${dish}：${text}`:text, photo:currentPhoto||null });
  } else if (currentModule === 'outfit') {
    sampleOutfitData.push({ date:ds, text, photo:currentPhoto||null });
  } else {
    const dataMap = { learn:sampleLearnData, career:sampleCareerData };
    dataMap[currentModule].push({ date:ds, text, photo:currentPhoto||null });
  }
  sampleModuleCounts[currentModule]++; currentPhoto = null; closeAddModal(); showToast('saved');
  if (currentPage === 'home') renderHome(); else if (currentPage === 'mood') renderMoodDetail(); else renderModuleDetail(currentPage);
}

// =================================================================
// SHARE V2 · 多选 + 比例 + 关键词 + 环形图 + 照片
// =================================================================
function openShareModal(module) {
  shareModule = module; shareRatio = '3:4'; shareTemplate = 'grid'; selectedIndices = new Set();
  document.getElementById('shareModal').classList.add('active');
  document.querySelectorAll('.scope-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.scope-btn[data-scope="month"]').classList.add('active');
  shareScope = 'month';
  document.querySelectorAll('.ratio-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.ratio-btn[data-ratio="3:4"]').classList.add('active');
  document.querySelectorAll('.template-card').forEach(c=>c.classList.remove('selected'));
  document.querySelector('.template-card').classList.add('selected');
  renderSelectRecords();
}
function closeShareModal() { document.getElementById('shareModal').classList.remove('active'); }

function selectScope(scope, btn) {
  shareScope = scope;
  document.querySelectorAll('.scope-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  selectedIndices = new Set();
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
}

function renderSelectRecords() {
  const el = document.getElementById('selectRecords');
  if (!el) return;
  const all = getAllShareableRecords();
  selectedIndices = new Set();
  const autoN = shareTemplate === 'grid' ? 9 : shareTemplate === 'film' ? 8 : Math.min(all.length, 9);
  for (let i = 0; i < Math.min(autoN, all.length); i++) selectedIndices.add(i);
  el.innerHTML = all.map((item, i) => {
    const checked = selectedIndices.has(i) ? 'checked' : '';
    const hasPhoto = item.photo ? '📷' : '';
    return `<div class="select-record ${checked}" onclick="toggleRecord(${i}, this)" data-idx="${i}">
      <div class="sr-check">✓</div>
      <span class="sr-emoji">${hasPhoto||getModuleIcon(item.module)}</span>
      <span class="sr-text">${(item.text||'').slice(0, 30)}</span>
      <span class="sr-module">${getModuleTag(item.module)}</span>
    </div>`;
  }).join('');
}

function toggleRecord(idx, el) {
  if (selectedIndices.has(idx)) { selectedIndices.delete(idx); el.classList.remove('checked'); }
  else { selectedIndices.add(idx); el.classList.add('checked'); }
}

function getAllShareableRecords() {
  if (shareScope === 'month') return getAllMonthRecords();
  const dataMap = { mood:sampleMoodData, learn:sampleLearnData, travel:sampleTravelData, outfit:sampleOutfitData, food:sampleFoodData, career:sampleCareerData };
  return (dataMap[shareModule]||[]).map(d=>({...d, module:shareModule})).sort((a,b)=>b.date.localeCompare(a.date));
}

// ===== 关键词 =====
function extractKeywords() {
  const all = getAllMonthRecords();
  const stopWords = new Set(['今天','觉得','感觉','一个','非常','已经','什么','有点','一些','很多','这个','那个','因为','所以','但是','不过']);
  const freq = {};
  for (let r of all) {
    const t = r.text||'';
    for (let len = 2; len <= 4; len++) {
      for (let i = 0; i <= t.length - len; i++) {
        const chunk = t.slice(i, i+len);
        if (/^[\u4e00-\u9fa5]+$/.test(chunk) && !stopWords.has(chunk)) freq[chunk] = (freq[chunk]||0) + 1;
      }
    }
  }
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,6).map(e=>e[0]);
}

function calcHappiness() {
  const total = sampleMoodData.length;
  if (!total) return 0;
  return Math.round(sampleMoodData.filter(d=>d.mood==='happy'||d.mood==='excited').length / total * 100);
}

function drawDonut(ctx, cx, cy, r, pct, color) {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(180,200,186,0.3)'; ctx.lineWidth = 10; ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + (pct/100)*Math.PI*2);
  ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();
  ctx.fillStyle = color; ctx.font = '300 40px Lato, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(pct + '%', cx, cy + 6);
  ctx.fillStyle = '#8CA590'; ctx.font = '300 16px PingFang SC, sans-serif';
  ctx.fillText('幸福指数', cx, cy + 32);
}

// ===== 异步生成分享图 =====
function generateShare() {
  if (selectedIndices.size === 0) { showToast('请至少选择一条记录'); return; }
  const all = getAllShareableRecords();
  const selected = [];
  for (let idx of selectedIndices) { if (idx < all.length) selected.push(all[idx]); }
  selected.sort((a,b)=>b.date.localeCompare(a.date));
  closeShareModal();
  const canvas = document.getElementById('shareCanvas');
  setupCanvasSize(canvas);

  // 预加载所有照片
  const photosToLoad = selected.filter(s => s.photo).map(s => s.photo);
  Promise.all(photosToLoad.map(p => loadImage(p)))
    .then(() => {
      if (shareTemplate === 'grid') drawGridV2(canvas, selected);
      else if (shareTemplate === 'film') drawFilmV2(canvas, selected);
      else if (shareTemplate === 'mood') drawMoodCardV2(canvas);
      else if (shareTemplate === 'poster') drawPosterV2(canvas);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      document.getElementById('previewImage').src = dataUrl;
      document.getElementById('previewModal').classList.add('active');
    })
    .catch(() => {
      if (shareTemplate === 'grid') drawGridV2(canvas, selected);
      else if (shareTemplate === 'film') drawFilmV2(canvas, selected);
      else if (shareTemplate === 'mood') drawMoodCardV2(canvas);
      else if (shareTemplate === 'poster') drawPosterV2(canvas);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      document.getElementById('previewImage').src = dataUrl;
      document.getElementById('previewModal').classList.add('active');
    });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function closePreviewModal() { document.getElementById('previewModal').classList.remove('active'); }

function saveShareImage() {
  const link = document.createElement('a');
  link.download = `my-space-${shareTemplate}-${new Date().toISOString().slice(0,7)}.jpg`;
  link.href = document.getElementById('previewImage').src;
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  showToast('image saved');
}

function setupCanvasSize(canvas) {
  const base = 900;
  if (shareRatio === '3:4') { canvas.width = base; canvas.height = Math.round(base * 4/3); }
  else if (shareRatio === '9:16') { canvas.width = base; canvas.height = Math.round(base * 16/9); }
  else { canvas.width = base; canvas.height = base; }
}

// ===== 模板：格子拼图（含真实照片） =====
function drawGridV2(canvas, items) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FBFBF8'; ctx.fillRect(0,0,W,H);

  const n = items.length;
  let cols = n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const margin = 40, gap = 8;
  const cellW = (W - margin*2 - gap*(cols-1)) / cols;
  const cellH = (H - margin*2 - gap*(rows-1) - 90) / rows;
  const startY = 70;

  ctx.fillStyle = '#3D7044'; ctx.font = '300 32px Lato, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('MY SPACE', W/2, 40);

  items.forEach((item, i) => {
    const col = i % cols, row = Math.floor(i/cols);
    const x = margin + col*(cellW+gap), y = startY + row*(cellH+gap);

    // 有照片 → 照片填满格子
    if (item.photo) {
      try {
        const img = new Image();
        img.src = item.photo;
        if (img.complete && img.naturalWidth > 0) {
          // 圆角裁剪
          ctx.save();
          roundRect(ctx, x, y, cellW, cellH, 12);
          ctx.clip();
          // cover fit
          const scale = Math.max(cellW / img.width, cellH / img.height);
          const iw = img.width * scale, ih = img.height * scale;
          const ix = x - (iw - cellW)/2, iy = y - (ih - cellH)/2;
          ctx.drawImage(img, ix, iy, iw, ih);
          ctx.restore();
        } else {
          drawCellFallback(ctx, x, y, cellW, cellH, item);
        }
      } catch(e) {
        drawCellFallback(ctx, x, y, cellW, cellH, item);
      }
    } else {
      drawCellFallback(ctx, x, y, cellW, cellH, item);
    }

    // 底部半透明标签条
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(x, y+cellH-28, cellW, 28);
    ctx.fillStyle = '#B8C9BA'; ctx.font = '300 13px Lato, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(item.date?.slice(5)||'', x+cellW/2, y+cellH-8);
  });
}

function drawCellFallback(ctx, x, y, w, h, item) {
  ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#D4E5D6'; ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#1A2B1D'; ctx.font = '26px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(getModuleIcon(item.module)||'🌿', x+w/2, y+38);
  ctx.fillStyle = '#556B58'; ctx.font = '300 16px PingFang SC, sans-serif';
  wrapText(ctx, (item.text||'').slice(0, 18), x+w/2, y+60, w-16, 20);
}

// ===== 模板：胶片长卷（含照片） =====
function drawFilmV2(canvas, items) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FBFBF8'; ctx.fillRect(0,0,W,H);

  ctx.fillStyle = '#2A4F2F'; ctx.font = '300 32px Lato, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('MY SPACE', W/2, 50);
  ctx.fillStyle = '#D4E5D6'; ctx.fillRect(W/2-30,62,60,1);

  const usableH = H - 100;
  const perItemH = Math.min(usableH / Math.min(items.length, 8), 120);
  let ty = 90;
  const showItems = items.slice(0, Math.min(items.length, 8));

  showItems.forEach(item => {
    const ih = perItemH - 10;
    // 每个 item 左侧照片 + 右侧文字
    const photoW = item.photo ? 120 : 0;

    // card bg
    ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#D4E5D6'; ctx.lineWidth = 1;
    roundRect(ctx, 40, ty, W-80, ih, 12); ctx.fill(); ctx.stroke();

    // 左侧照片 or emoji
    if (item.photo && item.photo.startsWith('data:')) {
      try {
        const img = new Image();
        img.src = item.photo;
        ctx.save();
        roundRect(ctx, 54, ty+8, 104, ih-16, 8);
        ctx.clip();
        const scale = Math.max(104 / img.width, (ih-16) / img.height);
        const iw = img.width * scale, ih2 = img.height * scale;
        ctx.drawImage(img, 54-(iw-104)/2, ty+8-(ih2-(ih-16))/2, iw, ih2);
        ctx.restore();
      } catch(e) {}
    } else {
      ctx.fillStyle = '#1A2B1D'; ctx.font = '28px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(getModuleIcon(item.module)||'', 78, ty+ih/2+6);
    }

    // 右侧文字
    const tx = item.photo ? 175 : 78;
    ctx.fillStyle = '#1A2B1D'; ctx.font = '300 18px PingFang SC, sans-serif';
    wrapText(ctx, (item.text||'').slice(0, 40), tx+20, ty+30, W-tx-60, 26);

    // date
    ctx.fillStyle = '#B8C9BA'; ctx.font = '300 14px Lato, sans-serif';
    ctx.fillText(item.date?.slice(5)||'', tx+20, ty+ih-16);

    ty += perItemH;
  });

  ctx.fillStyle = '#B8C9BA'; ctx.font = 'italic 300 18px Lato, serif';
  ctx.textAlign = 'center'; ctx.fillText('grow a little every day', W/2, H-30);
}

// ===== 情绪卡片 v2 =====
function drawMoodCardV2(canvas) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'#EBF3EC'); grad.addColorStop(1,'#FBFBF8');
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

  ctx.fillStyle = '#2A4F2F'; ctx.font = '300 42px Lato, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('MY MOOD MAP', W/2, 80);
  ctx.fillStyle = '#8CA590'; ctx.font = 'italic 300 22px Lato, serif';
  ctx.fillText('March 2026', W/2, 110);

  const pct = calcHappiness();
  drawDonut(ctx, W/2, 230, 70, pct, '#3D7044');

  const emojis = sampleMoodData.map(d=>MOOD_TYPES[d.mood].emoji);
  const esp = (W-80)/emojis.length;
  let mx = 40;
  emojis.forEach((em,i)=>{ctx.font='20px sans-serif';ctx.textAlign='center';ctx.fillText(em,mx+esp/2,320);mx+=esp;});

  const kw = extractKeywords();
  ctx.fillStyle = '#8CA590'; ctx.font = '400 16px Lato, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('KEY WORDS', W/2, 380);
  ctx.fillStyle = '#2A4F2F'; ctx.font = '300 22px PingFang SC, sans-serif';
  ctx.fillText(kw.slice(0,4).join(' · '), W/2, 415);

  const best = [...sampleMoodData].sort((a,b)=>(b.mood==='excited'?3:b.mood==='happy'?2:1)-(a.mood==='excited'?3:a.mood==='happy'?2:1))[0];
  ctx.fillStyle = '#8CA590'; ctx.font = '400 16px Lato, sans-serif';
  ctx.fillText('BEST MOMENT', W/2, 480);
  ctx.fillStyle = '#1A2B1D'; ctx.font = '300 24px PingFang SC, sans-serif';
  wrapText(ctx, '「'+best.text+'」', W/2, 520, W-160, 32);

  ctx.fillStyle = '#B8C9BA'; ctx.font = 'italic 300 20px Lato, serif';
  ctx.textAlign = 'center'; ctx.fillText('my space · grow a little every day', W/2, H-40);
}

// ===== 月度画报 v2 =====
function drawPosterV2(canvas) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FBFBF8'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = '#EBF3EC'; ctx.fillRect(0,0,W,320);
  ctx.fillStyle = '#2A4F2F'; ctx.font = '300 120px Lato, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('MARCH', W/2, 180);
  ctx.fillStyle = '#8CA590'; ctx.font = '300 28px Lato, serif';
  ctx.fillText('2026', W/2, 220);

  const pct = calcHappiness();
  drawDonut(ctx, W/2 - 110, 430, 55, pct, '#3D7044');

  const nums = [{label:'MOODS',val:sampleModuleCounts.mood},{label:'BOOKS',val:sampleModuleCounts.learn},{label:'MEALS',val:sampleModuleCounts.food}];
  let ny = 380;
  nums.forEach(n=>{
    ctx.fillStyle = '#3D7044'; ctx.font = '300 36px Lato, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(String(n.val), W/2+10, ny+18);
    ctx.fillStyle = '#8CA590'; ctx.font = '400 13px Lato, sans-serif';
    ctx.fillText(n.label, W/2+60, ny+18);
    ny += 46;
  });

  const kw = extractKeywords();
  ctx.fillStyle = '#2A4F2F'; ctx.font = '300 28px PingFang SC, serif'; ctx.textAlign = 'center';
  ctx.fillText(kw.slice(0,4).join(' · '), W/2, 560);

  ctx.fillStyle = '#8CA590'; ctx.font = '400 14px Lato, sans-serif';
  ctx.fillText('MOOD TRACE', W/2, 610);
  const emojis = sampleMoodData.map(d=>MOOD_TYPES[d.mood].emoji);
  let ex = (W - emojis.length * 22) / 2;
  emojis.forEach((em,i)=>{ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillText(em,ex+12,650);ex+=22;});

  ctx.fillStyle = '#B8C9BA'; ctx.font = 'italic 300 22px Lato, serif';
  ctx.textAlign = 'center'; ctx.fillText('my space · grow a little every day', W/2, H-50);
}

// ===== Helpers =====
function getAllMonthRecords() {
  const all = [];
  sampleMoodData.forEach(d=>all.push({...d,module:'mood'}));
  sampleLearnData.filter(d=>d.date>='2026-03').forEach(d=>all.push({...d,module:'learn'}));
  sampleTravelData.filter(d=>d.date>='2026-03').forEach(d=>all.push({...d,module:'travel'}));
  sampleOutfitData.filter(d=>d.date>='2026-03').forEach(d=>all.push({...d,module:'outfit'}));
  sampleFoodData.filter(d=>d.date>='2026-03').forEach(d=>all.push({...d,module:'food'}));
  sampleCareerData.filter(d=>d.date>='2026-03').forEach(d=>all.push({...d,module:'career'}));
  return all.sort((a,b)=>b.date.localeCompare(a.date));
}

function getModuleIcon(m) { const m2 = { mood:'💭', learn:'📚', travel:'✈️', outfit:'👗', food:'🍜', career:'🏆' }; return m2[m]||'🌿'; }
function getModuleTag(m) { const m2 = { mood:'mood', learn:'learn', travel:'travel', outfit:'style', food:'food', career:'career' }; return m2[m]||''; }

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split(''); let line = ''; const lines = [];
  for (let i=0;i<words.length;i++) { const test = line+words[i]; if (ctx.measureText(test).width>maxW&&line){lines.push(line);line=words[i];}else line=test; }
  lines.push(line); lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineH));
}

function showToast(msg) {
  const old = document.querySelector('.toast'); if(old) old.remove();
  const t = document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),250)},1600);
}

document.addEventListener('DOMContentLoaded', renderHome);
