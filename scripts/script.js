var map = overworld_map;

// Creating Player
var player = {
    health: 10,
    food: 10,
    saturation: 5,
    x: MAP_WIDTH/2,
    y: MAP_HEIGHT/2
}

emojiSize = 20;

// Custom fonts
document.fonts.load("32px Apple Color Emoji").then(() => {

    const font = Object.freeze({
        apple: "Apple Color Emoji",
        default: "Roboto Bold"
    });

    // Change emoji font
    useFont = font.apple;

    ctx.font = emojiSize + "px " + useFont + ", Arial";
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, width, height);

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

    let keysHeld = {
        w: false,
        a: false,
        s: false,
        d: false
    };

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() in keysHeld) {
            keysHeld[e.key.toLowerCase()] = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key.toLowerCase() in keysHeld) {
            keysHeld[e.key.toLowerCase()] = false;
        }
    });

    function updatePlayer() {
        const step = 0.1;

        // update player emote
        let dx = 0, dy = 0;
        if (keysHeld.w) dy -= step;
        if (keysHeld.a) {
            characterEmote = character.walkLeft;
            dx -= step;
        }
        if (keysHeld.s) {
            characterEmote = character.default;
            dy += step;
        }
        if (keysHeld.d) {
            characterEmote = character.walkRight;
            dx += step;
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const norm = Math.sqrt(0.5);
            dx *= norm;
            dy *= norm;
        }

        player.x += dx;
        player.y += dy;
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
                    ctx.fillText(characterEmote, gridX/2 * emojiSize, gridY/2 * emojiSize);
                }
            }
        }
    }

    // Game loop
    function gameLoop() {
        updatePlayer();
        update();
        requestAnimationFrame(gameLoop); 
    }

    gameLoop();
});