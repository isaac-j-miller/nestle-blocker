import { ApiGrocerUtils } from "./index";

export const knownApiGrocers = ["giant", "safeway"] as const;
export type KnownApiGrocer = typeof knownApiGrocers[number];

export function getApiGrocerUtils(grocer: KnownApiGrocer): ApiGrocerUtils[] {
  switch (grocer) {
    case "giant":
      return [
        new ApiGrocerUtils({
          brandPaths: [["brand"]],
          listenUrl: "*://*.giantfood.com/api/*/products/*",
          productPath: ["response", "products"],
        }),
      ];
    case "safeway":
      return [
        new ApiGrocerUtils({
          brandPaths: [["brand"], ["name"]],
          listenUrl: "*://*.safeway.com/abs/pub/xapi/search/products*",
          productPath: ["response", "docs"],
        }),
      ];
    default:
      throw new Error(`Unexpected grocer value: ${grocer}`);
  }
}
