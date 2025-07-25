var pets = ["🐶", "🐕‍🦺", "🦮", "🐩", "🐱", "🐈", "🐈‍⬛", "🐤", "🐥"];
var hostileMobs = ["🕷️", "🧟‍♀", "🧟‍♂", "🧛", "👻", "👿", "😈", "🛸"];

class Chicken {
    constructor(x, y) {
        this.type = "chicken";
        this.health = 3;
        this.x = x;
        this.y = y;

        this.lootTable = [
            { item: "🍗", min: 1, max: 2 },
            { item: "🪶", min: 1, max: 2 }
        ];
        this.wanderCooldown = Math.floor(Math.random() * 100) + 50; // frames until next move
        this.hasTarget = false;
        this.targetX = null;
        this.targetY = null;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        const drops = [];
        for (let loot of this.lootTable) {
            let count = Math.floor(Math.random() * (loot.max - loot.min + 1)) + loot.min;
            for (let i = 0; i < count; i++) {
                drops.push(loot.item);
            }
        }
        console.log(`Chicken dropped: ${drops.join(" ")}`);
        // You can later push drops into the world or player inventory here
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
        // Calculate direction vector
        let dx = targetX - this.x;
        let dy = targetY - this.y;

        // Use atan2 for optimal angle
        let angle = Math.atan2(dy, dx);
        let step = 0.1;
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

        for (let dir of candidates) {
            let newX = this.x + dir.dx;
            let newY = this.y + dir.dy;
            if (
                objectProperties[map[Math.round(newX)][Math.round(newY)]]?.canBeWalkedOn &&
                !water.includes(map[Math.round(newX)][Math.round(newY)])
            ) {
                this.x = newX;
                this.y = newY;
                return;
            }
        }
        // If all directions blocked, stay in place
    }

    update(map) {
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

                // Only move if destination is walkable and in bounds
                if (
                    map[Math.round(newX)] &&
                    map[Math.round(newX)][Math.round(newY)] &&
                    !water.includes(map[Math.round(newX)][Math.round(newY)]) // impassables
                ) {
                    this.x = newX;
                    this.y = newY;
                }
            }
            // Reset cooldown
            this.wanderCooldown = Math.floor(Math.random() * 100) + 50;
        }
    }

    draw(ctx,mapX,mapY) {
        ctx.font = emojiSize + "px " + useFont + ", Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐓", mapX, mapY);
    }
}