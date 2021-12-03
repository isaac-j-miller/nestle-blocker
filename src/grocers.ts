export const knownGrocers = [
  "kroger",
  "giant",
  "safeway",
  "amazon",
  "walmart",
  "harristeeter",
  "target",
  "foodcity",
  "foodlion",
  "instacart",
] as const;
export type KnownGrocer = typeof knownGrocers[number];

export const grocerHostMap: {
  [key in KnownGrocer]: string;
} = {
  kroger: "kroger.com",
  giant: "giantfood.com",
  safeway: "safeway.com",
  amazon: "amazon.com",
  walmart: "walmart.com",
  harristeeter: "harristeeter.com",
  target: "target.com",
  foodcity: "foodcity.com",
  foodlion: "foodlion.com",
  instacart: "instacart.com",
};
export function getGrocerFromHost(host: string): KnownGrocer | undefined {
  for (const [grocer, hostEndsWith] of Object.entries(grocerHostMap)) {
    if (host.endsWith(hostEndsWith)) {
      return grocer as KnownGrocer;
    }
  }
  return undefined;
}
