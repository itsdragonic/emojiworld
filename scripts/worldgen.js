var seed = "a1s2";
var rngCounter = 0;

var raw_noise = createArray(MAP_WIDTH,MAP_HEIGHT);
var perlin_noise = createArray(MAP_WIDTH,MAP_HEIGHT);

function rng() {
    // Combine the base seed and counter for deterministic sequence
    let localSeed = seed.toString() + rngCounter;
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

for (var i = 0;i < MAP_WIDTH;i++) {
    for (var j = 0;j < MAP_HEIGHT;j++) {
        raw_noise[i][j] = rng();
    }
}

var pixel_size = 1;
smooth_noise = smoothnoise(3);
perlinnoise();

// Replace canvas drawing with emoji matrix output
var terrain_map = [];
for (var i = 0; i < MAP_WIDTH; i += pixel_size) {
    var row = [];
    for (var j = 0; j < MAP_HEIGHT; j += pixel_size) {
        //mountain peaks
        if (perlin_noise[i][j] > 230) {
            row.push("🏔️");
        } else if (perlin_noise[i][j] > 200) {
            row.push("⛰️");
        //land
        } else if (perlin_noise[i][j] > 140) {
            row.push("🌱");
        //beach
        } else if (perlin_noise[i][j] > 130) {
            row.push("🏖️");
        //ocean
        } else {
            row.push("🌊");
        }
    }
    terrain_map.push(row);
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