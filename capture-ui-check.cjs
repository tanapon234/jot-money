// Synthetic state only. linkedom is an existing QA dependency, not an app dependency.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const {parseHTML}=require('../.qa/node_modules/linkedom');
const focusedDocuments=new WeakMap();
const fixedNow='2024-03-02T18:20:30.123Z';
class CaptureTestDate extends Date {constructor(...args){super(...(args.length?args:[fixedNow]))}static now(){return Date.parse(fixedNow)}}
const fixture={budget:321.09,accounts:[...Array.from({length:25},(_,i)=>({id:'w'+i,name:'Synthetic wallet '+i,kind:'wallet',opening:100+i,group:i%2?'bank':'cash'})),{id:'hidden',name:'Hidden wallet',kind:'wallet',opening:10,archived:true},{id:'deleted',name:'Deleted wallet',kind:'wallet',opening:10,deleted:true},{id:'borrower',name:'Synthetic borrower',kind:'borrower',opening:40}],entries:[]};
function harness(seed=fixture,preference){
 const {window,document}=parseHTML(fs.readFileSync(path.join(__dirname,'dist/index.html'),'utf8'));
 const memory=new Map(seed===null?[]:[['jot-money-v1',JSON.stringify(seed)]]),writes=[];
 if(preference!==undefined)memory.set('jot-money-v1-last-account',preference);
 window.innerHeight=900;window.scrollTo=()=>{};
 window.HTMLElement.prototype.getBoundingClientRect=()=>({top:0,bottom:400});
 window.HTMLElement.prototype.showModal=function(){this.setAttribute('open','')};
 window.HTMLElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new window.Event('close'))};
 Object.defineProperty(window.HTMLElement.prototype,'open',{configurable:true,get(){return this.hasAttribute('open')}});
 window.HTMLElement.prototype.reportValidity=()=>true;window.HTMLElement.prototype.focus=function(){focusedDocuments.set(this.ownerDocument,this.id||this.dataset.calendarDay||this.dataset.captureDate)};
 window.HTMLElement.prototype.reset=function(){for(const e of this.querySelectorAll('input'))e.value=e.getAttribute('value')||''};
 Object.defineProperty(window.HTMLSelectElement.prototype,'value',{configurable:true,get(){const o=this.querySelector('option[selected]')||this.querySelector('option');return o?.getAttribute('value')??o?.textContent??''},set(v){for(const o of this.querySelectorAll('option'))if((o.getAttribute('value')??o.textContent)===v)o.setAttribute('selected','');else o.removeAttribute('selected')}});
 const ctx=vm.createContext({window,document,localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>{writes.push(k);memory.set(k,v)}},crypto:require('node:crypto').webcrypto,Intl,Date:CaptureTestDate,Number,JSON,Math,Set,Map,Blob,URL,console,confirm:()=>true,setTimeout:()=>1,clearTimeout:()=>{}});
 for(const f of ['core.js','history.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'dist',f),'utf8'),ctx,{filename:f});
 const run=code=>vm.runInContext(code,ctx),el=id=>document.getElementById(id),click=selector=>{const e=document.querySelector(selector);assert.ok(e,selector);e.dispatchEvent(new window.Event('click',{bubbles:true}));if(e.onclick)e.onclick(new window.Event('click'))};
 return {run,el,click,memory,writes,document,focus:()=>focusedDocuments.get(document),fill:(id,v)=>{el(id).value=String(v)},input:id=>el(id).dispatchEvent(new window.Event('input')),change:id=>el(id).dispatchEvent(new window.Event('change')),submit:id=>el(id).dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}))};
}
for(const [pref,expected] of [[undefined,'w0'],['w19','w19'],['stale','w0'],['hidden','w0'],['deleted','w0'],['borrower','w0']]){
 const h=harness(fixture,pref);assert.equal(h.run('account'),expected);assert.equal(h.writes.length,0);assert.equal(h.memory.get('jot-money-v1'),JSON.stringify(fixture));
}
const h=harness(fixture,'w19'),before=h.run('JSON.stringify(state)'),balances=h.run('JSON.stringify(state.accounts.map(a=>Money.balance(state,a.id)))');
h.fill('quick','ข้าว 50');h.input('quick');h.fill('category','อื่น ๆ');h.change('category');
const category=h.el('category').value;
h.click('#chooseCaptureAccount');assert.equal(h.focus(),'captureAccountSearch');
assert.equal(h.document.querySelectorAll('[data-capture-account]').length,25);
for(const id of ['hidden','deleted','borrower'])assert.equal(h.document.querySelector(`[data-capture-account="${id}"]`),null);
h.fill('captureAccountSearch','Synthetic wallet 24');h.input('captureAccountSearch');assert.equal(h.document.querySelectorAll('[data-capture-account]').length,1);
h.click('[data-capture-account="w24"]');assert.equal(h.run('account'),'w24');assert.equal(h.el('quick').value,'ข้าว 50');assert.equal(h.el('category').value,category);assert.equal(h.run('manualCategory'),true);assert.equal(h.focus(),'quick');
assert.equal(h.run('JSON.stringify(state)'),before);assert.equal(h.run('JSON.stringify(state.accounts.map(a=>Money.balance(state,a.id)))'),balances);assert.deepEqual(h.writes,['jot-money-v1-last-account']);
assert.equal(harness(fixture,h.memory.get('jot-money-v1-last-account')).run('account'),'w24');
h.click('#floatingCapture');assert.ok(h.el('quickDialog').open);h.click('#chooseCaptureAccount');h.click('[data-capture-account="w2"]');assert.ok(h.el('quickDialog').open);assert.ok(!h.el('captureAccountDialog').open);assert.equal(h.focus(),'quick');assert.equal(h.el('quick').value,'ข้าว 50');assert.equal(h.el('category').value,category);
h.submit('entryForm');assert.equal(h.run('state.entries[0].account'),'w2');assert.equal(h.run('state.entries[0].category'),category);assert.equal(h.run('state.budget'),321.09);assert.equal(h.memory.get('jot-money-v1-last-account'),'w2');
// Transfer preference follows the involved active wallet, including debt -> wallet.
h.click('[data-type="transfer"]');h.fill('transferFrom','w7');h.change('transferFrom');h.fill('transferTo','borrower');h.fill('transferAmount',5);h.submit('transferForm');assert.equal(h.run('account'),'w7');assert.equal(h.memory.get('jot-money-v1-last-account'),'w7');
h.click('[data-type="transfer"]');h.fill('transferFrom','borrower');h.change('transferFrom');h.fill('transferTo','w8');h.fill('transferAmount',5);h.submit('transferForm');assert.equal(h.run('account'),'w8');assert.equal(h.memory.get('jot-money-v1-last-account'),'w8');assert.equal(h.run('state.budget'),321.09);
h.run("state.accounts.find(a=>a.id===account).archived=true;render()");assert.equal(h.run('account'),'w0');assert.equal(h.el('captureAccountName').textContent,'Synthetic wallet 0');
const empty=harness({budget:7,accounts:[],entries:[]},'stale');assert.equal(empty.run('account'),undefined);assert.ok(empty.el('chooseCaptureAccount').disabled);assert.match(empty.el('accounts').textContent,/เริ่มต้นที่บัญชีของคุณ/);empty.fill('quick','ข้าว 50');empty.submit('entryForm');assert.equal(empty.run('state.entries.length'),0);assert.equal(empty.run('state.budget'),7);assert.equal(empty.writes.length,0);
const dates=harness(fixture,'w4');assert.equal(dates.el('entryDate').value,'2024-03-03','Bangkok today crosses UTC midnight');
assert.equal(dates.document.querySelectorAll('#entryDate').length,1);
assert.equal(dates.el('entryDate').getAttribute('form'),'entryForm');
assert.ok(dates.el('entryDate').closest('.capture-heading'));
assert.equal(dates.el('captureDateLabel').textContent,'3 มี.ค. 2567');
assert.equal(dates.el('captureDateStatus').textContent,'');
for(const [key,label,status] of [['2024-02-29','29 ก.พ. 2567','ย้อนหลัง'],['2024-03-04','4 มี.ค. 2567','ล่วงหน้า'],['','เลือกวันที่','กรุณาเลือกวันที่']]){
 dates.fill('entryDate',key);dates.input('entryDate');assert.equal(dates.el('captureDateLabel').textContent,label);assert.equal(dates.el('captureDateStatus').textContent,status);
 dates.change('entryDate');assert.equal(dates.el('captureDateStatus').textContent,status);
}
dates.run('resetCaptureDate()');
assert.ok(dates.el('entryDate').hasAttribute('required'));assert.ok(dates.el('transferDate').hasAttribute('required'));
dates.fill('quick','ข้าว 50');dates.input('quick');dates.fill('category','อื่น ๆ');dates.change('category');dates.fill('entryDate','2024-02-29');
dates.click('#chooseCaptureAccount');dates.click('[data-capture-account="w5"]');assert.equal(dates.el('entryDate').value,'2024-02-29');assert.equal(dates.el('quick').value,'ข้าว 50');assert.equal(dates.el('category').value,'อื่น ๆ');
for(const bad of ['', '2023-02-29']){dates.fill('entryDate',bad);dates.submit('entryForm');assert.equal(dates.run('state.entries.length'),0);assert.equal(dates.writes.filter(k=>k==='jot-money-v1').length,0);}
dates.fill('entryDate','2024-02-29');dates.submit('entryForm');assert.equal(dates.run('History.dayKey(state.entries[0].date)'),'2024-02-29');assert.equal(dates.run('state.entries[0].date'),'2024-02-28T18:20:30.123Z');assert.equal(dates.el('entryDate').value,'2024-03-03');
dates.click('[data-type="income"]');dates.fill('quick','ค่าจ้าง 200');dates.fill('entryDate','2024-03-01');dates.submit('entryForm');assert.equal(dates.run('History.dayKey(state.entries[1].date)'),'2024-03-01');
assert.deepEqual(JSON.parse(dates.run("JSON.stringify(History.groupDays([...state.entries].reverse()).map(g=>[g.key,g.income,g.expense,g.net]))")),[['2024-03-01',200,0,200],['2024-02-29',0,50,-50]]);
dates.fill('entryDate','2024-02-28');dates.click('[data-type="transfer"]');assert.equal(dates.el('transferDate').value,'2024-02-28');dates.fill('transferFrom','w5');dates.change('transferFrom');dates.fill('transferTo','w6');dates.fill('transferAmount',10);
for(const bad of ['', '2024-02-30']){dates.fill('transferDate',bad);dates.submit('transferForm');assert.equal(dates.run('state.entries.length'),2);}
dates.fill('transferDate','2024-02-27');dates.submit('transferForm');assert.equal(dates.run('History.dayKey(state.entries[2].date)'),'2024-02-27');assert.equal(dates.el('entryDate').value,'2024-03-03');
assert.deepEqual(JSON.parse(dates.run('JSON.stringify(History.summary(state.entries))')),{income:200,expense:50,net:150,count:3});
assert.deepEqual(JSON.parse(dates.run("JSON.stringify(History.groupDays([...state.entries].reverse()).map(g=>[g.key,g.income,g.expense,g.net]))")),[['2024-03-01',200,0,200],['2024-02-29',0,50,-50],['2024-02-27',0,0,0]]);
dates.fill('entryDate','2024-02-01');dates.click('#floatingCapture');assert.equal(dates.el('entryDate').value,'2024-03-03');dates.el('quickDialog').close();
dates.fill('entryDate','');dates.click('[data-type="transfer"]');assert.equal(dates.el('transferDate').value,'2024-03-03');assert.equal(dates.run('state.budget'),321.09);
const retro=harness({...fixture,entries:[{id:'seed',type:'income',amount:500,note:'seed',category:'อื่น ๆ',account:'w0',date:'2024-02-29'}]},'w0');
retro.run("tab('history')");const retroBefore=retro.run('JSON.stringify(state)');
assert.ok(retro.el('allEntries').querySelector('h3 button.history-date-trigger time[datetime="2024-02-29"]'),'Day title itself is the capture button');
assert.equal(retro.el('allEntries').querySelectorAll('[data-capture-date]').length,1,'Only one capture target per day');
assert.equal(retro.el('allEntries').querySelector('.history-capture-date'),null,'No separate capture button');
assert.equal(retro.el('allEntries').querySelector('button[data-capture-date] .history-totals'),null,'Totals must stay outside capture target');
retro.click('#allEntries .history-totals');assert.equal(retro.el('quickDialog').open,false,'Tapping totals must not open capture');
retro.click('#historyListView [data-capture-date="2024-02-29"]');assert.ok(retro.el('quickDialog').open);assert.equal(retro.el('entryDate').value,'2024-02-29');assert.equal(retro.el('captureDateStatus').textContent,'ย้อนหลัง');assert.equal(retro.run('JSON.stringify(state)'),retroBefore);
retro.fill('quick','ข้าว 650');retro.submit('entryForm');assert.equal(retro.run('History.dayKey(state.entries.at(-1).date)'),'2024-02-29');assert.ok(!retro.el('quickDialog').open);assert.ok(!retro.el('history').classList.contains('hidden'));assert.match(retro.el('allEntries').textContent,/−150\.00/);
retro.click('[data-history-view="calendar"]');retro.run("changeCalendarMonth('2024-02')");retro.click('[data-calendar-day="2024-02-28"]');assert.match(retro.el('calendarModalEntries').textContent,/ยังไม่มีรายการ/);
assert.ok(retro.el('calendarDayDialog').open);assert.ok(!retro.el('quickDialog').open);retro.click('#closeCalendarDay');assert.equal(retro.focus(),'2024-02-28');
const retroAdd=()=>{if(!retro.el('calendarDayDialog').open)retro.run("$('calendarDayDialog').showModal()");retro.click('#calendarModalAdd')};
assert.equal(retro.el('calendarCaptureDate'),null);assert.equal(retro.el('calendarDayEntries'),null);
retro.click('#calendarModalSummary');assert.equal(retro.el('quickDialog').open,false,'Calendar totals must not open capture');
retroAdd();assert.equal(retro.el('entryDate').value,'2024-02-28');retro.click('[data-type="income"]');retro.fill('quick','ค่าจ้าง 200');retro.submit('entryForm');assert.equal(retro.run('calendarSelected'),'2024-02-28');assert.equal(retro.run('calendarMonth'),'2024-02');assert.match(retro.el('calendarModalEntries').textContent,/ค่าจ้าง/);assert.equal(retro.focus(),'calendarModalAdd');
retroAdd();retro.click('[data-type="transfer"]');assert.equal(retro.el('transferDate').value,'2024-02-28');retro.fill('transferFrom','w0');retro.change('transferFrom');retro.fill('transferTo','borrower');retro.fill('transferAmount',10);retro.submit('transferForm');assert.equal(retro.run('History.dayKey(state.entries.at(-1).date)'),'2024-02-28');assert.equal(retro.run('calendarSelected'),'2024-02-28');assert.equal(retro.run("History.summary(state.entries.filter(e=>History.dayKey(e.date)==='2024-02-28')).net"),200);
retroAdd();retro.fill('entryDate','2023-12-31');retro.fill('quick','ข้าว 1.25');retro.submit('entryForm');assert.equal(retro.run('calendarSelected'),'2023-12-31');assert.equal(retro.run('calendarMonth'),'2023-12');assert.match(retro.el('calendarModalEntries').textContent,/1\.25/);
retro.fill('search','not-found');retro.input('search');retroAdd();retro.fill('quick','ข้าว 3');retro.submit('entryForm');assert.equal(retro.el('search').value,'not-found');assert.match(retro.el('historyFilterNotice').textContent,/ค้นหา/);assert.match(retro.el('calendarModalEntries').textContent,/ยังไม่มีรายการ/);
retroAdd();retro.click('#closeQuick');assert.equal(retro.run('historyCaptureDate'),null);retro.click('#closeCalendarDay');retro.click('#floatingCapture');assert.equal(retro.el('entryDate').value,'2024-03-03');retro.click('#closeQuick');
const emptyRetro=harness({budget:0,accounts:[],entries:[]});emptyRetro.run("tab('history');historyView='calendar';changeCalendarMonth('2024-02')");emptyRetro.click('[data-calendar-day="2024-02-01"]');emptyRetro.click('#calendarModalAdd');emptyRetro.fill('quick','ข้าว 10');emptyRetro.submit('entryForm');assert.equal(emptyRetro.run('state.entries.length'),0);assert.match(emptyRetro.el('formError').textContent,/บัญชี/);
const dayTap=harness({...fixture,entries:[]},'w0');dayTap.run("tab('history');historyView='calendar';changeCalendarMonth('2023-12')");
const dayTapBefore=dayTap.run('JSON.stringify(state)');dayTap.click('[data-calendar-day="2023-12-31"]');assert.ok(dayTap.el('calendarDayDialog').open);assert.ok(!dayTap.el('quickDialog').open);assert.match(dayTap.el('calendarModalEntries').textContent,/ยังไม่มีรายการ/);assert.equal(dayTap.run('JSON.stringify(state)'),dayTapBefore);
dayTap.click('#calendarModalAdd');assert.equal(dayTap.el('entryDate').value,'2023-12-31');dayTap.fill('quick','ข้าว 40');dayTap.submit('entryForm');assert.ok(dayTap.el('calendarDayDialog').open);assert.equal(dayTap.focus(),'calendarModalAdd');assert.match(dayTap.el('calendarModalEntries').textContent,/ข้าว/);
dayTap.click('#calendarModalEntries [data-edit]');assert.ok(dayTap.el('editDialog').open);dayTap.fill('editAmount','65');dayTap.submit('editForm');assert.ok(!dayTap.el('editDialog').open);assert.ok(dayTap.el('calendarDayDialog').open);assert.match(dayTap.el('calendarModalSummary').textContent,/65\.00/);assert.equal(dayTap.focus(),'calendarModalAdd');
dayTap.click('#calendarModalEntries [data-edit]');dayTap.fill('editDate','2024-01-01');dayTap.submit('editForm');assert.match(dayTap.el('calendarModalEntries').textContent,/ยังไม่มีรายการ/);dayTap.click('#closeCalendarDay');assert.equal(dayTap.focus(),'2023-12-31');
dayTap.run("changeCalendarMonth('2024-01')");dayTap.click('[data-calendar-day="2024-01-01"]');dayTap.click('#calendarModalEntries [data-edit]');dayTap.click('#deleteEntry');assert.match(dayTap.el('calendarModalEntries').textContent,/ยังไม่มีรายการ/);assert.equal(dayTap.run('state.entries.length'),0);dayTap.click('#closeCalendarDay');
const brandNew=harness(null);assert.equal(brandNew.run('state.categoryPreset'),'general-v1');assert.equal(brandNew.run('state.accounts.length'),0);assert.equal(brandNew.run('state.entries.length'),0);assert.equal(brandNew.run('state.budget'),0);assert.equal(brandNew.writes.length,0);
brandNew.fill('quick','กาแฟ 65');brandNew.input('quick');assert.equal(brandNew.el('category').value,'อาหารและเครื่องดื่ม');
brandNew.click('[data-type="income"]');brandNew.fill('quick','เงินเดือน 500');brandNew.input('quick');assert.equal(brandNew.el('category').value,'เงินเดือน');
const existingEmpty=harness({budget:0,accounts:[],entries:[]});assert.equal(existingEmpty.run('state.categoryPreset'),undefined);existingEmpty.fill('quick','กาแฟ 65');existingEmpty.input('quick');assert.equal(existingEmpty.el('category').value,'อาหาร');
existingEmpty.click('#reset');assert.equal(existingEmpty.run('state.categoryPreset'),'general-v1');assert.equal(existingEmpty.run('state.budget'),0);assert.equal(existingEmpty.run('state.entries.length'),0);
const learn=harness(fixture,'w0');
const recordChoice=(note,category)=>{learn.fill('quick',note+' 65');learn.input('quick');if(category){learn.fill('category',category);learn.change('category')}learn.submit('entryForm')};
recordChoice('กาแฟ','อื่น ๆ');assert.equal(learn.run('state.entries.at(-1).categoryChoice'),'user');
learn.fill('quick','กาแฟ 40');learn.input('quick');assert.equal(learn.el('category').value,'อื่น ๆ');assert.match(learn.el('suggestion').textContent,/คุณเลือกบ่อย/);
recordChoice('กาแฟ');assert.equal(learn.run('state.entries.at(-1).categoryChoice'),undefined,'automatic save does not create user evidence');
recordChoice('กาแฟ','อาหาร');recordChoice('กาแฟ','อื่น ๆ');assert.equal(learn.run("Money.suggestCategory(state,'กาแฟ')"),'อื่น ๆ');
const learningSaved=JSON.parse(learn.memory.get('jot-money-v1')),loadedLearn=harness(learningSaved,'w0');loadedLearn.fill('quick','กาแฟ 30');loadedLearn.input('quick');assert.equal(loadedLearn.el('category').value,'อื่น ๆ');
learn.click('[data-type="income"]');learn.fill('quick','กาแฟ 30');learn.input('quick');assert.equal(learn.el('category').value,'รอจัดหมวด');
learn.run('openEdit(state.entries[0].id)');learn.fill('editCategory','อาหาร');learn.change('editCategory');learn.submit('editForm');assert.equal(learn.run("Money.suggestCategory(state,'กาแฟ')"),'อาหาร','correction replaces previous vote');
learn.run('openEdit(state.entries[1].id)');learn.fill('editAmount','70');learn.submit('editForm');assert.equal(learn.run('state.entries[1].categoryChoice'),undefined,'amount-only edit does not teach');
learn.run('openEdit(state.entries[1].id)');learn.fill('editCategory','อาหาร');learn.change('editCategory');learn.submit('editForm');assert.equal(learn.run('state.entries[1].categoryChoice'),'user','explicit category edit teaches');
learn.run('openEdit(state.entries[0].id)');learn.click('#deleteEntry');assert.equal(learn.run("Money.suggestCategory(state,'กาแฟ')"),'อาหาร');assert.equal(learn.run('state.budget'),fixture.budget);
console.log('PASS: capture/date/history checks plus manual-only category learning, auto-save exclusion, reload, income separation, category correction, amount-only edit and deletion.');
