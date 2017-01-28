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

const query1 = query('this is the query', { param: 42 })
const ResultView = query1(({ guess }) => <p>result: { guess }</p>)

const query2 = query('another query', (state, ownProps) => ({ fromOwnProps: ownProps.x }))
const Result2View = query2(({ guess }) => <p>result (2): { guess }</p>)

const fetcher = (dispatch, query, values, ownProps) => {
  console.log('should fetch:', query, values, ownProps)
  setTimeout(() => {
    dispatch({ type: FETCHED, query, values, data: { guess: 'what', ownProps }})
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
      <ResultView x={3}/>
      <Result2View x={4}/>
    </div>
  </QueryProvider>
</Provider>

ReactDOM.render(<App />, document.getElementById('app'))
