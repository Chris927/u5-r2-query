import React from 'react'
import query from '../query'

import { Provider } from 'react-redux'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('query', () => {
  it.skip('queries', () => {
    const Component = ({ things }) => <p>{ JSON.stringify(things) }</p>
    const Connected = query('the query', { var1: 42 })(Component)

    const store = mockStore({})

    const rendered = render(<Provider store={store}><Connected /></Provider>)
    return store.dispatch({ type: 'dummy' })
    .then(() => {
      // now we should have data?
      expect()
    })

  })
})
