import { Logger } from "../logger";
import { getHasNestleBrand, getRecursive, setRecursive } from "../util";

export type ApiGrocerUtilsOptions = {
  listenUrl: string;
  brandPaths: string[][];
  productPath: string[];
};
export class ApiGrocerUtils {
  private logger: Logger;
  constructor(protected options: ApiGrocerUtilsOptions) {
    this.logger = new Logger("api-grocer");
  }
  getBrandName(obj: any): string | undefined {
    const { logger } = this;
    if (!obj) {
      return undefined;
    }
    const { brandPaths } = this.options;
    try {
      for (const brandPath of brandPaths) {
        const brandName = getRecursive(obj, brandPath);
        if (brandName) {
          return brandName;
        }
      }
    } catch (e) {
      logger.error(e);
      return undefined;
    }
    return undefined;
  }

  deleteNestlePaths(obj: any) {
    const { productPath } = this.options;
    const { logger } = this;
    const products: object[] = getRecursive(obj, productPath);
    let removedProducts = 0;
    logger.debug(`Found ${products.length} products`);
    const filteredProducts = products.filter((product) => {
      const brandName = this.getBrandName(product);
      const isNestleBrand = getHasNestleBrand(brandName, logger);
      logger.debug(`${brandName}: ${isNestleBrand}`);
      if (isNestleBrand) {
        removedProducts++;
      }
      return !isNestleBrand;
    });
    logger.debug(`Found ${removedProducts} nestle products to remove`);
    return setRecursive(obj, productPath, filteredProducts);
  }
  public get listenUrl(): string {
    return this.options.listenUrl;
  }
}
