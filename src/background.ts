import browser, { WebRequest } from "webextension-polyfill";
import { ApiGrocerUtils } from "./api-grocer-utils";
import { getApiGrocerUtils, knownApiGrocers } from "./api-grocer-utils/factory";
import { NestleBrandGetter } from "./nestle-product";

function getListener(
  grocerUtils: ApiGrocerUtils
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
const BLOCK_FROM_API = false;
async function entrypoint() {
  console.info("Init plugin");
  if (BLOCK_FROM_API) {
    await NestleBrandGetter.getNestleBrands(window);
    knownApiGrocers.forEach((name) => {
      const utils = getApiGrocerUtils(name);
      utils.forEach((util) => {
        const listener = getListener(util);
        const url = util.listenUrl;
        browser.webRequest.onBeforeRequest.addListener(
          listener,
          { urls: [url] },
          ["blocking"]
        );
        console.info(`Listener added for ${name}`);
      });
    });
  }
}
void entrypoint();
