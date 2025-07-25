function gameLogic() {
    // Time related events
    let maxTime = gameSpeed*60; // 9000 currently
    if (gameData.time >= maxTime) {
        gameData.time = 0;
        gameData.day ++;
    }
    else gameData.time++;
    
    // Regeneration
    if (gameData.time % 200 == 0 && player.health < player.maxHealth && player.hunger > 0) {
        player.health ++;
        hunger(-1);
    }

    // Hunger and Thirst logic
    if (gameData.time % 400 == 0 && (player.hunger == 0 || player.thirst == 0)) damage(1);

    if (player.walkTime == 1100) {
        if (player.thirst > 0) {
            thirst(-1);
        }
    }
    if (player.walkTime == 1300) {
        if (player.hunger > 0) {
            hunger(-1);
        }
        player.walkTime = 0;
    }

    // Drowning logic
    if (gameData.time % 200 == 0 && player.isDrowning) {
        if (player.breath > 0) {
            player.breath --;
        } else {
            damage(1);
        }
    }
    if (gameData.time % 50 == 0) {
        if (player.breath < player.maxBreath && !player.isDrowning) {
            player.breath ++;
        }
    }

    // Dragging items in inventory
    if (timeSinceDragging > 0) timeSinceDragging --;

    // Default Emotion
    if (player.breath <= 0) {
        player.defaultEmotion = "🤢"
    } else if (player.hunger < 4 || player.thirst < 4 || player.breath < 4) {
        player.defaultEmotion = "😵‍💫";
    } else if (player.level == 0) {
        player.defaultEmotion = "😊";
    } else if (player.level == -1) {
        player.defaultEmotion = "😓";
    }

    // burning logic
    if (player.damageCooldown > 0) player.damageCooldown --;
    if (player.fireCooldown > 0) player.fireCooldown --;

    if (player.burning > 0) {
        if (player.fireCooldown <= 0) {
            damage();
            player.fireCooldown = 400;
            player.burning--;
        }
        healthEmoji = hearts.burning;
        player.emotion = "🥵";
        player.emotionTime = 100;
    } else {
        healthEmoji = hearts.default;
    }

    // entity logic
    for (let entity of gameData.entities) {
        //entity.target(player.x,player.y,map);
        entity.update(map);
    }
}

// Map related events
function changeLevel(lvl) {
    player.level = lvl;
    switch (lvl) {
        case 0:
            map = overworld_map;
            break;
        case 1:
            map = sky_map;
            break;
        case 2:
            map = space_map;
            break;
        case -1:
            map = cave1_map;
            break;
        case -2:
            map = hell_map;
            break;
        case -3:
            map = dungeon_map;
            break;
        case 3:
            map = house_map;
            break;
        case 4:
            map = moon_map;
            break;
    }
    updateAdjacent();
}

function dim() {
    switch (player.level) {
        case 0:
            return overworld_map;
            break;
        case 1:
            return sky_map;
            break;
        case 2:
            return space_map;
            break;
        case -1:
            return cave1_map;
            break;
        case -2:
            return hell_map;
            break;
        case -3:
            return dungeon_map;
            break;
        case 3:
            return house_map;
            break;
        case 4:
            return moon_map;
            break;
    }
}

function damage(amount = 1) {
    if (player.damageCooldown <= 0) {
        player.health -= amount;
        player.damageTicks += 20;
        player.damageCooldown = 100;
        player.emotion = "🤕";
        player.emotionTime = 500;

        if (player.health <= 0) {
            player.health = 0;
            console.log("Player died.");
        }
    }
}

function displayHotbarText(txt) {
    hotbarText = txt;
    hotbarTextTime = 150;
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
    if (accessoriesProperties[item]) return accessoriesProperties[item].name;
    else if (itemNames[item]) return itemNames[item].name;
    else if (weaponProperties[item]) return weaponProperties[item].name;
    else if (armorProperties[item]) return armorProperties[item].name;
    else if (foodProperties[item]) return foodProperties[item].name;
    else if (farmCrops[item]) return farmCrops[item].name;
    else if (objectProperties[item]) return objectProperties[item].name;
    else if (craftingDictionary[item]) return craftingDictionary[item].name;
    return item;
}

