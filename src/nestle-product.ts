import axios from "axios";
import { normalize } from "./util";

const knownBrands = ["la lechera", "abuelita", "nestle"];
export class NestleBrandGetter {
  private constructor() {}
  private static brands: Set<string> = new Set<string>();
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
    const foundBrands: string[] = [];
    const el = document.createElement("html");
    el.innerHTML = str;

    const listItems = document.evaluate(
      "//div[contains(@class,'div-col')]/ul/li",
      el
    );
    let listItem = listItems.iterateNext();
    while (listItem) {
      const text = (listItem as HTMLElement).innerText;
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
        console.info(
          `Found brand name. raw text: ${text}, brandName: ${brandName}`
        );
      }
      listItem = listItems.iterateNext();
    }
    return foundBrands;
  }
  static async getNestleBrands() {
    if (NestleBrandGetter.brands.size > 0) {
      console.debug(
        `Cache already has ${NestleBrandGetter.brands.size} entries, not attempting second request`
      );
      return;
    }
    const origin = "https://en.wikipedia.org";
    const resp = await axios.get<string>(
      "https://en.wikipedia.org/wiki/List_of_Nestl%C3%A9_brands",
      {
        headers: {
          "Access-Control-Allow-Origin": [origin, "*"].join(","),
          Origin: origin,
        },
        withCredentials: false,
      }
    );
    const text = resp.data;
    console.log("request sucess");
    const brands = NestleBrandGetter.parse(text);

    [...brands, ...knownBrands].forEach((b) =>
      NestleBrandGetter.brands.add(normalize(b))
    );
    console.debug(
      `Found list of ${
        NestleBrandGetter.brands.size
      } nestle brands: ${NestleBrandGetter.getBrands()}`
    );
  }
}
