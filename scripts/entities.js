class Mob {
    constructor(type, x, y, id) {
        this.type = type;

        // Specific properties
        this.health = entityProperties[this.type].health;
        this.aquatic = entityProperties[this.type].aquatic;
        this.beach = entityProperties[this.type].beach;
        this.hostile = entityProperties[this.type].hostile;
        this.pet = entityProperties[this.type].pet;
        this.damage = entityProperties[this.type].damage ?? 1;

        // Universal properties
        this.x = x;
        this.y = y;
        this.id = id;

        this.lootTable = entityProperties[this.type].loot;
        this.wanderCooldown = Math.floor(Math.random() * 100) + 50; // frames until next move
        this.hasTarget = false;
        this.targetX = null;
        this.targetY = null;
        this.attackCooldown = 0;
    }

    takeDamage(amount) {
        if (this.attackCooldown > 0) return;
        this.health -= amount;
        this.attackCooldown = 20; // frames until can be hit again
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        if (!this.lootTable) return;

        const droppedItems = {};

        // Calculate drops with chance consideration
        for (const loot of this.lootTable) {
            if (Math.random() <= loot.chance) {
                const count = Math.floor(Math.random() * (loot.max - loot.min + 1)) + loot.min;
                if (loot.item && loot.item !== "") {
                    droppedItems[loot.item] = (droppedItems[loot.item] || 0) + count;
                }
            }
        }

        // Add drops to inventory
        if (typeof addInventory === "function") {
            for (const [item, amount] of Object.entries(droppedItems)) {
                addInventory(item, amount);
            }
        }

        // Remove this mob from gameData.entities by unique id
        for (let i = 0; i < gameData.entities[String(player.level)].length; i++) {
            if (gameData.entities[String(player.level)][i]["id"] === this.id) {
                gameData.entities[String(player.level)].splice(i, 1);
                break;
            }
        }
    }

    // Call this to set a target
    setTarget(x, y) {
        this.hasTarget = true;
        this.targetX = x;
        this.targetY = y;
    }

    clearTarget() {
        this.hasTarget = false;
        this.targetX = null;
        this.targetY = null;
    }

    target(targetX, targetY, map) {
        try {
            // Calculate direction vector
            let dx = targetX - this.x;
            let dy = targetY - this.y;

            // Prevent jitter: if very close to target, don't move
            if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
                return;
            }

            // Using atan2 for optimal angle
            let angle = Math.atan2(dy, dx);
            let step = 0.1;
            if (water.includes(map[Math.round(this.x)][Math.round(this.y)]) && !this.aquatic) {
                step = 0.02;
            }
            let moveX = Math.cos(angle) * step;
            let moveY = Math.sin(angle) * step;

            // Try optimal direction first, then fallback to axis-aligned and diagonal alternatives
            let candidates = [
                { dx: moveX, dy: moveY },
                { dx: Math.sign(dx) * step, dy: 0 },
                { dx: 0, dy: Math.sign(dy) * step },
                { dx: -moveX, dy: moveY },
                { dx: moveX, dy: -moveY },
                { dx: -moveX, dy: -moveY }
            ];

            let moved = false;
            for (let dir of candidates) {
                let newX = this.x + dir.dx;
                let newY = this.y + dir.dy;
                // Prevent negative coordinates
                if (newX < 0 || newY < 0) continue;
                let tile = map[Math.round(newX)][Math.round(newY)];

                // Aquatic mobs: only move in water; Non-aquatic: only move on land
                if (this.aquatic) {
                    if (
                        (objectProperties[tile]?.canBeWalkedOn || water.includes(tile)) &&
                        water.includes(tile)
                    ) {
                        this.x = Math.max(0, newX);
                        this.y = Math.max(0, newY);
                        moved = true;
                        break;
                    }
                } 
                // Beach mobs
                else if (this.beach) {
                    if (
                        (objectProperties[tile]?.canBeWalkedOn || sand.includes(tile)) &&
                        sand.includes(tile)
                    ) {
                        this.x = Math.max(0, newX);
                        this.y = Math.max(0, newY);
                        moved = true;
                        break;
                    }
                } 
                else {
                    if (
                        (objectProperties[tile]?.canBeWalkedOn || tile == "" || tile == " ") &&
                        !water.includes(tile)
                    ) {
                        this.x = Math.max(0, newX);
                        this.y = Math.max(0, newY);
                        moved = true;
                        break;
                    }
                }
            }
            // If all directions blocked, pick a new random target
            if (!moved) {
                let target = donutRadius(this.x, this.y, 5, 2);
                this.setTarget(target[0], target[1]);
            }
        } catch (err) {
            console.log("Mob.target error:", err);
        }
    }

    update(map) {
        try {
            // Decrease attack cooldown
            if (this.attackCooldown > 0) this.attackCooldown--;

            // Decrease cooldown before next wander or target move
            if (this.wanderCooldown > 0) {
                this.wanderCooldown--;
            } else {
                if (this.hasTarget && this.targetX !== null && this.targetY !== null) {
                    // Move towards target
                    this.target(this.targetX, this.targetY, map);
                    // Optionally clear target if reached (within 0.2 units)
                    if (Math.abs(this.x - this.targetX) < 0.2 && Math.abs(this.y - this.targetY) < 0.2) {
                        this.clearTarget();
                    }
                } else {
                    // Wander randomly
                    let directions = [
                        { dx: 0, dy: -.2 },
                        { dx: 0, dy: .2 },
                        { dx: -.2, dy: 0 },
                        { dx: .2, dy: 0 }
                    ];
                    let dir = directions[Math.floor(Math.random() * directions.length)];
                    let newX = this.x + dir.dx;
                    let newY = this.y + dir.dy;
                    // Prevent negative coordinates
                    if (newX < 0 || newY < 0) {
                        // Don't move if would go negative
                    } else {
                        let tile = map[Math.round(newX)] && map[Math.round(newX)][Math.round(newY)];

                        if (this.aquatic) {
                            if (
                                map[Math.round(newX)] &&
                                map[Math.round(newX)][Math.round(newY)] &&
                                water.includes(tile)
                            ) {
                                this.x = Math.max(0, newX);
                                this.y = Math.max(0, newY);
                            }
                        } else {
                            if (
                                map[Math.round(newX)] &&
                                map[Math.round(newX)][Math.round(newY)] &&
                                !water.includes(tile)
                            ) {
                                this.x = Math.max(0, newX);
                                this.y = Math.max(0, newY);
                            }
                        }
                    }
                }
                // Reset cooldown
                this.wanderCooldown = Math.floor(Math.random() * 100) + 50;
            }
        } catch (err) {
            console.log("Mob.update error:", err);
        }
    }

    draw(ctx,mapX,mapY) {
        ctx.font = emojiSize + "px " + useFont + ", Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.type, mapX, mapY);
    }
}