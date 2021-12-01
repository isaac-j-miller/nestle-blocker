import { getHasNestleBrand } from "../util";

export type SsrGrocerUtilsOptions = {
  getElements: (doc: Document) => Element[];
  extractBrand: (element: Element) => string | undefined;
};
export class SsrGrocerUtils {
  constructor(private options: SsrGrocerUtilsOptions) {}
  modifyElements() {
    const { getElements, extractBrand } = this.options;
    console.info(`modifying elements`);
    const elements = getElements(document);
    console.info(`found ${elements.length} elements`);
    elements.forEach((el) => {
      const brand = extractBrand(el);
      // console.log(el, brand);
      const isNestle = getHasNestleBrand(brand);
      if (isNestle) {
        console.info(`found nestle element (item: ${brand})`);
        el.classList.add("anti-nestle");
      }
    });
  }
}
