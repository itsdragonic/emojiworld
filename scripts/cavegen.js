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
            } else if (perlin_noise[i][j] > 135) {
                row.push("🪨");
            } else if (perlin_noise[i][j] > 125) {
                row.push("");
            } else if (perlin_noise[i][j] > 122) {
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
            if (cave_map[i][j] == "🌊") {
                let chance = rng();
                if (chance < 0.0001) {
                    row.push("⚓");
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
                } else if (chance < 0.01) {
                    row.push("🔩");
                } else if (chance < 0.05) {
                    row.push("🪜");
                } else if (chance < 0.25) {
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
                } else {
                    row.push("🪨")
                }
            }
        }
        cave1_map.push(row);
    }
}