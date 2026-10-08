const XLSX=require('./dist/vendor/xlsx-0.20.3.min.js');

const borrowerNames=['TestBorrower A','TestBorrower B'];
const walletNames=['Cash','Bank Accounts(MyMo)',...Array.from({length:12},(_,i)=>`TestWallet ${String(i+1).padStart(2,'0')}`)];
const accounts=[...walletNames,...borrowerNames];
const headers=['ระยะเวลา','ทรัพย์สิน','หมวดหมู่','หมวดย่อย','เนื้อหา','THB','รายรับ/รายได้','บันทึกเพิ่มเติม','เงินตรา'];
const income='รายรับ',expense='รายจ่าย';
const transferOut='รายจ่ายจากการโอน',transferIn='รายรับจากการโอน';
const rows=[];
for(let i=0;i<506;i++){
  const account=walletNames[i%walletNames.length],kind=i%2?expense:income;
  rows.push([46299.93760416667+i/86400,account,kind===income?'Test income':'Test expense',i%2?'Food':'Work',`Ordinary ${i+1}`,1+(i%97)/100,kind,`Synthetic row ${i+1}`,'THB']);
}
for(let i=0;i<3;i++){
  const account=borrowerNames[i%borrowerNames.length],kind=i===1?expense:income;
  rows.push([46310.25+i/86400,account,kind===income?'Borrower advance':'Borrower repayment','Borrower',`Borrower ${i+1}`,20+i,kind,`Synthetic borrower ${i+1}`,'THB']);
}
for(let i=0;i<111;i++){
  const from=walletNames[i%walletNames.length],to=i%5===0?borrowerNames[i%2]:walletNames[(i+1)%walletNames.length];
  const date=46320+i/86400,amount=2+(i%89)/100,note=`Transfer ${i+1}`;
  rows.push([date,from,to,'Transfer',note,amount,transferOut,'','THB']);
  rows.push([date,to,from,'Transfer',note,amount,transferIn,'','THB']);
}
if(rows.length!==731)throw new Error(`Synthetic fixture row count changed: ${rows.length}`);
const sheet=XLSX.utils.aoa_to_sheet([headers,...rows]);
const bytes=XLSX.write({SheetNames:['Synthetic'],Sheets:{Synthetic:sheet}},{type:'buffer',bookType:'xlsx'});
module.exports={bytes,borrowerNames};
