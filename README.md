# nestle-blocker

marks products sold under Nestle-affiliated brands with a red X to promote consumer awareness and to
assist in boycotting nestle products.
If you're curious as to why you should be aware of which products are produced by nestle brands,
you should check out [r/fucknestle] (https://reddit.com/r/fucknestle).

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
