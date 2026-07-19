
function randomCoords(int, borderDistance = 1) {
    // Clear existing coordinates
    coords = [];
    
    // Calculate safe area boundaries
    const minX = borderDistance;
    const minY = borderDistance;
    const maxX = MAP_WIDTH - borderDistance - 1;
    const maxY = MAP_HEIGHT - borderDistance - 1;

    // Generate new coordinates
    for (let i = 0; i < int; i++) {
        let x = Math.floor(minX + rng() * (maxX - minX));
        let y = Math.floor(minY + rng() * (maxY - minY));
        coords.push([x, y]);
    }
}

function randomStructure(amount = 1,quantity = 4,radius = 3,center,emoji,map) {
    randomCoords(amount);
    for (let i = 0; i < coords.length; i++) {
        let xPos = coords[i][0];
        let yPos = coords[i][1];
        if (!water.includes(map[xPos][yPos])) {
            map[xPos][yPos] = center;

            for (let n = 0; n < quantity; n++) {
                let xRand = Math.round((rng() * 2 - 1) * radius);
                let yRand = Math.round((rng() * 2 - 1) * radius);
                let newX = xPos + xRand;
                let newY = yPos + yRand;

                if (
                    map[newX] !== undefined &&
                    map[newX][newY] !== undefined
                ) {
                    map[newX][newY] = emoji[Math.floor(rng() * emoji.length)];
                }
            }
        }
    }
}

function fixedStructure(amount,structure,map,rotate = true,waterGen = false,override = false) {
    randomCoords(amount,structure.length + 1);
    if (rotate) structure = randomRotate(structure);
    
    for (let i = 0; i < coords.length; i++) {
        let xPos = coords[i][0];
        let yPos = coords[i][1];

        for (let xs = 0; xs < structure.length; xs++) {
            for (let ys = 0; ys < structure[0].length; ys++) {
                const worldX = xPos + xs;
                const worldY = yPos + ys;

                // Check map bounds
                if (map[worldX] !== undefined &&
                    map[worldX][worldY] !== undefined) {

                    if (!waterGen && water.includes(map[worldX][worldY])) {
                        return;
                    }

                    const tile = structure[xs][ys];
                    if (tile != "" || override) {
                        map[worldX][worldY] = tile;
                    }
                }
            }
        }
    }
}

function randomRotate(matrix) {
    if (!matrix.length) return matrix;

    const rotate90 = m => m[0].map((_, i) => 
        m.map(row => {
            const val = row[row.length - 1 - i];
            if (val === 'xUp') return 'xLeft';
            if (val === 'xLeft') return 'xDown';
            if (val === 'xDown') return 'xRight';
            if (val === 'xRight') return 'xUp';
            return val;
        })
    );
    
    const rotations = [
        m => m,                          // 0°
        rotate90,                        // 90°
        m => rotate90(rotate90(m)),      // 180°
        m => rotate90(rotate90(rotate90(m))) // 270°
    ];
    
    return rotations[Math.floor(rng() * 4)](matrix);
}

let availableDirections = [];
function createDungeon(building) {
    const dungeonSize = 150;
    const spawn = 35;
    const dungeon = Array(dungeonSize).fill().map(() => Array(dungeonSize).fill(""));

    const mainStructure = randomRotate(building["main"]);
    const centerX = Math.floor(dungeonSize / 2) - Math.floor(mainStructure[0].length / 2);
    const centerY = Math.floor(dungeonSize / 2) - Math.floor(mainStructure.length / 2);

    availableDirections = [];

    placeStructure(dungeon, mainStructure, centerX, centerY);

    for (let i = 0; i < spawn; i++) {
        if (availableDirections.length === 0) break;

        // Slight bias toward older/frontier connectors for better branching
        const index = Math.floor(Math.pow(rng(), 1.5) * availableDirections.length);
        const connection = availableDirections[index];

        const connectDir = connection.dir;
        const connectX = connection.x;
        const connectY = connection.y;

        const oppositeDir = getOppositeDirection(connectDir);
        const structure = findStructureWithDirection(oppositeDir, building);

        if (!structure) {
            availableDirections.splice(index, 1);
            continue;
        }

        const rotated = randomRotate(structure);
        const offset = calculateOffset(rotated, oppositeDir);
        const placeX = connectX - offset.x;
        const placeY = connectY - offset.y;

        if (canPlaceStructure(dungeon, rotated, placeX, placeY, oppositeDir)) {
            availableDirections.splice(index, 1);
            placeStructure(dungeon, rotated, placeX, placeY);
        } else {
            availableDirections.splice(index, 1);
        }
    }

    for (let y = 0; y < dungeonSize; y++) {
        for (let x = 0; x < dungeonSize; x++) {
            if (isDirectionMarker(dungeon[y][x])) {
                dungeon[y][x] = " ";
            }
        }
    }

    return dungeon;
}

// Helper functions
function placeStructure(dungeon, structure, startX, startY) {
    for (let y = 0; y < structure.length; y++) {
        for (let x = 0; x < structure[y].length; x++) {
            const dungeonX = startX + x;
            const dungeonY = startY + y;

            if (
                dungeonX >= 0 && dungeonX < dungeon.length &&
                dungeonY >= 0 && dungeonY < dungeon[0].length
            ) {
                const tile = structure[y][x];
                if (tile === "") continue;

                if (isDirectionMarker(tile)) {
                    availableDirections.push({
                        dir: tile,
                        x: dungeonX,
                        y: dungeonY
                    });
                }

                dungeon[dungeonY][dungeonX] = tile;
            }
        }
    }
}

