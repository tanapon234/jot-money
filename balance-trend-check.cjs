const assert = require('node:assert/strict');
const Money = require('./dist/core.js');
const BalanceTrend = require('./dist/balance-trend.js');
const account = (id,opening=0,extra={}) => ({id,kind:'wallet',opening,...extra});
const entry = (date,type,amount,account='cash',extra={}) => ({date,type,amount,account,...extra});
const make = (accounts=[account('cash',100)],entries=[],start='2024-02-01') => {
  const state = {accounts,entries};state.balanceTracking = BalanceTrend.createTracking(state,start);return state;
};
const build = (state,extra={}) => BalanceTrend.build(state,{range:'month',anchor:'2024-02-10',today:'2024-02-10',...extra});

// History is reconstructed immediately, without tracking metadata or state writes.
const legacy = {accounts:[account('cash',100)],entries:[entry('2020-01-01','income',20)]};
assert.equal(build(legacy).reason,null);
assert.equal(build(legacy).currentBalance,120);
assert.equal(build(legacy).earliestDate,'2020-01-01');
assert.equal(build(legacy).mode,'reconstructed');
assert.equal(build(legacy).points.length,10);
const withoutMetadata=build(legacy);
legacy.balanceTracking = BalanceTrend.createTracking(legacy,'2024-02-10');
let chart = build(legacy);
assert.deepEqual(chart,withoutMetadata);
assert.equal(chart.change,0);assert.equal(chart.percent,0);
assert.equal(chart.baselineDate,'2024-01-31');
const backward=build({accounts:[account('cash',700)],entries:[
  entry('2024-02-09','transfer',20,'cash',{toAccount:'cash'}),
  entry('2024-02-10','income',500),entry('2024-02-10','expense',200),
]});
assert.equal(backward.currentBalance,1000);
assert.deepEqual(backward.points,[{date:'2024-02-09',balance:700},{date:'2024-02-10',balance:1000}]);
assert.equal(backward.baselineDate,'2024-02-09');
assert.equal(backward.change,300);

const state = make([account('cash',100),account('bank',50,{archived:true,deleted:true}),account('debt',999,{kind:'borrower'})],[
  entry('2024-02-01','income',20), entry('2024-02-02','expense',10),
  entry('2024-02-03','transfer',15,'cash',{toAccount:'bank'}),
  entry('2024-02-04','transfer',30,'cash',{toAccount:'debt'}),
  entry('2024-02-05','transfer',12,'debt',{toAccount:'bank'}),
  entry('2024-02-06','adjustment',5,'cash',{direction:'increase'}),
  entry('2024-02-07','adjustment',2,'bank',{direction:'decrease'}),
  entry('2024-02-08','adjustment',500,'debt',{direction:'increase'}),
  entry('2024-02-09','lend',7),entry('2024-02-10','repay',3),
  entry('2024-02-11','income',1000),
]);
chart = build(state);
assert.deepEqual(chart.points.map(p=>p.balance),[170,160,160,130,142,147,145,145,138,141]);
assert.equal(chart.currentBalance,141);assert.equal(chart.futureCount,1);
assert.equal(chart.currentBalance,Money.total({...state,entries:state.entries.filter(e=>e.date<='2024-02-10')}));
assert.equal(chart.baselineBalance,170);assert.equal(chart.change,-29);
assert.equal(chart.percent,-29/170*100);assert.equal(chart.partial,true);
const week = build(state,{range:'week',anchor:'2024-02-10'});
assert.equal(week.periodStart,'2024-02-05');assert.equal(week.periodEnd,'2024-02-11');
assert.equal(week.baselineDate,'2024-02-04');assert.equal(week.baselineBalance,130);assert.equal(week.change,11);

// Legacy signatures, start dates, and wallet changes never gate reconstructed data.
const renamed = structuredClone(state);
renamed.accounts.reverse();renamed.accounts.forEach(a=>{a.name='new';a.group='new';a.archived=!a.archived;delete a.deleted;});
assert.equal(build(renamed).reason,null);
renamed.accounts.find(a=>a.id==='debt').opening=12345;
assert.equal(build(renamed).reason,null);
for (const change of [s=>s.accounts[0].opening++,s=>s.accounts.push(account('new')),s=>s.accounts[0].id='other']) {
  const changed=structuredClone(state);change(changed);assert.equal(build(changed).reason,null);
  const reconstructed=build(changed);
  changed.balanceTracking=BalanceTrend.createTracking(changed,'2024-02-10');assert.deepEqual(build(changed),reconstructed);
}
assert.equal(build({...state,balanceTracking:{startDay:'invalid',signature:'old'}}).reason,null);

