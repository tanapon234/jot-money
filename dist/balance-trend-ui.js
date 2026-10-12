// One derived timeline, no saved copies of daily balances.
(() => {
 let range='week',anchor=History.today(),today=anchor,model=null,index=0,selectedDate=null;
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let renderedPeriod=null,motionFrame=0;
 let renderedGeometry=null,displayedGeometry=null,transitionSource=null,periodChanged=false;
 // Keep comparison copy below the controls so its wrapping cannot move the plot.
 if(document.body.classList.contains('ui6-theme'))$('trendSelection').after($('trendChange'));
 function finishPlotTransition(){
  cancelAnimationFrame(motionFrame);motionFrame=0;
  const plot=$('trendPlot');plot.querySelector('.trend-morph')?.remove();
  plot.querySelectorAll('[data-motion-hidden]').forEach(node=>{node.style.visibility='';node.removeAttribute('data-motion-hidden')});
  for(const node of plot.querySelectorAll('#trendDot,#trendDotHalo,.trend-tooltip'))node.style.transition='';
  delete plot.dataset.motion;displayedGeometry=null;
  if(renderedGeometry?.selected)positionSelection(renderedGeometry.selected);
 }
 // Sampling is presentation geometry only: never interpolate ledger values or dates.
 function sampleShape(knots,positions){
  let segment=0;
  return positions.map(t=>{
   while(segment<knots.length-2&&knots[segment+1].t<t)segment++;
   const a=knots[segment],b=knots[segment+1],fraction=(t-a.t)/(b.t-a.t);
   return {t,x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction};
  });
 }
 function animatePlot(){
  const source=transitionSource,target=renderedGeometry;
  if(!periodChanged||reducedMotion.matches||!source||!target)return;
  // Union knots preserve every corner of both silhouettes, including an interrupted one.
  const positions=[...new Set([...source.knots,...target.knots].map(point=>point.t))].sort((a,b)=>a-b);
  const from=sampleShape(source.knots,positions),to=sampleShape(target.knots,positions);
  if(Math.abs(source.bottom-target.bottom)<.01&&from.every((point,i)=>Math.abs(point.x-to[i].x)<.01&&Math.abs(point.y-to[i].y)<.01))return;
  const plot=$('trendPlot'),svg=plot.querySelector(':scope > svg'),ns='http://www.w3.org/2000/svg';
  const group=document.createElementNS(ns,'g'),area=document.createElementNS(ns,'path'),line=document.createElementNS(ns,'path');
  group.classList.add('trend-morph');group.setAttribute('aria-hidden','true');group.style.pointerEvents='none';
  area.classList.add('trend-area');area.setAttribute('fill','url(#trendAreaFill)');line.classList.add('trend-line');
  group.append(area,line);
  for(const node of svg.querySelectorAll(':scope > .trend-area,:scope > .trend-line')){node.style.visibility='hidden';node.dataset.motionHidden=''}
  svg.insertBefore(group,$('trendCrosshair'));
  for(const node of plot.querySelectorAll('#trendDot,#trendDotHalo,.trend-tooltip'))node.style.transition='none';
  const tooltip=plot.querySelector('.trend-tooltip');
  const layout={width:plot.clientWidth,height:svg.getBoundingClientRect().height,half:tooltip.offsetWidth/2,tooltipHeight:tooltip.offsetHeight};
  plot.dataset.motion='morph';
  let start=null;
  const frame=timestamp=>{
   if(start===null)start=timestamp;
   const progress=Math.min(1,(timestamp-start)/420),eased=1-Math.pow(1-progress,3);
   const knots=from.map((point,i)=>({t:point.t,x:point.x+(to[i].x-point.x)*eased,y:point.y+(to[i].y-point.y)*eased}));
   const bottom=source.bottom+(target.bottom-source.bottom)*eased;
   const path=knots.map((point,i)=>(i?'L':'M')+point.x+' '+point.y).join(' ');
   line.setAttribute('d',path);
   area.setAttribute('d',path+' L'+knots[knots.length-1].x+' '+bottom+' L'+knots[0].x+' '+bottom+' Z');
   const markerT=source.selected.t+(target.selected.t-source.selected.t)*eased;
   const selected=sampleShape(knots,[markerT])[0];
   positionSelection(selected,layout);
   displayedGeometry={knots,bottom,selected};
   if(progress<1)motionFrame=requestAnimationFrame(frame);else finishPlotTransition();
  };
  frame(performance.now());
 }
 reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)finishPlotTransition()});
 const dayLabel=key=>History.dateLabel(key,new Date(),true);
 const shortDay=key=>Number(key.slice(8))+'/'+Number(key.slice(5,7));
 const shifted=(key,days)=>{const d=new Date(key+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)};
 function movePeriod(direction){
  if(range==='week')anchor=shifted(anchor,direction*7);
  else if(range==='month'){const month=History.shiftMonth(anchor.slice(0,7),direction);if(!month)return;anchor=month+'-01'}
  else {const year=Number(anchor.slice(0,4))+direction;if(year<1||year>9999)return;anchor=String(year).padStart(4,'0')+'-01-01'}
  selectedDate=null;renderTrend();
 }
 function plot(){
  const points=model.points,values=points.map(p=>p.balance),low=Math.min(...values),high=Math.max(...values),padding=Math.max((high-low)*.12,Math.abs(high)*.005,1);
  const sparse=points.length===1,height=186;
  const min=low-padding,max=high+padding,left=20,right=340,top=sparse?96:62,bottom=sparse?120:154;
  const x=i=>points.length===1?(left+right)/2:left+i/(points.length-1)*(right-left),y=v=>bottom-(v-min)/(max-min)*(bottom-top);
  const ticks=sparse?'':[max,min].map(v=>`<line class="trend-grid" x1="${left}" x2="${right}" y1="${y(v)}" y2="${y(v)}"/>`).join('');
  const path=points.map((p,i)=>(i?'L':'M')+x(i).toFixed(2)+' '+y(p.balance).toFixed(2)).join(' ');
  const labelIndices=[...new Set([0,Math.floor((points.length-1)/2),points.length-1])];
  const labels=labelIndices.map(i=>`<text x="${x(i)}" y="${height-6}" text-anchor="middle">${shortDay(points[i].date)}</text>`).join('');
  const area=points.length>1?path+` L${x(points.length-1)} ${bottom} L${x(0)} ${bottom} Z`:'';
  $('trendPlot').innerHTML=`<svg viewBox="0 0 360 ${height}" aria-hidden="true"><defs><linearGradient id="trendAreaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55d6b1" stop-opacity=".24"/><stop offset="1" stop-color="#55d6b1" stop-opacity="0"/></linearGradient></defs>${ticks}${area?`<path class="trend-area" d="${area}" fill="url(#trendAreaFill)"/><path class="trend-line" d="${path}"/>`:''}<line id="trendCrosshair" x1="${x(index)}" x2="${x(index)}" y1="${top}" y2="${bottom}" stroke="#a6efd9" stroke-opacity="${sparse?0:.3}" stroke-dasharray="3 4"/><circle id="trendDotHalo" cx="${x(index)}" cy="${y(points[index].balance)}" r="8" fill="#55d6b1" fill-opacity=".18"/><circle id="trendDot" cx="${x(index)}" cy="${y(points[index].balance)}" r="3.5" fill="#a6efd9"/>${labels}</svg><div class="trend-tooltip" aria-hidden="true"><strong id="trendTooltipValue"></strong><span id="trendTooltipDate"></span></div>`;
  $('trendPlot')._position=i=>({x:x(i),y:y(points[i].balance)});
  const knots=sparse?[{t:0,x:x(0),y:y(points[0].balance)},{t:1,x:x(0),y:y(points[0].balance)}]:points.map((point,i)=>({t:i/(points.length-1),x:Number(x(i).toFixed(2)),y:Number(y(point.balance).toFixed(2))}));
  renderedGeometry={knots,bottom:sparse?knots[0].y:bottom};
 }
 function selectPoint(value){
  if(!model?.points.length)return;
  if($('trendPlot').dataset.motion)finishPlotTransition();
  index=Math.max(0,Math.min(model.points.length-1,Number(value)||0));const point=model.points[index];selectedDate=point.date;
  $('trendCursor').value=String(index);$('trendCursor').setAttribute('aria-valuetext',dayLabel(point.date)+' '+fmt(point.balance));
  $('trendPointLabel').textContent=(point.date===today?(range==='week'?'สัปดาห์นี้ · ยอดล่าสุด':'ยอดล่าสุด'):'สิ้นวัน '+dayLabel(point.date));
  $('trendPointValue').textContent=fmt(point.balance);$('trendOpenDay').textContent='ดูรายการวันที่ '+shortDay(point.date);
  const position=$('trendPlot')._position?.(index);
  if(renderedGeometry)renderedGeometry.selected={...position,t:model.points.length===1?.5:index/(model.points.length-1)};
  $('trendTooltipValue').textContent=fmt(point.balance);$('trendTooltipDate').textContent=point.date===today?'ยอดล่าสุด · '+shortDay(point.date):'สิ้นวัน '+shortDay(point.date);
  positionSelection(position);
 }
 function positionSelection(position,layout){
  if(position&&$('trendDot')){
   for(const id of ['trendDot','trendDotHalo']){$(id).setAttribute('cx',position.x);$(id).setAttribute('cy',position.y)}
   $('trendCrosshair').setAttribute('x1',position.x);$('trendCrosshair').setAttribute('x2',position.x);
   const amount=$('trendTooltipValue'),tooltip=amount.parentElement,plotWidth=layout?layout.width:$('trendPlot').clientWidth;
   if(!layout){
    amount.style.whiteSpace='nowrap';amount.style.fontSize='';
    if(amount.clientWidth&&amount.scrollWidth>amount.clientWidth)amount.style.fontSize=(parseFloat(getComputedStyle(amount).fontSize)*amount.clientWidth/amount.scrollWidth)+'px';
   }
   // Clamp actual measured width rather than assuming short currency values.
   const half=layout?layout.half:tooltip.offsetWidth/2,px=position.x/360*plotWidth;
   const tooltipX=Math.max(half,Math.min(plotWidth-half,px));
   const svg=$('trendPlot').querySelector('svg');
   const tooltipY=Math.max(0,position.y/svg.viewBox.baseVal.height*(layout?layout.height:svg.getBoundingClientRect().height)-(layout?layout.tooltipHeight:tooltip.offsetHeight)-12);
   tooltip.style.left='0';tooltip.style.top='0';
   tooltip.style.transform=`translate(${tooltipX}px,${tooltipY}px) translateX(-50%)`;
  }
 }
 function renderTrend(){
  const nextToday=History.today();if(anchor===today)anchor=nextToday;today=nextToday;
  model=BalanceTrend.build(state,{range,anchor,today});
  const periodKey=range+':'+model.periodStart+':'+model.periodEnd;
  transitionSource=displayedGeometry||renderedGeometry;
  periodChanged=renderedPeriod!==null&&renderedPeriod!==periodKey;
  finishPlotTransition();
  renderedPeriod=periodKey;
  $('trendCurrent').textContent=model.currentBalance===null?'—':fmt(model.currentBalance);
  $('trendCurrentNote').textContent=model.futureCount?'ไม่รวม '+model.futureCount+' รายการลงวันที่ล่วงหน้า · ไม่รวมยอดลูกหนี้ / เจ้าหนี้':'รวมเงินในบัญชีของเรา · ไม่รวมยอดลูกหนี้ / เจ้าหนี้';
  $('trendPeriod').textContent=range==='year'?'ปี '+(Number(anchor.slice(0,4))+543):range==='month'?History.monthLabel(anchor.slice(0,7)):(model.periodStart<=today&&model.periodEnd>=today?'สัปดาห์นี้ · ':'สัปดาห์ ')+shortDay(model.periodStart)+' – '+shortDay(model.periodEnd);
  document.querySelectorAll('[data-trend-range]').forEach(button=>{const active=button.dataset.trendRange===range;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active))});
  $('trendPrev').disabled=!model.earliestDate||Boolean(model.reason&&model.reason!=='empty-range')||model.periodStart<=model.earliestDate;
  $('trendNext').disabled=model.periodEnd>=today;
  $('trendToday').classList.toggle('hidden',model.periodStart<=today&&model.periodEnd>=today);
  $('trendChange').textContent='';$('trendChange').className='trend-change';
  $('trendSelection').classList.toggle('hidden',!model.points.length);
  const sparse=model.points.length===1,currentWeek=range==='week'&&model.periodStart<=today&&model.periodEnd>=today;
  $('balanceTrend').classList.toggle('is-sparse',sparse);
  $('trendSparseText').classList.toggle('hidden',!sparse);
  $('trendSparseText').textContent=sparse?(currentWeek?'สัปดาห์นี้มีข้อมูล 1 วัน':'ช่วงนี้มีข้อมูล 1 วัน'):'';
  $('trendSparseExplore').classList.toggle('hidden',!sparse||range!=='week');
  const messages={
   'no-accounts':'เพิ่มบัญชีของคุณก่อน แล้วเริ่มติดตามเงินได้จากตรงนี้',
   'invalid-date':'มีวันที่รายการที่ใช้คำนวณยอดไม่ถูกต้อง กรุณาตรวจวันที่ในหน้ารายการก่อนแสดงกราฟ',
   'invalid-amount':'มีจำนวนเงินที่ใช้คำนวณไม่ได้ กรุณาตรวจยอดตั้งต้นและรายการ',
   'empty-range':'ยังไม่มีประวัติในช่วงนี้ เลือกช่วงถัดไปหรือกลับช่วงปัจจุบัน'
  };
  if(!model.points.length){
   renderedGeometry=null;
   $('trendPlot').innerHTML='<div class="trend-empty">'+esc(messages[model.reason]||'ยังแสดงกราฟไม่ได้')+(model.reason==='no-accounts'?'<br><button class="text-button" type="button" data-go="settings">ไปเพิ่มบัญชี</button>':'')+'</div>';
   $('trendNotice').textContent='';animatePlot();return;
  }
  if(model.change!==null){
   const verb=model.change>0?'เพิ่ม ':model.change<0?'ลด ':'ไม่เปลี่ยนแปลง ';
   const percent=model.percent===null?'': ' · '+(model.percent>0?'+':model.percent<0?'−':'')+new Intl.NumberFormat('th-TH',{maximumFractionDigits:1}).format(Math.abs(model.percent))+'%';
   $('trendChange').textContent=verb+fmt(Math.abs(model.change))+percent+' เทียบกับสิ้นวัน '+dayLabel(model.baselineDate);
   $('trendChange').classList.add(model.change<0?'negative':'positive');
  }else $('trendChange').textContent='มีข้อมูลเพียงวันเดียวในช่วงนี้ · ยังไม่มีฐานเปรียบเทียบ';
  const found=model.points.findIndex(p=>p.date===selectedDate);index=found<0?model.points.length-1:found;
  $('trendCursor').max=String(model.points.length-1);$('trendCursor').disabled=model.points.length===1;
  plot();selectPoint(index);animatePlot();
  $('trendNotice').textContent='คำนวณจากรายการที่บันทึก · ย้อนหลังได้ถึง '+dayLabel(model.earliestDate)+' · หากจดไม่ครบ ยอดในอดีตอาจคลาดเคลื่อน'+(model.change!==null&&model.percent===null?' · ยอดฐานไม่เป็นบวก จึงแสดงการเปลี่ยนแปลงเป็นบาท':'');
 }
 $('trendPrev').onclick=()=>movePeriod(-1);$('trendNext').onclick=()=>movePeriod(1);
 $('trendToday').onclick=()=>{anchor=History.today();selectedDate=null;renderTrend()};
 $('trendSparseExplore').onclick=()=>{range='month';anchor=History.today();selectedDate=null;renderTrend()};
 document.querySelectorAll('[data-trend-range]').forEach(button=>button.addEventListener('click',()=>{range=button.dataset.trendRange;selectedDate=null;renderTrend()}));
 $('trendCursor').addEventListener('input',()=>selectPoint($('trendCursor').value));
 function pointerSelect(event){
  if(!model?.points.length)return;
  if($('trendPlot').dataset.motion)finishPlotTransition();
  const box=$('trendPlot').getBoundingClientRect(),x=(event.clientX-box.left)/box.width*360;
  selectPoint(Math.round((x-20)/(340-20)*(model.points.length-1)));
 }
 $('trendPlot').addEventListener('pointerdown',pointerSelect);
 $('trendPlot').addEventListener('pointermove',event=>{if(event.pointerType==='mouse'||event.buttons)pointerSelect(event)});
 $('trendOpenDay').onclick=()=>{
  if(!selectedDate)return;changeCalendarMonth(selectedDate.slice(0,7));calendarSelected=selectedDate;$('search').value='';renderHistory();$('calendarDayDialog').showModal();updateCaptureButton();
 };
 document.addEventListener('ledger-rendered',renderTrend);
 let plotWidth=0;
 new ResizeObserver(()=>{const width=$('trendPlot').clientWidth;if(width!==plotWidth){plotWidth=width;finishPlotTransition();if(width&&model?.points.length)selectPoint(index)}}).observe($('trendPlot'));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderTrend()});
 renderTrend();
})();
