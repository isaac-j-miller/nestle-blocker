[![CI](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/branch-check.yml/badge.svg?branch=main)](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/branch-check.yml) [![Integration tests](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/intgr-test.yml/badge.svg?branch=main)](https://github.com/isaac-j-miller/nestle-blocker/actions/workflows/intgr-test.yml)

# nestle-blocker

This add-on marks products sold under Nestle-affiliated brands with a red X to promote consumer awareness and to assist consumers in boycotting nestle products.

## rationale

Nestle is a completely unethical corporation that has cause intense suffering to countless individuals, families, and communities across the globe. Because of this, many people support a boycott of their products. However, Nestle owns so many companies and produces under so many brand names that it can be difficult to tell whether a product sold on an online store is produced by a Nestle-affiliated company.
If you're curious as to why you should be aware of which products are produced by nestle brands,
you should check out the following links:

- (https://reddit.com/r/fucknestle).
- (https://www.ethicalconsumer.org/company-profile/nestle-sa)
- (https://www.corp-research.org/nestle)

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

## contact/contribute

If you notice a bug, or would like to contribute, feel free to create an issue or message me.
