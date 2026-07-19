interface IconProps {
  size?: number
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const SunIcon = ({ size = 17 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const MoonIcon = ({ size = 17 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

export const SoundOnIcon = ({ size = 17 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9.5 9.5 0 0 1 0 14" />
  </svg>
)

export const SoundOffIcon = ({ size = 17 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="m22 9-6 6M16 9l6 6" />
  </svg>
)

export const GithubIcon = ({ size = 15 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export const LinkedinIcon = ({ size = 15 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v2a6 6 0 0 1 2-2z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export const MailIcon = ({ size = 15 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

export const ExternalIcon = ({ size = 15 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
)

export const CheckIcon = ({ size = 15 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const CopyIcon = ({ size = 15 }: IconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)
