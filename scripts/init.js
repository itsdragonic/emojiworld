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

let emojiSize = 20;

const font = Object.freeze({
    default: "Roboto Bold",
    apple: "Apple Color Emoji",
    twemoji: "Twemoji",
    openmoji: "Open Moji Color",
    notocolor: "Noto Color Emoji",
    whatsapp: "WhatsApp Emoji"
});

let useFont = font.default;

document.getElementById("fontSelect").addEventListener("change", (e) => {
    const selectedKey = e.target.value;
    useFont = font[selectedKey] || font.default;
    setFontAndDraw(useFont);
});

async function setFontAndDraw(fontName) {
    // Tell browser to load the font if it's not yet
    await document.fonts.load(`16px "${fontName}"`);
    await document.fonts.ready;

    useFont = fontName;

    console.log("Font loaded:", useFont);

    // Now you can safely redraw canvas
    loadScreen(); // Replace with your drawing function
}


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