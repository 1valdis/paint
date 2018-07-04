import React from 'react'

import './About.css'

const About = props => (
  <div className='about'>
    <button className='about-close-button' onClick={props.onClose} />
    <p>Вы серьёзно ожидали здесь увидеть что-то нормальное? :D</p>
    <p>
      Ну ладно, вот немного языка legalese, поскольку авторов иконок надо указать в эбауте прожки)))
    </p>
    <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>, <a href="https://www.flaticon.com/authors/pixel-buddha" title="Pixel Buddha">Pixel Buddha</a>, <a href="http://www.freepik.com" title="Freepik">Freepik</a>, <a href="https://www.flaticon.com/authors/dimitry-miroliubov" title="Dimitry Miroliubov">Dimitry Miroliubov</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a></div>
  </div>
)

export default About
