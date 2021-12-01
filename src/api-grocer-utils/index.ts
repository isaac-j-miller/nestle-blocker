import { getHasNestleBrand, getRecursive, setRecursive } from "../util";

export type ApiGrocerUtilsOptions = {
  listenUrl: string;
  brandPaths: string[][];
  productPath: string[];
};
export class ApiGrocerUtils {
  constructor(protected options: ApiGrocerUtilsOptions) {}
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

  deleteNestlePaths(obj: any) {
    const { productPath } = this.options;
    const products: object[] = getRecursive(obj, productPath);
    let removedProducts = 0;
    console.info(`Found ${products.length} products`);
    const filteredProducts = products.filter((product) => {
      const brandName = this.getBrandName(product);
      const isNestleBrand = getHasNestleBrand(brandName);
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
