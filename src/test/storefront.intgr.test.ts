import puppeteer from "puppeteer";
import axios from "axios";
import { JSDOM } from "jsdom";
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
        const document = new JSDOM(body).window.document;
        document.body.innerHTML = body;
        utils.modifyElements(document);
        const flagged = document.getElementsByClassName("anti-nestle");
        expect(flagged.length).toBeGreaterThan(0);
      },
      30000
    );
  });
});
