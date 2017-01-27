//@flow
import React from 'react'

export const queryReducer = (state: any = '', action: any) => state

export const query = () => (Component : ReactClass<any>) => () => {
  return <p>query comp.</p>
}

export const QueryProvider = ({ children } : { children: ReactClass<any> }) => {
  return children
}
