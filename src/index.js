//@flow
import React from 'react'
import configureQueryReducer from './query-reducer'
import { INVALIDATE_QUERY_RESULT } from './query-reducer'
import QueryProvider from './query-provider'
import query from './query'

export {
  QueryProvider,
  configureQueryReducer,
  query,
  INVALIDATE_QUERY_RESULT
}
