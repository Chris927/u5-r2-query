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
    R.adjust(v => R.merge(
      state.values[index],
      { data, at: new Date().getTime(), fetching: false }
    ), index),
    R.when(
      R.lt(R.__, keys.length),
      R.append({})
    )
  )(state.values)

  return { keys, values }
})

const clearResult = (query, params, data, state) => {

  const key = getKey(query, params)

  const keys = appendUnlessPresent(key)(state.keys)
  const index = R.indexOf(key, keys)

  const values = R.adjust(v => undefined, index)(state.values)

  return { keys, values }
}

const cleanup = (state, at) => {

  // TODO: time after which we cleanup hard coded
  // TODO: cleanup disabled for now
  const toClear = state.values.map(v => false /* v && v.at && v.at + 60 * 1000 < at ? true : false */)

  const keys = R.zip(state.keys, toClear)
  .map(([ key, clear ]) => clear ? null : key)
  .reduce((keys, key) => {
    if (key) { keys.push(key) }
    return keys
  }, [])
  const values = R.zip(state.values, toClear)
  .map(([ value, clear ]) => clear ? null : value)
  .reduce((values, value) => {
    if (value) { values.push(value) }
    return values
  }, [])

  return { keys, values }
}

const fetching = (query, params, at, state) => {

  state = cleanup(state, at)

  const key = getKey(query, params)

  const keys = appendUnlessPresent(key)(state.keys)
  const index = R.indexOf(key, keys)
  const values = R.adjust(
    v => R.merge(
      state.values[index] || {},
      { startFetchingAt: at, fetching: true }
    ),
    index
  )(state.values.length < keys.length ? R.append({}, state.values) : state.values)

  return { keys, values }
}

export const FETCH = 'u5-r2-query/FETCH'
export const INVALIDATE_QUERY_RESULT = 'u5-r2-query/INVALIDATE_QUERY_RESULT'

export default (config: {
  fetchAction?: string,
  fetchedAction: string,
  clearAction?: string
}) => createReducer({
  keys: [],
  values: []
}, {
  [config.fetchAction || FETCH]: (state, action) => fetching(
    action.query,
    action.values,
    action.at,
    state
  ),
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
