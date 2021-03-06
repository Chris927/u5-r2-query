//@flow

import React from 'react'
import { createStore, combineReducers } from 'redux'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import {
  configureQueryReducer, query, QueryProvider
} from '../src'

// The action we dispatch when our `fetcher` (defined below) is done
// fetching data. `configureQueryReducer` must know about it, so that
// it records the result in the store.
const FETCHED = 'FETCHED'

// The queryReducer (created via `configureQueryReducer()`) must be mounted
// under `queries`. It may become configurable in future. (The
// DataHolderContainer would need to grab it from the React context?)
const reducers = combineReducers({
  queries: configureQueryReducer({ fetchedAction: FETCHED })
})

const store = createStore(
  reducers,
  {} /* initial state */,
  // The following not required, but recommended, see
  // https://github.com/zalmoxisus/redux-devtools-extension#usage
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

// `query1` is a simple query, with parameters.
const query1 = query('this is the query', { param: 42 })

// Component that uses `query1`
const ResultView = query1(({ result }) => <p>First result: { result }</p>)

// `query2` is a query, where parameters are determined from state and ownProps
// in addition: we
const query2 = query(
  'another query',
  (state, ownProps) => ({ fromOwnProps: ownProps.x }),
  { debug: true }
)

// Component that uses `query2`
const Result2View = query2(({ result, x }) => <p>Second result: { result }, x={x}</p>)

// The fetcher would typically query an API or do whatever else to answer the
// query. By using `ownProps.x` we demonstrate how ownProps can be passed
// to the fetcher.
const fetcher = (dispatch, query, values, ownProps) => {
  console.log('about to fetch:', query, values, ownProps)
  setTimeout(() => {
    dispatch({ type: FETCHED, query, values, data: {
      result: ownProps.x === 4 ? 'ha, x is 4' : 'what',
      ownProps
    }})
  }, 1500 * Math.random() /* just to simulate different response times */)
  return dispatch({ type: 'FETCHING' })
}

// In addition to a typical React/redux setup, we need to configure at least
// the fetcher. We can also specify a `queryLoadingIndicator` to appear
// (instead of a default) while the fetcher hasn't finished its job.
const App = () => <Provider store={store}>
  <QueryProvider
    fetcher={fetcher}
    queryLoadingIndicator={<p>getting it...</p>}
  >
    <div>
      <h1>The Query Sample App</h1>
      <ResultView/>
      <Result2View x={4}/>
    </div>
  </QueryProvider>
</Provider>

const el = document.getElementById('app')
ReactDOM.render(<App />, ((el: any): Element))
