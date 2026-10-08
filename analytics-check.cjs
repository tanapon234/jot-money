const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Analytics = require('./dist/analytics.js');
const Weekly = require('./dist/weekly.js');
const entry = (date, type, amount, category) => ({date, type, amount, category});
const hostile = '<img src=x onerror=alert(1)>';
const entries = [
  entry('2026-10-01', 'income', 500, 'income'),
  entry('2026-10-01', 'expense', '400.10', 'Food'),
  entry('2026-10-05', 'expense', '199.90', 'Food'),
  entry('2026-10-12', 'expense', '20.10', 'Travel'),
  entry('2026-10-19', 'expense', '9.90', 'Travel'),
  entry('2026-10-26', 'expense', 10, undefined),
  entry('2026-10-26', 'expense', 10, hostile),
  entry('2026-10-01', 'expense', 0, 'Zero'),
  entry('2026-10-01', 'expense', -100, 'Negative'),
  entry('2026-10-01', 'expense', 'bad', 'Invalid'),
  entry('2026-10-01', 'transfer', 1000, 'Transfer'),
  entry('2026-10-01', 'adjustment', 1000, 'Adjustment'),
  entry('2026-11-01', 'expense', 1000, 'Next month'),
  entry('2026-10-32', 'expense', 1000, 'Bad date'), null
];
const before = JSON.stringify(entries);
entries.filter(Boolean).forEach(Object.freeze);
Object.freeze(entries);
const report = Analytics.summarize(entries, '2026-10');
assert.deepEqual([report.income, report.expense, report.net, report.expenseTotal], [500, 650, -150, 650]);
const {categories, expenseTotal, incomeTotal, incomeCategories, ...weekly} = report;
assert.equal(incomeTotal, 500);
assert.deepEqual(incomeCategories, [{name: 'income', amount: 500, percentage: 100}]);
assert.deepEqual(weekly, Weekly.summarize(entries, '2026-10'));
assert.equal(Math.round(categories.reduce((sum, category) => sum + category.amount, 0) * 100), 65000);
assert.ok(Math.abs(categories.reduce((sum, category) => sum + category.percentage, 0) - 100) < 1e-10);
assert.equal(categories[0].name, 'Food');assert.equal(categories[0].amount, 600);
assert.equal(categories[1].name, 'Travel');assert.equal(categories[1].amount, 30);
assert.equal(categories.find(category => category.name === hostile).amount, 10);
assert.equal(categories.find(category => category.name === 'รอจัดหมวด').amount, 10);
assert.equal(JSON.stringify(entries), before);
const ties = Analytics.summarize(['C', 'A', 'B'].map(name => entry('2026-10-01', 'expense', 1, name)), '2026-10');
assert.deepEqual(ties.categories.map(category => category.name), ['A', 'B', 'C']);
const decimals = Analytics.summarize([
  entry('2026-10-01', 'expense', '0.105', 'A'), entry('2026-10-05', 'expense', '0.2', 'A'),
  entry('2026-10-12', 'expense', '1e-2', 'B'), entry('2026-10-19', 'expense', '0.004', 'Zero')
], '2026-10');
assert.equal(decimals.expenseTotal, 0.32);
assert.deepEqual(decimals.categories.map(category => [category.name, category.amount]), [['A', 0.31], ['B', 0.01]]);
const fallback = Analytics.summarize([
  entry('2026-10-01', 'expense', 1, ''), entry('2026-10-01', 'expense', 2, '   '),
  entry('2026-10-01', 'expense', 3, null)
], '2026-10');
assert.deepEqual(fallback.categories, [{name: 'รอจัดหมวด', amount: 6, percentage: 100}]);
for (const source of [[], null, [entry('2026-10-01', 'income', 50, 'Income')],
  [entry('2026-10-01', 'transfer', 50, 'Transfer')], [entry('2026-10-01', 'expense', 0, 'Zero')]]) {
  const empty = Analytics.summarize(source, '2026-10');
  assert.equal(empty.expenseTotal, 0);assert.deepEqual(empty.categories, []);assert.equal(empty.weeks.length, 5);
}
const boundary = Analytics.summarize([
  entry('2026-09-30T16:59:59Z', 'expense', 1, 'Before'),
  entry('2026-09-30T17:00:00Z', 'expense', 2, 'Start'),
  entry('2026-10-31T16:59:59Z', 'expense', 4, 'End'),
  entry('2026-10-31T17:00:00Z', 'expense', 8, 'After'),
  entry('invalid', 'expense', 16, 'Invalid')
], '2026-10');
assert.equal(boundary.expenseTotal, 6);
assert.deepEqual(boundary.categories.map(category => category.name), ['End', 'Start']);
for (const key of ['', null, undefined, '2026-1', '2026-13', '0000-01', '2026-10-01']) {
  assert.deepEqual(Analytics.summarize(entries, key), {income: 0, expense: 0, net: 0, count: 0, weeks: [], expenseTotal: 0, categories: [], incomeTotal: 0, incomeCategories: []});
}
const incomeEntries = [
  entry('2026-09-30T17:00:00Z', 'income', '0.105', 'Salary'),
  entry('2026-10-05', 'income', '0.2', 'Salary'),
  entry('2026-10-31T16:59:59Z', 'income', '1e-2', 'Bonus'),
  entry('2026-10-01', 'income', 1, ''), entry('2026-10-01', 'income', 2, null),
  entry('2026-10-01', 'income', 1, hostile),
  entry('2026-09-30T16:59:59Z', 'income', 100, 'Before'),
  entry('2026-10-31T17:00:00Z', 'income', 100, 'After'),
  entry('invalid', 'income', 100, 'Invalid date'),
  entry('2026-10-01', 'income', -1, 'Negative'),
  entry('2026-10-01', 'income', 'bad', 'Invalid amount'),
  entry('2026-10-01', 'income', '0.004', 'Rounded zero'),
  entry('2026-10-01', 'transfer', 100, 'Salary'),
  entry('2026-10-01', 'adjustment', 100, 'Salary'),
  entry('2026-10-01', 'expense', 100, 'Salary')
];
const incomeBefore = JSON.stringify(incomeEntries);
incomeEntries.forEach(Object.freeze);Object.freeze(incomeEntries);
const incomeReport = Analytics.summarize(incomeEntries, '2026-10');
assert.equal(incomeReport.incomeTotal, 4.32);
assert.equal(incomeReport.incomeTotal, incomeReport.income);
assert.deepEqual(incomeReport.incomeCategories.map(category => [category.name, category.amount]),
  [['รอจัดหมวด', 3], [hostile, 1], ['Salary', 0.31], ['Bonus', 0.01]]);
