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
}

function damagePlayer(amount = 1) {
    if (player.damageCooldown <= 0) {
        player.health -= amount;
        player.damageCooldown = 100;

        if (player.health <= 0) {
            player.health = 0;
            console.log("Player died.");
        }
    }
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

    player.x += dx;
    player.y += dy;
}