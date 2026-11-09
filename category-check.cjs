// Synthetic data only. Optional user-choice metadata; no migration or balance changes.
const assert=require('node:assert/strict'),M=require('./dist/core.js');
const manual=(category,time='2024-03-01T00:00:00Z',type='expense',note='กาแฟ')=>({id:Math.random().toString(),type,note,category,amount:65,date:'2024-01-01',account:'cash',categoryChoice:'user',categoryChoiceAt:time});
const state=M.migrate({budget:30,accounts:[{id:'cash',opening:1000}],entries:[]});
const untouched=JSON.stringify(state);
assert.deepEqual(M.categorySuggestion(state,'กาแฟ'),{category:'อาหาร',source:'rule'});
assert.deepEqual(M.categorySuggestion(state,'ไม่รู้จัก'),{category:'รอจัดหมวด',source:'pending'});
assert.equal(JSON.stringify(state),untouched);
state.entries=[...Array.from({length:8},()=>manual('อาหาร')),...Array.from({length:2},()=>manual('อื่น ๆ','2025-01-01T00:00:00Z'))];
assert.equal(M.suggestCategory(state,'กาแฟ'),'อาหาร','frequency wins over newer minority');
state.entries=[manual('อาหาร'),manual('อื่น ๆ','2024-03-02T00:00:00Z')];
assert.equal(M.suggestCategory(state,'กาแฟ'),'อื่น ๆ','latest explicit choice breaks equal counts');
state.entries.push(...Array.from({length:100},()=>({...manual('อาหาร'),categoryChoice:undefined})));
assert.equal(M.suggestCategory(state,'กาแฟ'),'อื่น ๆ','auto/legacy choices cannot reinforce themselves');
state.entries.push(manual('เงินเดือน','2025-01-01T00:00:00Z','income'));
assert.equal(M.suggestCategory(state,'กาแฟ','income'),'เงินเดือน');
assert.equal(M.suggestCategory(state,'กาแฟ','expense'),'อื่น ๆ');
for(const type of ['transfer','adjustment']){state.entries.push(manual('อาหาร','2030-01-01T00:00:00Z',type));assert.equal(M.suggestCategory(state,'กาแฟ'),'อื่น ๆ')}
state.entries=[manual('อื่น ๆ','2024-03-01T00:00:00Z','expense','  COFFEE   SHOP ')];
assert.equal(M.suggestCategory(state,'coffee shop'),'อื่น ๆ');assert.equal(M.suggestCategory(state,'coffee shop extra'),'รอจัดหมวด');
assert.equal(M.suggestCategory(state,'ＣＯＦＦＥＥ SHOP'),'อื่น ๆ');
state.entries=[manual('อื่น ๆ')];
const cash=M.total(state),budget=state.budget;
assert.equal(M.saveCategory(state,'ร้านโปรด','อื่น ๆ','expense'),'');
assert.equal(M.suggestCategory(state,'กาแฟ'),'ร้านโปรด');
assert.equal(M.total(state),cash);assert.equal(state.budget,budget);
const migrated=M.migrate(JSON.parse(JSON.stringify(state)));assert.deepEqual(migrated,state);assert.equal(M.suggestCategory(migrated,'กาแฟ'),'ร้านโปรด');
state.entries=[];assert.equal(M.suggestCategory(state,'กาแฟ'),'อาหาร','deleting learned entries removes their votes');
state.entries=[manual('รอจัดหมวด')];assert.equal(M.suggestCategory(state,'กาแฟ'),'อาหาร');
console.log('PASS: explicit-only frequency, recent tie, no auto/legacy feedback, income/expense separation, transfer/adjustment exclusion, normalized exact notes, rename/delete/reload and unchanged balances/schema.');

// Category deletion: entries/templates fall back to pending, money untouched, defaults stay deleted after migrate.
{
  const s=M.migrate({budget:0,accounts:[{id:'cash',opening:500}],entries:[
    {id:'a',type:'expense',note:'ข้าว',category:'อาหารและเครื่องดื่ม',amount:50,date:'2024-01-01',account:'cash',categoryChoice:'user',categoryChoiceAt:'2024-01-01T00:00:00Z'},
    {id:'b',type:'income',note:'เงินเดือน',category:'เงินเดือน',amount:900,date:'2024-01-02',account:'cash'},
    {id:'t',type:'transfer',note:'โอน',category:'โอน',amount:5,date:'2024-01-03',account:'cash',toAccount:'cash'}],
    quickTemplates:[{id:'q',note:'ข้าว',amount:50,type:'expense',account:'cash',category:'อาหารและเครื่องดื่ม'}]});
  const total=M.total(s);
  assert.equal(M.deleteCategory(s,'รอจัดหมวด'),'รอจัดหมวดเป็นหมวดระบบ ลบไม่ได้');
  assert.equal(M.deleteCategory(s,'ไม่มีหมวดนี้'),'ไม่พบหมวดที่ต้องการลบ');
  assert.equal(M.categoryUsage(s,'อาหารและเครื่องดื่ม'),1);
  assert.equal(M.deleteCategory(s,'อาหารและเครื่องดื่ม'),'');
  assert.equal(s.entries[0].category,'รอจัดหมวด');assert.equal(s.entries[0].categoryChoice,undefined);
  assert.equal(s.quickTemplates[0].category,'รอจัดหมวด');assert.equal(s.entries[2].category,'โอน');
  assert.ok(!M.categories(s,'expense').includes('อาหารและเครื่องดื่ม'));assert.equal(M.total(s),total);
  assert.equal(M.deleteCategory(s,'เงินเดือน'),'');
  assert.ok(!M.categories(s,'income').includes('เงินเดือน'),'deleted default income category stays deleted');
  const again=M.migrate(JSON.parse(JSON.stringify(s)));
  assert.ok(!M.categories(again).includes('เงินเดือน')&&!M.categories(again).includes('อาหารและเครื่องดื่ม'));
  assert.equal(M.suggestCategory(again,'ข้าว','expense')==='อาหารและเครื่องดื่ม',false,'suggestions never return a deleted category');
  assert.equal(M.saveCategory(again,'เงินเดือน',null,'income'),'');assert.ok(M.categories(again,'income').includes('เงินเดือน'),'re-adding restores the name');
  console.log('PASS: category deletion moves entries to pending, keeps balances, stays deleted after reload');
}

// Review fixes: aliases, import, corrupt flag
{
 const M=require('./dist/core.js');
 const s=M.migrate({...M.createInitialState(),accounts:[{id:'c',name:'x',kind:'wallet',opening:0}],entries:[{id:'1',type:'expense',account:'c',amount:5,category:'อาหารและเครื่องดื่ม',note:'a',date:'2026-01-01'}]});
 s.categoryAliases={'อาหารและเครื่องดื่ม':'กิน'};s.categories=M.categories(s).concat('กิน');
 assert.equal(M.deleteCategory(s,'กิน'),'');
 assert.equal(s.categoryAliases['อาหารและเครื่องดื่ม'],undefined,'alias to deleted name removed');
 const bad=M.migrate({...M.createInitialState(),accounts:[],entries:[],deletedCategories:5});
 assert(Array.isArray(M.categories(bad)),'corrupt deletedCategories tolerated');
 console.log('PASS: alias cleanup on delete, corrupt deletedCategories tolerated');
}
