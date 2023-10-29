import Particles from "react-particles"

export default function FlameParticles({ candleIndex, particlesInit, particlesLoaded }) {
  return (
    <Particles
      className="absolute -top-[150px] -left-[136px] w-[400px] h-[300px] pointer-events-none"
      id={`flame-${candleIndex}`}
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fpsLimit: 60,
        fullScreen: false,
        // interactivity: { modes},
        particles: {
          color: {
            animation: { h: { enable: true, speed: -100 } },
          },
          life: { count: 1, duration: { value: { min: 0.5, max: 1 } } },
          move: {
            enable: true,
            speed: 2,
            angle: { value: { min: 0, max: 50 }, offset: 0 },
          },
          opacity: {
            animation: {
              enable: true,
              speed: 2,
              delay: 0.2,
              sync: true,
              startValue: "max",
              count: 1,
              mode: "decrease",
              minimumValue: 0,
            },
          },
          shape: {
            type: "square",
          },
          size: {
            value: 5,
          },
        },
        emitters: {
          direction: "top",
          rate: {
            quantity: 8,
            delay: 0.1,
          },
          size: {
            width: 20,
            height: 20,
            mode: "precise",
          },
          spawnColor: {
            value: "#ffcf4a",
          },
          position: {
            x: 50,
            y: 50,
          },
        },
        detectRetina: true,
      }}
    />
  )
}
