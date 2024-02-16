import { rectIntersection } from "@dnd-kit/core"
import CardType from "enums/CardType"
import Die from "types/Die"
import { uniqueNamesGenerator, colors, animals, NumberDictionary } from "unique-names-generator"

export function getCardClasses(cardType: CardType) {
  let backgroundColor = "bg-yellow"
  // if (cardType === CardType.Brink) backgroundColor = "bg-red"
  // if (cardType === CardType.Moment) backgroundColor = "bg-lightblue"
  return `${backgroundColor} card relative px-4 py-3 w-[350px] h-[210px] text-black shadow-[0px_0px_20px_5px_rgba(0,0,0,0.15)]`
}

export function getInitialDice(): Die[] {
  return [...Array(10)].map((_, i) => ({ id: i + 1, num: (i % 6) + 1 }))
}

export function getUserPositionClasses(index, userCount) {
  const bottomCenter = "bottom-4 inset-x-0 mx-auto"

  const leftTop = "left-4 top-[20%]"
  const leftBottom = "left-4 bottom-[20%]"

  const topCenter = "top-4 inset-x-0 mx-auto"
  const topLeft = "top-4 left-[20%]"
  const topRight = "top-4 right-[20%]"

  const rightTop = "right-4 top-[20%]"
  const rightBottom = "right-4 bottom-[20%]"

  if (index === 0) return bottomCenter

  if (userCount <= 3) {
    return index === 1 ? leftTop : rightTop
  }

  let classes: any = { 1: leftBottom, 2: leftTop, 3: topLeft, 4: topRight, 5: rightTop, 6: rightBottom }

  if (userCount === 4) {
    classes = { 1: leftTop, 2: topCenter, 3: rightTop }
  }
  if (userCount === 5) {
    classes = { 1: leftBottom, 2: topLeft, 3: topRight, 4: rightBottom }
  }
  if (userCount === 6) {
    classes = { 1: leftBottom, 2: leftTop, 3: topLeft, 4: topRight, 5: rightTop }
  }

  return classes[index]
}

export function prioritizeUserCollisions({ droppableContainers, ...args }) {
  const rectIntersectionCollisions = rectIntersection({
    ...(args as any),
    droppableContainers: droppableContainers.filter((container) => container.data.current?.user),
  })

  if (rectIntersectionCollisions.length > 0) {
    return rectIntersectionCollisions
  }

  return rectIntersection({
    ...(args as any),
    droppableContainers: droppableContainers.filter((container) => container.data.current?.card),
  })
}

export function isVowel(c) {
  return ["a", "e", "i", "o", "u"].indexOf(c.toLowerCase()) !== -1
}

const adjectives = [
  "spooky",
  "dark",
  "scary",
  "shadow",
  "hidden",
  "creepy",
  "crawly",
  "zombie",
  "ghostly",
  "candy",
  "vampire",
  "haunted",
  "dead",
  "ghoulish",
  "chocolate",
  "skeletal",
  "screaming",
  "wailing",
  "wicked",
  "deathly",
  "evil",
  "dreadful",
  "eerie",
  "frightful",
  "ghastly",
  "grim",
  "grisly",
  "gruesome",
  "howling",
  "moonlit",
  "mysterious",
  "phantasmal",
  "spectral",
  "vanishing",
  "weird",
]

export function getRoomName() {
  const numberDictionary = NumberDictionary.generate({ min: 2050, max: 9999 })
  const config = {
    dictionaries: [colors, adjectives, animals, numberDictionary],
    separator: "-",
  }
  return uniqueNamesGenerator(config)
}
