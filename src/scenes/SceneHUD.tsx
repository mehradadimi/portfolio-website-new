import { useStore } from '../state/store'

export const SCENE_LABELS = ['OPENING', 'SKILLS', 'EXPERIENCE', 'PROJECTS', 'THE DESK', 'CONTACT']

// Fixed film chrome: scene counter bottom-left, film-strip progress bottom-center.
export function SceneHUD() {
  const scene = useStore((s) => s.scene)
  const mode = useStore((s) => s.mode)
  if (mode === 'interactive') return null

  return (
    <>
      <div className="scene-counter" aria-hidden="true">
        SCENE <b>{String(scene + 1).padStart(2, '0')}</b> / {String(SCENE_LABELS.length).padStart(2, '0')}
        <span className="scene-counter-label"> · {SCENE_LABELS[scene]}</span>
      </div>
      <div className="film-strip" aria-hidden="true">
        {SCENE_LABELS.map((label, i) => (
          <span key={label} className={`film-cell ${i <= scene ? 'on' : ''}`} />
        ))}
      </div>
    </>
  )
}
