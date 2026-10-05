const $=id=>document.getElementById(id), KEY='jot-money-v1';
const cats=['รอจัดหมวด','อาหาร','น้ำมัน','โทรศัพท์','เครื่องมือ','ซ่อมรถ','แต่งรถ','ของใช้','การเรียน','งาน/รายได้เสริม','อื่น ๆ'];
const labels={expense:'รายจ่าย',income:'รายรับ',lend:'ให้ยืม',repay:'รับคืน'};
const icons={'อาหาร':'◔','น้ำมัน':'↗','โทรศัพท์':'▯','เครื่องมือ':'⚒','ซ่อมรถ':'⚙','แต่งรถ':'◇','รอจัดหมวด':'?'};
const fmt=n=>new Intl.NumberFormat('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+' ฿';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initial=()=>({budget:300,accounts:[{id:'cash',name:'เงินสด',opening:1000},{id:'mymo',name:'MyMo',opening:1500},{id:'make',name:'MAKE',opening:800}],entries:[{id:'s1',note:'ข้าวกลางวัน',amount:50,account:'cash',type:'expense',category:'อาหาร',date:new Date().toISOString()},{id:'s2',note:'เครื่องมือช่าง',amount:180,account:'cash',type:'expense',category:'รอจัดหมวด',date:new Date().toISOString()},{id:'s3',note:'เติมเงินโทรศัพท์',amount:100,account:'mymo',type:'expense',category:'โทรศัพท์',date:new Date().toISOString()},{id:'s4',note:'ให้เพื่อนยืม',amount:200,account:'make',type:'lend',category:'อื่น ๆ',date:new Date().toISOString()}]});
let state=initial(),type='expense',account='cash',manualCategory=false,editing=null;
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.accounts)&&s.accounts.length>=1&&Array.isArray(s.entries)&&Number.isFinite(s.budget))state=s}catch{}
account=Money.activeAccounts(state)[0]?.id||state.accounts[0].id;
let timer;function toast(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('toast').style.display='none',3200)}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{toast('บันทึกในเครื่องไม่ได้ กรุณาส่งออกข้อมูลก่อนปิด');return false}}
function options(selected){return cats.map(c=>`<option ${c===selected?'selected':''}>${esc(c)}</option>`).join('')}
$('category').innerHTML=options('รอจัดหมวด');$('today').textContent=new Intl.DateTimeFormat('th-TH',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
function row(e){const acc=state.accounts.find(a=>a.id===e.account);const plus=e.type==='income'||e.type==='repay';return `<button class="entry" data-edit="${esc(e.id)}" aria-label="แก้ไข ${esc(e.note)}"><span class="entry-icon ${e.category==='รอจัดหมวด'?'pending':''}">${icons[e.category]||'◇'}</span><span class="entry-info"><span class="entry-title">${esc(e.note)}</span><br><span class="entry-meta">${esc(acc.name)} · ${esc(e.category)} · ${labels[e.type]} · ${new Date(e.date).toLocaleDateString('th-TH',{day:'numeric',month:'short'})}</span></span><span class="entry-amount ${plus?'plus':''}">${plus?'+':'−'}${fmt(e.amount)}</span></button>`}
function render(){
 if(!Money.activeAccounts(state).some(a=>a.id===account))account=Money.activeAccounts(state)[0]?.id;
 $('categorySummary').textContent=$('category').value;
 $('total').textContent=fmt(Money.total(state));$('reserved').textContent=fmt(state.budget);$('fuel').textContent=fmt(state.budget);$('available').textContent=fmt(Money.total(state)-state.budget);$('debt').textContent=fmt(Money.debt(state));
 $('accounts').innerHTML=state.accounts.map((a,i)=>`<div class="account-row"><span class="account-icon">${['◈','▣','◇'][i%3]}</span><span class="account-name">${esc(a.name)}<small>${a.archived?'ซ่อนไว้ · ยังรวมในยอดเงิน':'ACCOUNT'}</small></span><b>${fmt(Money.balance(state,a.id))}</b></div>`).join('');
 $('accountChips').innerHTML=Money.activeAccounts(state).map(a=>`<button type="button" data-account="${a.id}" aria-pressed="${a.id===account}" class="${a.id===account?'selected':''}">${esc(a.name)}</button>`).join('');
 const entries=[...state.entries].reverse();$('recent').innerHTML=entries.slice(0,4).map(row).join('')||'<p class="empty">ยังไม่มีรายการ ลองจดรายการแรกได้เลย</p>';renderHistory();
 const grouped={};state.entries.filter(e=>e.type==='expense'&&Date.now()-new Date(e.date).getTime()<7*86400000).forEach(e=>grouped[e.category]=(grouped[e.category]||0)+e.amount);const sum=Object.values(grouped).reduce((a,b)=>a+b,0);
 $('spending').innerHTML=Object.entries(grouped).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`<div class="bar-row"><span>${esc(c)}</span><div class="bar-track"><div class="bar-fill" style="width:${n/sum*100}%"></div></div><b>${fmt(n)}</b></div>`).join('')||'<p class="empty">ยังไม่มีรายจ่ายในช่วง 7 วันนี้</p>';
 $('accountSettings').innerHTML=state.accounts.map(a=>`<div class="account-setting"><div class="setting-row"><div><label for="name-${a.id}">ชื่อบัญชี${a.archived?' · ซ่อนไว้':''}</label><input id="name-${a.id}" value="${esc(a.name)}" maxlength="30" required></div><div><label for="opening-${a.id}">ยอดตั้งต้น (บาท)</label><input id="opening-${a.id}" type="number" step="0.01" value="${a.opening}" required></div></div><div class="account-actions"><span>ยอดปัจจุบัน ${fmt(Money.balance(state,a.id))}</span><button type="button" class="text-button" ${a.archived?`data-restore-account="${a.id}"`:`data-remove-account="${a.id}"`}>${a.archived?'นำกลับมาใช้':'ลบ / ซ่อนบัญชี'}</button></div></div>`).join('');$('budget').value=state.budget;
}
function renderHistory(){const q=$('search').value.trim().toLowerCase();$('allEntries').innerHTML=[...state.entries].reverse().filter(e=>(e.note+' '+e.category+' '+state.accounts.find(a=>a.id===e.account).name).toLowerCase().includes(q)).map(row).join('')||'<p class="empty">ไม่พบรายการ</p>'}
function tab(name){if($('quickDialog').open)$('quickDialog').close();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('hidden',v.id!==name));document.querySelectorAll('.nav').forEach(v=>v.classList.toggle('active',v.dataset.tab===name));$('pageTitle').textContent={home:'เงินชัด จดได้ทันที',history:'ทุกยอด มีที่มา',settings:'ตั้งให้ตรงกับชีวิตคุณ'}[name];window.scrollTo({top:0,behavior:'smooth'});updateCaptureButton()}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-tab],[data-go]');if(nav)tab(nav.dataset.tab||nav.dataset.go);
 const chip=e.target.closest('[data-account]');if(chip){account=chip.dataset.account;render()}
 const typ=e.target.closest('[data-type]');if(typ){type=typ.dataset.type;document.querySelectorAll('[data-type]').forEach(b=>b.classList.toggle('selected',b===typ))}
 const ex=e.target.closest('[data-example]');if(ex){$('quick').value=ex.dataset.example;manualCategory=false;suggest();$('quick').focus()}
 const remove=e.target.closest('[data-remove-account]');if(remove)removeAccount(remove.dataset.removeAccount);
 const restore=e.target.closest('[data-restore-account]');if(restore){if(!saveSettings())return;state.accounts.find(a=>a.id===restore.dataset.restoreAccount).archived=false;persist();render();toast('นำบัญชีกลับมาใช้แล้ว')}
 const ed=e.target.closest('[data-edit]');if(ed)openEdit(ed.dataset.edit);
});
function suggest(){const parsed=Money.parse($('quick').value);if(!manualCategory){$('category').value=parsed?Money.suggest(parsed.note):'รอจัดหมวด';$('suggestion').textContent=$('category').value==='รอจัดหมวด'?'ยังไม่แน่ใจ เก็บไว้จัดทีหลังได้':'เสนอจากคำในรายการ · เปลี่ยนได้'}$('categorySummary').textContent=$('category').value;}
$('quick').addEventListener('input',()=>{manualCategory=false;suggest();$('formError').textContent=''});$('category').addEventListener('change',()=>{manualCategory=true;$('suggestion').textContent='คุณเลือกหมวดนี้เอง';$('categorySummary').textContent=$('category').value});
$('entryForm').addEventListener('submit',e=>{e.preventDefault();const p=Money.parse($('quick').value);if(!Money.activeAccounts(state).some(a=>a.id===account)){$('formError').textContent='เพิ่มหรือเลือกบัญชีก่อนบันทึก';return}if(!p){$('formError').textContent='ใส่ชื่อรายการกับยอดเงินหนึ่งจำนวน เช่น ข้าว 50';return}if(type==='repay'&&p.amount>Money.debt(state)){ $('formError').textContent='ยอดรับคืนมากกว่าเงินให้ยืมคงเหลือ';return}state.entries.push({id:crypto.randomUUID(),...p,account,type,category:$('category').value,date:new Date().toISOString()});const saved=persist();render();$('quick').value='';manualCategory=false;suggest();if($('quickDialog').open)$('quickDialog').close();if(saved)toast('บันทึกแล้ว · '+p.note+' '+fmt(p.amount));});
$('search').addEventListener('input',renderHistory);
function saveSettings(){
 const b=Number($('budget').value);if(!Number.isFinite(b)||b<0||!$('settingsForm').reportValidity())return false;
 for(const a of state.accounts){const n=Number($('opening-'+a.id).value);if(!Number.isFinite(n)||!$('name-'+a.id).value.trim())return false}
 for(const a of state.accounts){a.name=$('name-'+a.id).value.trim();a.opening=Number($('opening-'+a.id).value)}state.budget=b;return true;
}
$('settingsForm').addEventListener('submit',e=>{e.preventDefault();if(!saveSettings())return;const saved=persist();render();if(saved)toast('บันทึกบัญชีและงบแล้ว')});
$('addAccountForm').addEventListener('submit',e=>{e.preventDefault();const name=$('newAccountName').value.trim(),opening=Number($('newAccountOpening').value);if(!name||!Number.isFinite(opening)||!saveSettings())return;const a={id:crypto.randomUUID(),name,opening};state.accounts.push(a);account=a.id;const saved=persist();render();$('addAccountForm').reset();if(saved)toast('เพิ่มบัญชี '+name+' แล้ว')});
function removeAccount(id){
 if(Money.activeAccounts(state).length<=1){toast('ต้องมีบัญชีใช้งานอย่างน้อยหนึ่งบัญชี');return}
 const a=state.accounts.find(a=>a.id===id);const hasHistory=state.entries.some(e=>e.account===id);
 if(!confirm(hasHistory?'บัญชีนี้มีประวัติ จะซ่อนจากปุ่มจดใหม่ โดยเก็บประวัติและยอดเงินไว้ ต้องการซ่อนหรือไม่?':'ลบได้เมื่อยอดเป็นศูนย์ หากยังมีเงินจะซ่อนบัญชีและเก็บยอดไว้ ดำเนินการต่อหรือไม่?'))return;
 if(!saveSettings())return;const result=Money.removeAccount(state,id);const saved=persist();render();if(saved)toast(result==='deleted'?'ลบบัญชีแล้ว':'ซ่อนบัญชีแล้ว · นำกลับมาใช้ได้ในหน้านี้');
}
function openEdit(id){editing=id;const e=state.entries.find(x=>x.id===id);$('editNote').value=e.note;$('editAmount').value=e.amount;$('editCategory').innerHTML=options(e.category);$('editAccount').innerHTML=state.accounts.filter(a=>!a.archived||a.id===e.account).map(a=>`<option value="${a.id}" ${a.id===e.account?'selected':''}>${esc(a.name)}</option>`).join('');$('editDialog').showModal()}
$('closeEdit').onclick=()=>$('editDialog').close();$('editForm').addEventListener('submit',ev=>{ev.preventDefault();const e=state.entries.find(x=>x.id===editing),n=Number($('editAmount').value);if(n<=0||!Number.isFinite(n)||!$('editNote').value.trim())return;Object.assign(e,{note:$('editNote').value.trim(),amount:n,category:$('editCategory').value,account:$('editAccount').value});const saved=persist();render();$('editDialog').close();if(saved)toast('แก้ไขรายการแล้ว')});
$('deleteEntry').onclick=()=>{if(!confirm('ลบรายการนี้และคืนยอดบัญชีตามรายการ?'))return;state.entries=state.entries.filter(e=>e.id!==editing);persist();render();$('editDialog').close();toast('ลบรายการแล้ว')};
$('reset').onclick=()=>{if(!confirm('ล้างรายการในเดโมแล้วเริ่มใหม่ด้วยข้อมูลตัวอย่าง?'))return;state=initial();account='cash';persist();render();toast('เริ่มข้อมูลตัวอย่างใหม่แล้ว')};
$('export').onclick=()=>{const cell=v=>'"'+String(v).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';const rows=[['วันที่','รายการ','ประเภท','จำนวนเงิน','บัญชี','หมวด'],...state.entries.map(e=>[e.date,e.note,labels[e.type],e.amount,state.accounts.find(a=>a.id===e.account).name,e.category])];const url=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='jot-money.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
render();

function updateCaptureButton(){
 const r=$('quickCard').getBoundingClientRect();
 const homeVisible=!$('home').classList.contains('hidden');
 const visible=homeVisible&&r.top<window.innerHeight-80&&r.bottom>100;
 $('floatingCapture').classList.toggle('hidden',visible||$('quickDialog').open||$('editDialog').open);
}
$('floatingCapture').addEventListener('click',()=>{
 $('quickSlot').appendChild($('quickCard'));
 $('quickDialog').showModal();updateCaptureButton();
 $('quick').focus({preventScroll:true});
});
$('closeQuick').addEventListener('click',()=>$('quickDialog').close());
$('quickDialog').addEventListener('close',()=>{
 $('quickAnchor').after($('quickCard'));updateCaptureButton();
});
$('editDialog').addEventListener('close',updateCaptureButton);
window.addEventListener('scroll',updateCaptureButton,{passive:true});
window.addEventListener('resize',updateCaptureButton);
updateCaptureButton();
