//@flow
import * as R from 'ramda'
import { createReducer } from './utils'

// TODO: move to functional utils?
const doesNotContain = R.complement(R.contains)
const appendUnlessPresent = what => R.when(doesNotContain(what), R.append(what))

const storeResult = R.curry((query, params, data, state) => {

  const key = JSON.stringify({ q: query, v: params })

  const keys = appendUnlessPresent(key)(state.keys)
  const index = R.indexOf(key, keys)

  const values = R.compose(
    R.adjust(v => ({ data }), index),
    R.when(
      R.propSatisfies(R.lt(R.__, keys.length)),
      R.append({})
    )
  )(state.values)

  return { keys, values }
})

export default ({
  fetchedAction
}: {
  fetchedAction: string
}) => createReducer({
  keys: [],
  values: []
}, {
  [fetchedAction]: (state, action) => storeResult(
    action.query,
    action.values,
    action.data
  )(state)
})
