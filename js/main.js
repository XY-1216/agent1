const app = document.getElementById('app');
let groups = [];
const params = new URLSearchParams(location.search);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const favorites = () => JSON.parse(localStorage.getItem('kfcg-favorites') || '[]');
const saveFavorites = v => { localStorage.setItem('kfcg-favorites', JSON.stringify(v)); updateFavoriteCount(); };
function updateFavoriteCount(){ const el=document.getElementById('favorite-count'); if(el) el.textContent=favorites().length; }
function crumb(items){ return `<div class="breadcrumb">${items.map((x,i)=>`${i?' / ':''}${x.href?`<a href="${x.href}">${esc(x.label)}</a>`:esc(x.label)}`).join('')}</div>`; }
function groupById(id){ return groups.find(g=>g.id===id); }
function songData(group,id){ return group.songs.find(s=>s.id===id); }
function albumData(group,id){ return group.albums.find(a=>a.id===id); }
function imageTag(src,alt,cls=''){ 
  const safe=esc(src); const fallback='assets/albums/fallback.svg';
  return `<img class="${cls}" src="${safe}" alt="${esc(alt)}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'">`;
}
async function init(){
  try{
    const idx=await fetch('data/groups/index.json').then(r=>{if(!r.ok)throw new Error('index.json HTTP '+r.status);return r.json();});
    groups=await Promise.all(idx.map(async x=>{
      const g=await fetch(x.file).then(r=>{if(!r.ok)throw new Error(x.file+' HTTP '+r.status);return r.json();});
      g.image=x.image; return g;
    }));
    updateFavoriteCount(); route(); showIntro();
  }catch(e){
    app.innerHTML='<div class="empty">資料載入失敗。請確認 GitHub Repository 根目錄內有 index.html、data/、css/ 與 js/ 資料夾。</div>';
    console.error(e);
  }
}
function showIntro(){ if(!localStorage.getItem('kfcg-intro-seen')) document.getElementById('intro-modal').hidden=false; }
document.getElementById('modal-close').addEventListener('click',()=>{localStorage.setItem('kfcg-intro-seen','1');document.getElementById('intro-modal').hidden=true;});
function route(){
  const view=params.get('view'), gid=params.get('group')||'andteam', aid=params.get('album'), sid=params.get('song');
  if(view==='favorites') return renderFavorites();
  const g=groupById(gid)||groups[0];
  if(sid) return renderSong(g,sid);
  if(aid) return renderAlbum(g,aid);
  if(view==='group') return renderGroup(g);
  renderHome();
}
function renderHome(){
  app.innerHTML=`<section class="hero"><p class="eyebrow">THE FAN CHANT ARCHIVE</p><h1>Find your<br>fan chant.</h1><p>整理可查證的官方 K-pop 應援資訊，從團體、專輯到歌曲，快速找到你想跟上的應援。</p><div class="search-wrap"><input id="search" class="search" placeholder="搜尋團體、專輯或歌曲…" aria-label="搜尋"></div></section><div class="section-heading"><h2>團體 GROUPS</h2><span class="muted">目前收錄 ${groups.length} 個團體</span></div><div id="group-grid" class="group-grid"></div><section id="search-results" hidden></section>`;
  document.getElementById('group-grid').innerHTML=groups.map(g=>`<a class="group-card" href="?view=group&group=${g.id}"><div class="group-art">${imageTag(g.image,g.name)}</div><div class="card-title">${esc(g.name)}</div></a>`).join('');
  document.getElementById('search').addEventListener('input',e=>search(e.target.value));
}
function search(q){
  const box=document.getElementById('search-results'),grid=document.getElementById('group-grid'); q=q.trim().toLowerCase();
  if(!q){box.hidden=true;grid.hidden=false;return;}
  const rows=[];
  groups.forEach(g=>g.songs.forEach(s=>{const a=albumData(g,s.albumId);if([s.title,a?.title,g.name].join(' ').toLowerCase().includes(q))rows.push({g,s,a});}));
  box.hidden=false;grid.hidden=true;
  box.innerHTML=`<div class="section-heading"><h2>搜尋結果</h2><span class="muted">${rows.length} 筆</span></div>`+(rows.length?`<div class="song-list">${rows.map(x=>`<a class="song-row" href="?group=${x.g.id}&song=${x.s.id}"><span><strong>${esc(x.s.title)}</strong><br><small>${esc(x.g.name)} · ${esc(x.a?.title||'')}</small></span><span>→</span></a>`).join('')}</div>`:'<div class="empty">找不到符合的歌曲。</div>');
}
function renderGroup(g){
  app.innerHTML=crumb([{label:'首頁',href:'index.html'},{label:g.name}])+`<section class="hero"><p class="eyebrow">ARTIST</p><h1 class="page-title">${esc(g.name)}</h1><p class="page-subtitle">已收錄官方應援資料的專輯</p></section><div class="album-grid">${g.albums.map(a=>`<a class="album-card" href="?group=${g.id}&album=${a.id}">${imageTag(a.cover,a.title+' 封面')}<div class="card-title">${esc(a.title)}</div></a>`).join('')}</div>`;
}
function renderAlbum(g,id){
  const a=albumData(g,id); if(!a){app.innerHTML='<div class="empty">找不到這張專輯。</div>';return;}
  app.innerHTML=crumb([{label:'首頁',href:'index.html'},{label:g.name,href:`?view=group&group=${g.id}`},{label:a.title}])+`<section class="album-hero">${imageTag(a.cover,a.title+' 封面')}<div><p class="eyebrow">ALBUM</p><h1 class="page-title">${esc(a.title)}</h1><p class="page-subtitle">本專輯已確認收錄的應援歌曲</p><a class="source-link" target="_blank" rel="noopener" href="${a.officialSource}">查看官方專輯資料 ↗</a></div></section><div class="song-list">${a.songIds.map(id=>songData(g,id)).filter(Boolean).map(s=>`<a class="song-row" href="?group=${g.id}&song=${s.id}"><span><strong>${esc(s.title)}</strong><br><small>查看應援內容與官方來源</small></span><span>→</span></a>`).join('')}</div>`;
}
function renderSong(g,id){
  const s=songData(g,id); if(!s){app.innerHTML='<div class="empty">找不到這首歌曲。</div>';return;}
  const a=albumData(g,s.albumId),saved=favorites().includes(s.id);
  const sections=(s.chantSections||[]).map(c=>`<article class="chant-section"><div class="chant-label">${esc(c.label)}</div><div class="chant-cue">${esc(c.cue)}</div><p class="chant-detail">${esc(c.detail)}</p></article>`).join('');
  const guide=s.guideVideo?`<a class="primary" target="_blank" rel="noopener" href="${s.guideVideo}">觀看官方應援示範影片 ↗</a>`:'';
  app.innerHTML=crumb([{label:'首頁',href:'index.html'},{label:g.name,href:`?view=group&group=${g.id}`},{label:a?.title||'專輯',href:`?group=${g.id}&album=${a?.id}`},{label:s.title}])+`<div class="song-detail"><p class="eyebrow">OFFICIAL FAN CHANT</p><h1 class="page-title">${esc(s.title)}</h1><p class="page-subtitle">${esc(g.name)} · ${esc(a?.title||'')}</p><div class="song-panel"><h2>應援內容</h2>${sections||'<div class="empty">目前尚無整理好的應援提示。</div>'}<div class="lyric-guide"><strong>對應歌曲段落</strong><p>${esc(s.lyricGuide||'請依官方應援頁標示確認。')}</p><p class="muted">此處以段落定位與應援提示協助閱讀，不重製完整歌詞。</p></div><div class="song-actions"><button class="heart" id="heart">${saved?'♥ 已收藏':'♡ 加入收藏'}</button>${guide}<a class="secondary" target="_blank" rel="noopener" href="${s.officialSource}">開啟官方應援來源 ↗</a></div><p class="source-note">資料來源：${esc(s.sourceLabel||'官方來源')}。官方頁面如有更新，請以原始頁面為準。</p></div></div>`;
  document.getElementById('heart').addEventListener('click',()=>{let f=favorites();if(f.includes(s.id))f=f.filter(x=>x!==s.id);else f.push(s.id);saveFavorites(f);renderSong(g,id);});
}
function renderFavorites(){
  const rows=[];groups.forEach(g=>g.songs.forEach(s=>{if(favorites().includes(s.id))rows.push({g,s,a:albumData(g,s.albumId)});}));
  app.innerHTML=crumb([{label:'首頁',href:'index.html'},{label:'我的收藏'}])+`<section class="hero"><p class="eyebrow">YOUR COLLECTION</p><h1 class="page-title">我的收藏</h1><p class="page-subtitle">收藏的歌曲會保存在目前瀏覽器中。</p></section>`+(rows.length?`<div class="song-list">${rows.map(x=>`<a class="song-row" href="?group=${x.g.id}&song=${x.s.id}"><span><strong>${esc(x.s.title)}</strong><br><small>${esc(x.g.name)} · ${esc(x.a?.title||'')}</small></span><span>→</span></a>`).join('')}</div>`:'<div class="empty">目前還沒有收藏歌曲。到歌曲頁面按下「加入收藏」即可保存。</div>');
}
document.getElementById('favorites-nav').addEventListener('click',e=>{e.preventDefault();location.href='?view=favorites';});
init();
