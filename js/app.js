/* =================================================================
   My Space · App Logic v5
   localStorage 持久化 + 按日期导出
   ================================================================= */
let currentPage = 'home', currentPhoto = null, currentModule = 'mood';
// share vars declared in share section below

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
  const mods = ['mood','learn','travel','outfit','food','career'];
  const names = { mood:'情绪', learn:'学习', travel:'旅行', outfit:'穿搭', food:'美食', career:'职场' };
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  el.innerHTML = mods.map(k => {
    const data = getModuleData(k);
    const latest = data.length > 0 ? data[data.length - 1] : null;
    const hasData = !!latest;
    const dateStr = latest ? mon[new Date(latest.date).getMonth()] + ' ' + new Date(latest.date).getDate() : '';
    const text = latest ? (latest.text || '').slice(0, 30) : '';
    return `<div class="cut-card ${hasData ? 'has-data' : ''}" onclick="navigateTo('${k}')">
      <div class="cc-icon icon-svg">${MODULES[k].icon}</div>
      ${hasData ? `<div class="cc-text">${text}</div><div style="font-size:11px;color:var(--t3);">${dateStr}</div>` : `<div class="cc-empty">${names[k]}</div>`}
    </div>`;
  }).join('');
}

function renderStats() {
  const el = document.getElementById('statsGrid'); if (!el) return;
  const names = { mood:'Mood', learn:'Learn', travel:'Travel', outfit:'Style', food:'Food', career:'Career' };
  el.innerHTML = Object.keys(MODULES).map(k =>
    `<div class="stat-card" onclick="navigateTo('${k}')"><span class="stat-icon icon-svg">${MODULES[k].icon}</span><span class="stat-num">${getCurrentMonthCount(k)}</span><span class="stat-label">${names[k]}</span></div>`
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
    `<div class="explore-card" onclick="navigateTo('${k}')"><span class="ec-icon icon-svg">${MODULES[k].icon}</span><span class="ec-name">${MODULES[k].name}</span><span class="ec-name-en">${enNames[k]}</span><span class="ec-count">${getCurrentMonthCount(k)} this month</span></div>`
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
    h+='</div></div><div class="mood-legend" style="margin-top:8px">' + Object.entries(MOOD_TYPES).map(([k,v])=>'<span><span class="mood-dot '+k+'"></span>'+v.label+'</span>').join('') + '</div>';
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
function openModulePicker() {
  const el = document.getElementById('modulePicker');
  if (el) el.classList.add('active');
}
function closeModulePicker() {
  const el = document.getElementById('modulePicker');
  if (el) el.classList.remove('active');
}
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
// SHARE V4 · 一键预览 + 实时切换
// =================================================================
let shareMode = 'month', shareDate = '', shareTemplate = 'grid', shareRatio = '3:4';
let shareSelectedModules = new Set();
let selectedIndices = new Set();
let shareBg = 'charcoal'; // 底色: warm | cream | mint | charcoal

function openShareModal(module) {
  currentModule = module; shareMode = 'month'; shareRatio = '3:4';
  // Smart template pick
  const autoMap = { mood:'mood', travel:'polaroid', food:'polaroid', outfit:'polaroid', learn:'polaroid', career:'collage' };
   shareTemplate = autoMap[module] || 'grid';
  selectedIndices = new Set();
  shareSelectedModules = new Set();
  Object.keys(MODULES).forEach(k => shareSelectedModules.add(k));

  document.getElementById('shareModal').classList.add('active');
  // reset UI
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  const mb = document.querySelector('.mode-btn[data-mode="month"]');
  if (mb) mb.classList.add('active');
  document.querySelectorAll('.ts-chip').forEach(c => c.classList.remove('selected'));
  const tc = document.querySelector(`.ts-chip[data-tmpl="${shareTemplate}"]`);
  if (tc) tc.classList.add('selected');
  document.querySelectorAll('.ratio-chip').forEach(c => c.classList.remove('active'));
  const rc = document.querySelector('.ratio-chip[data-ratio="3:4"]');
  if (rc) rc.classList.add('active');
  // date setup
  if (!shareDate) { const n = new Date(); shareDate = n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0'); }
  const di = document.getElementById('shareDateInput'); if (di) di.value = shareDate;
  document.getElementById('shareDateRow').style.display = (shareMode === 'date') ? 'block' : 'none';
  document.getElementById('tweakBody').style.display = 'none';
  document.getElementById('tweakArrow').textContent = '▾';
  renderLivePreview();
}

function closeShareModal() { document.getElementById('shareModal').classList.remove('active'); }

function switchShareMode(mode, btn) {
  shareMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('shareDateRow').style.display = (mode === 'date') ? 'block' : 'none';
  // 今天模式：隐藏比例+底色（自由高度）
  const szEl = document.getElementById('shareSizeOptions');
  if (szEl) szEl.style.display = (mode === 'date') ? 'none' : 'block';
  selectedIndices = new Set();
  renderLivePreview();
  if (document.getElementById('tweakBody').style.display !== 'none') renderTweak();
}

function switchTemplate(tmpl, btn) {
  shareTemplate = tmpl;
  document.querySelectorAll('.ts-chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  renderLivePreview();
  if (document.getElementById('tweakBody').style.display !== 'none') renderTweak();
}

function switchRatio(ratio, btn) {
  shareRatio = ratio;
  document.querySelectorAll('.ratio-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderLivePreview();
}

function onShareDateChange() {
  shareDate = document.getElementById('shareDateInput').value;
  selectedIndices = new Set();
  renderLivePreview();
}

// 获取当前应导出的记录
function getShareItems() {
  if (shareMode === 'date') {
    return getDateAll(shareDate);
  }
  const all = [];
  const now = new Date();
  const ym = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  shareSelectedModules.forEach(k => {
    getModuleData(k).filter(r => r.date.startsWith(ym)).forEach(r => all.push({...r, module:k}));
  });
  all.sort((a,b) => b.date.localeCompare(a.date));
  return all;
}

// 核心：实时预览
async function renderLivePreview() {
  const items = getShareItems();
  const img = document.getElementById('sharePreviewImg');
  const empty = document.getElementById('sharePreviewEmpty');
  if (!img) return;

  if (items.length === 0) {
    img.style.display = 'none';
    if (empty) empty.style.display = 'flex';
    return;
  }
  img.style.display = 'block';
  if (empty) empty.style.display = 'none';

  const canvas = document.getElementById('shareCanvas'); if (!canvas) return;

  // Select items based on template
  let selected = items;
  if (shareTemplate === 'grid') selected = items.slice(0, 9);
  else if (shareTemplate === 'polaroid') selected = items;
  // mood+collage use all data via their own logic

  try {
    if (shareTemplate === 'grid') { setupCanvasSize(canvas); drawGridV3(canvas, selected); }
    else if (shareTemplate === 'polaroid') { canvas.width=1200; await drawScrapbookV3(canvas, selected); }
    else if (shareTemplate === 'mood') { setupCanvasSize(canvas); drawMoodCardV3(canvas); }
    else if (shareTemplate === 'collage') { setupCanvasSize(canvas); drawCollageV3(canvas, selected); }
    img.src = canvas.toDataURL('image/jpeg', 1.0);
  } catch(e) {
    img.style.display = 'none';
    if (empty) { empty.style.display = 'flex'; empty.textContent = '生成预览失败'; }
  }

  // store for save
  window._shareCache = {
    mode: shareMode, date: shareDate, template: shareTemplate, ratio: shareRatio,
    items: selected
  };
}

// 折叠面板
function toggleTweak() {
  const body = document.getElementById('tweakBody');
  const arrow = document.getElementById('tweakArrow');
  if (body.style.display === 'none') {
    body.style.display = 'block';
    arrow.textContent = '▴';
    renderTweak();
  } else {
    body.style.display = 'none';
    arrow.textContent = '▾';
  }
}

function renderTweak() {
  const el = document.getElementById('shareModulePicker');
  if (el && shareMode === 'month') {
    el.innerHTML = Object.keys(MODULES).map(k => {
      const c = shareSelectedModules.has(k) ? 'checked' : '';
      return '<div class="select-record '+c+'" onclick="toggleShareModule(\''+k+'\',this)"><div class="sr-check">✓</div><span class="sr-emoji icon-svg">'+MODULES[k].icon+'</span><span class="sr-text">'+MODULES[k].name+'</span><span class="sr-module">'+getCurrentMonthCount(k)+' this month</span></div>';
    }).join('');
  }
  renderSelectRecords();
}

function toggleShareModule(k, el) {
  if (shareSelectedModules.has(k)) { shareSelectedModules.delete(k); el.classList.remove('checked'); }
  else { shareSelectedModules.add(k); el.classList.add('checked'); }
  selectedIndices = new Set();
  renderSelectRecords();
  renderLivePreview();
}

function renderSelectRecords() {
  const el = document.getElementById('selectRecords'); if (!el) return;
  const all = getShareItems();
  const q = (document.getElementById('tweakSearch')?.value || '').toLowerCase().trim();
  const filtered = q ? all.filter(item => (item.text||'').toLowerCase().includes(q) || (item.module||'').toLowerCase().includes(q)) : all;
  if (selectedIndices.size === 0) {
    const n = Math.min(filtered.length, 9);
    for (let i=0;i<n;i++) selectedIndices.add(i);
  }
  if (filtered.length===0) { el.innerHTML='<p style="color:var(--t4);font-size:12px;text-align:center;padding:12px;">暂无匹配记录</p>'; return; }
  el.innerHTML = filtered.map((item,i)=>{
    const origIdx = all.indexOf(item);
    const c=selectedIndices.has(origIdx)?'checked':'';
    const ph=item.photo?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>':MODULES[item.module]?.icon||'';
    return '<div class="select-record '+c+'" onclick="toggleRecord('+origIdx+',this)"><div class="sr-check">✓</div><span class="sr-emoji icon-svg">'+ph+'</span><span class="sr-text">'+(item.text||'').slice(0,25)+'</span><span class="sr-module">'+getModuleTag(item.module)+'</span></div>';
  }).join('');
  window._shareAll = all;
}

function filterTweakRecords() {
  // Keep current selections intact, just re-render the list
  renderSelectRecords();
}

async function toggleRecord(idx, el) {
  if (selectedIndices.has(idx)) { selectedIndices.delete(idx); el.classList.remove('checked'); }
  else { selectedIndices.add(idx); el.classList.add('checked'); }
  // Re-render preview with selected items
  const all = window._shareAll || getShareItems();
  const selected = [];
  for (let idx of selectedIndices) { if (idx<all.length) selected.push(all[idx]); }
  const canvas = document.getElementById('shareCanvas'); if (!canvas) return;
  try {
    if (shareTemplate==='grid') { setupCanvasSize(canvas); drawGridV3(canvas, selected); }
    else if (shareTemplate==='polaroid') { canvas.width=1200; await drawScrapbookV3(canvas, selected); }
    else if (shareTemplate==='mood') { setupCanvasSize(canvas); drawMoodCardV3(canvas); }
    else { setupCanvasSize(canvas); drawCollageV3(canvas, selected); }
    document.getElementById('sharePreviewImg').src = canvas.toDataURL('image/jpeg',1.0);
  } catch(e) {}
}

function saveShareImage() {
  const src = document.getElementById('sharePreviewImg').src;
  if (!src || src === window.location.href) { showToast('请先等待预览生成'); return; }

  const canvas = document.getElementById('shareCanvas');
  if (!canvas) return;

  // 转为 Blob（安卓可靠方式）
  canvas.toBlob(function(blob) {
    if (!blob) { showToast('保存失败'); return; }
    const now = new Date();
    const fn = 'my-space-'+now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0')+'.jpg';

    // 尝试 navigator.share（现代安卓 Chrome）
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], fn, { type: 'image/jpeg' });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'My Space' }).then(() => {
          showToast('已分享');
        }).catch(() => {
          fallbackDownload(blob, fn);
        });
        return;
      }
    }
    fallbackDownload(blob, fn);
  }, 'image/jpeg', 1.0);
}

function fallbackDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(function() {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
  showToast('saved');
}

function getModuleIcon(m) { const m2={mood:'💭',learn:'📚',travel:'✈️',outfit:'👗',food:'🍜',career:'🏆'}; return m2[m]||'🌿'; }
function getModuleTag(m) { const m2={mood:'mood',learn:'learn',travel:'travel',outfit:'style',food:'food',career:'career'}; return m2[m]||''; }

// 底色映射
function getBgColor() {
  const bgMap = {
    warm: '#FBFBF8',
    cream: '#F9F5EC',
    mint: '#EEF5F0',
    charcoal: '#2D3335'
  };
  return bgMap[shareBg] || '#FBFBF8';
}
function getBgAccent() {
  const bgMap = {
    warm: '#EBF3EC',
    cream: '#F0E8D8',
    mint: '#DCEBE2',
    charcoal: '#3A4245'
  };
  return bgMap[shareBg] || '#EBF3EC';
}
function getTextDark() {
  return shareBg === 'charcoal' ? '#E8EBED' : '#1A2B1D';
}
function getTextMuted() {
  return shareBg === 'charcoal' ? '#9AA5A8' : '#8CA590';
}
function getTextLight() {
  return shareBg === 'charcoal' ? '#6B787C' : '#B8C9BA';
}
function getLineColor() {
  return shareBg === 'charcoal' ? '#4A5558' : '#D4E5D6';
}

function switchBg(bg, btn) {
  shareBg = bg;
  document.querySelectorAll('.bg-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderLivePreview();
}

function setupCanvasSize(canvas) {
  const base = 1200; // 高清输出
  if (shareRatio==='3:4') { canvas.width=base; canvas.height=Math.round(base*4/3); }
  else if (shareRatio==='9:16') { canvas.width=base; canvas.height=Math.round(base*16/9); }
  else { canvas.width=base; canvas.height=base; }
}

// ===== 拼图 v4 · 纯照片网格 =====
function drawGridV3(canvas, items) {
  const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');
  ctx.fillStyle=getBgColor(); ctx.fillRect(0,0,W,H);

  const photos=items.filter(r=>r.photo);
  const n=Math.max(photos.length,1);
  let cols=n<=3?n:(n<=6?3:3);
  const rows=Math.ceil(n/cols);
  const margin=60, gap=12;
  const cellW=(W-margin*2-gap*(cols-1))/cols;
  const cellH=cellW;

  const totalH=rows*cellH+(rows-1)*gap+100;
  const startY=Math.max(40,(H-totalH)/2);

  ctx.fillStyle=getTextDark(); ctx.font='300 28px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText('MY SPACE', W/2, startY-12);

  // render photos in grid
  const photoItems=items.filter(r=>r.photo);
  const textItems=items.filter(r=>!r.photo);

  photoItems.forEach((item,i)=>{
    const col=i%cols, row=Math.floor(i/cols);
    const x=margin+col*(cellW+gap), y=startY+row*(cellH+gap);

    ctx.save();
    // white border
    ctx.fillStyle='#FFFFFF'; ctx.shadowColor='rgba(0,0,0,0.1)'; ctx.shadowBlur=11;
    roundRect(ctx,x-4,y-4,cellW+8,cellH+8,6); ctx.fill();
    ctx.shadowColor='transparent'; ctx.shadowBlur=0;
    // photo
    const img=new Image(); img.src=item.photo;
    ctx.save(); roundRect(ctx,x,y,cellW,cellH,4); ctx.clip();
    const s=Math.max(cellW/img.width,cellH/img.height);
    ctx.drawImage(img,x-(img.width*s-cellW)/2,y-(img.height*s-cellH)/2,img.width*s,img.height*s);
    ctx.restore();
    // date label
    ctx.fillStyle='rgba(255,255,255,0.85)';
    ctx.fillRect(x+cellW-48, y+cellH-22, 44, 18);
    ctx.fillStyle=getTextMuted(); ctx.font='400 11px Lato,sans-serif'; ctx.textAlign='center';
    ctx.fillText(item.date?.slice(5)||'', x+cellW-26, y+cellH-8);
    ctx.restore();
  });

  // text items become a short paragraph below
  if (textItems.length>0) {
    const ty=startY+rows*cellH+(rows-1)*gap+24;
    const allText=textItems.map(r=>r.text||'').join(' · ');
    ctx.fillStyle=getTextDark(); ctx.font='300 15px PingFang SC,sans-serif'; ctx.textAlign='center';
    wrapText(ctx, allText.slice(0,80), W/2, ty, W-80, 22);
  }

  ctx.fillStyle=getTextLight(); ctx.font='italic 300 14px Lato,serif'; ctx.textAlign='center';
  ctx.fillText('my space · grow a little every day', W/2, H-30);
}

// ===== 日签 v7 · 全宽纵列，先加载后算高，绝不截断 =====
async function drawScrapbookV3(canvas, items) {
  const W=canvas.width, ctx=canvas.getContext('2d');
  const M=44;

  if (!items.length) return;
  const d=new Date(items[0].date);
  const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const moodItem=items.find(r=>r.mood);
  const photoItems=items.filter(r=>r.photo);
  const textItems=items.filter(r=>!r.photo&&!r.mood);

  // ── 第一步：加载所有照片，获取真实尺寸 ──
  const picW=W-M*2;
  const photoData=[];
  if (photoItems.length>0) {
    const loads=photoItems.map(item=>new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve({img, item, w:img.width, h:img.height});
      img.onerror=()=>resolve({img:null, item, w:1, h:1});
      img.src=item.photo;
    }));
    const results=await Promise.all(loads);
    // 等图片加载完，计算真实高度
    results.forEach(r=>{
      const ratio=r.w&&r.h?r.h/r.w:0.75;
      const ih=Math.min(Math.round(picW*ratio), Math.round(picW*1.8));
      photoData.push({img:r.img, item:r.item, ih});
    });
  }

  // ── 第二步：精确算总高度 ──
  let totalH=M+100;
  if (moodItem) { const cl=[...moodItem.text].length; totalH+=Math.ceil(cl/16)*44+20; }
  if (photoData.length>0) { photoData.forEach(p=>{totalH+=p.ih+14;}); totalH+=18; }
  else totalH+=10;
  textItems.forEach(t=>{ const cl=[...(t.text||'')].length; totalH+=Math.ceil(cl/22)*32+8; });
  totalH+=60;

  canvas.height=Math.max(totalH+20, 600);
  const H=canvas.height;

  // ── 第三步：画 ──
  ctx.fillStyle=getBgColor(); ctx.fillRect(0,0,W,H);

  // 标题
  ctx.fillStyle=getTextDark(); ctx.font='300 48px Lato,sans-serif';
  ctx.fillText(mon[d.getMonth()]+' '+d.getDate(),M,72);
  ctx.fillStyle=getTextMuted(); ctx.font='300 20px Lato,serif';
  ctx.fillText(week[d.getDay()],M,100);
  ctx.strokeStyle=getLineColor(); ctx.lineWidth=1.2; ctx.beginPath();
  ctx.moveTo(M,116); ctx.lineTo(W-M,116); ctx.stroke();

  let y=M+150;

  // 情绪
  if (moodItem) {
    const mi=MOOD_TYPES[moodItem.mood];
    ctx.fillStyle=getTextDark(); ctx.font='italic 300 34px PingFang SC,serif';
    const lines=wrapTextLines(ctx,mi.emoji+' '+moodItem.text,W-M*2);
    lines.forEach(l=>{ctx.fillText(l,M,y);y+=44;});
    y+=20;
  }

  // 照片：全宽一列，用真实高度
  if (photoData.length>0) {
    const pY=y;
    let py=pY;
    photoData.forEach(p=>{
      if (!p.img) { py+=picW*0.75+14; return; }
      ctx.save();
      roundRect(ctx,M,py,picW,p.ih,12); ctx.clip();
      const s=Math.max(picW/p.img.width,p.ih/p.img.height);
      ctx.drawImage(p.img,M-(p.img.width*s-picW)/2,py-(p.img.height*s-p.ih)/2,p.img.width*s,p.img.height*s);
      ctx.restore();

      const tag=getModuleTag(p.item.module);
      if (tag) {
        ctx.fillStyle='rgba(0,0,0,0.45)';
        roundRect(ctx,M+picW-46,py+p.ih-24,42,20,10); ctx.fill();
        ctx.fillStyle='#FFFFFF'; ctx.font='400 11px Lato,sans-serif'; ctx.textAlign='center';
        ctx.fillText(tag,M+picW-25,py+p.ih-9);
      }
      py+=p.ih+14;
    });
    y=py+18;
  }

  // 文字
  textItems.forEach(item=>{
    const pre=getModuleIcon(item.module);
    ctx.fillStyle=getTextMuted(); ctx.font='20px sans-serif';
    ctx.textAlign='left';
    ctx.fillText(pre, M, y+24);
    ctx.fillStyle=getTextDark(); ctx.font='300 22px PingFang SC,sans-serif';
    const lines=wrapTextLines(ctx, item.text||'', W-M*2-44);
    lines.forEach(l=>{ ctx.fillText(l, M+40, y+24); y+=32; });
    y+=8;
  });

  // 底部
  ctx.fillStyle=getTextLight(); ctx.font='italic 300 15px Lato,serif'; ctx.textAlign='right';
  ctx.fillText('⸻ my space',W-M,H-30);
}

