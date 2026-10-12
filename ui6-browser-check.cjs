// Real Chrome in an isolated profile, synthetic data only; no app dependencies.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const root=__dirname,dist=path.join(root,'dist'),out=path.join(root,'.impeccable/review');
const base=process.argv.find(a=>a.startsWith('https://'));
if(base&&!/^https:\/\/([\w-]+\.)?jot-money-demo\.pages\.dev\/$/.test(base))throw Error('Unexpected deployment target');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'jot-ui6-'));
let server,chrome,ws,seq=0;const pending=new Map(),errors=[],responsiveFailures=[];
const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
async function until(fn){for(let i=0;i<120;i++){try{const r=await fn();if(r)return r}catch{}await new Promise(r=>setTimeout(r,100))}throw Error('Browser readiness timeout')}
async function shot(name,full=false){await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await ev('Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})))');if(process.argv.includes('--no-shots'))return;if(process.argv.includes('--review')&&!['home-375','home-1280','list-320','list-375','list-430','list-1280','search-list-375','empty-day-375','calendar-320','calendar-375','calendar-430','calendar-1280','sparse-320','settings-375','preferences-375','capture-375','day-375','account-review-375','analytics-375'].includes(name))return;if(process.argv.includes('--review'))full=false;let options={format:'png',captureBeyondViewport:full};if(full){const {cssContentSize:r}=await call('Page.getLayoutMetrics');options.clip={x:0,y:0,width:r.width,height:r.height,scale:1}}const r=await call('Page.captureScreenshot',options);fs.writeFileSync(path.join(out,`ui6-${base?'deployed-':''}${name}.png`),Buffer.from(r.data,'base64'))}
async function noOverflow(name){if(await ev('document.documentElement.scrollWidth>innerWidth'))responsiveFailures.push(name+' page overflow');if(await ev("[...document.querySelectorAll('dialog[open]')].some(d=>d.scrollWidth>d.clientWidth+1)"))responsiveFailures.push(name+' dialog overflow')}
async function skipToMain(name){
 assert.equal(await ev("document.querySelector('.skip-link')?.getAttribute('href')"),'#appContent',name+' skip link target');
 await ev("document.querySelector('.skip-link').focus()");
 await ev('new Promise(r=>requestAnimationFrame(()=>r()))');
 assert(await ev("(()=>{const rgb=s=>s.match(/[\\d.]+/g).slice(0,3).map(Number),a=rgb(getComputedStyle(document.querySelector('.skip-link')).color),b=rgb(getComputedStyle(document.querySelector('.skip-link')).backgroundColor),l=c=>{const x=c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*x[0]+.7152*x[1]+.0722*x[2]},x=l(a),y=l(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)})()")>=4.5,name+' focused skip link meets WCAG AA text contrast');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 await ev('new Promise(r=>requestAnimationFrame(()=>r()))');
 assert.equal(await ev("document.activeElement===document.getElementById('appContent')"),true,name+' native Enter moves focus to main');
 assert.equal(await ev("document.getElementById('appContent').getAttribute('tabindex')"),'-1',name+' main is programmatically focusable');
}
async function checkMobileHomeHeading(name){
 const h=await ev("(()=>{const e=document.querySelector('#pageTitle'),s=getComputedStyle(e),r=e.getBoundingClientRect();return {text:e.textContent.trim(),display:s.display,visibility:s.visibility,clip:s.clipPath,rect:e.getClientRects().length,width:r.width,height:r.height}})()");
 assert(h.text&&h.display!=='none'&&h.visibility!=='hidden'&&h.rect&&h.width>0&&h.height>0,name+' home heading remains accessible');
}
async function checkCalendarTargets(width){
 const result=await ev("(()=>{const cells=[...document.querySelectorAll('#history .calendar-day')],pick=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {font:parseFloat(getComputedStyle(e).fontSize),width:r.width,height:r.height}};return {cells:cells.map(e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height}}),switch:pick('#history .history-switch button'),search:pick('#toggleHistoryTools'),today:pick('#calendarCurrent')}})()");
 for(const [name,control] of Object.entries({switch:result.switch,search:result.search,today:result.today}))if(!control||control.font<14)responsiveFailures.push(`${name} control font ${control?.font}px at ${width}px (expected >=14px)`);
 if(!result.cells.length)responsiveFailures.push(`No calendar cells rendered at ${width}px`);
 for(const [i,cell] of result.cells.entries())if(cell.width<44||cell.height<44)responsiveFailures.push(`Calendar cell ${i} ${cell.width}x${cell.height}px at ${width}px (expected >=44x44)`);
}
async function checkCalendarEndReachable(width){
 await ev("window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'});new Promise(r=>requestAnimationFrame(()=>r()))");
 const reachable=await ev("(()=>{const last=[...document.querySelectorAll('#calendarGrid .calendar-day')].at(-1),dock=document.querySelector('.ui6-dock');if(!last)return false;const bottom=last.getBoundingClientRect().bottom,visibleDock=dock&&getComputedStyle(dock).display!=='none',limit=visibleDock?dock.getBoundingClientRect().top:innerHeight;return bottom<=limit+1})()");
 if(!reachable)responsiveFailures.push(`Last calendar row is not scroll-accessible above the dock at ${width}px`);
 await ev("window.scrollTo({top:0,behavior:'instant'})");
}
async function checkHistorySearchTargets(width){
 const r=await ev("(()=>{const e=document.getElementById('clearHistorySearch'),s=getComputedStyle(e),b=e.getBoundingClientRect();return {display:s.display,visibility:s.visibility,font:parseFloat(s.fontSize),width:b.width,height:b.height}})()");
 assert(r.display!=='none'&&r.visibility!=='hidden',`Clear-search visible at ${width}px`);
 assert(r.font>=14,`Clear-search text is at least 14px at ${width}px (got ${r.font}px)`);
 assert(r.width>=44&&r.height>=44,`Clear-search target is at least 44x44 at ${width}px (got ${r.width}x${r.height})`);
}
async function checkEditReturnFocus(expected,label){
 await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 const focus=await ev("document.activeElement?.getAttribute('data-edit')||''");
 assert.equal(focus,expected,`${label}: focus returns to the exact originating record`);
 return focus;
}
async function main(){
 fs.mkdirSync(out,{recursive:true});
 if(!base){server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname,file=path.resolve(dist,'.'+(p==='/'?'/index.html':p));if(!file.startsWith(dist+path.sep))return res.writeHead(403).end();fs.readFile(file,(err,b)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.ttf':'font/ttf'})[path.extname(file)]||'application/octet-stream');res.end(b)})});await new Promise(r=>server.listen(0,'127.0.0.1',r))}
 const url=base||`http://127.0.0.1:${server.address().port}/`;
 chrome=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`,url],{stdio:'ignore',windowsHide:true});
 const port=await until(()=>fs.existsSync(path.join(profile,'DevToolsActivePort'))&&Number(fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0]));
 const target=await until(async()=> (await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(x=>x.type==='page'));
 ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)});
 await call('Runtime.enable');await call('Page.enable');await until(()=>ev("typeof BalanceTrend!=='undefined'&&typeof openCapture==='function'&&document.readyState==='complete'"));await ev('document.fonts.ready');
 assert.equal(await ev("localStorage.getItem('jot-money-v1')"),null,'New user still empty');assert.equal(await ev("document.getElementById('quickCard').closest('dialog').id"),'quickDialog');
 await call('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});await shot('empty-home');await noOverflow('empty');
 await ev("document.getElementById('floatingCapture').click()");assert.equal(await ev('document.activeElement.id'),'quick');assert.equal(await ev("document.getElementById('quickDialog').open"),true);await shot('empty-capture');await ev("document.getElementById('closeQuick').click()");
 await ev("state=Money.migrate({budget:2000,accounts:[{id:'cash',name:'เงินสดทดสอบ',opening:10000,kind:'wallet',group:'cash'},{id:'bank',name:'บัญชีธนาคารทดสอบ',opening:5000,kind:'wallet',group:'bank'},{id:'debt',name:'ลูกหนี้ทดสอบ',opening:300,kind:'borrower',group:'debt'}],entries:[{id:'past',account:'cash',type:'income',amount:1000,date:'2026-09-25',category:'เงินเดือน',note:'รายรับทดสอบ'},...Array.from({length:12},(_,i)=>({id:'daily'+i,account:'cash',type:i===3||i===9?'income':'expense',amount:i===3?3200:i===9?1800:120+i*45,date:'2026-10-'+String(i+1).padStart(2,'0'),category:i===3||i===9?'เงินเดือน':'อาหาร',note:i<3?'กาแฟ':'รายการทดสอบ '+(i+1)}))]});persist();render()");
 const ledger=await ev('JSON.stringify(state)'),total=await ev('BalanceTrend.build(state).currentBalance');
 assert.equal(await ev("document.querySelector('[data-trend-range=week]').getAttribute('aria-pressed')"),'true','Week is the initial chart range');
 assert.equal(await ev("document.getElementById('trendPeriod').textContent.startsWith('สัปดาห์นี้')"),true,'Current week label');
 assert.equal(await ev("document.getElementById('balanceTrend').textContent.includes('วันนี้ · ถึงตอนนี้')"),false,'No today-until-now label');
 const currentMoney=await ev("document.getElementById('moneyCurrent').textContent");
 await ev("document.querySelector('[data-trend-range=month]').click();new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");
 assert.equal(await ev('document.body.dataset.trendRange'),'month');
 assert.notEqual(await ev("getComputedStyle(document.getElementById('trendChange')).display"),'none','Historical-period comparison remains accessible');
 assert.equal(await ev("document.getElementById('moneyCurrent').textContent"),currentMoney,'Current money independent of chart period');
 await ev("document.querySelector('[data-trend-range=week]').click();new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");
 assert.equal(await ev('JSON.stringify(state)'),ledger,'Chart period switching does not mutate ledger');
 const savedMoney=await ev("document.getElementById('moneyCurrent').textContent");
 await call('Emulation.setDeviceMetricsOverride',{width:320,height:812,deviceScaleFactor:1,mobile:true});
 await ev("state=Money.migrate({budget:0,accounts:[{id:'cash',name:'Synthetic cash',opening:10000,kind:'wallet',group:'cash'}],entries:[{id:'onepoint',account:'cash',type:'expense',amount:25,date:'2026-10-12',category:'Food',note:'synthetic'}]});render()");
 assert.equal(await ev("document.getElementById('balanceTrend').classList.contains('is-sparse')"),true,'Single-point chart state is identified');
 assert.equal(await ev("!document.getElementById('trendSparseText').classList.contains('hidden')&&document.getElementById('trendSparseText').textContent.trim().length>0"),true,'Single-point state has a visible truthful hint');
 assert.equal(await ev("getComputedStyle(document.getElementById('trendCursor')).display"),'none','Single-point cursor is hidden');
 assert.equal(await ev("document.querySelectorAll('.trend-ranges button').length===3&&[...document.querySelectorAll('.trend-ranges button')].every(b=>getComputedStyle(b).display!=='none')"),true,'Week/month/year range choices remain available');
 assert.notEqual(await ev("getComputedStyle(document.getElementById('trendSparseExplore')).display"),'none','Explore-month action is visible for a sparse current week');
 const sparseMoney=await ev("document.getElementById('moneyCurrent').textContent"),sparseLedger=await ev('JSON.stringify(state)');await shot('sparse-320');
 await ev("document.getElementById('trendSparseExplore').click()");assert.equal(await ev("document.body.dataset.trendRange"),'month','Explore-month action selects the current month');assert.equal(await ev("document.getElementById('trendPeriod').textContent.includes('2569')"),true,'Month exploration lands in 2026');assert.equal(await ev("document.getElementById('moneyCurrent').textContent"),sparseMoney,'Exploring month preserves main money');assert.equal(await ev('JSON.stringify(state)'),sparseLedger,'Exploring month preserves ledger');
 assert.equal(await ev("getComputedStyle(document.getElementById('trendCursor')).display"),'none','One-point month still hides cursor');
 await ev("state=Money.migrate({budget:0,accounts:[{id:'cash',name:'Synthetic cash',opening:10000,kind:'wallet',group:'cash'}],entries:[{id:'onepoint',account:'cash',type:'expense',amount:25,date:'2026-10-06',category:'Food',note:'synthetic'},{id:'twopoint',account:'cash',type:'income',amount:10,date:'2026-10-05',category:'Income',note:'synthetic'}]});render()");const multiLedger=await ev('JSON.stringify(state)'),multiMoney=await ev("document.getElementById('moneyCurrent').textContent");
 assert.equal(await ev("document.body.dataset.trendRange"),'month','Month remains selected for multi-day synthetic range');assert.equal(await ev("document.getElementById('balanceTrend').classList.contains('is-sparse')"),false,'Multi-point chart restores full chart state');assert.equal(await ev("getComputedStyle(document.getElementById('trendCursor')).display!=='none'&&!document.getElementById('trendCursor').disabled"),true,'Multi-point cursor is visible and enabled');await ev("document.querySelector('[data-trend-range=week]').click();document.getElementById('trendPrev').click()");assert.equal(await ev("document.body.dataset.trendRange"),'week','Can navigate back to a multi-point week');assert.equal(await ev("document.getElementById('balanceTrend').classList.contains('is-sparse')"),false,'Prior week with two dates is not sparse');assert.equal(await ev("getComputedStyle(document.getElementById('trendCursor')).display!=='none'&&!document.getElementById('trendCursor').disabled"),true,'Multi-day week restores visible enabled cursor');
 assert.equal(await ev("document.getElementById('moneyCurrent').textContent"),multiMoney,'Sparse/chart range interaction preserves main money');assert.equal(await ev('JSON.stringify(state)'),multiLedger,'Sparse/chart range interaction preserves ledger');
 await ev(`state=Money.migrate(${ledger});render()`);assert.equal(await ev("document.getElementById('moneyCurrent').textContent"),savedMoney,'Restoring seeded ledger restores main money');
 for(const width of [320,375,430,1280]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:width===1280?900:812,deviceScaleFactor:1,mobile:width<600});
  await ev("tab('home');document.getElementById('trendToday').click();window.scrollTo({top:0,behavior:'instant'})");await shot('home-'+width,width===1280||width===375);await noOverflow('home '+width);
  await skipToMain('home '+width);if(width<=430)await checkMobileHomeHeading('home '+width);
  if(width===375&&!await ev("(()=>{const row=document.querySelector('#recent .entry'),dock=document.querySelector('.ui6-dock');return Boolean(row&&row.getBoundingClientRect().bottom<=dock.getBoundingClientRect().top)})()"))responsiveFailures.push('First complete recent entry is below dock at 375x812');
  assert.equal(await ev("document.getElementById('home').contains(document.getElementById('quickCard'))"),false,'No inline capture');assert.equal(await ev("document.querySelectorAll('button:not(.hidden)#floatingCapture').length"),1);assert.equal(await ev("document.getElementById('floatingCapture').getBoundingClientRect().bottom<=innerHeight-12"),true,'Capture remains inside viewport');assert.equal(await ev("document.getElementById('floatingCapture').closest('.ui6-dock')!==null"),width<=900,'Same capture action joins mobile dock');
  assert.equal(await ev("(()=>{const p=document.getElementById('trendPlot').getBoundingClientRect(),t=document.querySelector('.trend-tooltip').getBoundingClientRect();return t.left>=p.left-1&&t.right<=p.right+1})()"),true,'tooltip fits');
  await ev("document.getElementById('floatingCapture').click()");assert.equal(await ev('document.activeElement.id'),'quick');assert.equal(await ev("document.getElementById('entryDate').value"),await ev('History.today()'));assert.equal(await ev("document.getElementById('floatingCapture').classList.contains('hidden')"),true);await shot('capture-'+width);await noOverflow('capture '+width);
  await ev("document.getElementById('quick').value='กาแฟ 65';document.getElementById('quick').dispatchEvent(new Event('input'));document.getElementById('entryForm').requestSubmit()");assert.equal(await ev("document.getElementById('captureAccountDialog').open"),true);await shot('account-review-'+width);await noOverflow('review '+width);assert.equal(await ev("document.getElementById('confirmCaptureAccount').getBoundingClientRect().bottom<=innerHeight"),true);
  await ev("document.getElementById('closeCaptureAccount').click();document.getElementById('closeQuick').click()");assert.equal(await ev("document.getElementById('quick').value"),'กาแฟ 65');assert.equal(await ev("document.getElementById('home').contains(document.getElementById('quickCard'))"),false);
  await ev("document.getElementById('floatingCapture').click();document.querySelector('[data-type=transfer]').click()");await shot('transfer-'+width);await noOverflow('transfer '+width);await ev("document.getElementById('transferDialog').close()");await until(()=>ev("type==='expense'"));await ev("document.getElementById('closeQuick').click()");
  for(const view of ['settings','preferences']){await ev(`tab('${view}');window.scrollTo({top:0,behavior:'instant'})`);await skipToMain(view+' '+width);await shot(view+'-'+width);await noOverflow(view+' '+width)}
  for(const view of ['list','calendar','summary']){await ev(`tab('history');historyView='${view}';renderHistory();updateCaptureButton();window.scrollTo({top:0,behavior:'instant'})`);await skipToMain(view+' '+width);await shot(view+'-'+width);await noOverflow(view+' '+width);assert.equal(await ev("getComputedStyle(document.getElementById('floatingCapture')).fontSize"),'16px','Recording action label retained '+view);if(view==='calendar'){if(width<600)await checkCalendarTargets(width);await checkCalendarEndReachable(width)}}
 }
 const draftLedger=await ev('JSON.stringify(state)');await ev("tab('home');openCapture();document.getElementById('chooseCaptureAccount').click();document.querySelector('[data-capture-account=bank]').click()");await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');await ev("document.getElementById('quick').value='กาแฟ 65';document.getElementById('quick').dispatchEvent(new Event('input'));document.getElementById('entryForm').requestSubmit()");
 const accountDraft=await ev("JSON.stringify({account,captureReview:captureReview&&{learned:captureReview.learned},quick:document.getElementById('quick').value,error:document.getElementById('formError').textContent,reviewError:document.getElementById('captureReviewError').textContent,reviewVisible:getComputedStyle(document.getElementById('captureReview')).display!=='none',dialogOpen:document.getElementById('captureAccountDialog').open,selected:document.querySelector('[data-capture-account=bank]')?.getAttribute('aria-pressed'),confirm:document.getElementById('confirmCaptureAccount').textContent})");
 await ev("if(document.getElementById('captureAccountDialog').open)document.getElementById('captureAccountDialog').close();if(document.getElementById('quickDialog').open)document.getElementById('closeQuick').click()");assert.equal(await ev('JSON.stringify(state)'),draftLedger,'Cancelling an account-selected draft leaves ledger unchanged');
 console.log('Responsive browser measurements: '+JSON.stringify(responsiveFailures));console.log('Account draft browser diagnostic: '+accountDraft);
 assert.deepEqual(responsiveFailures,[],'Responsive control sizing, calendar targets, and overflow checks: '+responsiveFailures.join('; '));
 const draft=JSON.parse(accountDraft);assert.equal(draft.account,'bank','Account picker preserves the explicitly selected bank account in the review draft');assert.equal(draft.captureReview?.learned,false,'Review of a bank draft does not silently learn the default account');assert.equal(draft.selected,'true','Review picker visibly confirms the chosen bank');assert(draft.confirm.includes((await ev("document.querySelector('[data-capture-account=bank] .capture-account-copy b')?.textContent||''"))),'Confirm button identifies the selected account');
 assert.equal(await ev('JSON.stringify(state)'),ledger,'Viewing and cancelling does not mutate ledger');assert.equal(await ev('state.budget'),2000);
 await call('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
 await ev("tab('home');document.getElementById('floatingCapture').click();document.getElementById('quick').value='ข้าว 12.25';document.getElementById('quick').dispatchEvent(new Event('input'))");await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});assert.equal(await ev("document.getElementById('captureAccountDialog').open"),true,'Native Enter opens review');
 await ev("document.querySelector('[data-capture-account=bank]').click();window.oldSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('synthetic quota')};document.getElementById('confirmCaptureAccount').click();Storage.prototype.setItem=window.oldSet");assert.equal(await ev('JSON.stringify(state)'),ledger);assert.equal(await ev("document.getElementById('quick').value"),'ข้าว 12.25');
 await ev("document.getElementById('confirmCaptureAccount').click();document.getElementById('confirmCaptureAccount').click()");assert.equal(await ev('state.entries.length'),JSON.parse(ledger).entries.length+1);assert.equal(await ev("document.getElementById('moneyCurrent').textContent"),await ev(`fmt(${total}-12.25)`));assert.equal(await ev("document.getElementById('quickDialog').open"),false,'Save returns to overview');
 await ev("openEdit('daily0')");await shot('edit-375');await noOverflow('edit');await ev("document.getElementById('editAmount').value='555';document.getElementById('editForm').requestSubmit()");assert.equal(await ev("document.getElementById('moneyCurrent').textContent"),await ev('fmt(BalanceTrend.build(state).currentBalance)'));
 await ev("tab('history');historyView='calendar';changeCalendarMonth('2026-10');renderHistory();document.querySelector('[data-calendar-day=\"2026-10-04\"]').click()");await shot('day-375');await noOverflow('day');await ev("document.getElementById('calendarModalAdd').click()");assert.equal(await ev('document.activeElement.id'),'quick');assert.equal(await ev("document.getElementById('entryDate').value"),'2026-10-04');await shot('retro-capture-375');await ev("document.getElementById('closeQuick').click();document.getElementById('closeCalendarDay').click()");
 // Search affordance and empty-day compactness at phone widths.
 for(const width of [320,375,430]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:812,deviceScaleFactor:1,mobile:true});
  await ev("tab('history');historyView='list';renderHistory();document.getElementById('toggleHistoryTools').click();document.getElementById('search').value='กาแฟ';document.getElementById('search').dispatchEvent(new Event('input'))");
  await checkHistorySearchTargets(width);
  if(width===375){await ev("document.getElementById('showHistorySearchResults').click()");await shot('search-list-375');}
  else await ev("document.getElementById('closeHistorySearch').click()");
  await ev("document.getElementById('search').value='';renderHistory();historyView='calendar';renderHistory();document.querySelector('[data-calendar-day=\"2026-10-20\"]').click()");
  const emptyDay=await ev("(()=>{const d=document.getElementById('calendarDayDialog'),h=d.querySelector('.day-edit-hint'),e=document.querySelector('#calendarModalEntries .empty-block'),r=d.getBoundingClientRect(),b=e?.getBoundingClientRect();return {hint:getComputedStyle(h).display,rows:document.querySelectorAll('#calendarModalEntries [data-edit]').length,emptyHeight:b?.height,dialogHeight:r.height}})()");
  assert.equal(emptyDay.rows,0,`Synthetic empty day has no edit rows at ${width}px`);
  assert.equal(emptyDay.hint,'none',`Empty day hides the edit hint at ${width}px`);
  if(width===375){assert(emptyDay.dialogHeight<=500,`Empty-day dialog is compact at 375px (got ${emptyDay.dialogHeight}px)`);await shot('empty-day-375');}
  await ev("document.getElementById('closeCalendarDay').click();historyView='calendar';renderHistory()");
  const legend=await ev("(()=>{const e=document.getElementById('calendarGridNote'),s=getComputedStyle(e),r=e.getBoundingClientRect();return {display:s.display,visibility:s.visibility,width:r.width,height:r.height,text:e.textContent.trim()}})()");
  assert(legend.display!=='none'&&legend.visibility!=='hidden'&&legend.width>0&&legend.height>0&&legend.text.includes('สุทธิ'),`Net legend is visible at ${width}px`);
 }
 // Native day-dialog focus must return to the invoking record after cancel and save.
 await call('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:true});
 await ev("state.entries.find(e=>e.id==='daily6').date='2026-10-09';state.entries.find(e=>e.id==='daily7').date='2026-10-09';tab('history');historyView='calendar';renderHistory();document.querySelector('[data-calendar-day=\"2026-10-12\"]').click();document.querySelector('#calendarModalEntries [data-edit=\"daily11\"]').click();document.getElementById('closeEdit').click()");
 await checkEditReturnFocus('daily11','Cancel edit');
 await ev("document.getElementById('closeCalendarDay').click();document.querySelector('[data-calendar-day=\"2026-10-11\"]').click();document.querySelector('#calendarModalEntries [data-edit=\"daily10\"]').click();document.getElementById('editAmount').value='222';document.getElementById('editForm').requestSubmit()");
 await checkEditReturnFocus('daily10','Save edit');
 // Moving or deleting a record from a populated day returns to the next row at its old position.
 await ev("document.getElementById('closeCalendarDay').click();document.querySelector('[data-calendar-day=\"2026-10-09\"]').click();window.moveExpected=(()=>{const r=[...document.querySelectorAll('#calendarModalEntries [data-edit]')],i=r.findIndex(e=>e.dataset.edit==='daily8');return r[i+1]?.dataset.edit||r[i-1]?.dataset.edit})();document.querySelector('#calendarModalEntries [data-edit=\"daily8\"]').click();document.getElementById('editDate').value='2026-10-20';document.getElementById('editForm').requestSubmit()");
 await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 assert.equal(await ev("document.activeElement?.getAttribute('data-edit')"),await ev('window.moveExpected'),'Moved entry falls back to the next row at its previous position');
 await ev("window.deleteExpected=(()=>{const r=[...document.querySelectorAll('#calendarModalEntries [data-edit]')],i=r.findIndex(e=>e.dataset.edit==='daily7');return r[i+1]?.dataset.edit||r[i-1]?.dataset.edit})();window._oldConfirm=window.confirm;window.confirm=()=>true;document.querySelector('#calendarModalEntries [data-edit=\"daily7\"]').click();document.getElementById('deleteEntry').click();window.confirm=window._oldConfirm");
 await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 assert.equal(await ev("document.activeElement?.getAttribute('data-edit')"),await ev('window.deleteExpected'),'Deleted entry falls back to the next row at its previous position');
 // With no rows left, use the calendar Add control.
 await ev("window._oldConfirm=window.confirm;window.confirm=()=>true;document.querySelector('#calendarModalEntries [data-edit]').click();document.getElementById('deleteEntry').click();window.confirm=window._oldConfirm");
 await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 assert.equal(await ev("document.activeElement.id"),'calendarModalAdd','Empty day falls back to Add');
 await ev("document.getElementById('closeCalendarDay').click()");
 await ev("historyView='summary';renderHistory();document.getElementById('openAnalytics').click()");await shot('analytics-375');await noOverflow('analytics');await ev("document.getElementById('analyticsDialog').close()");
 // Responsive stress is synthetic and never exported: long money and short keyboard-sized viewport.
 await call('Emulation.setDeviceMetricsOverride',{width:320,height:568,deviceScaleFactor:1,mobile:true});await ev("tab('home');state.accounts[0].opening=123456789012.34;render();window.scrollTo({top:0,behavior:'instant'})");await shot('long-money-320');await noOverflow('long money');assert.equal(await ev("(()=>{const p=document.getElementById('trendPlot').getBoundingClientRect(),t=document.querySelector('.trend-tooltip').getBoundingClientRect();return t.left>=p.left-1&&t.right<=p.right+1})()"),true);
 assert.equal(await ev("document.getElementById('moneyCurrent').scrollWidth<=document.getElementById('moneyCurrent').clientWidth"),true,'Full unbroken amount fits');
 await ev("document.getElementById('floatingCapture').click()");await shot('short-capture-320');await noOverflow('short capture');assert.equal(await ev("document.getElementById('quickDialog').getBoundingClientRect().bottom<=innerHeight"),true);assert.equal(await ev("getComputedStyle(document.querySelector('.capture-date-control')).color"),'rgb(174, 190, 212)','Date inherits Afterglow secondary, not old olive');await ev("document.getElementById('closeQuick').click()");
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'},{name:'prefers-reduced-transparency',value:'reduce'}]});await ev("render();document.getElementById('floatingCapture').click()");assert.equal(await ev('document.activeElement.id'),'quick');await ev("document.getElementById('closeQuick').click()");assert.equal(await ev("getComputedStyle(document.getElementById('moneyOverview')).backdropFilter"),'none');
 // Phone account picker: many accounts and a still-closing software keyboard.
 // VisualViewport overrides model its geometry, not a real iOS keyboard.
 await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
 await ev("state=Money.migrate({budget:0,entries:[],accounts:Array.from({length:24},(_,i)=>({id:'scroll'+i,name:'บัญชีทดสอบ '+i,opening:1000,kind:'wallet',group:'bank'}))});account='scroll0';render()");
 const scrollLedger=await ev('JSON.stringify(state)');
 for(const [width,height,visible,offset] of [[320,568,568,0],[375,812,812,0],[390,844,320,45],[430,932,380,0],[844,390,390,0],[1280,900,900,0]]){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<1000});
  await ev(`Object.defineProperty(visualViewport,'height',{configurable:true,value:${visible}});Object.defineProperty(visualViewport,'offsetTop',{configurable:true,value:${offset}});visualViewport.dispatchEvent(new Event('resize'));tab('home');openCapture();document.getElementById('chooseCaptureAccount').click()`);
  assert.equal(await ev('document.activeElement.id'),'closeCaptureAccount','Picker must not summon search keyboard');
  await shot('account-scroll-'+width);
  const geometry=await ev("(()=>{const d=document.getElementById('captureAccountDialog'),r=d.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,client:d.clientHeight,scroll:d.scrollHeight,x:r.left+r.width/2,y:r.top+Math.min(r.height/2,180)}})()");
  assert(geometry.height>200,'Picker has usable height');if(width<1000)assert(geometry.scroll>geometry.client,'Many accounts can scroll');
  if(width<1000){assert(geometry.top>=offset,'Picker above keyboard viewport top');assert(geometry.bottom<=offset+visible+1,'Picker fits visual viewport');}
  const initialScroll=await ev("document.getElementById('captureAccountDialog').scrollTop");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:geometry.x,y:geometry.y}]});
  for(let step=1;step<=10;step++){await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:geometry.x,y:geometry.y-step*12}]});await new Promise(r=>setTimeout(r,20));}
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await new Promise(r=>setTimeout(r,150));
  if(width<1000)assert(await ev("document.getElementById('captureAccountDialog').scrollTop")>initialScroll,'Synthesized touch scroll moves picker '+width);
  await ev("document.querySelector('[data-capture-account=scroll23]').scrollIntoView({block:'center',behavior:'instant'})");
  const hit=await ev("(()=>{const b=document.querySelector('[data-capture-account=scroll23]'),r=b.getBoundingClientRect(),d=document.getElementById('captureAccountDialog').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,visible:r.top>=d.top&&r.bottom<=d.bottom}})()");assert(hit.visible,'Last account reachable');
  await call('Input.dispatchMouseEvent',{type:'mousePressed',x:hit.x,y:hit.y,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:hit.x,y:hit.y,button:'left',clickCount:1});
  assert.equal(await ev('account'),'scroll23');assert.equal(await ev("document.getElementById('captureAccountDialog').open"),false);assert.equal(await ev('JSON.stringify(state)'),scrollLedger,'Picking account does not alter ledger');
  await ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  await ev("document.getElementById('quick').value='ข้าว 50';document.getElementById('quick').dispatchEvent(new Event('input'));document.getElementById('entryForm').requestSubmit()");await shot('account-scroll-review-'+width);
  assert.equal(await ev('Boolean(captureReview)'),true,'Review opened '+width+' '+await ev("JSON.stringify({error:document.getElementById('formError').textContent,type,account,invalid:[...document.getElementById('entryForm').elements].filter(e=>e.validity&&!e.validity.valid).map(e=>({id:e.id,value:e.value,message:e.validationMessage}))})"));
  assert.equal(await ev('document.activeElement.id'),'closeCaptureAccount');
  await ev("document.getElementById('confirmCaptureAccount').scrollIntoView({block:'center',behavior:'instant'})");
  assert.equal(await ev("(()=>{const d=document.getElementById('captureAccountDialog').getBoundingClientRect(),b=document.getElementById('confirmCaptureAccount').getBoundingClientRect();return b.top>=d.top&&b.bottom<=d.bottom})()"),true,'Confirm reachable with keyboard-sized viewport '+width+' '+await ev("(()=>{const d=document.getElementById('captureAccountDialog'),b=document.getElementById('confirmCaptureAccount');return JSON.stringify({dialog:d.getBoundingClientRect().toJSON(),button:b.getBoundingClientRect().toJSON(),scroll:d.scrollTop})})()"));
  await ev("document.getElementById('closeCaptureAccount').click();document.getElementById('closeQuick').click()");
 }
 await ev("delete visualViewport.height;delete visualViewport.offsetTop;visualViewport.dispatchEvent(new Event('resize'));state=Money.migrate(initial());render()");assert.deepEqual(errors,[]);
 console.log('PASS account picker: 24 accounts, keyboard-sized VisualViewport/offset, synthesized Chromium touch scrolling, last account selection, review confirmation reachable; ledger unchanged. Not real iOS.');
 console.log('PASS UI6 real Chrome: empty/new user, one capture action/no inline form, synchronous focus, native Enter, account review/cancel/draft, quota rollback/duplicate guard, save/edit total refresh, calendar retro capture, transfer expense reset, navigation invariance, long amounts, 320/375/430/1280, 320x568 short viewport, reduced motion/transparency. Not real Safari/iPhone.');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{ws?.close();chrome?.kill();server?.close()});
