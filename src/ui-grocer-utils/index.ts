import { getHasNestleBrand } from "../util";

export type UiGrocerUtilsOptions = {
  getElements: (doc: Document) => Element[];
  extractBrand: (doc: Document, element: Element) => string | undefined;
};
export class UiGrocerUtils {
  constructor(private options: UiGrocerUtilsOptions) {}
  modifyElements(doc: Document) {
    const { getElements, extractBrand } = this.options;
    console.info(`modifying elements`);
    const elements = getElements(doc);
    console.info(`found ${elements.length} elements`);
    elements.forEach((el) => {
      const brand = extractBrand(doc, el);
      // console.log(el, brand);
      const isNestle = getHasNestleBrand(brand);
      if (isNestle) {
        console.info(
          `found nestle element (item: ${brand}, brandMatch: ${isNestle})`
        );
        el.classList.add("anti-nestle");
      }
    });
  }
}
