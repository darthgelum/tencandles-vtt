export default function Footer() {
  return (
    <div className="p-2 font-sans absolute bottom-1 text-center w-full opacity-80 text-[0.94rem] text-yellow">
      <p>
        This is a virtual tabletop for{" "}
        <a
          className="underline hover:text-white"
          href="https://cavalrygames.com/ten-candles-info"
          target="_blank"
          rel="noreferrer"
        >
          Ten Candles
        </a>
        , a tabletop roleplaying game by Stephen Dewey.
      </p>
      <p className="mt-0.5">
        Created by{" "}
        <a className="underline hover:text-white" href="https://linktr.ee/bitbirdy" target="_blank" rel="noreferrer">
          Robyn Choi
        </a>
        <a className="underline hover:text-white" href="https://github.com/darthgelum" target="_blank" rel="noreferrer">Philipp Dmitrov</a>
        .
      </p>
    </div>
  )
}
