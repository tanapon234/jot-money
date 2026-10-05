const Money = {
  activeAccounts(state) { return state.accounts.filter(a=>!a.archived); },
  removeAccount(state,id) {
    const a=state.accounts.find(a=>a.id===id);
    if (!a || a.archived) return 'missing';
    if (this.activeAccounts(state).length <= 1) return 'last';
    if (state.entries.some(e=>e.account===id) || this.balance(state,id)!==0) {
      a.archived=true;return 'archived';
    }
    state.accounts=state.accounts.filter(a=>a.id!==id);return 'deleted';
  },
  parse(text) {
    const matches = [...text.matchAll(/\d[\d,]*(?:\.\d{1,2})?/g)];
    if (matches.length !== 1) return null;
    const amount = Number(matches[0][0].replaceAll(',', ''));
    const note = (text.slice(0,matches[0].index)+text.slice(matches[0].index+matches[0][0].length)).replace(/บาท/g,'').trim();
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000 || !note) return null;
    return { amount, note };
  },
  suggest(note) {
    if (/เครื่องมือ|ประแจ|ไขควง/.test(note)) return 'เครื่องมือ';
    if (/ซ่อม|ยางรถ|อะไหล่/.test(note)) return 'ซ่อมรถ';
    if (/แต่งรถ/.test(note)) return 'แต่งรถ';
    if (/น้ำมัน/.test(note)) return 'น้ำมัน';
    if (/โทรศัพท์|เติมเงิน|ค่าเน็ต/.test(note)) return 'โทรศัพท์';
    if (/ข้าว|อาหาร|กาแฟ|หมู|ไก่|ไข่|ชาบู|น้ำดื่ม|ขนม/.test(note)) return 'อาหาร';
    return 'รอจัดหมวด';
  },
  balance(state, id) {
    return Math.round((state.accounts.find(a=>a.id===id).opening + state.entries.filter(e=>e.account===id).reduce((n,e)=>n+(e.type==='income'||e.type==='repay'?e.amount:-e.amount),0))*100)/100;
  },
  total(state) {return state.accounts.reduce((n,a)=>n+this.balance(state,a.id),0)},
  debt(state) {return Math.max(0,state.entries.reduce((n,e)=>n+(e.type==='lend'?e.amount:e.type==='repay'?-e.amount:0),0))}
};
if (typeof module !== 'undefined') module.exports=Money;
