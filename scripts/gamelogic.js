function gameLogic() {
    // Time related events
    let maxTime = gameSpeed*60; // 9000 currently
    if (gameData.time >= maxTime) {
        gameData.time = 0;
        gameData.day ++;
    } else {
        gameData.time++;
    }

    // Regeneration
    if (gameData.time % 200 == 0 && player.health < player.maxHealth && player.hunger > 0) {
        player.health ++;
        hunger(-1);
    }

    // Hunger and Thirst logic
    if (gameData.time % 400 == 0 && (player.hunger == 0 || player.thirst == 0)) damage(1,true);

    if (player.walkTime == 1100) {
        if (player.thirst > 0) {
            thirst(-1);
        }
        player.walkTime ++;
    }
    if (player.walkTime == 1300) {
        if (player.hunger > 0) {
            hunger(-1);
        }
        player.walkTime = 0;
    }

    // Drowning logic
    if (gameData.time % 133 == 0 && player.isDrowning && !(player.armor.includes("🤿") || player.accessories.flat().includes("🤿"))) {
        if (player.breath > 0) {
            player.breath --;
        } else {
            damage(1,true);
        }
    }
    if (gameData.time % 50 == 0) {
        if (player.breath < player.maxBreath && !player.isDrowning) {
            player.breath ++;
        }
    }

    // Cooldowns
    if (timeSinceDragging > 0) timeSinceDragging --;
    if (player.levelCooldown > 0) player.levelCooldown --;

    // Mob spawning
    mobSpawning();

    // Default Emotion
    if (player.breath <= 0) {
        player.defaultEmotion = "🤢"
    } else if (player.hunger < 4 || player.thirst < 4 || player.breath < 4) {
        player.defaultEmotion = "😵‍💫";
    } else if (player.level > 1 && player.isDrowning) {
        player.defaultEmotion = "🥶";
    } else if (player.visibility <= 10) {
        player.defaultEmotion = "😓";
    } else {
        player.defaultEmotion = "😊";
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

    // other logic
    updateNearbyEntities();
    death();
    crops();
}

function updateNearbyEntities() {
    const currentLevel = String(player.level);
    const entities = gameData.entities[currentLevel];
    if (!entities) return;

    const radius = 25; // Radius around player that mobs will update their position
    const radiusSquared = radius * radius;

    for (let entity of entities) {
        entity.update(map);
        entity.target(entity.targetX,entity.targetY,map);

        if (
            entity.hostile &&
            Math.abs(entity.x - player.x) < 1 &&
            Math.abs(entity.y - player.y) < 1
        ) {
            damage(entity.damage);
        }

        if (gameData.time % 100 == 0) { // how fast mobs change target
            const dx = entity.x - player.x;
            const dy = entity.y - player.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared <= radiusSquared) {
                // Entitiy moving logic
                if (entity.hostile || entity.pet) {
                    entity.setTarget(player.x,player.y);
                } else {
                    let target = donutRadius(entity.x,entity.y,5,2);
                    entity.setTarget(target[0],target[1]);
                }
            }
        }
    }
}

