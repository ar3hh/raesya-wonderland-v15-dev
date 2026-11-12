// V15 Phase 3A: Revision Zone foundation. Demonstration exercises ONLY.
// This feature uses its own local-storage namespace and never writes to V14 data.
const SUBJECTS=[
 {id:'bm',name:'Bahasa Melayu',icon:'📖',color:'#ffe0ed'},
 {id:'en',name:'English',icon:'🔤',color:'#e5e5ff'},
 {id:'math',name:'Mathematics',icon:'➗',color:'#dbf1fe'},
 {id:'science',name:'Science',icon:'🌱',color:'#e2f5df'},
 {id:'islam',name:'Islamic Education',icon:'🌟',color:'#ffefd4'},
 {id:'moral',name:'Moral Education',icon:'🏆',color:'#f0e0ff'},
 {id:'art',name:'Visual Arts',icon:'🎨',color:'#fff0cc'},
 {id:'pe',name:'Physical & Health Education',icon:'🚀',color:'#dcf6f2'}
];
const DEMO_QUESTIONS=[
 {q:'One of four equal parts is shaded. What is the fraction?',answers:['1/4','1/2','3/4','1/3'],right:0,why:'One shaded part out of four equal parts is 1/4.'},
 {q:'Which fraction represents one half?',answers:['1/3','2/4','1/4','3/4'],right:1,why:'Two of four equal parts are equivalent to one half.'},
 {q:'Which fraction is larger?',answers:['1/4','1/2','1/8','1/6'],right:1,why:'For unit fractions, a smaller denominator means a larger piece.'},
 {q:'What is 1/4 + 1/4?',answers:['1/8','2/8','1/2','1/4'],right:2,why:'Two quarters make 2/4, which is equal to 1/2.'},
 {q:'What is 3/4 − 1/4?',answers:['1/4','1/2','3/8','1'],right:1,why:'Subtract the numerators when the denominators are the same: 2/4 = 1/2.'},
 {q:'A cake is divided into 8 equal slices. One slice is what fraction?',answers:['1/4','1/2','1/8','8/1'],right:2,why:'One slice out of eight equal slices is 1/8.'},
 {q:'Which fraction is equal to 2/4?',answers:['1/2','1/3','1/4','3/4'],right:0,why:'Divide the numerator and denominator of 2/4 by 2 to get 1/2.'},
 {q:'How many quarters make one whole?',answers:['2','3','4','8'],right:2,why:'Four quarters add up to 4/4, or one whole.'},
 {q:'What is 1/3 + 1/3?',answers:['1/6','2/3','2/6','1'],right:1,why:'One third plus one third makes two thirds.'},
 {q:'Which is the smallest fraction?',answers:['1/2','1/3','1/4','1/8'],right:3,why:'Of these unit fractions, 1/8 represents the smallest part.'}
];
// Independent from V14: completed practice attempts are saved under a V15-only key.
const REV_PROGRESS_KEY='raesya-wonderland-v15-revision-demo-v2';
let revSaveStatus='';
function readRevisionProgress(){
 try{
  const value=JSON.parse(localStorage.getItem(REV_PROGRESS_KEY)||'null');
  if(!value||!Array.isArray(value.attempts))return [];
  return value.attempts.filter(a=>a&&a.year===3&&a.subject==='math'&&a.topic==='fractions'&&Number.isInteger(a.score)&&a.score>=0&&a.score<=10&&a.total===10&&typeof a.savedAt==='string').slice(-100);
 }catch(e){return []}
}
function saveRevisionProgress(score){
 try{
  const attempts=readRevisionProgress();
  const attempt={year:3,subject:'math',topic:'fractions',score,total:10,savedAt:new Date().toISOString()};
  attempts.push(attempt);
  localStorage.setItem(REV_PROGRESS_KEY,JSON.stringify({version:2,attempts:attempts.slice(-100)}));
  const stored=readRevisionProgress();
  if(!stored.some(a=>a.savedAt===attempt.savedAt&&a.score===attempt.score))throw Error('Saved data did not verify');
  revSaveStatus='Saved successfully on this device.';
  return true;
 }catch(e){revSaveStatus='Could not save progress. Check browser storage settings or free storage space.';console.warn('V15 revision save failed',e);return false}
}
function progressSummary(){
 const attempts=readRevisionProgress();
 if(!attempts.length)return '<p class="revnote">No saved practice results yet. Finish all 10 questions to save a result.</p>';
 const latest=attempts[attempts.length-1],best=Math.max(...attempts.map(a=>a.score));
 const when=new Date(latest.savedAt);
 const date=Number.isNaN(when.getTime())?'recently':when.toLocaleString('en-MY',{dateStyle:'medium',timeStyle:'short'});
 return `<div class="revprogress" role="status"><strong>Saved Progress ✓</strong><p>Last result: <strong>${latest.score}/10</strong> · Best: <strong>${best}/10</strong> · Completed: ${attempts.length} time(s)</p><p class="muted mini">Last saved: ${date}. Stored on this device only.</p></div>`;
}
let revSubject=null,revTopic=null,revAnswerIndex=0,revScore=0,revAnswered=false,revChoice=null;
function resetRevisionSelection(){revSubject=null;revTopic=null;revAnswerIndex=0;revScore=0;revAnswered=false;revChoice=null;}
const revYear=()=>Number((state.detail||'').replace('y',''));
function revisionScreen(m){
 const year=revYear(); if(![3,4,5].includes(year))return hub(m);
 const crumb=`<p class="revcrumb">Revision Zone <span>›</span> Year ${year}${revSubject?' <span>›</span> '+(SUBJECTS.find(s=>s.id===revSubject)?.name||''):''}${revTopic?' <span>›</span> Fractions':''}</p>`;
 let content='';
 if(!revSubject){content=`<h2>Choose a subject</h2><p class="muted">Year ${year} • Eight KSSR subjects • Select freely</p><div class="revgrid">${SUBJECTS.map(sub=>`<button class="revcard" data-rev-subject="${sub.id}" style="--revcolor:${sub.color}">${iconSVG(sub.icon)}<strong>${safe(sub.name)}</strong><small>Browse topics →</small></button>`).join('')}</div>`}
 else if(!revTopic){
 const sub=SUBJECTS.find(s=>s.id===revSubject);
 const isDemo=revSubject==='math'&&year===3;
 content=`<button class="revlink" data-rev-subject-back>← All subjects</button><h2>${safe(sub.name)}</h2><p class="muted">Year ${year} topics</p><div class="revgrid"><button class="revcard" data-rev-topic="${isDemo?'fractions':'planned'}" style="--revcolor:#def0ff"><span class="rev-symbol">${isDemo?'¼':'📚'}</span><strong>${isDemo?'Fractions (sample lesson)':'Learning topics'}</strong><small>${isDemo?'Illustrated notes + 10 practice questions':'Content preparation & curriculum review pending'}</small></button></div>${isDemo?'<p class="revnote">This lesson demonstrates the learning flow only. Curriculum mapping and full content QA are still required.</p>':'<p class="revnote">Full notes and exercises for this subject are not published yet. We will add them only after checking Year 3–5 KSSR/DSKP topics.</p>'}${isDemo?progressSummary():''}`}
 else if(revTopic==='planned'){content=`<button class="revlink" data-rev-topic-back>← Back to topics</button><div class="revempty"><h2>Content in development</h2><p>Notes, pictures and exercises need curriculum mapping and quality assurance before release.</p></div>`}
 else if(revTopic==='fractions'&&revAnswerIndex<0){content=`<button class="revlink" data-rev-topic-back>← Back to topics</button><h2>Fractions — Year 3</h2><p class="muted">Sample revision notes • Not yet curriculum-certified</p><div class="revlesson"><h3>What is a fraction?</h3><p>A fraction describes equal parts of a whole. For example, 1/4 means one out of four equal parts.</p><div class="revpicture" role="img" aria-label="Four equal boxes with one shaded"><span class="shaded"></span><span></span><span></span><span></span></div><p><strong>Numerator:</strong> number of parts selected. <strong>Denominator:</strong> total number of equal parts.</p><h3>Worked example</h3><p>2/4 + 1/4 = 3/4 because the parts have the same denominator. Add the numerators: 2 + 1 = 3.</p>${progressSummary()}<button class="action primary" data-rev-start>Start 10 practice questions →</button></div>`}
 else if(revTopic==='fractions'&&revAnswerIndex>=DEMO_QUESTIONS.length){content=`<div class="revresults"><h2>Practice complete!</h2><p class="revscore">${revScore} / ${DEMO_QUESTIONS.length}</p><p role="status">${safe(revSaveStatus||"Save status not available")}</p>${progressSummary()}<button class="action primary" data-rev-restart>Practice again</button> <button class="action" data-rev-notes>Read notes</button></div>`}
 else {const item=DEMO_QUESTIONS[revAnswerIndex];content=`<button class="revlink" data-rev-notes>← Back to notes</button><p class="revcrumb">Question ${revAnswerIndex+1} of 10 · Score ${revScore}</p><div class="revlesson"><h2>${safe(item.q)}</h2><div class="revanswers">${item.answers.map((ans,i)=>`<button data-rev-answer="${i}" ${revAnswered?'disabled':''} class="revchoice ${revAnswered&&i===item.right?'correct':revAnswered&&revChoice===i?'wrong':''}">${safe(ans)}</button>`).join('')}</div>${revAnswered?`<div class="revfeedback"><strong>${revChoice===item.right?'Great job!':'Keep learning!'}</strong><p>${safe(item.why)}</p><button class="action primary" data-rev-next>${revAnswerIndex===9?'View results':'Next question →'}</button></div>`:''}</div>`}
 return `<section class="panel app-screen module-shell">${head(m)}${crumb}<div class="rev-area">${content}</div></section>`;
}
function handleRevisionClick(e){if(state.view!=='revision'||!state.detail)return;const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-rev-subject')){revSubject=b.dataset.revSubject;revTopic=null;}
 else if(b.hasAttribute('data-rev-subject-back')){revSubject=null;revTopic=null;}
 else if(b.hasAttribute('data-rev-topic')){revTopic=b.dataset.revTopic;revAnswerIndex=-1;}
 else if(b.hasAttribute('data-rev-topic-back')){revTopic=null;revAnswerIndex=0;}
 else if(b.hasAttribute('data-rev-start')){revAnswerIndex=0;revScore=0;revAnswered=false;revChoice=null;}
 else if(b.hasAttribute('data-rev-answer')){if(revAnswered)return;revChoice=Number(b.dataset.revAnswer);revAnswered=true;if(revChoice===DEMO_QUESTIONS[revAnswerIndex].right)revScore++;}
 else if(b.hasAttribute('data-rev-next')){revAnswerIndex++;revAnswered=false;revChoice=null;if(revAnswerIndex===DEMO_QUESTIONS.length){saveRevisionProgress(revScore)}}
 else if(b.hasAttribute('data-rev-notes')){revAnswerIndex=-1;revAnswered=false;}
 else if(b.hasAttribute('data-rev-restart')){revAnswerIndex=-1;revScore=0;revAnswered=false;}
 else return;
 render();window.scrollTo(0,0);
}
