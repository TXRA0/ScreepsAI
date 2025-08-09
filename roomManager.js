/*
✅ Priority 1: Room Manager System
  - [ ] Create `roomManager.js`
  - [ ] Track room state: energy, controller level, construction, threats
  - [ ] Dynamically determine needed creeps per role:
        • Use room state (construction, damage, hostiles, energy)
        • Adjust desired role counts (e.g. more builders if sites exist)
        • Compare desired vs actual; request missing roles for spawn
 */

// roomManager.js
const roomManager = {
    // Main function to analyze a room and request spawns
    roomStateChecker: function(room) {
        const state = {
            energyAvailable: room.energyAvailable,
            energyCapacity: room.energyCapacityAvailable,
            controllerLevel: room.controller ? room.controller.level : 0,
            constructionSites: room.find(FIND_CONSTRUCTION_SITES),
            hostiles: room.find(FIND_HOSTILE_CREEPS),
            damagedStructures: room.find(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax
            }),
            sources: room.find(FIND_SOURCES)
        };

        // Store in Memory
        Memory.rooms[room.name] = Memory.rooms[room.name] || {};
        Memory.rooms[room.name].state = state;

        // === Determine Desired Creeps per Role ===
        const desired = {
            harvester: 2, // base
            hauler: this.calculateNeededHaulers(room),
            builder: state.constructionSites.length > 0 ? 2 : 0,
            upgrader: state.controllerLevel < 8 ? 2 : 1,
            defender: state.hostiles.length > 0 ? 2 : 0,
            attacker: 0 // can add conditions later
        };

        // === Compare vs Current Creeps ===
        const counts = _.countBy(
            _.filter(Game.creeps, c => c.memory.room === room.name),
            c => c.memory.role
        );

        for (let role in desired) {
            if ((counts[role] || 0) < desired[role]) {
                this.requestSpawn(room, role);
            }
        }
    },

    // === Calculate Needed Haulers ===
    calculateNeededHaulers: function(room) {
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        if (!spawn) return 0;

        let totalCarryParts = 0;

        room.find(FIND_SOURCES).forEach(source => {
            const path = room.findPath(spawn.pos, source.pos, { ignoreCreeps: true });
            const carryPartsNeeded = Math.ceil((path.length * 2 * 10) / 50); 
            totalCarryParts += carryPartsNeeded;
        });

        const carryPerHauler = 6;
        return Math.ceil(totalCarryParts / carryPerHauler);
    },

    requestSpawn: function(room, role) {
        if(!Memory.spaw)
        Memory.spawnQueue = Memory.spawnQueue || [];
        Memory.spawnQueue.push({
            room: room.name,
            role: role,
            priority: this.getSpawnPriority(role)
        });
    },

    getSpawnPriority: function(role) {
        const priorities = {
            harvester: 1,
            hauler: 2,
            defender: 3,
            builder: 4,
            upgrader: 5,
            attacker: 6
        };
        return priorities[role] || 10;
    }
};

module.exports = roomManager;
