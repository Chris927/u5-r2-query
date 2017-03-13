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
      const { fetch, mustFetch, params } = this.props
      const { fetcher, ttl } = this.context
      if (mustFetch(ttl)) {
        fetch(fetcher, query, params)
      }
    }
    componentWillReceiveProps(nextProps) {
      // TODO: repeats what we do in componentWillMount, but with `nextProps`
      // which causes fetching double (in some cases)
      const { fetch, mustFetch, params } = nextProps
      const { fetcher, ttl } = this.context
      // console.log('componentWillReceiveProps', nextProps)
      if (mustFetch(ttl)) {
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

  const mustFetch = R.curry((state, query, variables, ttl) => {
    const ix = getIndex(state, query, variables)
    const queryState = getQueryState(state, query, variables)
    if (!queryState) {
      console.log('must fetch, because no result cached yet, ix=' + ix)
      return true
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
    return {
      data: getResult(state.queries, query, params),
      mustFetch: ttl => mustFetch(state.queries, query, params, ttl),
      params
    }
  }, (dispatch, ownProps) => ({
    fetch: (fetcher, query, variables) => fetcher(dispatch, query, variables, ownProps)
  }))(DataHolder)

  return <DataHolderContainer {...componentProps} />
}
