// Synthetic fixtures only; no browser storage, user files, or external dependencies.
const assert = require('node:assert/strict');
const M = require('./dist/core.js');

const expense = ['อาหารและเครื่องดื่ม', 'เดินทางและรถ', 'บ้านและบิล', 'ซื้อของและของใช้', 'สุขภาพ', 'การศึกษา', 'บันเทิงและท่องเที่ยว', 'ครอบครัวและสัตว์เลี้ยง', 'รายจ่ายอื่น ๆ'];
const income = ['เงินเดือน', 'รายได้เสริม', 'ขายของ', 'ผลตอบแทนและดอกเบี้ย', 'ของขวัญและเงินช่วยเหลือ', 'รายรับอื่น ๆ'];
const pending = 'รอจัดหมวด';
const initial = M.createInitialState();
assert.equal(initial.budget, 0);
assert.deepEqual(initial.accounts, []);
assert.deepEqual(initial.entries, []);
assert.equal(initial.categoryPreset, 'general-v1');
assert.deepEqual(initial.categories, [pending, ...expense, ...income]);
for (const name of expense) assert.deepEqual(initial.categoryTypes[name], ['expense'], name);
for (const name of income) assert.deepEqual(initial.categoryTypes[name], ['income'], name);
assert.deepEqual(M.categories(initial, 'expense'), [pending, ...expense]);
assert.deepEqual(M.categories(initial, 'income'), [pending, ...income]);
assert.equal(M.total(initial), 0);

const anotherInitial = M.createInitialState();
anotherInitial.categories.push('fixture-only');
anotherInitial.categoryTypes[expense[0]].push('income');
anotherInitial.accounts.push({id:'fixture', opening:99});
assert.deepEqual(initial.categories, [pending, ...expense, ...income], 'fresh states own their category arrays');
assert.deepEqual(initial.categoryTypes[expense[0]], ['expense'], 'fresh states own nested type arrays');
assert.deepEqual(initial.accounts, [], 'fresh states own their account arrays');
const initialSnapshot = structuredClone(initial);
const fresh = M.migrate(initial);
assert.deepEqual(initial, initialSnapshot, 'migration leaves its input untouched');
assert.equal(fresh.schemaVersion, 2);
assert.equal(fresh.categoryPreset, 'general-v1');
assert.deepEqual(fresh.categories, initial.categories);
assert.deepEqual(M.migrate(fresh), fresh, 'new preset migration is idempotent');
const freshSnapshot = structuredClone(fresh);
for (const [note, expected] of [
  ['กาแฟ', 'อาหารและเครื่องดื่ม'],
  ['ลูกชิ้น', 'อาหารและเครื่องดื่ม'],
  ['น้ำมัน', 'เดินทางและรถ'],
  ['ค่าไฟ', 'บ้านและบิล'],
  ['โรงพยาบาล', 'สุขภาพ'],
  ['ค่าเรียน', 'การศึกษา']
]) assert.equal(M.suggestCategory(fresh, note, 'expense'), expected, note);
for (const [note, expected] of [
  ['เงินเดือน', 'เงินเดือน'],
  ['ขายของ', 'ขายของ'],
  ['ดอกเบี้ย', 'ผลตอบแทนและดอกเบี้ย']
]) assert.equal(M.suggestCategory(fresh, note, 'income'), expected, note);
assert.equal(M.suggestCategory(fresh, 'คำที่ไม่อยู่ในกฎ'), pending);
assert.equal(M.suggestCategory(fresh, 'กาแฟ', 'income'), pending);
assert.deepEqual(fresh, freshSnapshot, 'suggestions do not mutate state');

