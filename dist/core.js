const Money = {
  accountGroups: [{id:'cash',label:'เงินสด'},{id:'bank',label:'บัญชีธนาคาร'},{id:'ewallet',label:'กระเป๋าเงินออนไลน์'},{id:'savings',label:'เงินเก็บ / เงินสำรอง'},{id:'other',label:'บัญชีอื่น ๆ'},{id:'debt',label:'ลูกหนี้ / เจ้าหนี้'}],
  groups(state) {return [...(state.accountGroups||this.accountGroups).filter(g=>g.id!=='ungrouped'),{id:'ungrouped',label:'ยังไม่จัดกลุ่ม'}]},
  saveGroup(state,label,id=null,newId=null) {
    label=String(label).trim();const groups=this.groups(state);
    if(!label||label.length>40)return 'ใส่ชื่อกลุ่ม 1–40 ตัวอักษร';
    if(id==='ungrouped')return 'ยังไม่จัดกลุ่มเป็นกลุ่มระบบ';
    if(id&&!groups.some(g=>g.id===id))return 'ไม่พบกลุ่ม';
    if(groups.some(g=>g.id!==id&&g.label.toLowerCase()===label.toLowerCase()))return 'มีชื่อกลุ่มนี้แล้ว';
    if(!id&&(!newId||groups.some(g=>g.id===newId)))return 'รหัสกลุ่มไม่ถูกต้อง';
    state.accountGroups=id?groups.map(g=>g.id===id?{...g,label}:g):groups.concat({id:newId,label});return '';
  },
  removeGroup(state,id) {
    if(id==='ungrouped'||!this.groups(state).some(g=>g.id===id))return false;
    state.accounts.forEach(a=>{if(this.accountGroup(a,state)===id)a.group='ungrouped'});
    state.accountGroups=this.groups(state).filter(g=>g.id!==id);return true;
  },
  accountGroup(account,state=null) {
    const groups=state?this.groups(state):this.accountGroups;
    if(account.group)return groups.some(group=>group.id===account.group)?account.group:'ungrouped';
    if(account.kind==='borrower')return groups.some(g=>g.id==='debt')?'debt':'ungrouped';
    const name=String(account.name||'').toLowerCase();
    const inferred=/เงินเก็บ|เงินสำรอง|make|saving/.test(name)?'savings':/wallet|grab|ทรูมันนี่/.test(name)?'ewallet':/เงินสด|^cash$/.test(name)?'cash':/bank|ธนาคาร|mymo|krungthai|next|กสิกร|กรุงไทย|ออมสิน/.test(name)?'bank':'other';
    return groups.some(g=>g.id===inferred)?inferred:'ungrouped';
  },
  groupedAccounts(state) {
    const groups=this.groups(state).map(group=>{
      const accounts=state.accounts.filter(a=>!a.archived&&!a.deleted&&this.accountGroup(a,state)===group.id);
      return {...group,accounts,total:Math.round(accounts.reduce((n,a)=>n+this.balance(state,a.id),0)*100)/100,
        receivable:Math.round(accounts.filter(a=>a.kind==='borrower').reduce((n,a)=>n+Math.max(0,this.balance(state,a.id)),0)*100)/100,
        payable:Math.round(accounts.filter(a=>a.kind==='borrower').reduce((n,a)=>n+Math.max(0,-this.balance(state,a.id)),0)*100)/100,
        cashTotal:Math.round(accounts.filter(a=>a.kind!=='borrower').reduce((n,a)=>n+this.balance(state,a.id),0)*100)/100,
        debtTotal:Math.round(accounts.filter(a=>a.kind==='borrower').reduce((n,a)=>n+Math.max(0,this.balance(state,a.id)),0)*100)/100};
    }).filter(group=>group.accounts.length);
    const archived=state.accounts.filter(a=>a.archived&&!a.deleted);
    if(archived.length)groups.push({id:'archived',label:'บัญชีที่ซ่อนไว้',accounts:archived});
    return groups;
  },
  defaultCategories: ['รอจัดหมวด','อาหาร','น้ำมัน','โทรศัพท์','เครื่องมือ','ซ่อมรถ','แต่งรถ','ของใช้','การเรียน','งาน/รายได้เสริม','อื่น ๆ'],
  incomeCategories: ['เงินเดือน','งาน/รายได้เสริม','โบนัส','ดอกเบี้ย','ของขวัญ','อื่น ๆ'],
  categories(state,type=null) {
    const incomeDefaults=this.incomeCategories.map(name=>state.categoryAliases?.[name]||name);
    const all=[...new Set(['รอจัดหมวด',...(state.categories||this.defaultCategories),...incomeDefaults,...state.entries.filter(e=>e.type!=='transfer').map(e=>e.category).filter(Boolean)])];
    if(type!=='expense'&&type!=='income')return all;
    return all.filter(name=>{
      if(name==='รอจัดหมวด'||name==='อื่น ๆ')return true;
      const usage=state.entries.filter(e=>e.category===name&&(e.type==='income'||e.type==='expense')).map(e=>e.type);
      const configured=state.categoryTypes?.[name];
      if(configured)return configured.includes(type)||usage.includes(type);
      if(usage.length)return usage.includes(type);
      return type==='income'?incomeDefaults.includes(name):!incomeDefaults.includes(name);
    });
  },
  saveCategory(state,name,previous=null,type='expense') {
    name=String(name).trim();
    const categories=this.categories(state);
    if(!name||name.length>40)return 'ใส่ชื่อหมวด 1–40 ตัวอักษร';
    if(name==='โอน')return 'ชื่อโอนสงวนไว้สำหรับการโอนเงิน';
    if(previous==='รอจัดหมวด')return 'รอจัดหมวดเป็นหมวดระบบ เปลี่ยนชื่อไม่ได้';
    if(previous&&!categories.includes(previous))return 'ไม่พบหมวดที่ต้องการแก้ไข';
    if(categories.some(c=>c!==previous&&c.toLocaleLowerCase()===name.toLocaleLowerCase()))return 'มีชื่อหมวดนี้แล้ว';
    const previousTypes=previous?['expense','income'].filter(t=>this.categories(state,t).includes(previous)):[];
    state.categories=previous?categories.map(c=>c===previous?name:c):categories.concat(name);
    state.categoryTypes=state.categoryTypes||{};
    if(previous){state.categoryTypes[name]=previousTypes;delete state.categoryTypes[previous];}
    else state.categoryTypes[name]=[type];
    if(previous){
      state.entries.forEach(e=>{if(e.type!=='transfer'&&e.category===previous)e.category=name});
      state.categoryAliases=state.categoryAliases||{};
      [...this.defaultCategories,...this.incomeCategories].forEach(c=>{if((state.categoryAliases[c]||c)===previous)state.categoryAliases[c]=name});
    }
    return '';
  },
  suggestCategory(state,note,type='expense') {
    const original=this.suggest(note),name=state.categoryAliases?.[original]||original;
    return this.categories(state,type).includes(name)?name:'รอจัดหมวด';
  },
  activeAccounts(state) { return state.accounts.filter(a=>!a.archived&&!a.deleted); },
  wallets(state) { return this.activeAccounts(state).filter(a=>a.kind!=='borrower'); },
  migrate(state) {
    const next=JSON.parse(JSON.stringify(state));
    next.accounts.forEach(a=>{if(!a.kind)a.kind='wallet'});
    const legacy=next.entries.filter(e=>e.type==='lend'||e.type==='repay');
    if(legacy.length){
      let id='legacy-borrowers';
      while(next.accounts.some(a=>a.id===id))id+='-old';
      next.accounts.push({id,name:'ผู้ยืมเดิม (ยังไม่ระบุคน)',kind:'borrower',opening:0});
      legacy.forEach(e=>{if(e.type==='lend')e.toAccount=id;else {e.toAccount=e.account;e.account=id}e.type='transfer'});
    }
    next.accountGroups=this.groups(next);
    next.accounts.forEach(a=>{a.group=this.accountGroup(a,next)});
    next.categories=this.categories(next);
    next.schemaVersion=2;return next;
  },
  validateTransfer(state, entry, excludeId=null) {
    const from=state.accounts.find(a=>a.id===entry.account),to=state.accounts.find(a=>a.id===entry.toAccount);
    if(!from||!to||from.id===to.id)return 'เลือกบัญชีต้นทางและปลายทางที่ต่างกัน';
    if((from.archived||to.archived||from.deleted||to.deleted)&&!excludeId)return 'เลือกบัญชีที่ยังใช้งานอยู่';
    if(!Number.isFinite(entry.amount)||entry.amount<=0||entry.amount>10000000)return 'ใส่จำนวนเงินมากกว่า 0 และไม่เกิน 10,000,000 บาท';
    if(from.kind==='borrower'&&to.kind==='borrower')return 'โอนระหว่างบัญชีของคุณกับผู้ยืมเท่านั้น';
    return '';
  },
  removeAccount(state,id) {
    const a=state.accounts.find(a=>a.id===id);
    if (!a || a.archived) return 'missing';
    if (a.kind!=='borrower' && this.wallets(state).length <= 1) return 'last';
    if (state.entries.some(e=>e.account===id||e.toAccount===id) || this.balance(state,id)!==0) {
      a.archived=true;return 'archived';
    }
    state.accounts=state.accounts.filter(a=>a.id!==id);return 'deleted';
  },
  deleteBorrower(state,id) {
    const account=state.accounts.find(a=>a.id===id&&a.kind==='borrower'&&!a.deleted);
    if(!account)return false;account.deleted=true;return true;
  },
  restoreBorrower(state,id) {
    const account=state.accounts.find(a=>a.id===id&&a.kind==='borrower'&&a.deleted);
    if(!account)return false;delete account.deleted;account.archived=false;account.group=this.accountGroup(account,state);return true;
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
    const a=state.accounts.find(a=>a.id===id);if(!a)return 0;
    return Math.round((a.opening + state.entries.reduce((n,e)=>{
      if(e.type==='transfer')return n+(e.toAccount===id?e.amount:0)-(e.account===id?e.amount:0);
      if(e.type==='adjustment')return e.account===id?n+(e.direction==='increase'?e.amount:-e.amount):n;
      return e.account===id?n+(e.type==='income'||e.type==='repay'?e.amount:-e.amount):n;
    },0))*100)/100;
  },
  total(state) {return Math.round(state.accounts.filter(a=>a.kind!=='borrower').reduce((n,a)=>n+this.balance(state,a.id),0)*100)/100},
  debt(state) {
    const borrowers=state.accounts.filter(a=>a.kind==='borrower'&&!a.deleted).reduce((n,a)=>n+Math.max(0,this.balance(state,a.id)),0);
    const legacy=Math.max(0,state.entries.reduce((n,e)=>n+(e.type==='lend'?e.amount:e.type==='repay'?-e.amount:0),0));
    return Math.round((borrowers+legacy)*100)/100;
  },
  owed(state) { return Math.round(state.accounts.filter(a=>a.kind==='borrower'&&!a.deleted).reduce((n,a)=>n+Math.max(0,-this.balance(state,a.id)),0)*100)/100; }
};
if (typeof module !== 'undefined') module.exports=Money;
