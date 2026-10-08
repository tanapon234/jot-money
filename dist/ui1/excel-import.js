/* Money Manager XLSX → reviewed app ledger. No network or state writes here. */
const ExcelImport = {
  read(buffer,reader) {
    const workbook=reader.read(buffer,{type:'array',cellDates:false,cellHTML:false,cellFormula:true});
    const required=['ระยะเวลา','ทรัพย์สิน','หมวดหมู่','เนื้อหา','THB','รายรับ/รายได้'];
    const matches=workbook.SheetNames.map(name=>({name,sheet:workbook.Sheets[name]})).map(item=>({...item,grid:reader.utils.sheet_to_json(item.sheet,{header:1,raw:true,defval:'',blankrows:true})})).filter(item=>required.every(name=>item.grid[0]?.includes(name)));
    if(matches.length!==1)throw new Error('ต้องมีหนึ่งชีตที่ใช้หัวคอลัมน์แบบ Money Manager: '+required.join(', '));
    const {name,sheet,grid}=matches[0],start=reader.utils.decode_range(sheet['!ref']).s;
    if(grid.length>20001)throw new Error('รองรับไม่เกิน 20,000 แถวต่อไฟล์');
    const headers=grid[0];
    if(required.filter(header=>header!=='ทรัพย์สิน').some(header=>headers.filter(h=>h===header).length!==1))throw new Error('ชื่อหัวคอลัมน์ที่จำเป็นซ้ำ กรุณาตรวจไฟล์');
    const date1904=!!workbook.Workbook?.WBProps?.date1904;
    const rows=grid.slice(1).map((values,index)=>{
      const row={row:start.r+index+2,sheet:name};
      [...required,'หมวดย่อย','บันทึกเพิ่มเติม','เงินตรา'].forEach(header=>{const col=headers.indexOf(header);if(col>=0)row[header]=values[col]});
      row.date1904=date1904;
      row.formula=values.some((_,col)=>sheet[reader.utils.encode_cell({r:start.r+index+1,c:start.c+col})]?.f);
      return row;
    }).filter(row=>headers.some(header=>row[header]!==''&&row[header]!=null));
    return this.normalize(rows,reader);
  },
  normalize(rows,reader) {
    const errors=[],entries=[],transfers=new Map(),accounts=new Set(),categories=new Set();
    for(const row of rows){
      const text=name=>String(row[name]??'').trim(),account=text('ทรัพย์สิน'),category=text('หมวดหมู่'),kind=text('รายรับ/รายได้');
      const amount=Number(row.THB),serial=Number(row['ระยะเวลา']);
      const parts=Number.isFinite(serial)&&serial>0?reader.SSF.parse_date_code(serial,{date1904:row.date1904}):null;
      if(row.formula||!account||!parts||!Number.isFinite(amount)||amount<=0||amount>10000000||Math.abs(amount*100-Math.round(amount*100))>0.00001||!['รายรับ','รายจ่าย','รายรับจากการโอน','รายจ่ายจากการโอน'].includes(kind)||(text('เงินตรา')&&text('เงินตรา')!=='THB')){
        errors.push('แถว '+row.row+': วันที่ บัญชี ประเภท ยอดเงิน หรือสกุลเงินไม่รองรับ (ต้องเป็น THB และไม่ใช้สูตร)');continue;
      }
      // Excel dates are local wall-clock times. Interpret explicitly as Bangkok, not PC timezone.
      const date=new Date(Date.UTC(parts.y,parts.m-1,parts.d,parts.H-7,parts.M,Math.round(parts.S))).toISOString();
      const base={date,amount:Math.round(amount*100)/100,note:text('เนื้อหา')||(kind.includes('จากการโอน')?'โอนเงิน':category||'รายการนำเข้า'),subcategory:text('หมวดย่อย'),extraNote:text('บันทึกเพิ่มเติม'),sourceRows:[row.row],sourceCategory:category};
      accounts.add(account);
      if(kind.includes('จากการโอน')){
        if(!category||category===account){errors.push('แถว '+row.row+': บัญชีคู่โอนไม่ถูกต้อง');continue}
        const from=kind==='รายจ่ายจากการโอน'?account:category,to=kind==='รายรับจากการโอน'?account:category;
        accounts.add(category);
        const key=JSON.stringify([date,from,to,base.amount,base.note]);
        if(!transfers.has(key))transfers.set(key,{out:[],in:[]});
        transfers.get(key)[kind==='รายจ่ายจากการโอน'?'out':'in'].push({...base,account:from,toAccount:to,type:'transfer',category:'โอน'});
      }else{
        categories.add(category||'รอจัดหมวด');entries.push({...base,account,type:kind==='รายรับ'?'income':'expense',category:category||'รอจัดหมวด'});
      }
    }
    let pairs=0;
    for(const group of transfers.values()){
      if(group.out.length!==group.in.length){errors.push('แถว '+[...group.out,...group.in].flatMap(e=>e.sourceRows).join(', ')+': คู่โอนไม่ครบ จะไม่นำเข้าฝั่งเดียว');continue}
      group.out.forEach((out,index)=>{const incoming=group.in[index];entries.push({...out,sourceRows:[...out.sourceRows,...incoming.sourceRows],extraNote:[...new Set([out.extraNote,incoming.extraNote].filter(Boolean))].join(' · ')});pairs++});
    }
    entries.sort((a,b)=>a.date.localeCompare(b.date)||Math.min(...b.sourceRows)-Math.min(...a.sourceRows));
    const occurrences=new Map();
    entries.forEach(entry=>{
      const signature=JSON.stringify([entry.date,entry.type,entry.account,entry.toAccount||'',entry.amount,entry.note,entry.sourceCategory,entry.subcategory,entry.extraNote]);
      const ordinal=(occurrences.get(signature)||0)+1;occurrences.set(signature,ordinal);
      entry.importKey=signature+'#'+ordinal;
    });
    if(!entries.length&&!errors.length)errors.push('ไฟล์ไม่มีรายการ');
    return {rows:rows.length,pairs,entries,accounts:[...accounts],categories:[...categories],errors};
  },
  defaultCategory(name,state,money) {
    const clean=name.replace(/[^\p{L}\p{N}\s/().-]/gu,'').trim().toLowerCase();
    const aliases={'food':'อาหาร','ค่าน้ำมัน':'น้ำมัน','work':'งาน/รายได้เสริม','ทำงาน':'งาน/รายได้เสริม','ได้เงิน':'งาน/รายได้เสริม','bonus':'งาน/รายได้เสริม','other':'อื่น ๆ','household':'ของใช้','transport':'เดินทาง','culture':'บันเทิง','gift':'ของขวัญ','apparel':'เสื้อผ้า','social life':'สังคม','beauty':'ความงาม','health':'สุขภาพ'};
    const preferred=aliases[clean]||name;
    const renamed=state.categoryAliases?.[preferred]||preferred;
    return money.categories(state).find(c=>c.toLowerCase()===renamed.toLowerCase())||renamed;
  },
  defaultAccount(name,state) {
    // Match only the actual name. Similar bank names must be mapped by the user.
    return state.accounts.find(a=>!a.deleted&&a.name.trim().toLowerCase()===name.trim().toLowerCase());
  },
  plan(state,source,mapping,mode,money,idFactory) {
    if(source.errors.length)throw new Error('ไฟล์มีข้อผิดพลาด กรุณาแก้ก่อนนำเข้า');
    if(!['append','replace'].includes(mode))throw new Error('เลือกวิธีนำเข้าก่อน');
    const next=JSON.parse(JSON.stringify(state)),accountIds=new Map(),names=new Map(),added=[],skipped=[];
    if(mode==='replace'){next.accounts=[];next.entries=[]}
    next.accounts.forEach(a=>names.set(a.name.toLowerCase(),a));
    for(const raw of source.accounts){
      const choice=mapping.accounts[raw];
      if(!choice||!choice.name?.trim()||choice.name.trim().length>40||!['wallet','borrower'].includes(choice.kind))throw new Error('ตรวจชื่อและประเภทบัญชี '+raw);
      const existing=choice.target?state.accounts.find(a=>a.id===choice.target):null;
      const name=(existing?.name||choice.name).trim();
      let account=next.accounts.find(a=>a.id===existing?.id)||names.get(name.toLowerCase());
      if(account?.deleted)throw new Error('บัญชี '+name+' อยู่ในถังขยะ กรุณานำกลับก่อนนำเข้า');
      if(account&&account.kind!==choice.kind)throw new Error('ประเภทบัญชีไม่ตรงกัน: '+name);
      if(!account){account={id:existing?.id||idFactory(),name,kind:choice.kind,opening:0,group:existing?.group};next.accounts.push(account);names.set(name.toLowerCase(),account)}
      account.group=money.accountGroup(account,next);
      account.archived=false;accountIds.set(raw,account.id);
    }
    if(!next.accounts.some(a=>a.kind==='wallet'))throw new Error('ต้องมีบัญชีของคุณอย่างน้อยหนึ่งบัญชี');
    const known=new Set(next.entries.map(e=>e.importKey).filter(Boolean));
    for(const original of source.entries){
      if(known.has(original.importKey)){skipped.push(original);continue}
      const entry={...original,id:idFactory(),account:accountIds.get(original.account)};
      if(entry.type==='transfer'){
        entry.toAccount=accountIds.get(original.toAccount);
        if(entry.account===entry.toAccount)throw new Error('คู่โอนถูกจับเป็นบัญชีเดียวกันที่แถว '+entry.sourceRows.join(', '));
        const problem=money.validateTransfer(next,entry);if(problem)throw new Error('แถว '+entry.sourceRows.join(', ')+': '+problem);
      }else{
        entry.category=mapping.categories[original.category]?.trim();
        if(!entry.category||entry.category.length>40||entry.category==='โอน')throw new Error('ตรวจหมวด '+original.category);
        if(!money.categories(next).includes(entry.category))next.categories=money.categories(next).concat(entry.category);
        if(next.accounts.find(a=>a.id===entry.account).kind==='borrower'){
          entry.direction=entry.type==='income'?'increase':'decrease';entry.type='adjustment';
        }
      }
      next.entries.push(entry);added.push(entry);known.add(entry.importKey);
    }
    next.entries.sort((a,b)=>a.date.localeCompare(b.date));
    return {next,added,skipped};
  }
};
if(typeof module!=='undefined')module.exports=ExcelImport;
