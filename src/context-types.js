//@flow

import React from 'react'
import PropTypes from 'prop-types'

export default {
  fetcher: PropTypes.func.isRequired,
  queryStatePath: PropTypes.string,
  ttl: PropTypes.number,
  retryInterval: PropTypes.number,
  queryLoadingIndicator: PropTypes.element
}
