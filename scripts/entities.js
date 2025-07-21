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

    update(map) {
        // Decrease cooldown before next wander
        if (this.wanderCooldown > 0) {
            this.wanderCooldown--;
        } else {
            // Try to move in a random direction
            let directions = [
                { dx: 0, dy: -.5 },
                { dx: 0, dy: .5 },
                { dx: -.5, dy: 0 },
                { dx: .5, dy: 0 }
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

            // Reset cooldown
            this.wanderCooldown = Math.floor(Math.random() * 100) + 50;
        }
    }

    draw(ctx,mapX,mapY) {
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐓", mapX, mapY);
    }
}