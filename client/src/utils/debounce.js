export const debounce = function (fn, t) {
  let timer;
  return function (...args) {
    if (timer !== undefined) {
      console.log("debounced");
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      return fn(...args);
    }, t);
  };
};
