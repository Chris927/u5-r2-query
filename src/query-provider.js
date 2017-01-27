//@flow
import React from 'react'

import contextTypes from './context-types'

class QueryProvider extends React.Component {
  getChildContext() {
    const { fetcher, queryLoadingIndicator } = this.props
    return {
      fetcher,
      queryLoadingIndicator: queryLoadingIndicator || (() => <p>Loading...</p>)
    }
  }
  render() {
    const { children } = this.props
    return children
  }
}
QueryProvider.propTypes = contextTypes
QueryProvider.childContextTypes = contextTypes

export default QueryProvider
