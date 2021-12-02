import { SsrGrocerUtils as UiGrocerUtils } from "./index";

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
  if (host.endsWith("target.com")) {
    return "target";
  }
  if (host.endsWith("foodcity.com")) {
    return "foodcity";
  }
  if (host.endsWith("foodlion.com")) {
    return "foodlion";
  }
  if (host.endsWith("instacart.com")) {
    return "instacart";
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
    case "target":
      return new UiGrocerUtils({
        getElements: (doc) => {
          const xpathExpression =
            "//div[contains(@class, 'ProductCardStyled') or contains(@class, 'AisleCardStyled') or contains(@class, 'StyledProductCardRow')]";
          const xpathResult = document.evaluate(xpathExpression, doc);
          let currentNode = undefined;
          const nodes: Node[] = [];
          while ((currentNode = xpathResult.iterateNext())) {
            nodes.push(currentNode);
          }
          return nodes as Element[];
        },
        extractBrand: (el) => el.textContent ?? undefined,
      });
    case "foodcity":
      return new UiGrocerUtils({
        getElements: (doc) => {
          const xpathExpression =
            "//div[contains(@class, 'card') and contains(@class, '__product') and not(@aria-hidden = 'true') and not(@style = '')]";
          const xpathResult = document.evaluate(xpathExpression, doc);
          let currentNode = undefined;
          const nodes: Node[] = [];
          while ((currentNode = xpathResult.iterateNext())) {
            nodes.push(currentNode);
          }
          return nodes as Element[];
        },
        extractBrand: (el) =>
          el
            .getElementsByClassName("tile-item__product__brand")[0]
            ?.getElementsByTagName("span")[0]?.innerHTML,
      });
    case "foodlion":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("cell product-cell")),
        extractBrand: (el) =>
          el.getElementsByClassName("cell-title-text")[0]?.innerHTML,
      });
    case "instacart":
      return new UiGrocerUtils({
        getElements: (doc) => {
          const xpathExpression = "//div[contains(@class, 'ItemBCardLarge')]";
          const xpathResult = document.evaluate(xpathExpression, doc);
          let currentNode = undefined;
          const nodes: Node[] = [];
          while ((currentNode = xpathResult.iterateNext())) {
            nodes.push(currentNode);
          }
          return nodes as Element[];
        },
        extractBrand: (el) =>
          document.evaluate("div[2]/div", el).iterateNext()?.textContent ??
          undefined,
      });

    default:
      throw new Error(`Unexpected grocer value: ${grocer}`);
  }
}
