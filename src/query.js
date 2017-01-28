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
) => (Comp : ReactClass<any>) => componentProps => {

  class DataHolder extends React.Component {
    constructor(props) {
      super(props)
    }
    componentWillMount() {
      const { data, fetch, params } = this.props
      const { fetcher } = this.context
      fetch(fetcher, query, params)
    }
    render() {
      const { query, queryParams, data, lastError, children } = this.props
      const { queryLoadingIndicator } = this.context
      if (lastError) {
        // TODO: should be a configurable component to display errors
        return (<p>Unable to query API: { lastError.message || 'Error while fetching' }</p>)
      }
      console.log('about to render', this.props, data)
      const c = <Comp {...this.props} {...data} />
      return data
        ? c
        : queryLoadingIndicator
    }
  }
  DataHolder.contextTypes = contextTypes

  function getResult(state, query, variables) {
    const key = JSON.stringify({ q: query, v: variables })
    const ix = state.keys.indexOf(key)
    if (ix === -1) return undefined;
    return state.values[ix].data;
  }

  const DataHolderContainer = connect((state, ownProps) => {
    const params = (typeof queryParams === 'function') ? queryParams(state, ownProps) : queryParams
    return {
      data: getResult(state.queries, query, params),
      params
    }
  }, (dispatch, ownProps) => ({
    fetch: (fetcher, query, variables) => fetcher(dispatch, query, variables, ownProps)
  }))(DataHolder)

  return <DataHolderContainer {...componentProps} />
}
