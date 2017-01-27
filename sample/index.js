//@flow

import React from 'react'
import { createStore, combineReducers } from 'redux'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import {
  queryReducer, query, QueryProvider
} from '../src'

const reducers = combineReducers({
  queries: queryReducer
})

const initialState = {
}

const store = createStore(
  reducers,
  initialState,
  // https://github.com/zalmoxisus/redux-devtools-extension#usage
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const dummyQuery = query('this is the query', { param: 42 })
const ResultView = dummyQuery(({ data }) => <p>result: { data }</p>)

const fetcher = (q, v, actionType) => {
  console.log('should fetch', q, v, actionType)
  return { type: 'FETCHING' }
}

const App = () => <Provider store={store}>
  <QueryProvider fetcher={fetcher} queryLoadingIndicator={<p>getting it...</p>}>
    <div>
      <h1>The Query Sample App</h1>
      <ResultView />
    </div>
  </QueryProvider>
</Provider>

ReactDOM.render(<App />, document.getElementById('app'))
