 'use strict';
/* v40 Little Picture World cycle deck and optional verified premium asset loader. */
(function(){
 const STORE='rw-v15-lpw-deck-v1';
 const PICTURES=['Apple','Banana','Orange','Pear','Lemon','Grapes','Carrot','Cherry','Fish','Bird','Cat','Dog','Lion','Tiger','Rabbit','Duck','Butterfly','Elephant','Flower','Star','Bicycle','Teddy Bear'];
 let locked=false;
 function read(){try{const a=JSON.parse(localStorage.getItem(STORE)||'{}');return a&&typeof a==='object'?a:{}}catch(e){return {}}}
 function write(v){try{localStorage.setItem(STORE,JSON.stringify(v))}catch(e){}}
 function shuffle(a){let b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=b[i];b[i]=b[j];b[j]=t;}return b}
 function nextDeck(level){
  const old=read();
  // seen keeps an object out of subsequent sessions until every object has appeared.
  // At a cycle boundary, any previously unused objects are dealt first.
  let seen=Array.isArray(old.seen)?old.seen.filter(x=>PICTURES.includes(x)):[];
  // Migrate earlier progress without claiming that old sessions had cycle tracking.
  if(!seen.length && Array.isArray(old.recent))seen=old.recent.filter(x=>PICTURES.includes(x));
  let remaining=shuffle(PICTURES.filter(x=>!seen.includes(x)));
  let deck=remaining.slice(0,10);
  if(deck.length<10){
   let freshCycle=shuffle(PICTURES.filter(x=>!deck.includes(x)));
   // Keep very recent items at the back during cycle rollover.
   const last=Array.isArray(old.recent)?old.recent.slice(-5):[];
   freshCycle.sort((a,b)=>Number(last.includes(a))-Number(last.includes(b)));
   deck=deck.concat(freshCycle.slice(0,10-deck.length));
   // Start a new cycle after allocating the final unseen objects.
   seen=[];
  }
  const next={level:level,idx:0,deck:deck,seen:seen,recent:Array.isArray(old.recent)?old.recent.slice(-10):[],version:2};
  write(next);return deck;
 }
 function data(level){
  let d=read(),n=Math.max(1,Math.min(3,Number(level)||1));
  if(d.level!==n||!Array.isArray(d.deck)||d.deck.length!==10||new Set(d.deck).size!==10||d.deck.some(x=>!PICTURES.includes(x))){nextDeck(n);d=read()}
  return d;
 }
 function choices(word,level){
  const key=word+'|'+level;
  if(choices.key!==key){
   let pool=shuffle(PICTURES.filter(x=>x!==word));
   const amount=Math.min(4,Math.max(2,level+1));
   choices.options=shuffle([word].concat(pool.slice(0,amount-1)));
   choices.key=key;
  }
  return choices.options;
 }
 // Premium artwork can be added individually without touching question logic.
 // The existing illustration remains only as a fallback until a new image is verified.
 const PREMIUM_DIR='assets/premium/little-picture/';
 const bundledPremium=new Set(['apple','cat','dog','duck','lion','tiger','elephant','bicycle','teddy bear']);
 function lpwArt(word){
  const id=word.toLowerCase();
  if(bundledPremium.has(id)){
   const fn=id.replace(/ /g,'%20');
   return '<img class="lpw-premium-art" src="'+PREMIUM_DIR+fn+'.webp" alt="Object to identify" draggable="false" loading="eager" decoding="async">';
  }
  return b3DataPicture(id,'Object to identify');
 }
 const oldNew=fullNewRizqi;
 fullNewRizqi=function(kind){
  if(kind!=='picture')return oldNew(kind);
  const prog=rizqiLoad().picture||{};
  const level=Math.max(1,Math.min(3,Number(prog.level)||1));
  const d=data(level);
  return {kind:'picture',level:level,idx:Math.max(0,Math.min(9,Number(d.idx)||0)),errors:0,pairs:d.deck.map(x=>[x,x.toLowerCase()])};
 };
 const oldView=fullRizqiView;
 fullRizqiView=function(m){
  if(state.detail!=='picture')return oldView(m);
  if(!fullRizqi||fullRizqi.kind!=='picture')fullRizqi=fullNewRizqi('picture');
  let g=fullRizqi, d=data(g.level);
  if(!Array.isArray(g.pairs)||g.pairs.length!==10||g.pairs.some((p,i)=>p[0]!==d.deck[i])){g.pairs=d.deck.map(x=>[x,x.toLowerCase()]);g.idx=d.idx||0;}
  const word=g.pairs[g.idx][0];
  const opts=choices(word,g.level);
  return `<section class="panel app-screen module-shell improved-module">${head(m)}
  <div class="lpw-shell">
   <div class="lpw-heading"><span class="lpw-label">RIZQI EXPLORER</span><h2>Little Picture World</h2><div class="lpw-progress">Level ${g.level} · ${g.idx+1}/10</div></div>
   <div class="lpw-question">What is this?</div>
   <div class="lpw-layout">
    <div class="lpw-image" aria-label="Look at the picture">${lpwArt(word)}</div>
    <div class="lpw-choices">${opts.map((o,i)=>`<button type="button" class="lpw-choice lpw-c${i}" data-improve-rizqi="${qSafe(o)}">${qSafe(o)}</button>`).join('')}</div>
   </div>
   <p id="rizqiFeedback" role="status" class="game-feedback lpw-feedback"></p>
   <p class="lpw-foot">Look at the big picture. Tap the correct word!</p>
  </div></section>`;
 };
 const oldCorrect=rizqiCorrect;
 rizqiCorrect=function(){
  if(!fullRizqi||fullRizqi.kind!=='picture')return oldCorrect();
  if(locked)return;
  locked=true;
  const g=fullRizqi, d=data(g.level),word=g.pairs[g.idx][0];
  d.recent=(Array.isArray(d.recent)?d.recent:[]).concat([word]).slice(-12);
  d.seen=(Array.isArray(d.seen)?d.seen:[]).concat([word]);
  d.seen=Array.from(new Set(d.seen.filter(x=>PICTURES.includes(x))));
  d.idx=g.idx+1;
  const feedback=document.getElementById('rizqiFeedback');
  if(feedback){feedback.textContent='Yay! Great job!';feedback.classList.add('is-good')}
  try{improvePraise()}catch(e){}
  if(d.idx>=10){
   const nextLevel=Math.min(3,g.level+1);
   write(d);
   const next=nextDeck(nextLevel);
   g.level=nextLevel;g.idx=0;g.pairs=next.map(x=>[x,x.toLowerCase()]);
  }else{g.idx=d.idx;write(d)}
  g.errors=0;
  rizqiSave();
  setTimeout(function(){locked=false;choices.key='';if(state.view==='rizqi'&&state.detail==='picture')render()},650);
 };
 const oldWrong=rizqiWrong;
 rizqiWrong=function(){
  if(!fullRizqi||fullRizqi.kind!=='picture')return oldWrong();
  if(locked)return;
  const g=fullRizqi;g.errors++;
  const e=document.getElementById('rizqiFeedback');if(e)e.textContent=g.errors>=2?'Try the glowing button!':'Good try! Have another look.';
  if(g.errors>=2){const word=g.pairs[g.idx][0];
   Array.from(document.querySelectorAll('.lpw-choice')).forEach(b=>{if(b.dataset.improveRizqi===word)b.classList.add('hint-glow')});
  }
 };
})();
