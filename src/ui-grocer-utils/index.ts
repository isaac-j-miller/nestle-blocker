import { KnownGrocer } from "../grocers";
import { Logger } from "../logger";
import { getHasNestleBrand } from "../util";

export type UiGrocerUtilsOptions = {
  name: KnownGrocer;
  getElements: (doc: Document) => Element[];
  extractBrand: (doc: Document, element: Element) => string | undefined;
};
export class UiGrocerUtils {
  private logger: Logger;
  constructor(private options: UiGrocerUtilsOptions) {
    this.logger = new Logger(options.name);
  }
  modifyElements(doc: Document) {
    const { logger } = this;
    const { getElements, extractBrand } = this.options;
    logger.debug(`modifying elements`);
    const elements = getElements(doc);
    logger.info(`found ${elements.length} elements`);
    elements.forEach((el) => {
      const brand = extractBrand(doc, el);
      logger.debug(el, brand);
      const isNestle = getHasNestleBrand(brand, logger);
      if (isNestle) {
        logger.debug(
          `found nestle element (item: ${brand?.trim()}, brandMatch: ${isNestle})`
        );
        el.classList.add("anti-nestle");
      }
    });
  }
}