function mobSpawning() {
    let mobCap = gameData.entities[String(player.level)].length < 30;
    if (gameData.time % 100 == 0 && mobCap) {
        let spawnPos = donutRadius(player.x,player.y,50,35).map(Math.round);

        if (map[spawnPos[0]] !== undefined &&
            map[spawnPos[0]][spawnPos[1]] !== undefined) {
            let mob = "";
            let tile = map[spawnPos[0]][spawnPos[1]];
            switch (player.level) {
                // Space
                case 2:
                    if (tile == "") {
                        mob = spaceMobs[Math.floor(Math.random() * spaceMobs.length)];
                    }
                    break;
                // Sky
                case 1:
                    if (tile == "") {
                        mob = skyMobs[Math.floor(Math.random() * skyMobs.length)];
                    }
                    break;
                // Overworld
                case 0:
                    // Aquatic
                    if (water.includes(tile)) {
                        mob = "🐟";
                    }
                    // Beach
                    else if (terrain_map[spawnPos[0]][spawnPos[1]] == "🏖️") {
                        mob = beachMobs[Math.floor(Math.random() * beachMobs.length)];
                    }
                    // Land
                    else if (tile == "" || overridables.includes(tile)) {
                        mob = overworldMobs[Math.floor(Math.random() * overworldMobs.length)];
                    }
                    break;
                // Caves
                case -1:
                case -2:
                    // Coral
                    if (water.includes(tile) && temp_map[spawnPos[0]][spawnPos[1]] == "🏜️") {
                        mob = coralMobs[Math.floor(Math.random() * coralMobs.length)];
                    }
                    // Ocean floor
                    else if (water.includes(tile)) {
                        mob = oceanMobs[Math.floor(Math.random() * oceanMobs.length)];
                    }
                    // Cave
                    else if (tile == "🕸️") {
                        mob = "🕷️";
                    } else if (tile == "") {
                        mob = "🦇";
                    }
                    break;
                // Hell
                case -3:
                    if (tile == "" || tile == "🥀") {
                        mob = hellMobs[Math.floor(Math.random() * hellMobs.length)];
                    }
                    break;
            }
            if (mob != "") {
                gameData.entities[String(player.level)].push(new Mob(mob, spawnPos[0], spawnPos[1], entityId));
                entityId++;
            }
        }
    }
}

function crops() {
    if (gameData.time % 500 == 0 && Object.keys(gameData.cropData).length > 0) {
        const crops = Object.values(gameData.cropData);

        let randomCrop = crops[Math.floor(Math.random() * crops.length)];

        if (Math.random() < farmCrops[randomCrop.type].chance) {
            dim(randomCrop.level)[randomCrop.x][randomCrop.y] = randomCrop.type;
        }
    }    
}

// Map related events
function changeLevel(lvl,location) {
    if (player.levelCooldown > 0) return;
    player.level = lvl;
    map = dim(lvl);

    if (location) {
        player.x = location.x;
        player.y = location.y;
    }

    updateAdjacent();
    player.levelCooldown = 30;
}

function dim(level) {
    switch (level) {
        case 3:
            return moon_map;
            break;
        case 2:
            return space_map;
            break;
        case 1:
            return sky_map;
            break;
        case 0:
            return overworld_map;
            break;
        case -1:
            return cave1_map;
            break;
        case -2:
            return cave2_map;
            break;
        case -3:
            return hell_map;
            break;
    }
}

function donutRadius(x, y, outside, inside) {
    const outsideRadius = 50;
    const insideRadius = 35;
    
    // 1. Generate random angle (0 to 2π radians)
    const angle = Math.random() * Math.PI * 2;
    
    // 2. Calculate random distance between inner and outer radius
    const distance = Math.sqrt(
        Math.random() * (outside**2 - inside**2) + inside**2
    );
    
    // 3. Convert polar to Cartesian coordinates
    return [
        x + Math.cos(angle) * distance,  // x (can be non-integer)
        y + Math.sin(angle) * distance   // y (can be non-integer)
    ];
}

function damage(amount = 1,trueDamage = false) {
    if (player.damageCooldown <= 0) {
        let actualDamage;

        if (trueDamage) {
            actualDamage = amount;
        } else {
            // logarithmic scaling
            const damageReduction = Math.min(
                0.9 * amount, // Cap reduction
                Math.log1p(player.totalProtection * 0.5)
            );
            
            actualDamage = Math.max(1, Math.round(amount - damageReduction));
            
            // minimum damage chance
            if (actualDamage <= 1 && player.totalProtection > 0) {
                const blockChance = player.totalProtection / (player.totalProtection + 10);
                if (Math.random() < blockChance) {
                    actualDamage = 0;
                } else {
                    actualDamage = 1;
                }
            } else if (!actualDamage) {
                actualDamage = 0;
            }
        }

        player.health -= actualDamage;
        player.damageTicks += 20;
        player.damageCooldown = 100;
        player.emotion = actualDamage == 0 ? "🛡️" : "🤕";
        player.emotionTime = actualDamage == 0 ? 100 : 500;

        if (player.health <= 0) {
            player.health = 0;
            player.timeSinceDeath = 500;
        }
    }
}

