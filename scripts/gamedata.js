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
    window.localStorage.setItem("tempData", JSON.stringify(temp_map));
    window.localStorage.setItem("overworldData", JSON.stringify(overworld_map));
    window.localStorage.setItem("cave1Data", JSON.stringify(cave1_map));
    window.localStorage.setItem("cave2Data", JSON.stringify(cave2_map));
    window.localStorage.setItem("hellData", JSON.stringify(hell_map));
    window.localStorage.setItem("skyData", JSON.stringify(sky_map));
    window.localStorage.setItem("spaceData", JSON.stringify(space_map));
    window.localStorage.setItem("moonData", JSON.stringify(moon_map));
}

function loadWorld(Parse = 1) {
    // Load World
    player = parse("playerData", Parse);
    gameData = parse("gameData", Parse);

    terrain_map = parse("terrainData", Parse);
    biome_map = parse("biomeData", Parse);
    temp_map = parse("tempData", Parse);
    overworld_map = parse("overworldData", Parse);
    cave1_map = parse("cave1Data", Parse);
    cave2_map = parse("cave2Data", Parse);
    hell_map = parse("hellData", Parse);
    sky_map = parse("skyData", Parse);
    space_map = parse("spaceData", Parse);
    moon_map = parse("moonData", Parse);

    generateTerrain = false;

    startWorld();
}

function importWorld() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.emojiworld';

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            window.localStorage.clear();

            for (const [key, value] of Object.entries(data)) {
                if (typeof value === 'object') {
                    window.localStorage.setItem(key, JSON.stringify(value));
                } else {
                    // In case of non-object values
                    window.localStorage.setItem(key, value);
                }
            }

            alert('World imported successfully!');
            loadWorld();
        } catch (error) {
            alert('Import failed: ' + error.message);
        }
    };

    fileInput.click();
}