var seed = "a";
var rngCounter = 0;

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

//console.log(rng(seed));
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

//http://devmag.org.za/2009/04/25/perlin-noise/
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

// base terrain map
runPerlinAlgorithm('base');

var terrain_map = [];
for (var i = 0; i < MAP_WIDTH; i += pixel_size) {
    var row = [];
    for (var j = 0; j < MAP_HEIGHT; j += pixel_size) {
        if (perlin_noise[i][j] > 230) {
            row.push("🗻");
        } else if (perlin_noise[i][j] > 200) {
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

var temp_map = [];
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

var tree_map = [];
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
var biome_map = [];
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
            row.push("💧");
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
var overworld_map = [];
for (let i = 0; i < MAP_WIDTH; i += pixel_size) {
    let row = [];
    for (let j = 0; j < MAP_HEIGHT; j += pixel_size) {
        // plains
        if (biome_map[i][j] == "🌾") {
            let chance = rng();
            if (chance < 0.001) {
                row.push("🌻");
            } else if (chance < 0.004) {
                row.push("🌷");
            } else if (chance < 0.05) {
                row.push("🌾");
            } else if (chance < 0.15) {
                row.push("🌱");
            } else {
                row.push("");
            }
        }
        // woods
        else if (biome_map[i][j] == "🌱") {
            let chance = rng();
            if (chance < 0.001) {
                row.push("🪻");
            } else if (chance < 0.002) {
                row.push("🌼");
            } else if (chance < 0.03) {
                row.push("🌾");
            } else if (chance < 0.06) {
                row.push("🌱");
            } else if (chance < 0.1) {
                row.push("🌳");
            } else {
                row.push("");
            }
        }
        // forest
        else if (biome_map[i][j] == "🌳") {
            let chance = rng();
            if (chance < 0.001) {
                row.push("🌹");
            } else if (chance < 0.002) {
                row.push("🌼");
            } else if (chance < 0.03) {
                row.push("🌾");
            } else if (chance < 0.06) {
                row.push("🌱");
            } else if (chance < 0.08) {
                row.push("🍂");
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
            } else if (chance < 0.9) {
                row.push("");
            } else {
                row.push("⛱️");
            }
        }
        // palm beach
        else if (biome_map[i][j] == "🌴") {
            let chance = rng();
            if (chance < 0.005) {
                row.push("🥥");
            } else if (chance < 0.1) {
                row.push("🌴");
            } else if (chance < 0.8) {
                row.push("");
            } else {
                row.push("⛱️");
            }
        }
        // desert
        else if (biome_map[i][j] == "🏜️") {
            let chance = rng();
            if (chance < 0.001) {
                row.push("🌺");
            } else if (chance < 0.006) {
                row.push("🏜️");
            } else if (chance < 0.03) {
                row.push("🌵");
            } else {
                row.push("");
            }
        }
        // bamboo forest
        else if (biome_map[i][j] == "🎋") {
            let chance = rng();
            if (chance < 0.001) {
                row.push("🎍");
            } else if (chance < 0.02) {
                row.push("🎋");
            } else if (chance < 0.05) {
                row.push("🌵");
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
            } else if (chance < 0.03) {
                row.push("☘️");
            } else if (chance < 0.06) {
                row.push("🍂");
            } else if (chance < 0.75) {
                row.push("🌲");
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
                row.push("🏔️");
            } else {
                row.push("⛰️");
            }
        }
        // snowy peak
        else if (biome_map[i][j] == "🗻") {
            let chance = rng();
            if (chance < 0.01) {
                row.push("🌋");
            } else {
                row.push("🗻");
            }
        }
        // warm ocean
        else if (biome_map[i][j] == "💦") {
            let chance = rng();
            if (chance < 0.001) {
                row.push("🪷");
            } else if (chance < 0.1) {
                row.push("💦");
            } else {
                row.push("🌊");
            }
        }
        // ocean
        else if (biome_map[i][j] == "🌊") {
            let chance = rng();
            if (chance < 0.1) {
                row.push("");
            } else {
                row.push("🌊");
            }
        }

        else {
            row.push("❓");
        }
    }
    overworld_map.push(row);
}