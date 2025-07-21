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
    isSprinting: false,
    x: MAP_WIDTH/2,
    y: MAP_HEIGHT/2,
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