// V15 Phase 3C: Revision Zone pilot curriculum content. Continue academic QA before release.
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

// Phase 3B: topic-specific practice saves; does NOT modify V14 or legacy V15 saves.
const REV_PROGRESS_KEY='raesya-wonderland-v15-revision-demo-v2'; // Phase 3A.1 existing data
const REV_3B_KEY='raesya-wonderland-v15-revision-progress-v3';
const REV_LESSONS={
 fractions:{title:'Fractions',standard:'3.1',subtitle:'Equal parts • Equivalent fractions • Adding and subtracting',questions:DEMO_QUESTIONS,notes:`
 <h3>1. Equal parts of a whole</h3><p>A fraction tells us how many <strong>equal</strong> parts are selected. For example, <strong>1/4</strong> means one of four equal parts.</p>
 <div class="revpicture" role="img" aria-label="Four equal rectangles: one colored and three uncolored"><span class="shaded"></span><span></span><span></span><span></span></div>
 <p><strong>Numerator</strong> (top): selected parts. <strong>Denominator</strong> (bottom): total equal parts.</p>
 <h3>2. Equivalent fractions</h3><p>Different fractions can represent the same amount: <strong>1/2 = 2/4</strong>.</p><div class="revbars" aria-label="One of two parts equals two of four parts"><div class="revbar"><i class="filled"></i><i></i></div><div class="revbar"><i class="filled"></i><i class="filled"></i><i></i><i></i></div></div>
 <h3>3. Worked example</h3><p>2/4 + 1/4 = 3/4. Add the numerators because the denominators match.</p>`},
 decimals:{title:'Decimals',standard:'3.2',subtitle:'Hundredths • Compare • Add and subtract',questions:[
 {q:'Which decimal is three tenths?',answers:['0.03','0.30','0.13','0.33'],right:1,why:'Three tenths is 3/10, written as 0.3 or 0.30.'},
 {q:'Which decimal is thirty-five hundredths?',answers:['0.53','0.035','0.35','3.5'],right:2,why:'Thirty-five hundredths equals 35/100 = 0.35.'},
 {q:'Which number is greater?',answers:['0.47','0.74','0.44','0.40'],right:1,why:'0.74 has 7 tenths, greater than the tenths in the other choices.'},
 {q:'What is 0.2 + 0.3?',answers:['0.5','0.05','0.6','0.23'],right:0,why:'Two tenths plus three tenths equals five tenths: 0.5.'},
 {q:'What is 0.75 − 0.25?',answers:['0.40','0.60','0.55','0.50'],right:3,why:'75 hundredths minus 25 hundredths equals 50 hundredths, or 0.50.'},
 {q:'How is 7/100 written as a decimal?',answers:['0.70','0.07','0.7','7.00'],right:1,why:'Seven hundredths has zero in the tenths place and seven in the hundredths place: 0.07.'},
 {q:'Which decimal is equal to 0.5?',answers:['0.05','0.15','0.50','0.55'],right:2,why:'0.5 and 0.50 are equal because a trailing zero does not change the value.'},
 {q:'What is 0.14 + 0.23?',answers:['0.37','0.27','0.47','0.33'],right:0,why:'Fourteen hundredths plus twenty-three hundredths is thirty-seven hundredths: 0.37.'},
 {q:'What is 0.90 − 0.40?',answers:['0.40','0.30','0.60','0.50'],right:3,why:'Nine tenths minus four tenths equals five tenths: 0.50.'},
 {q:'Which decimal is the smallest?',answers:['0.19','0.21','0.29','0.91'],right:0,why:'0.19 has one tenth; all other choices have at least two tenths.'}
 ],notes:`<h3>1. Tenths and hundredths</h3><p>A decimal is another way to describe part of a whole. <strong>0.3 = 3/10</strong> and <strong>0.25 = 25/100</strong>.</p>
 <p>Each square below shows <strong>one hundredth</strong> of a whole. The 25 shaded squares show 0.25.</p><div class="revhundred" role="img" aria-label="Hundred square grid, twenty-five shaded squares">${Array.from({length:100},(_,i)=>`<i class="${i<25?'filled':''}"></i>`).join('')}</div>
 <h3>2. Compare decimals</h3><p>Compare tenths first, then hundredths: <strong>0.65 &gt; 0.56</strong>.</p><h3>3. Worked example</h3><p>0.24 + 0.15 = <strong>0.39</strong>. Align decimal points; add hundredths and tenths separately.</p>`},
 percent:{title:'Percentages',standard:'3.3',subtitle:'Percent symbol • Parts out of one hundred',questions:[
 {q:'Which symbol means “percent”?',answers:['%','/','+','×'],right:0,why:'The percent symbol is %. It means out of one hundred.'},
 {q:'What does 25% mean?',answers:['25 out of 10','25 out of 100','25 out of 1','25 out of 1000'],right:1,why:'25% means 25 parts out of 100 equal parts.'},
 {q:'How do we write 50 out of 100 as a percentage?',answers:['5%','10%','50%','100%'],right:2,why:'50 of 100 equal parts is 50%.'},
 {q:'A grid has 100 squares and 8 are shaded. What percentage is shaded?',answers:['80%','18%','0.8%','8%'],right:3,why:'Eight out of a hundred equal squares is 8%.'},
 {q:'Which percentage is one whole?',answers:['100%','50%','25%','10%'],right:0,why:'A whole is all 100 out of 100 parts, so it is 100%.'},
 {q:'Which is greater?',answers:['20%','70%','40%','10%'],right:1,why:'70 out of 100 is greater than 20, 40 or 10 out of 100.'},
 {q:'How many squares are shaded if 35% of a 100-square grid is shaded?',answers:['3','5','30','35'],right:3,why:'35% means 35 of the 100 equal squares.'},
 {q:'Which percentage represents no shaded squares out of 100?',answers:['1%','10%','0%','100%'],right:2,why:'Zero shaded parts out of 100 equals 0%.'},
 {q:'What percentage is 90 out of 100?',answers:['9%','90%','19%','100%'],right:1,why:'90 of 100 parts equals 90%.'},
 {q:'A hundred-square grid has 60 shaded squares. How many are not shaded?',answers:['40','50','60','30'],right:0,why:'100 − 60 = 40 unshaded squares.'}
 ],notes:`<h3>1. What is a percentage?</h3><p><strong>Percent</strong> means “out of one hundred”. The symbol is <strong>%</strong>. So <strong>25%</strong> means 25 out of 100 equal parts.</p>
 <div class="revhundred" role="img" aria-label="Hundred square grid with fifty shaded squares to show 50 percent">${Array.from({length:100},(_,i)=>`<i class="${i<50?'filled':''}"></i>`).join('')}</div><p>50 of the 100 squares are shaded: <strong>50%</strong>.</p>
 <h3>2. Read the percentage</h3><p>1% means one part of one hundred. 100% means the whole.</p><h3>3. Worked example</h3><p>If 80 of 100 stickers are blue, <strong>80%</strong> are blue.</p>`}
};

