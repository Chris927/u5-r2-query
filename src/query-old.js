import { List, Map } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'
// import { graphql } from '../actions'

const GRAPHQL_RESPONSE = 'graphql/RESPONSE'

export const query = (query, queryParams) => Component => () => {

  class DataHolder extends React.Component {
    constructor(props) {
      super(props)
    }
    componentWillMount() {
      const { data, fetch } = this.props
      // if (!data) fetch(query, queryParams)
      fetch(query, queryParams)
    }
    render() {
      const { query, queryParams, data, lastError, children } = this.props
      if (lastError) {
        // TODO: should be a configurable component to display errors
        return (<p>Unable to query API: { lastError.message || 'Error while fetching' }</p>)
      }
      return data
        ? (<Component {...this.props} {...data} />)
        : ( <div className="preloader-wrapper small active">
              <div className="spinner-layer spinner-green-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div><div className="gap-patch">
                  <div className="circle"></div>
                </div><div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>) // TODO: should be a configurable component to display while fetching
    }
  }

  function getResult(state, query, variables) {
    const statementsIndex = state.get('statements').indexOf(query)
    if (statementsIndex === -1) return undefined;
    const variablesIndex = state.getIn([ 'results', statementsIndex, 'variables' ]).indexOf(variables)
    if (variablesIndex === -1) return undefined;
    return state.getIn([ 'results', statementsIndex, 'data', variablesIndex ])
  }

  const DataHolderContainer = connect((state, ownProps) => {
    return {
      data: getResult(state.queries, query, queryParams)
    }
  }, dispatch => ({
    fetch: (query, variables) => {
      console.log('should fetch', query, variables)
      return dispatch(graphql(query, variables, GRAPHQL_RESPONSE))
    }
  }))(DataHolder)

  return <DataHolderContainer />
}

const initialState = Map({
  statements: List(),
  results: List()
})

export const queriesReducer = (state = initialState, action) => {
  if (action.type === GRAPHQL_RESPONSE) {
    const { query, variables, data } = action
    console.log('queriesReducer, should handle response', query, variables)
    let statementsIndex = state.get('statements').indexOf(query)
    if (statementsIndex === -1) {
      statementsIndex = state.get('statements').size
      state = state.update('statements', list => list.push(query))
      state = state.update('results', list => list.push(Map({
        variables: List([]),
        data: List([])
      })))
    }
    let variablesIndex = state.getIn([ 'results', statementsIndex, 'variables' ]).indexOf(variables)
    if (variablesIndex === -1) {
      variablesIndex = state.getIn([ 'results', statementsIndex, 'variables']).size
      state = state.updateIn([ 'results', statementsIndex, 'variables' ], list => list.push(variables))
    }
    state = state.updateIn([ 'results', statementsIndex, 'data', variablesIndex ], prevData => data)
  }
  return state
}
