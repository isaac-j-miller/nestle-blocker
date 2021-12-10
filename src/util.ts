import { Logger } from "./logger";
import { NestleBrandGetter } from "./nestle-product";

export function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f|®]/g, "")
    .trim();
}
export function includesAny(test: string, prefixes: string[]) {
  return prefixes.find(
    prefix => test === prefix || test.startsWith(prefix + " ") || test.includes(" " + prefix + " ")
  );
}
export function getHasNestleBrand(brandName: string | undefined, logger: Logger) {
  if (!brandName || typeof brandName !== "string") {
    return false;
  }
  const normalized = normalize(brandName);
  const brands = NestleBrandGetter.getBrands();
  const startsWithNestle = includesAny(normalized, brands);
  logger.debug(normalized, startsWithNestle);
  return startsWithNestle;
}
