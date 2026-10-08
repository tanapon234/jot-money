// Derived month/week views. History owns Bangkok date handling and cent arithmetic.
const Weekly = (() => {
  const history = typeof module !== 'undefined' && module.exports
    ? require('./history.js') : History;
  function summarize(entries, monthKey) {
    const grid = history.monthGrid(monthKey);
    if (!grid.length) return {...history.summary([]), weeks: []};
    const selected = [];
    const weeks = [];
    const buckets = [];
    for (let offset = 0; offset < grid.length; offset += 7) {
      const days = grid.slice(offset, offset + 7).filter(Boolean);
      weeks.push({start: days[0], end: days[days.length - 1]});
      buckets.push([]);
    }
    for (const entry of Array.isArray(entries) ? entries : []) {
      const key = history.dayKey(entry?.date);
      if (!key || key.slice(0, 7) !== monthKey) continue;
      const index = weeks.findIndex(week => key >= week.start && key <= week.end);
      if (index < 0) continue;
      selected.push(entry);
      buckets[index].push(entry);
    }
    return {
      ...history.summary(selected),
      weeks: weeks.map((week, index) => ({...week, ...history.summary(buckets[index])}))
    };
  }
  return {summarize};
})();
if (typeof module !== 'undefined') module.exports = Weekly;
