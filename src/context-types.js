//@flow

import React from 'react'

export default {
  fetcher: React.PropTypes.func.isRequired,
  queryStatePath: React.PropTypes.string,
  ttl: React.PropTypes.number,
  retryInterval: React.PropTypes.number,
  queryLoadingIndicator: React.PropTypes.element
}
