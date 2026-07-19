// A 60%-style board, Mac-flavored bottom row. Widths in key units (1u = one
// alpha key); each row sums to 15u.
type KeyDef = [label: string, width: number, code: string]

const ROWS: KeyDef[][] = [
  [
    ['ESC', 1, 'Escape'], ['1', 1, 'Digit1'], ['2', 1, 'Digit2'], ['3', 1, 'Digit3'],
    ['4', 1, 'Digit4'], ['5', 1, 'Digit5'], ['6', 1, 'Digit6'], ['7', 1, 'Digit7'],
    ['8', 1, 'Digit8'], ['9', 1, 'Digit9'], ['0', 1, 'Digit0'], ['-', 1, 'Minus'],
    ['=', 1, 'Equal'], ['DEL', 2, 'Backspace'],
  ],
  [
    ['TAB', 1.5, 'Tab'], ['Q', 1, 'KeyQ'], ['W', 1, 'KeyW'], ['E', 1, 'KeyE'],
    ['R', 1, 'KeyR'], ['T', 1, 'KeyT'], ['Y', 1, 'KeyY'], ['U', 1, 'KeyU'],
    ['I', 1, 'KeyI'], ['O', 1, 'KeyO'], ['P', 1, 'KeyP'], ['[', 1, 'BracketLeft'],
    [']', 1, 'BracketRight'], ['\\', 1.5, 'Backslash'],
  ],
  [
    ['CAPS', 1.75, 'CapsLock'], ['A', 1, 'KeyA'], ['S', 1, 'KeyS'], ['D', 1, 'KeyD'],
    ['F', 1, 'KeyF'], ['G', 1, 'KeyG'], ['H', 1, 'KeyH'], ['J', 1, 'KeyJ'],
    ['K', 1, 'KeyK'], ['L', 1, 'KeyL'], [';', 1, 'Semicolon'], ["'", 1, 'Quote'],
    ['ENTER', 2.25, 'Enter'],
  ],
  [
    ['SHIFT', 2.25, 'ShiftLeft'], ['Z', 1, 'KeyZ'], ['X', 1, 'KeyX'], ['C', 1, 'KeyC'],
    ['V', 1, 'KeyV'], ['B', 1, 'KeyB'], ['N', 1, 'KeyN'], ['M', 1, 'KeyM'],
    [',', 1, 'Comma'], ['.', 1, 'Period'], ['/', 1, 'Slash'], ['SHIFT', 2.75, 'ShiftRight'],
  ],
  [
    ['CTRL', 1.25, 'ControlLeft'], ['OPT', 1.25, 'AltLeft'], ['CMD', 1.25, 'MetaLeft'],
    ['', 6.25, 'Space'], ['CMD', 1.25, 'MetaRight'], ['OPT', 1.25, 'AltRight'],
    ['FN', 1.25, 'Fn'], ['CTRL', 1.25, 'ControlRight'],
  ],
]

const ACCENT_CODES = new Set(['Escape', 'Enter'])
const MOD_WIDTH = 1.2 // keys wider than this get the darker "modifier" color

export interface KeyInfo {
  label: string
  width: number
  code: string
  x: number
  z: number
  accent: boolean
  mod: boolean
}

export const KEYS: KeyInfo[] = ROWS.flatMap((row, rowIndex) => {
  let cursor = -7.5
  return row.map(([label, width, code]) => {
    const x = cursor + width / 2
    cursor += width
    return {
      label,
      width,
      code,
      x,
      z: rowIndex - 2,
      accent: ACCENT_CODES.has(code),
      mod: width > MOD_WIDTH && code !== 'Space',
    }
  })
})

export const BOARD_WIDTH_U = 15
export const BOARD_DEPTH_U = 5
