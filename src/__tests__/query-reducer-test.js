import * as R from 'ramda'

describe('reducer', () => {
  it.skip('does stuff', () => {

    const query = 'query z'
    const variables = 'a=4,b=2'
    const result = { bla: 42, blu: 43 }

    const q1 = {
      q: 'query($id:ID!) { salesAgent(id:$id) { _id, name } }',
      v: { id: '123' }
    }

    const q2 = {
      q: 'query($id:ID!) { salesAgent(id:$id) { _id, name } }',
      v: { id: '234' }
    }

    const q3 = {
      q: 'another query',
      v: 'v=2,otherTypeOfQuery=true'
    }

    const state = {
      keys: [ JSON.stringify(q1), JSON.stringify(q2) ],
      values: [

      ]
    }

    console.log('state2', state2);
  })
})
