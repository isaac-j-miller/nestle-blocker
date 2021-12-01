import { GrocerUtils } from "./index";

export const knownGrocers = ["giant", "safeway"] as const;
export type KnownGrocer = typeof knownGrocers[number];

export function getGrocerUtils(grocer: KnownGrocer): GrocerUtils {
  switch (grocer) {
    case "giant":
      return new GrocerUtils({
        brandPaths: [["brand"]],
        listenUrl: "*://*.giantfood.com/api/*/products/*",
        productPath: ["response", "products"],
      });
    case "safeway":
      return new GrocerUtils({
        brandPaths: [["brand"], ["name"]],
        listenUrl: "*://*.safeway.com/abs/pub/xapi/search/products*",
        productPath: ["response", "docs"],
      });
    default:
      throw new Error(`Unexpected grocer value: ${grocer}`);
  }
}
