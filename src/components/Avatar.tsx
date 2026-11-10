import { useState } from 'react'

interface AvatarProps {
  name: string
  src: string | null
  size?: number
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || src === failedSrc) {
    return (
      <span
        className="avatar avatar--fallback"
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        aria-hidden="true"
      >
        {name.charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      className="avatar"
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
    />
  )
}
