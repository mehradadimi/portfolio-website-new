// Mutable scroll state shared between the DOM scroll system and the R3F
// frame loop. Written by ScrollTrigger callbacks, read in useFrame — kept
// outside React state so scrolling never triggers React re-renders.
export const scrollState = {
  /** 0..1 progress across the whole page */
  progress: 0,
  /** page-progress value at which each section's center crosses the viewport center */
  stops: [0, 0.25, 0.5, 0.75, 1],
}

/** Continuous section index (0..sections-1) for a given page progress. */
export function sectionFloat(progress: number): number {
  const stops = scrollState.stops
  if (progress <= stops[0]) return 0
  for (let i = 0; i < stops.length - 1; i++) {
    if (progress <= stops[i + 1]) {
      const span = stops[i + 1] - stops[i]
      return i + (span > 0 ? (progress - stops[i]) / span : 0)
    }
  }
  return stops.length - 1
}
