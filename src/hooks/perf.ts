// Device performance tier, decided once at module load.
export interface PerfTier {
  isTouch: boolean
  dpr: [number, number]
  shardCount: number
}

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const perfTier: PerfTier = {
  isTouch,
  dpr: isTouch ? [1, 1.5] : [1, 2],
  shardCount: isTouch ? 40 : 110,
}
