var cave1_map = [];
var cave2_map = [];
var hell_map = [];

function caveGen() {
    // cave 1 map
    runPerlinAlgorithm('cave');
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            let tile = "";
            // terrain map features
            if (terrain_map[i][j] == "🌊") {
                tile = "🌊";
            } else if (terrain_map[i][j] == "🏖️") {
                tile = "🪨";
            }
            // terrain map
            else if (perlin_noise[i][j] > 175) {
                tile = "";
            } else if (perlin_noise[i][j] > 134) {
                tile = "🪨";
            } else if (perlin_noise[i][j] > 130) {
                tile = "🕸️";
            } else if (perlin_noise[i][j] > 123) {
                tile = "";
            } else if (perlin_noise[i][j] > 120) {
                tile = "🕸️";
            } else {
                tile = "🪨";
            }

            // features
            if (tile == "🌊") {
                let chance = rng();
                if (chance < 0.00001) {
                    tile = "⚓";
                } else if (chance < 0.0001) {
                    tile = "💠";
                } else if (chance < 0.0005) {
                    tile = "💎";
                } else if (chance < 0.002) {
                    tile = "🪙";
                } else if (chance < 0.004) {
                    tile = "🔩";
                } else if (chance < 0.1 && temp_map[i][j] == "🏜️") {
                    tile = "🪸";
                } else {
                    tile = "ꕀ";
                }
            }
            // cave features
            else if (tile == "🕸️") {
                let chance = rng();
                if (chance < 0.001) {
                    tile = "🍄";
                } else if (chance < 0.002) {
                    tile = "🍄‍🟫";
                } else if (chance < 0.008) {
                    tile = "🔩";
                } else if (chance < 0.02) {
                    tile = "🪜";
                } else if (chance < 0.5) {
                    tile = "🕸️";
                } else {
                    tile = "";
                }
            }
            // ores
            else if (tile == "🪨") {
                let chance = rng();
                if (chance < 0.0001) {
                    tile = "💠";
                } else if (chance < 0.0005) {
                    tile = "💎";
                } else if (chance < 0.005) {
                    tile = "🪙";
                } else if (chance < 0.02) {
                    tile = "🔩";
                } else if (chance < 0.4) {
                    tile = "🪨b";
                } else {
                    tile = "🪨";
                }
            }

            row.push(tile);
        }
        cave1_map.push(row);
    }

    // cave 2 map
    runPerlinAlgorithm('cave');
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // terrain map
            let tile = "";
            if (perlin_noise[i][j] > 175) {
                tile = "";
            } else if (perlin_noise[i][j] > 134) {
                tile = "🪨";
            } else if (perlin_noise[i][j] > 130) {
                tile = "🕸️";
            } else if (perlin_noise[i][j] > 123) {
                tile = "";
            } else if (perlin_noise[i][j] > 120) {
                tile = "🕸️";
            } else {
                tile = "🪨";
            }

            if (tile == "🕸️") {
                const chance = rng();
                tile = chance < 0.001 ? "🍄" :
                    chance < 0.002 ? "🍄‍🟫" :
                    chance < 0.008 ? "🔩" :
                    chance < 0.02 ? "🪜" :
                    chance < 0.5 ? "🕸️" : "";
            }
            else if (tile == "🪨") {
                const chance = rng();
                tile = chance < 0.001 ? "💠" :
                    chance < 0.005 ? "💎" :
                    chance < 0.006 ? "🪙" :
                    chance < 0.015 ? "🔩" :
                    chance < 0.5 ? "🪨b" : "🪨";
            }

            row.push(tile);
        }
        cave2_map.push(row);
    }

    // hell map
    runPerlinAlgorithm('hell');
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // terrain map
            let tile = "";
            if (perlin_noise[i][j] > 175) {
                tile = "";
            } else if (perlin_noise[i][j] > 134) {
                tile = "🔥";
            } else if (perlin_noise[i][j] > 130) {
                tile = "🥀";
            } else if (perlin_noise[i][j] > 125) {
                tile = "";
            } else if (perlin_noise[i][j] > 118) {
                tile = "🥀";
            } else {
                tile = "🔥";
            }

            if (tile == "🥀") {
                const chance = rng();
                tile = chance < 0.01 ? "𖤐" :
                    chance < 0.02 ? "⛧" :
                    chance < 0.03 ? "𐕣" :
                    chance < 0.04 ? "⚰️" :
                    chance < 0.25 ? "🥀" : "";
            }
            else if (tile == "🔥") {
                const chance = rng();
                tile = chance < 0.0003 ? "♨️" :
                    chance < 0.0004 ? "🩸" :
                    chance < 0.005 ? "💥" :
                    chance < 0.01 ? "🪨b" :
                    chance < 0.4 ? "🔥b" : "🔥";
            }

            row.push(tile);
        }
        hell_map.push(row);
    }

    skyGen();
}