const transform = (word) => {
  if (word.length > 0) {
    const firstLetter = word[0].toUpperCase();
    const remainder = word.substring(1).toLowerCase();
    return firstLetter + remainder;
  }
  return word;
};

const toTitleCase = (sentence) => {
  const words = sentence.split(' ');
  return words.map(transform).join(' ');
};

export { toTitleCase };
