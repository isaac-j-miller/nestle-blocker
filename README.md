[![CI](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/branch-check.yml/badge.svg?branch=main)](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/branch-check.yml) [![Integration tests](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/intgr-test.yml/badge.svg?branch=main)](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/intgr-test.yml)

# nestle-blocker

This add-on marks products sold under Néstle-affiliated brands with a red X to promote consumer awareness and to assist consumers in boycotting nestle products.

Link to Firefox store page: https://addons.mozilla.org/en-US/firefox/addon/nestle-blocker/

## rationale

Néstle is an unethical corporation that has caused intense suffering to countless individuals, families, and communities across the globe. Because of this, many people support a boycott of their products. However, Néstle owns so many companies and produces under so many brand names that it can be difficult to tell whether a product sold on an online store is produced by a Néstle-affiliated company.
If you're curious as to why you should be aware of which products are produced by nestle brands, check out the following links:

- https://www.ethicalconsumer.org/company-profile/nestle-sa
- https://www.corp-research.org/nestle

## supported websites:

- Giant
- Safeway
- Walmart
- Amazon
- Harris Teeter
- Kroger
- Target
- Food City
- Instacart

## build

This project uses [pnpm](https://pnpm.io/), which is faster than npm or yarn, so install it first before building the project. Once you have it installed, run `pnpm install` from the root directory. Then, there are a few scripts available:

- `pnpm build`: build the project, outputting the extension zip file in `./web-ext-artifacts`
- `pnpm start`: build the project, and then start web-ext, opening a firefox window that has the extension running in it
- `pnpm prettier`: automatically format files
- `pnpm prettier-check`: validate file formats without writing
- `pnpm lint`: lint files
- `pnpm tsc`: perform type checking
- `pnpm test`: run unit tests
- `pnpm test-inspect`: run unit tests and attach to remote debugger
- `pnpm test-intgr`: run integration tests
- `pnpm test-intgr-inspect`: run integration tests and attach to remote debugger

## CI/CD

There are 3 pipelines set up for this project: CI, Integration Tests, and Publish.

- CI: The CI validates the build by running tsc, eslint, prettier, and jest tests. It fails if any of those fail. Additionally, it runs puppeteer integration tests and uploads screenshots of the failure as a build artifact and alerts me if it fails. It runs every time main is updated.

- Integration Tests: Since this project relies on detecting xpaths on the various websites, it is prone to breakage when the websites are eventually updated. Therefore, a CI job runs some puppeteer integration tests every Monday and will alert me if any fail (this is what the "Integration tests" badge designates), and upload screenshots of the failure as a build artifact

- Publish: In order to make updates to the extension as seamless as possible, this pipeline uses the [https://github.com/LinusU/wext-shipit](@wext/shipit) NPM package to automate submitting updates to Mozilla

## contact/contribute

If you notice a bug, or would like to contribute, feel free to create an issue or message me.

## TODO:

- protect main branch and require that pull requests pass the CI build before merge
- publish extension to chrome/opera extension stores
- possibly update to optionally include other brands, such as Kellog's
