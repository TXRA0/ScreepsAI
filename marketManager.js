const marketManager = {
    sellHighest: function(roomName, resourceType) {
        const room = Game.rooms[roomName];
        if (!room || !room.terminal) return;

        const terminal = room.terminal;
        const amountToSell = terminal.store[resourceType];
        if (!amountToSell) return;

        const orders = Game.market.getAllOrders(function(order) {
            return order.type === ORDER_BUY &&
                   order.resourceType === resourceType &&
                   order.remainingAmount > 0;
        });

        if (!orders.length) {
            console.log(`[marketManager] ${roomName}: No BUY orders for ${resourceType}`);
            return;
        }

        let bestOrder = orders[0];
        for (let i = 1; i < orders.length; i++) {
            if (orders[i].price > bestOrder.price) {
                bestOrder = orders[i];
            }
        }

        const amount = Math.min(bestOrder.remainingAmount, amountToSell);
        const result = Game.market.deal(bestOrder.id, amount, roomName);
        console.log(`[marketManager] ${roomName}: Sold ${amount} ${resourceType} @ ${bestOrder.price} → Order ${bestOrder.id} | Result: ${result}`);
    },

    buyLowest: function(roomName, resourceType, targetAmount = 1000) {
        const room = Game.rooms[roomName];
        if (!room || !room.terminal) return;

        const terminal = room.terminal;
        const currentAmount = terminal.store[resourceType] || 0;
        if (currentAmount >= targetAmount) return;

        const orders = Game.market.getAllOrders(function(order) {
            return order.type === ORDER_SELL &&
                   order.resourceType === resourceType &&
                   order.remainingAmount > 0;
        });

        if (!orders.length) {
            console.log(`[marketManager] ${roomName}: No SELL orders for ${resourceType}`);
            return;
        }

        let bestOrder = orders[0];
        for (let i = 1; i < orders.length; i++) {
            if (orders[i].price < bestOrder.price) {
                bestOrder = orders[i];
            }
        }

        const amount = Math.min(bestOrder.remainingAmount, targetAmount - currentAmount);
        const result = Game.market.deal(bestOrder.id, amount, roomName);
        console.log(`[marketManager] ${roomName}: Bought ${amount} ${resourceType} @ ${bestOrder.price} ← Order ${bestOrder.id} | Result: ${result}`);
    },

run: function() {
    for (const name in Game.rooms) {
        const room = Game.rooms[name];
        console.log(`[marketManager] Tick ${Game.time}: Checking room ${room.name}`);

        if (!room.terminal) {
            console.log(`[marketManager] ${room.name} has no terminal`);
            continue;
        }

        const minerals = room.find(FIND_MINERALS);
        if (minerals.length === 0) {
            console.log(`[marketManager] ${room.name} has no minerals`);
            continue;
        }

        const nativeMineral = minerals[0].mineralType;
        const nativeAmount = room.terminal.store[nativeMineral] || 0;
        console.log(`[marketManager] ${room.name} has ${nativeAmount} ${nativeMineral} in terminal`);

        if (nativeAmount > 0) {
            marketManager.sellHighest(room.name, nativeMineral);
        }

        for (const mineralType in RESOURCES_ALL) {
            if (!RESOURCES_ALL.includes(mineralType)) continue; 
            if (mineralType === nativeMineral) continue; 

            const amount = room.terminal.store[mineralType] || 0;
            if (amount < 1000) {
                console.log(`[marketManager] ${room.name} wants ${mineralType}, has ${amount}`);
                marketManager.buyLowest(room.name, mineralType, 1000 - amount);
            }
        }

        break; 
    }
}
};

module.exports = marketManager;