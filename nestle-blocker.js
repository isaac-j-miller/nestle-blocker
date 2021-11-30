const nestleCompanies = [];
const letters = "abcdefghiklmnopqrstuvwxyz1234567890";
const normalize = (str) => {
  return Array.from(
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  )
    .filter((letter) => letters.includes(letter))
    .join("");
};
const startsWithAny = (test, prefixes) => {
  return prefixes.some((prefix) => test.startsWith(prefix));
};
const getHasNestleBrand = (obj) => {
  if (typeof obj?.brand !== "string") {
    return false;
  }
  const normalized = normalize(obj.brand);
  return startsWithAny(normalized, nestleCompanies);
};
const delimiter = "<$.$>";
const deleteNestlePaths = (obj) => {
  const paths = getNestlePaths(obj);
  console.log(`Found ${paths.length} nestle products to block`);
  const otherPaths = [];
  let newObj = obj;
  const groupedPaths = paths.reduce((acc, curr) => {
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
  }, {});
  Object.entries(groupedPaths).forEach(([path, indices]) => {
    const splitPath = path.split(delimiter);
    const v = getRecursive(obj, splitPath);
    const newV = v.filter((_value, index) => !indices.includes(index));
    newObj = setRecursive(obj, splitPath, newV);
  });
  otherPaths.forEach((path) => {
    newObj = deleteRecursive(newObj, path);
  });
  return newObj;
};
const getNestlePaths = (obj) => {
  const paths = [];
  const callback = (_key, value, path) => {
    if (
      value === null ||
      value === undefined ||
      typeof value !== "object" ||
      !value.brand
    ) {
      return;
    }
    const hasNestleBrand = getHasNestleBrand(value);
    console.log(
      `has nestle: ${hasNestleBrand} (brand: ${value?.brand})`,
      value
    );
    if (hasNestleBrand) {
      paths.push(path);
    }
  };
  recurseObject(obj, callback, []);
  return paths;
};

const recurseObject = (obj, callback, path) => {
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

const setRecursive = (obj, path, value) => {
  if (path.length > 1) {
    const [first, ...rest] = path;
    setRecursive(obj[first], rest, value);
  } else {
    obj[path[0]] = value;
  }
  return obj;
};
const getRecursive = (obj, path) => {
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
const deleteRecursive = (obj, path) => {
  if (path.length === 2 && Array.isArray(obj[path[0]])) {
    const index = Number(path[1]);
    const newObjPath0 = obj[path[0]].filter((v, i) => i !== index);
    obj[path[0]] = newObjPath0;
  } else if (path.length > 1) {
    const [first, ...rest] = path;
    deleteRecursive(obj[first], rest);
  } else {
    delete obj[path[0]];
  }
  return obj;
};
/**
 * what actually runs
 */
function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  console.info(details, filter);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let body = "";
  filter.ondata = (event) => {
    console.info("received chunk");
    const str = decoder.decode(event.data, { stream: true });
    body += str;
  };
  filter.onstop = () => {
    console.info("end of data");
    const jsonData = JSON.parse(body);
    console.log(body);
    const filtered = deleteNestlePaths(jsonData);
    const asStr = JSON.stringify(filtered);
    filter.write(encoder.encode(asStr));
    filter.disconnect();
  };

  return {};
}
console.info("Init plugin");
const getNestleBrands = (webpage) => {
  const brands = [];
  const el = document.createElement("html");
  el.innerHTML = webpage;
  console.log(webpage);
  const listingRows = el.getElementsByClassName("listing-row");
  console.log(listingRows);

  Array.from(listingRows).forEach((row) => {
    const titleTag = row.getElementsByTagName("a")[0];
    const title = titleTag?.title;
    if (title) {
      brands.push(normalize(title));
    }
  });
  console.log(brands);
  return brands;
};
window
  .fetch("https://www.nestle.com/brands/brandssearchlist")
  .then((value) => {
    console.info("received response from nestle");
    value.text().then((webpage) => {
      const brands = getNestleBrands(webpage);
      nestleCompanies.push(...brands);
      try {
        browser.webRequest.onBeforeRequest.addListener(
          listener,
          { urls: ["*://*.giantfood.com/api/*/products/*"] },
          ["blocking"]
        );
        console.info("listener added");
      } catch (err) {
        console.error(`Couldn't add listener: ${err}`);
      }
    });
  })
  .catch(console);
