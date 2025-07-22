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

function testFor(item,amount) {
    for (let i = 0; i < player.inventory.length; i++) {
        for (let j = 0; j < player.inventory[i].length; j++) {
            if (player.inventoryValue[i][j] >= amount && player.inventory[i][j] === item) {
                return true;
            }
        }
    }
    return false;
}

function addInventory(slot,amount) {
    let success = false;
    for (let i = 0; i < player.inventory.length; i++) {
        for (let j = 0; j < player.inventory[i].length; j++) {
            if (player.inventory[i][j] === slot && !(slot in unstackable)) {
                player.inventoryValue[i][j] += amount;
                success = true;
                return;
            }
        }
    }
    if (!success) {
        for (let i = 0; i < player.inventory.length; i++) {
            for (let j = 0; j < player.inventory[i].length; j++) {
                if (player.inventory[i][j] == 0) {
                    player.inventory[i][j] = slot;
                    player.inventoryValue[i][j] = amount;
                    /*if (showInv != "") {
                        openInventory();
                    }*/
                    return;
                }
            }
        }
    }
}

function removeInventory(slot, amount) {
    if (testFor(slot, amount)) {
        for (let i = 0; i < player.inventory.length; i++) {
            for (let j = 0; j < player.inventory[i].length; j++) {
                if (player.inventory[i][j] == slot) {
                    if (player.inventoryValue[i][j] <= amount) {
                        let remaining = amount - player.inventoryValue[i][j];
                        player.inventory[i][j] = "";
                        player.inventoryValue[i][j] = 0;
                        removeInventory(slot,remaining);
                    } else {
                        player.inventoryValue[i][j] -= amount;
                    }
                }
            }
        }
    }
}

function findName(item) {
    if (itemNames[item]) return itemNames[item].name;
    else if (weaponProperties[item]) return weaponProperties[item].name;
    else if (armorProperties[item]) return armorProperties[item].name;
    else if (foodProperties[item]) return foodProperties[item].name;
    else if (farmCrops[item]) return farmCrops[item].name;
    else if (objectProperties[item]) return objectProperties[item].name;
    else if (craftingDictionary[item]) return craftingDictionary[item].name;
    return item;
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

    itemHeld = player.inventory[0][player.hotbarSelected];

    // Block manipulation
    let xHover = Math.round(mouseX/emojiSize);
    let yHover = Math.round(mouseY/emojiSize);
    let gridX = Math.round(width/emojiSize);
    let gridY = Math.round(height/emojiSize);

    if (leftClick || rightClick) {
        let distance = Math.sqrt((xHover-gridX/2)**2 + (yHover-gridY/2)**2);
        if (distance <= 7) {
            // Breaking blocks logic
            let x = Math.floor(player.x - gridX / 2) + xHover;
            let y = Math.floor(player.y - gridY / 2) + yHover;
            if (leftClick) {
                let Tile = objectProperties[map[x][y]];
                if (Tile && Tile.loot) {
                    addInventory(Tile.loot, 1);
                }

                map[x][y] = "";
                
            } else if (overridables.includes(map[x][y]) && objectProperties[itemHeld]) {
                // Placing blocks logic
                map[x][y] = itemHeld;
                removeInventory(itemHeld,1);
            }
        }
    }

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