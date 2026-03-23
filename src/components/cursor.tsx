"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export function Cursor() {
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const springX = useSpring(rawX, { stiffness: 200, damping: 20 })
  const springY = useSpring(rawY, { stiffness: 200, damping: 20 })

  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role='button']")) {
        ringRef.current?.classList.add("cursor-ring--hover")
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role='button']")) {
        ringRef.current?.classList.remove("cursor-ring--hover")
      }
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseover", onMouseOver)
    window.addEventListener("mouseout", onMouseOut)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseover", onMouseOver)
      window.removeEventListener("mouseout", onMouseOut)
    }
  }, [dotX, dotY, rawX, rawY])

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#F5B800",
          pointerEvents: "none",
          zIndex: 99999,
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid rgba(245,184,0,0.4)",
          pointerEvents: "none",
          zIndex: 99998,
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          transition: "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
        }}
      />
      <style>{`
        .cursor-ring--hover {
          width: 40px !important;
          height: 40px !important;
          border-color: rgba(245,184,0,0.7) !important;
          background-color: rgba(245,184,0,0.08) !important;
        }
        @media (pointer: coarse) {
          .cursor-dot, .cursor-ring { display: none !important; }
        }
      `}</style>
    </>
  )
}
