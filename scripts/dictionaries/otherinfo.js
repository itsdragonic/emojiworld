var character = {
    default: "🧍",
    walkLeft: "🚶",
    walkRight: "🚶‍➡️",
    sprintLeft: "🏃",
    sprintRight: "🏃‍➡️",
    wheelchairLeft: "🧑‍🦽",
    wheelchairRight: "🧑‍🦽‍➡️",
    kneelLeft: "🧎",
    kneelRight: "🧎‍➡️",
    swim: "🏊",
    meditate: "🧘",
    cartwheel: "🤸"
};

// Creating Player
var player = {
    // Current map
    level: 0,

    // Stat bars
    maxHealth: 10,
    health: 10,
    maxHunger: 10,
    hunger: 10,
    maxSaturation: 10,
    saturation: 5,
    maxThirst: 10,
    thirst: 10,
    maxBreath: 10,
    breath: 10,

    characterEmote: character.default,
    walkTime: 0,
    isDrowning: false,
    defaultSpeed: 0.2,
    speed: 0.2,
    visibility: 100,
    progressBar: 0,
    progressType: "",
    isSprinting: false,
    isShifting: false,
    isJumping: false,
    x: MAP_WIDTH/2,
    y: MAP_HEIGHT/2,
    damageCooldown: 0,
    damageTicks: 0,
    fireCooldown: 0,
    burning: 0,
    hotbarSelected: 0,
    hoverText: "",
    inventoryOpen: false,
    inventory: [
        ["🪓", "⛏️", "🥄", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""]
    ],
    inventoryValue: [
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    accessories: [
        ["🧰", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""]
    ],
    armor: ["", "👕", "👖", "👞"],
    itemDrag: {
        item: "",
        value: 0
    },
    adjacent: [],
    canCraft: [],
    possiblyCraft: [],
    defaultEmotion: "😊",
    emotion: "",
    emotionTime: 0
}

var moonPhases = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
var moonIndex = 0;

var overridables = [""," ","🌱","🌾","෴","𓂃","࿔*:","࿐","🌊","💦","༄","ꕀ"];