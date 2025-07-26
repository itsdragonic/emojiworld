let isGeneratingWorld = false;

// Mouse clicks
var leftClick = false;
var rightClick = false;
var timeSinceDragging = 0;

var hovering = false;

const emojiOptions = {
    first: [
        { emoji: "😜", weight: 4 },
        { emoji: "😎", weight: 3 },
        { emoji: "🤪", weight: 2 },
        { emoji: "😆", weight: 1 },
        { emoji: "🙃", weight: 1 }
    ],
    second: [
        { emoji: "🌎", weight: 3 },
        { emoji: "🌍", weight: 3 },
        { emoji: "🌏", weight: 3 },
    ]
};

function getWeightedRandom(options) {
    const totalWeight = options.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of options) {
        if (random < item.weight) return item.emoji;
        random -= item.weight;
    }

    return options[0].emoji;
}

// Generate logo text
function generateLogoText() {
    const firstEmoji = getWeightedRandom(emojiOptions.first);
    const secondEmoji = getWeightedRandom(emojiOptions.second);

    return `EM${firstEmoji}Jℹ️ W${secondEmoji}RLD`;
}

// Load title screen
function loadScreen() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, width, height);

    // Title text
    ctx.fillStyle = "white";
    ctx.font = "bold 48px " + useFont + ", Arial";
    ctx.textAlign = "center";
    ctx.fillText(generateLogoText(), width / 2, height / 3);

    // Credits
    ctx.font = "14px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("By Dragonic", width - 14, height - 14);

    // Button
    let buttonWidth = 200;
    let buttonHeight = 60;
    let buttonX = width / 2 - buttonWidth / 2;
    let buttonY = height / 2;

    ctx.fillStyle = "#444";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.strokeStyle = "#888";
    ctx.lineWidth = 4;
    ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

    ctx.fillStyle = "white";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Play", width / 2, buttonY + buttonHeight / 2 + 8); // +8 for vertical center

    // Store button area for click detection
    mainMenuButton = { x: buttonX, y: buttonY, w: buttonWidth, h: buttonHeight };
}

canvas.addEventListener("click", function (e) {
    if (isGeneratingWorld) return; // Exit if already processing
    
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;

    if (
        mainMenuButton &&
        mx >= mainMenuButton.x &&
        mx <= mainMenuButton.x + mainMenuButton.w &&
        my >= mainMenuButton.y &&
        my <= mainMenuButton.y + mainMenuButton.h
    ) {
        isGeneratingWorld = true; // Lock button
        
        // Visual feedback
        ctx.fillStyle = "#555";
        ctx.fillRect(mainMenuButton.x, mainMenuButton.y, mainMenuButton.w, mainMenuButton.h);
        ctx.fillStyle = "#888";
        ctx.fillText("Loading...", width / 2, mainMenuButton.y + mainMenuButton.h / 2 + 8);
        
        myInput = document.getElementById("myInput");
        document.querySelectorAll('.elements').forEach(element => {
            element.style.display = 'none';
        });

        // Mouse movements (within viewport)
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) leftClick = true;
            if (e.button === 2) rightClick = true;
        });
        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) leftClick = false;
            if (e.button === 2) rightClick = false;
        });
        document.addEventListener('mouseleave', (e) => {
            leftClick = false;
            rightClick = false;
        });

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            e.preventDefault();

            if (key === 'tab') {
                player.isSprinting = !player.isSprinting;
                return;
            } else if (key === 'e') {
                player.inventoryOpen = !player.inventoryOpen;
            }
            
            // Keys 0-9
            else if (e.key >= "1" && e.key <= "9") {
                player.hotbarSelected = parseInt(e.key) - 1;
                itemHeld = player.inventory[0][player.hotbarSelected];
                displayHotbarText(findName(itemHeld));
            } else if (e.key === "0") {
                player.hotbarSelected = 9;
                itemHeld = player.inventory[0][player.hotbarSelected];
                displayHotbarText(findName(itemHeld));
            }

            pressedKeys.add(key);
        });

        document.addEventListener('keyup', (e) => {
            pressedKeys.delete(e.key.toLowerCase());
        });

        // Start world generation
        if (myInput.value != "") {
            seed = myInput.value;
        }
        generateWorld();
        gameLoop();
    }
});

