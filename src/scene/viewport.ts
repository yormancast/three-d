export interface ViewportProfile {
  compactLayout: boolean
  portrait: boolean
  lowPower: boolean
}

export function getViewportProfile(
  width: number,
  height: number,
  coarsePointer: boolean,
  layoutBreakpoint: number,
  compactLandscapeHeight: number,
): ViewportProfile {
  const portrait = height > width
  const narrow = width < layoutBreakpoint
  const compactLandscape = !portrait && height < compactLandscapeHeight
  return {
    compactLayout: narrow || compactLandscape,
    portrait,
    lowPower: narrow || coarsePointer,
  }
}
