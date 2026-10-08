// Derived views only: no storage, entry mutation, or account balance rules.
const History = (() => {
  const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const dayMs = 86400000;
  const formatter = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit',calendar:'gregory',numberingSystem:'latn'});
  const pad = n => String(n).padStart(2,'0');
  const leap = y => y%4===0 && (y%100!==0 || y%400===0);
  const days = (y,m) => [31,leap(y)?29:28,31,30,31,30,31,31,30,31,30,31][m-1];
  function validKey(key) {
    if(typeof key!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(key))return false;
    const [y,m,d]=key.split('-').map(Number);
    return y>=1&&y<=9999&&m>=1&&m<=12&&d>=1&&d<=days(y,m);
  }
  function validMonth(key) {return typeof key==='string'&&/^\d{4}-\d{2}$/.test(key)&&validKey(key+'-01');}
  function utcDay(key) {
    const [y,m,d]=key.split('-').map(Number),date=new Date(0);
    date.setUTCFullYear(y,m-1,d);date.setUTCHours(0,0,0,0);return date.getTime();
  }
  function instantKey(date) {
    if(!Number.isFinite(date.getTime()))return null;
    const p=Object.fromEntries(formatter.formatToParts(date).map(p=>[p.type,p.value]));
    const key=p.year.padStart(4,'0')+'-'+p.month+'-'+p.day;
    return validKey(key)?key:null;
  }
  function parse(value) {
    if(typeof value!=='string')return null;
    const match=/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:?\d{2})?)?$/.exec(value);
    if(!match||!validKey(match[1]))return null;
    if(match[2]&&(Number(match[2])>23||Number(match[3])>59||Number(match[4]||0)>59))return null;
    if(match[6]&&match[6]!=='Z') {
      const offset=match[6].replace(':','');
      if(Number(offset.slice(1,3))>23||Number(offset.slice(3,5))>59)return null;
    }
    if(!match[6])return {key:match[1],explicit:false};
    const date=new Date(value.replace(' ','T'));
    const key=instantKey(date);return key?{key,explicit:true,date}:null;
  }
  function dayKey(value) {
    if(value instanceof Date)return instantKey(value);
    return parse(value)?.key||null;
  }
  function today(now=new Date()) {return dayKey(now);}
  function dateLabel(key,now=new Date(),full=false) {
    if(!validKey(key))return 'ไม่ระบุวันที่';
    const current=today(now);
    if(!full&&current) {
      if(key===current)return 'วันนี้';
      if(utcDay(current)-utcDay(key)===dayMs)return 'เมื่อวาน';
    }
    const [y,m,d]=key.split('-').map(Number);
    return d+' '+months[m-1]+(full||!current||key.slice(0,4)!==current.slice(0,4)?' '+(y+543):'');
  }
  function monthLabel(key) {if(!validMonth(key))return '';const [y,m]=key.split('-').map(Number);return months[m-1]+' '+(y+543);}
  function monthGrid(key) {
    if(!validMonth(key))return [];
    const [y,m]=key.split('-').map(Number),offset=(new Date(utcDay(key+'-01')).getUTCDay()+6)%7;
    const result=Array(offset).fill(null);
    for(let d=1;d<=days(y,m);d++)result.push(key+'-'+pad(d));
    while(result.length%7)result.push(null);return result;
  }
  function shiftMonth(key,delta) {
    if(!validMonth(key)||!Number.isSafeInteger(delta))return null;
    const [y,m]=key.split('-').map(Number),index=(y-1)*12+m-1+delta;
    if(index<0||index>=9999*12)return null;
    return String(Math.floor(index/12)+1).padStart(4,'0')+'-'+pad(index%12+1);
  }
  // Decimal parsing avoids binary multiplication errors, including exponent notation.
  function cents(value) {
    if((typeof value!=='number'&&typeof value!=='string')||String(value).trim()===''||!Number.isFinite(Number(value)))return null;
    const match=/^([+-]?)(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(String(value).trim());
    if(!match)return null;
    const fraction=match[3]||'',digits=match[2]+fraction,shift=Number(match[4]||0)-fraction.length+2;
    if(shift<0&&-shift>digits.length)return 0n;
    let amount;
    if(shift>=0)amount=BigInt(digits)*10n**BigInt(shift);
    else {const divisor=10n**BigInt(-shift);amount=(BigInt(digits)+divisor/2n)/divisor;}
    return match[1]==='-'?-amount:amount;
  }
  function money(value) {
    const negative=value<0n,absolute=negative?-value:value;
    const result=Number((negative?'-':'')+(absolute/100n)+'.'+String(absolute%100n).padStart(2,'0'));
    return Number.isFinite(result)?result:(negative?-Number.MAX_VALUE:Number.MAX_VALUE);
  }
  function summary(entries) {
    let income=0n,expense=0n;
    for(const entry of entries) {
      if(entry?.type!=='income'&&entry?.type!=='expense')continue;
      const amount=cents(entry.amount);if(amount===null||amount<0n)continue;
      if(entry.type==='income')income+=amount;else expense+=amount;
    }
    return {income:money(income),expense:money(expense),net:money(income-expense),count:entries.length};
  }
  function groupDays(entries) {
    const groups=new Map();
    for(const entry of entries) {const key=dayKey(entry?.date);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(entry);}
    return [...groups].sort(([a],[b])=>a===null?1:b===null?-1:b.localeCompare(a)).map(([key,list])=>({key,entries:list,...summary(list)}));
  }
  function monthEntries(entries,key) {return validMonth(key)?entries.filter(entry=>dayKey(entry?.date)?.slice(0,7)===key):[];}
  function moveDate(original,newKey) {
    if(!validKey(newKey))return null;
    const parsed=parse(original);
    if(parsed?.key===newKey)return original;
    if(parsed&&!parsed.explicit)return newKey+original.slice(10);
    if(parsed) {
      const shifted=new Date(parsed.date.getTime()+utcDay(newKey)-utcDay(parsed.key));
      return instantKey(shifted)===newKey?shifted.toISOString():null;
    }
    return new Date(utcDay(newKey)+5*3600000).toISOString(); // noon Bangkok
  }
  return {dayKey,today,dateLabel,monthLabel,monthGrid,shiftMonth,summary,groupDays,monthEntries,moveDate};
})();
if(typeof module!=='undefined')module.exports=History;
