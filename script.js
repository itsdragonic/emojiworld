var d = document.getElementById("terrain");
var c = d.getContext('2d');
var w = window.innerWidth;
var h = window.innerHeight;
d.width = w;
d.height = h;

var terrain_ctx = document.getElementById('terrain').getContext('2d');
var MAP_WIDTH = 500;
var MAP_HEIGHT = 500;

var raw_noise = createArray(MAP_WIDTH,MAP_HEIGHT);
var perlin_noise = createArray(MAP_WIDTH,MAP_HEIGHT);


var seed = 31;

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
function rng(val) {
    let seededRNG = Math.seedrandom(val);
    let result = Math.random();
    seed = seed + result;
    return result;
}
console.log(rng(seed));

for (var i = 0;i < MAP_WIDTH;i++) {
    for (var j = 0;j < MAP_HEIGHT;j++) {
        raw_noise[i][j] = rng(seed);
    }
}

var pixel_size = 1;
smooth_noise = smoothnoise(3);
perlinnoise();

for (var i = 0;i < MAP_WIDTH;i+=pixel_size){
    for (var j = 0; j < MAP_HEIGHT; j+=pixel_size){
    
        raw_val = Math.floor(raw_noise[i][j] * 255);

        //mountain peaks
        if(perlin_noise[i][j] > 230) {
            terrain_ctx.fillStyle = "rgb(255,255,255)";
        } else if (perlin_noise[i][j] > 200) {
            terrain_ctx.fillStyle = "rgb(120,120,120)";
        //land
        } else if (perlin_noise[i][j] > 140) {
            terrain_ctx.fillStyle = "rgb(40,80,10)";
        //beach
        } else if (perlin_noise[i][j] > 130) {
            terrain_ctx.fillStyle = "rgb(250,220,190)";
        //ocean
        } else {
            terrain_ctx.fillStyle = "rgb(50,70,180)";	
        }
        
        terrain_ctx.fillRect(i,j,pixel_size,pixel_size); 
        
    }
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