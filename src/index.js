import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import Paint, { rootReducer } from './components/App/App'

const store = createStore(rootReducer, applyMiddleware(thunk))

render(
  <StrictMode>
    <Provider store={store}>
      <Paint />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
