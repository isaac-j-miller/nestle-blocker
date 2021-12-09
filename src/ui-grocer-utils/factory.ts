import { KnownGrocer } from "../grocers";
import { UiGrocerUtils as UiGrocerUtils } from "./index";

export function getUiGrocerUtils(grocer: KnownGrocer): UiGrocerUtils {
  switch (grocer) {
    case "kroger":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("ProductCard")),
        extractBrand: (doc, el) =>
          Array.from(
            el.getElementsByClassName("ProductDescription-truncated")[0]
              .attributes
          ).filter((a) => a.name === "aria-label")[0].value,
      });
    case "giant":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("product-cell")),
        extractBrand: (doc, el) =>
          Array.from(el.attributes).filter((a) => a.name === "aria-label")[0]
            .value,
      });
    case "safeway":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("product-item-inner")),
        extractBrand: (doc, el) =>
          el.getElementsByClassName("product-title")[0]?.innerHTML,
      });
    case "amazon":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("s-result-item")),
        extractBrand: (doc, el) =>
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
        extractBrand: (doc, el) =>
          el.getElementsByTagName("a")[0].getElementsByTagName("span")[0]
            ?.innerHTML,
      });
    case "harristeeter":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("product-main")),
        extractBrand: (doc, el) =>
          el.getElementsByClassName("product-name")[0]?.innerHTML,
      });
    case "target":
      return new UiGrocerUtils({
        getElements: (doc) => {
          const xpathExpression =
            "//div[contains(@class, 'ProductCardStyled') or contains(@class, 'AisleCardStyled') or contains(@class, 'StyledProductCardRow')]";
          const xpathResult = doc.evaluate(xpathExpression, doc, null, 4);
          let currentNode = undefined;
          const nodes: Node[] = [];
          while ((currentNode = xpathResult.iterateNext())) {
            nodes.push(currentNode);
          }
          return nodes as Element[];
        },
        extractBrand: (doc, el) => el.textContent ?? undefined,
      });
    case "foodcity":
      return new UiGrocerUtils({
        getElements: (doc) => {
          const xpathExpression =
            "//div[contains(@class, 'card') and contains(@class, '__product') and not(@aria-hidden = 'true')]";
          const xpathResult = doc.evaluate(xpathExpression, doc, null, 4);
          let currentNode = undefined;
          const nodes: Node[] = [];
          while ((currentNode = xpathResult.iterateNext())) {
            nodes.push(currentNode);
          }
          return nodes as Element[];
        },
        extractBrand: (doc, el) =>
          el
            .getElementsByClassName("tile-item__product__brand")[0]
            ?.getElementsByTagName("span")[0]?.innerHTML,
      });
    case "foodlion":
      return new UiGrocerUtils({
        getElements: (doc) =>
          Array.from(doc.getElementsByClassName("cell product-cell")),
        extractBrand: (doc, el) =>
          el.getElementsByClassName("cell-title-text")[0]?.innerHTML,
      });
    case "instacart":
      return new UiGrocerUtils({
        getElements: (doc) => {
          const xpathExpression = "//div[contains(@class, 'ItemBCardLarge')]";
          const xpathResult = doc.evaluate(xpathExpression, doc, null, 4);
          let currentNode = undefined;
          const nodes: Node[] = [];
          while ((currentNode = xpathResult.iterateNext())) {
            nodes.push(currentNode);
          }
          return nodes as Element[];
        },
        extractBrand: (doc, el) =>
          doc.evaluate("div[2]/div", el, null, 4).iterateNext()?.textContent ??
          undefined,
      });

    default:
      throw new Error(`Unexpected grocer value: ${grocer}`);
  }
}
