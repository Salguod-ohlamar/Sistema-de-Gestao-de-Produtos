import * as React from 'react'

export interface NexoraLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function NexoraLogoIcon({ size = 28, className, ...props }: NexoraLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="#0E1526" stroke="#1B2540" />
      <path
        d="M9 23V9L15 17V23H9Z"
        fill="#2F6BFF"
      />
      <path
        d="M23 9V23L17 15V9H23Z"
        fill="#38BDF8"
      />
      <path
        d="M15 17L23 9H17L9 23H15L15 17Z"
        fill="#4C82FF"
      />
    </svg>
  )
}

export function NexoraBrand({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <NexoraLogoIcon size={30} />
      <span className="font-headline font-bold text-lg text-text-primary tracking-tight">
        Nexora
      </span>
    </div>
  )
}
