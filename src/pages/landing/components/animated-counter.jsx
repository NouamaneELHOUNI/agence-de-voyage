"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"

export function AnimatedCounter({ value, duration = 2000, className, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const startTime = useRef(null)
  const animationFrameId = useRef(null)

  useEffect(() => {
    if (!isInView) return

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp
      const progress = timestamp - startTime.current

      const percentage = Math.min(progress / duration, 1)
      const easedPercentage = easeOutQuart(percentage)
      const currentCount = Math.floor(easedPercentage * value)

      setCount(currentCount)

      if (progress < duration) {
        animationFrameId.current = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [isInView, value, duration])

  // Easing function for smoother animation
  const easeOutQuart = (x) => {
    return 1 - Math.pow(1 - x, 4)
  }

  return (
    <div ref={ref} className={cn("font-bold", className)}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}