function death() {
    if (player.timeSinceDeath > 0) {
        player.timeSinceDeath --;
        displayHotbarText("Respawning...",20);
    }
    if (player.timeSinceDeath == 1) {
        player.health = player.maxHealth;
        player.hunger = Math.max(player.hunger,5);
        player.thirst = Math.max(player.thirst,5);
        changeLevel(0);
        player.x = MAP_WIDTH/2;
        player.y = MAP_HEIGHT/2;
    }
}

function displayHotbarText(txt,time = 150) {
    hotbarText = txt;
    hotbarTextTime = time;
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

function addInventory(item, amount = 1) {
    const stackLimit = 99;
    let remaining = amount;
    
    // First pass: Try stacking in existing slots
    for (let i = 0; i < player.inventory.length && remaining > 0; i++) {
        for (let j = 0; j < player.inventory[i].length && remaining > 0; j++) {
            if (player.inventory[i][j] === item && !(item in unstackable)) {
                const availableSpace = stackLimit - player.inventoryValue[i][j];
                const addAmount = Math.min(availableSpace, remaining);
                player.inventoryValue[i][j] += addAmount;
                remaining -= addAmount;
            }
        }
    }
    
    // Second pass: Find empty slots for remaining items
    for (let i = 0; i < player.inventory.length && remaining > 0; i++) {
        for (let j = 0; j < player.inventory[i].length && remaining > 0; j++) {
            if (player.inventory[i][j] === 0 || player.inventory[i][j] === "") {
                const addAmount = Math.min(stackLimit, remaining);
                player.inventory[i][j] = item;
                player.inventoryValue[i][j] = addAmount;
                remaining -= addAmount;
            }
        }
    }
    
    // Handle overflow if any items remain
    if (remaining > 0) {
        //inventoryOverflow(item, remaining);
    }
}

function removeInventory(slot, amount = 1) {
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
                    if (player.inventory[i][j] === ingredient) {
                        hasAtLeastOneIngredient = true;
                    }
                }
            }
        }

        if (requirementsMet === itemsNeeded.length &&
            (required === "" ||
            player.adjacent.includes(required) ||
            player.accessories.flat().includes(required))) {
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

function dragItem(inventory,inventoryValue,i,j) {
    // Dragging item logic
    if ((leftClick || rightClick) && timeSinceDragging == 0) {
        let item = player.itemDrag.item;
        let value = player.itemDrag.value;
        if (item == inventory[i][j] && !unstackable.includes(item)) {
            inventoryValue[i][j] += value;
            player.itemDrag.item = "";
            player.itemDrag.value = 0;
        } else {
            player.itemDrag.item = inventory[i][j];
            player.itemDrag.value = inventoryValue[i][j];
            inventory[i][j] = item;
            inventoryValue[i][j] = value;
        }
        player.hoverText = `${player.itemDrag.item}${player.itemDrag.value}`;
        timeSinceDragging = 20;
    }
}

function createBox(level,x,y) {
    gameData.boxData[`box_${level}_${x}_${y}`] = {
        item: Array(5).fill().map(() => Array(10).fill("")),
        value: Array(5).fill().map(() => Array(10).fill(0))
    }
}

function deleteBox(level, x, y) {
    const boxKey = `box_${level}_${x}_${y}`;
    const box = gameData.boxData[boxKey];
    
    if (box) {
        // Transfer all items to player inventory
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 10; col++) {
                const item = box.item[row][col];
                const value = box.value[row][col];
                
                if (item && item !== "" && value > 0) {
                    addInventory(item, value);
                }
            }
        }
        
        // Delete the box
        delete gameData.boxData[boxKey];
    }
}

