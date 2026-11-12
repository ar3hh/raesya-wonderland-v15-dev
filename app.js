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
const SECTIONS={revision:['Year 3','Year 4','Year 5','8 KSSR subjects','Notes & exercises (pending)'],quiz:['Subject Quiz','Speed Quiz','True or False','Daily Challenge'],games:['Word Puzzle','Math Challenge','Word Search','Picture Spelling Challenge'],art:['Free Drawing','Coloring Book','Learn to Draw','My Art Gallery'],rizqi:['Safari Adventure','Rainbow Playground','Magic Shape Land','Little Picture World']};
let state={view:'home',history:[],profilePhoto:null,phase:'dev'};
try {const stored=JSON.parse(localStorage.getItem(STORE)||'null');if(stored&&typeof stored==='object'&&typeof stored.profilePhoto==='string')state.profilePhoto=stored.profilePhoto;}catch{}
function save(){try{localStorage.setItem(STORE,JSON.stringify({profilePhoto:state.profilePhoto,phase:'dev'}));return true}catch{return false}}
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;',"'":'&#39;'}[c]));
const avatar=()=>state.profilePhoto?`<img alt="Raesya profile" src="${safe(state.profilePhoto)}">`:'🌸';
function setMenu(open){$('sidebar').classList.toggle('open',open);$('sidebar').setAttribute('aria-hidden',String(!open));$('veil').hidden=!open;$('openMenu').setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);if(open)$('closeMenu').focus();}
function goto(id){if(!MENU.some(m=>m.id===id))return;if(state.view!==id)state.history.push(state.view);state.view=id;setMenu(false);render();$('view').focus({preventScroll:true});window.scrollTo(0,0)}
function home(){state.history=[];state.view='home';setMenu(false);render()}
function back(){state.view=state.history.pop()||'home';setMenu(false);render()}
function moduleCard(id){const m=MENU.find(x=>x.id===id);return `<button class="card" style="--bg:${m.bg};--fg:${m.fg}" data-go="${id}"><span class="emoji">${m.emoji}</span><strong>${m.name}</strong><small>${id==='revision'?'Learn & Practice':id==='quiz'?'Test Your Skills':id==='games'?'Play & Learn':'Draw & Color'}</small></button>`}
function render(){const m=MENU.find(x=>x.id===state.view);$('sidebarAvatar').innerHTML=avatar();$('menuList').innerHTML=MENU.map(x=>`<button class="menu-button ${x.id===state.view?'active':''}" data-id="${x.id}" style="--bg:${x.bg};--fg:${x.fg}"><span>${x.emoji}</span>${x.name}</button>`).join('');
if(state.view==='home'){$('view').innerHTML=`<div class="app-screen"><section class="panel hero"><div class="hero-avatar">${avatar()}</div><div><h1>Hi, Raesya! 🌸</h1><p class="muted">Ready for a wonderful day?</p><div class="notice">V15 development preview. Learning content is not installed yet.</div></div></section><h2>Explore Your Wonderland</h2><div class="cards">${['revision','quiz','games','art'].map(moduleCard).join('')}</div><section class="panel"><button class="banner" data-go="rizqi">🧸 Rizqi Explorer →<br><small>Little adventures for Rizqi!</small></button></section></div>`;return}
const moduleHead=`<div class="modulehead"><button class="backbtn" data-back>← Back</button><h1>${m.emoji} ${m.name}</h1><button class="backbtn" data-home>⌂ Home</button></div>`;
if(state.view==='settings'){$('view').innerHTML=`<section class="panel app-screen">${moduleHead}<div class="setting-box"><h2>Development profile</h2><p class="muted">Optional: use a local Raesya photo in this V15 preview. This does not read or alter V14.</p><label>Choose image (PNG/JPEG/WebP; maximum 2 MB)<input id="photoInput" type="file" accept="image/png,image/jpeg,image/webp"></label><div class="inlineactions"><button class="action" data-remove-photo>Remove preview photo</button></div><p class="statline">This photo is stored locally in this browser only. Do not upload a private backup JSON to a public repository.</p><p id="photoStatus" role="status"></p></div></section>`;return}
if(state.view==='parent'){$('view').innerHTML=`<section class="panel app-screen">${moduleHead}<div class="placeholder"><h2>🔒 Protected section not yet available</h2><p class="muted">Parent PIN, academic reports, Rizqi controls, and safe Restore will be implemented and tested in their dedicated phase. No PIN or private learning records are accessible in this preview.</p></div></section>`;return}
$('view').innerHTML=`<section class="panel app-screen">${moduleHead}<div class="placeholder"><h2>${m.name} — Coming in a later phase</h2><p class="muted">This is a navigation preview. Nothing here is a completed game, lesson or quiz yet.</p><div class="chips">${SECTIONS[state.view].map(s=>`<span class="chip">${safe(s)}</span>`).join('')}</div><p class="notice">Approved plan: full offline, responsive iPhone and laptop design, and full QA before release.</p></div></section>`;
}
$('menuList').addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(b)goto(b.dataset.id)});
$('view').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.go)goto(b.dataset.go);else if(b.hasAttribute('data-back'))back();else if(b.hasAttribute('data-home'))home();else if(b.hasAttribute('data-remove-photo')){state.profilePhoto=null;save();render()}});
$('view').addEventListener('change',e=>{if(e.target.id!=='photoInput')return;const file=e.target.files?.[0];const status=$('photoStatus');if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>2*1024*1024){status.textContent='Please select a JPEG, PNG or WebP smaller than 2 MB.';status.className='error';return}const reader=new FileReader();reader.onload=()=>{state.profilePhoto=reader.result;if(!save()){status.textContent='Local storage is full; photo cannot be saved.';status.className='error';return}render()};reader.readAsDataURL(file)});
$('openMenu').addEventListener('click',()=>setMenu(true));$('closeMenu').addEventListener('click',()=>setMenu(false));$('veil').addEventListener('click',()=>setMenu(false));window.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
render();
if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Offline registration failed',e)));
