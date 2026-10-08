(() => {
 const BACKUP=KEY+'-before-import';
 let source=null,plan=null,filename='',reading=0;
 const mappings=()=>({
  accounts:Object.fromEntries(source.accounts.map((raw,index)=>[raw,{target:$('importTarget'+index).value,name:$('importName'+index).value,kind:$('importKind'+index).value}])),
  categories:Object.fromEntries(source.categories.map((raw,index)=>[raw,$('importCat'+index).value]))
 });
 function updateUndo(){try{$('undoImport').classList.toggle('hidden',!localStorage.getItem(BACKUP))}catch{$('undoImport').classList.add('hidden')}}
 function review(){
  plan=null;$('commitImport').disabled=true;$('importError').textContent='';
  if(!source)return;
  if(source.errors.length){$('importError').textContent=source.errors.join('\n');return}
  if(!$('importMode').value){$('importPlanSummary').textContent='เลือกวิธีนำเข้า แล้วตรวจยอดบัญชีก่อนยืนยัน';return}
  try{
   plan=ExcelImport.plan(state,source,mappings(),$('importMode').value,Money,()=>crypto.randomUUID());
   const adjustmentCount=plan.added.filter(e=>e.type==='adjustment').length;
   $('importPlanSummary').textContent=`นำเข้า ${plan.added.length} รายการ · ข้ามรายการที่เคยนำเข้าแล้ว ${plan.skipped.length} รายการ · ปรับยอดบัญชีผู้ยืม ${adjustmentCount} รายการ\nเงินสดรวม ${fmt(Money.total(state))} → ${fmt(Money.total(plan.next))} · คนอื่นติดหนี้เรา ${fmt(Money.debt(plan.next))} · เราติดหนี้คนอื่น ${fmt(Money.owed(plan.next))} · งบที่กันไว้ ${fmt(plan.next.budget)} (คงเดิม)`;
   $('importBalances').innerHTML=plan.next.accounts.map(a=>`<div class="category-manager-row"><span>${esc(a.name)}<small>${a.kind==='borrower'?(Money.balance(plan.next,a.id)<0?' · เราติดหนี้เขา':' · เขาติดหนี้เรา'):' · บัญชีของเรา'}</small></span><b>${fmt(Money.balance(plan.next,a.id))}</b></div>`).join('');
   $('importRows').innerHTML=plan.added.map(e=>{
    const from=plan.next.accounts.find(a=>a.id===e.account),to=plan.next.accounts.find(a=>a.id===e.toAccount);
    return `<tr><td>${e.sourceRows.join(', ')}</td><td>${new Date(e.date).toLocaleString('th-TH',{timeZone:'Asia/Bangkok'})}</td><td>${esc(e.note)}<small>${esc(from.name)}${to?' → '+esc(to.name):''}${e.subcategory?' · หมวดย่อย '+esc(e.subcategory):''}${e.extraNote?' · '+esc(e.extraNote):''}</small></td><td>${e.type==='adjustment'?(e.direction==='increase'?'เพิ่มยอดสุทธิผู้ยืม':'ลดยอดสุทธิผู้ยืม'):labels[e.type]}<small>${esc(e.category)}</small></td><td>${fmt(e.amount)}</td></tr>`;
   }).join('');
   $('commitImport').disabled=!$('importConsent').checked||!plan.added.length;
  }catch(error){plan=null;$('importError').textContent=error.message;$('importPlanSummary').textContent='ยังนำเข้าไม่ได้ กรุณาตรวจการจับคู่';$('importBalances').innerHTML='';$('importRows').innerHTML=''}
 }
 function buildMappings(){
  $('importCategoryNames').innerHTML=Money.categories(state).map(name=>`<option value="${esc(name)}"></option>`).join('');
  $('importCategories').innerHTML=source.categories.map((raw,index)=>`<div class="import-map"><label for="importCat${index}">${esc(raw)}</label><input id="importCat${index}" list="importCategoryNames" maxlength="40" value="${esc(ExcelImport.defaultCategory(raw,state,Money))}" required></div>`).join('');
  $('importAccounts').innerHTML=source.accounts.map((raw,index)=>{
   const existing=ExcelImport.defaultAccount(raw,state),kind=['เฟินยืม','โมยืม'].includes(raw)?'borrower':existing?.kind||'wallet';
   return `<fieldset class="import-account-map"><legend>${esc(raw)}</legend><label for="importTarget${index}" class="sr-only">จับคู่บัญชี ${esc(raw)}</label><select id="importTarget${index}"><option value="">สร้างบัญชีใหม่</option>${state.accounts.filter(a=>!a.deleted).map(a=>`<option value="${esc(a.id)}" ${existing?.id===a.id?'selected':''}>${esc(a.name)}</option>`).join('')}</select><label for="importName${index}" class="sr-only">ชื่อบัญชีปลายทาง ${esc(raw)}</label><input id="importName${index}" maxlength="40" value="${esc(existing?.name||raw)}" ${existing?'disabled':''}><label for="importKind${index}" class="sr-only">ประเภทบัญชี ${esc(raw)}</label><select id="importKind${index}"><option value="wallet" ${kind==='wallet'?'selected':''}>บัญชีของฉัน</option><option value="borrower" ${kind==='borrower'?'selected':''}>บัญชีผู้ยืม (+/−)</option></select></fieldset>`;
  }).join('');
  source.accounts.forEach((raw,index)=>$('importTarget'+index).addEventListener('change',()=>{
   const existing=state.accounts.find(a=>a.id===$('importTarget'+index).value);$('importName'+index).disabled=!!existing;
   $('importName'+index).value=existing?.name||raw;if(existing)$('importKind'+index).value=existing.kind;
  }));
 }
 $('openImport').onclick=()=>{source=null;plan=null;reading++;$('importFile').value='';$('importMode').value='';$('importConsent').checked=false;$('importReview').classList.add('hidden');$('importError').textContent='';$('importDialog').showModal()};
 $('closeImport').onclick=()=>$('importDialog').close();
 $('importDialog').addEventListener('close',()=>{reading++});
 $('importFile').addEventListener('change',async()=>{
  const file=$('importFile').files[0],token=++reading;source=null;plan=null;$('importReview').classList.add('hidden');$('importError').textContent='';$('importConsent').checked=false;
  if(!file)return;
  if(!/\.xlsx$/i.test(file.name)||file.size>5*1024*1024){$('importError').textContent='เลือกไฟล์ .xlsx ขนาดไม่เกิน 5 MB';return}
  try{
   const buffer=await file.arrayBuffer();if(token!==reading)return;
   source=ExcelImport.read(buffer,XLSX);filename=file.name;
   if(source.errors.length){$('importError').textContent=source.errors.join('\n');source=null;return}
   buildMappings();$('importFileSummary').textContent=`${filename} · ${source.rows} แถว → ${source.entries.length} รายการ · รวมคู่โอน ${source.pairs} คู่ · ${source.accounts.length} บัญชี\nวันที่จากไฟล์ใช้เวลาประเทศไทย ไม่มีการนำเข้าอัตโนมัติ`;
   $('importReview').classList.remove('hidden');review();
  }catch(error){$('importError').textContent='อ่านไฟล์ไม่ได้: '+error.message}
 });
 $('importReview').addEventListener('change',event=>{if(event.target.id!=='importConsent')$('importConsent').checked=false;review()});
 $('importReview').addEventListener('input',event=>{if(event.target.tagName==='INPUT'&&event.target.type!=='checkbox'){plan=null;$('importConsent').checked=false;$('commitImport').disabled=true}});
 $('commitImport').onclick=()=>{
  review();if(!plan||!$('importConsent').checked||$('commitImport').disabled)return;
  try{
   localStorage.setItem(BACKUP,JSON.stringify({state,filename,at:new Date().toISOString()}));
   localStorage.setItem(KEY,JSON.stringify(plan.next));
  }catch{ $('importError').textContent='พื้นที่เก็บข้อมูลไม่พอหรือเบราว์เซอร์ไม่อนุญาต ยังไม่เปลี่ยนข้อมูลในแอป';return }
  const count=plan.added.length;state=plan.next;account=Money.wallets(state)[0]?.id;render();updateUndo();$('importDialog').close();toast('นำเข้าแล้ว '+count+' รายการ');
 };
 $('undoImport').onclick=()=>{
  try{
   const backup=JSON.parse(localStorage.getItem(BACKUP));if(!backup?.state)return;
   if(!confirm('คืนบัญชีและรายการทั้งหมดเป็นข้อมูลก่อนนำเข้าครั้งล่าสุด รายการที่เพิ่มหลังจากนั้นจะไม่อยู่ในชุดที่คืน งบจะกลับเป็นค่าก่อนนำเข้า ยืนยันหรือไม่?'))return;
   const restored=Money.migrate(backup.state);localStorage.setItem(KEY,JSON.stringify(restored));state=restored;account=Money.wallets(state)[0]?.id;render();toast('คืนข้อมูลก่อนนำเข้าแล้ว');
  }catch{toast('คืนข้อมูลไม่ได้ กรุณาตรวจพื้นที่เก็บข้อมูลของเบราว์เซอร์')}
 };
 updateUndo();
})();
