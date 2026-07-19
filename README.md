# Mehrad Adimi — 3D Portfolio

An interactive 3D portfolio: a floating low-poly dev-desk island with a **typeable mechanical keyboard** — your real keystrokes press the 3D keys (with synthesized "thock" audio), and typing commands navigates the site.

## Try it

- **Type** `projects`, `skills`, `experience`, `contact`, or `help` and hit ↵
- **Scroll** — the camera flies around the desk per section
- The monitor runs a live terminal that follows the active section and echoes what you type
- There's a Konami-code easter egg (`↑↑↓↓←→←→BA`)
- Sound and dark/light theme toggles live in the navbar

## Stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev)
- [three.js](https://threejs.org) via [@react-three/fiber](https://r3f.docs.pmnd.rs) + [drei](https://drei.docs.pmnd.rs) — fully procedural scene, no 3D model files
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) + [Lenis](https://lenis.darkroom.engineering/) for scroll
- [zustand](https://zustand.docs.pmnd.rs/) for UI state; Web Audio API for keyboard sounds (no audio assets)

## Performance

- WebGL canvas lazy-mounts behind a static poster (fast LCP)
- Device tiering: clamped DPR, fewer particles, and tap-to-press keys on mobile
- `prefers-reduced-motion` disables smooth scroll, camera easing, and float animations
- No GLTF/HDR downloads — geometry is procedural, lighting is analytic

## Scripts

```bash
npm run dev       # dev server
npm run build     # typecheck + production build to dist/
npm run preview   # serve the production build
```

## Contact form (optional)

The contact form posts through Brevo and only renders when `VITE_BREVO_API_KEY` is set (e.g. in `.env.local`). Without it, the section falls back to email/social buttons. Note that a client-side key is visible to visitors — prefer a serverless proxy if abuse is a concern.

## Docker

```bash
docker compose up --build   # serves the production build on http://localhost:3000
```
