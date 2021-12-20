import mkdirp from "mkdirp";
import puppeteer from "puppeteer-extra";
import type { Page, Browser } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdBlocker from "puppeteer-extra-plugin-adblocker";
import axios from "axios";
import { JSDOM } from "jsdom";

import { NestleBrandGetter } from "../nestle-product";
import { getUiGrocerUtils } from "../ui-grocer-utils/factory";
import { KnownGrocer } from "../grocers";
import { Logger, LogLevel } from "../logger";
import { sanitizeArtifactPath } from "../util";

type UrlMap = {
  [key in KnownGrocer]: string;
};
Logger.level = LogLevel.DEBUG;

describe("integration tests", () => {
  const logger = new Logger("jest");
  const waitForNetworkIdle = async (page: Page) => {
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
    giant: "https://giantfood.com/product-search/nestle?searchRef=",
    walmart: "https://www.walmart.com/search?q=nestle",
    instacart: "https://www.instacart.com",
  };
  let browser!: Browser;
  let page!: Page;

  beforeAll(async () => {
    axios.defaults.adapter = require("axios/lib/adapters/http");
    puppeteer.use(StealthPlugin());
    puppeteer.use(AdBlocker({ blockTrackers: true }));
    const noHeadless = String(process.env.NO_HEADLESS) === "1";
    const headless = !noHeadless;
    logger.info(`starting in ${headless ? "headless" : "non-headless"} mode...`);
    browser = await puppeteer.launch({
      headless,
      args: [
        "--disable-web-security",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        "--window-size=1400,900",
      ],
    });
    const resp = await axios.get<string>(
      "https://en.wikipedia.org/wiki/List_of_Nestl%C3%A9_brands"
    );
    const doc = new JSDOM(resp.data).window.document;
    await NestleBrandGetter.getNestleBrands(doc);
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
        logger.info(`Running test for ${store}; url: ${url}`);
        const utils = getUiGrocerUtils(store as KnownGrocer);
        const asUrl = new URL(url);
        const origin = asUrl.origin;

        const context = browser.defaultBrowserContext();
        await context.overridePermissions(origin, ["geolocation"]);

        page.setExtraHTTPHeaders({
          "Access-Control-Allow-Origin": "*",
        });
        await page.setGeolocation({
          latitude: 38.903975,
          longitude: -77.031112,
        });
        try {
          await page.goto(url);
          await waitForNetworkIdle(page);
        } catch (e) {
          logger.error(e);
          if ((e as Error).name !== "TimeoutError") {
            throw e;
          }
        }
        try {
          // instacart is special because it requires more info
          if (store === "instacart") {
            const addrInput = await page.$("#address_input1");
            await addrInput?.type("717 14th St NW, Washington, DC 20005", {
              delay: 100,
            });
            await addrInput?.press("Enter");
            const firstResSelector = "//button[contains(@class, 'AddressResults')]";
            await page.waitForXPath(firstResSelector);
            const firstRes = Array.from(await page.$x(firstResSelector))[0];
            await firstRes.click();
            const pickupSelector = "//button[@data-testid='pickup-toggle']";
            await page.waitForXPath(pickupSelector);
            const pickup = Array.from(await page.$x(pickupSelector))[0];
            await pickup.click();
            await waitForNetworkIdle(page);
            const retailerCardSelector =
              "//button[contains(@class, 'RetailerCard') and //p[contains(text(), 'Wegmans')]]";
            await page.waitForXPath(retailerCardSelector);
            const retailerCard = Array.from(await page.$x(retailerCardSelector))[3];
            await retailerCard.click();
            await waitForNetworkIdle(page);
            const storeButtonSelector = "//div[@aria-label='Pickup Locations']/button";
            await page.waitForXPath(storeButtonSelector);
            const storeButton = Array.from(await page.$x(storeButtonSelector))[3];
            await storeButton.click();
            await waitForNetworkIdle(page);
            await page.goto("https://www.instacart.com/store/wegmans/search/nestle");
            try {
              const modalSelector = "//div[@class=ReactModal__Overlay]//button[/svg]";
              await page.waitForXPath(modalSelector, {
                timeout: 3000,
              });

              const modalDismiss = Array.from(await page.$x(modalSelector))[0];
              await modalDismiss.click();
            } catch (e) {
              logger.warn(e);
            }
            await page.waitForXPath("//div[@data-testid='item-card-border']");
          }
        } catch (err) {
          logger.error(`saving screenshot because of error while testing ${store}...`);
          await mkdirp(`tmp/errors/${store}`);
          await page.screenshot({
            path: sanitizeArtifactPath(
              `tmp/errors/${store}/${new Date().toISOString()}-screenshot.png`
            ),
            fullPage: true,
          });
          throw err;
        }

        const body = await page.content();
        const document = new JSDOM(body).window.document;
        document.body.innerHTML = body;
        utils.modifyElements(document);
        const flagged = document.getElementsByClassName("anti-nestle");
        if (flagged.length < 1) {
          logger.error(`saving screenshot because of failure while testing ${store}...`);
          await mkdirp(`tmp/failures/${store}`);
          await page.screenshot({
            path: sanitizeArtifactPath(
              `tmp/failures/${store}/${new Date().toISOString()}-screenshot.png`
            ),
            fullPage: true,
          });
        }
        expect(flagged.length).toBeGreaterThan(0);
      },
      120000
    );
  });
});
