import './ResizeSkew.css'

import { ChangeEvent, FunctionComponent, useCallback, useState } from 'react'

export interface ResizeSkewResult {
  resizeToWidth: number
  resizeToHeight: number
  skewRadiansHorizontally: number
  skewRadiansVertically: number
}

interface ResizeSkewProps {
  startingWidth: number
  startingHeight: number
  handleResizeSkew: (settings: ResizeSkewResult) => void
  handleCancel: () => void
}

type ResizeMode = 'pixels' | 'percents'

export const ResizeSkew: FunctionComponent<ResizeSkewProps> = (props) => {
  const [resizeMode, setResizeMode] = useState<ResizeMode>('percents')
  const [resizeWidth, setResizeWidth] = useState(100)
  const [resizeHeight, setResizeHeight] = useState(100)
  const [keepAspectRatio, setKeepAspectRatio] = useState(true)

  const [skewDegreesHorizontally, setSkewDegreesHorizontally] = useState(0)
  const [skewDegreesVertically, setSkewDegreesVertically] = useState(0)

  const updateWidth = useCallback((height: number) => {
    if (resizeMode === 'percents') {
      setResizeWidth(height)
    } else {
      setResizeWidth(Math.ceil(height * props.startingWidth / props.startingHeight))
    }
  }, [props.startingHeight, props.startingWidth, resizeMode])

  const updateHeight = useCallback((width: number) => {
    if (resizeMode === 'percents') {
      setResizeHeight(width)
    } else {
      setResizeHeight(Math.ceil(width * props.startingHeight / props.startingWidth))
    }
  }, [props.startingHeight, props.startingWidth, resizeMode])

  const handleResizeModeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newMode = e.currentTarget.value as ResizeMode
    setResizeMode(newMode)
    if (newMode === 'percents') {
      setResizeWidth(100)
      setResizeHeight(100)
    } else {
      setResizeWidth(props.startingWidth)
      setResizeHeight(props.startingHeight)
    }
  }, [props.startingHeight, props.startingWidth])

  const handleKeepAspectRatioChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.checked
    setKeepAspectRatio(newValue)
    if (newValue) {
      updateHeight(resizeWidth)
    }
  }, [resizeWidth, updateHeight])

  return (
    <form className='resize-skew' onSubmit={(e) => {
      e.preventDefault()
      props.handleResizeSkew({
        resizeToHeight: resizeMode === 'percents'
          ? Math.ceil(resizeHeight * props.startingHeight * 0.01)
          : resizeHeight,
        resizeToWidth: resizeMode === 'percents'
          ? Math.ceil(resizeWidth * props.startingWidth * 0.01)
          : resizeWidth,
        skewRadiansHorizontally: skewDegreesHorizontally * (Math.PI / 180),
        skewRadiansVertically: skewDegreesVertically * (Math.PI / 180)
      })
    }} onReset={props.handleCancel}>
      <fieldset className='resize'>
        <legend>Resize</legend>
        <span style={{ gridArea: 'label' }}>Resize:</span>
        <label style={{ gridArea: 'percents' }}><input type='radio' name='resize-mode' checked={resizeMode === 'percents'} onChange={handleResizeModeChange} value="percents"/>To percent</label>
        <label style={{ gridArea: 'pixels' }}><input type='radio' name='resize-mode' checked={resizeMode === 'pixels'} onChange={handleResizeModeChange} value="pixels"/>To pixels</label>
        <div className='align-inputs'>
          <label htmlFor='resize-width'>Horizontally:</label><input name='resize-width' type="number" min="1" max={resizeMode === 'percents' ? 500 : 10000}
            value={resizeWidth}
            onChange={(e) => {
              setResizeWidth(+e.currentTarget.value)
              if (keepAspectRatio) updateHeight(+e.currentTarget.value)
            }}/>
          <label htmlFor='resize-height'>Vertically:</label><input name='resize-heigth' type="number" min="1" max={resizeMode === 'percents' ? 500 : 10000}
            value={resizeHeight}
            onChange={(e) => {
              setResizeHeight(+e.currentTarget.value)
              if (keepAspectRatio) updateWidth(+e.currentTarget.value)
            }}/>
        </div>
        <label style={{ gridArea: 'aspect-ratio' }}><input type="checkbox" checked={keepAspectRatio} onChange={handleKeepAspectRatioChange} />Keep aspect ratio</label>
      </fieldset>
      <fieldset className='skew'>
        <legend>Skew (degrees)</legend>
        <div className='align-inputs'>
          <label htmlFor='skew-h'>Horizontally:</label> <input name='skew-h' type="number" min="-89" max="89" value={skewDegreesHorizontally} onChange={e => setSkewDegreesHorizontally(+e.currentTarget.value)} />
          <label htmlFor='skew-v'>Vertically:</label> <input name='skew-v' type="number" min="-89" max="89" value={skewDegreesVertically} onChange={e => setSkewDegreesVertically(+e.currentTarget.value)} />
        </div>
      </fieldset>
      <div className='align-buttons'>
        <input type="submit" value="OK"/><input type="reset" value="Cancel"/>
      </div>
    </form>
  )
}
