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
            damage();
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

function damage(amount = 1) {
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

function hunger(value) {
    // first try to fill up food health
    if (value > 0) {
        const remainingSpace = player.maxFood - player.food;
        if (remainingSpace >= value) {
            player.food += value;
            return; // Food health increased successfully
        } else {
            player.food = player.maxFood;
            value -= remainingSpace;
        }

        // Once maxed, increase saturation
        if (value > 0) {
            const remainingSaturation = player.maxSaturation - player.saturation;
            if (remainingSaturation >= value) {
                player.saturation += value;
            } else {
                player.saturation = player.maxSaturation;
            }
        }
    }
    // If value is negative, first reduce saturation, then food health
    else if (value < 0) {
        if (player.saturation > 0) {
            player.saturation += value;
        } else {
            if (player.food >= -value) {
                player.food += value;
            } else {
                player.food = 0;
            }
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
        damage();
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

    // Eating priority
    if (rightClick && foodProperties[itemHeld]) {
        player.progressType = "eating";
        player.progressBar += foodProperties[itemHeld].nutrition * 0.8; // adjust eating speed
        if (player.progressBar >= 100) {
            hunger(foodProperties[itemHeld].nutrition);
            removeInventory(itemHeld,1);
            player.progressBar = 0;
        }
    }
    // Breaking and mining blocks
    else if (leftClick || rightClick) {
        let distance = Math.sqrt((xHover - gridX / 2) ** 2 + (yHover - gridY / 2) ** 2);
        if (distance <= 7) {
            // Block breaking logic
            player.correctTool = true;

            let x = Math.floor(player.x - gridX / 2) + xHover;
            let y = Math.floor(player.y - gridY / 2) + yHover;

            let block = map[x][y];
            let Tile = objectProperties[block];

            // ---------------- Mining logic ----------------
            if (leftClick && block !== "" && (!Tile || !Tile.unbreakable)) {
                const targetKey = x + "," + y;

                // Check if mining same block
                if (player.miningTarget !== targetKey) {
                    player.miningTarget = targetKey;
                    player.progressBar = 0;
                }

                player.progressType = "mining";

                let durability = Tile?.durability ?? 1;
                durability = Math.max(durability, 1); // Prevent divide by zero

                let speed = Tile?.durability || 3;

                if (Tile?.toolRequired === "👊") {
                    // Same speed
                } else if (Tile?.toolRequired === "🪓") {
                    if (itemHeld !== "🪓") player.correctTool = false;
                    if (itemHeld === "🪓") speed /= 3; // Twice as fast
                    else speed *= 4;
                } else if (Tile?.toolRequired === "🥄") {
                    if (itemHeld !== "🥄") player.correctTool = false;
                    if (itemHeld === "🥄") speed /= 4;
                } else if (Tile?.toolRequired === "⛏️") {
                    if (itemHeld !== "⛏️") player.correctTool = false;
                    if (itemHeld === "⛏️") speed /= 1.5;
                    else speed *= 6;
                }

                player.progressBar += 1 / speed * 3; // adjust speed here


                if (player.progressBar >= 100) {
                    player.progressBar = 0;
                    player.miningTarget = null;

                    // Break block
                    if (Tile && Tile.loot) {
                        if (Tile.toolRequired === "⛏️" && itemHeld !== "⛏️") {
                            // No loot if wrong tool
                        } else {
                            addInventory(Tile.loot, 1);
                        }
                    }

                    map[x][y] = "";
                }

            } else if (rightClick && overridables.includes(block) && objectProperties[itemHeld]) {
                // Placing blocks logic
                map[x][y] = itemHeld;
                removeInventory(itemHeld, 1);
            }
        }
    } else {
        // Stop mining if not clicking
        player.miningTarget = null;
        player.progressBar = 0;
    }

    // Time related events
    if (time >= 1000) {
        time = 0;
        day ++;
    }
    else time++;
    
    if (time % 900 == 0 && player.isSprinting) hunger(-1);
    if (time % 400 == 0 && player.food == 0) damage(1);

    if (time % 200 == 0 && player.health < player.maxHealth && player.food > 0) {
        player.health ++;
        hunger(-1);
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