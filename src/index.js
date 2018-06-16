import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import Paint, {rootReducer} from './components/App/App'

const store = createStore(rootReducer)

render(
  <Provider store={store}>
    <Paint />
  </Provider>,
  document.getElementById('root')
)