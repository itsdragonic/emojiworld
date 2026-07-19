var objectProperties = {
    "🌊": {
        name: "Water",
        canBeWalkedOn: true,
        durability: 99,
        unbreakable: true,
        toolRequired: ""
    },
    "💦": {
        name: "Water",
        canBeWalkedOn: true,
        durability: 99,
        unbreakable: true,
        toolRequired: ""
    },
    "༄": {
        name: "Water",
        canBeWalkedOn: true,
        durability: 99,
        unbreakable: true,
        toolRequired: ""
    },
    "ꕀ": {
        name: "Water",
        canBeWalkedOn: true,
        durability: 99,
        unbreakable: true,
        toolRequired: ""
    },
    "🌳": {
        name: "Tree",
        description: "Cut down for wood",
        canBeWalkedOn: true,
        durability: 6,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 1, max: 2, chance: 1 },
            { item: "🍂", min: 1, max: 2, chance: 0.2 },
            { item: "🌰", min: 1, max: 2, chance: 0.1 },
            { item: "🍎", min: 1, max: 1, chance: 0.03 },
            { item: "🍏", min: 1, max: 1, chance: 0.03 }
        ]
    },
    "🌳s": {
        name: "Small Tree",
        description: "Cut down for wood",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 1, max: 1, chance: 1 },
            { item: "🍂", min: 1, max: 3, chance: 0.1 },
            { item: "🌰", min: 1, max: 1, chance: 0.1 },
            { item: "🍎", min: 1, max: 1, chance: 0.03 },
            { item: "🍏", min: 1, max: 1, chance: 0.03 }
        ]
    },
    "🌳b": {
        name: "Big Tree",
        description: "Cut down for wood",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 1, max: 3, chance: 1 },
            { item: "🍂", min: 1, max: 4, chance: 0.1 },
            { item: "🌰", min: 1, max: 3, chance: 0.1 },
            { item: "🍎", min: 1, max: 1, chance: 0.03 },
            { item: "🍏", min: 1, max: 1, chance: 0.03 }
        ]
    },
    "🌲": {
        name: "Pine Tree",
        description: "Cut down for wood",
        canBeWalkedOn: true,
        durability: 7,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 1, max: 1, chance: 1 }
        ]
    },
    "🌲b": {
        name: "Big Pine Tree",
        description: "Cut down for wood",
        canBeWalkedOn: true,
        durability: 9,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 1, max: 2, chance: 1 }
        ]
    },
    "🌴": {
        name: "Palm Tree",
        description: "Cut down for wood",
        canBeWalkedOn: true,
        durability: 6,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 1, max: 1, chance: 1 },
            { item: "🥥", min: 1, max: 1, chance: 0.01 },
        ]
    },
    "🌴b": {
        name: "Big Palm Tree",
        description: "Cut down for wood",
        canBeWalkedOn: true,
        durability: 7,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 1, max: 2, chance: 1 },
            { item: "🥥", min: 1, max: 1, chance: 0.02 },
        ]
    },
    "🥥": {
        name: "Coconut",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🥥"
    },
    "🍍": {
        name: "Pineapple",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🍍"
    },
    "🪵": {
        name: "Wood",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "🪓",
        loot: "🪵"
    },
    "🌵": {
        name: "Cactus",
        canBeWalkedOn: false,
        durability: 2,
        toolRequired: "🪓",
        loot: "🌵"
    },
    "🎋": {
        name: "Bamboo",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "🪓",
        loot: [
            { item: "🎍", min: 1, max: 2, chance: 1 },
        ]
    },
    "🎍": {
        name: "Bamboo",
        canBeWalkedOn: false,
        durability: 2,
        toolRequired: "🪓",
        loot: "🎍"
    },
    "🍂": {
        name: "Fallen Leaves",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🍂"
    },
    "🍂s": {
        name: "Fallen Leaves",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🍂"
    },
    "🌱": {
        name: "Seedling",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: ""
    },
    "෴": {
        name: "Grass",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: ""
    },
    "𓇼": {
        name: "Starfish",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "𓇼"
    },
    "🐚": {
        name: "Seashell",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🐚"
    },
    "🪸": {
        name: "Coral Reef",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: ""
    },
    "⚓": {
        name: "Anchor",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "⛏️",
        loot: "⚓"
    },
    "𓇠": {
        name: "Tomato Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🍅",
        durability: 2,
        toolRequired: "👊",
        loot: "𓇠"
    },
    "𓇢": {
        name: "Corn Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🌽",
        durability: 2,
        toolRequired: "👊",
        loot: "𓇢"
    },
    "𓄺": {
        name: "Potato Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🥔",
        durability: 2,
        toolRequired: "👊",
        loot: "𓄺"
    },
    "⌁": {
        name: "Lettuce Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🥬",
        durability: 2,
        toolRequired: "👊",
        loot: "⌁"
    },
    "❦": {
        name: "Grape Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🍇",
        durability: 2,
        toolRequired: "👊",
        loot: "❦"
    },
    "𓇡": {
        name: "Bean Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🫘",
        durability: 2,
        toolRequired: "👊",
        loot: "𓇡"
    },
    ".": {
        name: "Wheat Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🌾",
        durability: 2,
        toolRequired: "👊",
        loot: "."
    },
    ":･": {
        name: "Melon Seed",
        canBeWalkedOn: true,
        seed: true,
        grown: "🍈",
        durability: 2,
        toolRequired: "👊",
        loot: ":･"
    },
    "🌰": {
        name: "Acorn",
        canBeWalkedOn: true,
        seed: true,
        grown: "🌳",
        durability: 2,
        toolRequired: "👊",
        loot: "🌰"
    },
    "↟": {
        name: "Evergreen Sapling",
        canBeWalkedOn: true,
        seed: true,
        grown: "🌲",
        durability: 2,
        toolRequired: "👊",
        loot: "↟"
    },
    "☘️": {
        name: "Shamrock",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "☘️"
    },
    "🍀": {
        name: "Four-Leaf Clover",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🍀"
    },
    "🌸": {
        name: "Cherry Blossom",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🌸"
    },
    "🌷": {
        name: "Tulip",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🌷"
    },
    "🌼": {
        name: "Blossom",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🌼"
    },
    "🪻": {
        name: "Hyacinth",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🪻"
    },
    "🪷": {
        name: "Lotus",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🪷"
    },
    "🪹": {
        name: "Nest",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🪹"
    },
    "🪺": {
        name: "Bird Nest",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: [
            { item: "🪹", min: 1, max: 2, chance: 1 },
            { item: "🥚", min: 1, max: 3, chance: 1 }
        ]
    },
    "🧨": {
        name: "Dynamite",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "🧨"
    },
    "💣": {
        name: "Bomb",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "💣"
    },
    "🪦": {
        name: "Headstone",
        description: "☠ RIP ☠",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "🪦"
    },
    "🪨": {
        name: "Stone",
        canBeWalkedOn: false,
        durability: 4,
        toolRequired: "⛏️",
        loot: "🪨"
    },
    "🪨b": {
        name: "Boulder",
        canBeWalkedOn: false,
        durability: 6,
        toolRequired: "⛏️",
        loot: "🪨"
    },
    "🪨g": {
        name: "Stone Wall",
        canBeWalkedOn: false,
        durability: 6,
        toolRequired: "⛏️",
        unbreakable: true,
        loot: "🪨"
    },
    "⚰️": {
        name: "Coffin",
        description: "R.I.P.",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "🪓",
        loot: "⚰️"
    },
    "🕯️": {
        name: "Candle",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "🕯️"
    },
    "💀": {
        name: "Skull",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "💀"
    },
    "🦴b": {
        name: "Big Bone",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "🦴"
    },
    "🦴": {
        name: "Bone",
        canBeWalkedOn: false,
        durability: 3,
        toolRequired: "⛏️",
        loot: "🦴"
    },
    "🛢️": {
        name: "Oil",
        canBeWalkedOn: false,
        durability: 9,
        toolRequired: "⛏️",
        loot: "🛢️"
    },
    "🏔️b": {
        name: "Snowy Mountain",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: [
            { item: "🪨", min: 2, max: 5, chance: 1 },
            { item: "🔩", min: 1, max: 1, chance: 0.07 }
        ]
    },
    "⛰️": {
        name: "Mountain",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "⛏️",
        loot: [
            { item: "🪨", min: 1, max: 4, chance: 1 },
            { item: "🔩", min: 1, max: 1, chance: 0.06 }
        ]
    },
    "🧊": {
        name: "Ice",
        canBeWalkedOn: false,
        durability: 2,
        toolRequired: "👊",
        loot: "🧊"
    },
    "🗻b": {
        name: "Big Mountain",
        canBeWalkedOn: false,
        durability: 25,
        toolRequired: "⛏️",
        loot: [
            { item: "🪨", min: 3, max: 6, chance: 1 },
            { item: "🔩", min: 1, max: 1, chance: 0.08 }
        ]
    },
    "🗻g": {
        name: "Mountain Wall",
        canBeWalkedOn: false,
        durability: 95,
        toolRequired: "⛏️",
        unbreakable: true
    },
    "🕳️": {
        name: "Hole",
        description: "Enter the caves",
        canBeWalkedOn: true,
        durability: 15,
        toolRequired: "",
        loot: ""
    },
    "🪜": {
        name: "Ladder",
        description: "Use to climb up",
        canBeWalkedOn: true,
        durability: 4,
        toolRequired: "",
        loot: "🪜"
    },
    "🏰": {
        name: "Dungeon Castle",
        description: "Beware the dungeon",
        canBeWalkedOn: true,
        durability: 15,
        toolRequired: "",
        loot: ""
    },
    "⛩️": {
        name: "Hell Gateway",
        description: "Beware the fiery realm",
        canBeWalkedOn: true,
        unbreakable: true
    },
    "🏮": {
        name: "Red Paper Lantern",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "",
        loot: "🏮"
    },
    "🧰": {
        name: "Toolbox",
        description: "Use to craft stuff",
        canBeWalkedOn: false,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🧰"
    },
    "🍳": {
        name: "Frying Pan",
        description: "Use to cook stuff",
        canBeWalkedOn: false,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🍳"
    },
    "⚗️": {
        name: "Brewery",
        description: "Use to brew stuff",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "⚗️"
    },
    "📦": {
        name: "Box",
        description: "Stores stuff",
        canBeWalkedOn: false,
        durability: 6,
        toolRequired: "🪓",
        loot: "📦"
    },
    "🚜": {
        name: "Tractor",
        description: "Harvests crops quick",
        canBeWalkedOn: true,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🚜"
    },
    "🔐": {
        name: "Dungeon Lock",
        description: "You need a special key",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🔐"
    },
    "🔒": {
        name: "Lock",
        description: "You need a key",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🔒"
    },
    "🔓": {
        name: "Opened lock",
        canBeWalkedOn: true,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🔒"
    },
    "🌩️": {
        name: "Thunder Cloud",
        description: "Bit stormy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "⚡"
    },
    "⛈️": {
        name: "Rainy Thunder Cloud",
        description: "Bit stormy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "⚡"
    },
    "🌩️b": {
        name: "Big Thunder Cloud",
        description: "Bit stormy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "⚡"
    },
    "⛈️b": {
        name: "Big Rainy Thunder Cloud",
        description: "Bit stormy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "⚡"
    },
    "🌩️g": {
        name: "Giant Thunder Cloud",
        description: "Bit stormy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "⚡"
    },
    "⛈️g": {
        name: "Giant Rainy Thunder Cloud",
        description: "Bit stormy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "⚡"
    },
    "🌨️": {
        name: "Snow Cloud",
        description: "Bit snowy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "❄️"
    },
    "🌨️b": {
        name: "Big Snow Cloud",
        description: "Bit snowy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "❄️"
    },
    "🌨️g": {
        name: "Giant Snow Cloud",
        description: "Bit snowy outside",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "❄️"
    },
    "❄️": {
        name: "Snowflake",
        description: "Chilly",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "❄️"
    },
    "🥚": {
        name: "Egg",
        description: "Yummy",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "👊",
        loot: "🥚"
    },
    "🏆": {
        name: "Trophy",
        description: "Congrats bro!",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "🏆"
    },
    "|┆|": {
        name: "Vertical Road",
        canBeWalkedOn: true,
        durability: 98,
        toolRequired: "⛏️",
        loot: "|┆|"
    },
    "☲": {
        name: "Horizontal Road",
        canBeWalkedOn: true,
        durability: 98,
        toolRequired: "⛏️",
        loot: "☲"
    },
    "🧱": {
        name: "Bricks",
        canBeWalkedOn: false,
        durability: 9,
        toolRequired: "⛏️",
        loot: "🧱"
    },
    "🪟": {
        name: "Window",
        canBeWalkedOn: false,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🪟"
    },
    "🌫️g": {
        name: "Cloud Wall",
        canBeWalkedOn: false,
        unbreakable: true
    },
    "🌫️": {
        name: "Marble",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🌫️"
    },
    "🏳️": {
        name: "White Flag",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "",
        loot: "🏳️"
    },
    "🏴": {
        name: "Black Flag",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "",
        loot: "🏴"
    },
    "🏁": {
        name: "Checkered Flag",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "",
        loot: "🏁"
    },
    "🚩": {
        name: "Triangular Flag",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "",
        loot: "🚩"
    },
    "🟪": {
        name: "Dungeon Brick",
        canBeWalkedOn: false,
        durability: 40,
        toolRequired: "",
        loot: "🟪"
    },
    "♒": {
        name: "Chiseled Dungeon Brick",
        canBeWalkedOn: false,
        durability: 40,
        toolRequired: "",
        loot: "♒"
    },
    "🟥": {
        name: "Red Wall",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🧱"
    },
    "🟧": {
        name: "Orange Wall",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🧱"
    },
    "🟨": {
        name: "Yellow Wall",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🧱"
    },
    "🟩": {
        name: "Green Wall",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🧱"
    },
    "🟦": {
        name: "Blue Wall",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🧱"
    },
    "🟫": {
        name: "Brown Wall",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🧱"
    },
    "⬜": {
        name: "",
        canBeWalkedOn: false,
        durability: 999,
        toolRequired: "⛏️",
        loot: "⬜"
    },
    "⬛": {
        name: "",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "⬛"
    },
    "🌋g": {
        name: "Volcano",
        description: "Keep a safe distance!",
        canBeWalkedOn: false,
        durability: 35,
        toolRequired: "⛏️",
        loot: [
            { item: "🪨", min: 4, max: 7, chance: 1 },
            { item: "🔩", min: 1, max: 2, chance: 0.25 },
            { item: "🔥", min: 1, max: 2, chance: 0.3 }
        ]
    },
    "💩": {
        name: "Poop",
        description: "Mr. Poop has awaken from his slumber.",
        canBeWalkedOn: false,
        durability: 35,
        toolRequired: "⛏️",
        loot: "💩"
    },
    "🤖": {
        name: "Robot",
        description: "Beep. Boop",
        canBeWalkedOn: false,
        durability: 35,
        toolRequired: "⛏️",
        loot: "🤖"
    },
    "🐀": {
        name: "Rat King",
        description: "Squeek Squeek >:)",
        canBeWalkedOn: false,
        durability: 35,
        toolRequired: "⛏️",
        loot: "🐀"
    },
    "👹": {
        name: "Lucifer",
        description: "I am death, destroyer of worlds.",
        canBeWalkedOn: false,
        durability: 35,
        toolRequired: "⛏️",
        loot: "👹"
    },
    "🪬": {
        name: "Hamsa",
        description: "He sees all...",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "🪬"
    },
    "🤡": {
        name: "The Joker",
        description: "???",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "🤡"
    },
    "🐲": {
        name: "Dragonic",
        description: "Do not awaken from its slumber",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🐲"
    },
    "☄️": {
        name: "Comet",
        description: "Meteor Shower!",
        canBeWalkedOn: false,
        durability: 5,
        toolRequired: "⛏️",
        loot: "☄️"
    },
    "👽": {
        name: "Alien",
        description: "'We come in peace...'",
        canBeWalkedOn: false,
        durability: 7,
        toolRequired: "⛏️",
        loot: "👽"
    },
    "🛰️": {
        name: "Satellite",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "⛏️",
        loot: [
            { item: "🔩", min: 0, max: 3, chance: 1 },
            { item: "📡", min: 1, max: 1, chance: 0.25 },
        ]
    },
    "📡": {
        name: "Satellite Antenna",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "⛏️",
        loot: "📡"
    },
    "🏗️": {
        name: "Building Construction",
        canBeWalkedOn: false,
        durability: 18,
        toolRequired: "⛏️",
        loot: [
            { item: "🔩", min: 1, max: 3, chance: 1 }
        ]
    },
    "🚧": {
        name: "Construction Blocker",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏",
        loot: "🚧"
    },
    "🌕": {
        name: "Full Moon Rock",
        description: "From the brightest side of the moon",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🌕"
    },
    "🌖": {
        name: "Light Moon Rock",
        description: "From the bright side of the moon",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🌖"
    },
    "🌗": {
        name: "Half Moon Rock",
        description: "From the middle of the moon",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🌗"
    },
    "🌘": {
        name: "Dark Moon Rock",
        description: "From the dark side of the moon",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🌘"
    },
    "🌑": {
        name: "New Moon Rock",
        description: "From the darkest side of the moon",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🌑"
    },
    "🔥": {
        name: "Fire",
        description: "Warning: HOT",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "",
        loot: ""
    },
    "🔥b": {
        name: "Big Fire",
        description: "Warning: HOT",
        canBeWalkedOn: true,
        durability: 4,
        toolRequired: "",
        loot: ""
    },
    "🥀": {
        name: "Wilted Flower",
        description: '"sybau"',
        canBeWalkedOn: true,
        durability: 3,
        toolRequired: "👊",
        loot: "🥀"
    },
    "⛧": {
        name: "Pentagram",
        canBeWalkedOn: true,
        durability: 10,
        toolRequired: "",
        loot: ""
    },
    "🌾": {
        name: "Wheat",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🌾"
    },
    "🌽": {
        name: "Corn",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🌽"
    },
    "🫘": {
        name: "Beans",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🫘"
    },
    "🍅": {
        name: "Tomato",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🍅"
    },
    "🥬": {
        name: "Lettuce",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🥬"
    },
    "🥔": {
        name: "Potato",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🥔"
    },
    "🍇": {
        name: "Grapes",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🍇"
    },
    "🍈": {
        name: "Melon",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "🪓",
        loot: [
            { item: "🍉", min: 1, max: 3, chance: 1 },
        ]
    },
    "🚪": {
        name: "Door",
        description: "Enter/exit house",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "🪓",
        loot: "🚪"
    },
    "⛺": {
        name: "Tent",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "🪓",
        loot: "⛺"
    },
    "🪧": {
        name: "Sign",
        canBeWalkedOn: true,
        durability: 5,
        toolRequired: "🪓",
        loot: "🪧"
    },
    "🏠": {
        name: "House",
        description: "Nice place to live",
        canBeWalkedOn: true,
        durability: 20,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 3, max: 5, chance: 1 }
        ]
    },
    "🏡": {
        name: "House with Garden",
        description: "Even nicer place to live",
        canBeWalkedOn: true,
        durability: 20,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 3, max: 5, chance: 1 }
        ]
    },
    "🏚": {
        name: "Abandoned House",
        description: "Not the nicest place to live",
        canBeWalkedOn: true,
        durability: 20,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 3, max: 5, chance: 1 }
        ]
    },
    "🛖": {
        name: "Hut",
        description: "It ain't much but it's nice",
        canBeWalkedOn: true,
        durability: 20,
        toolRequired: "🪓",
        loot: [
            { item: "🪵", min: 2, max: 3, chance: 1 }
        ]
    },
    "🏢": {
        name: "Building",
        description: "'Big' place to live",
        canBeWalkedOn: true,
        durability: 20,
        toolRequired: "⛏",
        loot: [
            { item: "🪨", min: 3, max: 5, chance: 1 }
        ]
    },
    "💎": {
        name: "Gem",
        description: "Ooh shiny!",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "⛏️",
        loot: "💎"
    },
    "🪙": {
        name: "Coin",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🪙"
    },
    "🔩": {
        name: "Iron",
        description: "A very useful metal",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🔩"
    },
    "💠": {
        name: "Diamond",
        description: "Diamonds!",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "⛏️",
        loot: "💠"
    },
    "💰": {
        name: "Money Bag",
        canBeWalkedOn: false,
        durability: 6,
        toolRequired: "⛏️",
        loot: "🪙"
    },
    "🗿": {
        name: "Stone Statue",
        description: "🍷🗿",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🗿"
    },
    "🗿b": {
        name: "Big Stone Statue",
        description: "🍷🗿",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "⛏️",
        loot: "🗿"
    },
    "🗿g": {
        name: "Giant Stone Statue",
        description: "🍷🗿",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "⛏️",
        loot: "🗿"
    },
    "⛲": {
        name: "Fountain",
        description: "Toss a coin in for good luck!",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "⛲"
    },
    "🪑": {
        name: "Chair",
        canBeWalkedOn: true,
        durability: 10,
        toolRequired: "🪓",
        loot: "🪑"
    },
    "┬┬": {
        name: "Table",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "🪓",
        loot: "┬┬"
    },
    "┬─┬": {
        name: "Long Table",
        canBeWalkedOn: false,
        durability: 15,
        toolRequired: "🪓",
        loot: "┬─┬"
    },
    "📺": {
        name: "TV",
        canBeWalkedOn: true,
        durability: 10,
        toolRequired: "⛏️",
        loot: "📺"
    },
    "🛋️": {
        name: "Sofa",
        canBeWalkedOn: true,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🛋️"
    },
    "🛏️": {
        name: "Bed",
        canBeWalkedOn: true,
        durability: 10,
        toolRequired: "🪓",
        loot: "🛏️"
    },
    "🎯": {
        name: "Target",
        description: "Try and hit me!",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🎯"
    },
    "⚙️": {
        name: "Gear",
        description: "Use a wrench to edit",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "⚙️"
    },
    "🗑️": {
        name: "Trash Bin",
        description: "Grab item from inventory and left click it to delete item",
        canBeWalkedOn: true,
        durability: 4,
        toolRequired: "⛏️",
        loot: "🗑️"
    },
    "📻": {
        name: "Radio",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "📻"
    },
    "🏭": {
        name: "Factory",
        description: "Use hammer to change what it outputs.",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🏭"
    },
    "🏭​": {
        name: "Factory [🍗]",
        description: "Use hammer to change output. Outputs every 12 hrs.",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🏭"
    },
    "🏭​​": {
        name: "Factory [💎]",
        description: "Use hammer to change output. Outputs every 12 hrs.",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🏭"
    },
    "🏭​​​": {
        name: "Factory [🪵]",
        description: "Use hammer to change output. Outputs every 12 hrs.",
        canBeWalkedOn: false,
        durability: 10,
        toolRequired: "⛏️",
        loot: "🏭"
    },
    "🍄": {
        name: "Red Mushroom",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🍄"
    },
    "🍄‍🟫": {
        name: "Brown Mushroom",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🍄‍🟫"
    },
    "🍄s": {
        name: "Small Red Mushroom",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🍄"
    },
    "🍄‍🟫s": {
        name: "Small Brown Mushroom",
        canBeWalkedOn: true,
        durability: 1,
        toolRequired: "👊",
        loot: "🍄‍🟫"
    },
    "🕸️": {
        name: "Web",
        canBeWalkedOn: true,
        durability: 4,
        toolRequired: "🗡️",
        loot: "🕸️"
    },
    "👳‍♂️": {
        name: "Merchant",
        description: "Trade for useful items\n(Visible under crafting menu)",
        canBeWalkedOn: false,
        durability: 20,
        toolRequired: "🗡️",
        loot: ""
    },
    "🔮": {
        name: "Crystal Ball",
        description: "Use to make magical stuff",
        canBeWalkedOn: false,
        durability: 8,
        toolRequired: "⛏️",
        loot: "🔮"
    },
    "🏖️": {
        name: "Beach Sand",
        canBeWalkedOn: true,
        durability: 3,
        toolRequired: "🥄",
        loot: "⏳"
    },
    "🏜️": {
        name: "Desert Sand",
        canBeWalkedOn: true,
        durability: 3,
        toolRequired: "🥄",
        loot: "⏳"
    },
    "⏳": {
        name: "Sand",
        canBeWalkedOn: true,
        durability: 3,
        toolRequired: "🥄",
        loot: "⏳"
    },
    "𓂃": {
        name: "Sand",
        canBeWalkedOn: true,
        durability: 3,
        toolRequired: "🥄",
        loot: "⏳"
    },
    "࿔*:": {
        name: "Sand",
        canBeWalkedOn: true,
        durability: 3,
        toolRequired: "🥄",
        loot: "⏳"
    },
    "࿐": {
        name: "Sand",
        canBeWalkedOn: true,
        durability: 3,
        toolRequired: "🥄",
        loot: "⏳"
    },
    "🌿": {
        name: "Herb",
        canBeWalkedOn: true,
        durability: 2,
        toolRequired: "👊",
        loot: "🌿"
    },
    /*"": {
        name: " ",
        canBeWalkedOn: true,
        durability: 99,
        toolRequired: "",
        loot: ""
    },*/
    // Space
    "🌎g": {
        name: "Earth",
        canBeWalkedOn: true,
        unbreakable: true
    },
    "🌍g": {
        name: "Earth",
        canBeWalkedOn: true,
        unbreakable: true
    },
    "🌏g": {
        name: "Earth",
        canBeWalkedOn: true,
        unbreakable: true
    },
    "🌌b": {
        name: "Space Wall",
        canBeWalkedOn: false,
        unbreakable: true
    },

    // NPCs
    "🧙": {
        name: "Witch NPC",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🍖"
    },
    "🧙‍♂️": {
        name: "Wizard NPC",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🍖"
    },
    "🧝‍♂️": {
        name: "Archer NPC",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🍖"
    },
    "🥷": {
        name: "Ninja NPC",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🍖"
    },
    "🧑‍🌾": {
        name: "Farmer NPC",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🍖"
    },
    "🧑‍🔧": {
        name: "Mechanic NPC",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🍖"
    },
    "👷‍♂️": {
        name: "Miner NPC",
        canBeWalkedOn: false,
        durability: 99,
        toolRequired: "",
        loot: "🍖"
    },
};