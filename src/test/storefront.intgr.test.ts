import puppeteer from "puppeteer";
import axios from "axios";
import { JSDOM } from "jsdom";
import { NestleBrandGetter } from "../nestle-product";
import { getUiGrocerUtils } from "../ui-grocer-utils/factory";
import { KnownGrocer } from "../grocers";

type UntestableGrocer = "instacart" | "walmart" | "giant";

type TestableGrocer = Exclude<KnownGrocer, UntestableGrocer>;

// TODO: add all of the urls and get rid of | string
type UrlMap = {
  [key in TestableGrocer | string]: string;
};

describe("integration tests", () => {
  const waitForNetworkIdle = async (page: puppeteer.Page) => {
    try {
      await page.waitForNetworkIdle({
        idleTime: 2000,
        timeout: 10000,
      });
    } catch (e) {
      if ((e as Error).name !== "TimeoutError") {
        throw e;
      }
    }
  };
  const urls: UrlMap = {
    amazon: "https://www.amazon.com/s?k=nestle",
    kroger: "https://www.kroger.com/search?query=nestle",
    safeway: "https://www.safeway.com/shop/search-results.html?q=nestle",
    harristeeter: "https://www.harristeeter.com/shop/store/231/search/nestle",
    target: "https://www.target.com/s?searchTerm=nestle",
    foodcity: "https://www.foodcity.com/search/all/?Search=nestle",
    foodlion: "https://shop.foodlion.com/search?search_term=nestle",
  };
  let browser!: puppeteer.Browser;
  let page!: puppeteer.Page;
  beforeAll(async () => {
    axios.defaults.adapter = require("axios/lib/adapters/http");
    browser = await puppeteer.launch({ headless: true });
    await NestleBrandGetter.getNestleBrands();
  });
  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });
  beforeEach(async () => {
    page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0"
    );
  });
  afterAll(async () => {
    await browser.close();
  });
  Object.entries(urls).forEach(([store, url]) => {
    it(
      store,
      async () => {
        console.info(`Running test for ${store}; url: ${url}`);
        const utils = getUiGrocerUtils(store as KnownGrocer);
        const asUrl = new URL(url);
        const origin = asUrl.origin;
        const context = browser.defaultBrowserContext();
        await context.overridePermissions(origin, ["geolocation"]);
        await page.goto(url);
        await page.setGeolocation({
          latitude: 38.903975,
          longitude: -77.031112,
        });
        await waitForNetworkIdle(page);
        const body = await page.content();
        const document = new JSDOM(body).window.document;
        document.body.innerHTML = body;
        utils.modifyElements(document);
        const flagged = document.getElementsByClassName("anti-nestle");
        expect(flagged.length).toBeGreaterThan(0);
      },
      120000
    );
  });
});
