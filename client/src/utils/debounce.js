export const debounce = function (fn, t) {
  let timer;
  return function (...args) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      return fn(...args);
    }, t);
  };
};
