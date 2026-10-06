// Synthetic state only. linkedom is an existing QA dependency, not an app dependency.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const {parseHTML}=require('../.qa/node_modules/linkedom');
const focusedDocuments=new WeakMap();
const fixedNow='2024-03-02T18:20:30.123Z';
class CaptureTestDate extends Date {constructor(...args){super(...(args.length?args:[fixedNow]))}static now(){return Date.parse(fixedNow)}}
const fixture={budget:321.09,accounts:[...Array.from({length:25},(_,i)=>({id:'w'+i,name:'Synthetic wallet '+i,kind:'wallet',opening:100+i,group:i%2?'bank':'cash'})),{id:'hidden',name:'Hidden wallet',kind:'wallet',opening:10,archived:true},{id:'deleted',name:'Deleted wallet',kind:'wallet',opening:10,deleted:true},{id:'borrower',name:'Synthetic borrower',kind:'borrower',opening:40}],entries:[]};
function harness(seed=fixture,preference){
 const {window,document}=parseHTML(fs.readFileSync(path.join(__dirname,'dist/index.html'),'utf8'));
 const memory=new Map([['jot-money-v1',JSON.stringify(seed)]]),writes=[];
 if(preference!==undefined)memory.set('jot-money-v1-last-account',preference);
 window.innerHeight=900;window.scrollTo=()=>{};
 window.HTMLElement.prototype.getBoundingClientRect=()=>({top:0,bottom:400});
 window.HTMLElement.prototype.showModal=function(){this.setAttribute('open','')};
 window.HTMLElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new window.Event('close'))};
 Object.defineProperty(window.HTMLElement.prototype,'open',{configurable:true,get(){return this.hasAttribute('open')}});
 window.HTMLElement.prototype.reportValidity=()=>true;window.HTMLElement.prototype.focus=function(){focusedDocuments.set(this.ownerDocument,this.id)};
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
console.log('PASS: capture wallet picker/preference/invariance checks; Bangkok default date, retro expense/income grouping, clock preservation, invalid/empty date rejection, transfer date selection/excluded totals, account picker draft-date retention and successful-save/floating-open date resets.');
