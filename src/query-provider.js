//@flow
import React from 'react'

import contextTypes from './context-types'

export const DefaultLoadingIndicator = () => <p>Loading...</p>

export class QueryProvider extends React.Component {
  getChildContext() {
    const { fetcher, queryLoadingIndicator, ttl } = this.props
    return {
      fetcher,
      ttl: ttl || 10000,
      queryLoadingIndicator: queryLoadingIndicator || <DefaultLoadingIndicator />
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
