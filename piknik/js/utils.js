const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const utils = {};

utils.shuffled = function (arr) {
  const newArr = [...arr];
  let currentIndex = newArr.length;
  let randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArr[currentIndex], newArr[randomIndex]] = [newArr[randomIndex], newArr[currentIndex]];
  }
  return newArr;
};

utils.randomChoose = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

utils.charCount = function (word) {
  return [...word].reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});
};

utils.bringToFront = function (arr, key) {
  // modifies array in place! no duplicate ..
  if (typeof key === 'string' || typeof key === 'number') {
    arr.unshift(...arr.splice(arr.indexOf(key), 1));
  } else if (typeof key === 'function') {
    arr.unshift(...arr.splice(arr.findIndex(key), 1));
  }
};
