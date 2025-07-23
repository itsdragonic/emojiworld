var character = {
    default: "🧍",
    walkLeft: "🚶",
    walkRight: "🚶‍➡️",
    sprintLeft: "🏃",
    sprintRight: "🏃‍➡️",
    kneelLeft: "🧎",
    kneelRight: "🧎‍➡️",
    swim: "🏊",
    cartwheel: "🤸"
};

// Creating Player
var player = {
    maxHealth: 10,
    health: 10,
    maxFood: 10,
    food: 10,
    maxSaturation: 10,
    saturation: 5,
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
    inventory: [
        ["🪓", "⛏️", "🔦", "🥄", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""]
    ],
    inventoryValue: [
        [1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    armor: ["🧢", "", "", "", "", ""],
    defaultEmotion: "😊",
    emotion: "",
    emotionTime: 0
}

var moonPhases = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
var moonIndex = 0;

var overridables = [""," ","🌱","🌾","෴","𓂃","࿔*:","࿐","🌊","💦","༄","ꕀ"];