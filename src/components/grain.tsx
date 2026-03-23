"use client"

import { useEffect, useRef } from "react"

export function Grain() {
  const filterRef = useRef<SVGFETurbulenceElement>(null)

  useEffect(() => {
    let rafId: number
    let seed = 0

    function tick() {
      seed = (seed + 1) % 1000
      if (filterRef.current) {
        filterRef.current.setAttribute("seed", String(seed))
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.04,
      }}
      aria-hidden="true"
    >
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              ref={filterRef}
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              seed="0"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "url(#grain-filter)",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
}
