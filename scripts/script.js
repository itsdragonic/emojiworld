var map = overworld_map;
var elapsedTime = 0;

// Hearts
var hearts = {
    default: "❤️",
    burning: "❤️‍🔥",
    poison: "💚"
}
let healthEmoji = hearts.default;

let emojiSize = 20;

// Custom fonts
document.fonts.load("32px Apple Color Emoji").then(() => {

    const font = Object.freeze({
        apple: "Apple Color Emoji",
        default: "Roboto Bold"
    });

    // Change emoji font
    useFont = font.default;

    ctx.font = emojiSize + "px " + useFont + ", Arial";

    ctx.fillStyle = "white";

    if (useFont == font.default) {
        waterColor = "#26c9fc";
        sandColor = "#d4bf9a";
    }

    // Movement
    var direction = Object.freeze({
        left: 0,
        right: 1,
        up: 2,
        down: 3
    });

    characterEmote = character.default;

    let pressedKeys = new Set();

    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();

        // Prevent default tab behavior
        if (key === 'tab') {
            e.preventDefault();
            player.isSprinting = !player.isSprinting;
            return;
        }

        pressedKeys.add(key);
    });

    document.addEventListener('keyup', (e) => {
        pressedKeys.delete(e.key.toLowerCase());
    });

    const defaultStep = 0.1;
    let step = 0.1;

    function updatePlayer() {
        // update player emote
        
        let dx = 0, dy = 0;
        if (pressedKeys.has('w')) dy -= step;
        if (pressedKeys.has('s')) {
            characterEmote = character.default;
            dy += step;
        }
        if (pressedKeys.has('a')) {
            characterEmote = player.isSprinting ? character.sprintLeft : character.walkLeft;
            dx -= step;
        }
        if (pressedKeys.has('d')) {
            characterEmote = player.isSprinting ? character.sprintRight : character.walkRight;
            dx += step;
        }

        if (pressedKeys.has('shift')) {
            player.isShifting = true;
        } else {
            player.isShifting = false;
        }
        if (pressedKeys.has(' ')) {
            player.isJumping = true;
            characterEmote = character.cartwheel;
        } else {
            player.isJumping = false;
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const norm = Math.sqrt(0.5);
            dx *= norm;
            dy *= norm;
        }

        surroundings(dx,dy);
    }

    // Loading Map
    function update() {
        ctx.clearRect(0, 0, width, height);
        gridX = Math.ceil(width/emojiSize) + 1;
        gridY = Math.ceil(height/emojiSize) + 1;

        let startX = Math.floor(player.x - gridX / 2);
        let startY = Math.floor(player.y - gridY / 2);

        // Subtile offset (in tiles)
        let offsetX = (player.x - startX - gridX / 2) * emojiSize;
        let offsetY = (player.y - startY - gridY / 2) * emojiSize;

        for (let i = 0; i < gridX; i++) {
            for (let j = 0; j < gridY; j++) {
                let mapX = startX + i;
                let mapY = startY + j;

                if (map[mapX] && map[mapX][mapY]) {
                    let emoji = map[mapX][mapY];

                    // Draw centered, with smooth sub-tile offset
                    let drawX = i * emojiSize - offsetX;
                    let drawY = j * emojiSize - offsetY;

                    // Special color conditions
                    if (sand.includes(emoji)) {
                        ctx.fillStyle = sandColor;
                    } else if (water.includes(emoji)) {
                        ctx.fillStyle = waterColor;
                    } else if (grass.includes(emoji)) {
                        ctx.fillStyle = grassColor;
                    } else {
                        ctx.fillStyle = "#fff";
                    }

                    // Ladders
                    if (map == overworld_map && cave1_map[mapX][mapY] == "🪜") {
                        emoji = "🕳️";
                    }

                    // Special size conditions
                    if (emoji.at(-1) == "g") {
                        ctx.font = (emojiSize * 3) + "px " + useFont + ", Arial";
                        emoji = emoji.slice(0,-1);
                    } else if (emoji.at(-1) == "b") {
                        ctx.font = (emojiSize * 1.5) + "px " + useFont + ", Arial";
                        emoji = emoji.slice(0,-1);
                    } else if (emoji.at(-1) == "s") {
                        ctx.font = (emojiSize * 0.75) + "px " + useFont + ", Arial";
                        emoji = emoji.slice(0,-1);
                    } else {
                        ctx.font = emojiSize + "px " + useFont + ", Arial";
                    }
                    ctx.fillText(emoji, drawX, drawY);
                }

                // Draw Player
                if (i == Math.round(gridX/2) && j == Math.round(gridY/2)) {
                    ctx.font = emojiSize + "px " + useFont + ", Arial";

                    // special player events
                    let xCoords = Math.round(player.x);
                    let yCoords = Math.round(player.y);
                    if (water.includes(map[xCoords][yCoords])) {
                        characterEmote = character.swim;
                        step = defaultStep * 0.4;
                    } else if (player.isSprinting) {
                        step = defaultStep * 1.5;
                    } else {
                        step = defaultStep;
                    }

                    if (cave1_map[xCoords][yCoords] == "🪜" && player.isShifting) {
                        map = cave1_map;
                    }

                    // Draw player
                    ctx.fillText(characterEmote, gridX/2 * emojiSize, gridY/2 * emojiSize);
                }
            }
        }        

        /* Hotbar */
        const itemCount = 10;
        const itemSize = emojiSize * 1.5;
        const gap = 8;
        const padding = 8;

        const totalItemWidth = itemCount * itemSize + (itemCount - 1) * gap;
        const totalWidth = totalItemWidth + padding * 2;
        const totalHeight = itemSize + padding * 2;
        const hotbarX = width / 2 - totalWidth / 2;
        const hotbarY = height - 55;

        // Background
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.roundRect(hotbarX, hotbarY, totalWidth, totalHeight, 10);
        ctx.fill();
        ctx.restore();

        // Items
        for (let i = 0; i < player.inventory[0].length; i++) {
            let item = player.inventory[0][i];
            let value = player.inventoryValues[0][i];

            let drawX = hotbarX + padding + i * (itemSize + gap) + itemSize / 2;
            let drawY = hotbarY + padding + itemSize / 2;

            ctx.font = itemSize + "px " + useFont;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(item, drawX, drawY);

            // Draw count at bottom right if it's not "1" or empty
            if (value && value !== "1") {
                ctx.fillStyle = "white";
                ctx.font = (itemSize * 0.6) + "px " + "Arial";
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";

                let countX = hotbarX + padding + i * (itemSize + gap) + itemSize;
                let countY = hotbarY + padding + itemSize + 8;

                ctx.fillText(value, countX, countY);
            }
        }

        /* Stat Bars */
        // Health Bar
        let healthSize = emojiSize;
        ctx.font = healthSize + "px " + useFont;
        for (let i = 0; i < player.maxHealth; i++) {
            let x = 15 + i * (healthSize + 4);
            let heart = i < player.health ? healthEmoji : "🖤";
            ctx.fillText(heart, x, 15);
        }

        // Hunger Bars
        for (let i = 0; i < player.maxFood; i++) {
            let x = width - 15 - (i * (healthSize + 4));
            let heart = i < player.food ? "🍗" : "⚫";
            ctx.fillText(heart, x, 15);
        }

        gameLogic();
    }

    // Game loop
    window.gameLoop = function() {
        updatePlayer();
        update();
        requestAnimationFrame(gameLoop);
    };

    loadScreen();
});