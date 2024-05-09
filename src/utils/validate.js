import { isValidObjectId } from "mongoose";

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

  let notType = true;

  arr?.forEach((element) => {
    if (type == "ObjectId" && !isValidObjectId(element)) {
      notType = false;
    } else if (typeof element != type) {
      notType = false;
    }
  });

  return notType;
}

export const camelize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function deepEqual(x, y) {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
}
