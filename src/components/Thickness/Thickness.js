import React, { Component } from 'react'
import './Image.css'

import { connect } from 'react-redux'

import { changeImage } from '../App/actions'

class Image extends Component {

}

const mapStateToProps = state => ({
  image: state.image.data,
  instrument: state.instruments.instrument,
  selection: state.instruments.selection
})
const mapDispatchToProps = dispatch => ({
  //changeThickness = 
})

export default connect(mapStateToProps, mapDispatchToProps)(Image)