assert.equal(Math.round(incomeReport.incomeCategories.reduce((sum, category) => sum + category.amount, 0) * 100), 432);
assert.ok(Math.abs(incomeReport.incomeCategories.reduce((sum, category) => sum + category.percentage, 0) - 100) < 1e-10);
assert.equal(JSON.stringify(incomeEntries), incomeBefore);
const incomeTies = Analytics.summarize(['C', 'A', 'B'].map(name => entry('2026-10-01', 'income', 1, name)), '2026-10');
assert.deepEqual(incomeTies.incomeCategories.map(category => category.name), ['A', 'B', 'C']);
for (const source of [[], null, [entry('2026-10-01', 'expense', 5, 'Expense')],
  [entry('2026-10-01', 'transfer', 5, 'Transfer')], [entry('2026-10-01', 'income', 0, 'Zero')]]) {
  const empty = Analytics.summarize(source, '2026-10');
  assert.equal(empty.incomeTotal, 0);assert.deepEqual(empty.incomeCategories, []);
}
const context = vm.createContext({Intl, Date});
for (const file of ['history.js', 'weekly.js', 'analytics.js']) {
  vm.runInContext(fs.readFileSync(require.resolve('./dist/' + file), 'utf8'), context);
}
assert.equal(vm.runInContext('Analytics.summarize([{date:"2026-10-01",type:"expense",amount:5,category:"A"}],"2026-10").categories[0].amount', context), 5);
assert.equal(vm.runInContext('Analytics.summarize([{date:"2026-10-01",type:"income",amount:5,category:"A"}],"2026-10").incomeCategories[0].amount', context), 5);
console.log('PASS: income/expense monthly chart totals, category grouping/ties/percentages, decimals, exclusions, empty states, Bangkok boundaries, invalid inputs, immutable names/ledger and browser export.');