function findDesc(item) {
    if (accessoriesProperties[item]?.description) return accessoriesProperties[item].description;
    else if (itemNames[item]?.description) return itemNames[item].description;
    else if (weaponProperties[item]?.description) return weaponProperties[item].description;
    else if (armorProperties[item]?.description) return armorProperties[item].description;
    else if (foodProperties[item]?.description) return foodProperties[item].description;
    else if (farmCrops[item]?.description) return farmCrops[item].description;
    else if (objectProperties[item]?.description) return objectProperties[item].description;
    else if (craftingDictionary[item]?.description) return craftingDictionary[item].description;
    return "";
}

function updateAdjacent() {
    let xPos = Math.round(player.x);
    let yPos = Math.round(player.y);
    
    player.adjacent = [
        getTileSafe(xPos-1, yPos-1),   // Top-left
        getTileSafe(xPos,   yPos-1),   // Top-center
        getTileSafe(xPos+1, yPos-1),   // Top-right
        
        getTileSafe(xPos-1, yPos),     // Left
        getTileSafe(xPos,   yPos),     // Center (player position)
        getTileSafe(xPos+1, yPos),     // Right
        
        getTileSafe(xPos-1, yPos+1),   // Bottom-left
        getTileSafe(xPos,   yPos+1),   // Bottom-center
        getTileSafe(xPos+1, yPos+1)    // Bottom-right
    ];
}

function getTileSafe(x, y) {
    // Check if coordinates are within map bounds
    if (x >= 0 && x < map.length && y >= 0 && y < map[0].length) {
        return map[x][y];
    }
    return null; // represents "out of bounds"
}

function updateCraftingPossibilities() {
    player.possiblyCraft = [];
    player.canCraft = [];

    for (const itemName in craftingDictionary) {
        const craftingRecipe = craftingDictionary[itemName];
        const { itemsNeeded, amountsNeeded, required } = craftingRecipe;

        let requirementsMet = 0;
        let hasAtLeastOneIngredient = false;

        if (required !== "") {
            updateAdjacent();
        }

        for (let h = 0; h < itemsNeeded.length; h++) {
            const ingredient = itemsNeeded[h];
            const amount = amountsNeeded[h];

            if (testFor(ingredient, amount)) {
                requirementsMet++;
            }

            // Check if player has at least one of this ingredient
            for (let i = 0; i < player.inventory.length; i++) {
                for (let j = 0; j < player.inventory[i].length; j++) {
                    if (
                        player.inventory[i][j] === ingredient &&
                        (required === "" ||
                        player.adjacent.includes(required) ||
                        player.accessories.flat().includes(required))
                    ) {
                        hasAtLeastOneIngredient = true;
                    }
                }
            }
        }

        if (requirementsMet === itemsNeeded.length) {
            player.canCraft.push(itemName);
        } else if (hasAtLeastOneIngredient) {
            player.possiblyCraft.push(itemName);
        }
    }
}

function thirst(value) {
    if (value === 0 || typeof value !== 'number') return;

    if (value > 0) {
        player.thirst = Math.min(player.thirst + value, player.maxThirst);
    } else {
        player.thirst = Math.max(player.thirst + value, 0);
    }
}

function hunger(value) {
    // first try to fill up food health
    if (value > 0) {

        // Yummy yummy
        if (value > 3) {
            player.emotion = "🤤";
            player.emotionTime = 900;
        } else {
            player.emotion = "😋";
            player.emotionTime = 400;
        }
        
        const remainingSpace = player.maxHunger - player.hunger;
        if (remainingSpace >= value) {
            player.hunger += value;
            return; // Food health increased successfully
        } else {
            player.hunger = player.maxHunger;
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
            if (player.hunger >= -value) {
                player.hunger += value;
            } else {
                player.hunger = 0;
            }
        }
    }
}

