var cave_map = [];
var cave1_map = [];

function caveGen() {
    // base cave map
    runPerlinAlgorithm('cave');
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // terrain map features
            if (terrain_map[i][j] == "🌊") {
                row.push("🌊");
            } else if (terrain_map[i][j] == "🏖️") {
                row.push("🪨");
            }
            // terrain map
            else if (perlin_noise[i][j] > 175) {
                row.push("");
            } else if (perlin_noise[i][j] > 134) {
                row.push("🪨");
            } else if (perlin_noise[i][j] > 130) {
                row.push("🕸️");
            } else if (perlin_noise[i][j] > 123) {
                row.push("");
            } else if (perlin_noise[i][j] > 120) {
                row.push("🕸️");
            } else {
                row.push("🪨");
            }
        }
        cave_map.push(row);
    }

    // cave map
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // border
            if (i == 0 || i == MAP_WIDTH-1 || j == 0 || j == MAP_HEIGHT-1) {
                row.push("🪨g");
            }
            // ocean floor features
            else if (cave_map[i][j] == "🌊") {
                let chance = rng();
                if (chance < 0.00001) {
                    row.push("⚓");
                } if (chance < 0.0001) {
                    row.push("💠");
                } else if (chance < 0.0005) {
                    row.push("💎");
                } else if (chance < 0.002) {
                    row.push("🪙");
                } else if (chance < 0.004) {
                    row.push("🔩");
                } else if (chance < 0.1 && temp_map[i][j] == "🏜️") {
                    row.push("🪸");
                } else {
                    row.push("ꕀ")
                }
            }
            // cave features
            else if (cave_map[i][j] == "🕸️") {
                let chance = rng();
                if (chance < 0.001) {
                    row.push("🍄");
                } else if (chance < 0.002) {
                    row.push("🍄‍🟫");
                } else if (chance < 0.008) {
                    row.push("🔩");
                } else if (chance < 0.02) {
                    row.push("🪜");
                } else if (chance < 0.5) {
                    row.push("🕸️");
                } else {
                    row.push("")
                }
            }
            // ores
            else if (cave_map[i][j] == "🪨") {
                let chance = rng();
                if (chance < 0.0001) {
                    row.push("💠");
                } else if (chance < 0.0005) {
                    row.push("💎");
                } else if (chance < 0.005) {
                    row.push("🪙");
                } else if (chance < 0.02) {
                    row.push("🔩");
                } else if (chance < 0.4) {
                    row.push("🪨b");
                } else {
                    row.push("🪨")
                }
            }
            else if (cave_map[i][j] == "") {
                row.push("");
            }
        }
        cave1_map.push(row);
    }

    skyGen();
}