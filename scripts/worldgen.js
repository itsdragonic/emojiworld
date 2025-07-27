var rngCounter = 0;

/* Seeds
 *
 * a (200x200) - first dev seed
 * 
 */

function createArray(length) {
    var a = new Array(length || 0);

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < length; i++) {
            a[i] = createArray.apply(this, args);
        }
    }

    return a;
}

var raw_noise, perlin_noise;

function rng(str) {
    // Combine the base seed and counter for deterministic sequence
    let localSeed = seed.toString() + str + rngCounter;
    let localRNG = new Math.seedrandom(localSeed);
    rngCounter++;
    return localRNG();
}

String.prototype.hashCode = function () {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function stringToNumbers(inputString) {
    if (!isNaN(inputString)) {
        return Number(inputString);
    }
    return inputString.hashCode();
}

var pixel_size = 1;

function runPerlinAlgorithm(str) {
    raw_noise = createArray(MAP_WIDTH,MAP_HEIGHT);
    perlin_noise = createArray(MAP_WIDTH,MAP_HEIGHT);

    for (var i = 0;i < MAP_WIDTH;i++) {
        for (var j = 0;j < MAP_HEIGHT;j++) {
            raw_noise[i][j] = rng(str);
        }
    }

    smooth_noise = smoothnoise(3);
    perlinnoise();
}

function noise2D(x,y) {
    var n = x + y * 255;
    return Math.abs(1.0 - (((n * (n * n * 15731 + 789221) + 1376312589) & 2147483647) / 1073741824.0));
}

function smoothnoise(octave) {
    var smooth = new Array(MAP_WIDTH);

    for (var i = 0;i < MAP_WIDTH;i++) {
        smooth[i] = new Array(MAP_HEIGHT);
        for (var j = 0;j < MAP_HEIGHT;j++) {
            smooth[i][j] = '';
        }
    }
    
    var samplePeriod = 1 << octave;
    var sampleFreq = (1.0 / samplePeriod);

    for (k = 0;k < MAP_WIDTH;k++) {
        var _i0 = Math.floor(k / samplePeriod) * samplePeriod;
        var _i1 = (_i0 + samplePeriod) % MAP_WIDTH;
        var h_blend = (k - _i0) * sampleFreq;

        for (l = 0;l < MAP_HEIGHT;l++) {
            var _j0 = Math.floor(l / samplePeriod) * samplePeriod;
            var _j1 = (_j0 + samplePeriod) % MAP_HEIGHT;
            var v_blend = (l - _j0) * sampleFreq;
            
            var top = raw_noise[_i0][_j0] * (1 - h_blend) + h_blend * raw_noise[_i1][_j0];
            var bottom = raw_noise[_i0][_j1] * (1 - h_blend) + h_blend * raw_noise[_i1][_j1];
                        
            smooth[k][l] = Math.floor((top * (1 - v_blend) + v_blend * bottom) * 255);				
        }
    }
    return smooth;
}

function perlinnoise() {
    var persistance = 0.5;
    var amplitude = 1.0;
    var totalAmp = 0.0;
    octave = 7;
    var smooth = new Array(octave);
    
    for(i=0;i<octave;i++){
        smooth[i] = createArray(MAP_WIDTH,MAP_HEIGHT);
        smooth[i] = smoothnoise(i);
    }
    
    for(o = (octave-1);o >= 0; o--){		
        amplitude = amplitude * persistance;
        totalAmp += amplitude;
        for(i = 0;i<MAP_WIDTH;i++){
            for(j = 0;j<MAP_WIDTH;j++){
                if(isNaN(perlin_noise[i][j])){
                    perlin_noise[i][j] = 0;
                }
                perlin_noise[i][j] += (smooth[o][i][j] * amplitude);
            }
        }
    }
    
    for(i = 0;i<MAP_WIDTH;i++){
        for(j = 0;j<MAP_WIDTH;j++){
            perlin_noise[i][j] = Math.floor(perlin_noise[i][j] / totalAmp);
        }
    }
}
var terrain_map = [];
var temp_map = [];
var tree_map = [];
var biome_map = [];
var overworld_map = [];

const water = ["🌊", "💦", "🧊","༄","ꕀ"];
var waterColor = "#7aaae1";
const sand = ["𓂃","࿔*:","࿐","🏖️"];
var sandColor = "#cabb9d";
const tree = ["🌳","🌳b","🌳s","🌲","🌲b","🌴","🌴b","🎋"];
const grass = ["🌱","෴"];
var grassColor = "#76a763";
var coords = [];

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

function generateWorld() {
    // base terrain map
    runPerlinAlgorithm('base');
    for (var i = 0; i < MAP_WIDTH; i += pixel_size) {
        var row = [];
        for (var j = 0; j < MAP_HEIGHT; j += pixel_size) {
            if (perlin_noise[i][j] > 230) {
                row.push("🗻");
            } else if (perlin_noise[i][j] > 215) {
                row.push("🌱");
            } else if (perlin_noise[i][j] > 205) {
                row.push("⛰️");
            } else if (perlin_noise[i][j] > 194) {
                row.push("🌱");
            } else if (perlin_noise[i][j] > 190) {
                row.push("⛰️");
            } else if (perlin_noise[i][j] > 140) {
                row.push("🌱");
            } else if (perlin_noise[i][j] > 130) {
                row.push("🏖️");
            } else {
                row.push("🌊");
            }
        }
        terrain_map.push(row);
    }

    // temperature map
    runPerlinAlgorithm('temp');

    for (var i = 0; i < MAP_WIDTH; i += pixel_size) {
        var row = [];
        for (var j = 0; j < MAP_HEIGHT; j += pixel_size) {
            if (perlin_noise[i][j] > 175) {
                row.push("❄️");
            } else if (perlin_noise[i][j] > 140) {
                row.push("🌲");
            } else if (perlin_noise[i][j] > 85) {
                row.push("🌱");
            } else {
                row.push("🏜️");
            }
        }
        temp_map.push(row);
    }

    // tree map
    runPerlinAlgorithm('tree');

    for (var i = 0; i < MAP_WIDTH; i += pixel_size) {
        var row = [];
        for (var j = 0; j < MAP_HEIGHT; j += pixel_size) {
            if (perlin_noise[i][j] > 160) {
                row.push("🌳");
            } else if (perlin_noise[i][j] > 140) {
                row.push("🌱");
            } else {
                row.push("🪨");
            }
        }
        tree_map.push(row);
    }

    // biome map
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // forest
            if (terrain_map[i][j] == "🌱" && tree_map[i][j] == "🌳" && temp_map[i][j] == "🌱") {
                row.push("🌳");
            }
            // woods
            else if (terrain_map[i][j] == "🌱" && tree_map[i][j] == "🌱" && temp_map[i][j] == "🌱") {
                row.push("🌱");
            }
            // palm beach
            else if (terrain_map[i][j] == "🏖️" && (tree_map[i][j] == "🌳" || tree_map[i][j] == "🌱") && temp_map[i][j] == "🏜️") {
                row.push("🌴");
            }
            // beach
            else if (terrain_map[i][j] == "🏖️") {
                row.push("🏖️");
            }
            // bamboo forest
            else if (terrain_map[i][j] == "🌱" && tree_map[i][j] == "🌳" && temp_map[i][j] == "🏜️") {
                row.push("🎋");
            }
            // pine forest
            else if (terrain_map[i][j] == "🌱" && tree_map[i][j] == "🌳" && temp_map[i][j] == "🌲") {
                row.push("🌲");
            }
            // cold forest
            else if (terrain_map[i][j] == "🌱" && tree_map[i][j] == "🌳" && temp_map[i][j] == "❄️") {
                row.push("❄️");
            }
            // mountain
            else if (terrain_map[i][j] == "⛰️") {
                row.push("⛰️");
            }
            // snowy peak
            else if (terrain_map[i][j] == "🗻") {
                row.push("🗻");
            }
            // cold ocean
            else if (terrain_map[i][j] == "🌊" && temp_map[i][j] == "❄️") {
                row.push("🧊");
            }
            // warm ocean
            else if (terrain_map[i][j] == "🌊" && temp_map[i][j] == "🏜️") {
                row.push("💦");
            }
            // ocean
            else if (terrain_map[i][j] == "🌊") {
                row.push("🌊");
            }
            // desert
            else if (terrain_map[i][j] == "🌱" && temp_map[i][j] == "🏜️") {
                row.push("🏜️");
            }
            // plains
            else if (terrain_map[i][j] == "🌱") {
                row.push("🌾");
            }
            
            else {
                row.push("❓");
            }
        }
        biome_map.push(row);
    }

    // overworld map
    for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
        let row = [];
        for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
            // world border
            if (i == 0 || i == MAP_WIDTH-1 || j == 0 || j == MAP_HEIGHT-1) {
                row.push("🗻g");
            }
            // plains
            else if (biome_map[i][j] == "🌾") {
                let chance = rng();
                if (chance < 0.0001) {
                    row.push("🍀");
                } else if (chance < 0.003) {
                    row.push("☘️");
                } else if (chance < 0.001) {
                    row.push("🌻");
                } else if (chance < 0.004) {
                    row.push("🌷");
                } else if (chance < 0.005) {
                    row.push("🪨");
                } else if (chance < 0.02) {
                    row.push("🌾");
                } else if (chance < 0.1) {
                    row.push("🌱");
                } else if (chance < 0.2) {
                    row.push("෴");
                } else {
                    row.push("");
                }
            }
            // woods
            else if (biome_map[i][j] == "🌱") {
                let chance = rng();
                if (chance < 0.00015) {
                    row.push("🍀");
                } else if (chance < 0.003) {
                    row.push("☘️");
                } else if (chance < 0.001) {
                    row.push("🪻");
                } else if (chance < 0.002) {
                    row.push("🌼");
                } else if (chance < 0.005) {
                    row.push("🪨");
                } else if (chance < 0.01) {
                    row.push("🌾");
                } else if (chance < 0.06) {
                    row.push("🌱");
                } else if (chance < 0.1) {
                    row.push("🌳");
                } else if (chance < 0.15) {
                    row.push("෴");
                } else {
                    row.push("");
                }
            }
            // forest
            else if (biome_map[i][j] == "🌳") {
                let chance = rng();
                if (chance < 0.00009) {
                    row.push("🍀");
                } else if (chance < 0.001) {
                    row.push("🪺");
                } else if (chance < 0.002) {
                    row.push("🪹");
                } else if (chance < 0.003) {
                    row.push("☘️");
                } else if (chance < 0.001) {
                    row.push("🌹");
                } else if (chance < 0.002) {
                    row.push("🌼");
                } else if (chance < 0.004) {
                    row.push("🪨s");
                } else if (chance < 0.005) {
                    row.push("🍄s");
                } else if (chance < 0.006) {
                    row.push("🍄");
                } else if (chance < 0.01) {
                    row.push("🍄‍🟫s");
                } else if (chance < 0.03) {
                    row.push("🌾");
                } else if (chance < 0.06) {
                    row.push("🌱");
                } else if (chance < 0.08) {
                    row.push("🍂s");
                } else if (chance < 0.1) {
                    row.push("🌳s");
                } else if (chance < 0.5) {
                    row.push("🌳b");
                } else if (chance < 0.75) {
                    row.push("🌳");
                } else {
                    row.push("");
                }
            }
            // beach
            else if (biome_map[i][j] == "🏖️") {
                let chance = rng();
                if (chance < 0.005) {
                    row.push("🐚");
                } else if (chance < 0.007) {
                    row.push("𓇼");
                } else if (chance < 0.008) {
                    row.push("🪨");
                } else if (chance < 0.02) {
                    row.push("🏖️");
                } else if (chance < 0.2) {
                    row.push("𓂃");
                } else if (chance < 0.4) {
                    row.push("࿔*:");
                } else {
                    row.push("࿐");
                }
            }
            // palm beach
            else if (biome_map[i][j] == "🌴") {
                let chance = rng();
                if (chance < 0.005) {
                    row.push("🥥");
                } else if (chance < 0.007) {
                    row.push("🪨");
                } else if (chance < 0.02) {
                    row.push("🏖️");
                } else if (chance < 0.03) {
                    row.push("🌴");
                } else if (chance < 0.1) {
                    row.push("🌴b");
                } else if (chance < 0.2) {
                    row.push("𓂃");
                } else if (chance < 0.4) {
                    row.push("࿔*:");
                } else {
                    row.push("࿐");
                }
            }
            // desert
            else if (biome_map[i][j] == "🏜️") {
                let chance = rng();
                if (chance < 0.0005) {
                    row.push("🌺");
                } else if (chance < 0.002) {
                    row.push("🌸");
                } else if (chance < 0.003) {
                    row.push("🪨");
                } else if (chance < 0.006) {
                    row.push("🏜️");
                } else if (chance < 0.03) {
                    row.push("🌵");
                } else if (chance < 0.04) {
                    row.push("࿐");
                } else {
                    row.push("𓂃");
                }
            }
            // bamboo forest
            else if (biome_map[i][j] == "🎋") {
                let chance = rng();
                if (chance < 0.004) {
                    row.push("🍈");
                } else if (chance < 0.08) {
                    row.push("🎋");
                } else {
                    row.push("");
                }
            }
            // pine forest
            else if (biome_map[i][j] == "🌲") {
                let chance = rng();
                if (chance < 0.001) {
                    row.push("🍀");
                } else if (chance < 0.002) {
                    row.push("🏕️");
                } else if (chance < 0.003) {
                    row.push("🪨");
                } else if (chance < 0.03) {
                    row.push("☘️");
                } else if (chance < 0.06) {
                    row.push("🍂s");
                } else if (chance < 0.1) {
                    row.push("🌿");
                } else if (chance < 0.5) {
                    row.push("🌲b");
                } else if (chance < 0.75) {
                    row.push("🌲");
                } else {
                    row.push("");
                }
            }
            // cold forest
            else if (biome_map[i][j] == "❄️") {
                let chance = rng();
                if (chance < 0.001) {
                    row.push("🍀");
                } else if (chance < 0.002) {
                    row.push("🍂");
                } else if (chance < 0.003) {
                    row.push("🪨");
                } else if (chance < 0.01) {
                    row.push("⛄");
                } else if (chance < 0.03) {
                    row.push("☘️");
                } else if (chance < 0.3) {
                    row.push("🌲");
                } else if (chance < 0.4) {
                    row.push("❆");
                } else if (chance < 0.6) {
                    row.push("❅𓏳");
                } else {
                    row.push("");
                }
            }
            // mountain
            else if (biome_map[i][j] == "⛰️") {
                let chance = rng();
                if (chance < 0.1) {
                    row.push("");
                } else if (chance < 0.3) {
                    row.push("🏔️b");
                } else {
                    row.push("⛰️");
                }
            }
            // snowy peak
            else if (biome_map[i][j] == "🗻") {
                let chance = rng();
                if (chance < 0.01) {
                    row.push("🌋b");
                } else {
                    row.push("🗻b");
                }
            }
            // warm ocean
            else if (biome_map[i][j] == "💦") {
                let chance = rng();
                if (chance < 0.0001) {
                    row.push("🪷");
                } else if (chance < 0.01) {
                    row.push("🌊");
                } else {
                    row.push("ꕀ");
                }
            }
            // cold ocean
            else if (biome_map[i][j] == "🧊") {
                let chance = rng();
                if (chance < 0.01) {
                    row.push("🌊");
                } else if (chance < 0.25) {
                    row.push("🧊");
                } else if (chance < 0.9) {
                    row.push("ꕀ");
                } else {
                    row.push("༄");
                }
            }
            // ocean
            else if (biome_map[i][j] == "🌊") {
                let chance = rng();
                if (chance < 0.01) {
                    row.push("🌊");
                } else if (chance < 0.9) {
                    row.push("ꕀ");
                } else {
                    row.push("༄");
                }
            }

            else {
                row.push("❓");
            }
        }
        overworld_map.push(row);
    }

    // Structures

    // Moai
    randomCoords(3);
    for (let i = 0; i < coords.length; i++) {
        let xPos = coords[i][0];
        let yPos = coords[i][1];
        if (!water.includes(overworld_map[xPos][yPos])) {
            overworld_map[xPos][yPos] = "🗿g";

            for (let n = 0; n < 4; n++) {
                let xRand = Math.round((rng() * 2 - 1) * 3);
                let yRand = Math.round((rng() * 2 - 1) * 3);
                let newX = xPos + xRand;
                let newY = yPos + yRand;

                if (
                    overworld_map[newX] !== undefined &&
                    overworld_map[newX][newY] !== undefined
                ) {
                    overworld_map[newX][newY] = "🗿b";
                }
            }
        }
    }

    // Merchant
    randomCoords(4);
    const merchant = [
        ["𓂃", "💰", "𓂃"],
        ["⛺", "👳‍♂️", "𓂃"],
        ["💰", "𓂃", "🪧"]
    ];
    for (let i = 0; i < coords.length; i++) {
        let xPos = coords[i][0];
        let yPos = coords[i][1];

        // Place 3x3 merchant structure
        for (let mx = 0; mx < 3; mx++) {
            for (let my = 0; my < 3; my++) {
                const worldX = xPos + mx;
                const worldY = yPos + my;

                // Check map bounds and water
                if (overworld_map[worldX] !== undefined &&
                    overworld_map[worldX][worldY] !== undefined) {

                    const tile = merchant[mx][my];
                    overworld_map[worldX][worldY] = tile;
                }
            }
        }
    }
    

    caveGen();
}
