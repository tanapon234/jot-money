// Optional quickTemplates in the existing ledger. Old ledgers need no migration.
(() => {
 let editingTemplate=null,lastSaved=null;
 const locks=new Map();
 const templates=()=>Array.isArray(state.quickTemplates)?state.quickTemplates.filter(t=>t&&typeof t.id==='string'):[];
 const categoryFor=t=>{
  const renamed=state.categoryAliases?.[t.category]||t.category;
  return Money.categories(state,t.type).includes(renamed)?renamed:'รอจัดหมวด';
 };
 const activeAccount=t=>Money.wallets(state).find(a=>a.id===t.account);
 const valid=t=>(t.type==='income'||t.type==='expense')&&typeof t.note==='string'&&t.note.trim()&&t.note.length<=160&&Number.isFinite(t.amount)&&t.amount>0&&t.amount<=10000000&&Math.abs(t.amount*100-Math.round(t.amount*100))<0.000001;
 function commit(next){
  const previous=state;state=next;
  if(!persist()){state=previous;return false}
  render();return true;
 }
 function renderTemplates(){
  const items=templates();
  $('quickTemplates').innerHTML=items.length?items.map(t=>{
   const a=activeAccount(t),usable=a&&valid(t);
   return `<button type="button" class="quick-template ${t.type==='income'?'income':'expense'}" data-use-template="${esc(t.id)}" ${usable?'':'disabled'} aria-label="${esc('บันทึก'+(labels[t.type]||'รายการ')+' '+t.note+' '+fmt(t.amount)+(a?' จาก '+a.name:' บัญชีใช้งานไม่ได้'))}"><span class="template-copy"><b>${esc(t.note)}</b><small>${esc(a?a.name:'เลือกบัญชีใหม่ในตั้งค่า')} · ${esc(categoryFor(t))}</small></span><span class="template-value"><b>${t.type==='income'?'+':'−'}${fmt(t.amount)}</b><small>${labels[t.type]||'ตรวจรายการ'}</small></span></button>`;
  }).join(''):'<p class="template-empty">มีรายการที่จดซ้ำบ่อย? เพิ่มไว้ที่นี่ แล้วครั้งถัดไปแตะครั้งเดียว</p>';
  $('templateManager').innerHTML=items.map(t=>`<div class="template-manager-row"><span class="template-copy"><b>${esc(t.note)} · ${fmt(t.amount)}</b><small>${labels[t.type]||'ตรวจรายการ'} · ${esc(activeAccount(t)?.name||'บัญชีใช้งานไม่ได้')} · ${esc(categoryFor(t))}</small></span><button type="button" class="text-button" data-edit-template="${esc(t.id)}" aria-label="แก้ไขรายการประจำ ${esc(t.note)}">แก้ไข</button><button type="button" class="text-button" data-remove-template="${esc(t.id)}" aria-label="ลบรายการประจำ ${esc(t.note)}">${icon('trash-2')}</button></div>`).join('');
  const entry=lastSaved&&state.entries.find(e=>e.id===lastSaved.id);
  $('quickTemplateReceipt').innerHTML=entry?`<p>บันทึกแล้ว · ${esc(entry.note)} ${fmt(entry.amount)}</p><div><button type="button" class="text-button" id="editTemplateEntry">แก้ไขรายการนี้</button>${JSON.stringify(entry)===lastSaved.snapshot?'<button type="button" class="text-button" id="undoTemplateEntry">ยกเลิกรายการนี้</button>':''}</div>`:'';
  $('quickTemplateReceipt').classList.toggle('template-receipt',Boolean(entry));
 }
 function populateCategories(selected='รอจัดหมวด'){
  $('templateCategory').innerHTML=options(selected,$('templateType').value);
 }
 function openEditor(id=null){
  const item=templates().find(t=>t.id===id);editingTemplate=item?.id||null;
  tab('preferences');$('templateEditor').open=true;
  $('templateEditor').querySelector('summary').textContent=item?'แก้ไขรายการประจำ':'ตั้งรายการประจำใหม่';
  $('templateNote').value=item?.note||'';$('templateAmount').value=item?.amount||'';
  $('templateType').value=item?.type==='income'?'income':'expense';
  $('templateAccount').innerHTML='<option value="">เลือกบัญชี</option>'+Money.wallets(state).map(a=>`<option value="${esc(a.id)}">${esc(a.name)}</option>`).join('');
  $('templateAccount').value=item?(activeAccount(item)?.id||''):(account||'');
  populateCategories(item?categoryFor(item):'รอจัดหมวด');
  $('templateError').textContent=Money.wallets(state).length?'':'เพิ่มบัญชีที่หน้าบัญชีก่อนตั้งรายการประจำ';
  $('saveTemplate').textContent=item?'บันทึกการแก้ไข':'เก็บรายการประจำ';
  $('templateNote').focus();
 }
 $('templateType').addEventListener('change',()=>populateCategories());
 $('cancelTemplate').onclick=()=>{$('templateEditor').open=false;editingTemplate=null};
 $('templateForm').addEventListener('submit',event=>{
  event.preventDefault();
  const item={id:editingTemplate||crypto.randomUUID(),note:$('templateNote').value.trim(),amount:Number($('templateAmount').value),type:$('templateType').value,account:$('templateAccount').value,category:$('templateCategory').value};
  if(!valid(item)||!activeAccount(item)||!Money.categories(state,item.type).includes(item.category)){$('templateError').textContent='ใส่ชื่อ ยอดเงินไม่เกิน 10,000,000 บาท (ทศนิยมไม่เกิน 2 ตำแหน่ง) และเลือกบัญชีที่ใช้งานได้';return}
  const items=templates(),next={...state,quickTemplates:editingTemplate?items.map(t=>t.id===editingTemplate?item:t):items.concat(item)};
  if(commit(next)){$('templateEditor').open=false;editingTemplate=null;toast('เก็บรายการประจำแล้ว · แตะใช้ได้จากภาพรวม')}
 });
 document.addEventListener('click',event=>{
  const target=event.target.closest('button');if(!target)return;
  if(target.hasAttribute('data-new-template')){openEditor();return}
  if(target.hasAttribute('data-edit-template')){openEditor(target.dataset.editTemplate);return}
  if(target.hasAttribute('data-remove-template')){
   const item=templates().find(t=>t.id===target.dataset.removeTemplate);
   if(item&&confirm('ลบรายการประจำ “'+item.note+'”? รายการที่บันทึกไปแล้วจะยังอยู่'))if(commit({...state,quickTemplates:templates().filter(t=>t.id!==item.id)}))toast('ลบรายการประจำแล้ว');return;
  }
  if(target.hasAttribute('data-use-template')){
   const item=templates().find(t=>t.id===target.dataset.useTemplate);
   if(!item||!valid(item)||!activeAccount(item)){toast('รายการประจำนี้ใช้ไม่ได้ กรุณาแก้ไขในตั้งค่า');return}
   const now=Date.now();if(now-(locks.get(item.id)||0)<900)return;
   const entry={id:crypto.randomUUID(),type:item.type,note:item.note,amount:item.amount,account:item.account,category:categoryFor(item),date:History.moveDate(new Date().toISOString(),History.today())};
   const previous=lastSaved;lastSaved={id:entry.id,templateId:item.id,snapshot:JSON.stringify(entry)};
   if(commit({...state,entries:state.entries.concat(entry)})){
    locks.set(item.id,now);rememberCaptureAccount(item.account);
    [...document.querySelectorAll('[data-use-template]')].find(b=>b.dataset.useTemplate===item.id)?.focus({preventScroll:true});
   }else{lastSaved=previous;renderTemplates()}return;
  }
  if(target.id==='editTemplateEntry'&&lastSaved){returnToAccount=null;openEdit(lastSaved.id);return}
  if(target.id==='undoTemplateEntry'&&lastSaved){
   const entry=state.entries.find(e=>e.id===lastSaved.id);
   if(!entry||JSON.stringify(entry)!==lastSaved.snapshot){renderTemplates();return}
   if(commit({...state,entries:state.entries.filter(e=>e.id!==lastSaved.id)})){lastSaved=null;renderTemplates();toast('ยกเลิกรายการที่เพิ่งบันทึกแล้ว')}
  }
 });
 document.addEventListener('ledger-rendered',renderTemplates);
 renderTemplates();
})();
