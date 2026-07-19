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
    rowing: "🚣",
    waterpolo: "🤽",
    meditate: "🧘",
    cartwheel: "🤸",
    flying: "🦸",
    astronaut: "🧑‍🚀"
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
    totalProtection: 0,

    characterEmote: character.default,
    walkTime: 0,
    isDrowning: false,
    defaultSpeed: 0.2,
    speed: 0.2,
    visibility: 100,
    progressBar: 0,
    progressType: "",
    isAttacking: false,
    isMining: false,
    isSprinting: false,
    isShifting: false,
    isJumping: false,
    isEating: false,
    x: MAP_WIDTH/2,
    y: MAP_HEIGHT/2,
    damageCooldown: 0,
    damageTicks: 0,
    timeSinceDeath: 0,
    fireCooldown: 0,
    burning: 0,
    hotbarSelected: 0,
    hoverText: "",
    boxClick: {},
    boxOpen: false,
    inventoryOpen: false,
    inventoryPriority: false,
    inventory: [
        ["🗡️", "⛏️", "🪓", "", "", "", "", "", "", ""],
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
        ["", "", "", "", "", "", "", "", "", ""],
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