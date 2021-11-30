const nestleCompanies: string[] = [];
const letters = "abcdefghiklmnopqrstuvwxyz1234567890";
const normalize = (str: string) => {
  return Array.from(
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  )
    .filter((letter) => letters.includes(letter))
    .join("");
};
const startsWithAny = (test: string, prefixes: string[]) => {
  return prefixes.some((prefix) => test.startsWith(prefix));
};
const includesAny = (test: string, prefixes: string[]) => {
  return prefixes.some((prefix) => test.includes(prefix));
};
const getBrandName = (obj: any) => {
  if (!obj) {
    return undefined;
  }
  if (typeof obj.brand === "string") {
    return obj.brand;
  }
  //   if (typeof obj.name === "string") {
  //     return obj.name;
  //   }
  if (typeof obj?.item?.brand?.name === "string") {
    console.log(`found ${obj.item.brand.name}`);
    return obj.item.brand.name;
  }
  return undefined;
};
const getHasNestleBrand = (brandName: string) => {
  if (!brandName || typeof brandName !== "string") {
    return false;
  }
  const normalized = normalize(brandName);
  return startsWithAny(normalized, nestleCompanies);
};
const delimiter = "<$.$>";
const deleteNestlePaths = (obj: any) => {
  const paths = getNestlePaths(obj);
  if (paths.length > 0) {
    console.log(`Found ${paths.length} nestle products to block`);
  }
  const otherPaths: string[][] = [];
  let newObj = obj;
  const groupedPaths = paths.reduce(
    (acc, curr) => {
      const base = curr.slice(0, curr.length - 1);
      const last = curr[curr.length - 1];
      const index = base.join(delimiter);
      if (acc[index]) {
        acc[index].push(Number(last));
      } else if (Array.isArray(getRecursive(obj, base))) {
        acc[index] = [Number(last)];
      } else {
        otherPaths.push(curr);
      }
      return acc;
    },
    {} as {
      [k: string]: number[];
    }
  );
  Object.entries(groupedPaths).forEach(([path, indices]) => {
    const splitPath = path.split(delimiter);
    const v = getRecursive(obj, splitPath);
    const newV = v.filter(
      (_value: any, index: number) => !(indices as number[]).includes(index)
    );
    newObj = setRecursive(obj, splitPath, newV);
  });
  otherPaths.forEach((path) => {
    newObj = deleteRecursive(newObj, path);
  });
  return newObj;
};
const getNestlePaths = (obj: any) => {
  const paths: string[][] = [];
  const callback = (_key: string, value: any, path: string[]) => {
    const brandName = getBrandName(value);
    if (brandName) {
      console.debug(`found brandName: ${brandName}`);
      console.debug(value);
    }
    const hasNestleBrand = getHasNestleBrand(value);
    if (hasNestleBrand) {
      console.log(
        `Found nestle product: (product: ${value?.name}, brand: ${value?.brand})`
      );
    }
    if (hasNestleBrand) {
      paths.push(path);
    }
  };
  recurseObject(obj, callback, []);
  return paths;
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

export {
  deleteRecursive,
  setRecursive,
  getRecursive,
  recurseObject,
  getNestlePaths,
  deleteNestlePaths,
  getHasNestleBrand,
  getBrandName,
  includesAny,
  startsWithAny,
  normalize,
  nestleCompanies,
};
