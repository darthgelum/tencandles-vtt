import { TbX } from "react-icons/tb"

export default function HelpModal({ onClose, onSwitchFont }: { onClose: () => void; onSwitchFont: () => void }) {
  return (
    <>
      <div className="h-screen w-screen fixed absolute top-0 left-0 bg-black opacity-70 z-50" onClick={onClose} />
      <div className="flex justify-center items-center h-screen w-screen absolute p-4">
        <div className="relative text-white z-50 max-w-[650px] max-h-full bg-grey text-sm flex flex-col px-8 py-6">
          <button onClick={onSwitchFont} className="absolute top-3 left-3 text-2xl p-2 hover:text-yellow">
            <div className="h-8 w-8">A</div>
          </button>
          <button onClick={onClose} className="absolute top-3 right-3 p-2 hover:text-yellow">
            <TbX className="h-8 w-8" />
          </button>
          <h2 className="text-center text-4xl mb-6">Useful Tips</h2>
          <div className="overflow-y-auto pr-2">
            <h3 className="text-xl pb-2">Room Setup</h3>
            <ul>
              <li>
                Whoever creates this room will be assigned as the GM. Send this page's URL to the rest of your group to
                invite them to join this room.
              </li>
              <li>If you'd like to make someone else the GM, click on their name.</li>
            </ul>

            <h3 className="text-xl pt-4 pb-2">Character Creation</h3>
            <ul>
              <li>
                The GM should make sure the lock button in the top right corner (only the GM can see this) is set to
                unlocked. If it is locked, players will not be able to add/delete/rearrange their cards.
              </li>
              <li>
                The GM can adjust how long each candle lasts by clicking the flame button in the top right corner (only
                the GM can see this).
              </li>
              <li>
                Follow the character creation rules for Ten Candles by clicking on candles to light them, adding cards,
                dragging cards to other players.
              </li>
              <li>
                To rearrange your card stack, view your cards by clicking on your name at the bottom of the screen, then
                drag each card to where you want them in the stack.
              </li>
              <li>
                When character creation is complete, the GM should click the lock button to set it to locked. This will
                prevent further changes to your card stack, but you'll still be able to edit your Character/Inventory
                card throughout the game.
              </li>
            </ul>

            <h3 className="text-xl pt-4 pb-2">Gameplay</h3>
            <ul>
              <li>You can roll dice and drag them in between Player Dice pool, GM Dice pool, and Dice Stash.</li>
              <li>
                The blue die is the Hope die. When a player wants to use their Hope die, drag this die into the Player
                Dice pool
              </li>
              <li>
                Hover your cursor over a player to view their Character/Inventory card and the top card in their stack.
                The content of their Brink card will be hidden until they reveal it.
              </li>
              <li>
                Click your name (at the bottom of the screen) to view your cards. Here, you can:
                <ul className="mt-2">
                  <li>Edit your Character/Inventory card by clicking the pencil button in its top right corner.</li>
                  <li>Burn the active (top) card in your stack</li>
                  <li>Reveal your Brink when it's active.</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
