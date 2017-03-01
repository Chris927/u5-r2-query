import * as R from 'ramda'
import { configureQueryReducer, INVALIDATE_QUERY_RESULT } from '..'

describe('reducer', () => {

  it('stores query results', () => {

    const query = 'query z'
    const variables = { var1: 'the question' }
    const data = { answer: 42 }

    const reducer = configureQueryReducer({ fetchedAction: 'FETCHED' })
    const nextState = reducer({
      keys: [], values: []
    }, {
      type: 'FETCHED',
      query,
      values: variables,
      data
    })

    expect(nextState.keys[0]).toEqual(JSON.stringify({ q: query, v: variables }))
    expect(nextState.values[0].data).toEqual(data)
    expect(nextState.values[0].at).toBeDefined()

  })

  it('clears query results', () => {

    const query = 'query z'
    const variables = { var1: 'the question' }
    const data = { answer: 42 }

    const state = {
      keys: [
        JSON.stringify({ q: query, v: variables })
      ],
      values: [
        { data }
      ]
    }

    const reducer = configureQueryReducer({ fetchedAction: 'FETCHED' })
    const nextState = reducer(
      state,
      { type: INVALIDATE_QUERY_RESULT }
    )
    expect(nextState.keys[0]).toEqual(JSON.stringify({ q: query, v: variables }))
    expect(nextState.values[0]).toBeFalsy()
  })

})
