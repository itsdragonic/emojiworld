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
    cropData: {
        /* Format /
        crop_level_x_y: { type: "", x = 0, y = 0 }, ...
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
    window.localStorage.setItem("cave2Data", JSON.stringify(cave2_map));
    window.localStorage.setItem("hellData", JSON.stringify(hell_map));
    window.localStorage.setItem("skyData", JSON.stringify(sky_map));
    window.localStorage.setItem("spaceData", JSON.stringify(space_map));
    window.localStorage.setItem("moonData", JSON.stringify(moon_map));
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
    cave2_map = parse("cave2Data", Parse);
    hell_map = parse("hellData", Parse);
    sky_map = parse("skyData", Parse);
    space_map = parse("spaceData", Parse);
    moon_map = parse("moonData", Parse);
}