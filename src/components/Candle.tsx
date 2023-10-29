import clsx from "clsx"
import { useCallback, useState } from "react"
import type { Container, Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"
import { loadEmittersPlugin } from "tsparticles-plugin-emitters"

import FlameParticles from "./FlameParticles"
import SmokeParticles from "./SmokeParticles"

const positionClasses = [
  "h-auto top-0 left-0 right-0 ml-auto mr-auto",
  "top-[10%] right-[20%]",
  "top-[33%] right-0",
  "bottom-[33%] right-0",
  "bottom-[10%] right-[20%]",
  "bottom-0 left-0 right-0 ml-auto mr-auto",
  "bottom-[10%] left-[20%]",
  "bottom-[33%] left-0",
  "top-[33%] left-0",
  "top-[10%] left-[20%]",
]

export default function Candle({ index }) {
  const [isLit, setIsLit] = useState(true)

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadEmittersPlugin(engine, false)
    await loadSlim(engine, false)
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // await console.log(container)
  }, [])

  return (
    <button
      onClick={() => setIsLit((prevState) => !prevState)}
      className={clsx(positionClasses[index], "absolute w-[128px]")}
    >
      <img src="/candle.png" className="absolute inset-0 w-full" style={{ imageRendering: "pixelated" }} />
      {isLit ? (
        <FlameParticles candleIndex={index} particlesInit={particlesInit} particlesLoaded={particlesLoaded} />
      ) : (
        <SmokeParticles candleIndex={index} particlesLoaded={particlesLoaded} />
      )}
      {/* <FlameParticles candleIndex={index} particlesInit={particlesInit} particlesLoaded={particlesLoaded} />
              <SmokeParticles candleIndex={index} particlesInit={particlesInit} particlesLoaded={particlesLoaded} /> */}
    </button>
  )
}
