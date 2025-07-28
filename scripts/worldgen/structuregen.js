
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
                    map[newX][newY] = emoji;
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

        // Place 3x3 merchant structure
        for (let mx = 0; mx < structure.length; mx++) {
            for (let my = 0; my < structure[0].length; my++) {
                const worldX = xPos + mx;
                const worldY = yPos + my;

                // Check map bounds
                if (map[worldX] !== undefined &&
                    map[worldX][worldY] !== undefined) {

                    if (!waterGen && water.includes(map[worldX][worldY])) {
                        return;
                    }

                    const tile = structure[mx][my];
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
            // Transform direction markers (reverse of before)
            if (val === 'xUp') return 'xLeft';
            if (val === 'xLeft') return 'xDown';
            if (val === 'xDown') return 'xRight';
            if (val === 'xRight') return 'xUp';
            return val;
        })
    );
    
    const rotations = [
        m => m,                          // 0° (original)
        rotate90,                        // 90°
        m => rotate90(rotate90(m)),      // 180°
        m => rotate90(rotate90(rotate90(m))) // 270°
    ];
    
    return rotations[Math.floor(rng() * 4)](matrix);
}

let availableDirections = {};
function createDungeon() {
    const dungeonSize = 150;
    const spawn = 50; // Number of structures to spawn
    const dungeon = Array(dungeonSize).fill().map(() => Array(dungeonSize).fill(""));
    
    // 1. Place main structure in center
    const mainStructure = randomRotate(structure.catacomb["main"]);
    const centerX = Math.floor(dungeonSize/2) - Math.floor(mainStructure[0].length/2);
    const centerY = Math.floor(dungeonSize/2) - Math.floor(mainStructure.length/2);
    //console.log(`${centerX},${centerY}`)
    
    availableDirections = {}; 
    
    // Place main structure and scan for directions
    placeStructure(dungeon, mainStructure, centerX, centerY);
    
    // 2. Spawn additional structures
    for (let i = 0; i < spawn; i++) {
        if (Object.keys(availableDirections).length === 0) break;
        
        // Pick random available direction
        const dirs = Object.keys(availableDirections);
        const connectDir = dirs[Math.floor(rng() * dirs.length)];
        const [connectX, connectY] = availableDirections[connectDir];
        
        // Find matching structure with opposite direction
        const oppositeDir = getOppositeDirection(connectDir);
        const structure = findStructureWithDirection(oppositeDir);
        
        if (structure) {
            const rotated = randomRotate(structure);
            const offset = calculateOffset(rotated, oppositeDir);
            
            // Calculate placement position
            const placeX = connectX - offset.x;
            const placeY = connectY - offset.y;
            
            // Remove used connection point
            delete availableDirections[connectDir];
            
            // Place new structure
            placeStructure(dungeon, rotated, placeX, placeY);
        }
    }
    
    // Clean up remaining direction markers
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
            
            if (dungeonX >= 0 && dungeonX < dungeon.length && 
                dungeonY >= 0 && dungeonY < dungeon[0].length) {
                
                const tile = structure[y][x];
                if (isDirectionMarker(tile)) {
                    availableDirections[tile] = [dungeonX, dungeonY];
                }
                dungeon[dungeonY][dungeonX] = tile;
            }
        }
    }
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

function findStructureWithDirection(dir) {
    let candidates = [];
    
    for (const key in structure.catacomb) {
        // Skip the "main" structure (already placed)
        if (key === "main") continue;
        
        const struct = structure.catacomb[key];
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
    //overworld_map[Map.round(player.x)][Map.round(player.y)] = "𓂃";

    // Structures
    randomStructure(3,4,3,"🗿g","🗿b",overworld_map);
    randomStructure(30,4,5,"🦴b","🦴",cave1_map);
    
    fixedStructure(4,structure.merchant,overworld_map,true,true);
    fixedStructure(3,structure.village,overworld_map,true,true);
    fixedStructure(8,structure.abandoned,cave1_map,true,false,true);
    fixedStructure(1,createDungeon(),cave1_map,false,true);

}