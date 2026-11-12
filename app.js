// Raesya's WonderLand V15 — independent development shell. No V14 storage is read or altered.
'use strict';
const MENU=[
{id:'home',name:'Home Dashboard',emoji:'🏠',bg:'#fce2ee',fg:'#914266'},
{id:'revision',name:'Revision Zone',emoji:'📚',bg:'#dceeff',fg:'#276999'},
{id:'quiz',name:'Quiz Zone',emoji:'📝',bg:'#ede2ff',fg:'#7953a6'},
{id:'games',name:'Educational Games',emoji:'🎮',bg:'#dcf5df',fg:'#397c48'},
{id:'art',name:'Creative Art Studio',emoji:'🎨',bg:'#fff0be',fg:'#986a17'},
{id:'rizqi',name:'Rizqi Explorer',emoji:'🧸',bg:'#ffe3d1',fg:'#9b5c38'},
{id:'parent',name:'Parent Dashboard',emoji:'🔐',bg:'#e7e8f0',fg:'#62657b'},
{id:'settings',name:'Settings',emoji:'⚙️',bg:'#d5f5f2',fg:'#257b77'}];
const $=id=>document.getElementById(id);
const STORE='raesya-wonderland-v15-dev-v1';
const MODULES={
 revision:{tag:'Discover • Learn • Grow',intro:'Choose your year and explore an adventure of new knowledge.',accent:'#e4f1ff',ink:'#2f6595',icon:'📚',items:[
  {id:'y3',name:'Year 3',icon:'🌱',desc:'Start your learning journey',tone:'#dcf2e8',label:'8 subjects'},
  {id:'y4',name:'Year 4',icon:'🌟',desc:'Build stronger skills',tone:'#eee5ff',label:'8 subjects'},
  {id:'y5',name:'Year 5',icon:'🚀',desc:'Challenge yourself',tone:'#ffe5d7',label:'8 subjects'}]},
 quiz:{tag:'Think • Answer • Shine',intro:'Pick a fun way to test what you know!',accent:'#efe5ff',ink:'#78529d',icon:'📝',items:[
  {id:'subject',name:'Subject Quiz',icon:'📖',desc:'20 questions in a subject you choose',tone:'#e1f0ff',label:'20 questions'},
  {id:'speed',name:'Speed Quiz',icon:'⏱️',desc:'How many can you answer in 60 seconds?',tone:'#ffe8d9',label:'60 seconds'},
  {id:'truefalse',name:'True or False',icon:'✅',desc:'Think carefully and decide!',tone:'#e4f5e8',label:'20 questions'},
  {id:'daily',name:'Daily Challenge',icon:'🏆',desc:'A new mixed-subject challenge each day',tone:'#fff1c9',label:'20 questions'}]},
 games:{tag:'Play • Discover • Practice',intro:'Little challenges, big discoveries. Find your favourite game!',accent:'#e4f5e6',ink:'#367849',icon:'🎮',items:[
  {id:'word',name:'Word Puzzle',icon:'🔤',desc:'Put the letters in the right place',tone:'#e5efff',label:'English'},
  {id:'math',name:'Math Challenge',icon:'➗',desc:'Add, subtract, multiply and divide',tone:'#fff0d3',label:'Years 3–5'},
  {id:'search',name:'Word Search',icon:'🔎',desc:'Find hidden words in the grid',tone:'#f3e3ff',label:'English'},
  {id:'spelling',name:'Picture Spelling',icon:'🦋',desc:'Look at a picture and spell its name',tone:'#ffe5eb',label:'English'}]},
 art:{tag:'Imagine • Create • Smile',intro:'Your own colourful world to draw, paint and keep!',accent:'#fff2c9',ink:'#926717',icon:'🎨',items:[
  {id:'draw',name:'Free Drawing',icon:'🖌️',desc:'Create anything you can imagine',tone:'#ffe4ed',label:'Your canvas'},
  {id:'color',name:'Coloring Book',icon:'🌈',desc:'Bring lovely pictures to life',tone:'#e2efff',label:'50 designs planned'},
  {id:'learn',name:'Learn to Draw',icon:'✏️',desc:'Follow easy step-by-step guides',tone:'#e9e3ff',label:'30 guides planned'},
  {id:'gallery',name:'My Art Gallery',icon:'🖼️',desc:'Your saved artwork will live here',tone:'#e3f4e5',label:'Your creations'}]},
 rizqi:{tag:'Little Steps • Big Smiles',intro:'Colourful picture adventures for our little explorer!',accent:'#ffe7d8',ink:'#99583a',icon:'🧸',items:[
  {id:'safari',name:'Safari Adventure',icon:'🦁',desc:'Match the animals',tone:'#e7f5d8',label:'Animal Matching'},
  {id:'rainbow',name:'Rainbow Playground',icon:'🌈',desc:'Sort bright and beautiful colours',tone:'#ffe6ef',label:'Color Sorting'},
  {id:'shapes',name:'Magic Shape Land',icon:'🔺',desc:'Discover and match shapes',tone:'#e4eaff',label:'Shape Puzzle'},
  {id:'picture',name:'Little Picture World',icon:'🍎',desc:'Look at the picture and choose',tone:'#fff0d0',label:'Picture Quiz'}]}
};
let state={view:'home',detail:null,profilePhoto:null,phase:'dev'};
try {const stored=JSON.parse(localStorage.getItem(STORE)||'null');if(stored&&typeof stored==='object'&&typeof stored.profilePhoto==='string')state.profilePhoto=stored.profilePhoto;}catch{}
function save(){try{localStorage.setItem(STORE,JSON.stringify({profilePhoto:state.profilePhoto,phase:'dev'}));return true}catch{return false}}
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;',"'":'&#39;'}[c]));
const avatar=()=>state.profilePhoto?`<img alt="Raesya profile" src="${safe(state.profilePhoto)}">`:'🌸';
function setMenu(open){$('sidebar').classList.toggle('open',open);$('sidebar').setAttribute('aria-hidden',String(!open));$('veil').hidden=!open;$('openMenu').setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);if(open)$('closeMenu').focus();}
function goto(id){if(!MENU.some(m=>m.id===id))return;state.view=id;state.detail=null;setMenu(false);render();$('view').focus({preventScroll:true});window.scrollTo(0,0)}
function home(){state.detail=null;state.view='home';setMenu(false);render();window.scrollTo(0,0)}
// Approved navigation: Back always returns to the main dashboard.
function back(){home()}
function moduleCard(id){const m=MENU.find(x=>x.id===id);return `<button class="card" style="--bg:${m.bg};--fg:${m.fg}" data-go="${id}"><span class="emoji">${m.emoji}</span><strong>${m.name}</strong><small>${id==='revision'?'Learn & Practice':id==='quiz'?'Test Your Skills':id==='games'?'Play & Learn':'Draw & Color'}</small></button>`}
function hub(m){
 const mod=MODULES[state.view];
 const cards=mod.items.map((item,i)=>`<button class="activity-card" data-detail="${item.id}" style="--tile:${item.tone};--item-accent:${mod.ink}"><span class="activity-art" aria-hidden="true"><span class="art-dot dot-a"></span><span class="art-dot dot-b"></span><span class="activity-emoji">${item.icon}</span></span><span class="activity-info"><span class="activity-label">${safe(item.label)}</span><strong>${safe(item.name)}</strong><small>${safe(item.desc)}</small><span class="activity-open">Explore <span aria-hidden="true">→</span></span></span></button>`).join('');
 return `<section class="panel app-screen module-shell" style="--module-tint:${mod.accent};--module-ink:${mod.ink}">${head(m)}<div class="module-hero"><span class="module-hero-art" aria-hidden="true">${mod.icon}</span><div><span class="eyebrow">${safe(mod.tag)}</span><h2>${safe(m.name)}</h2><p>${safe(mod.intro)}</p></div></div><div class="section-title"><div><h3>Choose your adventure</h3><p>Tap a card to explore</p></div><span class="preview-tag">UI Preview</span></div><div class="activity-grid">${cards}</div><div class="module-footnote">✨ Beautiful things are coming! These cards preview the V15 activities. Learning lessons and games are not available yet.</div></section>`;
}
function head(m){return `<div class="modulehead"><button class="backbtn" data-back>← Back to Home</button><h1>${m.emoji} ${safe(m.name)}</h1><button class="backbtn" data-home>⌂ Home</button></div>`}
function detailView(m){
 const mod=MODULES[state.view],item=mod.items.find(x=>x.id===state.detail);
 if(!item){state.detail=null;return hub(m)}
 return `<section class="panel app-screen module-shell" style="--module-tint:${mod.accent};--module-ink:${mod.ink}">${head(m)}<div class="detail-intro" style="--tile:${item.tone}"><div class="detail-bigicon">${item.icon}</div><span class="activity-label">${safe(item.label)}</span><h2>${safe(item.name)}</h2><p>${safe(item.desc)}</p><span class="status-pill">🚧 In development</span></div><div class="detail-bottom"><h3>Coming in a later development phase</h3><p>This is the design preview for ${safe(item.name)}. Its learning content or interactive game has not been implemented or tested yet.</p><button class="action primary" data-module>← All ${safe(m.name)} activities</button></div></section>`;
}
function render(){const m=MENU.find(x=>x.id===state.view);$('sidebarAvatar').innerHTML=avatar();$('menuList').innerHTML=MENU.map(x=>`<button class="menu-button ${x.id===state.view?'active':''}" data-id="${x.id}" style="--bg:${x.bg};--fg:${x.fg}"><span>${x.emoji}</span>${x.name}</button>`).join('');
if(state.view==='home'){$('view').innerHTML=`<div class="app-screen"><section class="panel hero"><div class="hero-avatar">${avatar()}</div><div><h1>Hi, Raesya! 🌸</h1><p class="muted">Ready for a wonderful day?</p><div class="notice">V15 development preview. Learning content is not installed yet.</div></div></section><h2>Explore Your Wonderland</h2><div class="cards">${['revision','quiz','games','art'].map(moduleCard).join('')}</div><section class="panel"><button class="banner" data-go="rizqi">🧸 Rizqi Explorer →<br><small>Little adventures for Rizqi!</small></button></section></div>`;return}
if(state.view==='settings'){$('view').innerHTML=`<section class="panel app-screen">${head(m)}<div class="setting-box"><h2>Development profile</h2><p class="muted">Optional: use a local Raesya photo in this V15 preview. This does not read or alter V14.</p><label>Choose image (PNG/JPEG/WebP; maximum 2 MB)<input id="photoInput" type="file" accept="image/png,image/jpeg,image/webp"></label><div class="inlineactions"><button class="action" data-remove-photo>Remove preview photo</button></div><p class="statline">This photo is stored locally in this browser only. Do not upload a private backup JSON to a public repository.</p><p id="photoStatus" role="status"></p></div></section>`;return}
if(state.view==='parent'){$('view').innerHTML=`<section class="panel app-screen">${head(m)}<div class="placeholder"><h2>🔒 Protected section not yet available</h2><p class="muted">Parent PIN, academic reports, Rizqi controls, and safe Restore will be implemented and tested in their dedicated phase. No PIN or private learning records are accessible in this preview.</p></div></section>`;return}
$('view').innerHTML=state.detail?detailView(m):hub(m);
}
$('menuList').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(b)goto(b.dataset.id)});
$('view').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.go)goto(b.dataset.go);else if(b.dataset.detail){state.detail=b.dataset.detail;render();window.scrollTo(0,0)}else if(b.hasAttribute('data-module')){state.detail=null;render()}else if(b.hasAttribute('data-back'))back();else if(b.hasAttribute('data-home'))home();else if(b.hasAttribute('data-remove-photo')){state.profilePhoto=null;save();render()}});
$('view').addEventListener('change',e=>{if(e.target.id!=='photoInput')return;const file=e.target.files?.[0];const status=$('photoStatus');if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2*1024*1024){status.textContent='Please select a JPEG, PNG or WebP smaller than 2 MB.';status.className='error';return}const reader=new FileReader();reader.onload=()=>{state.profilePhoto=reader.result;if(!save()){status.textContent='Local storage is full; photo cannot be saved.';status.className='error';return}render()};reader.readAsDataURL(file)});
$('openMenu').addEventListener('click',()=>setMenu(true));$('closeMenu').addEventListener('click',()=>setMenu(false));$('veil').addEventListener('click',()=>setMenu(false));window.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
render();
if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Offline registration failed',e)));
