let isGeneratingWorld = false;

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
  
  return `EM${firstEmoji}Jℹ️   W${secondEmoji}RLD`;
}

// Load title screen
function loadScreen() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, width, height);

    // Title text
    ctx.fillStyle = "white";
    ctx.font = "bold 48px sans-serif";
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