// ===== 月度回忆 v4 · 有机排版 =====
function drawCollageV3(canvas, items) {
  const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');

  // 暖白底
  ctx.fillStyle=getBgColor(); ctx.fillRect(0,0,W,H);

  const now=new Date();
  const mon=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const monShort=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // ── 全幅照片条 ──
  const pics=items.filter(r=>r.photo).slice(0,4);
  const picH=pics.length>0?Math.round(H*0.26):0;
  if (pics.length>0) {
    const pw=W/pics.length;
    pics.forEach((r,i)=>{
      const img=new Image(); img.src=r.photo;
      ctx.save();
      ctx.beginPath(); ctx.rect(Math.floor(i*pw+1),0,Math.ceil(pw-1),picH); ctx.clip();
      const s=Math.max(pw/img.width, picH/img.height);
      ctx.drawImage(img,Math.floor(i*pw)-(img.width*s-pw)/2,-(img.height*s-picH)/2,img.width*s,img.height*s);
      ctx.restore();
    });
    // 渐变过渡
    const g=ctx.createLinearGradient(0,picH-36,0,picH);
    g.addColorStop(0,'rgba(251,251,248,0)');g.addColorStop(1,getBgColor());
    ctx.fillStyle=g;ctx.fillRect(0,picH-36,W,36);
  }

  const ty=picH+(picH>0?20:32);

  // ── 月份 ──
  ctx.fillStyle=getTextDark();ctx.font='300 58px Lato,sans-serif';ctx.textAlign='left';
  ctx.fillText(mon[now.getMonth()],48,ty+52);
  ctx.fillStyle=getTextMuted();ctx.font='300 18px Lato,serif';
  ctx.fillText(String(now.getFullYear()),48,ty+76);
  ctx.fillStyle=getLineColor();ctx.fillRect(48,ty+86,W-96,1);

  // ── 幸福感环形图 ──
  const ringCY=ty+180,ringR=44;
  drawDonut(ctx,W/2-60,ringCY,ringR,calcHappiness(),getTextDark());

  // ── 右侧数据文字 ──
  const sdata=[
    {l:'MOOD DAYS',v:getCurrentMonthCount('mood')},
    {l:'INSIGHTS',v:getCurrentMonthCount('learn')},
    {l:'MEALS',v:getCurrentMonthCount('food')},
    {l:'TRIPS',v:getCurrentMonthCount('travel')}
  ];
  sdata.forEach((n,i)=>{
    const py=ringCY-32+i*42;
    ctx.fillStyle=getTextDark();ctx.font='300 28px Lato,sans-serif';ctx.textAlign='left';
    ctx.fillText(String(n.v),W/2+30,py+18);
    ctx.fillStyle=getTextMuted();ctx.font='400 12px Lato,sans-serif';
    ctx.fillText(n.l,W/2+68,py+18);
  });

  // ── 关键词 ──
  const kw=extractKeywords(getThisMonthAll());
  const kwY=ringCY+ringR+48;
  ctx.fillStyle=getTextDark();ctx.font='300 24px PingFang SC,serif';ctx.textAlign='center';
  ctx.fillText(kw.slice(0,4).join(' · '),W/2,kwY);

  // ── 情绪河流（两排圆点）──
  const moods=getModuleData('mood');
  const ym=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const rY=kwY+36,rR=13,rG=4;
  const cols2=Math.ceil(dim/2);
  const tW=cols2*(rR*2+rG)-rG;
  const rx=(W-tW)/2;
  const mc={happy:'#C9DFCC',calm:'#D9E7DC',excited:'#DFEED0',sad:'#EDF0EE',anxious:'#EFEBE4',angry:'#F0E4E4'};
  for (let d=1;d<=dim;d++){
    const ds=ym+'-'+String(d).padStart(2,'0');
    const rec=moods.find(r=>r.date===ds);
    const col=(d-1)%cols2,row=Math.floor((d-1)/cols2);
    ctx.beginPath();ctx.arc(rx+col*(rR*2+rG)+rR,rY+row*(rR*2+rG)+rR,rR,0,Math.PI*2);
    ctx.fillStyle=rec?mc[rec.mood]||'#D9E7DC':'#EEF0ED';ctx.fill();
  }
  ctx.fillStyle=getTextLight();ctx.font='400 12px Lato,sans-serif';ctx.textAlign='center';
  ctx.fillText('MOOD RIVER',W/2,rY+2*(rR*2+rG)+18);

  // ── 底部 ──
  ctx.fillStyle=getTextLight();ctx.font='italic 300 15px Lato,serif';ctx.textAlign='right';
  ctx.fillText('grow a little every day · my space',W-48,H-28);
}

