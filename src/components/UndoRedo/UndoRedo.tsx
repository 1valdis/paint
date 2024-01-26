import { FC } from 'react'

import './UndoRedo.css'

interface UndoRedoProps {
  onUndo: () => void
  undoAvailable: boolean;
  onRedo: () => void
  redoAvailable: boolean;
}

export const UndoRedo: FC<UndoRedoProps> = (props) => <>
  <button className='undo-redo' onClick={props.onUndo} disabled={!props.undoAvailable}>⟲ Undo</button>
  <button className='undo-redo' onClick={props.onRedo} disabled={!props.redoAvailable}>⟳ Redo</button>
</>
