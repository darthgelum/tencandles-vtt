import clsx from "clsx"
import { useCallback, useEffect, useRef } from "react"
import type { Engine } from "tsparticles-engine"
import { loadSlim } from "tsparticles-slim"
import { loadEmittersPlugin } from "tsparticles-plugin-emitters"
import FlameParticles from "./FlameParticles"
import SmokeParticles from "./SmokeParticles"
import { useUser } from "context/UserContext"

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

export default function Candle({ index, isLit, onToggle }) {
  const { candleLifetime } = useUser()
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLit && !timeoutIdRef.current) {
      timeoutIdRef.current = setTimeout(() => onToggle(false), candleLifetime * 1000)
    }
    if (!isLit && timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
  }, [candleLifetime, isLit, onToggle])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadEmittersPlugin(engine, false)
    await loadSlim(engine, false)
  }, [])

  return (
    <button onClick={() => onToggle()} className={clsx(positionClasses[index], "absolute w-[128px]")}>
      <div className="rounded-[100%] w-[130px] h-[20px] shadow-[0px_0px_12px_20px_rgba(16,16,15,0.2)] absolute top-[40px] bg-[rgba(16,16,15,0.2)]" />
      <img src="/candle.png" className="absolute inset-0 w-full" style={{ imageRendering: "pixelated" }} />
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
    </button>
  )
}
