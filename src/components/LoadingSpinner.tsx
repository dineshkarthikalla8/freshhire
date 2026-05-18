import React from 'react'

export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 48 }) => {
  const s = size
  return (
    <div className="flex items-center justify-center">
      <svg
        width={s}
        height={s}
        viewBox="0 0 50 50"
        className="animate-spin"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="25" cy="25" r="20" stroke="rgba(0,0,0,0.08)" strokeWidth="6" />
        <path d="M45 25a20 20 0 0 0-20-20" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default LoadingSpinner
