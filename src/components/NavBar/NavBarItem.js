import React from 'react'
import PropTypes from 'prop-types'

import './NavBarItem.css'

const NavBarItem = props => (
  <section className='navbar-item'>
    {props.children}
    <footer>
      {props.footer}
    </footer>
  </section>
)

NavBarItem.propTypes = {
  footer: PropTypes.string
}

export default NavBarItem
