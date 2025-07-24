var map = overworld_map;

var itemHeld;
let pressedKeys = new Set();

// Time
var gameData = {
    time: 0,
    day: 1,
    entities: []
}

// Hearts
var hearts = {
    default: "❤️",
    burning: "❤️‍🔥",
    poison: "💚"
}
let healthEmoji = hearts.default;

var background = {
    default: "#222",
    dark: "#222",
    light: "#eee",
    damage: "#992222"
}

// Pop ups
var hotbarText = "";
var hotbarTextTime = 0;

// Entities
gameData.entities.push(new Chicken(60, 100));

// Custom fonts
document.fonts.load("32px Apple Color Emoji").then(() => {

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
    

    function updatePlayer() {
        // update player emote
        let dx = 0, dy = 0;
        if (pressedKeys.has('w')) dy -= player.speed;
        if (pressedKeys.has('s')) {
            characterEmote = character.default;
            dy += player.speed;
        }
        if (pressedKeys.has('a')) {
            characterEmote = player.isSprinting ? character.sprintLeft : character.walkLeft;
            dx -= player.speed;
        }
        if (pressedKeys.has('d')) {
            characterEmote = player.isSprinting ? character.sprintRight : character.walkRight;
            dx += player.speed;
        }

        if (pressedKeys.has('shift')) {
            player.isShifting = true;
        } else {
            player.isShifting = false;
        }
        if (pressedKeys.has(' ')) {
            player.isJumping = true;
            characterEmote = character.cartwheel;
            player.emotion = "😜";
            player.emotionTime = 20;
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

        // fill screen
        ctx.fillStyle = background.default;
        if (player.damageTicks > 0) {
            ctx.fillStyle = background.damage;
            player.damageTicks --;
        }
        ctx.fillRect(0,0,width,height);

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
                    if (player.level == 0 && cave1_map[mapX][mapY] == "🪜") {
                        emoji = "🕳️b";
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
                    }
                    // Normal characters
                    else if (emoji.includes("*")) {
                        ctx.font = emojiSize + "px Arial";
                    } else {
                        ctx.font = emojiSize + "px " + useFont + ", Arial";
                    }

                    ctx.fillText(emoji, drawX, drawY);
                }

                // Draw entities
                for (let entity of gameData.entities) {
                    if (Math.round(entity.x) == mapX && Math.round(entity.y) == mapY) {
                        entity.draw(ctx, i * emojiSize - offsetX, j * emojiSize - offsetY);
                    }
                }
                /*// Draw entities (supporting sub-tile movement)
                for (let entity of entities) {
                    const screenX = (entity.x - player.x + gridX / 2) * emojiSize - offsetX;
                    const screenY = (entity.y - player.y + gridY / 2) * emojiSize - offsetY;
                    entity.draw(ctx, screenX, screenY);
                }*/


                // Draw Player
                if (i == Math.round(gridX/2) && j == Math.round(gridY/2)) {
                    ctx.font = emojiSize + "px " + useFont + ", Arial";

                    // special player events
                    let xCoords = Math.round(player.x);
                    let yCoords = Math.round(player.y);
                    if (water.includes(map[xCoords][yCoords])) {
                        characterEmote = character.swim;
                        player.speed = player.defaultSpeed * 0.4;
                    } else if (player.isSprinting) {
                        player.speed = player.defaultSpeed * 1.5;
                    } else {
                        player.speed = player.defaultSpeed;
                    }

                    if (cave1_map[xCoords][yCoords] == "🪜" && player.isShifting) {
                        changeLevel(-1);
                    }

                    // Draw player
                    ctx.fillText(characterEmote, gridX/2 * emojiSize, gridY/2 * emojiSize);
                }
            }
        }

        // Visibility
        if (map == overworld_map) {
            player.visibility = 100;
        } else if (map == cave1_map) {
            player.visibility = 10;
            if (player.inventory.flat().includes("🔦")) {
                player.visibility = 30;
            }
        }
        drawVisibilityOverlay();

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
            let value = player.inventoryValue[0][i];

            let drawX = hotbarX + padding + i * (itemSize + gap) + itemSize / 2;
            let drawY = hotbarY + padding + itemSize / 2;

            // Highlight selected item
            if (i === player.hotbarSelected) {
                let extra = 6; // how much bigger the box should be
                let rectX = hotbarX + padding + i * (itemSize + gap) - extra / 2;
                let rectY = hotbarY + padding - extra / 2;
                let size = itemSize + extra;
                let radius = 8;

                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "#cccccc";
                drawRoundedBox(ctx,rectX,rectY,size,size,radius);
                ctx.restore();
            }

            // Draw item emoji
            ctx.font = itemSize + "px " + useFont;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white";
            ctx.fillText(item, drawX, drawY);

            // Item count
            if (value && value > 1) {
                ctx.fillStyle = "white";
                ctx.font = (itemSize * 0.6) + "px " + "Arial";
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";

                let countX = hotbarX + padding + i * (itemSize + gap) + itemSize;
                let countY = hotbarY + padding + itemSize + 8;

                ctx.fillText(value, countX, countY);
            }
        }

        // Emotion Indicator
        let radius = 40;
        let centerX = width - radius - 5;
        let centerY = height - radius - 5;
        ctx.save();
        ctx.fillStyle = "#333";
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.font = radius*1.5 + "px " + useFont + ", Arial";

        let emotionHUD = player.defaultEmotion;
        if (player.emotion != "" && player.emotionTime > 0) {
            emotionHUD = player.emotion;
            player.emotionTime --;
        };

        ctx.fillText(emotionHUD,centerX, centerY + 3);

        // Progress bar
        if (player.progressBar > 0) {
            const barHeight = 8;
            const barRadius = 6;

            // Clamp value between 0 and 100
            const progress = Math.min(player.progressBar, 100);

            // Progress fill color
            let fillColor = "#cccccc"; // default fallback
            if (player.progressType == "mining") {
                fillColor = player.correctTool ? "#00ce4bff" : "#ba3737ff";
            } else if (player.progressType == "eating") {
                fillColor = "#4d00ddff";
            } 

            const barX = hotbarX;
            const barY = hotbarY - totalHeight + 30;

            // Background bar (full width, black)
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.roundRect(barX, barY, totalWidth, barHeight, barRadius);
            ctx.fill();
            ctx.restore();

            // Filled portion
            const filledWidth = (progress / 100) * totalWidth;

            ctx.save();
            ctx.fillStyle = fillColor;
            ctx.beginPath();
            ctx.roundRect(barX, barY, filledWidth, barHeight, barRadius);
            ctx.fill();
            ctx.restore();
        }

        // Inventory
        if (player.inventoryOpen) drawInventory();

        // Text above hotbar
        if (hotbarTextTime > 0) {
            ctx.font = emojiSize + "px Arial";

            let opacity = hotbarTextTime > 20 ? 1.0 : (hotbarTextTime * 0.05);
            opacity = Math.max(0, opacity);

            ctx.globalAlpha = opacity;
            ctx.fillText(hotbarText, width / 2, height - itemSize - 36);
            ctx.globalAlpha = 1.0;

            hotbarTextTime--;
        }

        /* Stat Bars */
        // Health Bar
        let healthSize = emojiSize;
        ctx.font = healthSize + "px " + useFont;
        for (let i = 0; i < player.maxHealth; i++) {
            let x = 15 + i * (healthSize + 4);
            let health = i < player.health ? healthEmoji : "🖤";
            ctx.fillText(health, x, 15);
        }

        // Hunger Bar
        for (let i = 0; i < player.maxHunger; i++) {
            let x = width - 15 - (i * (healthSize + 4));
            let health = i < player.hunger ? "🍗" : "⚫";
            ctx.fillText(health, x, 15);
        }

        // Thirst Bar
        for (let i = 0; i < player.maxThirst; i++) {
            let x = width - 15 - (i * (healthSize + 4));
            let health = i < player.thirst ? "💧" : "⚫";
            ctx.fillText(health, x, emojiSize + 19);
        }

        // Hover text
        if (player.hoverText != "" && player.hoverText !== "0") {
            ctx.save();
            let metrics = ctx.measureText("hello");
            let width = metrics.width;
            let padding = 4;
            let offset = 8;

            // Correct for emoji width
            if (player.hoverText.length === 2 && /^\p{Emoji}$/u.test(player.hoverText)) {
                width = emojiSize;
                padding = 8;
            }

            ctx.fillStyle = 'rgba(160, 160, 160, 0.7)';
            drawRoundedBox(ctx,mouseX + offset,mouseY,width + padding,emojiSize + padding,4);
            ctx.textAlign = 'left';
            ctx.fillStyle = 'black';
            ctx.fillText(player.hoverText,mouseX + padding/2 + offset,mouseY + emojiSize/2 + padding/2)
            ctx.restore();
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