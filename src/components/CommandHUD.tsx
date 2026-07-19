import { useEffect, useState } from 'react'
import { onBuffer } from '../state/keybus'

export interface Flash {
  msg: string
  id: number
}

export function CommandHUD({ flash }: { flash: Flash | null }) {
  const [buffer, setBuffer] = useState('')
  const [flashVisible, setFlashVisible] = useState(false)

  useEffect(() => onBuffer(setBuffer), [])

  useEffect(() => {
    if (!flash) return
    setFlashVisible(true)
    const id = window.setTimeout(() => setFlashVisible(false), 2600)
    return () => window.clearTimeout(id)
  }, [flash])

  const showBuffer = buffer.length > 0
  const visible = showBuffer || flashVisible

  return (
    <div className={`hud ${visible ? 'visible' : ''}`} role="status" aria-live="polite">
      {showBuffer ? (
        <>
          <span className="prompt">&gt; </span>
          {buffer}
          <span className="prompt">▌</span>
        </>
      ) : (
        flash?.msg ?? ''
      )}
    </div>
  )
}
