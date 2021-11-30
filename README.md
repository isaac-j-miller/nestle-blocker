# nestle-blocker

hides nestle products from grocery store websites by intercepting XHR requests and removing products sold under Nestle-affiliated brands

## tested websites:

- Giant
- Safeway

## todo/problems:

- migrate to typescript and use webpack/babel
- Amazon uses SSR, apparently, so we cannot intercept requests in the same way as with the other stores
- Kroger does the same
