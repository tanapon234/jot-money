// Presentation only. No ledger/storage access and no replacement of app handlers.
(() => {
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fade=element=>{if(!element||reduced())return;element.getAnimations().forEach(a=>a.cancel());element.animate([{opacity:.45},{opacity:1}],{duration:260,easing:'ease-out'})};
 document.addEventListener('click',event=>{
  const navigation=event.target.closest('[data-tab],[data-go],[data-history-view]');
  if(navigation)requestAnimationFrame(()=>fade(document.querySelector('.view:not(.hidden)')));
 });
 document.addEventListener('toggle',event=>{
  if(event.target.tagName==='DETAILS'&&event.target.open&&!reduced())
   [...event.target.children].filter(child=>child.tagName!=='SUMMARY').forEach(fade);
 },true);
 document.addEventListener('pointerdown',event=>{
  const button=event.target.closest('.save,.primary-small,.nav,.calendar-day');
  if(!button||button.disabled||reduced())return;
  const box=button.getBoundingClientRect(),size=Math.max(box.width,box.height)*2;
  const glow=document.createElement('span');glow.className='ui3-touch-glow';glow.setAttribute('aria-hidden','true');
  Object.assign(glow.style,{width:size+'px',height:size+'px',left:(event.clientX-box.left-size/2)+'px',top:(event.clientY-box.top-size/2)+'px'});
  button.append(glow);
  glow.animate([{transform:'scale(0)',opacity:.8},{transform:'scale(1)',opacity:0}],{duration:460,easing:'ease-out'}).finished.catch(()=>{}).finally(()=>glow.remove());
 });
 const toast=document.getElementById('toast');
 if(toast)new MutationObserver(()=>{if(toast.style.display==='block')fade(toast)}).observe(toast,{attributes:true,attributeFilter:['style'],childList:true});
})();
