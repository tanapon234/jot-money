// UI7 Liquid Glass Night presentation. Read-only: derives wallet colours from the rendered
// account list and tags rows. No ledger, schema or storage reads/writes.
(() => {
 const livery = ['#0a84ff', '#30d158', '#ff9f0a', '#bf5af2', '#ff375f', '#64d2ff'];
 const $ = id => document.getElementById(id);
 let queued = false;
 function wallets() {
  return [...document.querySelectorAll('#settingsList [data-account-detail]')].map((row, i) => {
   const name = row.querySelector('b')?.textContent.trim() || '';
   const raw = row.querySelector('.settings-list-value')?.firstChild?.textContent || '';
   const value = parseFloat(raw.replace(/[^0-9.\-]/g, '')) || 0;
   return { row, name, value, color: livery[i % livery.length] };
  }).filter(w => w.name);
 }
 function paint() {
  queued = false;
  const list = wallets();
  list.forEach(w => { w.row.dataset.wallet = w.name; w.row.style.setProperty('--w', w.color); });
  const byLength = [...list].sort((a, b) => b.name.length - a.name.length);
  document.querySelectorAll('.entry-meta-main').forEach(el => {
   const text = el.textContent.trim(), hit = byLength.find(w => text.startsWith(w.name));
   if (hit) { el.dataset.wallet = hit.name; el.style.setProperty('--w', hit.color); }
  });
  const host = $('moneyOverview'), anchor = host?.querySelector('.money-overview-bottom');
  if (!host || !anchor) return;
  let fleet = $('walletFleet');
  const positive = list.filter(w => w.value > 0);
  const total = positive.reduce((n, w) => n + w.value, 0);
  if (!positive.length || total <= 0) { fleet?.remove(); return; }
  if (!fleet) { fleet = document.createElement('div'); fleet.id = 'walletFleet'; fleet.className = 'wallet-fleet'; anchor.after(fleet); }
  const signature = positive.map(w => w.name + w.value).join('|');
  if (fleet.dataset.sig === signature) return;
  fleet.dataset.sig = signature;
  const bar = document.createElement('div'); bar.className = 'wallet-fleet-bar'; bar.setAttribute('role', 'img');
  bar.setAttribute('aria-label', 'สัดส่วนเงินในแต่ละบัญชี');
  const key = document.createElement('ul'); key.className = 'wallet-fleet-key';
  positive.forEach(w => {
   const seg = document.createElement('span'); seg.style.flex = String(w.value); seg.style.setProperty('--w', w.color); bar.append(seg);
   const li = document.createElement('li'), chip = document.createElement('i'); chip.style.setProperty('--w', w.color);
   li.append(chip, document.createTextNode(w.name)); key.append(li);
  });
  fleet.replaceChildren(bar, key);
 }
 const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
 new MutationObserver(schedule).observe(document.querySelector('main'), { childList: true, subtree: true, characterData: true });
 schedule();
})();
