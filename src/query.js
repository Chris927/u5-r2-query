//@flow
import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

import contextTypes from './context-types'

import { FETCH } from './query-reducer'

export default (
  query: string,
  queryParams: any
) => (Comp : ReactClass<any>) => (componentProps: Object) => {

  class DataHolder extends React.Component {
    constructor(props) {
      super(props)
    }
    componentWillMount() {
      const { fetch, mustFetch, params } = this.props
      const { fetcher, ttl, retryInterval } = this.context
      if (mustFetch(ttl, retryInterval)) {
        fetch(fetcher, query, params)
      }
    }
    componentWillReceiveProps(nextProps) {
      // TODO: repeats what we do in componentWillMount, but with `nextProps`
      // which causes fetching double (in some cases)
      const { fetch, params } = nextProps
      const { fetcher } = this.context
      // console.log('componentWillReceiveProps', nextProps)
      if (!R.equals(params, nextProps.params)) { // experiment: only refetch when params have changed?
        fetch(fetcher, query, params)
      }
    }
    shouldComponentUpdate(nextProps, nextState) {
      // console.log('shouldComponentUpdate, this.props, nextProps', this.props, nextProps)
      const { data, params, lastError } = this.props
      if (R.equals(nextProps.data, data)
      && R.equals(nextProps.params, params)
      && R.equals(nextProps.lastError, lastError)) {
        // console.log('shouldComponentUpdate, FALSE');
        return false
      }
      // console.log('shouldComponentUpdate, TRUE');
      return true
    }
    render() {
      const { query, data, lastError, children } = this.props
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
    return ix
  }

  function getQueryState(state, query, variables) {
    const ix = getIndex(state, query, variables)
    if (ix === -1) return undefined;
    return state.values[ix]
  }

  function getResult(state, query, variables) {
    const queryState = getQueryState(state, query, variables);
    if (!queryState) return undefined;
    return queryState.data
  }

  const mustFetch = R.curry((state, query, variables, ttl, retryInterval) => {
    const ix = getIndex(state, query, variables)
    const queryState = getQueryState(state, query, variables)
    if (!queryState) {
      console.log('must fetch, because no result cached yet, ix=' + ix)
      return true
    }
    if (queryState.fetching) {
      if (queryState.startFetchingAt
        && queryState.startFetchingAt + retryInterval < new Date().getTime()) {
        console.log('fetching already, but retrying, ix=' + ix)
        return true
      } else {
        console.log('not fetching, fetching already, ix=' + ix)
        return false
      }
    }
    if (!queryState.at || queryState.at + ttl < new Date().getTime()) {
      console.log('must fetch, as cache expired, ix=' + ix)
      return true
    }
    console.log('not fetching, result still cached, ix=' + ix)
    return false
  })

  const DataHolderContainer = connect((state, ownProps) => {
    const params = (typeof queryParams === 'function') ? queryParams(state, ownProps) : queryParams
    const data = getResult(state.queries, query, params)
    console.log('DataHolderContainer, data', data, query, params)
    if (!data) {
      console.log('DataHolderContainer, no data')
    }
    return {
      data: getResult(state.queries, query, params),
      mustFetch: (ttl, retryInterval) => mustFetch(state.queries, query, params, ttl, retryInterval),
      params
    }
  }, (dispatch, ownProps) => ({
    fetch: (fetcher, query, variables) => {
      dispatch({ type: FETCH, query, values: variables, at: new Date().getTime() })
      fetcher(dispatch, query, variables, ownProps)
    }
  }))(DataHolder)

  return <DataHolderContainer {...componentProps} />
}
