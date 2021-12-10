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
  homepage_url: string;
  author: string;
};
type TruncatedPackageJson = {
  version: string;
  description: string;
  name: string;
  homepage: string;
  author: string;
  main: string;
};

function getUrls(): string[] {
  return Object.values(grocerHostMap).map(host => `*://*.${host}/*`);
}

const logger = new Logger("build");

function main() {
  const hosts = getUrls();
  const packageJsonStr = fs.readFileSync("package.json", {
    encoding: "utf-8",
  });
  const parsedPackageJson = JSON.parse(packageJsonStr) as TruncatedPackageJson;
  const manifest: FirefoxAddonManifest = {
    manifest_version: 2,
    name: parsedPackageJson.name,
    version: parsedPackageJson.version,
    homepage_url: parsedPackageJson.homepage,
    description: parsedPackageJson.description,
    author: parsedPackageJson.author,
    content_scripts: hosts.map(h => ({
      matches: [h],
      js: [parsedPackageJson.main],
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
