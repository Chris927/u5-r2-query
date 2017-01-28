//@flow

import React from 'react'
import { createStore, combineReducers } from 'redux'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import {
  configureQueryReducer, query, QueryProvider
} from '../src'

const FETCHED = 'FETCHED'

const reducers = combineReducers({
  queries: configureQueryReducer({ fetchedAction: FETCHED })
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
const ResultView = dummyQuery(({ guess }) => <p>result: { guess }</p>)

const fetcher = (dispatch, query, values) => {
  console.log('should fetch:', query, values)
  setTimeout(() => {
    dispatch({ type: FETCHED, query, values, data: { guess: 'what' }})
  }, 1000)
  return dispatch({ type: 'FETCHING' })
}

const App = () => <Provider store={store}>
  <QueryProvider
    fetcher={fetcher}
    queryLoadingIndicator={<p>getting it...</p>}
  >
    <div>
      <h1>The Query Sample App</h1>
      <ResultView />
    </div>
  </QueryProvider>
</Provider>

ReactDOM.render(<App />, document.getElementById('app'))
