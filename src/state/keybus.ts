// Tiny pub/sub bridging DOM keyboard events into the 3D scene without
// touching React state (key presses happen at typing rate).
export type KeyListener = (code: string, down: boolean) => void
export type BufferListener = (buffer: string) => void

const keyListeners = new Set<KeyListener>()
const bufferListeners = new Set<BufferListener>()

export function onKey(fn: KeyListener): () => void {
  keyListeners.add(fn)
  return () => keyListeners.delete(fn)
}

export function emitKey(code: string, down: boolean): void {
  for (const fn of keyListeners) fn(code, down)
}

export function onBuffer(fn: BufferListener): () => void {
  bufferListeners.add(fn)
  return () => bufferListeners.delete(fn)
}

export function emitBuffer(buffer: string): void {
  for (const fn of bufferListeners) fn(buffer)
}
