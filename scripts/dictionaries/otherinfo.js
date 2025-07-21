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
    visibility: 100,
    isSprinting: false,
    isShifting: false,
    isJumping: false,
    x: MAP_WIDTH/2,
    y: MAP_HEIGHT/2,
    damageCooldown: 0,
    fireCooldown: 0,
    burning: 0,
    inventory: [
        ["🪓", "⛏️", "", "", "", "", "", "", "", ""],
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