function drawRoundedBox(ctx, x, y, width, height, radius = 10, nw = true, ne = true, sw = true, se = true) {
    ctx.beginPath();

    // Top-left corner
    if (nw) {
        ctx.moveTo(x + radius, y);
    } else {
        ctx.moveTo(x, y);
    }

    // Top edge
    if (ne) {
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    } else {
        ctx.lineTo(x + width, y);
    }

    // Right edge
    if (se) {
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    } else {
        ctx.lineTo(x + width, y + height);
    }

    // Bottom edge
    if (sw) {
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    } else {
        ctx.lineTo(x, y + height);
    }

    // Left edge
    if (nw) {
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    } else {
        ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
}

function drawInventory() {
    const slotSize = emojiSize * 1.75;
    const gapSize = 5;
    const radius = 6;
    const sideBarWidth = 120;
    const topBarWidth = 35;
    const craftingSize = 4;

    const iwidth = sideBarWidth + (slotSize + gapSize) * (player.inventory.length + craftingSize) + 360;
    const iheight = topBarWidth + (slotSize + gapSize) * (player.inventory[0].length + 2) - 30;
    const x = (width - iwidth) / 2;
    const y = (height - iheight) / 2;
    
    // Main inventory background
    ctx.save();
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    drawRoundedBox(ctx,x,y,iwidth,iheight,radius);

    // Top horizontal bar
    ctx.fillStyle = 'rgba(160, 160, 160, 0.4)';
    drawRoundedBox(ctx,x+sideBarWidth,y,iwidth-sideBarWidth,topBarWidth,radius,false,true,false,false);

    // Left vertical bar
    ctx.fillStyle = 'rgba(160, 160, 160, 0.7)';
    drawRoundedBox(ctx,x,y,sideBarWidth,iheight,radius,true,false,true,false);

    // Mac-style dots
    const dotRadius = 6;
    const dotY = y + 15;
    const dotXStart = x + 15;
    const dotSpacing = 18;
    const colors = ['#ff5f56', '#ffbd2e', '#27c93f'];

    colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(dotXStart + i * dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Inventory-related labels
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Armor', x + 10, y + 50);
    ctx.fillText('Stats', x + 10, y + 300);

    ctx.fillText('Inventory', x + sideBarWidth + 20, y + 20);
    ctx.fillText('Accessories', x + sideBarWidth + 20, y + 7*(slotSize+gapSize) + 90);

    // Crafting box
    const craftingX = x + iwidth * 0.6;
    const craftingY = y + 50;
    const craftingWidth = iwidth * 0.385;
    const craftingHeight = iheight - 70;

    ctx.fillStyle = 'rgba(64, 64, 64, 0.58)';
    drawRoundedBox(ctx,craftingX,craftingY,craftingWidth,craftingHeight,radius);
    ctx.fill();

    // Crafting label
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Crafting', craftingX + 15, craftingY + 25);

    // Descriptions
    hovering = false;
    function itemDescription(item) {
        if (item != "" && player.itemDrag.value == 0) {
            if (armorProperties[item]) {
                player.hoverText = `\\e${item}\\r\\a${findName(item)}
${findDesc(item)}
Protection: ${armorProperties[item].protection}`;
            } else if (accessoriesProperties[item]) {
                player.hoverText = `\\e${item}\\r\\a${findName(item)}
⊹ Accessory ⊹
${findDesc(item)}`;
            } else {
                player.hoverText = `\\e${item}\\r\\a${findName(item)}
${findDesc(item)}`;
            }
            return true;
        }
    }

    // Inventory items
    let xinvStart = x + sideBarWidth + 20;
    let yinvStart = y + 50;

    let mx = mouseX;
    let my = mouseY;

    ctx.font = '18px ' + useFont + ', Arial';
    for (let i = 0; i < player.inventory.length; i++) {
        for (let j = 0; j < player.inventory[i].length; j++) {
            // Compute per-slot position
            const slotX = xinvStart + j * (slotSize + gapSize);
            const slotY = yinvStart + i * (slotSize + gapSize);

            // Draw slot background
            ctx.fillStyle = 'rgba(160, 160, 160, 0.3)';
            drawRoundedBox(ctx, slotX, slotY, slotSize, slotSize, radius);

            // Detect hover
            if (mx >= slotX && mx <= slotX + slotSize &&
                my >= slotY && my <= slotY + slotSize) {

                if (itemDescription(player.inventory[i][j])) hovering = true;

                // Dragging item logic
                if ((leftClick || rightClick) && timeSinceDragging == 0) {
                    let item = player.itemDrag.item;
                    let value = player.itemDrag.value;
                    if (item == player.inventory[i][j] && !unstackable.includes(item)) {
                        player.inventoryValue[i][j] += value;
                        player.itemDrag.item = "";
                        player.itemDrag.value = 0;
                    } else {
                        player.itemDrag.item = player.inventory[i][j];
                        player.itemDrag.value = player.inventoryValue[i][j];
                        player.inventory[i][j] = item;
                        player.inventoryValue[i][j] = value;
                    }
                    player.hoverText = `${player.itemDrag.item}${player.itemDrag.value}`;
                    timeSinceDragging = 20;
                }
            }

            // Draw item
            const item = player.inventory[i][j];
            ctx.font = '18px ' + useFont + ', Arial';
            if (item) {
                ctx.fillStyle = 'white';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(item, slotX + 6, slotY + slotSize / 2);

                // Draw amount if more than 1
                const value = player.inventoryValue[i][j];
                if (value && value > 1) {
                    ctx.font = '14px Arial';
                    ctx.fillStyle = 'white';
                    ctx.fillText(value, slotX + slotSize - 12, slotY + slotSize - 8);
                }
            }
        }
    }

    // Accessory items
    let xaccStart = x + sideBarWidth + 20;
    let yaccStart = y + 7*(slotSize+gapSize) + 90 + 20;

    ctx.font = '18px ' + useFont + ', Arial';
    for (let i = 0; i < player.accessories.length; i++) {
        for (let j = 0; j < player.accessories[i].length; j++) {
            // Compute per-slot position
            const slotX = xaccStart + j * (slotSize + gapSize);
            const slotY = yaccStart + i * (slotSize + gapSize);

            // Draw slot background
            ctx.fillStyle = 'rgba(160, 160, 160, 0.3)';
            drawRoundedBox(ctx, slotX, slotY, slotSize, slotSize, radius);

            // Detect hover
            if (mx >= slotX && mx <= slotX + slotSize &&
                my >= slotY && my <= slotY + slotSize) {

                if (itemDescription(player.accessories[i][j])) hovering = true;

                // Dragging item logic
                if (
                    (leftClick || rightClick) && 
                    timeSinceDragging === 0 && 
                    (Object.hasOwn(accessoriesProperties, player.itemDrag.item) || player.itemDrag.item === "")
                ) {
                    let item = player.accessories[i][j];
                    if (player.itemDrag.value > 1) {
                        player.accessories[i][j] = player.itemDrag.item;
                        player.itemDrag.value--;
                    } else {
                        player.accessories[i][j] = player.itemDrag.item;
                        player.itemDrag.item = item;
                        if (item == "") {
                            player.itemDrag.value = 0;
                        } else {
                            player.itemDrag.value = 1;
                        }
                    }
                    player.hoverText = `${player.itemDrag.item}${player.itemDrag.value}`;
                    timeSinceDragging = 20;
                }
            }

            // Draw item
            const item = player.accessories[i][j];
            if (item) {
                ctx.fillStyle = 'white';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(item, slotX + 6, slotY + slotSize / 2);
            }
        }
    }

    // Armor slots
    let xarmor = x + 10;
    let yarmor = y + 70;
    for (let i = 0; i < player.armor.length; i++) {
        // Draw slot background
        ctx.fillStyle = 'rgba(104, 104, 104, 0.3)';
        drawRoundedBox(ctx, xarmor, yarmor, slotSize, slotSize, radius);

        // Detect hover
        if (mx >= xarmor && mx <= xarmor + slotSize &&
            my >= yarmor && my <= yarmor + slotSize) {

            if (itemDescription(player.armor[i])) hovering = true;

            // Dragging item logic (with slot validation)
            if (
                (leftClick || rightClick) &&
                timeSinceDragging === 0 &&
                (Object.hasOwn(armorProperties, player.itemDrag.item) || player.itemDrag.item === "")
            ) {
                // Check if the dragged item belongs in this slot
                const isValidSlot = (
                    player.itemDrag.item === "" ||
                    armorProperties[player.itemDrag.item]?.slot === i
                );

                if (isValidSlot) {
                    let item = player.armor[i];
                    if (player.itemDrag.value > 1) {
                        player.armor[i] = player.itemDrag.item;
                        player.itemDrag.value--;
                    } else {
                        player.armor[i] = player.itemDrag.item;
                        player.itemDrag.item = item;
                        player.itemDrag.value = (item === "") ? 0 : 1;
                    }
                    player.hoverText = `${player.itemDrag.item}${player.itemDrag.value}`;
                    timeSinceDragging = 20;
                } else {
                    // Show message here that it's the wrong slot
                }
            }
        }

        // Draw item and slot label
        const item = player.armor[i];
        ctx.font = '18px ' + useFont + ', Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        if (item) {
            ctx.fillText(item, xarmor + 6, yarmor + slotSize / 2);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Arial';
        ctx.fillText(
            ["Head", "Chest", "Legs", "Feet"][i] || `Slot ${i}`,
            xarmor + slotSize + 5,
            yarmor + slotSize / 2
        );

        yarmor += slotSize + gapSize;
    }

    // Crafting System
    const maxCraftingColumns = 8; // Items per row

    let currentX = craftingX + 10;
    let currentY = craftingY + 40;

    ctx.font = `18px ${useFont}, Arial`;

    const craftableColor = 'rgba(104, 104, 104, 0.3)';
    const uncraftableColor = 'rgba(198, 75, 75, 0.3)';

    let mergedCrafts = player.canCraft.concat(player.possiblyCraft);

    for (let i = 0; i < mergedCrafts.length; i++) {
        const col = i % maxCraftingColumns;
        const row = Math.floor(i / maxCraftingColumns);

        const xPos = currentX + col * (slotSize + gapSize);
        const yPos = currentY + row * (slotSize + gapSize);

        let canCraft;
        if (i < player.canCraft.length) {
            ctx.fillStyle = craftableColor;
            canCraft = true;
        } else {
            ctx.fillStyle = uncraftableColor;
            canCraft = false;
        }

        drawRoundedBox(ctx, xPos, yPos, slotSize, slotSize, radius);

        // Crafting logic
        if (mx >= xPos && mx <= xPos + slotSize &&
            my >= yPos && my <= yPos + slotSize) {

            // Description Text
            player.hoverText = `${mergedCrafts[i]} ${findName(mergedCrafts[i])}
${findDesc(mergedCrafts[i])}

Requirements:
${craftingDictionary[mergedCrafts[i]].itemsNeeded
                    .map((item, index) => `${craftingDictionary[mergedCrafts[i]].amountsNeeded[index]}×${item}`)
                    .join(', ')}
${craftingDictionary[mergedCrafts[i]].required
                    ? `\nRequired Tool: ${craftingDictionary[mergedCrafts[i]].required}`
                    : ''}`;
            hovering = true;

            // Clicking
            if ((leftClick || rightClick) && timeSinceDragging == 0) {
                timeSinceDragging = 25;
                if (canCraft) {
                    // Remove ingredients
                    const recipe = craftingDictionary[mergedCrafts[i]];

                    for (let i = 0; i < recipe.itemsNeeded.length; i++) {
                        removeInventory(recipe.itemsNeeded[i], recipe.amountsNeeded[i]);
                    }

                    addInventory(mergedCrafts[i], 1);
                }
            }
        }

        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(mergedCrafts[i], xPos + 6, yPos + slotSize / 2);
    }

    ctx.restore();
}