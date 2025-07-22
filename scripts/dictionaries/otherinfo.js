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
        ["🪓", "⛏️", "🔦", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""]
    ],
    inventoryValues: [
        ["1", "1", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
    ],
    armor: ["🧢", "", "", "", "", ""]
}

var moonPhases = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
var moonIndex = 0;