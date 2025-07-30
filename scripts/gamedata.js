var gameData = {
    time: 0,
    day: 1,
    boxData: {
        /* Format /
        box_level_x_y: {
            item: [[],[]],
            value: [[],[]],
        }
        */
    },
    entities: {
        '3': [],
        '2': [],
        '1': [],
        '0': [],
        '-1': [],
        '-2': [],
        '-3': [],
    },
    bossbar: 0,
    bossbarType: ""
}

// Import .json file
function saveWorld() {
    // Save World
    window.localStorage.setItem("playerData", JSON.stringify(player));
    window.localStorage.setItem("gameData", JSON.stringify(gameData));

    window.localStorage.setItem("terrainData", JSON.stringify(terrain_map));
    window.localStorage.setItem("biomeData", JSON.stringify(biome_map));
    window.localStorage.setItem("overworldData", JSON.stringify(overworld_map));
    window.localStorage.setItem("cave1Data", JSON.stringify(cave1_map));
    window.localStorage.setItem("skyData", JSON.stringify(sky_map));
}

function parse(str, amount) {
    if (amount == 1) {
        return JSON.parse(localStorage.getItem(str));
    } else if (amount == 2) {
        return JSON.parse(JSON.parse(localStorage.getItem(str)));
    }
}

function loadWorld(Parse) {
    // Load World
    player = parse("playerData", Parse);
    gameData = parse("gameData", Parse);

    terrain_map = parse("terrainData", Parse);
    biome_map = parse("biomeData", Parse);
    overworld_map = parse("overworldData", Parse);
    cave1_map = parse("cave1Data", Parse);
    sky_map = parse("skyData", Parse);
}