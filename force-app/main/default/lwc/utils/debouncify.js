const debouncify = (fn, delay) => {
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
