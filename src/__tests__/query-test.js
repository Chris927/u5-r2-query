import { query } from '../query'

describe('query', () => {
  it('queries', () => {
    const Component = ({ things }) => <p>{ JSON.stringify(things) }</p>
    const Connected = query('the query', { var1: 42 })(Component)
    
  })
})
