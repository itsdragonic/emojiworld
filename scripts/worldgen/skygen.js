var sky_map = [];
var space_map = [];
var moon_map = [];

function skyGen() {
    // sky map features
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            let pushTile = "";
            // border
            if (i == 0 || i == MAP_WIDTH-1 || j == 0 || j == MAP_HEIGHT-1) {
                pushTile = "🌫️g";
            }
            // thunderstorm fields
            else if (temp_map[i][j] == "🏜️") {
                let chance = rng();
                if (chance < 0.005) {
                    pushTile = "⛈️g";
                } else if (chance < 0.01) {
                    pushTile = "⛈️b";
                } else if (chance < 0.02) {
                    pushTile = "🌩️g";
                } else if (chance < 0.03) {
                    pushTile = "🌩️b";
                } else if (chance < 0.05) {
                    pushTile = "🌧️g";
                } else if (chance < 0.1) {
                    pushTile = "☁️b";
                } else if (chance < 0.2) {
                    pushTile = "☁️";
                }
            }
            // snowy fields
            else if (temp_map[i][j] == "❄️") {
                let chance = rng();
                if (chance < 0.02) {
                    pushTile = "🌨️g";
                } else if (chance < 0.03) {
                    pushTile = "🌨️b";
                } else if (chance < 0.05) {
                    pushTile = "☁️g";
                } else if (chance < 0.1) {
                    pushTile = "☁️b";
                } else if (chance < 0.2) {
                    pushTile = "☁️";
                }
            }
            if (pushTile == "") {
                let chance = rng();
                if (chance < 0.01) {
                    pushTile = "☁️g";
                } else if (chance < 0.03) {
                    pushTile = "☁️b";
                } else if (chance < 0.06) {
                    pushTile = "☁️";
                } else {
                    pushTile = "";
                }
            }
            row.push(pushTile);
        }
        sky_map.push(row);
    }

    // space map
    runPerlinAlgorithm('space');
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // terrain map
            let tile = "";
            if (perlin_noise[i][j] > 130) {
                tile = "";
            } else if (perlin_noise[i][j] > 123) {
                tile = "🌌";
            }

            // stars
            if (tile == "") {
                let chance = rng();
                if (chance < 0.0001) {
                    tile = "🛰️";
                } else if (chance < 0.001) {
                    tile = "🌠";
                } else if (chance < 0.002) {
                    tile = "🪐";
                } else if (chance < 0.003) {
                    tile = "☄️";
                } else if (chance < 0.005) {
                    tile = "✦";
                } else if (chance < 0.008) {
                    tile = "★";
                } else if (chance < 0.01) {
                    tile = "⋆";
                }
            }

            // moon and earth
            if (i == MAP_WIDTH/2 && j == MAP_HEIGHT/2) {
                tile = "🌎g"; // add spin later
            }
            if (i == MAP_WIDTH/2 && j == 3) {
                tile = `${moonPhases[moonIndex]}b`;
            }
            row.push(tile);
        }
        space_map.push(row);
    }

    // moon map
    runPerlinAlgorithm('moon');
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // terrain map
            let tile = "";
            if (perlin_noise[i][j] > 130) {
                tile = "";
            } else if (perlin_noise[i][j] > 120) {
                tile = "🌕";
            }

            // elements
            if (tile == "") {
                let chance = rng();
                if (chance < 0.0001) {
                    tile = "📡";
                } else if (chance < 0.0003) {
                    tile = "🕳️g";
                } else if (chance < 0.0005) {
                    tile = "🕳️b";
                } else if (chance < 0.001) {
                    tile = "🕳️";
                } else if (chance < 0.05) {
                    tile = "🌕";
                }
            }

            // moon lighting
            if (tile == "🌕") {
                if (i < MAP_WIDTH/4) {
                    tile = "🌕";
                } else if (i < 2 * MAP_WIDTH/4) {
                    tile = "🌖";
                } else if (i < 3 * MAP_WIDTH/4) {
                    tile = "🌘";
                } else if (i < MAP_WIDTH) {
                    tile = "🌑";
                }
            }
            if (i == Math.round(MAP_WIDTH/2)) {
                tile = "🌗";
            }

            // World border
            if (i == 0 || i == MAP_WIDTH-1 || j == 0 || j == MAP_HEIGHT-1) {
                if (i < MAP_WIDTH/2) {
                    tile = "🌕g";
                } else {
                    tile = "🌑g";
                }
            }

            row.push(tile);
        }
        moon_map.push(row);
    }

    structureGen();
}