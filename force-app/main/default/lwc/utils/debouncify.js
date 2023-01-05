const debouncify = (fn, delay = 0) => {
  let timeoutId = null;
  return () => {
    clearTimeout(timeoutId);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn();
    }, delay);
  };
};

export { debouncify };
