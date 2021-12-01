import { GrocerUtils } from "grocer-utils";

export const knownGrocers = ["giant", "safeway"] as const;
export type KnownGrocer = typeof knownGrocers[number];

export function getGrocerUtils(grocer: KnownGrocer): GrocerUtils {
  switch (grocer) {
    case "giant":
      return new GrocerUtils({
        brandPath: ["brand"],
        listenUrl: "https://giantfood.com/api/v5.0/products/",
      });
    case "safeway":
      return new GrocerUtils({
        brandPath: ["brand", "name"],
        listenUrl: "https://safeway.com/**/products",
      });
    default:
      throw new Error(`Unexpected grocer value: ${grocer}`);
  }
}