// Generally for events near the player
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

    // Drowning
    if (player.level == -1 && water.includes(tile)) {
        player.isDrowning = true;
    } else {
        player.isDrowning = false;
    }

    // Map transitioning
    if (player.isShifting && tile == "🕳️") {
        changeLevel(-1);
    }
    if (player.isJumping && tile == "🪜") {
        changeLevel(0);
    }
    if (player.level == 0 && player.isShifting && water.includes(tile) && water.includes(cave1_map[Math.round(xStep)][Math.round(yStep)])) {
        changeLevel(-1);
    }
    if (player.level == -1 && player.isJumping && water.includes(tile) && water.includes(overworld_map[Math.round(xStep)][Math.round(yStep)])) {
        changeLevel(0);
    }

    itemHeld = player.inventory[0][player.hotbarSelected];

    // Block manipulation
    xHover = Math.floor(mouseX/emojiSize);
    yHover = Math.floor(mouseY/emojiSize);
    gridX = Math.floor(width/emojiSize);
    gridY = Math.floor(height/emojiSize);
    x = Math.round(player.x - gridX / 2) + xHover;
    y = Math.round(player.y - gridY / 2) + yHover;

    // Trash bin
    if (leftClick && map[x][y] == "🗑️") {
        player.itemDrag = {
            item: "",
            value: 0
        }
        player.hoverText = "";
    }

    // Eating priority
    if (!player.inventoryOpen) {
        if (rightClick && foodProperties[itemHeld]) {
            player.progressType = "eating";
            player.progressBar += 1 / (foodProperties[itemHeld].nutrition * 0.075); // adjust eating speed (smaller = faster)
            if (player.progressBar >= 100) {
                hunger(foodProperties[itemHeld].nutrition);
                if (foodProperties[itemHeld]?.thirst) thirst(foodProperties[itemHeld].thirst);

                // Custom emotions
                if (["🍺","🍸"].includes(itemHeld)) {
                    player.emotion = "🥴";
                }

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
                            // Check for correct tool if required
                            if (Tile.toolRequired === "⛏️" && itemHeld !== "⛏️") {
                                // No loot if wrong tool
                                return;
                            }

                            // Handle new loot table format (array of objects)
                            if (Array.isArray(Tile.loot)) {
                                for (const lootItem of Tile.loot) {
                                    if (Math.random() < lootItem.chance) {
                                        const amount = Math.floor(
                                            Math.random() * (lootItem.max - lootItem.min + 1)
                                        ) + lootItem.min;
                                        addInventory(lootItem.item, amount);
                                    }
                                }
                            }
                            // Handle old simple string format
                            else if (typeof Tile.loot === 'string') {
                                addInventory(Tile.loot, 1);
                            }
                        }

                        map[x][y] = "";
                    }

                } else if (
                    rightClick && overridables.includes(block) &&
                    (objectProperties[itemHeld] || objectProperties[player.itemDrag.item])) {
                    const itemToPlace = objectProperties[itemHeld] ? itemHeld : player.itemDrag.item;

                    if (sand.includes(block)) {
                        addInventory("⏳", 1);
                    }

                    map[x][y] = itemToPlace;

                    if (objectProperties[itemHeld]) {
                        removeInventory(itemHeld, 1);
                    } else {
                        if (player.itemDrag.value <= 1) {
                            player.itemDrag.item = "";
                            player.itemDrag.value = 0;
                        } else {
                            player.itemDrag.value--;
                            player.hoverText = `${player.itemDrag.item}${player.itemDrag.value}`;
                        }
                    }
                }
            }
        } else {
            // Stop mining if not clicking
            player.miningTarget = null;
            player.progressBar = 0;
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