import puppeteer from "puppeteer";
import { NestleBrandGetter } from "../nestle-product";
import { getUiGrocerUtils } from "../ui-grocer-utils/factory";
import { KnownGrocer } from "../grocers";
// TODO: add all of the urls and get rid of | string
type UrlMap = {
  [key in KnownGrocer | string]: string;
};

describe("integration tests", () => {
  const urls: UrlMap = {
    amazon: "https://www.amazon.com/s?k=nestle",
  };
  let browser!: puppeteer.Browser;
  let page!: puppeteer.Page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    const fakeWindow = {
      fetch: async () =>
        Promise.resolve({
          text: async () => Promise.resolve("nescafe,carnation"),
        }),
    };
    const parser = (str: string) => str.split(",");
    await NestleBrandGetter.getNestleBrands(
      fakeWindow as unknown as Window,
      parser
    );
  });
  afterEach(async () => {
    await page.close();
  });
  beforeEach(async () => {
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
  });
  Object.entries(urls).forEach(([store, url]) => {
    it(
      store,
      async () => {
        const utils = getUiGrocerUtils(store as KnownGrocer);
        await page.goto(url);
        await page.waitForNetworkIdle();
        const body = await page.content();
        document.body.innerHTML = body;
        utils.modifyElements(document);
        const flagged = document.getElementsByClassName("anti-nestle");
        expect(flagged.length).toBeGreaterThan(0);
      },
      30000
    );
  });
});
