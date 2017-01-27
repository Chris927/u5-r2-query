//@flow
import React from 'react'

export default (
  query: string,
  params: any
) => (Component : ReactClass<any>) => () => {
  return <p>query comp.</p>
}
