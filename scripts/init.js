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

let HUDemojiSize = 20;
let emojiSize = 20;
let minEmojiSize = 12;
let maxEmojiSize = 48;
const zoomStep = 1;

function changeZoom(delta) {
    emojiSize = Math.max(minEmojiSize, Math.min(maxEmojiSize, emojiSize + delta * zoomStep));
    return emojiSize;
}

function parse(str, amount) {
    if (amount == 1) {
        return JSON.parse(localStorage.getItem(str));
    } else if (amount == 2) {
        return JSON.parse(JSON.parse(localStorage.getItem(str)));
    }
}

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
    [font.twemoji]: { walkRight: "🚶", sprintRight: "🏃", wheelchairRight: "🧑‍🦽" },
    [font.openmoji]: { walkRight: "🚶", sprintRight: "🏃", wheelchairRight: "🧑‍🦽" },
    [font.notocolor]: { walkRight: "🚶", sprintRight: "🏃", wheelchairRight: "🧑‍🦽" },
    [font.serenity]: { walkRight: "🚶", sprintRight: "🏃", wheelchairRight: "🧑‍🦽" }
};

let parsedFont = parse("fontData", 1);
if (parsedFont) document.getElementById("fontSelect").value = parsedFont;
let useFont = font[parsedFont] || font.default;
let isFontLoading = false;

if (useFont != font.default) setFontAndDraw(useFont);

document.getElementById("fontSelect").addEventListener("change", async (e) => {
    if (isFontLoading) return;
    isFontLoading = true;
    
    const selectedKey = e.target.value;
    window.localStorage.setItem("fontData", JSON.stringify(selectedKey));
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
    const oldWheelchair = character.wheelchairRight;
    
    character.walkRight = specialConditions.walkRight || oldWalk;
    character.sprintRight = specialConditions.sprintRight || oldSprint;
    character.wheelchairRight = specialConditions.wheelchairRight || oldWheelchair;

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