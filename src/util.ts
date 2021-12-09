import { NestleBrandGetter } from "./nestle-product";

const normalize = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f|®]/g, "")
    .trim();
};
const startsWithAny = (test: string, prefixes: string[]) => {
  return prefixes.some((prefix) => test.startsWith(prefix));
};
const includesAny = (test: string, prefixes: string[]) => {
  return prefixes.find(
    (prefix) =>
      test === prefix ||
      test.startsWith(prefix + " ") ||
      test.includes(" " + prefix + " ")
  );
};
type RecursiveCallback = (key: string, value: any, path: string[]) => void;
const recurseObject = (
  obj: any,
  callback: RecursiveCallback,
  path: string[]
) => {
  if (!obj) {
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...path, key];
    callback(key, value, newPath);
    if (typeof value === "object") {
      recurseObject(value, callback, newPath);
    }
  }
};

const setRecursive = (obj: any, path: string[], value: any) => {
  if (path.length > 1) {
    const [first, ...rest] = path;
    setRecursive(obj[first], rest, value);
  } else {
    obj[path[0]] = value;
  }
  return obj;
};
const getRecursive = (obj: any, path: string[]): any => {
  if (!obj) {
    return undefined;
  }
  if (path.length > 1) {
    const [first, ...rest] = path;
    return getRecursive(obj[first], rest);
  } else {
    return obj[path[0]];
  }
};
const deleteRecursive = (obj: any, path: string[]) => {
  if (path.length === 2 && Array.isArray(obj[path[0]])) {
    const index = Number(path[1]);
    const newObjPath0 = obj[path[0]].filter((v: any, i: number) => i !== index);
    obj[path[0]] = newObjPath0;
  } else if (path.length > 1) {
    const [first, ...rest] = path;
    deleteRecursive(obj[first], rest);
  } else {
    delete obj[path[0]];
  }
  return obj;
};
function getHasNestleBrand(brandName: string | undefined) {
  if (!brandName || typeof brandName !== "string") {
    return false;
  }
  const normalized = normalize(brandName);
  const brands = NestleBrandGetter.getBrands();
  const startsWithNestle = includesAny(normalized, brands);
  console.debug(normalized, startsWithNestle);
  return startsWithNestle;
}
export {
  deleteRecursive,
  setRecursive,
  getRecursive,
  recurseObject,
  includesAny,
  startsWithAny,
  normalize,
  getHasNestleBrand,
};
