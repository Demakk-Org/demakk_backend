export function isDateValid(dateStr) {
  return !isNaN(new Date(dateStr));
}

export function isArr(arr, type) {
  if (!arr) {
    return false;
  }

  if (!type) {
    if (!Array.isArray(arr)) {
      return false;
    }
  }

  arr?.forEach((element) => {
    if (typeof element != type) {
      return false;
    }
  });
}
