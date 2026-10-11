// Viewport and modal presentation only. No ledger or storage access.
(() => {
 const root=document.documentElement,viewport=window.visualViewport;
 function fitViewport(){
  root.style.setProperty('--app-viewport',(viewport?.height||innerHeight)+'px');
  root.style.setProperty('--app-view-top',(viewport?.offsetTop||0)+'px');
  document.body.classList.toggle('app-keyboard',Boolean(viewport&&innerHeight-viewport.height>140));
 }
 viewport?.addEventListener('resize',fitViewport);viewport?.addEventListener('scroll',fitViewport);
 window.addEventListener('resize',fitViewport);fitViewport();
 // Keep the single action off every modal, including nested account review.
 new MutationObserver(updateCaptureButton).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
})();
