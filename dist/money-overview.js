// A compact current balance above capture. Presentation only; no storage writes.
(() => {
 // Reuse the same interactive chart inside the balance card, never a data copy.
 $('moneyOverview').append($('balanceTrend'));
 $('balanceTrend').querySelector('.trend-help').prepend($('trendNotice'));
 let previousBalance=null,previewSignature='';
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const shortDate=key=>Number(key.slice(8))+'/'+Number(key.slice(5,7))+'/'+(Number(key.slice(0,4))+543);
 const measure=document.createElement('canvas').getContext('2d');
 function fitBalance(){
  if(!document.body.classList.contains('ui5-theme'))return;
  const element=$('moneyCurrent'),style=getComputedStyle(element),size=parseFloat(style.getPropertyValue('--money-size'))||38;
  if(!element.clientWidth||!measure)return;
  measure.font=style.fontWeight+' '+size+'px '+style.fontFamily;
  const width=measure.measureText(element.textContent).width;
  element.style.setProperty('--money-fit',Math.min(size,Math.max(16,size*(element.clientWidth-2)/Math.max(1,width))).toFixed(2)+'px');
 }
 function renderOverview(){
  const today=History.today(),model=BalanceTrend.build(state,{range:'week',anchor:today,today});
  const amount=model.currentBalance===null?'—':fmt(model.currentBalance);
  $('moneyCurrent').textContent=amount;
  fitBalance();
  if(previousBalance!==null&&previousBalance!==amount&&!reduced()&&!$('home').classList.contains('hidden'))
   $('moneyCurrent').animate?.([{transform:'translateY(3px)',opacity:.65},{transform:'translateY(0)',opacity:1}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'});
  previousBalance=amount;
  $('moneyChange').className='money-change';
  if(model.change!==null){
   const direction=model.change>0?'เพิ่ม ':model.change<0?'ลด ':'ไม่เปลี่ยนแปลง ';
   const percent=model.percent===null?'': ' · '+(model.percent>0?'+':model.percent<0?'−':'')+new Intl.NumberFormat('th-TH',{maximumFractionDigits:1}).format(Math.abs(model.percent))+'%';
   $('moneyChange').textContent=direction+fmt(Math.abs(model.change))+percent+' สัปดาห์นี้';
   $('moneyChange').classList.add(model.change<0?'negative':'positive');
   $('moneyChange').title='เทียบกับสิ้นวัน '+shortDate(model.baselineDate);
  }else{
   $('moneyChange').textContent=model.reason==='no-accounts'?'เพิ่มบัญชีเพื่อเริ่มจด':model.reason?'ตรวจข้อมูลวันที่และยอดในรายการ':'ยังไม่มีข้อมูลพอเทียบสัปดาห์นี้';
   $('moneyChange').removeAttribute('title');
  }
  const scope='ไม่รวมยอดลูกหนี้ / เจ้าหนี้'+(model.futureCount?' · ไม่รวม '+model.futureCount+' รายการล่วงหน้า':'');
  $('moneyScope').textContent=scope;
  // Keep the actual baseline available to touch and assistive technology users.
  const signature=JSON.stringify(model.points);
  if(signature!==previewSignature){
   previewSignature=signature;
   const points=model.points,values=points.map(p=>p.balance),min=Math.min(...values),max=Math.max(...values),span=max-min||1;
   const x=i=>points.length===1?50:4+i/(points.length-1)*92,y=v=>34-(v-min)/span*26;
   const path=points.map((p,i)=>(i?'L':'M')+x(i).toFixed(2)+' '+y(p.balance).toFixed(2)).join(' ');
   $('moneyPreview').innerHTML=points.length?`<svg viewBox="0 0 100 42" focusable="false" aria-hidden="true">${points.length>1?`<path pathLength="1" d="${path}"/>`:''}<circle cx="${x(points.length-1)}" cy="${y(points.at(-1).balance)}" r="2.5"/></svg>`:'';
  }
 }
 $('overviewQuick').onclick=()=>{
  if(document.body.classList.contains('ui5-theme')){openCapture();return}
  $('quickCard').scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'});
  $('quick').focus({preventScroll:true});
 };
 $('overviewGraph').onclick=()=>{
  $('balanceTrend').scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'});
  $('balanceTrend').focus({preventScroll:true});
  if(!reduced())$('balanceTrend').animate?.([{borderColor:'#7be3ed'},{borderColor:'#352d45'}],{duration:900,easing:'ease-out'});
 };
 document.addEventListener('ledger-rendered',renderOverview);
 let fitFrame;new ResizeObserver(()=>{cancelAnimationFrame(fitFrame);fitFrame=requestAnimationFrame(fitBalance)}).observe($('moneyCurrent'));
 document.fonts.ready.then(fitBalance);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderOverview()});
 renderOverview();
})();
