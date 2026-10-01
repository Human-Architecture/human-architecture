(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BodyLanguagePrice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const base = Object.freeze({yes: 2900, no: 4900});
  function calculate(member, friend, friendMember) {
    if (!(member in base) || !['yes', 'no'].includes(friend) || (friend === 'yes' && !(friendMember in base))) throw new Error('Invalid selection');
    const discount = friend === 'yes' ? 0.9 : 1;
    const first = Math.round(base[member] * discount);
    const second = friend === 'yes' ? Math.round(base[friendMember] * discount) : 0;
    return {first, second, total:first + second, discountApplied:friend === 'yes'};
  }
  return {calculate};
});
