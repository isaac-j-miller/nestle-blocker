import fs from "fs";
import { Logger } from "../logger";
import prettier from "prettier";
import { grocerHostMap } from "../grocers";

type ContentScript = {
  matches: string[];
  js: string[];
};
type FirefoxAddonManifest = {
  manifest_version: number;
  name: string;
  version: string;
  description: string;
  content_scripts: ContentScript[];
  permissions: string[];
};

function getUrls(): string[] {
  return Object.values(grocerHostMap).map((host) => `*://*.${host}/*`);
}

const logger = new Logger("build");

function main() {
  const hosts = getUrls();
  const manifest: FirefoxAddonManifest = {
    manifest_version: 2,
    name: "NestleBlocker",
    version: "1.0",
    description: "Hides Nestle products from grocery store websites",
    content_scripts: hosts.map((h) => ({
      matches: [h],
      js: ["./content-script.js"],
    })),
    permissions: ["webRequest", ...hosts, "https://*.wikipedia.org/*"],
  };
  const asString = JSON.stringify(manifest, null, 4);
  const prettified = prettier.format(asString, {
    parser: "json",
  });
  const manifestPath = "dist/web/manifest.json";
  logger.info("Emitting new manifest.json...");
  fs.writeFileSync(manifestPath, prettified, { encoding: "utf-8" });
}

main();
