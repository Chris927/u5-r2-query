# u5-r2-query

Support for querying an API (anything async, really), in the context of
React/redux.

The query results are kept in a simple cache. This cache could become more
sophisticated.

The core API is a [higher order
component](https://facebook.github.io/react/docs/higher-order-components.html)
`query`, which connects a query with a React component. The query consists of a
string representing the query text, plus parameters (any object). This should
suit most API query requirements.

The cache is refreshed whenever the connected components mounts (on
`componentWillMount`).

# How

```
npm install --save u5-r2-query
```

Follow the [documented sample](./sample/index.js). You can run the sample with

```
npm run sample:basic
```

# Example usage

./sample contains a simple example.

./sample-rerendering contains a sample that demonstrates the cache's
"time-to-live", by forcing rerendering, which, depending on the cache having
expired or not, results in re-fetching. This second example can be run with

```
npm run sample:rerendering
```
