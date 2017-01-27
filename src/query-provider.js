//@flow
import React from 'react'

import contextTypes from './context-types'

class QueryProvider extends React.Component {
  render() {
    const { children } = this.props
    return children
  }
}
QueryProvider.propTypes = contextTypes
QueryProvider.childContextTypes = contextTypes

export default QueryProvider