const decimal = make([account('cash',0.1)],[entry('2024-02-01','income',0.2),entry('2024-02-02','expense',0.1)]);
assert.equal(build(decimal).currentBalance,0.2);
assert.equal(build(decimal).change,-0.1);
assert.equal(build(make([account('cash',-10)])).percent,null);
assert.equal(build(make([account('cash',0)])).percent,null);
for (const opening of [-10,0]) {
  const nonpositive=build({accounts:[account('cash',opening)],entries:[entry('2024-02-01','income',0),entry('2024-02-02','income',5)]});
  assert.equal(nonpositive.change,5);assert.equal(nonpositive.percent,null);
}
const rounded=build({accounts:[account('cash','0.005')],entries:[entry('2024-02-01','income','1.005'),entry('2024-02-02','expense','0.005')]});
assert.equal(rounded.currentBalance,1.01);assert.equal(rounded.points[0].balance,1.02);
assert.equal(rounded.change,-0.01);
const timezone=make([account('cash',10)],[entry('2024-02-01T18:00:00Z','income',1)]);
assert.equal(build(timezone).earliestDate,'2024-02-02');assert.equal(build(timezone).points[0].balance,11);
const midnight=build({accounts:[account('cash',10)],entries:[entry('2024-02-09T16:59:59Z','income',1),entry('2024-02-09T17:00:00Z','expense',2)]});
assert.deepEqual(midnight.points,[{date:'2024-02-09',balance:11},{date:'2024-02-10',balance:9}]);

assert.equal(build(state,{today:'2024-02-30'}).reason,'invalid-date');
assert.equal(build(state,{range:'day'}).reason,'invalid-range');
assert.equal(build({...state,entries:[entry('bad','expense',1)]}).reason,'invalid-date');
assert.equal(build({...state,entries:[entry('2024-02-30','transfer',1,'cash',{toAccount:'bank'})]}).reason,'invalid-date');
assert.equal(build({...state,entries:[entry('bad','adjustment',1,'debt')]}).reason,null);
assert.equal(build({...state,entries:[entry('2024-02-01','income',NaN)]}).reason,'invalid-amount');
assert.equal(build({accounts:[],entries:[]}).reason,'no-accounts');
assert.equal(BalanceTrend.createTracking(state,'invalid'),null);
assert.equal(build(state,{anchor:'2024-01-01'}).reason,'empty-range');
assert.equal(build(state,{anchor:'2024-03-01'}).reason,'empty-range');
assert.equal(build(state,{today:'2024-03-01'}).points.length,29);
assert.equal(build(state,{today:'2024-03-01'}).periodEnd,'2024-02-29');
const year=build(make(undefined,[entry('2024-01-01','income',0)],'2024-01-01'),{range:'year',today:'2024-12-31'});
assert.equal(year.points.length,366);assert.equal(year.partial,false);
const boundary=build(make(undefined,[],'2023-01-01'),{range:'week',anchor:'2024-01-01'});
assert.equal(boundary.periodStart,'2024-01-01');assert.equal(boundary.periodEnd,'2024-01-07');
const yearBoundary=build({accounts:[account('cash',100)],entries:[entry('2023-12-31','income',5),entry('2024-01-01','expense',2)]},{anchor:'2024-01-01',today:'2024-01-01'});
assert.equal(yearBoundary.baselineDate,'2023-12-31');assert.equal(yearBoundary.baselineBalance,105);
assert.deepEqual(yearBoundary.points,[{date:'2024-01-01',balance:103}]);assert.equal(yearBoundary.change,-2);

// Rebuild after edit/delete/import; derived data is not cached and input is untouched.
const before=structuredClone(state);build(state);BalanceTrend.createTracking(state,'2024-02-10');assert.deepEqual(state,before);
const bare=structuredClone(legacy);delete bare.balanceTracking;const bareBefore=structuredClone(bare);build(bare);assert.deepEqual(bare,bareBefore);
const edited=structuredClone(state);edited.entries[0].amount=40;assert.equal(build(edited).currentBalance,161);
edited.entries.splice(0,1);assert.equal(build(edited).currentBalance,121);
edited.entries.push(entry('2024-02-01','income',9));assert.equal(build(edited).currentBalance,130);
const futureTransfer=make(undefined,[entry('2024-02-12','transfer',2,'cash',{toAccount:'cash'})]);
assert.equal(build(futureTransfer).futureCount,1);assert.equal(build(futureTransfer).currentBalance,100);
const empty=build({accounts:[account('cash',100)],entries:[]});
assert.equal(empty.earliestDate,'2024-02-10');
assert.deepEqual(empty.points,[{date:'2024-02-10',balance:100}]);
assert.equal(empty.change,null);assert.equal(empty.percent,null);
assert.equal(build(futureTransfer).earliestDate,'2024-02-10');
const unrelated=build({accounts:[account('cash',100),account('debt',500,{kind:'borrower'})],entries:[entry('2020-01-01','lend',5,'debt')]});
assert.equal(unrelated.earliestDate,'2024-02-10');
console.log('Balance trend checks passed');