function progressBar(barX,barY,totalWidth,barHeight,barRadius,fillColor,progress) {
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
    } else if (player.level > 1 && !(player.armor.includes("🧑‍🚀") || player.accessories.flat().includes("🧑‍🚀"))) {
        player.isDrowning = true;
    } else {
        player.isDrowning = false;
    }

    // Map transitioning
    let canFly = (player.armor[1] == "🪽" || player.accessories.flat().includes("🪽")) || player.accessories.flat().includes("🚀");
    let earth = ["🌎g","🌍g","🌏g"];
    let overlap = earth.some(element => player.adjacent.includes(element));

    if (player.level == 2 && player.isShifting && player.adjacent.includes(`${moonPhases[moonIndex]}b`) && player.accessories.flat().includes("🚀")) {
        changeLevel(3, { x: MAP_WIDTH/2, y: MAP_HEIGHT/2 });
    }
    if (player.level == 3 && player.isJumping && player.accessories.flat().includes("🚀")) {
        changeLevel(2, { x: MAP_WIDTH/2, y: 4 });
    }
    if (player.level == 1 && player.isJumping && player.accessories.flat().includes("🚀")) {
        changeLevel(2, { x: MAP_WIDTH/2 + 0.5, y: MAP_HEIGHT/2 + 0.5 });
    }
    if (player.level == 2 && player.isShifting && overlap && player.accessories.flat().includes("🚀")) {
        changeLevel(1);
    }
    if (player.level == 0 && player.isJumping && canFly) {
        changeLevel(1);
    }
    if (player.level == 1 && (player.isShifting || !canFly)) {
        changeLevel(0);
    }

    if (player.isJumping && tile == "🪜") {
        changeLevel(player.level+1);
    }
    if (player.isShifting && player.level == 0 && cave1_map[Math.round(xStep)][Math.round(yStep)] == "🪜") {
        changeLevel(-1);
    }
    if (player.level == 0 && player.isShifting && water.includes(tile) && water.includes(cave1_map[Math.round(xStep)][Math.round(yStep)])) {
        changeLevel(-1);
    }
    if (player.level == -1 && player.isJumping && water.includes(tile) && water.includes(overworld_map[Math.round(xStep)][Math.round(yStep)])) {
        changeLevel(0);
    }
    if (player.isShifting && player.level == -1 && cave2_map[Math.round(xStep)][Math.round(yStep)] == "🪜") {
        changeLevel(-2);
    }
    if (player.isJumping && player.adjacent.includes("⛩️")) {
        changeLevel(-2);
    }
    if (player.isShifting && player.adjacent.includes("⛩️")) {
        changeLevel(-3);
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

    player.isMining = false;
    if (!player.inventoryOpen) {
        // Eating
        player.isEating = false;
        if (rightClick && foodProperties[itemHeld] && timeSinceDragging == 0) {
            player.isEating = true;
            player.progressType = "eating";
            let increment = 1 / (foodProperties[itemHeld].nutrition * 0.15); // adjust eating speed (smaller = faster)
            player.progressBar += Math.min(increment, 4);
            if (player.progressBar >= 100) {
                hunger(foodProperties[itemHeld].nutrition);
                if (foodProperties[itemHeld]?.thirst) thirst(foodProperties[itemHeld].thirst);

                // Custom emotions
                if (["🍺","🍸"].includes(itemHeld)) {
                    player.emotion = "🥴";
                }

                if (foodProperties[itemHeld]?.return) addInventory(foodProperties[itemHeld]?.return,1);

                removeInventory(itemHeld,1);
                player.progressBar = 0;
                timeSinceDragging = 20;
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

                // Attacking mobs
                if (leftClick) {
                    for (let entity of gameData.entities[String(player.level)]) {
                        if (
                            Math.round(Math.round(entity.x)) === Math.round(x) &&
                            Math.round(Math.round(entity.y)) === Math.round(y)
                        ) {
                            if (weaponProperties[itemHeld]) {
                                entity.takeDamage(weaponProperties[itemHeld].damage);
                            } else {
                                entity.takeDamage(1);
                            }
                        }
                    }
                }
                // Special case for buckets
                if (rightClick && itemHeld == "🪣") {
                    let item = "";
                    if (water.includes(block)) {
                        item = "🥤";
                    }
                    if (item == "🥤") {
                        removeInventory("🪣",1);
                        addInventory("🥤",1);
                        map[x][y] = "";
                    }
                }
                // Box logic
                else if (rightClick && block == "📦") {
                    player.boxClick = {
                        level: player.level,
                        x: x,
                        y: y
                    }
                    player.boxOpen = true;
                }
                // ---------------- Mining logic ----------------
                else if (leftClick && block !== "" && block !== " " && (!Tile || !Tile.unbreakable)) {
                    player.isMining = true;
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

                    player.correctTool = false;
                    if (Tile?.toolRequired === "👊") {
                        player.correctTool = true;
                    } else if (Tile?.toolRequired === "🪓") {
                        if (itemHeld == "🪓" || player.itemDrag.item == "🪓") {
                            player.correctTool = true;
                            speed /= 3;
                        }
                        else speed *= 4;
                    } else if (Tile?.toolRequired === "🥄") {
                        if (itemHeld == "🥄" || player.itemDrag.item == "🥄") {
                            player.correctTool = true;
                            speed /= 4;
                        }
                    } else if (Tile?.toolRequired === "⛏️") {
                        if (itemHeld == "⛏️" || player.itemDrag.item == "⛏️") {
                            player.correctTool = true;
                            speed /= 1.5;
                        }
                        else speed *= 6;
                    }

                    player.progressBar += 1 / speed * 3; // adjust speed here


                    if (player.progressBar >= 100) {
                        player.progressBar = 0;
                        player.miningTarget = null;
                        let replace = "";

                        // Destroy box
                        if (block == "📦") {
                            player.boxOpen = false;
                            player.boxClick = {};
                            deleteBox(player.level,x,y);
                        }

                        // Crops
                        if (farmCrops[block] && gameData.cropData[`crop_${player.level}_${x}_${y}`]) {
                            replace = farmCrops[block].seed;
                        }
                        if (objectProperties[block]?.seed) {
                            const cropKey = `crop_${player.level}_${x}_${y}`;
                            delete gameData.cropData[cropKey];
                        }

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

                        map[x][y] = replace;
                    }

                }
                // Block placing
                else if (
                    rightClick && overridables.includes(block) &&
                    (objectProperties[itemHeld] || objectProperties[player.itemDrag.item])) {
                    let itemToPlace = objectProperties[itemHeld] ? itemHeld : player.itemDrag.item;

                    if (sand.includes(block)) {
                        addInventory("⏳", 1);
                    }
                    if (itemHeld == "⏳") {
                        itemToPlace = "𓂃";
                    } else if (itemHeld == "📦") {
                        createBox(player.level,x,y);
                    }

                    if (objectProperties[itemHeld]?.seed) {
                        gameData.cropData[`crop_${player.level}_${x}_${y}`] = {
                            type: objectProperties[itemHeld].grown,
                            level: player.level,
                            x: x,
                            y: y
                        }
                    }
                    if (bosses[itemHeld]) {
                        gameData.entities[String(player.level)].push(new Mob(itemHeld, x, y, entityId));
                        entityId ++;
                        itemToPlace = "";
                    }

                    // Place block
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

function drawFormattedText(x, y, text) {
    if (!text || typeof text !== 'string') return; // Skip if invalid
    
    ctx.save();
    
    try {
        // Default font settings
        //ctx.font = `${emojiSize}px ${useFont}, Arial`;
        ctx.font = `${emojiSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillStyle = 'black';
        
        // Split text by newlines (preserves original behavior)
        const lines = text.split('\n');
        const lineHeight = emojiSize * 1.2;
        const padding = 4;
        const offset = 8;
        
        // Calculate dimensions
        let maxWidth = 0;
        const measurements = [];
        
        lines.forEach(line => {
            // Simple formatting handler (preserves old text)
            const cleanLine = line.replace(/\\./g, ''); // Strip formatting
            const metrics = ctx.measureText(cleanLine);
            measurements.push(metrics);
            maxWidth = Math.max(maxWidth, metrics.width);
        });
        
        // Special emoji handling
        if (lines.length === 1 && lines[0].length === 2 && /^\p{Emoji}$/u.test(lines[0])) {
            maxWidth = emojiSize;
        }
        
        // Draw background
        ctx.fillStyle = 'rgba(160, 160, 160, 0.7)';
        drawRoundedBox(
            ctx,
            x + offset,
            y,
            maxWidth + padding * 2,
            (lines.length * lineHeight) + padding,
            4
        );
        
        // Draw text (ignores formatting but preserves \n)
        ctx.fillStyle = 'black';
        lines.forEach((line, i) => {
            ctx.fillText(
                line.replace(/\\./g, ''), // Draw without formatting
                x + padding + offset,
                y + (i * lineHeight) + lineHeight * 0.8
            );
        });
        
    } catch (e) {
        console.warn('Text drawing error:', e);
    } finally {
        ctx.restore();
    }
}