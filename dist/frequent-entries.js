// Derived suggestions only: no ledger changes and no external services.
const FrequentEntries = (() => {
 const money=typeof module!=='undefined'?require('./core.js'):Money;
 const history=typeof module!=='undefined'?require('./history.js'):History;
 const key=(note,type)=>JSON.stringify([type,money.categoryNoteKey(note)]);
 function mostUsed(rows,field){
  const votes=new Map();
  rows.forEach(r=>{const value=r.entry[field],v=votes.get(value)||{value,count:0,date:'',stamp:-Infinity,index:-1};v.count++;if(r.day>v.date||r.day===v.date&&(r.stamp>v.stamp||r.stamp===v.stamp&&r.index>v.index)){v.date=r.day;v.stamp=r.stamp;v.index=r.index}votes.set(value,v)});
  return [...votes.values()].sort((a,b)=>b.count-a.count||b.date.localeCompare(a.date)||b.stamp-a.stamp||b.index-a.index)[0]?.value;
 }
 function suggest(state,{today=history.today(),limit=4}={}){
  const active=new Set(money.wallets(state).map(a=>a.id)),groups=new Map();
  const hidden=new Set(Array.isArray(state.frequentDismissed)?state.frequentDismissed:[]);
  const pinned=new Set((Array.isArray(state.quickTemplates)?state.quickTemplates:[]).filter(t=>t&&active.has(t.account)).map(t=>key(t.note,t.type)));
  (state.entries||[]).forEach((entry,index)=>{
   if(!['income','expense'].includes(entry.type)||!active.has(entry.account)||typeof entry.note!=='string'||!entry.note.trim()||entry.note.trim().length>160)return;
   const day=history.dayKey(entry.date),amount=Number(entry.amount);
   if(!day||day>today||!Number.isFinite(amount)||amount<=0||amount>10000000||Math.abs(amount*100-Math.round(amount*100))>0.000001)return;
   const id=key(entry.note,entry.type);if(hidden.has(id)||pinned.has(id))return;
   const stamp=Date.parse(/[T ]\d\d:\d\d.*(?:Z|[+-]\d\d:?\d\d)$/i.test(entry.date)?entry.date:day+'T00:00:00+07:00');
   const group=groups.get(id)||[];group.push({entry:{...entry,amount},day,stamp,index});groups.set(id,group);
  });
  return [...groups.entries()].filter(([,rows])=>rows.length>=3&&new Set(rows.map(r=>r.day)).size>=2).map(([id,rows])=>{
   rows.sort((a,b)=>a.day.localeCompare(b.day)||a.stamp-b.stamp||a.index-b.index);
   const account=mostUsed(rows,'account'),preferred=rows.filter(r=>r.entry.account===account),last=rows.at(-1);
   const categories=money.categories(state,last.entry.type),categoryRows=preferred.map(r=>({...r,entry:{...r.entry,category:state.categoryAliases?.[r.entry.category]||r.entry.category}})).filter(r=>categories.includes(r.entry.category));
   return {id,note:last.entry.note.trim(),type:last.entry.type,account,category:mostUsed(categoryRows,'category')||'รอจัดหมวด',amount:mostUsed(preferred,'amount'),variable:new Set(preferred.map(r=>r.entry.amount)).size>1,count:rows.length,lastDay:last.day};
  }).sort((a,b)=>b.count-a.count||b.lastDay.localeCompare(a.lastDay)||a.id.localeCompare(b.id)).slice(0,limit);
 }
 return {suggest,key};
})();
if(typeof module!=='undefined')module.exports=FrequentEntries;
