//@flow
import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

import contextTypes from './context-types'

// actions (TODO)
// const REQUESTED = 'u5-r2-query/REQUESTED'
const RECEIVED = 'u5-r2-query/RECEIVED'

export default (
  query: string,
  queryParams: any
) => (Comp : ReactClass<any>) => (componentProps: Object) => {

  class DataHolder extends React.Component {
    constructor(props) {
      super(props)
    }
    componentWillMount() {
      const { data, fetch, mustFetch, params } = this.props
      const { fetcher, ttl } = this.context
      if (mustFetch(ttl)) {
        fetch(fetcher, query, params)
      }
    }
    render() {
      const { query, queryParams, data, lastError, children } = this.props
      const { queryLoadingIndicator } = this.context
      if (lastError) {
        // TODO: should be a configurable component to display errors
        return (<p>Unable to query API: { lastError.message || 'Error while fetching' }</p>)
      }
      return data
        ? <Comp {...this.props} {...data} />
        : queryLoadingIndicator
    }
  }
  DataHolder.contextTypes = contextTypes

  function getIndex(state, query, variables) {
    const key = JSON.stringify({ q: query, v: variables })
    const ix = state.keys.indexOf(key)
    if (ix === -1) return undefined;
    return ix
  }

  function getQueryState(state, query, variables) {
    const ix = getIndex(state, query, variables)
    if (ix === undefined) return undefined;
    return state.values[ix]
  }

  function getResult(state, query, variables) {
    const queryState = getQueryState(state, query, variables);
    if (!queryState) return undefined;
    return queryState.data
  }

  const mustFetch = R.curry((state, query, variables, ttl) => {
    const ix = getIndex(state, query, variables)
    const queryState = getQueryState(state, query, variables)
    console.log('ttl=' + ttl)
    if (!queryState) {
      console.log('must fetch, because no result cached yet, ix=' + ix)
      return true
    }
    console.log('queryState', queryState.at)
    if (queryState.at.getTime() + ttl < new Date().getTime()) {
      console.log('must fetch, as cache expired, ix=' + ix)
      return true
    }
    console.log('not fetching, result still cached, ix=' + ix)
    return false
  })

  const DataHolderContainer = connect((state, ownProps) => {
    const params = (typeof queryParams === 'function') ? queryParams(state, ownProps) : queryParams
    return {
      data: getResult(state.queries, query, params),
      mustFetch: mustFetch(state.queries, query, params),
      params
    }
  }, (dispatch, ownProps) => ({
    fetch: (fetcher, query, variables) => fetcher(dispatch, query, variables, ownProps)
  }))(DataHolder)

  return <DataHolderContainer {...componentProps} />
}
