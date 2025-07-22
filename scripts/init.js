var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// How big the world is
var MAP_WIDTH = 200;
var MAP_HEIGHT = 200;

var seed = "a";

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    if (!isGeneratingWorld) loadScreen();
});

// Mouse movements
let mouseX = 0;
let mouseY = 0;