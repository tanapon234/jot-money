// Synthetic ledger only; no user workbook or browser storage is read.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const {parseHTML}=require('../.qa/node_modules/linkedom');
const Money=require('./dist/core.js');
const fixture={budget:50,accounts:[{id:'cash',name:'Synthetic cash',opening:1000},{id:'bank',name:'Synthetic bank',opening:200,kind:'wallet'},{id:'debt',name:'Synthetic borrower',opening:0,kind:'borrower'}],entries:[
 {id:'in',type:'income',amount:500,date:'2024-02-28T17:30:00.123Z',account:'cash',category:'เงินเดือน',note:'common income'},
 {id:'out',type:'expense',amount:650,date:'2024-02-29T22:00:00',account:'cash',category:'อาหาร',note:'common expense'},
 {id:'transfer',type:'transfer',amount:70,date:'2024-02-29',account:'cash',toAccount:'bank',category:'โอน',note:'common transfer'},
 {id:'adjust',type:'adjustment',amount:80,date:'2024-02-29',account:'debt',direction:'increase',category:'อื่น ๆ',note:'common adjustment'},
 {id:'legacy',type:'lend',amount:20,date:'2024-02-29',account:'cash',category:'อื่น ๆ',note:'common legacy'},
 {id:'next',type:'income',amount:0.3,date:'2024-03-01',account:'cash',category:'เงินเดือน',note:'next month'},
 {id:'bad',type:'expense',amount:1,date:'bad',account:'cash',category:'อาหาร',note:'invalid date'}]};
