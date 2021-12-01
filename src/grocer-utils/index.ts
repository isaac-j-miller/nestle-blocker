import { NestleBrandGetter } from "nestle-product";
import {
  deleteRecursive,
  getRecursive,
  normalize,
  recurseObject,
  setRecursive,
  startsWithAny,
} from "../util";

export type UtilsOptions = {
  listenUrl: string;
  brandPath: string[];
};
const delimiter = "<$.$>";
export class GrocerUtils {
  constructor(protected options: UtilsOptions) {}
  getBrandName(obj: any): string | undefined {
    if (!obj) {
      return undefined;
    }
    const { brandPath } = this.options;
    try {
      const brandName = getRecursive(obj, brandPath);
      return brandName;
    } catch {
      return undefined;
    }
  }
  getHasNestleBrand(brandName: string) {
    if (!brandName || typeof brandName !== "string") {
      return false;
    }
    const normalized = normalize(brandName);
    return startsWithAny(normalized, NestleBrandGetter.getBrands());
  }
  getNestlePaths(obj: any) {
    const paths: string[][] = [];
    const callback = (_key: string, value: any, path: string[]) => {
      const brandName = this.getBrandName(value);
      if (brandName) {
        console.debug(`found brandName: ${brandName}`);
        console.debug(value);
      }
      const hasNestleBrand = this.getHasNestleBrand(value);
      if (hasNestleBrand) {
        console.log(
          `Found nestle product: (product: ${value?.name}, brand: ${value?.brand})`
        );
      }
      if (hasNestleBrand) {
        paths.push(path);
      }
    };
    recurseObject(obj, callback, []);
    return paths;
  }
  deleteNestlePaths(obj: any) {
    const paths = this.getNestlePaths(obj);
    if (paths.length > 0) {
      console.log(`Found ${paths.length} nestle products to block`);
    }
    const otherPaths: string[][] = [];
    let newObj = obj;
    const groupedPaths = paths.reduce(
      (acc, curr) => {
        const base = curr.slice(0, curr.length - 1);
        const last = curr[curr.length - 1];
        const index = base.join(delimiter);
        if (acc[index]) {
          acc[index].push(Number(last));
        } else if (Array.isArray(getRecursive(obj, base))) {
          acc[index] = [Number(last)];
        } else {
          otherPaths.push(curr);
        }
        return acc;
      },
      {} as {
        [k: string]: number[];
      }
    );
    Object.entries(groupedPaths).forEach(([path, indices]) => {
      const splitPath = path.split(delimiter);
      const v = getRecursive(obj, splitPath);
      const newV = v.filter(
        (_value: any, index: number) => !(indices as number[]).includes(index)
      );
      newObj = setRecursive(obj, splitPath, newV);
    });
    otherPaths.forEach((path) => {
      newObj = deleteRecursive(newObj, path);
    });
    return newObj;
  }
  public get listenUrl(): string {
    return this.options.listenUrl;
  }
}
