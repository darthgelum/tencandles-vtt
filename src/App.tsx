import { useCallback } from "react"
import type { Container, Engine } from "tsparticles-engine"
import Particles from "react-particles"
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim" // if y
import Candle from "./components/Candle"

function App() {
  return (
    <div className="relative h-[80%] w-[90%]">
      {[...Array(10)].map((_, i) => (
        <Candle key={i} index={i} />
      ))}
    </div>
  )
}

export default App