function canPlaceStructure(dungeon, structure, startX, startY, connectionDir = null) {
    for (let y = 0; y < structure.length; y++) {
        for (let x = 0; x < structure[y].length; x++) {
            const tile = structure[y][x];
            if (tile === "") {
                continue;
            }

            const dungeonX = startX + x;
            const dungeonY = startY + y;

            if (dungeonX < 0 || dungeonX >= dungeon.length ||
                dungeonY < 0 || dungeonY >= dungeon[0].length) {
                return false;
            }

            const existingTile = dungeon[dungeonY][dungeonX];
            const isBoundaryTile = isBoundaryCell(structure, x, y, connectionDir);
            const isConnectorTile = isDirectionMarker(tile);

            if (existingTile !== "" && !isBoundaryTile && !isConnectorTile) {
                return false;
            }
        }
    }

    return true;
}

function isBoundaryCell(structure, x, y, dir) {
    if (!dir) {
        return false;
    }

    if (structure[y][x] === dir) {
        return true;
    }

    if (dir === "xLeft") {
        return x === 0;
    }
    if (dir === "xRight") {
        return x === structure[y].length - 1;
    }
    if (dir === "xUp") {
        return y === 0;
    }
    if (dir === "xDown") {
        return y === structure.length - 1;
    }

    return false;
}

function getOppositeDirection(dir) {
    const opposites = {
        "xUp": "xDown",
        "xDown": "xUp",
        "xLeft": "xRight", 
        "xRight": "xLeft"
    };
    return opposites[dir] || dir;
}

function findStructureWithDirection(dir, building) {
    let candidates = [];
    
    for (const key in building) {
        // Skip the "main" structure (already placed)
        if (key === "main") continue;
        
        const struct = building[key];
        if (hasDirection(struct, dir)) {
            candidates.push(struct);
        }
    }
    
    return candidates.length > 0 
        ? candidates[Math.floor(rng() * candidates.length)]
        : null;
}

function hasDirection(structure, dir) {
    return structure.some(row => row.includes(dir));
}

function calculateOffset(structure, dir) {
    // Find first occurrence of direction in structure
    for (let y = 0; y < structure.length; y++) {
        for (let x = 0; x < structure[y].length; x++) {
            if (structure[y][x] === dir) {
                return {x, y};
            }
        }
    }
    return {x: 0, y: 0};
}

function isDirectionMarker(tile) {
    return ["xUp", "xDown", "xLeft", "xRight"].includes(tile);
}

function structureGen() {
    // Spawn
    overworld_map[Math.round(player.x)][Math.round(player.y)] = "𓂃";

    // Structures
    fixedStructure(4,structure.merchant,overworld_map,true,true);
    fixedStructure(3,structure.village,overworld_map,true,true);
    fixedStructure(8,structure.abandoned,cave1_map,true,false,true);
    fixedStructure(3,structure.abandoned,cave2_map,true,false,true);
    //fixedStructure(1,createDungeon(),overworld_map,false,true);

    randomStructure(3,4,3,"🗿g",["🗿b","🗿"],overworld_map);
    randomStructure(25,4,5,"🛢️",["🦴","🛢️"],cave1_map);
    randomStructure(3,4,3,"🛢️",["🛢️"],cave1_map);
    randomStructure(8,4,5,"🛢️",["🦴","🛢️"],cave2_map);
    randomStructure(15,4,3,"🛢️",["🛢️"],cave2_map);

    // Dungeons
    let Catacomb = createDungeon(structure.catacomb);
    for (let i = 0; i < Catacomb.length; i ++) {
        for (let j = 0; j < Catacomb[i].length; j ++) {
            let xPos = i;
            let yPos = j;
            if ( cave1_map[xPos][yPos] !== undefined &&
                Catacomb[i][j] !== "" ) {
                    cave1_map[xPos][yPos] = Catacomb[i][j];
            }
        }
    }
    let Dungeon = createDungeon(structure.dungeon);
    for (let i = 0; i < Dungeon.length; i ++) {
        for (let j = 0; j < Dungeon[i].length; j ++) {
            let xPos = i;
            let yPos = j;
            if ( cave2_map[xPos][yPos] !== undefined &&
                Dungeon[i][j] !== "" ) {
                    if (Dungeon[i][j] == "🟪") {
                        let chance = rng();
                        if (chance < 0.05) {
                            Dungeon[i][j] = "♒";
                        }
                    }
                    cave2_map[xPos][yPos] = Dungeon[i][j];
            }
        }
    }

    // World borders
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // world border
            if (i == 0 || i == MAP_WIDTH-1 || j == 0 || j == MAP_HEIGHT-1) {
                overworld_map[i][j] = "🗻g";
                cave1_map[i][j] = "🪨g";
                cave2_map[i][j] = "🪨g";
                hell_map[i][j] = "🪨g";
                space_map[i][j] = "🌌b";
            }

            // special structures
            if (cave2_map[i][j] == "⛩️") {
                hell_map[i][j] = "⛩️";
                hell_map[i+1][j] = "";
                hell_map[i-1][j] = "";
                hell_map[i][j+1] = "";
                hell_map[i][j-1] = "";
            }
        }
    }
}