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

    // Movement
    var direction = Object.freeze({
        left: 0,
        right: 1,
        up: 2,
        down: 3
    });

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
        updatePlayer();
    });

    document.addEventListener('keyup', (e) => {
        if (e.key.toLowerCase() in keysHeld) {
            keysHeld[e.key.toLowerCase()] = false;
        }
        updatePlayer();
    });

    function updatePlayer() {
        const step = 0.2;

        let dx = 0, dy = 0;
        if (keysHeld.w) dy -= step;
        if (keysHeld.s) dy += step;
        if (keysHeld.a) dx -= step;
        if (keysHeld.d) dx += step;

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const norm = Math.sqrt(0.5);
            dx *= norm;
            dy *= norm;
        }

        player.x += dx;
        player.y += dy;
        update();
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
                    ctx.fillText(emoji, drawX, drawY);
                }
            }
        }

        ctx.fillText(baseEmote[0], gridX/2 * emojiSize, gridY/2 * emojiSize);
    }
    update();

});