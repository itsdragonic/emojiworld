function gameLogic() {
    if (elapsedTime >= 1000) {
        elapsedTime = 0;
    } else {
        elapsedTime ++;
    }
    if (player.damageCooldown > 0) player.damageCooldown --;
    if (player.fireCooldown > 0) player.fireCooldown --;

    if (player.burning > 0) {
        if (player.fireCooldown <= 0) {
            damagePlayer();
            player.fireCooldown = 400;
            player.burning --;
        }
        healthEmoji = hearts.burning;
    } else {
        healthEmoji = hearts.default;
    }

    for (let entity of entities) {
        entity.update(map);
    }
}

function damagePlayer(amount = 1) {
    if (player.damageCooldown <= 0) {
        player.health -= amount;
        player.damageTicks += 20;
        player.damageCooldown = 100;

        if (player.health <= 0) {
            player.health = 0;
            console.log("Player died.");
        }
    }
}

function displayHotbarText(txt) {
    hotbarText = txt;
    hotbarTextTime = 100;
}

function surroundings(dx,dy) {
    let xStep = player.x + dx;
    let yStep = player.y + dy;

    let tile = map[Math.round(xStep)][Math.round(yStep)];
    let tileProps = objectProperties[tile];

    let canWalk = tileProps?.canBeWalkedOn ?? true;

    if (!canWalk) {
        dx = 0;
        dy = 0;
    }

    // Block interaction properties
    if (tile == "🌵") {
        damagePlayer();
        displayHotbarText("Ouch!")
    }
    if (["🌋","🔥"].includes(tile)) {
        player.burning = 3;
    }
    if (water.includes(tile)) {
        player.burning = 0;
    }
    
    // Map transitioning
    if (player.isShifting && tile == "🕳️") {
        map = cave1_map;
    }
    if (player.isJumping && tile == "🪜") {
        map = overworld_map;
    }

    let itemHeld = player.inventory[0][player.hotbarSelected];

    // Move player
    player.x += dx;
    player.y += dy;
}

function drawVisibilityOverlay() {
    // Skip if visibility is max
    if (player.visibility >= 100) return;

    // Position of player on screen (centered)
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate inner and outer radius based on visibility
    // At 100: full visibility → outer radius huge
    // At 0: almost no visibility → outer radius tight
    const maxRadius = Math.sqrt(width ** 2 + height ** 2) / 2;
    const visibilityRatio = player.visibility / 100;

    const innerRadius = emojiSize * 2; // always visible near player
    const outerRadius = innerRadius + (maxRadius - innerRadius) * visibilityRatio;

    // Create radial gradient from center (player) to screen edge
    const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // fully transparent at player
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)'); // black at edge

    // Draw the darkening overlay
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}