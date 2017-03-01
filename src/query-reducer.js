//@flow
import * as R from 'ramda'
import { createReducer } from './utils'

// TODO: move to functional utils?
const doesNotContain = R.complement(R.contains)
const appendUnlessPresent = what => R.when(doesNotContain(what), R.append(what))

const getKey = (query, params) => JSON.stringify({ q: query, v: params })

const storeResult = R.curry((query, params, data, state) => {

  const key = getKey(query, params)

  const keys = appendUnlessPresent(key)(state.keys)
  const index = R.indexOf(key, keys)

  const values = R.compose(
    R.adjust(v => ({ data, at: new Date().getTime() }), index),
    R.when(
      R.propSatisfies(R.lt(R.__, keys.length)),
      R.append({})
    )
  )(state.values)

  return { keys, values }
})

const clearResult = (query, params, data, state) => {

  const key = getKey(query, params)

  const keys = appendUnlessPresent(key)(state.keys)
  const index = R.indexOf(key, keys)

  const values = R.adjust(v => undefined, index)

  return { keys, values }
}

export const INVALIDATE_QUERY_RESULT = 'u5-r2-query/INVALIDATE_QUERY_RESULT'

export default (config: {
  fetchedAction: string,
  clearAction?: string
}) => createReducer({
  keys: [],
  values: []
}, {
  [config.fetchedAction]: (state, action) => storeResult(
    action.query,
    action.values,
    action.data
  )(state),
  [config.clearAction || INVALIDATE_QUERY_RESULT]: (state, action) => clearResult(
    action.query,
    action.values,
    action.data,
    state
  )
})
