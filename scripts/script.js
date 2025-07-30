var map = overworld_map;

var itemHeld;
let pressedKeys = new Set();
let xHover,yHover,gridX,gridY,x,y;

// Game loop
let gameSpeed = 150; // times per second
let lastPlayerUpdate = Date.now();
let playerInterval = 1000 / gameSpeed;

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
var entityId = 0;
gameData.entities['0'].push(new Mob("🐓", 60, 100, entityId));
entityId++;

// Custom fonts
document.fonts.load("32px Apple Color Emoji").then(() => {

    ctx.font = emojiSize + "px " + useFont + ", Arial";

    ctx.fillStyle = "white";

    if (useFont == font.default) {
        waterColor = "#26c9fc";
        sandColor = "#d4bf9a";
    }

    player.characterEmote = character.default;
    

    function updatePlayer() {
        let wheelchair = player.accessories.flat().includes("🦽");

        // WASD movement
        let dx = 0, dy = 0;
        if (!player.isMining) {
            if (pressedKeys.has('w')) dy -= player.speed;
            if (pressedKeys.has('s')) {
                if (!wheelchair) player.characterEmote = character.default;
                dy += player.speed;
            }
            if (pressedKeys.has('a')) {
                player.characterEmote = player.isSprinting ? character.sprintLeft : character.walkLeft;
                if (wheelchair) player.characterEmote = character.wheelchairLeft;
                dx -= player.speed;
            }
            if (pressedKeys.has('d')) {
                player.characterEmote = player.isSprinting ? character.sprintRight : character.walkRight;
                if (wheelchair) player.characterEmote = character.wheelchairRight;
                dx += player.speed;
            }
        }

        // Shift
        if (pressedKeys.has('shift')) {
            player.isShifting = true;
        } else {
            player.isShifting = false;
        }

        // Space
        if (pressedKeys.has(' ')) {
            player.isJumping = true;
            player.characterEmote = character.cartwheel;
            player.emotion = "😜";
            player.emotionTime = 20;
        } else {
            player.isJumping = false;
        }

        // Speed conditions
        if (water.includes(player.adjacent[4])) {
            if (player.accessories.flat().includes("🛶")) {
                player.characterEmote = character.rowing;
                player.speed = player.defaultSpeed;
            } else {
                player.characterEmote = character.swim;
                player.speed = player.defaultSpeed * 0.5;
                if (player.isJumping) player.characterEmote = character.waterpolo;
            }
        } else if (tree.includes(player.adjacent[4]) && !player.armor.includes("🥾")) {
            player.speed = player.defaultSpeed * 0.5;
        } else if (player.adjacent[4] == "🕸️") {
            player.speed = player.defaultSpeed * 0.2;
        } else if (player.isEating) {
            player.speed = player.defaultSpeed * 0.2;
        } else {
            player.speed = player.defaultSpeed;
        }

        // Other conditions
        if (player.level == 1) {
            player.characterEmote = character.flying;
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const norm = Math.sqrt(0.5);
            dx *= norm;
            dy *= norm;
        }
        if (dx !== 0 || dy !== 0) {
            if (player.isSprinting) {
                player.walkTime +=2;
            } else {
                player.walkTime ++;
            }
            if (wheelchair) player.walkTime --;
            updateAdjacent();
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

        gridX = Math.floor(width/emojiSize) + 1;
        gridY = Math.floor(height/emojiSize) + 1;

        let startX = Math.floor(player.x - gridX / 2);
        let startY = Math.floor(player.y - gridY / 2);

        // Subtile offset (in tiles)
        let offsetX = (player.x - startX - gridX / 2) * emojiSize;
        let offsetY = (player.y - startY - gridY / 2) * emojiSize;

        let sunTile;

        // Draw tiles and player inside the tile loop
        for (let i = 0; i < gridX + 2; i++) {
            for (let j = 0; j < gridY + 2; j++) {
                let mapX = startX + i;
                let mapY = startY + j;

                // Draw hole if cave1_map has ladder and player is in overworld
                if (player.level == 0 && cave1_map[mapX] && cave1_map[mapX][mapY] == "🪜") {
                    let drawX = i * emojiSize - offsetX;
                    let drawY = j * emojiSize - offsetY;
                    ctx.font = (emojiSize * 1.5) + "px " + useFont + ", Arial";
                    ctx.fillStyle = "#fff";
                    ctx.fillText("🕳️", drawX, drawY);
                    
                    continue;
                }

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

                    // Sun/moon
                    if (i == Math.round(gridX/2) && j == 1) {
                        sunTile = emoji;
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

                // Player
                if (i == Math.round(gridX/2) && j == Math.round(gridY/2)) {
                    ctx.font = emojiSize + "px " + useFont + ", Arial";
                    ctx.fillText(player.characterEmote, gridX/2 * emojiSize, gridY/2 * emojiSize);
                }

                // Highlight hovered tile with white outline box
                if (
                    (i - 1) === xHover && (j - 1) === yHover &&
                    !player.inventoryOpen && !player.hotbarHover && !player.boxOpen) {

                    let emoji = map[mapX] && map[mapX][mapY] ? map[mapX][mapY] : "";
                    let size = emojiSize;
                    let offset = 0;
                    if (emoji.at(-1) === "g") {
                        size = emojiSize * 3;
                        offset = -(size - emojiSize) / 2;
                    } else if (emoji.at(-1) === "b") {
                        size = emojiSize * 1.5;
                        offset = -(size - emojiSize) / 2;
                    }
                    // Draw white outline box
                    ctx.save();
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        (i * emojiSize - offsetX + offset) - emojiSize/2,
                        (j * emojiSize - offsetY + offset) - emojiSize/2,
                        size,
                        size
                    );
                    ctx.restore();
                }
            }
        }

        // Sun/moon
        if (player.level >= 0) {
            /*if (water.includes(sunTile)) {
                sunTile = "🌅";
            } else if (mountain.includes(sunTile)) {
                sunTile = "🌄";
            } else {
                sunTile = "☀️";
            }*/
            sunTile = "☀️";
        } else {
            sunTile = "";
        }
        ctx.font = emojiSize + "px " + useFont + ", Arial";
        ctx.fillText(sunTile,width/2,emojiSize-5);

        // Draw entities
        for (let entity of gameData.entities[String(player.level)]) {
            // Check if entity is within visible grid
            if (
                entity.x >= startX && entity.x < startX + gridX &&
                entity.y >= startY && entity.y < startY + gridY
            ) {
                const drawX = (entity.x - startX) * emojiSize - offsetX;
                const drawY = (entity.y - startY) * emojiSize - offsetY;
                entity.draw(ctx, drawX, drawY);
            }
        }

        // Visibility
        if (map == overworld_map) {
            player.visibility = 100;
        } else if (map == cave1_map) {
            player.visibility = 10;

            // Light souces (descending greatest to least)
            if (water.includes(player.adjacent[4]) && (itemHeld == "🤿" || player.accessories.flat().includes("🤿"))) {
                player.visibility += 10;
            }
            if (itemHeld == "🔦" || player.accessories.flat().includes("🔦")) {
                player.visibility += 25;
            }
            if (itemHeld == "🪔" || player.accessories.flat().includes("🪔")) {
                player.visibility += 20;
            }
            if (itemHeld == "🕯️" || player.accessories.flat().includes("🕯️")) {
                player.visibility += 10;
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
        player.hotbarHover = false;
        for (let i = 0; i < player.inventory[0].length; i++) {
            let item = player.inventory[0][i];
            let value = player.inventoryValue[0][i];

            let drawX = hotbarX + padding + i * (itemSize + gap) + itemSize / 2;
            let drawY = hotbarY + padding + itemSize / 2;

            // Highlight selected item
            let extra = 6; // how much bigger the box should be
            let rectX = hotbarX + padding + i * (itemSize + gap) - extra / 2;
            let rectY = hotbarY + padding - extra / 2;
            let size = itemSize + extra;
            let radius = 8;

            if (i === player.hotbarSelected) {
                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = "#cccccc";
                drawRoundedBox(ctx,rectX,rectY,size,size,radius);
                ctx.restore();
            }

            // Detect mouse
            if (mouseX >= rectX && mouseX <= rectX + size &&
                mouseY >= rectY && mouseY <= rectY + size) {
                player.hotbarHover = true;
                
                dragItem(player.inventory,player.inventoryValue,0,i);
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
        if (useFont != font.serenity) {
            ctx.save();
            ctx.fillStyle = "#333";
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
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

            progressBar(barX,barY,totalWidth,barHeight,barRadius,fillColor,progress);
        }

        // Bossbar
        if (gameData.bossbar > 0) {
            const barHeight = 8;
            const barRadius = 6;
            const progress = Math.min(gameData.bossbar, 100);

            // Progress fill color
            let fillColor;
            switch (gameData.bossbarType) {
                case "Mr. Poop":
                    fillColor = "brown";
                    break;
                case "Roboto":
                    fillColor = "#8a8a8aff";
                    break;
                default:
                    fillColor = "#cccccc";
                    break;
            }

            const barX = hotbarX;
            const barY = 30;
            const extend = 60;

            progressBar(barX - extend,barY,totalWidth + 2*extend,barHeight,barRadius,fillColor,progress);
        }

        // Inventory & Boxes
        hovering = false;
        if (player.inventoryPriority) {
            drawBox();
            if (player.inventoryOpen) {
                updateCraftingPossibilities();
                drawInventory();
            }
        } else {
            if (player.inventoryOpen) {
                updateCraftingPossibilities();
                drawInventory();
            }
            if (player.boxOpen) {
                drawBox(player.boxClick.level,player.boxClick.x,player.boxClick.y);
            }
        }

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
        let healthSize = emojiSize;
        ctx.font = healthSize + "px " + useFont;

        // Health Bar
        for (let i = 0; i < player.maxHealth; i++) {
            let x = 15 + i * (healthSize + 4);
            let health = i < player.health ? healthEmoji : "🖤";
            ctx.fillText(health, x, 15);
        }

        // Breath Bar
        if (player.isDrowning || player.breath < player.maxBreath) {
            for (let i = 0; i < player.maxBreath; i++) {
                let x = 15 + i * (healthSize + 4);
                let health = i < player.breath ? "🫧" : "⚫";
                ctx.fillText(health, x, emojiSize + 19);
            }
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
        if (player.hoverText && player.hoverText !== "0") {
            if (
                (player.inventoryOpen && hovering) ||
                (player.boxOpen && hovering) ||
                (player.inventoryOpen && player.itemDrag.value > 0) ||
                (!player.inventoryOpen && player.itemDrag.value > 0)) {
                    drawFormattedText(mouseX, mouseY, player.hoverText);
            }
        }

        gameLogic();
    }

    window.gameLoop = function() {
        let now = Date.now();

        // Run at gameSpeed rate
        if (now - lastPlayerUpdate >= playerInterval) {
            updatePlayer();
            update();
            lastPlayerUpdate = now;
        }

        requestAnimationFrame(gameLoop);
    };

    loadScreen();
});