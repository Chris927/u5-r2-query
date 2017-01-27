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
) => (component : ReactClass<any>) => () => {

  class DataHolder extends React.Component {
    constructor(props) {
      super(props)
    }
    componentWillMount() {
      const { data, fetch } = this.props
      const { fetcher } = this.context
      fetch(fetcher, query, queryParams)
    }
    render() {
      const { query, queryParams, data, lastError, children } = this.props
      const { queryLoadingIndicator } = this.context
      if (lastError) {
        // TODO: should be a configurable component to display errors
        return (<p>Unable to query API: { lastError.message || 'Error while fetching' }</p>)
      }
      return data
        ? (<component {...this.props} {...data} />)
        : queryLoadingIndicator
    }
  }
  DataHolder.contextTypes = contextTypes

  function getResult(state, query, variables) {
    console.log('getResult', state, query, variables)
    const statementsIndex = state.statements.indexOf(query)
    if (statementsIndex === -1) return undefined;
    const variablesIndex = state.results[statementsIndex].indexOf(variables)
    if (variablesIndex === -1) return undefined;
    return state.results[statementsIndex].data[variablesIndex]
  }

  const DataHolderContainer = connect((state, ownProps) => {
    return {
      data: getResult(state.queries, query, queryParams)
    }
  }, dispatch => ({
    fetch: (fetcher, query, variables) => {
      return dispatch(fetcher(query, variables, RECEIVED))
    }
  }))(DataHolder)

  return <DataHolderContainer />
}
