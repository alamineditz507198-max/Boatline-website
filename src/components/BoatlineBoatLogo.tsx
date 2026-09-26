import React from 'react';

interface BoatlineBoatLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'inline' | 'transparent' | 'badge' | 'pfp';
  theme?: 'dark' | 'light' | 'auto';
  color?: string;
}

/**
 * Official Boatline yacht line-art logo.
 * Renders with a pure transparent background (PNG-style alpha transparency)
 * without any circular white container or background box.
 */
export function BoatlineBoatLogo({
  className = '',
  size = 32,
  variant = 'transparent',
  theme = 'auto',
  color,
}: BoatlineBoatLogoProps) {
  // Determine stroke color: custom color -> theme-specific -> fallback to currentColor
  const strokeColor =
    color ||
    (theme === 'dark'
      ? '#ffffff'
      : theme === 'light'
      ? '#0f294a'
      : 'currentColor');

  // Pennant burgee flag color
  const flagColor =
    theme === 'light'
      ? '#0f294a'
      : '#38bdf8';

  const flagStroke =
    theme === 'light'
      ? '#0f294a'
      : '#ffffff';

  const boatSvg = (
    <svg
      viewBox="0 0 1000 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full overflow-visible transition-colors"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Navy / Sky Burgee Pennant on mast */}
      <path
        d="M312 90 C264 88 215 100 184 117 C218 134 266 142 322 144 Z"
        fill={flagColor}
        stroke={flagStroke}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Flagpole / Mast & Finial Ball */}
      <line
        x1="334"
        y1="216"
        x2="299"
        y2="76"
        stroke={strokeColor}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <circle
        cx="298"
        cy="72"
        r="9"
        fill={strokeColor}
        stroke={strokeColor}
        strokeWidth="5"
      />

      {/* Hardtop Canopy Roof */}
      <path
        d="M276 226 C375 210 500 206 594 210 L594 216 C495 212 375 215 276 232 Z"
        fill={strokeColor}
      />

      {/* Windshield frame / Forward canopy visor strut to cabin */}
      <line
        x1="562"
        y1="216"
        x2="614"
        y2="271"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Windshield glass rake curve */}
      <path
        d="M398 285 C468 238 548 221 614 271"
        fill="none"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Hardtop Rear Arch / Aerodynamic swept pillar */}
      <path
        d="M336 224 C372 235 400 256 398 285 C396 295 385 303 365 312"
        fill="none"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Cabin trunk foredeck step */}
      <path
        d="M520 279 L805 259 C818 259 825 267 825 281 L825 286"
        fill="none"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Three Horizontal Capsule Portholes */}
      <rect x="520" y="295" width="28" height="9" rx="4.5" fill={strokeColor} />
      <rect x="605" y="288" width="28" height="9" rx="4.5" fill={strokeColor} />
      <rect x="694" y="279" width="30" height="9" rx="4.5" fill={strokeColor} />

      {/* Sheer line / Gunwale (cockpit dipping to coaming, rising to bow) */}
      <path
        d="M98 335 C102 335 104 337 105 340 L355 314 C450 304 600 291 825 286 L918 269"
        fill="none"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Hull profile: Transom, Keel bottom, Raked bow stem */}
      <path
        d="M98 335 L112 406 L850 406 L918 269"
        fill="none"
        stroke={strokeColor}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center bg-transparent ${className}`}
      style={{
        width: size,
        height: typeof size === 'number' ? size * 0.65 : 'auto',
      }}
      aria-label="Boatline boat logo"
    >
      {boatSvg}
    </span>
  );
}

export default BoatlineBoatLogo;
