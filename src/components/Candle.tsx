import clsx from "clsx"
import { useCallback, useState } from "react"
import type { Engine } from "tsparticles-engine"
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

export default function Candle({ index, isAnimated }) {
  const [isLit, setIsLit] = useState(true)

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadEmittersPlugin(engine, false)
    await loadSlim(engine, false)
  }, [])

  return (
    <button
      onClick={() => setIsLit((prevState) => !prevState)}
      className={clsx(positionClasses[index], "absolute w-[128px]")}
    >
      <img src="/candle.png" className="absolute inset-0 w-full" style={{ imageRendering: "pixelated" }} />
      {isAnimated ? (
        <>
          {isLit ? (
            <>
              <div
                className=" w-[200px] h-[200px] absolute -top-[105px] -left-[36px]"
                style={{
                  background: "radial-gradient(circle at center, rgba(255, 207, 74, 0.5) 0%, rgba(255, 207, 74, 0) 60%",
                }}
              />
              <FlameParticles candleIndex={index} particlesInit={particlesInit} />
              <div className="-top-[1px] left-[61px] w-[6px] h-[6px] absolute bg-yellow" />
            </>
          ) : (
            <SmokeParticles candleIndex={index} />
          )}
        </>
      ) : (
        <>{isLit && <div className="absolute left-12 bottom-0 w-8 h-12 bg-[orange]" />}</>
      )}
    </button>
  )
}
