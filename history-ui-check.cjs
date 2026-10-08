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
for(const f of ['core.js','history.js','weekly.js','analytics.js','chart-view.js','app.js','import-ui.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'dist',f),'utf8'),ctx,{filename:f});
const click=selector=>{const e=document.querySelector(selector);assert.ok(e,selector);e.dispatchEvent(new window.Event('click',{bubbles:true}));if(e.onclick)e.onclick(new window.Event('click'))};
const fill=(id,value)=>{el(id).value=String(value)},submit=id=>el(id).dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
const data=()=>JSON.parse(run('JSON.stringify(state)'));
const totals=id=>[...el(id).querySelectorAll('.history-totals b')].map(e=>e.textContent);
assert.deepEqual(data(),expected,'loading preserves existing migration behavior');
assert.equal(writes,0);assert.equal(memory.get('jot-money-v1'),original);
assert.deepEqual([...el('allEntries').querySelectorAll('section time')].map(e=>e.getAttribute('datetime')),['2024-03-01','2024-02-29']);
assert.deepEqual([...el('allEntries').querySelectorAll('[aria-labelledby="history-day-2024-02-29"] [data-edit]')].map(e=>e.dataset.edit),['legacy','adjust','transfer','out','in']);
run("changeCalendarMonth('2024-02')");click('[data-history-view="calendar"]');click('[data-calendar-day="2024-02-29"]');
assert.ok(document.getElementById('calendarDayDialog').hasAttribute('open'));document.getElementById('calendarDayDialog').close();
assert.equal(document.querySelectorAll('#calendarMonthSummary').length,1);
assert.equal(el('calendarMonthSummary').nextElementSibling.id,'weeklyMonthSummary','Summary strips share the same position');
assert.equal(el('weeklyMonthSummary').nextElementSibling.id,'historyListView');
assert.ok(el('calendarPeriod').contains(el('calendarPrev')));assert.ok(el('weeklyPeriod').contains(el('weeklyYear')));
assert.equal(document.querySelector('#historyListView #openImport'),null);assert.equal(document.querySelector('#calendarView #openImport'),null);assert.ok(document.querySelector('#summary #openImport'));assert.ok(document.querySelector('#summary #export'));assert.ok(document.querySelector('#summary #undoImport'));
click('#toggleHistoryTools');assert.ok(el('historySearchDialog').open);assert.ok(el('historySearchDialog').contains(el('search')));click('#closeHistorySearch');assert.ok(!el('historySearchDialog').open);
fill('search','common');el('search').dispatchEvent(new window.Event('input',{bubbles:true}));assert.ok(!el('historyFilterNotice').classList.contains('hidden'));assert.ok(!el('clearHistoryFilter').classList.contains('hidden'));click('#clearHistoryFilter');assert.equal(el('search').value,'');
click('[data-history-view="list"]');assert.ok(el('history').classList.contains('calendar-compact'));click('[data-history-view="calendar"]');
assert.ok(document.querySelector('.calendar-help'));
assert.deepEqual(totals('calendarMonthSummary'),['500.00 ฿','650.00 ฿','−150.00 ฿']);
assert.deepEqual(totals('calendarModalSummary'),['500.00 ฿','650.00 ฿','−150.00 ฿']);
const dayCell=()=>document.querySelector('[data-calendar-day="2024-02-29"]');
assert.equal(dayCell().querySelector('.calendar-income').textContent,'รับ500');
assert.equal(dayCell().querySelector('.calendar-expense').textContent,'จ่าย650');
assert.equal(dayCell().querySelector('.calendar-net').textContent,'สุทธิ−150');
assert.equal(dayCell().querySelector('.calendar-mobile-net').textContent,'−150');
assert.ok(dayCell().querySelector('.calendar-mobile-net').classList.contains('negative'));
assert.equal(document.querySelector('[data-calendar-day="2024-02-28"] .calendar-mobile-net'),null,'empty day must stay blank');
assert.equal(run('calendarNetNumber(1200)'),'+1.2K');
assert.equal(run('calendarNetNumber(0)'),'0');
assert.equal(el('calendarModalSummary').querySelector('.history-expense').textContent,'650.00 ฿');
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
assert.equal(el('calendarModalEntries').querySelectorAll('[data-edit]').length,1);
assert.equal(dayCell().querySelector('.calendar-income').textContent,'รับ500','filtered income must remain visible');
assert.equal(dayCell().querySelector('.calendar-mobile-net').textContent,'+500');
assert.ok(dayCell().querySelector('.calendar-mobile-net').classList.contains('positive'));
click('#clearHistorySearch');click('#calendarNext');click('#calendarPrev');click('[data-history-view="list"]');click('[data-history-view="calendar"]');
assert.deepEqual(data(),expected,'view navigation must not mutate ledger');assert.equal(writes,0);
assert.deepEqual(data().accounts.map(a=>Money.balance(data(),a.id)),expected.accounts.map(a=>Money.balance(expected,a.id)));
// Charts share the month, ignore history search and refresh when the ledger changes.
run("changeCalendarMonth('2024-02')");click('#openAnalytics');
assert.ok(el('analyticsDialog').open);assert.match(el('analyticsSelection').textContent,/650.00/);
fill('search','missing-query');el('search').dispatchEvent(new window.Event('input'));
assert.match(el('analyticsSelection').textContent,/650.00/,'Charts use all month data');click('#clearHistoryFilter');
click('[data-chart-week="4"]');assert.match(el('analyticsWeekSelection').textContent,/500.00/);
click('#closeAnalytics');assert.ok(!el('analyticsDialog').open);
assert.deepEqual(data(),expected,'Chart navigation never changes ledger');assert.equal(writes,0);
// Saving without changing the displayed date must retain exact imported timestamp.
run('weeklyYear=2024;weeklyMonth=2;renderWeekly()');
const weeklyTotals=()=>[...el('weeklyTotals').querySelectorAll('b')].map(e=>e.textContent);
assert.deepEqual(weeklyTotals(),['500.00 ฿','650.00 ฿','−150.00 ฿']);
fill('search','missing-query');el('search').dispatchEvent(new window.Event('input'));assert.deepEqual(weeklyTotals(),['500.00 ฿','650.00 ฿','−150.00 ฿'],'Weekly totals ignore history search');click('#clearHistoryFilter');
run("tab('history')");click('[data-history-view="summary"]');assert.ok(!el('summary').classList.contains('hidden'));assert.ok(el('history').contains(el('summary')));assert.equal(el('pageTitle').textContent,'รายการทั้งหมด');assert.equal(el('weeklyWeeks').children.length,5);assert.equal(document.querySelector('[data-tab="summary"]'),null);assert.deepEqual([...document.querySelectorAll('[data-history-view]')].map(b=>b.dataset.historyView),['list','calendar','summary']);assert.ok(el('calendarMonthSummary').classList.contains('hidden'));assert.ok(el('toggleHistoryTools').classList.contains('hidden'));click('[data-history-view="calendar"]');assert.ok(el('summary').classList.contains('hidden'));assert.ok(!el('calendarMonthSummary').classList.contains('hidden'));
run("openEdit('in')");submit('editForm');assert.equal(data().entries.find(e=>e.id==='in').date,'2024-02-28T17:30:00.123Z');
click('#openAnalytics');
run("openEdit('out')");fill('editDate','2024-03-01');fill('editAmount',700);submit('editForm');
assert.equal(data().entries.find(e=>e.id==='out').date,'2024-03-01T22:00:00');
assert.deepEqual(weeklyTotals(),['500.00 ฿','0.00 ฿','500.00 ฿'],'Monthly summary removes the moved entry');assert.match(el('analyticsContent').textContent,/ยังไม่มีรายจ่าย/);
fill('weeklyMonth','3');el('weeklyMonth').dispatchEvent(new window.Event('change'));assert.deepEqual(weeklyTotals(),['0.30 ฿','700.00 ฿','−699.70 ฿'],'Weekly summary updates after editing date/amount');assert.match(el('analyticsSelection').textContent,/700.00/);
assert.equal(run('calendarMonth'),'2024-03','Calendar and weekly summary use the same selected month');
assert.deepEqual(totals('calendarMonthSummary'),['0.30 ฿','700.00 ฿','−699.70 ฿']);
run("changeCalendarMonth('2024-03')");click('[data-calendar-day="2024-03-01"]');
document.getElementById('calendarDayDialog').close();
assert.deepEqual(totals('calendarModalSummary'),['0.30 ฿','700.00 ฿','−699.70 ฿']);
run("openEdit('out')");click('#deleteEntry');assert.deepEqual(totals('calendarMonthSummary'),['0.30 ฿','0.00 ฿','0.30 ฿']);
assert.deepEqual(weeklyTotals(),['0.30 ฿','0.00 ฿','0.30 ฿'],'Weekly updates after deletion');
// State replacement uses the same render path as import commit; undo uses real import-ui.
memory.set('jot-money-v1-before-import',JSON.stringify({state:expected,filename:'synthetic.xlsx'}));
run("state=Money.migrate({budget:0,accounts:[{id:'fresh',name:'Fresh fixture',kind:'wallet',opening:0}],entries:[{id:'fresh-entry',type:'income',amount:123.45,date:'2024-03-01',account:'fresh',category:'เงินเดือน',note:'synthetic replacement'}]});render()");
assert.deepEqual(totals('calendarMonthSummary'),['123.45 ฿','0.00 ฿','123.45 ฿']);
assert.deepEqual(weeklyTotals(),['123.45 ฿','0.00 ฿','123.45 ฿'],'Weekly updates after synthetic import replacement');assert.match(el('analyticsContent').textContent,/ยังไม่มีรายจ่าย/);
assert.equal(el('allEntries').querySelectorAll('[data-edit]').length,1);
click('#undoImport');assert.deepEqual(data(),expected);assert.deepEqual(totals('calendarMonthSummary'),['0.30 ฿','0.00 ฿','0.30 ฿']);
assert.deepEqual(weeklyTotals(),['0.30 ฿','0.00 ฿','0.30 ฿'],'Weekly summary updates after import undo');
fill('weeklyMonth','4');el('weeklyMonth').dispatchEvent(new window.Event('change'));assert.deepEqual(weeklyTotals(),['0.00 ฿','0.00 ฿','0.00 ฿']);assert.ok(!el('weeklyEmpty').classList.contains('hidden'));click('#weeklyCurrent');assert.equal(el('weeklyYear').value,run('History.today().slice(0,4)'));
run("changeCalendarMonth('2024-02')");assert.deepEqual(totals('calendarMonthSummary'),['500.00 ฿','650.00 ฿','−150.00 ฿']);
run("state.entries=[{id:'balanced-in',type:'income',amount:12.34,account:'cash',date:'2024-02-29',note:'balanced',category:'อื่น ๆ'},{id:'balanced-out',type:'expense',amount:12.34,account:'cash',date:'2024-02-29',note:'balanced',category:'อื่น ๆ'},{id:'movement',type:'transfer',amount:50,account:'cash',toAccount:'bank',date:'2024-02-28',note:'movement',category:'โอน'}];renderHistory()");
assert.equal(dayCell().querySelector('.calendar-mobile-net').textContent,'0','balanced day must show zero');
assert.ok(dayCell().querySelector('.calendar-mobile-net').classList.contains('zero'));
assert.ok(document.querySelector('[data-calendar-day="2024-02-28"] .calendar-mobile-net svg'));
assert.equal(document.querySelector('[data-calendar-day="2024-02-27"] .calendar-mobile-net'),null);
// Donut controls use one selection for the center, slice and category list.
run("state.entries=[{type:'expense',amount:75,date:'2024-02-29',category:'อาหาร',note:''},{type:'expense',amount:25,date:'2024-02-29',category:'เดินทาง',note:''}];changeCalendarMonth('2024-02');renderAnalytics()");
assert.equal(el('donutCenterName').textContent,'อาหาร');assert.equal(el('donutCenterPercent').textContent,'75%');
click('[data-chart-step="1"]');assert.equal(el('donutCenterName').textContent,'เดินทาง');assert.equal(el('donutCenterAmount').textContent,'25.00 ฿');assert.equal(el('donutPosition').textContent,'หมวด 2 / 2');
click('[data-chart-step="1"]');assert.equal(el('donutCenterName').textContent,'อาหาร','Next wraps');
click('[data-chart-step="-1"]');assert.equal(el('donutCenterName').textContent,'เดินทาง','Previous wraps');
const donutKey=new window.Event('keydown',{bubbles:true});donutKey.key='ArrowRight';document.querySelector('.donut-segment[aria-pressed="true"]').dispatchEvent(donutKey);assert.equal(el('donutCenterName').textContent,'อาหาร');
const donutHover=new window.Event('pointerover',{bubbles:true});donutHover.pointerType='mouse';document.querySelectorAll('.donut-segment')[1].dispatchEvent(donutHover);assert.equal(el('donutCenterName').textContent,'เดินทาง');assert.equal(document.querySelectorAll('[data-chart-category][aria-pressed="true"]').length,2);
// Income pie is independent of expense categories and refreshes with the month.
run("state.entries=[{type:'income',amount:750,date:'2024-02-29',category:'เงินเดือน',note:''},{type:'income',amount:250,date:'2024-02-29',category:'รายได้เสริม',note:''},{type:'expense',amount:90,date:'2024-02-29',category:'อาหาร',note:''},{type:'transfer',amount:9999,date:'2024-02-29',category:'โอน',note:''}];renderAnalytics()");
click('[data-analytics-view="income"]');assert.match(el('donutTitle').textContent,/รายรับมาจากไหน/);assert.equal(el('donutCenterName').textContent,'เงินเดือน');assert.equal(el('donutCenterPercent').textContent,'75%');assert.match(document.querySelector('.donut-total-pill').textContent,/1,000.00/);
click('[data-chart-step="1"]');assert.equal(el('donutCenterName').textContent,'รายได้เสริม');assert.equal(el('donutCenterAmount').textContent,'250.00 ฿');
click('[data-analytics-view="categories"]');assert.equal(el('donutCenterName').textContent,'อาหาร');assert.equal(el('donutCenterPercent').textContent,'100%');assert.match(document.querySelector('.donut-total-pill').textContent,/90.00/);
click('[data-analytics-view="income"]');run("state.entries=state.entries.filter(e=>e.type!=='income');renderAnalytics()");assert.match(el('analyticsCategories').textContent,/ยังไม่มีรายรับในเดือนนี้/);assert.equal(document.querySelector('.donut-segment'),null);
console.log('PASS: shared search, daily/monthly cents totals, reversed same-day insertion, exclusions, Bangkok date editing, edit/delete refresh, navigation ledger/storage invariance, synthetic state replacement and import undo refresh; signed mobile net, zero, transfer-only and blank days.');
