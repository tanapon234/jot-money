// Visual comparison only: keep the same forms, drafts, entries and browser storage.
(()=>{
 const stylesheet=document.querySelector('link[href="ui2.css"]');
 const button=document.getElementById('previewThemeToggle');
 const badge=document.querySelector('.design-version');
 if(!stylesheet||!button||!badge)return;
 button.addEventListener('click',()=>{
  const ui2=!document.body.classList.contains('ui2-theme');
  stylesheet.disabled=!ui2;
  document.body.classList.toggle('ui2-theme',ui2);
  badge.textContent=ui2?'UI 2':'UI 1';
  button.firstChild.textContent=ui2?'เทียบ UI1 ':'ดู UI2 ';
  button.setAttribute('aria-label',ui2?'สลับไปดู UI1 เดิม':'สลับไปดู UI2 ใหม่');
  document.title='จดไว · '+(ui2?'UI2':'UI1')+' — พื้นที่เล็ก ๆ ของเงินคุณ';
  window.dispatchEvent(new Event('resize'));
 });
})();
