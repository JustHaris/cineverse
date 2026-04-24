'use client'

import { FastAverageColor } from 'fast-average-color'
import { useEffect, useState } from 'react'

export default function PosterGlow({ imageUrl }) {
  const [color, setColor] = useState('rgba(10, 10, 10, 0)')

  useEffect(() => {
    if (!imageUrl) return
    
    const fac = new FastAverageColor()
    const img = new window.Image() // Use window.Image to avoid Next.js Image conflicts
    img.crossOrigin = 'Anonymous'
    img.src = imageUrl
    
    img.onload = () => {
      try {
        const result = fac.getColor(img)
        // Make it a soft, vibrant glow
        setColor(`rgba(${result.value[0]}, ${result.value[1]}, ${result.value[2]}, 0.5)`)
      } catch (e) {
        console.warn("Could not extract poster color", e)
      }
    }

    return () => fac.destroy()
  }, [imageUrl])

  return (
    <div 
      className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-in-out z-0"
      style={{
        background: `radial-gradient(circle at 30% 50%, ${color} 0%, rgba(10,10,10,0) 60%)`,
        mixBlendMode: 'screen'
      }}
    />
  )
}
