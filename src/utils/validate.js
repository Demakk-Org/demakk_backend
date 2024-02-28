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

  return true;
}

export const camelize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
