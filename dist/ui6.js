// Afterglow presentation. Reuses existing navigation/capture nodes and handlers.
// No ledger, schema or storage reads/writes.
(() => {
 const sidebar=document.querySelector('.sidebar'),nav=sidebar.querySelector('nav');
 const capture=document.getElementById('floatingCapture'),dock=document.createElement('div');
 dock.className='ui6-dock';document.body.append(dock);
 const brand=document.createElement('span');brand.className='afterglow-brand';brand.textContent='จดไว';brand.setAttribute('aria-hidden','true');
 document.querySelector('.page-header>div').prepend(brand);
 document.querySelector('.skip-link').addEventListener('click',event=>{
  event.preventDefault();document.getElementById('appContent').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
 });
 // Put the long calculation disclosure after the working overview, not
 // between the graph and the recent records the user came to inspect.
 const help=document.querySelector('#moneyOverview .trend-help');
 if(help){help.classList.add('afterglow-help');document.getElementById('home').insertBefore(help,document.querySelector('#home .sample-banner'));}
 function rangeState(){document.body.dataset.trendRange=document.querySelector('[data-trend-range][aria-pressed=true]')?.dataset.trendRange||'week';}
 new MutationObserver(rangeState).observe(document.querySelector('.trend-ranges'),{subtree:true,attributes:true,attributeFilter:['aria-pressed']});rangeState();
 const mobile=matchMedia('(max-width:900px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 function layout(){
  const focused=document.activeElement;
  if(mobile.matches){dock.append(nav,capture)}
  else {sidebar.insertBefore(nav,sidebar.querySelector('.sidebar-bottom'));document.body.append(capture)}
  if(focused&&focused!==document.body&&focused.isConnected)focused.focus({preventScroll:true});
 }
 function selected(){
  const buttons=[...nav.querySelectorAll('[data-tab]')],index=Math.max(0,buttons.findIndex(b=>b.classList.contains('active')));
  nav.style.setProperty('--nav-index',index);
  document.body.dataset.page=buttons[index]?.dataset.tab||'home';
 }
 let frame;
 new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(selected)}).observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
 mobile.addEventListener('change',layout);layout();selected();
 document.addEventListener('click',event=>{
  if(!event.target.closest('[data-tab],[data-go],[data-history-view]')||reduced.matches)return;
  requestAnimationFrame(()=>{
   const view=document.querySelector('.view:not(.hidden)');
   view?.getAnimations().forEach(a=>a.cancel());
   view?.animate([{opacity:.88,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
  });
 });
 const openSheets=new WeakSet();
 new MutationObserver(records=>{
  for(const {target} of records){
   if(target.tagName!=='DIALOG')continue;
   if(!target.open){openSheets.delete(target);continue}
   if(openSheets.has(target)||reduced.matches)continue;
   openSheets.add(target);
   // Never delay showModal/focus: iOS needs capture focus within the tap.
   target.animate([{opacity:.9,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:340,easing:'cubic-bezier(.16,1,.3,1)'});
  }
 }).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
})();