const original=JSON.stringify(fixture),expected=Money.migrate(fixture);
const {window,document}=parseHTML(fs.readFileSync(path.join(__dirname,'dist/index.html'),'utf8'));
const memory=new Map([['jot-money-v1',original]]);let writes=0;
const context={window,document,localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>{writes++;memory.set(k,v)}},crypto:require('node:crypto').webcrypto,Intl,Date,Number,JSON,Math,Set,Map,Blob,URL,console,confirm:()=>true,setTimeout:()=>1,clearTimeout:()=>{}};
window.innerHeight=900;window.scrollTo=()=>{};
window.HTMLElement.prototype.getBoundingClientRect=()=>({top:0,bottom:400});
window.HTMLElement.prototype.showModal=function(){this.setAttribute('open','')};
window.HTMLElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new window.Event('close'))};
Object.defineProperty(window.HTMLElement.prototype,'open',{get(){return this.hasAttribute('open')}});
window.HTMLElement.prototype.reportValidity=()=>true;window.HTMLElement.prototype.focus=()=>{};
window.HTMLElement.prototype.reset=function(){for(const e of this.querySelectorAll('input'))e.value=e.getAttribute('value')||''};
Object.defineProperty(window.HTMLSelectElement.prototype,'value',{get(){const o=this.querySelector('option[selected]')||this.querySelector('option');return o?.getAttribute('value')??o?.textContent??''},set(v){for(const o of this.querySelectorAll('option'))if((o.getAttribute('value')??o.textContent)===v)o.setAttribute('selected','');else o.removeAttribute('selected')}});
const ctx=vm.createContext(context),run=code=>vm.runInContext(code,ctx),el=id=>document.getElementById(id);
for(const f of ['core.js','history.js','app.js','import-ui.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'dist',f),'utf8'),ctx,{filename:f});
const click=selector=>{const e=document.querySelector(selector);assert.ok(e,selector);e.dispatchEvent(new window.Event('click',{bubbles:true}));if(e.onclick)e.onclick(new window.Event('click'))};
const fill=(id,value)=>{el(id).value=String(value)},submit=id=>el(id).dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
const data=()=>JSON.parse(run('JSON.stringify(state)'));
const totals=id=>[...el(id).querySelectorAll('.history-totals b')].map(e=>e.textContent);
assert.deepEqual(data(),expected,'loading preserves existing migration behavior');
assert.equal(writes,0);assert.equal(memory.get('jot-money-v1'),original);
assert.deepEqual([...el('allEntries').querySelectorAll('section time')].map(e=>e.getAttribute('datetime')),['2024-03-01','2024-02-29']);
assert.deepEqual([...el('allEntries').querySelectorAll('[aria-labelledby="history-day-2024-02-29"] [data-edit]')].map(e=>e.dataset.edit),['legacy','adjust','transfer','out','in']);
run("changeCalendarMonth('2024-02')");click('[data-history-view="calendar"]');click('[data-calendar-day="2024-02-29"]');
assert.deepEqual(totals('calendarMonthSummary'),['500.00 ฿','650.00 ฿','−150.00 ฿']);
assert.deepEqual(totals('calendarDaySummary'),['500.00 ฿','650.00 ฿','−150.00 ฿']);
const dayCell=()=>document.querySelector('[data-calendar-day="2024-02-29"]');
assert.equal(dayCell().querySelector('.calendar-income').textContent,'รับ500');
assert.equal(dayCell().querySelector('.calendar-expense').textContent,'จ่าย650');
assert.equal(dayCell().querySelector('.calendar-net').textContent,'สุทธิ−150');
assert.equal(dayCell().querySelector('.calendar-mobile-net').textContent,'−150');
assert.ok(dayCell().querySelector('.calendar-mobile-net').classList.contains('negative'));
assert.equal(document.querySelector('[data-calendar-day="2024-02-28"] .calendar-mobile-net'),null,'empty day must stay blank');
assert.equal(run('calendarNetNumber(1200)'),'+1.2K');
assert.equal(run('calendarNetNumber(0)'),'0');
assert.equal(el('calendarDaySummary').querySelector('.history-expense').textContent,'650.00 ฿');
fill('search','common expense');el('search').dispatchEvent(new window.Event('input'));
assert.equal(dayCell().querySelector('.calendar-income'),null,'expense-only day must not show income');
assert.equal(dayCell().querySelector('.calendar-mobile-net').textContent,'−650');
fill('search','common transfer');el('search').dispatchEvent(new window.Event('input'));
assert.equal(dayCell().querySelector('.calendar-income'),null,'transfers must not appear as income');
assert.ok(dayCell().querySelector('.calendar-mobile-net svg'),'transfer-only day shows transfer icon');
click('#clearHistorySearch');
assert.match(el('calendarInvalidDates').textContent,/1 รายการ/);
fill('search','common income');el('search').dispatchEvent(new window.Event('input'));
assert.deepEqual(totals('calendarMonthSummary'),['500.00 ฿','0.00 ฿','500.00 ฿']);
assert.equal(el('allEntries').querySelectorAll('[data-edit]').length,1);
assert.equal(el('calendarDayEntries').querySelectorAll('[data-edit]').length,1);
assert.equal(dayCell().querySelector('.calendar-income').textContent,'รับ500','filtered income must remain visible');
assert.equal(dayCell().querySelector('.calendar-mobile-net').textContent,'+500');
assert.ok(dayCell().querySelector('.calendar-mobile-net').classList.contains('positive'));
click('#clearHistorySearch');click('#calendarNext');click('#calendarPrev');click('[data-history-view="list"]');click('[data-history-view="calendar"]');
assert.deepEqual(data(),expected,'view navigation must not mutate ledger');assert.equal(writes,0);
assert.deepEqual(data().accounts.map(a=>Money.balance(data(),a.id)),expected.accounts.map(a=>Money.balance(expected,a.id)));
// Saving without changing the displayed date must retain exact imported timestamp.
run("openEdit('in')");submit('editForm');assert.equal(data().entries.find(e=>e.id==='in').date,'2024-02-28T17:30:00.123Z');
run("openEdit('out')");fill('editDate','2024-03-01');fill('editAmount',700);submit('editForm');
assert.equal(data().entries.find(e=>e.id==='out').date,'2024-03-01T22:00:00');
assert.deepEqual(totals('calendarMonthSummary'),['500.00 ฿','0.00 ฿','500.00 ฿']);
run("changeCalendarMonth('2024-03')");click('[data-calendar-day="2024-03-01"]');
assert.deepEqual(totals('calendarDaySummary'),['0.30 ฿','700.00 ฿','−699.70 ฿']);
run("openEdit('out')");click('#deleteEntry');assert.deepEqual(totals('calendarMonthSummary'),['0.30 ฿','0.00 ฿','0.30 ฿']);
// State replacement uses the same render path as import commit; undo uses real import-ui.
memory.set('jot-money-v1-before-import',JSON.stringify({state:expected,filename:'synthetic.xlsx'}));
run("state=Money.migrate({budget:0,accounts:[{id:'fresh',name:'Fresh fixture',kind:'wallet',opening:0}],entries:[{id:'fresh-entry',type:'income',amount:123.45,date:'2024-03-01',account:'fresh',category:'เงินเดือน',note:'synthetic replacement'}]});render()");
assert.deepEqual(totals('calendarMonthSummary'),['123.45 ฿','0.00 ฿','123.45 ฿']);
assert.equal(el('allEntries').querySelectorAll('[data-edit]').length,1);
click('#undoImport');assert.deepEqual(data(),expected);assert.deepEqual(totals('calendarMonthSummary'),['0.30 ฿','0.00 ฿','0.30 ฿']);
run("changeCalendarMonth('2024-02')");assert.deepEqual(totals('calendarMonthSummary'),['500.00 ฿','650.00 ฿','−150.00 ฿']);
run("state.entries=[{id:'balanced-in',type:'income',amount:12.34,account:'cash',date:'2024-02-29',note:'balanced',category:'อื่น ๆ'},{id:'balanced-out',type:'expense',amount:12.34,account:'cash',date:'2024-02-29',note:'balanced',category:'อื่น ๆ'},{id:'movement',type:'transfer',amount:50,account:'cash',toAccount:'bank',date:'2024-02-28',note:'movement',category:'โอน'}];renderHistory()");
assert.equal(dayCell().querySelector('.calendar-mobile-net').textContent,'0','balanced day must show zero');
assert.ok(dayCell().querySelector('.calendar-mobile-net').classList.contains('zero'));
assert.ok(document.querySelector('[data-calendar-day="2024-02-28"] .calendar-mobile-net svg'));
assert.equal(document.querySelector('[data-calendar-day="2024-02-27"] .calendar-mobile-net'),null);
console.log('PASS: shared search, daily/monthly cents totals, reversed same-day insertion, exclusions, Bangkok date editing, edit/delete refresh, navigation ledger/storage invariance, synthetic state replacement and import undo refresh; signed mobile net, zero, transfer-only and blank days.');
