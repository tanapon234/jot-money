// Daily end-of-day cash in all own wallets. Pure derived data; never writes state.
const BalanceTrend = (() => {
  const history = typeof module !== 'undefined' ? require('./history.js') : History;
  const moneyRules = typeof module !== 'undefined' ? require('./core.js') : Money;
  const dayMs = 86400000;
  const validDay = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && history.dayKey(value) === value;
  const utc = key => {const date = new Date(0);const [y,m,d] = key.split('-').map(Number);date.setUTCFullYear(y,m-1,d);date.setUTCHours(0,0,0,0);return date;};
  const keyOf = date => date.toISOString().slice(0,10);
  const shift = (key, count) => keyOf(new Date(utc(key).getTime() + count * dayMs));
  // Same exact decimal-cent rounding used by History, without floating accumulation.
  function cents(value) {
    if ((typeof value !== 'number' && typeof value !== 'string') || !String(value).trim() || !Number.isFinite(Number(value))) return null;
    const match = /^([+-]?)(\d+)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(String(value).trim());
    if (!match) return null;
    const fraction = match[3] || '', digits = match[2] + fraction, power = Number(match[4] || 0) - fraction.length + 2;
    let result;
    if (power < 0 && -power > digits.length) result = 0n;
    else if (power >= 0) result = BigInt(digits) * 10n ** BigInt(power);
    else {const divisor = 10n ** BigInt(-power);result = (BigInt(digits) + divisor / 2n) / divisor;}
    return match[1] === '-' ? -result : result;
  }
  const baht = value => Number(value) / 100;
  const wallets = state => (state.accounts || []).filter(account => account.kind !== 'borrower');
  function signature(state) {
    // Legacy metadata helper retained for callers; build never gates on it.
    return JSON.stringify(wallets(state).map(account => [account.id, cents(account.opening)?.toString() ?? null])
      .sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b))));
  }
  function createTracking(state, today = history.today()) {
    if (!validDay(today) || !wallets(state).length) return null;
    return {startDay:today, signature:signature(state)};
  }
  function period(range, anchor) {
    if (range === 'week') {const start = shift(anchor, -(utc(anchor).getUTCDay() + 6) % 7);return [start,shift(start,6)];}
    if (range === 'month') {const start = anchor.slice(0,7) + '-01';const date = utc(start);date.setUTCMonth(date.getUTCMonth()+1);date.setUTCDate(0);return [start,keyOf(date)];}
    return [anchor.slice(0,4)+'-01-01',anchor.slice(0,4)+'-12-31'];
  }
  /*
   * build(state,{range,anchor,today}) returns:
   * periodStart/periodEnd: entire calendar period (week is Monday–Sunday).
   * start/end: period clipped to earliestDate and today, or null.
   * earliestDate: earliest relevant recorded day through today, or today if empty.
   * points: reconstructed daily closing {date,balance} in baht.
   * currentBalance: all openings + dated ledger through today, never future entries.
   * futureCount: own-wallet-related entries dated after today (even net-zero transfers).
   * reason: null, no-accounts, invalid-date,
   *         invalid-amount, invalid-range, or empty-range. Unavailable values are null.
   * partial: true when either calendar-period edge is clipped.
   * baselineDate/baselineBalance: preceding day if >= earliestDate, else first point.
   * change: last closing minus baseline in baht; percent: percentage of a positive
   * baseline only. Both null for a single point without an earlier baseline.
   * Historical cash reverses recorded deltas from current cash, assuming all current
   * openings existed throughout. Missing records or account opening dates can distort
   * the reconstruction; it is not verified historical cash. Legacy metadata is ignored.
   */
  function build(state, options = {}) {
    // Keep this module's cash scope tied to Money's public definition.
    if (typeof moneyRules.total !== 'function') throw new Error('Money.total is required');
    const today = options.today ?? history.today(), anchor = options.anchor ?? today, range = options.range ?? 'month';
    const result = {range,periodStart:null,periodEnd:null,start:null,end:null,points:[],currentBalance:null,futureCount:0,
      reason:null,mode:'reconstructed',earliestDate:null,partial:false,baselineDate:null,baselineBalance:null,change:null,percent:null};
    if (!validDay(today) || !validDay(anchor)) return {...result,reason:'invalid-date'};
    if (!['week','month','year'].includes(range)) return {...result,reason:'invalid-range'};
    [result.periodStart,result.periodEnd] = period(range,anchor);
    const own = wallets(state), ids = new Set(own.map(account => account.id));
    if (!own.length) return {...result,reason:'no-accounts'};
    let opening = 0n;
    for (const account of own) {const value = cents(account.opening);if (value === null) return {...result,reason:'invalid-amount'};opening += value;}
    const deltas = new Map();
    let earliest = today;
    for (const entry of state.entries || []) {
      if (!['income','expense','transfer','lend','repay','adjustment'].includes(entry.type)) continue;
      const from = ids.has(entry.account), to = entry.type === 'transfer' && ids.has(entry.toAccount);
      if (!from && !to) continue;
      const day = history.dayKey(entry.date);
      if (!day) return {...result,reason:'invalid-date'};
      if (day > today) {result.futureCount++;continue;}
      if (day < earliest) earliest = day;
      const amount = cents(entry.amount);
      if (amount === null) return {...result,reason:'invalid-amount'};
      let factor;
      if (entry.type === 'transfer') factor = Number(to) - Number(from);
      else if (entry.type === 'adjustment') factor = entry.direction === 'increase' ? 1 : -1;
      else factor = entry.type === 'income' || entry.type === 'repay' ? 1 : -1;
      deltas.set(day,(deltas.get(day) || 0n) + amount * BigInt(factor));
    }
    let current = opening;
    for (const delta of deltas.values()) current += delta;
    result.currentBalance = baht(current);
    result.earliestDate = earliest;
    const start = result.periodStart > earliest ? result.periodStart : earliest;
    const end = result.periodEnd < today ? result.periodEnd : today;
    result.partial = start !== result.periodStart || end !== result.periodEnd;
    if (start > end) return {...result,reason:'empty-range'};
    result.start = start;result.end = end;
    let balance = current;
    for (const [day,delta] of deltas) if (day >= start) balance -= delta;
    const previous = shift(start,-1);
    const previousAvailable = validDay(previous) && previous >= earliest;
    if (previousAvailable) {result.baselineDate = previous;result.baselineBalance = baht(balance);}
    let baseline = previousAvailable ? balance : null;
    for (let date = start; date <= end; date = shift(date,1)) {
      balance += deltas.get(date) || 0n;
      result.points.push({date,balance:baht(balance)});
      if (baseline === null) {baseline = balance;result.baselineDate = date;result.baselineBalance = baht(balance);}
      if (date === end) break; // Also avoid stepping beyond supported year 9999.
    }
    if (previousAvailable || result.points.length > 1) {
      const change = balance - baseline;result.change = baht(change);
      if (baseline > 0n) result.percent = Number(change) / Number(baseline) * 100;
    }
    return result;
  }
  return {createTracking,build};
})();
if (typeof module !== 'undefined') module.exports = BalanceTrend;
