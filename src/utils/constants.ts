import OnboardingStage from "enums/OnboardingStage"

export const HOPE_DIE_ID = 11

export const CARD_CLASSES =
  "card relative px-4 py-3 w-[350px] h-[210px] text-black shadow-[0px_0px_20px_5px_rgba(0,0,0,0.15)]"

export const ONBOARDING_STORAGE_KEY = "tenCandles_lastCompletedOnboardingStage"

export const ONBOARDING_STEPS = {
  [OnboardingStage.Table]: [
    {
      selector: ".candle-onboarding",
      content: "Click a candle to light or darken it.",
    },
    {
      selector: ".dice-pool_player",
      content:
        "This is the players’ dice pool. Click the “Roll” button to roll all the dice in this pool, which will update the dice for everyone.",
    },
    {
      selector: ".dice-pool_gm",
      content:
        "This is the GM’s dice pool that will show a “Roll” button for the GM. There may not be any dice here yet, but anyone can drag dice between dice pools.",
    },
    {
      selector: ".dice-pool_stash",
      content: "This is where you can set aside the dice that land on 1 during successful player rolls.",
    },
    {
      selector: ".die_hope",
      content: "This is the Hope die. Drag it into the player dice pool when a player wants to use their Hope die.",
    },
    {
      selector: ".this-user",
      content: "Click your name to view your cards.",
    },
  ],
  [OnboardingStage.SingleCard]: [
    { selector: ".card", content: "You can drag a card onto a player to give it to them." },
  ],
  [OnboardingStage.MultipleCards]: [
    {
      selector: ".card:not(.card_character)",
      content: "Now that you have multiple cards in your stack, you can drag cards to rearrange the order.",
    },
  ],
}
