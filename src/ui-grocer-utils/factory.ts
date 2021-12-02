import { SsrGrocerUtils as UiGrocerUtils } from "./index";

export const knownGrocers = [
  "kroger",
  "giant",
  "safeway",
  "amazon",
  "walmart",
  "harristeeter",
] as const;
export type KnownGrocer = typeof knownGrocers[number];

export function getGrocerFromHost(host: string): KnownGrocer | undefined {
  if (host.endsWith("kroger.com")) {
    return "kroger";
  }
  if (host.endsWith("giantfood.com")) {
    return "giant";
  }
  if (host.endsWith("safeway.com")) {
    return "safeway";
  }
  if (host.endsWith("amazon.com")) {
    return "amazon";
  }
  if (host.endsWith("walmart.com")) {
    return "walmart";
  }
  if (host.endsWith("harristeeter.com")) {
    return "harristeeter";
  }
  return undefined;
}

export function getUiGrocerUtils(grocer: KnownGrocer): UiGrocerUtils {
  switch (grocer) {
    case "kroger":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("ProductCard")),
        extractBrand: (el) =>
          Array.from(
            el.getElementsByClassName("ProductDescription-truncated")[0]
              .attributes
          ).filter((a) => a.name === "aria-label")[0].value,
      });
    case "giant":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("product-cell")),
        extractBrand: (el) =>
          Array.from(el.attributes).filter((a) => a.name === "aria-label")[0]
            .value,
      });
    case "safeway":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("product-item-inner")),
        extractBrand: (el) =>
          el.getElementsByClassName("product-title")[0]?.innerHTML,
      });
    case "amazon":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("s-result-item")),
        extractBrand: (el) =>
          el.getElementsByClassName(
            "a-size-base-plus a-color-base a-text-normal"
          )[0]?.innerHTML,
      });
    case "walmart":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(
            doc.getElementsByClassName("relative flex flex-column")
          ).filter((elem) =>
            Array.from(elem.attributes).some(
              (attr) => attr.name === "data-item-id"
            )
          ),
        extractBrand: (el) =>
          el.getElementsByTagName("a")[0].getElementsByTagName("span")[0]
            ?.innerHTML,
      });
    case "harristeeter":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("productbox")),
        extractBrand: (el) =>
          el.getElementsByClassName("product_title")[0]?.innerHTML,
      });
    default:
      throw new Error(`Unexpected grocer value: ${grocer}`);
  }
}
