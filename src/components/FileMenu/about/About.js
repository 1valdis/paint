import React from 'react'

import './About.css'

const About = props => (
  <div className='about'>
    <button className='about-close-button' onClick={props.onClose} />
    <p>Вы серьёзно ожидали здесь увидеть что-то нормальное? :D</p>
    <p>
      Ну ладно, вот немного языка legalese, поскольку авторов иконок надо указать в эбауте прожки)))
    </p>
    <div>
      Icons made by <a
        href='https://www.flaticon.com/authors/taras-shypka'
        title='Taras Shypka'
      >
        Taras Shypka
      </a> from <a href='https://www.flaticon.com/' title='Flaticon'>
        www.flaticon.com
      </a> is licensed by <a
        href='http://creativecommons.org/licenses/by/3.0/'
        title='Creative Commons BY 3.0'
        target='_blank'
        rel='noopener noreferrer'
      >CC 3.0 BY</a>
    </div>
  </div>
)

export default About
