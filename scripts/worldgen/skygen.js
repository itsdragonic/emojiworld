var sky_map = [];

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

    structureGen();
}