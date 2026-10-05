const $=id=>document.getElementById(id), KEY='jot-money-v1';
const labels={expense:'รายจ่าย',income:'รายรับ',lend:'ให้ยืม',repay:'รับคืน',transfer:'โอน',adjustment:'ปรับยอดบัญชีผู้ยืม'};
const icon=name=>'<svg class="icon" aria-hidden="true"><use href="#i-'+name+'"/></svg>';
function accountIcon(a){return icon(a.kind==='borrower'?'users':({cash:'banknote',bank:'landmark',ewallet:'smartphone',savings:'piggy-bank'})[Money.accountGroup(a,state)]||'wallet')}
const emptyBlock=(name,title,hint)=>'<div class="empty-block">'+icon(name)+'<strong>'+title+'</strong><p>'+hint+'</p></div>';
const fmt=n=>new Intl.NumberFormat('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+' ฿';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function borrowerLabel(a){return Money.balance(state,a.id)<0?'เราติดหนี้คนนี้':'คนนี้ติดหนี้เรา'}
function groupOptions(selected,kind){return Money.groups(state).map(g=>`<option value="${g.id}" ${g.id===selected?'selected':''}>${esc(g.label)}</option>`).join('')}
function settingsAccountRow(a){return `<button type="button" class="settings-list-row" data-account-detail="${esc(a.id)}"><span class="settings-list-icon ${a.archived?'archived':''}" aria-hidden="true">${accountIcon(a)}</span><span class="settings-list-copy"><b>${esc(a.name)}</b><small>${a.kind==='borrower'?'ผู้ยืม · '+borrowerLabel(a):a.archived?'ซ่อนไว้ · ยังรวมในยอดทั้งหมด':'ยอดปัจจุบัน · ดูรายการเงินเข้า–ออก'}</small></span><span class="settings-list-value">${fmt(Money.balance(state,a.id))}<small>ดูรายละเอียด ${icon('chevron-right')}</small></span></button>`}
function renderAccountGroups(){return Money.groupedAccounts(state).map(group=>`<section class="account-group" aria-labelledby="account-group-${group.id}"><div class="account-group-heading"><h3 id="account-group-${group.id}">${esc(group.label)} <span class="count-badge">${group.accounts.length}</span></h3><span>${group.id==='archived'?'เก็บยอดและประวัติไว้':group.accounts.some(a=>a.kind==='borrower')?(group.accounts.some(a=>a.kind!=='borrower')?'เงินของเรา '+fmt(group.cashTotal)+' · ':'')+'เขาติดเรา '+fmt(group.debtTotal)+' · เราติดเขา '+fmt(group.payable):'รวม '+fmt(group.total)}</span></div><div>${group.accounts.map(settingsAccountRow).join('')}</div></section>`).join('')}
const initial=()=>({budget:0,accounts:[],entries:[]});
let state=initial(),type='expense',account='cash',manualCategory=false,editing=null,detailAccount=null,returnToAccount=null;
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.accounts)&&Array.isArray(s.entries)&&Number.isFinite(s.budget))state=s}catch{}
state=Money.migrate(state);
account=Money.wallets(state)[0]?.id;
let timer;function toast(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('toast').style.display='none',3200)}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{toast('บันทึกในเครื่องไม่ได้ กรุณาส่งออกข้อมูลก่อนปิด');return false}}
function options(selected,entryType=type){return Money.categories(state,entryType).map(c=>`<option ${c===selected?'selected':''}>${esc(c)}</option>`).join('')}
$('category').innerHTML=options('รอจัดหมวด');$('today').textContent=new Intl.DateTimeFormat('th-TH',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
function row(e,context=null){
 const acc=state.accounts.find(a=>a.id===e.account),to=state.accounts.find(a=>a.id===e.toAccount);
 const transfer=e.type==='transfer',plus=transfer?e.toAccount===context:e.type==='income'||e.type==='repay'||(e.type==='adjustment'&&e.direction==='increase');
 const route=transfer?esc(acc?.name||'ไม่พบบัญชี')+' ไป '+esc(to?.name||'ไม่พบบัญชี'):esc(acc.name)+' · '+esc(e.category);
 const sign=transfer&&!context?'':plus?'+':'−';
 return `<button type="button" class="entry" data-edit="${esc(e.id)}" aria-label="แก้ไข ${esc(e.note)}"><span class="entry-icon ${transfer?'transfer-icon':plus?'incoming':e.category==='รอจัดหมวด'?'pending':''}" aria-hidden="true">${icon(transfer?'transfer':plus?'down':'up')}</span><span class="entry-info"><span class="entry-title">${esc(e.note)}</span><span class="entry-meta">${route}${e.subcategory?' · '+esc(e.subcategory):''}${e.extraNote?' · '+esc(e.extraNote):''} · ${labels[e.type]} · ${new Date(e.date).toLocaleDateString('th-TH',{day:'numeric',month:'short'})}</span></span><span class="entry-amount ${transfer&&!context?'transfer-amount':plus?'plus':''}">${sign}${fmt(e.amount)}</span></button>`;
}
function render(){
 $('borrowerTrash').innerHTML=state.accounts.filter(a=>a.kind==='borrower'&&a.deleted).map(a=>`<div class="category-manager-row"><span>${esc(a.name)} · ${fmt(Money.balance(state,a.id))}</span><button type="button" class="text-button" data-restore-borrower="${esc(a.id)}">นำกลับ</button></div>`).join('')||'<p class="empty">ไม่มีบัญชีในถังขยะ</p>';
 $('category').innerHTML=options($('category').value);
 if(!Money.wallets(state).some(a=>a.id===account))account=Money.wallets(state)[0]?.id;
 $('categorySummary').textContent=$('category').value;
 $('total').textContent=fmt(Money.total(state));$('reserved').textContent=fmt(state.budget);$('fuel').textContent=fmt(state.budget);$('available').textContent=fmt(Money.total(state)-state.budget);$('debt').textContent=fmt(Money.debt(state));$('owed').textContent=fmt(Money.owed(state));
 $('homeAccountCount').textContent=state.accounts.filter(a=>!a.deleted).length;
 $('accountCount').textContent=`${Money.activeAccounts(state).length} บัญชีใช้งาน${state.accounts.some(a=>a.archived)?' · '+state.accounts.filter(a=>a.archived).length+' บัญชีซ่อนไว้':''}`;
 $('settingsTotal').textContent=fmt(Money.total(state));
 $('accounts').innerHTML=state.accounts.filter(a=>!a.deleted).map(a=>`<button type="button" class="account-tile" data-account-detail="${esc(a.id)}"><span class="account-icon" aria-hidden="true">${accountIcon(a)}</span><span class="account-name"><span>${esc(a.name)}${a.kind==='borrower'?'<small>'+borrowerLabel(a)+'</small>':a.archived?'<small>ซ่อนไว้ · รวมในยอดเงิน</small>':''}</span><b>${fmt(Money.balance(state,a.id))}</b></span><span class="tile-arrow" aria-hidden="true">${icon('chevron-right')}</span></button>`).join('')||'<div class="empty-state"><span class="empty-symbol">'+icon('wallet')+'</span><div><strong>เริ่มต้นที่บัญชีของคุณ</strong><p>เพิ่มเงินสดหรือบัญชีธนาคาร แล้วเริ่มจดรายการแรก</p></div><button type="button" class="outline" data-go="settings">ตั้งค่าบัญชี '+icon('arrow')+'</button></div>';
 $('accountChips').innerHTML=Money.wallets(state).map(a=>`<button type="button" data-account="${esc(a.id)}" aria-pressed="${a.id===account}" class="${a.id===account?'selected':''}">${esc(a.name)}</button>`).join('')||'<p class="empty-hint">ยังไม่มีบัญชี เลือก “จัดการบัญชี” เพื่อเริ่มต้น</p>';
 const entries=[...state.entries].reverse();$('recent').innerHTML=entries.slice(0,4).map(e=>row(e)).join('')||emptyBlock('list','ยังไม่มีรายการ','เมื่อจดแล้ว รายการล่าสุดจะแสดงที่นี่');renderHistory();
 const grouped={};state.entries.filter(e=>e.type==='expense'&&Date.now()-new Date(e.date).getTime()<7*86400000).forEach(e=>grouped[e.category]=(grouped[e.category]||0)+e.amount);const sum=Object.values(grouped).reduce((a,b)=>a+b,0);
 $('spending').innerHTML=Object.entries(grouped).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`<div class="bar-row"><span>${esc(c)}</span><div class="bar-track"><div class="bar-fill" style="width:${n/sum*100}%"></div></div><b>${fmt(n)}</b></div>`).join('')||emptyBlock('chart-no-axes-combined','ยังไม่มีรายจ่ายใน 7 วันนี้','หมวดและสัดส่วนการใช้จ่ายจะแสดงเมื่อมีรายการ');
 $('settingsList').innerHTML=renderAccountGroups()+`<details class="settings-item budget-item"><summary><span class="settings-list-icon budget-icon" aria-hidden="true"><svg class="icon" aria-hidden="true"><use href="#i-shield"/></svg></span><span class="settings-list-copy"><b>งบที่กันไว้</b><small>ค่าน้ำมันคงเหลือ</small></span><span class="settings-list-value">${fmt(state.budget)}<small>แก้ไขงบ ${icon('chevron-down')}</small></span></summary><div class="settings-item-detail"><label for="budget">ค่าน้ำมันที่ต้องกันไว้ตอนนี้ (บาท)</label><input id="budget" type="number" min="0" step="0.01" value="${state.budget}" required><p>เมื่อจ่ายค่าน้ำมัน ให้ลดงบคงเหลือที่นี่ด้วย ไม่มีการรีเซ็ตอัตโนมัติ</p><button type="submit" class="save">บันทึกงบ ${icon('check')}</button></div></details>`;
}
function renderHistory(){const q=$('search').value.trim().toLowerCase();$('allEntries').innerHTML=[...state.entries].reverse().filter(e=>(e.note+' '+e.category+' '+state.accounts.find(a=>a.id===e.account)?.name+' '+(state.accounts.find(a=>a.id===e.toAccount)?.name||'')).toLowerCase().includes(q)).map(e=>row(e)).join('')||emptyBlock('search',q?'ไม่พบรายการที่ค้นหา':'ยังไม่มีรายการ',q?'ลองค้นด้วยชื่อรายการ หมวด หรือบัญชีอื่น':'จดรายการใหม่ หรือนำเข้าประวัติจาก Excel')}
function tab(name){if($('quickDialog').open)$('quickDialog').close();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('hidden',v.id!==name));document.querySelectorAll('.nav').forEach(v=>{const active=v.dataset.tab===name;v.classList.toggle('active',active);if(active)v.setAttribute('aria-current','page');else v.removeAttribute('aria-current')});$('pageTitle').textContent={home:'วันนี้ ใช้ได้อีกเท่าไหร่',history:'รายการทั้งหมด',settings:'บัญชีและงบของคุณ'}[name];$('pageEyebrow').textContent={home:'ภาพรวมการเงิน',history:'ประวัติการเงิน',settings:'จัดการเงินของคุณ'}[name];window.scrollTo({top:0,behavior:'smooth'});updateCaptureButton()}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-tab],[data-go]');if(nav)tab(nav.dataset.tab||nav.dataset.go);
 const addAccount=e.target.closest('[data-add-account]');if(addAccount){$('addAccountForm').reset();$('newAccountOpening').value=0;updateNewAccountKind();$('addAccountDialog').showModal();}
 const accountDetail=e.target.closest('[data-account-detail]');if(accountDetail)openAccountDetail(accountDetail.dataset.accountDetail);
 const chip=e.target.closest('[data-account]');if(chip){account=chip.dataset.account;render()}
 const typ=e.target.closest('[data-type]');if(typ){type=typ.dataset.type;document.querySelectorAll('[data-type]').forEach(b=>{b.classList.toggle('selected',b===typ);b.setAttribute('aria-pressed',String(b===typ))});if(type==='transfer')openTransfer();else{manualCategory=false;$('category').innerHTML=options('รอจัดหมวด');suggest();}}
 const ex=e.target.closest('[data-example]');if(ex){$('quick').value=ex.dataset.example;manualCategory=false;suggest();$('quick').focus()}
 const remove=e.target.closest('[data-remove-account]');if(remove)removeAccount(remove.dataset.removeAccount);
 const restore=e.target.closest('[data-restore-account]');if(restore){if(!saveSettings())return;state.accounts.find(a=>a.id===restore.dataset.restoreAccount).archived=false;persist();render();toast('นำบัญชีกลับมาใช้แล้ว')}
 const ed=e.target.closest('[data-edit]');if(ed){returnToAccount=$('accountDialog').open?detailAccount:null;if($('accountDialog').open)$('accountDialog').close();openEdit(ed.dataset.edit)}
});
function suggest(){const parsed=Money.parse($('quick').value);if(!manualCategory){$('category').value=parsed?Money.suggestCategory(state,parsed.note,type):'รอจัดหมวด';$('suggestion').textContent=$('category').value==='รอจัดหมวด'?'ยังไม่แน่ใจ เก็บไว้จัดทีหลังได้':'เสนอจากคำในรายการ · เปลี่ยนได้'}$('categorySummary').textContent=$('category').value;}
$('quick').addEventListener('input',()=>{manualCategory=false;suggest();$('formError').textContent=''});$('category').addEventListener('change',()=>{manualCategory=true;$('suggestion').textContent='คุณเลือกหมวดนี้เอง';$('categorySummary').textContent=$('category').value});
$('entryForm').addEventListener('submit',e=>{e.preventDefault();if(type==='transfer'){openTransfer();return}const p=Money.parse($('quick').value);if(!Money.wallets(state).some(a=>a.id===account)){$('formError').textContent='เพิ่มหรือเลือกบัญชีก่อนบันทึก';return}if(!p){$('formError').textContent='ใส่ชื่อรายการกับยอดเงิน เช่น ข้าว 50';return}state.entries.push({id:crypto.randomUUID(),...p,account,type,category:$('category').value,date:new Date().toISOString()});const saved=persist();render();$('quick').value='';manualCategory=false;suggest();if($('quickDialog').open)$('quickDialog').close();if(saved)toast('บันทึกแล้ว · '+p.note+' '+fmt(p.amount));});
$('search').addEventListener('input',renderHistory);
function saveSettings(){
 const b=Number($('budget').value);if(!Number.isFinite(b)||b<0||!$('settingsForm').reportValidity())return false;
 state.budget=b;return true;
}
$('settingsForm').addEventListener('submit',e=>{e.preventDefault();if(!saveSettings())return;const saved=persist();render();if(saved)toast('บันทึกงบแล้ว')});
$('closeAddAccount').onclick=()=>$('addAccountDialog').close();
$('addAccountForm').addEventListener('submit',e=>{e.preventDefault();const name=$('newAccountName').value.trim(),opening=Number($('newAccountOpening').value),kind=$('newAccountKind').value;if(!name||!Number.isFinite(opening)||!saveSettings())return;const a={id:crypto.randomUUID(),name,opening,kind,group:$('newAccountGroup').value};state.accounts.push(a);if(kind!=='borrower')account=a.id;const saved=persist();render();$('addAccountDialog').close();$('addAccountForm').reset();if(saved)toast('เพิ่มบัญชี '+name+' แล้ว')});
function removeAccount(id){
 if(state.accounts.find(a=>a.id===id)?.kind!=='borrower'&&Money.wallets(state).length<=1){toast('ต้องมีบัญชีใช้งานอย่างน้อยหนึ่งบัญชี');return}
 const a=state.accounts.find(a=>a.id===id);const hasHistory=state.entries.some(e=>e.account===id||e.toAccount===id);
 if(!confirm(hasHistory?'บัญชีนี้มีประวัติ จะซ่อนจากปุ่มจดใหม่ โดยเก็บประวัติและยอดเงินไว้ ต้องการซ่อนหรือไม่?':'ลบได้เมื่อยอดเป็นศูนย์ หากยังมีเงินจะซ่อนบัญชีและเก็บยอดไว้ ดำเนินการต่อหรือไม่?'))return;
 if(!saveSettings())return;const result=Money.removeAccount(state,id);const saved=persist();render();if(saved)toast(result==='deleted'?'ลบบัญชีแล้ว':'ซ่อนบัญชีแล้ว · นำกลับมาใช้ได้ในหน้านี้');
}
function openAccountDetail(id){
 const a=state.accounts.find(x=>x.id===id);if(!a)return;detailAccount=id;const entries=[...state.entries].filter(e=>e.account===id||e.toAccount===id).reverse();
 $('accountDetailTitle').textContent=a.name;$('accountDetailSummary').innerHTML=`<span>${a.kind==='borrower'?borrowerLabel(a):'ยอดปัจจุบัน'}</span><b>${fmt(Money.balance(state,id))}</b><small>${a.archived?'บัญชีนี้ถูกซ่อนไว้จากการจดรายการใหม่':'รวม '+entries.length+' รายการในบัญชีนี้'}</small>`;$('accountDetailCount').textContent=`${entries.length} รายการ`;$('accountActivity').innerHTML=entries.map(e=>row(e,id)).join('')||'<p class="empty">ยังไม่มีรายการเงินเข้า–ออกในบัญชีนี้</p>';$('detailAccountName').value=a.name;$('detailAccountGroup').innerHTML=groupOptions(Money.accountGroup(a,state),a.kind);$('detailAccountGroup').disabled=false;$('deleteBorrowerAccount').classList.toggle('hidden',a.kind!=='borrower');$('detailRemoveAccount').classList.toggle('hidden',a.kind==='borrower');$('detailAccountOpening').value=a.opening;$('detailOpeningLabel').textContent=a.kind==='borrower'?'ยอดสุทธิตั้งต้น (+ เขาติดเรา / − เราติดเขา)':'ยอดตั้งต้น (บาท)';$('detailAccountOpening').removeAttribute('min');$('accountEditForm').classList.add('hidden');$('showAccountEdit').textContent=a.archived?'นำบัญชีกลับมาใช้':'แก้ไขบัญชี';$('detailRemoveAccount').textContent=a.archived?'นำบัญชีกลับมาใช้':'ลบ / ซ่อนบัญชี';if(!$('accountDialog').open)$('accountDialog').showModal();
}
$('closeAccountDetail').onclick=()=>$('accountDialog').close();
$('showAccountEdit').onclick=()=>{const a=state.accounts.find(x=>x.id===detailAccount);if(!a)return;if(a.archived){a.archived=false;persist();render();openAccountDetail(a.id);toast('นำบัญชีกลับมาใช้แล้ว');return}$('accountEditForm').classList.toggle('hidden');};
$('accountEditForm').addEventListener('submit',e=>{e.preventDefault();const a=state.accounts.find(x=>x.id===detailAccount),opening=Number($('detailAccountOpening').value),name=$('detailAccountName').value.trim();if(!a||!name||!Number.isFinite(opening))return;a.opening=opening;a.name=name;a.group=$('detailAccountGroup').value;const saved=persist();render();openAccountDetail(a.id);if(saved)toast('บันทึกบัญชีแล้ว')});
$('detailRemoveAccount').onclick=()=>{if(!detailAccount)return;$('accountDialog').close();removeAccount(detailAccount)};
function openEdit(id){editing=id;const e=state.entries.find(x=>x.id===id);$('editNote').value=e.note;$('editAmount').value=e.amount;$('editCategory').innerHTML=options(e.category,e.type==='adjustment'?(e.direction==='increase'?'income':'expense'):e.type);$('editAccount').innerHTML=accountOptions(e.type==='transfer'?state.accounts.filter(a=>(!a.archived&&!a.deleted)||a.id===e.account||a.id===e.toAccount):state.accounts.filter(a=>a.kind===(e.type==='adjustment'?'borrower':'wallet')&&((!a.archived&&!a.deleted)||a.id===e.account)),e.account);$('editTransferFields').classList.toggle('hidden',e.type!=='transfer');$('editCategoryFields').classList.toggle('hidden',e.type==='transfer');$('editToAccount').innerHTML=accountOptions(state.accounts.filter(a=>(!a.archived&&!a.deleted)||a.id===e.toAccount),e.toAccount);$('editError').textContent='';$('backToAccountDetail').classList.toggle('hidden',!returnToAccount);$('editDialog').showModal()}
$('closeEdit').onclick=()=>$('editDialog').close();
$('backToAccountDetail').onclick=()=>{const id=returnToAccount;$('editDialog').close();if(id)openAccountDetail(id)};
$('editForm').addEventListener('submit',ev=>{ev.preventDefault();const e=state.entries.find(x=>x.id===editing),n=Number($('editAmount').value);if(n<=0||!Number.isFinite(n)||!$('editNote').value.trim())return;const next={...e,note:$('editNote').value.trim(),amount:n,category:e.type==='transfer'?'โอน':$('editCategory').value,account:$('editAccount').value};if(e.type==='transfer')next.toAccount=$('editToAccount').value;const problem=e.type==='transfer'?Money.validateTransfer(state,next,e.id):'';if(problem){$('editError').textContent=problem;return}Object.assign(e,next);const saved=persist(),back=returnToAccount;render();$('editDialog').close();if(back)openAccountDetail(back);if(saved)toast('แก้ไขรายการแล้ว')});
$('deleteEntry').onclick=()=>{const next={...state,entries:state.entries.filter(e=>e.id!==editing)};if(!confirm('ลบรายการนี้และคืนยอดบัญชีทั้งต้นทางและปลายทางตามรายการ?'))return;state.entries=next.entries;persist();render();$('editDialog').close();if(returnToAccount)openAccountDetail(returnToAccount);toast('ลบรายการแล้ว')};
$('reset').onclick=()=>{if(!confirm('ล้างบัญชี รายการ และงบทั้งหมด แล้วเริ่มใหม่แบบว่างเปล่า?'))return;state=Money.migrate(initial());account=undefined;persist();render();toast('เริ่มใหม่แบบไม่มีข้อมูลแล้ว')};
$('export').onclick=()=>{const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';const rows=[['วันที่','รายการ','ประเภท','จำนวนเงิน','บัญชีต้นทาง','บัญชีปลายทาง','หมวด','ทิศทางปรับยอดผู้ยืม','หมวดย่อย','บันทึกเพิ่มเติม','แถวต้นฉบับ'],...state.entries.map(e=>[e.date,e.note,labels[e.type],e.amount,state.accounts.find(a=>a.id===e.account)?.name,state.accounts.find(a=>a.id===e.toAccount)?.name,e.category,e.direction||'',e.subcategory||'',e.extraNote||'',e.sourceRows?.join(' / ')||''])];const url=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='jot-money.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
function accountOptions(accounts,selected){return accounts.map(a=>`<option value="${esc(a.id)}" ${a.id===selected?'selected':''}>${esc(a.name)}${a.kind==='borrower'?' · ผู้ยืม':''}</option>`).join('')}
function updateNewAccountKind(){const chosen=$('newAccountKind').value==='borrower'?(Money.groups(state).some(g=>g.id==='debt')?'debt':'ungrouped'):$('newAccountGroup').value;$('newAccountGroup').innerHTML=groupOptions(chosen,$('newAccountKind').value);$('newAccountGroup').disabled=false;const borrower=$('newAccountKind').value==='borrower';$('newAccountOpeningLabel').textContent=borrower?'ยอดสุทธิตั้งต้น (+ เขาติดเรา / − เราติดเขา)':'ยอดตั้งต้น (บาท)';$('newAccountOpening').removeAttribute('min');}
$('newAccountKind').addEventListener('change',updateNewAccountKind);
function openTransfer(){const active=Money.activeAccounts(state);$('transferFrom').innerHTML=accountOptions(active,account);$('transferTo').innerHTML=accountOptions(active.filter(a=>a.id!==account));const p=Money.parse($('quick').value);$('transferNote').value=p?.note||'';$('transferAmount').value=p?.amount||'';$('transferError').textContent='';updateTransferHint();if(!$('transferDialog').open)$('transferDialog').showModal();}
function updateTransferHint(){const from=state.accounts.find(a=>a.id===$('transferFrom').value),to=state.accounts.find(a=>a.id===$('transferTo').value);$('transferHint').textContent=from?.kind==='borrower'?'รับคืน / ยืมจาก '+from.name+' · ยอดสุทธิก่อนโอน '+fmt(Money.balance(state,from.id)):to?.kind==='borrower'?'ให้ยืม / คืนเงินให้ '+to.name+' · ยอดสุทธิผู้ยืมจะเพิ่ม':'ย้ายเงินระหว่างบัญชีของคุณ · ยอดเงินรวมเท่าเดิม';}
$('transferFrom').addEventListener('change',()=>{const previous=$('transferTo').value;$('transferTo').innerHTML=accountOptions(Money.activeAccounts(state).filter(a=>a.id!==$('transferFrom').value),previous);updateTransferHint()});
$('transferTo').addEventListener('change',updateTransferHint);
$('closeTransfer').onclick=()=>$('transferDialog').close();
$('transferDialog').addEventListener('close',()=>{
 type='expense';
 manualCategory=false;$('category').innerHTML=options('รอจัดหมวด');suggest();
 document.querySelectorAll('[data-type]').forEach(button=>{
  const selected=button.dataset.type==='expense';
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
});
$('transferForm').addEventListener('submit',ev=>{ev.preventDefault();const from=$('transferFrom').value,to=$('transferTo').value,amount=Number($('transferAmount').value),note=$('transferNote').value.trim()||'โอนเงิน';const entry={id:crypto.randomUUID(),account:from,toAccount:to,type:'transfer',amount,note,category:'โอน',date:new Date().toISOString()};const problem=Money.validateTransfer(state,entry);if(problem){$('transferError').textContent=problem;return}state.entries.push(entry);const saved=persist();render();$('transferDialog').close();if($('quickDialog').open)$('quickDialog').close();$('quick').value='';manualCategory=false;suggest();if(saved)toast('บันทึกการโอนแล้ว')});
let groupEditing=null;
function renderGroupManager(){
 $('groupList').innerHTML=Money.groups(state).map(group=>`<div class="category-manager-row"><span>${esc(group.label)} <small>${state.accounts.filter(a=>!a.deleted&&Money.accountGroup(a,state)===group.id).length} บัญชี</small></span>${group.id==='ungrouped'?'<small>กลุ่มระบบ</small>':`<span class="import-actions"><button type="button" class="text-button" data-edit-group="${esc(group.id)}">แก้ชื่อ</button><button type="button" class="text-button danger-text" data-delete-group="${esc(group.id)}">ลบกลุ่ม</button></span>`}</div>`).join('');
}
function commitAccountState(next){try{localStorage.setItem(KEY,JSON.stringify(next));state=next;render();return true}catch{toast('บันทึกไม่ได้ ยังไม่เปลี่ยนข้อมูล กรุณาตรวจพื้นที่เก็บข้อมูล');return false}}
function resetGroupForm(){groupEditing=null;$('groupForm').reset();$('groupNameLabel').textContent='ชื่อกลุ่มใหม่';$('saveGroup').textContent='เพิ่มกลุ่ม';$('cancelGroupEdit').classList.add('hidden');$('groupError').textContent=''}
$('openGroupManager').onclick=()=>{resetGroupForm();renderGroupManager();$('groupDialog').showModal()};
$('closeGroups').onclick=()=>$('groupDialog').close();
$('cancelGroupEdit').onclick=resetGroupForm;
$('groupForm').addEventListener('submit',event=>{
 event.preventDefault();const next=JSON.parse(JSON.stringify(state)),problem=Money.saveGroup(next,$('groupName').value,groupEditing,crypto.randomUUID());
 if(problem){$('groupError').textContent=problem;return}
 if(commitAccountState(next)){renderGroupManager();resetGroupForm();toast('บันทึกกลุ่มบัญชีแล้ว')}
});
document.addEventListener('click',event=>{
 const edit=event.target.closest('[data-edit-group]');if(edit){const group=Money.groups(state).find(g=>g.id===edit.dataset.editGroup);if(!group)return;groupEditing=group.id;$('groupName').value=group.label;$('groupNameLabel').textContent='เปลี่ยนชื่อกลุ่ม';$('saveGroup').textContent='บันทึกชื่อกลุ่ม';$('cancelGroupEdit').classList.remove('hidden');$('groupError').textContent='';$('groupName').focus()}
 const remove=event.target.closest('[data-delete-group]');if(remove){const group=Money.groups(state).find(g=>g.id===remove.dataset.deleteGroup);if(!group||!confirm('ลบกลุ่ม “'+group.label+'”? บัญชีทั้งหมดในกลุ่มจะย้ายไป “ยังไม่จัดกลุ่ม” ไม่ลบบัญชี ยอดเงิน หรือประวัติ'))return;const next=JSON.parse(JSON.stringify(state));if(Money.removeGroup(next,group.id)&&commitAccountState(next)){resetGroupForm();renderGroupManager();toast('ลบกลุ่มแล้ว · บัญชีย้ายไปยังไม่จัดกลุ่ม')}}
 const restore=event.target.closest('[data-restore-borrower]');if(restore){const next=JSON.parse(JSON.stringify(state));if(Money.restoreBorrower(next,restore.dataset.restoreBorrower)&&commitAccountState(next))toast('นำบัญชีลูกหนี้กลับมาแล้ว')}
});
$('deleteBorrowerAccount').onclick=()=>{
 const a=state.accounts.find(a=>a.id===detailAccount&&a.kind==='borrower');if(!a)return;
 if(!confirm('ลบบัญชี “'+a.name+'” ไปถังขยะ? ยอดสุทธิ '+fmt(Money.balance(state,a.id))+' จะไม่รวมในยอดหนี้ที่ติดตาม ประวัติการโอนและยอดเงินบัญชีของคุณยังอยู่ และนำบัญชีกลับได้'))return;
 const next=JSON.parse(JSON.stringify(state));if(Money.deleteBorrower(next,a.id)&&commitAccountState(next)){$('accountDialog').close();toast('ลบบัญชีไปถังขยะแล้ว · ประวัติยังอยู่')}
};
let categoryEditing=null;
function renderCategoryManager(){
 $('categoryTitle').textContent=type==='income'?'จัดการหมวดรายรับ':'จัดการหมวดรายจ่าย';
 $('categoryList').innerHTML=Money.categories(state,type).map((name,index)=>`<div class="category-manager-row"><span>${esc(name)}</span>${name==='รอจัดหมวด'?'<small>หมวดระบบ</small>':`<button type="button" class="text-button" data-category-edit="${index}" aria-label="แก้ชื่อหมวด ${esc(name)}">แก้ชื่อ</button>`}</div>`).join('');
}
document.addEventListener('click',event=>{
 if(event.target.closest('[data-manage-categories]')){
  categoryEditing=null;$('categoryForm').reset();$('categoryNameLabel').textContent='ชื่อหมวดใหม่';$('saveCategory').textContent='เพิ่มหมวด';$('cancelCategoryEdit').classList.add('hidden');$('categoryError').textContent='';renderCategoryManager();$('categoryDialog').showModal();
 }
 const edit=event.target.closest('[data-category-edit]');
 if(edit){categoryEditing=Money.categories(state,type)[Number(edit.dataset.categoryEdit)];$('categoryName').value=categoryEditing;$('categoryNameLabel').textContent='เปลี่ยนชื่อหมวด';$('saveCategory').textContent='บันทึกชื่อหมวด';$('cancelCategoryEdit').classList.remove('hidden');$('categoryError').textContent='';$('categoryName').focus();}
});
$('closeCategories').onclick=()=>$('categoryDialog').close();
$('cancelCategoryEdit').onclick=()=>{categoryEditing=null;$('categoryForm').reset();$('categoryNameLabel').textContent='ชื่อหมวดใหม่';$('saveCategory').textContent='เพิ่มหมวด';$('cancelCategoryEdit').classList.add('hidden');$('categoryError').textContent='';};
$('categoryForm').addEventListener('submit',event=>{
 event.preventDefault();const previous=categoryEditing,name=$('categoryName').value.trim(),quickSelected=$('category').value,editSelected=$('editCategory').value;
 const problem=Money.saveCategory(state,name,previous,type);if(problem){$('categoryError').textContent=problem;return}
 $('category').innerHTML=options(quickSelected===previous?name:quickSelected);
 const editingEntry=state.entries.find(e=>e.id===editing);$('editCategory').innerHTML=options(editSelected===previous?name:editSelected,editingEntry?.type==='adjustment'?(editingEntry.direction==='increase'?'income':'expense'):editingEntry?.type||type);
 const saved=persist();render();renderCategoryManager();$('cancelCategoryEdit').click();if(saved)toast(previous?'เปลี่ยนชื่อหมวดแล้ว · รายการเดิมอัปเดตตาม':'เพิ่มหมวดแล้ว');
});
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
