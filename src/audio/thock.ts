// Synthesized mechanical-keyboard "thock" — no audio assets needed.
let ctx: AudioContext | null = null
let noiseBuffer: AudioBuffer | null = null

function ensureContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  if (!ctx) {
    ctx = new AudioContext()
    const len = Math.floor(ctx.sampleRate * 0.09)
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function thock(intensity = 1): void {
  const ac = ensureContext()
  if (!ac || !noiseBuffer) return
  const t = ac.currentTime
  const out = ac.createGain()
  out.gain.value = 0.28 * intensity
  out.connect(ac.destination)

  // filtered noise burst = the "clack"
  const noise = ac.createBufferSource()
  noise.buffer = noiseBuffer
  noise.playbackRate.value = 0.85 + Math.random() * 0.35
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 1300 + Math.random() * 500
  lp.Q.value = 0.8
  const nGain = ac.createGain()
  nGain.gain.setValueAtTime(1, t)
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
  noise.connect(lp).connect(nGain).connect(out)
  noise.start(t)
  noise.stop(t + 0.09)

  // low sine thump = the "thock" body
  const osc = ac.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150 + Math.random() * 25, t)
  osc.frequency.exponentialRampToValueAtTime(65, t + 0.05)
  const oGain = ac.createGain()
  oGain.gain.setValueAtTime(0.9, t)
  oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
  osc.connect(oGain).connect(out)
  osc.start(t)
  osc.stop(t + 0.08)
}
