const pets = ["🐶", "🐕‍🦺", "🦮", "🐩", "🐱", "🐈", "🐈‍⬛", "🐤", "🐥"];
const hostileMobs = ["🕷️", "🧟‍♀", "🧟‍♂", "🧛", "👻", "👿", "😈", "🛸"];

const overworldMobs = ["🐖","🐄","🦆","🐓","🐝","🦃","🐿️","🐇"];

var entityProperties = {
    "🐖": {
        name: "Pig",
        description: "Oink Oink",
        health: 3,
        speed: 1,
        loot: [
            { item: "🥓", min: 1, max: 2, chance: 1 },
        ]
    },
    "🐄": {
        name: "Cow",
        description: "Moo Moo",
        health: 3,
        speed: 1,
        loot: [
            { item: "🥩", min: 1, max: 2, chance: 1 },
        ]
    },
    "🦆": {
        name: "Duck",
        description: "Quack Quack",
        health: 3,
        loot: [
            { item: "🍗", min: 1, max: 1, chance: 0.8 },
            { item: "🪶", min: 1, max: 2, chance: 1 }
        ]
    },
    "🐓": {
        name: "Rooster",
        description: "Cock-a-doodle-doo!",
        health: 3,
        speed: 1,
        loot: [
            { item: "🍗", min: 1, max: 2, chance: 1 },
            { item: "🪶", min: 1, max: 2, chance: 1 }
        ]
    },
    "🦃": {
        name: "Turkey",
        health: 3,
        speed: 1,
        loot: [
            { item: "🍗", min: 1, max: 2, chance: 1 },
            { item: "🪶", min: 1, max: 2, chance: 1 }
        ]
    },
    "🐝": {
        name: "Bee",
        description: "Buzz!\n(Right-click with flower for honey)",
        health: 2,
        speed: 1,
        loot: [
            { item: "🍯", min: 1, max: 2, chance: 1 },
        ]
    },
    "🐇": {
        name: "Rabbit",
        health: 3,
        speed: 1,
        loot: [
            { item: "🍗", min: 1, max: 1, chance: 0.45 },
            { item: "🪶", min: 0, max: 1, chance: 1 }
        ]
    },
    "🐿️": {
        name: "Squirrel",
        health: 3,
        speed: 1,
        loot: [
            { item: "🍗", min: 1, max: 1, chance: 0.2 },
            { item: "🪶", min: 0, max: 1, chance: 1 }
        ]
    },
    "🐕": {
        name: "Dog",
        description: "Aww..",
        canBeWalkedOn: true,
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🐈": {
        name: "Cat",
        description: "Aww..",
        canBeWalkedOn: true,
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🐩": {
        name: "Poodle",
        description: "Aww..",
        canBeWalkedOn: true,
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🐈‍⬛": {
        name: "Black Cat",
        description: "Aww..",
        canBeWalkedOn: true,
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🧟‍♂️": {
        name: "Zombie Man",
        description: "Brains...",
        health: 3,
        speed: 1,
        loot: [
            { item: "🍖", min: 1, max: 2, chance: 1 },
            { item: "🦴", min: 1, max: 2, chance: 0.6 }
        ]
    },
    "🧟‍♀️": {
        name: "Zombie Woman",
        description: "Brains...",
        health: 3,
        speed: 1,
        loot: [
            { item: "🍖", min: 1, max: 2, chance: 1 },
            { item: "🦴", min: 1, max: 2, chance: 0.6 }
        ]
    },
    "🧛": {
        name: "Vampire",
        description: "I want to suck your blood...",
        health: 3,
        speed: 1,
        loot: [
            { item: "🩸", min: 1, max: 2, chance: 1 },
        ]
    },
    "👻": {
        name: "Ghost",
        description: "Boo!",
        health: 3,
        speed: 1,
        loot: [
            { item: "🔑", min: 1, max: 1, chance: 0.75 },
        ]
    },
    "🐍": {
        name: "Snake",
        description: "Ssss...",
        health: 5,
        speed: 1,
        loot: [
            { item: "🦎", min: 1, max: 2, chance: 1 },
        ]
    },
    "🐦": {
        name: "Bird",
        description: "Tweet Tweet",
        health: 3,
        speed: 1,
        loot: [
            { item: "🪶", min: 1, max: 2, chance: 1 },
        ]
    },
    "🕊️": {
        name: "Dove",
        description: "Coo-oo",
        health: 3,
        speed: 1,
        loot: [
            { item: "🪶", min: 1, max: 2, chance: 1 },
        ]
    },
    "🦉": {
        name: "Owl",
        description: "Hoot-hoot",
        health: 4,
        speed: 1,
        loot: [
            { item: "🪶", min: 1, max: 2, chance: 1 },
        ]
    },
    "🦔": {
        name: "Hedgehog",
        health: 4,
        speed: 1,
        loot: [
            { item: "🪶", min: 1, max: 2, chance: 1 },
        ]
    },
    "🕷️": {
        name: "Spider",
        description: "Don't get bit!",
        health: 3,
        speed: 1,
        loot: [
            { item: "🕸️", min: 1, max: 2, chance: 1 },
        ]
    },
    "🦇": {
        name: "Bat",
        description: "Don't get bit!",
        health: 2,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "👼": {
        name: "Baby Angel",
        description: "Holy little fella",
        health: 5,
        speed: 1,
        loot: [
            { item: "🌟", min: 0, max: 2, chance: 1 },
        ]
    },
    "😇": {
        name: "Angel",
        description: "Holy art thou",
        health: 5,
        speed: 1,
        loot: [
            { item: "🌟", min: 0, max: 2, chance: 1 },
        ]
    },
    "🦄": {
        name: "Unicorn",
        description: "So pretty",
        health: 7,
        speed: 1,
        loot: [
            { item: "🌈", min: 0, max: 2, chance: 1 },
        ]
    },
    "🧞": {
        name: "Genie",
        description: "I'll grant you 3 wishes...",
        health: 7,
        speed: 1,
        loot: [
            { item: "🫖", min: 1, max: 1, chance: 1 },
        ]
    },
    "🧚": {
        name: "Fairy",
        description: ":3",
        health: 6,
        speed: 1,
        loot: [
            { item: "✨", min: 0, max: 2, chance: 1 },
        ]
    },
    "👿": {
        name: "Mad Demon",
        description: ">:(",
        health: 10,
        speed: 1,
        loot: [
            { item: "🔥", min: 0, max: 2, chance: 1 },
        ]
    },
    "😈": {
        name: "Evil Demon",
        description: ">:)",
        health: 9,
        speed: 1,
        loot: [
            { item: "🔥", min: 0, max: 2, chance: 1 },
        ]
    },
}