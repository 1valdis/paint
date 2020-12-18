import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './components/NewApp/App'

// import './core/test'

render(
  <StrictMode>
    {/* <Provider store={store}>
      <App />
    </Provider> */}
    <App/>
  </StrictMode>,
  document.getElementById('root')
)
