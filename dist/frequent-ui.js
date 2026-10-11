(() => {
 let selected=null,receipt=null;const locks=new Map();
 const wallet=id=>Money.wallets(state).find(a=>a.id===id);
 const restore=document.createElement('button');restore.type='button';restore.className='text-button hidden';restore.id='restoreFrequent';restore.textContent='แสดงคำแนะนำจดบ่อยที่ซ่อนไว้อีกครั้ง';$('templateManager').after(restore);
 function commit(next){const previous=state;state=next;if(!persist()){state=previous;return false}render();return true}
 function renderFrequent(){
  const items=FrequentEntries.suggest(state);
  $('frequentSection').classList.toggle('hidden',!items.length);
  $('frequentList').innerHTML=items.map(t=>`<div class="frequent-row ${t.type}"><button type="button" class="quick-template" data-frequent="${esc(t.id)}" aria-haspopup="dialog" aria-controls="frequentDialog"><span class="template-copy"><b>${esc(t.note)}</b><small>${esc(wallet(t.account)?.name||'')} · ${esc(t.category)} · จดแล้ว ${t.count} ครั้ง</small></span><span class="template-value"><b>${t.type==='income'?'+':'−'}${fmt(t.amount)}</b><small>${labels[t.type]}${t.variable?' · ยอดแก้ได้':''}</small></span></button><button type="button" class="icon-button" data-hide-frequent="${esc(t.id)}" aria-label="${esc('ซ่อนคำแนะนำ '+t.note)}">${icon('x')}</button></div>`).join('');
  restore.classList.toggle('hidden',!state.frequentDismissed?.length);
  const entry=receipt&&state.entries.find(e=>e.id===receipt.id);
  $('frequentReceipt').classList.toggle('template-receipt',Boolean(entry));
  $('frequentReceipt').innerHTML=entry?`<p>บันทึกแล้ว · ${esc(entry.note)} ${fmt(entry.amount)}</p><button type="button" class="text-button" id="editFrequentEntry">แก้ไขรายการนี้</button>${JSON.stringify(entry)===receipt.snapshot?'<button type="button" class="text-button" id="undoFrequentEntry">ยกเลิกรายการนี้</button>':''}`:'';
 }
 function open(id){
  selected=FrequentEntries.suggest(state).find(t=>t.id===id);if(!selected)return;
  $('frequentDialogTitle').textContent=selected.note;
  $('frequentDescription').textContent=labels[selected.type]+' · บันทึกวันที่ '+History.dateLabel(History.today(),new Date(),true)+' · ตรวจยอดและบัญชีก่อนบันทึก';
  $('frequentAmount').value=selected.amount;
  $('frequentAccount').innerHTML=Money.wallets(state).map(a=>`<option value="${esc(a.id)}">${esc(a.name)}</option>`).join('');$('frequentAccount').value=selected.account;
  $('frequentCategory').innerHTML=options(selected.category,selected.type);$('frequentError').textContent='';$('frequentDialog').showModal();
 }
 $('closeFrequent').onclick=()=>$('frequentDialog').close();
 $('frequentDialog').addEventListener('close',()=>{selected=null});
 $('frequentForm').addEventListener('submit',event=>{
  event.preventDefault();if(!selected)return;
  const amount=Number($('frequentAmount').value),account=$('frequentAccount').value,category=$('frequentCategory').value;
  if(!Number.isFinite(amount)||amount<=0||amount>10000000||Math.abs(amount*100-Math.round(amount*100))>0.000001||!wallet(account)||!Money.categories(state,selected.type).includes(category)){$('frequentError').textContent='ตรวจจำนวนเงิน (ทศนิยมไม่เกิน 2 ตำแหน่ง) บัญชี และหมวดอีกครั้ง';return}
  if(Date.now()-(locks.get(selected.id)||0)<900)return;
  const entry={id:crypto.randomUUID(),type:selected.type,note:selected.note,amount,account,category,date:History.moveDate(new Date().toISOString(),History.today()),...(category!==selected.category?{categoryChoice:'user',categoryChoiceAt:new Date().toISOString()}:{})};
  const previous=receipt;receipt={id:entry.id,snapshot:JSON.stringify(entry)};
  if(commit({...state,entries:state.entries.concat(entry)})){locks.set(selected.id,Date.now());rememberCaptureAccount(account);$('frequentDialog').close();toast('บันทึกแล้ว · '+entry.note+' '+fmt(amount))}
  else {receipt=previous;$('frequentError').textContent='บันทึกไม่สำเร็จ ตรวจพื้นที่เก็บข้อมูลแล้วลองอีกครั้ง';renderFrequent()}
 });
 restore.onclick=()=>{if(commit({...state,frequentDismissed:[]}))toast('แสดงคำแนะนำจดบ่อยอีกครั้งแล้ว')};
 document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-frequent')){open(b.dataset.frequent);return}
  if(b.hasAttribute('data-hide-frequent')){if(commit({...state,frequentDismissed:[...new Set([...(state.frequentDismissed||[]),b.dataset.hideFrequent])]}))toast('ซ่อนแล้ว · แสดงอีกครั้งได้ในตั้งค่า');return}
  if(b.id==='editFrequentEntry'&&receipt){returnToAccount=null;openEdit(receipt.id);return}
  if(b.id==='undoFrequentEntry'&&receipt){const e=state.entries.find(e=>e.id===receipt.id);if(!e||JSON.stringify(e)!==receipt.snapshot)return;if(commit({...state,entries:state.entries.filter(e=>e.id!==receipt.id)})){receipt=null;renderFrequent();toast('ยกเลิกรายการที่เพิ่งบันทึกแล้ว')}}
 });
 document.addEventListener('ledger-rendered',renderFrequent);document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderFrequent()});renderFrequent();
})();
