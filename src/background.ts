import { GrocerUtils } from "./grocer-utils";
import { getGrocerUtils, knownGrocers } from "./grocer-utils/factory";
import { NestleBrandGetter } from "./nestle-product";
import browser, { WebRequest } from "webextension-polyfill";

function getListener(
  grocerUtils: GrocerUtils
): (details: WebRequest.OnBeforeRequestDetailsType) => void {
  return (details) => {
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
      const filtered = grocerUtils.deleteNestlePaths(jsonData);
      const asStr = JSON.stringify(filtered);
      filter.write(encoder.encode(asStr));
      filter.disconnect();
    };

    return {};
  };
}
async function entrypoint() {
  console.info("Init plugin");
  await NestleBrandGetter.getNestleBrands();
  knownGrocers.forEach((name) => {
    const utils = getGrocerUtils(name);
    const listener = getListener(utils);
    const url = utils.listenUrl;
    browser.webRequest.onBeforeRequest.addListener(listener, { urls: [url] }, [
      "blocking",
    ]);
    console.info(`Listener added for ${name}`);
  });
}
void entrypoint();
