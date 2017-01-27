import React from 'react'
import renderer from 'react-test-renderer'

function createNodeMock() {
  // You can return anything from this function.
  // For example:
  return {
    focus() {
      // Do nothing
    }
  }
}

global.render = component => {

  // TODO: wrapping pointless, so far
  const wrapped = <div>{ component }</div>

  return renderer.create(wrapped, {createNodeMock})
}
