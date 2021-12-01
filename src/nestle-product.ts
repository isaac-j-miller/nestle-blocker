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
    console.debug(
      `Found list of ${NestleBrandGetter.brands.size} nestle brands`
    );
  }
}