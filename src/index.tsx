import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import Paint, { rootReducer } from './components/App/App'

const composeEnhancers = /* window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || */ compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

render(
  <StrictMode>
    <Provider store={store}>
      <Paint />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