const learned = M.migrate(M.createInitialState());
learned.accounts.push({id:'cash-fixture', kind:'wallet', group:'cash', opening:500});
learned.entries.push({id:'choice-fixture', account:'cash-fixture', type:'expense', category:'ซื้อของและของใช้', note:'กาแฟ', amount:65, date:'2025-01-01', categoryChoice:'user', categoryChoiceAt:'2025-01-01T12:00:00Z'});
const learnedTotal = M.total(learned);
assert.deepEqual(M.categorySuggestion(learned, 'กาแฟ'), {category:'ซื้อของและของใช้', source:'learned'});
assert.equal(M.saveCategory(learned, 'ของใช้ประจำ', 'ซื้อของและของใช้', 'expense'), '');
assert.equal(learned.entries[0].category, 'ของใช้ประจำ');
assert.equal(learned.entries[0].categoryChoice, 'user');
assert.equal(learned.entries[0].categoryChoiceAt, '2025-01-01T12:00:00Z');
assert.deepEqual(M.categorySuggestion(learned, 'กาแฟ'), {category:'ของใช้ประจำ', source:'learned'});
assert.equal(M.saveCategory(learned, 'กินดื่มใหม่', 'อาหารและเครื่องดื่ม', 'expense'), '');
assert.equal(M.suggestCategory(learned, 'ลูกชิ้น'), 'กินดื่มใหม่', 'general preset rule follows category rename');
assert.ok(!M.categories(learned).includes('อาหารและเครื่องดื่ม'), 'renaming a preset does not resurrect its original label');
assert.ok(!M.categories(learned, 'income').includes('กินดื่มใหม่'));
assert.equal(learned.categoryPreset, 'general-v1');
assert.equal(M.total(learned), learnedTotal);
assert.equal(learned.budget, 0);
assert.deepEqual(M.migrate(JSON.parse(JSON.stringify(learned))), learned);
assert.deepEqual(M.categorySuggestion(M.migrate(learned), 'กาแฟ'), {category:'ของใช้ประจำ', source:'learned'});

const legacyInput = {
  budget: 456.75,
  accounts: [{id:'cash', name:'เงินสด', kind:'wallet', group:'cash', opening:1000}],
  categories: [pending, 'กินดื่มเดิม', 'หมวดส่วนตัว', 'รายได้ส่วนตัว'],
  categoryAliases: {อาหาร:'กินดื่มเดิม'},
  categoryTypes: {'หมวดส่วนตัว':['expense'], 'รายได้ส่วนตัว':['income']},
  entries: [
    {id:'expense-fixture', account:'cash', type:'expense', category:'กินดื่มเดิม', note:'กาแฟ', amount:65.25, date:'2025-01-01'},
    {id:'income-fixture', account:'cash', type:'income', category:'รายได้ส่วนตัว', note:'ค่าจ้าง fixture', amount:100.50, date:'2025-01-02'}
  ]
};
const legacySnapshot = structuredClone(legacyInput);
const legacyTotal = M.total(legacyInput);
const legacy = M.migrate(legacyInput);
assert.deepEqual(legacyInput, legacySnapshot);
assert.equal(legacy.schemaVersion, 2);
assert.equal(Object.hasOwn(legacy, 'categoryPreset'), false, 'existing users are not assigned the new preset');
assert.equal(legacy.budget, legacyInput.budget);
assert.equal(M.total(legacy), legacyTotal);
assert.deepEqual(legacy.accounts, legacyInput.accounts);
assert.deepEqual(legacy.entries, legacyInput.entries, 'retain every historical field and amount');
assert.deepEqual(legacy.categoryAliases, legacyInput.categoryAliases);
assert.deepEqual(legacy.categoryTypes, legacyInput.categoryTypes);
for (const name of legacyInput.categories) assert.ok(legacy.categories.includes(name), name);
assert.equal(M.suggestCategory(legacy, 'กาแฟ'), 'กินดื่มเดิม');
assert.ok(M.categories(legacy, 'expense').includes('หมวดส่วนตัว'));
assert.ok(!M.categories(legacy, 'income').includes('หมวดส่วนตัว'));
assert.ok(M.categories(legacy, 'income').includes('รายได้ส่วนตัว'));
assert.ok(!M.categories(legacy, 'expense').includes('รายได้ส่วนตัว'));
assert.ok(!legacy.categories.includes('อาหารและเครื่องดื่ม'));
assert.deepEqual(M.migrate(legacy), legacy);

for (const input of [
  {budget:0, accounts:[], entries:[]},
  {budget:0, accounts:[], entries:[], categories:[]}
]) {
  const emptyLegacy = M.migrate(input);
  assert.equal(Object.hasOwn(emptyLegacy, 'categoryPreset'), false);
  assert.ok(!emptyLegacy.categories.includes('อาหารและเครื่องดื่ม'), 'empty saved ledgers are still existing users');
  assert.equal(M.suggestCategory(emptyLegacy, 'กาแฟ'), input.categories ? pending : 'อาหาร');
  assert.deepEqual(M.migrate(emptyLegacy), emptyLegacy);
}
const legacyDefaults = M.migrate({budget:0, accounts:[], entries:[]});
for (const name of M.defaultCategories) assert.ok(legacyDefaults.categories.includes(name), name);
assert.equal(M.suggestCategory(legacyDefaults, 'น้ำมัน'), 'น้ำมัน');
console.log('PASS: new-user general preset, explicit income/expense types, independent fresh states, rules, schema 2, idempotence, and retained legacy defaults/aliases/custom types/history/balances/budget (including empty saved ledgers).');
