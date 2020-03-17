export default {
  emptyRule(val) {
    return val.length !== 0;
  },

  limitRule(val, min, max) {
    return min <= val.length && val.length <= max;
  },

  matchRule(val, pattern) {
    return val.match(pattern);
  },
};