function drawMoodCardV3(canvas) {
  const W=canvas.width, H=canvas.height, ctx=canvas.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,getBgAccent()); grad.addColorStop(1,getBgColor());
  ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
  ctx.fillStyle=getTextDark(); ctx.font='300 42px Lato,sans-serif'; ctx.textAlign='center';
  ctx.fillText('MY MOOD', W/2, 70);
  ctx.fillStyle=getTextMuted(); ctx.font='italic 300 20px Lato,serif';
  const now=new Date(); const mon=['January','February','March','April','May','June','July','August','September','October','November','December'];
  ctx.fillText(mon[now.getMonth()]+' '+now.getFullYear(), W/2, 100);
  const pct=calcHappiness();
  drawDonut(ctx, W/2-80, 210, 55, pct, getTextDark());
  const moods=getModuleData('mood');
  const ym=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  const thisMonthMoods=moods.filter(d=>d.date.startsWith(ym));
  let happy=0, calm=0, sad=0;
  thisMonthMoods.forEach(d=>{if(d.mood==='happy'||d.mood==='excited')happy++;else if(d.mood==='calm')calm++;else sad++;});
  [{label:'😊 Happy',val:happy,color:getTextDark()},{label:'😌 Calm',val:calm,color:getTextMuted()},{label:'😢 Low',val:sad,color:getTextLight()}].forEach((ind,i)=>{
    ctx.fillStyle=ind.color; ctx.font='300 28px Lato,sans-serif'; ctx.textAlign='left';
    ctx.fillText(String(ind.val),W/2+30,180+i*40+18);
    ctx.fillStyle=getTextMuted(); ctx.font='300 16px Lato,sans-serif';
    ctx.fillText(ind.label,W/2+70,180+i*40+18);
  });
  const lineY=300, lineH=150, lineX0=80, lineX1=W-60;
  ctx.strokeStyle=getLineColor(); ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(lineX0,lineY+lineH); ctx.lineTo(lineX1,lineY+lineH); ctx.stroke();
  const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
  const stepX=(lineX1-lineX0)/Math.max(dim-1,1);
  const pts=[];
  for(let d=1;d<=dim;d++){
    const ds=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const rec=moods.find(r=>r.date===ds);
    if(rec){const v=MOOD_TYPES[rec.mood]?.v||3;pts.push({x:lineX0+(d-1)*stepX,y:lineY+lineH-(v/5)*lineH,v});}
  }
  if(pts.length>1){
    ctx.beginPath();ctx.moveTo(pts[0].x,lineY+lineH);
    pts.forEach(p=>ctx.lineTo(p.x,p.y));
    ctx.lineTo(pts[pts.length-1].x,lineY+lineH);ctx.closePath();
    ctx.fillStyle='rgba(123,174,110,0.12)';ctx.fill();
    ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
    for(let i=1;i<pts.length;i++){const xc=(pts[i].x+pts[i-1].x)/2;ctx.quadraticCurveTo(pts[i-1].x,pts[i-1].y,xc,(pts[i].y+pts[i-1].y)/2);}
    ctx.lineTo(pts[pts.length-1].x,pts[pts.length-1].y);
    ctx.strokeStyle=getTextDark();ctx.lineWidth=2.5;ctx.lineCap='round';ctx.stroke();
    pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle=getTextDark();ctx.fill();});
  }
  ctx.fillStyle=getTextMuted();ctx.font='300 14px Lato,sans-serif';ctx.textAlign='center';
  ctx.fillText('MOOD CURVE',W/2,lineY+lineH+30);
  const kw=extractKeywords(thisMonthMoods);
  ctx.fillStyle=getTextMuted();ctx.font='400 14px Lato,sans-serif';
  ctx.fillText('KEY WORDS',W/2,530);
  ctx.fillStyle=getTextDark();ctx.font='300 20px PingFang SC,sans-serif';
  ctx.fillText(kw.slice(0,4).join(' · '),W/2,558);
  ctx.fillStyle=getTextLight();ctx.font='italic 300 18px Lato,serif';
  ctx.fillText('my space · grow a little every day',W/2,H-30);
}

