'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sz = { sm: 24, md: 32, lg: 48 }[size];
  const text = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' }[size];

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative" style={{ width: sz, height: sz }}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={sz}
          height={sz}
        >
          <defs>
            <radialGradient id="logo-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7CE8FF" />
              <stop offset="60%" stopColor="#00D4FF" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </radialGradient>
            <filter id="logo-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="16"
            cy="16"
            r="11"
            fill="url(#logo-grad)"
            filter="url(#logo-glow)"
          />
          <circle cx="16" cy="16" r="5" fill="#FFFFFF" opacity="0.85" />
          <circle cx="16" cy="16" r="13" stroke="#00D4FF" strokeWidth="0.5" opacity="0.4" />
        </svg>
      </div>
      {showText && (
        <span className={`font-semibold tracking-tight ${text}`}>
          EduMate
        </span>
      )}
    </div>
  );
}
