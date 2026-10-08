// Derived chart data only. Weekly and History own date and monetary rules.
const Analytics = (() => {
  const commonJS = typeof module !== 'undefined' && module.exports;
  const history = commonJS ? require('./history.js') : History;
  const weekly = commonJS ? require('./weekly.js') : Weekly;
  function summarize(entries, monthKey) {
    const report = weekly.summarize(entries, monthKey);
    if (!report.weeks.length) return {...report, expenseTotal: report.expense, categories: [], incomeTotal: report.income, incomeCategories: []};
    const groups = {expense: new Map(), income: new Map()};
    for (const entry of Array.isArray(entries) ? entries : []) {
      if ((entry?.type !== 'expense' && entry?.type !== 'income') || history.dayKey(entry.date)?.slice(0, 7) !== monthKey) continue;
      const name = typeof entry.category === 'string' && entry.category.trim()
        ? entry.category : 'รอจัดหมวด';
      const group = groups[entry.type];
      if (!group.has(name)) group.set(name, []);
      group.get(name).push(entry);
    }
    const categoryData = type => [...groups[type]].map(([name, list]) => ({name, amount: history.summary(list)[type]}))
      .filter(category => category.amount > 0)
      .sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
      .map(category => ({...category, percentage: report[type] > 0 ? category.amount / report[type] * 100 : 0}));
    return {...report, expenseTotal: report.expense, categories: categoryData('expense'),
      incomeTotal: report.income, incomeCategories: categoryData('income')};
  }
  return {summarize};
})();
if (typeof module !== 'undefined') module.exports = Analytics;
