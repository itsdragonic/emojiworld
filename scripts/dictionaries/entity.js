const overworldMobs = ["🐖", "🐄", "🦆", "🐓", "🐝", "🦃", "🐿️", "🐇","🦔"];
const beachMobs = ["🦀","🦞"];
const coralMobs = ["🐟", "🐠", "🐡", "🦐"];
const oceanMobs = ["🐟", "🦑", "🐙", "🐋", "🦈","🧜‍♂️","🧜‍♀️"];
const skyMobs = ["🐦","🕊️","🦅","😇","👼","🦄","🧞","🧚"];
const spaceMobs = ["👾","🛸"];
const hellMobs = ["🐦‍🔥","😈","👿"];

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
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🐈": {
        name: "Cat",
        description: "Aww..",
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🐩": {
        name: "Poodle",
        description: "Aww..",
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🐈‍⬛": {
        name: "Black Cat",
        description: "Aww..",
        health: 7,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 1, chance: 1 },
        ]
    },
    "🦔": {
        name: "Hedgehog",
        health: 4,
        speed: 1,
        loot: [
            { item: "", min: 1, max: 2, chance: 1 },
        ]
    },

    // Beach
    "🦀": {
        name: "Crab",
        beach: true,
        health: 7,
        speed: 1,
        loot: [
            { item: "🦀", min: 1, max: 1, chance: 1 },
        ]
    },
    "🦞": {
        name: "Lobster",
        beach: true,
        health: 6,
        speed: 1,
        loot: [
            { item: "🦞", min: 1, max: 1, chance: 1 },
        ]
    },

    // Aquatic
    "🐟": {
        name: "Fish",
        aquatic: true,
        health: 4,
        speed: 1,
        loot: [
            { item: "🐟", min: 1, max: 1, chance: 1 }
        ]
    },
    "🐠": {
        name: "Tropical Fish",
        aquatic: true,
        health: 4,
        speed: 1,
        loot: [
            { item: "🐠", min: 1, max: 1, chance: 1 }
        ]
    },
    "🐡": {
        name: "Pufferfish",
        aquatic: true,
        health: 5,
        speed: 1,
        loot: [
            { item: "🐡", min: 1, max: 1, chance: 1 }
        ]
    },
    "🦐": {
        name: "Shrimp",
        aquatic: true,
        health: 3,
        speed: 1,
        loot: [
            { item: "🦐", min: 1, max: 1, chance: 1 }
        ]
    },
    "🦑": {
        name: "Squid",
        aquatic: true,
        health: 10,
        speed: 1,
        loot: [
            { item: "🦑", min: 1, max: 1, chance: 1 }
        ]
    },
    "🐙": {
        name: "Octopus",
        aquatic: true,
        health: 8,
        speed: 1,
        loot: [
            { item: "🐙", min: 1, max: 1, chance: 1 }
        ]
    },
    "🐋": {
        name: "Whale",
        aquatic: true,
        health: 20,
        speed: 1,
        loot: [
            { item: "🐋", min: 1, max: 1, chance: 1 }
        ]
    },
    "🦈": {
        name: "Shark",
        aquatic: true,
        hostile: true,
        damage: 2,
        health: 15,
        speed: 1,
        loot: [
            { item: "🦈", min: 1, max: 1, chance: 1 }
        ]
    },
    "🧜‍♂️": {
        name: "Merman",
        aquatic: true,
        health: 15,
        speed: 1,
        loot: [
            { item: "🔱", min: 1, max: 1, chance: 1 },
            { item: "🍖", min: 0, max: 2, chance: 1 }
        ]
    },
    "🧜‍♀️": {
        name: "Mermaid",
        aquatic: true,
        health: 15,
        speed: 1,
        loot: [
            { item: "🍖", min: 0, max: 2, chance: 1 }
        ]
    },

    // Cave mobs
    "🕷️": {
        name: "Spider",
        description: "Don't get bit!",
        hostile: true,
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

    // Hostile
    "🧟‍♂️": {
        name: "Zombie Man",
        description: "Brains...",
        hostile: true,
        damage: 2,
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
        hostile: true,
        damage: 2,
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
        hostile: true,
        health: 3,
        speed: 1,
        loot: [
            { item: "🩸", min: 1, max: 2, chance: 1 },
        ]
    },
    "👻": {
        name: "Ghost",
        description: "Boo!",
        hostile: true,
        health: 3,
        speed: 1,
        loot: [
            { item: "🔑", min: 1, max: 1, chance: 0.75 },
        ]
    },
    "🐍": {
        name: "Snake",
        description: "Ssss...",
        hostile: true,
        health: 5,
        speed: 1,
        loot: [
            { item: "🦎", min: 1, max: 2, chance: 1 },
        ]
    },

    // Sky mobs
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
    "🦅": {
        name: "Eagle",
        health: 10,
        speed: 3,
        loot: [
            { item: "🪶", min: 1, max: 2, chance: 1 },
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

    // Hell mobs
    "🐦‍🔥": {
        name: "Phoenix",
        description: "Rises from the ashes",
        firey: true,
        health: 3,
        speed: 1,
        loot: [
            { item: "🪶", min: 1, max: 2, chance: 1 },
            { item: "🔥", min: 0, max: 2, chance: 1 },
            { item: "🌟", min: 1, max: 1, chance: 0.4 },
        ]
    },
    "👿": {
        name: "Mad Demon",
        description: ">:(",
        firey: true,
        hostile: true,
        damage: 8,
        health: 10,
        speed: 1,
        loot: [
            { item: "🔥", min: 0, max: 2, chance: 1 },
        ]
    },
    "😈": {
        name: "Evil Demon",
        description: ">:)",
        firey: true,
        hostile: true,
        damage: 8,
        health: 9,
        speed: 1,
        loot: [
            { item: "🔥", min: 0, max: 2, chance: 1 },
        ]
    },

    // Space
    "👾": {
        name: "Space Monster",
        hostile: true,
        damage: 5,
        health: 5,
        speed: 2,
        loot: [
            { item: "🌌", min: 0, max: 1, chance: 1 },
        ]
    },
    "🛸": {
        name: "UFO",
        hostile: false,
        health: 20,
        speed: 3,
        loot: [
            { item: "👽", min: 1, max: 1, chance: 0.4 },
        ]
    },

    // Bosses
    "💩": {
        name: "Mr. Poop",
        hostile: true,
        damage: 2,
        health: 80,
        speed: 2,
        loot: [
            { item: "🎖️", min: 1, max: 1, chance: 1 },
            { item: "🪖", min: 1, max: 1, chance: 1 },
        ]
    },
    "🤖": {
        name: "Roboto",
        hostile: true,
        damage: 5,
        health: 150,
        speed: 2,
        loot: [
            { item: "🦾", min: 1, max: 1, chance: 1 },
            { item: "🦿", min: 1, max: 1, chance: 1 },
            { item: "🔩", min: 1, max: 5, chance: 1 },
            { item: "⚙️", min: 1, max: 5, chance: 1 },
        ]
    },
    "🪬": {
        name: "Hamsa",
        hostile: true,
        damage: 10,
        health: 180,
        speed: 2,
        loot: [
            { item: "🏆", min: 1, max: 1, chance: 1 },
            { item: "👁️", min: 1, max: 1, chance: 1 },
            { item: "🫀", min: 1, max: 1, chance: 1 },
            { item: "🫁", min: 1, max: 1, chance: 1 },
        ]
    },
    "🤡": {
        name: "The Joker",
        hostile: true,
        damage: 5,
        health: 180,
        speed: 2,
        loot: [
            { item: "🏆", min: 1, max: 1, chance: 1 },
            { item: "🎭", min: 1, max: 1, chance: 1 },
            { item: "🃏", min: 1, max: 1, chance: 1 },
        ]
    },
    "👽": {
        name: "Alien",
        hostile: true,
        damage: 15,
        health: 200,
        speed: 2,
        loot: [
            { item: "🏆", min: 1, max: 1, chance: 1 },
            { item: "💫", min: 0, max: 1, chance: 1 },
            { item: "🌐", min: 1, max: 1, chance: 1 },
        ]
    },
    "👹": {
        name: "Lucifer",
        hostile: true,
        damage: 20,
        health: 200,
        speed: 2,
        loot: [
            { item: "🏆", min: 1, max: 1, chance: 1 },
            { item: "🥇", min: 1, max: 1, chance: 1 },
            { item: "❤‍🔥", min: 1, max: 1, chance: 1 },
        ]
    },
}