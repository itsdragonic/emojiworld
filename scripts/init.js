var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;

//console.log(`${width} + ${height}`);
//1536 + 691

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
    whatsapp: "WhatsApp Emoji",
    serenity: "SerenityOS",
    joypixels: "JoyPixels"
});

const specialFontConditions = {
    [font.twemoji]: { walkRight: "🚶", sprintRight: "🏃" },
    [font.openmoji]: { walkRight: "🚶", sprintRight: "🏃" },
    [font.notocolor]: { walkRight: "🚶", sprintRight: "🏃" },
    [font.serenity]: { walkRight: "🚶", sprintRight: "🏃" }
};

let useFont = font.default;
let isFontLoading = false;

document.getElementById("fontSelect").addEventListener("change", async (e) => {
    if (isFontLoading) return;
    isFontLoading = true;
    
    const selectedKey = e.target.value;
    useFont = font[selectedKey] || font.default;

    try {
        await setFontAndDraw(useFont);
    } finally {
        isFontLoading = false;
    }
});

async function setFontAndDraw(fontName) {
    // Load font with fallback
    const fontString = `16px "${fontName}"`;
    try {
        await document.fonts.load(fontString);
        if (!document.fonts.check(fontString)) {
            console.warn(`Font ${fontName} not loaded, using fallback`);
        }
    } catch (e) {
        console.error("Font loading error:", e);
    }

    // Apply special conditions before redraw
    const specialConditions = specialFontConditions[fontName] || {};
    const oldWalk = character.walkRight;
    const oldSprint = character.sprintRight;
    
    character.walkRight = specialConditions.walkRight || oldWalk;
    character.sprintRight = specialConditions.sprintRight || oldSprint;

    // Force redraw
    loadScreen();
    
    // Wait for fonts to be fully ready
    await document.fonts.ready;
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