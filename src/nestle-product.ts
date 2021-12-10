import axios from "axios";
import { Logger } from "./logger";
import { normalize } from "./util";

const knownBrands = ["la lechera", "abuelita", "nestle"];
export class NestleBrandGetter {
  private constructor() {}
  private static brands: Set<string> = new Set<string>();
  private static document: Document;
  private static logger: Logger = new Logger("nestle-product-getter");
  static isNestleBrand(brand: string) {
    if (!NestleBrandGetter.brands.size) {
      throw new Error(`Not initialized!`);
    }
    return NestleBrandGetter.brands.has(brand);
  }
  static getBrands() {
    return Array.from(this.brands);
  }
  private static parse(str: string): string[] {
    const { logger } = NestleBrandGetter;
    const foundBrands: string[] = [];
    const doc = NestleBrandGetter.document;
    const el = doc.createElement("html");
    el.innerHTML = str;
    const listItems = doc.evaluate(
      "//div[contains(@class,'div-col')]/ul/li",
      el,
      null,
      4
    );
    let listItem = listItems.iterateNext();
    while (listItem) {
      const elem = doc.createElement("span");
      elem.innerHTML = (listItem as Element).innerHTML;
      const text = elem.innerText ?? elem.textContent;
      elem.remove();
      const firstNonNameIndex = Array.from(text).findIndex((value) =>
        "[(".includes(value)
      );
      const indexToSlice =
        firstNonNameIndex === -1 ? text.length : firstNonNameIndex;
      let brandName = text.slice(0, indexToSlice).trim();
      if (brandName.includes("\n")) {
        brandName = brandName.split("\n")[0];
      }
      if (brandName) {
        foundBrands.push(brandName);
        logger.debug(
          `Found brand name. raw text: ${text}, brandName: ${brandName}`
        );
      }
      listItem = listItems.iterateNext();
    }
    return foundBrands;
  }
  static async getNestleBrands(doc: Document) {
    const { logger } = NestleBrandGetter;
    NestleBrandGetter.document = doc;
    if (NestleBrandGetter.brands.size > 0) {
      logger.debug(
        `Cache already has ${NestleBrandGetter.brands.size} entries, not attempting second request`
      );
      return;
    }
    const resp = await axios.get<string>(
      "https://en.wikipedia.org/wiki/List_of_Nestl%C3%A9_brands"
    );
    const text = resp.data;
    logger.debug("request sucess");
    const brands = NestleBrandGetter.parse(text);
    [...brands, ...knownBrands].forEach((b) =>
      NestleBrandGetter.brands.add(normalize(b))
    );
    logger.debug(
      `Found list of ${
        NestleBrandGetter.brands.size
      } nestle brands: ${NestleBrandGetter.getBrands()}`
    );
  }
}
