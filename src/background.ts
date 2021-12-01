import browser, { WebRequest } from "webextension-polyfill";
import { deleteNestlePaths, nestleCompanies, normalize } from "./util";
/**
 * what actually runs
 */
function listener(details: WebRequest.OnBeforeRequestDetailsType) {
  const shouldContinue = details.type === "xmlhttprequest";
  if (!shouldContinue) {
    return;
  }
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let body = "";
  filter.onstart = () => {
    console.debug(`intercepting request: ${details.url}`);
  };
  filter.ondata = (event) => {
    const str = decoder.decode(event.data, { stream: true });
    body += str;
  };
  filter.onstop = () => {
    let jsonData = {};
    try {
      jsonData = JSON.parse(body);
    } catch {
      filter.write(encoder.encode(body));
      filter.disconnect();
      return;
    }
    console.log(jsonData);
    const filtered = deleteNestlePaths(jsonData);
    const asStr = JSON.stringify(filtered);
    filter.write(encoder.encode(asStr));
    filter.disconnect();
  };

  return {};
}
console.info("Init plugin");
const getNestleBrands = (webpage: string) => {
  const brands: string[] = [];
  const el = document.createElement("html");
  el.innerHTML = webpage;
  const listingRows = el.getElementsByClassName("listing-row");
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
          {
            urls: [
              //   "*://*/*",
              "*://*.kroger.com/atlas/v1/product/*",
            ],
          },
          ["blocking"]
        );
        console.info("listener added");
      } catch (err) {
        console.error(`Couldn't add listener: ${err}`);
      }
    });
  })
  .catch(console.error);
