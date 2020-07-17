export default (fn, delay) => {
  let timeoutId = null
  return () => {
    console.log('debouncer', timeoutId)
    clearTimeout(timeoutId)
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn()
    }, delay)
  }
}