function drawDonut(ctx,cx,cy,r,pct,color) {
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.strokeStyle=shareBg==='charcoal'?'rgba(255,255,255,0.12)':'rgba(180,200,186,0.3)';ctx.lineWidth=10;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+(pct/100)*Math.PI*2);
  ctx.strokeStyle=color;ctx.lineWidth=10;ctx.lineCap='round';ctx.stroke();
  ctx.fillStyle=color;ctx.font='300 36px Lato,sans-serif';ctx.textAlign='center';
  ctx.fillText(pct+'%',cx,cy+5);
  ctx.fillStyle=getTextMuted();ctx.font='300 14px PingFang SC,sans-serif';
  ctx.fillText('幸福指数',cx,cy+28);
}

// ===== Helpers =====
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

// path-only version for clip()
function roundRectPath(ctx,x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function wrapText(ctx,text,x,y,maxW,lineH){
  const chars=[...text]; let line=''; const lines=[];
  for(let i=0;i<chars.length;i++){const test=line+chars[i]; if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=chars[i];}else line=test;}
  lines.push(line); lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineH));
}

// return lines array (for manual positioning)
function wrapTextLines(ctx,text,maxW){
  const chars=[...text]; let line=''; const lines=[];
  for(let i=0;i<chars.length;i++){const test=line+chars[i]; if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=chars[i];}else line=test;}
  lines.push(line); return lines;
}

function showToast(msg){
  const old=document.querySelector('.toast'); if(old)old.remove();
  const t=document.createElement('div'); t.className='toast'; t.textContent=msg;
  document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),250)},1600);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  // backup FAB listener
  const fab = document.getElementById('fabAdd');
  if (fab) fab.addEventListener('click', openModulePicker);
});
