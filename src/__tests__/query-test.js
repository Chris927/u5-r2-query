import React from 'react'
import query from '../query'
import QueryProvider from '../query-provider'

import { Provider } from 'react-redux'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('query', () => {

  it('shows "loading" and initiates the query', () => {

    const Component = ({ things }) => <p>{ JSON.stringify(things) }</p>
    const Connected = query('the query', { var1: 42 })(Component)

    const store = mockStore({
      queries: {
        keys: [],
        values: []
      }
    })

    let fetcherCalled = false
    const fetcher = (dispatch, query, values) => {
      fetcherCalled = true
    }

    const rendered = render(
      <Provider store={store}>
        <QueryProvider fetcher={fetcher}>
          <Connected />
        </QueryProvider>
      </Provider>
    )

    expect(rendered.toJSON().children[0].children[0]).toBe("Loading...")
    expect(fetcherCalled).toBe(true)

  })

})
