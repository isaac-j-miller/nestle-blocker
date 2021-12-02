import { normalize } from "./util";

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
  static async getNestleBrands() {
    if (NestleBrandGetter.brands.size > 0) {
      console.debug(
        `Cache already has ${NestleBrandGetter.brands.size} entries, not attempting second request`
      );
      return;
    }
    const resp = await window.fetch(
      "https://www.nestle.com/brands/brandssearchlist"
    );
    const text = await resp.text();
    const el = document.createElement("html");
    el.innerHTML = text;
    const listingRows = el.getElementsByClassName("listing-row");
    Array.from(listingRows).forEach((row) => {
      const titleTag = row.getElementsByTagName("a")[0];
      const title = titleTag?.title;
      if (title) {
        NestleBrandGetter.brands.add(normalize(title));
      }
    });
    NestleBrandGetter.brands.add("nestle");
    console.debug(
      `Found list of ${NestleBrandGetter.brands.size} nestle brands`
    );
  }
}
