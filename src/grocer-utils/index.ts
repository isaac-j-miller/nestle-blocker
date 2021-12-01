import { NestleBrandGetter } from "../nestle-product";
import { getRecursive, normalize, setRecursive, startsWithAny } from "../util";

export type UtilsOptions = {
  listenUrl: string;
  brandPaths: string[][];
  productPath: string[];
};

export class GrocerUtils {
  constructor(protected options: UtilsOptions) {}
  getBrandName(obj: any): string | undefined {
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
      console.error(e);
      return undefined;
    }
    return undefined;
  }
  getHasNestleBrand(brandName: string | undefined) {
    if (!brandName || typeof brandName !== "string") {
      return false;
    }
    const normalized = normalize(brandName);
    return startsWithAny(normalized, NestleBrandGetter.getBrands());
  }
  deleteNestlePaths(obj: any) {
    const { productPath } = this.options;
    const products: object[] = getRecursive(obj, productPath);
    let removedProducts = 0;
    console.info(`Found ${products.length} products`);
    const filteredProducts = products.filter((product) => {
      const brandName = this.getBrandName(product);
      const isNestleBrand = this.getHasNestleBrand(brandName);
      console.debug(`${brandName}: ${isNestleBrand}`);
      if (isNestleBrand) {
        removedProducts++;
      }
      return !isNestleBrand;
    });
    console.info(`Found ${removedProducts} nestle products to remove`);
    return setRecursive(obj, productPath, filteredProducts);
  }
  public get listenUrl(): string {
    return this.options.listenUrl;
  }
}
