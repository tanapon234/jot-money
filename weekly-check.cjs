const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Weekly = require('./dist/weekly.js');
const History = require('./dist/history.js');
const entry = (date, type, amount) => ({date, type, amount});
const ranges = key => Weekly.summarize([], key).weeks.map(({start, end}) => [start, end]);
assert.deepEqual(ranges('2026-10'), [
  ['2026-10-01', '2026-10-04'], ['2026-10-05', '2026-10-11'],
  ['2026-10-12', '2026-10-18'], ['2026-10-19', '2026-10-25'],
  ['2026-10-26', '2026-10-31']
]);
assert.equal(ranges('2021-02').length, 4);
assert.equal(ranges('2024-02').length, 5);
assert.equal(ranges('2026-03').length, 6);
assert.deepEqual(ranges('2024-02').at(-1), ['2024-02-26', '2024-02-29']);
const entries = [
  entry('2026-10-01', 'income', 500), entry('2026-10-05', 'expense', 400),
  entry('2026-10-31', 'expense', 250), entry('2026-10-12', 'transfer', 9000),
  entry('2026-10-19', 'adjustment', 9000), entry('2026-09-30', 'income', 1000),
  entry('2026-11-01', 'income', 1000), entry('2026-10-32', 'income', 1000),
  entry('invalid', 'expense', 1000), null
];
const before = JSON.stringify(entries);
entries.filter(Boolean).forEach(Object.freeze);
Object.freeze(entries);
const result = Weekly.summarize(entries, '2026-10');
assert.deepEqual([result.income, result.expense, result.net, result.count], [500, 650, -150, 5]);
assert.deepEqual(result.weeks.map(week => week.count), [1, 1, 1, 1, 1]);
for (const field of ['income', 'expense', 'net', 'count']) {
  assert.equal(result.weeks.reduce((sum, week) => sum + week[field], 0), result[field]);
}
assert.deepEqual({income:result.income, expense:result.expense, net:result.net, count:result.count},
  History.summary(History.monthEntries(entries, '2026-10')));
assert.equal(JSON.stringify(entries), before, 'Existing ledger must stay unchanged');
const decimals = Weekly.summarize([
  entry('2026-10-01', 'income', '0.105'), entry('2026-10-05', 'income', 0.2),
  entry('2026-10-12', 'expense', '1e-2'), entry('2026-10-19', 'income', -1),
  entry('2026-10-26', 'expense', 'bad')
], '2026-10');
assert.deepEqual([decimals.income, decimals.expense, decimals.net, decimals.count], [0.31, 0.01, 0.3, 5]);
for (const field of ['income', 'expense', 'net']) {
  assert.equal(Math.round(decimals.weeks.reduce((sum, week) => sum + week[field], 0) * 100), Math.round(decimals[field] * 100));
}
const boundary = [
  entry('2026-09-30T16:59:59Z', 'income', 1),
  entry('2026-09-30T17:00:00Z', 'income', 2),
  entry('2026-10-04T16:59:59Z', 'income', 4),
  entry('2026-10-04T17:00:00Z', 'income', 8),
  entry('2026-10-31T16:59:59Z', 'income', 16),
  entry('2026-10-31T17:00:00Z', 'income', 32)
];
const shifted = Weekly.summarize(boundary, '2026-10');
assert.equal(shifted.income, 30);
assert.deepEqual(shifted.weeks.map(week => week.income), [6, 8, 0, 0, 16]);
assert.equal(Weekly.summarize(boundary, '2026-09').income, 1);
assert.equal(Weekly.summarize(boundary, '2026-11').income, 32);
for (const key of ['', null, undefined, 202610, '2026-1', '2026-00', '2026-13', '0000-01', '10000-01', '2026-10-01']) {
  assert.deepEqual(Weekly.summarize(entries, key), {income: 0, expense: 0, net: 0, count: 0, weeks: []});
}
assert.equal(Weekly.summarize(null, '2026-10').weeks.length, 5);
assert.ok(Weekly.summarize([], '2026-03').weeks.every(week => week.count === 0 && week.net === 0));
assert.equal(Weekly.summarize([entry('2026-10-01T25:00:00Z', 'income', 1)], '2026-10').count, 0);
assert.equal(Weekly.summarize([entry('2024-02-29', 'income', 1)], '2024-02').count, 1);
assert.equal(Weekly.summarize([entry('0001-01-01', 'income', 1)], '0001-01').income, 1);
assert.equal(Weekly.summarize([entry('9999-12-31', 'income', 1)], '9999-12').income, 1);
const context = vm.createContext({Intl, Date});
vm.runInContext(fs.readFileSync(require.resolve('./dist/history.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(require.resolve('./dist/weekly.js'), 'utf8'), context);
assert.equal(vm.runInContext('Weekly.summarize([{date:"2026-10-01",type:"income",amount:5}],"2026-10").income', context), 5);
console.log('PASS: weekly ranges, 4/5/6 weeks, month totals, exclusions, cents, Bangkok boundaries, invalid inputs, immutable ledger and browser export.');