// Phase 3C: three additional Year 3 Mathematics learning topics.
REV_LESSONS["whole"]={title:"Whole Numbers to 10,000",standard:"1.0",subtitle:"Place value \u2022 Ordering \u2022 Rounding \u2022 Number patterns",questions:[{"q": "What is the place value of 6 in 6,481?", "answers": ["Ones", "Tens", "Hundreds", "Thousands"], "right": 3, "why": "6 is in the thousands place, so its value is 6,000."}, {"q": "What is the value of digit 3 in 2,347?", "answers": ["3", "30", "300", "3,000"], "right": 2, "why": "The digit 3 is in the hundreds place, so it means 300."}, {"q": "Which number is the largest?", "answers": ["7,305", "7,350", "7,053", "7,503"], "right": 3, "why": "7,503 has 5 hundreds, more than the others."}, {"q": "Which number comes immediately after 8,999?", "answers": ["8,998", "9,000", "9,001", "8,990"], "right": 1, "why": "Adding one to 8,999 gives 9,000."}, {"q": "Which is 4,000 + 200 + 70 + 5?", "answers": ["4,725", "4,275", "4,257", "4,752"], "right": 1, "why": "Thousands 4, hundreds 2, tens 7 and ones 5 form 4,275."}, {"q": "Round 3,682 to the nearest ten.", "answers": ["3,680", "3,690", "3,600", "3,700"], "right": 0, "why": "The ones digit is 2, so 3,682 rounds down to 3,680."}, {"q": "Round 5,749 to the nearest hundred.", "answers": ["5,700", "5,800", "5,750", "5,000"], "right": 0, "why": "The tens digit is 4, so it rounds down to 5,700."}, {"q": "What comes next: 1,200, 1,300, 1,400, ...?", "answers": ["1,450", "1,500", "1,600", "2,400"], "right": 1, "why": "The sequence increases by 100 each time, so the next number is 1,500."}, {"q": "Which number is the smallest?", "answers": ["9,010", "9,100", "9,001", "9,011"], "right": 2, "why": "9,001 has zero tens and one one, so it is the smallest."}, {"q": "Which numeral means \"six thousand forty-two\"?", "answers": ["6,420", "6,402", "6,042", "6,240"], "right": 2, "why": "Six thousands, zero hundreds, four tens and two ones make 6,042."}],notes:"<h3>1. Read and represent numbers</h3><p>Year 3 whole numbers go up to <strong>10,000</strong>. Read <strong>4,513</strong> as <em>four thousand five hundred thirteen</em>.</p><div class=\"rev-place\" role=\"img\" aria-label=\"Place value chart for four thousand five hundred thirteen\"><div><strong>Thousands</strong><b>4</b></div><div><strong>Hundreds</strong><b>5</b></div><div><strong>Tens</strong><b>1</b></div><div><strong>Ones</strong><b>3</b></div></div><h3>2. Place value</h3><p><strong>4,513 = 4,000 + 500 + 10 + 3</strong>. The digit 5 represents five hundreds, or 500.</p><h3>3. Compare and order</h3><p>Start with the thousands, then hundreds, tens and ones. For example, <strong>4,520 &gt; 4,502</strong>.</p><h3>4. Rounding and patterns</h3><p>To round 4,573 to the nearest ten, check the ones digit (3). The answer is <strong>4,570</strong>. For a pattern, compare the change between consecutive numbers.</p>"};
REV_LESSONS["operations"]={title:"Basic Operations",standard:"2.0",subtitle:"Addition \u2022 Subtraction \u2022 Multiplication \u2022 Division",questions:[{"q": "What is 2,345 + 1,204?", "answers": ["3,549", "3,449", "3,659", "3,541"], "right": 0, "why": "2,345 + 1,204 = 3,549. Add aligned place values."}, {"q": "What is 4,700 − 1,250?", "answers": ["3,550", "3,450", "3,350", "3,500"], "right": 1, "why": "4,700 − 1,250 = 3,450."}, {"q": "What is 326 + 458?", "answers": ["774", "784", "794", "684"], "right": 1, "why": "326 + 458 = 784."}, {"q": "What is 900 − 275?", "answers": ["675", "725", "625", "635"], "right": 2, "why": "900 − 275 = 625."}, {"q": "What is 8 × 7?", "answers": ["54", "56", "64", "48"], "right": 1, "why": "Eight groups of seven make 56."}, {"q": "What is 63 ÷ 9?", "answers": ["6", "7", "8", "9"], "right": 1, "why": "9 × 7 = 63, therefore 63 ÷ 9 = 7."}, {"q": "What is 6 × 40?", "answers": ["24", "240", "2,400", "46"], "right": 1, "why": "6 × 4 tens = 24 tens, or 240."}, {"q": "What is 480 ÷ 8?", "answers": ["50", "6", "60", "80"], "right": 2, "why": "8 × 60 = 480, so 480 ÷ 8 = 60."}, {"q": "What is 1,250 + 2,300 − 500?", "answers": ["3,150", "3,050", "3,550", "4,050"], "right": 1, "why": "1,250 + 2,300 = 3,550; then 3,550 − 500 = 3,050."}, {"q": "There are 9 boxes with 6 pencils each. How many pencils?", "answers": ["45", "54", "63", "56"], "right": 1, "why": "9 boxes × 6 pencils = 54 pencils."}],notes:"<h3>1. Add and subtract</h3><p>Align digits by place value: ones under ones, tens under tens, and so on.</p><div class=\"rev-calc\" role=\"img\" aria-label=\"Column addition: 1,245 plus 2,310 equals 3,555\"><span>1,245</span><span>+ 2,310</span><hr><strong>3,555</strong></div><h3>2. Multiplication</h3><p>Multiplication is repeated addition. <strong>7 × 4 = 28</strong> is seven groups of four.</p><div class=\"rev-dots\" role=\"img\" aria-label=\"Three groups of four dots to represent 3 times 4\"><span>● ● ● ●</span><span>● ● ● ●</span><span>● ● ● ●</span></div><h3>3. Division</h3><p>Division shares into equal groups. <strong>24 ÷ 6 = 4</strong>, so each of six groups gets four.</p><h3>4. Check the answer</h3><p>Use the opposite operation: if 36 ÷ 6 = 6, then 6 × 6 = 36.</p>"};
REV_LESSONS["money"]={title:"Money (RM)",standard:"4.0",subtitle:"Ringgit and sen \u2022 Adding \u2022 Subtracting \u2022 Change",questions:[{"q": "How many sen are in RM3?", "answers": ["30", "300", "3,000", "103"], "right": 1, "why": "RM1 = 100 sen, so RM3 = 300 sen."}, {"q": "What is RM12.50 + RM4.20?", "answers": ["RM16.70", "RM16.30", "RM17.70", "RM15.70"], "right": 0, "why": "RM12.50 + RM4.20 = RM16.70."}, {"q": "What is RM20.00 − RM7.65?", "answers": ["RM13.35", "RM12.45", "RM12.35", "RM11.35"], "right": 2, "why": "RM20.00 − RM7.65 = RM12.35."}, {"q": "A book costs RM8. You buy 3 books. What is the total?", "answers": ["RM11", "RM16", "RM24", "RM32"], "right": 2, "why": "3 × RM8 = RM24."}, {"q": "What is RM5.40 + RM2.35?", "answers": ["RM7.65", "RM7.75", "RM8.75", "RM7.85"], "right": 1, "why": "RM5.40 + RM2.35 = RM7.75."}, {"q": "You pay RM10 for a toy costing RM6.80. How much change?", "answers": ["RM2.20", "RM3.80", "RM4.20", "RM3.20"], "right": 3, "why": "RM10.00 − RM6.80 = RM3.20."}, {"q": "What is RM15.00 − RM9.50?", "answers": ["RM5.50", "RM6.50", "RM4.50", "RM5.05"], "right": 0, "why": "RM15.00 − RM9.50 = RM5.50."}, {"q": "Which amount is the greatest?", "answers": ["RM8.05", "RM8.50", "RM8.15", "RM8.45"], "right": 1, "why": "RM8.50 is greater than RM8.45, RM8.15 and RM8.05."}, {"q": "What is 5 × RM2.40?", "answers": ["RM10.20", "RM11.00", "RM12.00", "RM12.40"], "right": 2, "why": "5 × RM2.40 = RM12.00."}, {"q": "Ali has RM50. He spends RM18 and RM12. How much is left?", "answers": ["RM30", "RM20", "RM22", "RM18"], "right": 1, "why": "RM18 + RM12 = RM30 spent; RM50 − RM30 = RM20 left."}],notes:"<h3>1. Ringgit and sen</h3><p>Malaysia uses <strong>ringgit (RM)</strong> and <strong>sen</strong>. <strong>RM1 = 100 sen</strong>.</p><div class=\"rev-money\" role=\"img\" aria-label=\"Examples of money values as text tiles\"><span>RM1.00</span><span>50 sen</span><span>20 sen</span><span>10 sen</span></div><h3>2. Add money</h3><p>Align decimal points. <strong>RM12.50 + RM7.20 = RM19.70</strong>.</p><h3>3. Subtract money and find change</h3><p>If you pay RM20 for an item costing RM13.60, your change is <strong>RM6.40</strong>.</p><h3>4. Multiply money</h3><p>Four notebooks costing RM3 each cost <strong>4 × RM3 = RM12</strong>.</p>"};
let revSaveStatus='',revSubject=null,revTopic=null,revAnswerIndex=0,revScore=0,revAnswered=false,revChoice=null;
function resetRevisionSelection(){revSubject=null;revTopic=null;revAnswerIndex=0;revScore=0;revAnswered=false;revChoice=null;}
const revYear=()=>Number((state.detail||'').replace('y',''));
function readRevisionProgress(topic){
 try{
 const obj=JSON.parse(localStorage.getItem(REV_3B_KEY)||'null');
 const results=Array.isArray(obj&&obj.attempts)?obj.attempts.filter(a=>a&&a.year===3&&a.subject==='math'&&a.topic===topic&&Number.isInteger(a.score)&&a.score>=0&&a.score<=10&&a.total===10&&typeof a.savedAt==='string'):[];
 if(topic==='fractions'){
  const old=JSON.parse(localStorage.getItem(REV_PROGRESS_KEY)||'null');
  const legacy=Array.isArray(old&&old.attempts)?old.attempts.filter(a=>a&&a.year===3&&a.subject==='math'&&a.topic==='fractions'&&Number.isInteger(a.score)&&a.score>=0&&a.score<=10&&a.total===10&&typeof a.savedAt==='string'):[];
  return legacy.concat(results).sort((a,b)=>a.savedAt.localeCompare(b.savedAt)).slice(-100);
 }
 return results.slice(-100);
 }catch(e){return []}
}
function saveRevisionProgress(score,topic){
 try{
 const value=JSON.parse(localStorage.getItem(REV_3B_KEY)||'null');
 const attempts=Array.isArray(value&&value.attempts)?value.attempts:[];
 const attempt={year:3,subject:'math',topic,score,total:10,savedAt:new Date().toISOString(),id:Date.now()+'-'+Math.floor(Math.random()*100000)};
 attempts.push(attempt);
 localStorage.setItem(REV_3B_KEY,JSON.stringify({version:3,attempts:attempts.slice(-500)}));
 const verify=JSON.parse(localStorage.getItem(REV_3B_KEY)||'null');
 if(!verify||!verify.attempts.some(a=>a.id===attempt.id))throw new Error('Save verification failed');
 revSaveStatus='Saved successfully on this device.';
 return true;
 }catch(e){revSaveStatus='Unable to save. Please check browser storage settings.';console.warn('V15 progress save error',e);return false}
}
function progressSummary(topic){
 const attempts=readRevisionProgress(topic);
 if(!attempts.length)return '<p class="revnote">No saved results for this topic. Finish all 10 questions to save your result.</p>';
 const latest=attempts[attempts.length-1],best=Math.max(...attempts.map(a=>a.score));
 const when=new Date(latest.savedAt),date=Number.isNaN(when.getTime())?'recently':when.toLocaleString('en-MY',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
 return `<div class="revprogress" role="status"><strong>Saved Progress ✓</strong><p>Last Score: <strong>${latest.score}/10</strong> · Best Score: <strong>${best}/10</strong> · Completed: <strong>${attempts.length}</strong></p><p class="muted mini">Last saved: ${date}. Stored on this device only.</p></div>`;
}
function revisionScreen(m){
 const year=revYear();if(![3,4,5].includes(year))return hub(m);
 const sub=SUBJECTS.find(s=>s.id===revSubject);
 const lesson=revTopic&&REV_LESSONS[revTopic];
 const crumb=`<p class="revcrumb">Revision Zone <span>›</span> Year ${year}${sub?' <span>›</span> '+safe(sub.name):''}${lesson?' <span>›</span> '+safe(lesson.title):''}</p>`;
 let content='';
 if(!revSubject)content=`<h2>Choose a subject</h2><p class="muted">Year ${year} • Eight subjects</p><div class="revgrid">${SUBJECTS.map(s=>`<button class="revcard" data-rev-subject="${s.id}" style="--revcolor:${s.color}">${iconSVG(s.icon)}<strong>${safe(s.name)}</strong><small>Browse topics →</small></button>`).join('')}</div>`;
 else if(!revTopic){
 const active=revSubject==='math'&&year===3;
 content=`<button class="revlink" data-rev-subject-back>← All subjects</button><h2>${safe(sub.name)}</h2><p class="muted">Year ${year} · ${active?'6 practice lessons available':'Contents pending review'}</p>`;
 if(active)content+=`<div class="revgrid">${Object.entries(REV_LESSONS).map(([id,t])=>`<button class="revcard" style="--revcolor:${{fractions:'#e3f6e9',decimals:'#e4efff',percent:'#fff0da',whole:'#e8eaff',operations:'#fce7f0',money:'#e3f6e9'}[id]||'#e9f2ff'}" data-rev-topic="${id}"><span class="rev-symbol">${{fractions:'¼',decimals:'0.25',percent:'%',whole:'10k',operations:'×÷',money:'RM'}[id]||'+'}</span><strong>${safe(t.title)}</strong><small>DSKP ${t.standard} · Notes + 10 questions</small></button>`).join('')}</div><p class="revnote">Draft lessons are for testing and further academic review, not a KPM-certified question bank. Scores stay on this device.</p>`;
 else content+=`<div class="revempty"><h3>Topic content under development</h3><p>Year-specific notes and exercises are not published for this subject yet. They will be added after topic mapping and checking.</p></div>`;
 }else if(!lesson){content=`<button class="revlink" data-rev-topic-back>← Back to topics</button><div class="revempty">This lesson is not yet available.</div>`}
 else if(revAnswerIndex<0){content=`<button class="revlink" data-rev-topic-back>← Back to topics</button><h2>${safe(lesson.title)} — Year 3</h2><p class="muted">Mathematics • DSKP topic ${lesson.standard} • Draft learning notes</p><div class="revlesson">${lesson.notes}${progressSummary(revTopic)}<button class="action primary" data-rev-start>Start 10 practice questions →</button></div>`}
 else if(revAnswerIndex>=lesson.questions.length){content=`<div class="revresults"><h2>Practice complete!</h2><p class="revscore">${revScore} / ${lesson.questions.length}</p><p role="status">${safe(revSaveStatus)}</p>${progressSummary(revTopic)}<button class="action primary" data-rev-restart>Practice again</button> <button class="action" data-rev-notes>Read notes</button></div>`}
 else {const item=lesson.questions[revAnswerIndex];content=`<button class="revlink" data-rev-notes>← Back to notes</button><p class="revcrumb">Question ${revAnswerIndex+1} of 10 · Score ${revScore}</p><div class="revlesson"><h2>${safe(item.q)}</h2><div class="revanswers">${item.answers.map((ans,i)=>`<button data-rev-answer="${i}" ${revAnswered?'disabled':''} class="revchoice ${revAnswered&&i===item.right?'correct':revAnswered&&revChoice===i?'wrong':''}">${safe(ans)}</button>`).join('')}</div>${revAnswered?`<div class="revfeedback"><strong>${revChoice===item.right?'Great job!':'Keep learning!'}</strong><p>${safe(item.why)}</p><button class="action primary" data-rev-next>${revAnswerIndex===9?'View results':'Next question →'}</button></div>`:''}</div>`}
 return `<section class="panel app-screen module-shell">${head(m)}${crumb}<div class="rev-area">${content}</div></section>`;
}
function handleRevisionClick(e){if(state.view!=='revision'||!state.detail)return;const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-rev-subject')){revSubject=b.dataset.revSubject;revTopic=null;}
 else if(b.hasAttribute('data-rev-subject-back')){revSubject=null;revTopic=null;}
 else if(b.hasAttribute('data-rev-topic')){revTopic=b.dataset.revTopic;revAnswerIndex=-1;}
 else if(b.hasAttribute('data-rev-topic-back')){revTopic=null;revAnswerIndex=0;}
 else if(b.hasAttribute('data-rev-start')){revAnswerIndex=0;revScore=0;revAnswered=false;revChoice=null;}
 else if(b.hasAttribute('data-rev-answer')){if(revAnswered||!REV_LESSONS[revTopic])return;revChoice=Number(b.dataset.revAnswer);revAnswered=true;if(revChoice===REV_LESSONS[revTopic].questions[revAnswerIndex].right)revScore++;}
 else if(b.hasAttribute('data-rev-next')){if(!revAnswered)return;revAnswerIndex++;revAnswered=false;revChoice=null;if(revAnswerIndex===REV_LESSONS[revTopic].questions.length)saveRevisionProgress(revScore,revTopic);}
 else if(b.hasAttribute('data-rev-notes')){revAnswerIndex=-1;revAnswered=false;}
 else if(b.hasAttribute('data-rev-restart')){revAnswerIndex=-1;revScore=0;revAnswered=false;}
 else return;
 render();window.scrollTo(0,0);
}
