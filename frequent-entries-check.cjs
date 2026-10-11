const assert=require('node:assert/strict'),Money=require('./dist/core.js'),Frequent=require('./dist/frequent-entries.js');
const state=Money.createInitialState();state.accounts=[{id:'cash',kind:'wallet',opening:1000},{id:'bank',kind:'wallet',opening:0},{id:'hidden',kind:'wallet',archived:true,opening:10},{id:'debt',kind:'borrower',opening:0}];
const row=(id,note,amount,date,extra={})=>({id,note,amount,date,type:'expense',account:'cash',category:'อาหาร',...extra});
state.entries=[row('a',' กาแฟ ',65,'2026-10-01'),row('b','กาแฟ',70,'2026-10-02'),row('c','กาแฟ',65,'2026-10-03'),row('d','กาแฟ',90,'2026-10-20')];
const get=()=>Frequent.suggest(state,{today:'2026-10-12'}),before=JSON.stringify(state);
assert.equal(get().length,1);assert.equal(get()[0].amount,65);assert.equal(get()[0].variable,true);assert.equal(get()[0].count,3);assert.equal(JSON.stringify(state),before);
state.entries[2].amount=75;assert.equal(get()[0].amount,75,'Amount tie goes to most recent date');
const dates=state.entries.map(e=>e.date);state.entries[1].date='2026-10-02T12:00:00+07:00';state.entries[2].date='2026-10-02T09:00:00+07:00';assert.equal(get()[0].amount,70,'Within-day tie follows timestamp even if import order differs');state.entries.forEach((e,i)=>e.date=dates[i]);
state.entries[2].account='bank';assert.equal(get()[0].account,'cash');assert.equal(get()[0].amount,70,'Amount based on preferred account');
state.frequentDismissed=[get()[0].id];assert.equal(get().length,0);state.frequentDismissed=[];
state.quickTemplates=[{type:'expense',note:'กาแฟ',account:'cash'}];assert.equal(get().length,0,'Manual template excludes repeated recommendation');state.quickTemplates=[];
state.entries.push(...[1,2,3].map(i=>row('in'+i,'กาแฟ',500,`2026-10-0${i}`,{type:'income',category:'รอจัดหมวด'})));assert.equal(get().length,2,'Types remain independent');
state.entries=state.entries.filter(e=>e.type==='expense');for(const e of state.entries)e.date='2026-10-01';assert.equal(get().length,0,'Same-day imported duplicates alone are not a routine');
for(const account of ['hidden','debt','unknown']){state.entries=[1,2,3].map(i=>row(String(i),'ชื่อ',10,`2026-10-0${i}`,{account}));assert.equal(get().length,0)}
for(const type of ['transfer','adjustment','lend','repay']){state.entries=[1,2,3].map(i=>row(String(i),'ชื่อ',10,`2026-10-0${i}`,{type}));assert.equal(get().length,0)}
state.entries=[1,2,3].map(i=>row(String(i),'ชื่อ',10,`2026-10-0${i}`,{category:'Legacy custom'}));assert.equal(get()[0].category,'Legacy custom','Historical categories stay available under existing app rules');
state.entries[0].amount=Infinity;assert.equal(get().length,0);assert.equal(Frequent.suggest(Money.createInitialState()).length,0);
console.log('PASS frequent suggestions: frequency, multi-day threshold, normalization, preferred account/amount, recency tie, variable amounts, type separation, future/invalid/debt exclusions, hide, manual duplicate, non-mutation.');
