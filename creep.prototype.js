

Creep.prototype.pickupEnergyHaul = function() {
    const creep = this;
    const carryCapacity = creep.store.getCapacity(RESOURCE_ENERGY);
    const currentCarry = creep.store[RESOURCE_ENERGY] || 0;
    const energyNeeded = carryCapacity - currentCarry;

    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter(
        resource => resource.resourceType === RESOURCE_ENERGY
    );

    console.log(`[${creep.name}] Found ${droppedEnergy.length} dropped energy items`);

    const enoughEnergyDrops = droppedEnergy.filter(resource => resource.amount >= energyNeeded);

    let target;

    if (enoughEnergyDrops.length > 0) {
        target = creep.pos.findClosestByRange(enoughEnergyDrops);
    } else if (droppedEnergy.length > 0) {
        target = droppedEnergy.reduce((max, resource) => (resource.amount > max.amount ? resource : max), droppedEnergy[0]);
    }

    if (target) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            console.log(`[${creep.name}] Moving toward dropped energy at ${target.pos}`);
            creep.moveTo(target);
        } else {
            console.log(`[${creep.name}] Picked up energy from ${target.pos}`);
        }
    } else {
        console.log(`[${creep.name}] No dropped energy found`);
    }
};
Creep.prototype.pickupEnergy = function() {
    const creep = this;
    const carryCapacity = creep.store.getCapacity(RESOURCE_ENERGY);
    const currentCarry = creep.store[RESOURCE_ENERGY] || 0;
    const energyNeeded = carryCapacity - currentCarry;

    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter(
        resource => resource.resourceType === RESOURCE_ENERGY
    );

    console.log(`[${creep.name}] Found ${droppedEnergy.length} dropped energy items`);

    const enoughEnergyDrops = droppedEnergy.filter(resource => resource.amount >= energyNeeded);

    let target;

    if (enoughEnergyDrops.length > 0) {
        target = creep.pos.findClosestByRange(enoughEnergyDrops);
    } else if (droppedEnergy.length > 0) {
        target = droppedEnergy.reduce((max, resource) => (resource.amount > max.amount ? resource : max), droppedEnergy[0]);
    }

    if (target) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else {
        }
    } else {
    }
};


// Extend Creep with deliverEnergy
Creep.prototype.deliverEnergy = function() {
    const creep = this;
    const targets = creep.room.find(FIND_MY_STRUCTURES).filter(
        structure =>
            [STRUCTURE_SPAWN, STRUCTURE_EXTENSION].includes(structure.structureType) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );

    const target = creep.pos.findClosestByPath(targets);

    if (target) {
        console.log(`[${creep.name}] Delivering energy to ${target.structureType} at ${target.pos}`);
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else {
            console.log(`[${creep.name}] Transferred energy to ${target.structureType}`);
        }
    } else {
        const container = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            structure.structureType === STRUCTURE_CONTAINER &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })[0];
        if(container) {
            if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container)
            }
      
        } else {
            const upgraders = creep.room.find(FIND_MY_CREEPS).filter(
                c => c.memory.role === "upgrader"
            );
            if(upgraders.length) {
                const closestUpgrader = creep.pos.findClosestByRange(upgraders)
                if(closestUpgrader) {
                    if(creep.transfer(closestUpgrader[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestUpgrader)
                    }
                }
            }
        }
    }
};


Creep.prototype.harvester = function() {
    const creep = this;
    const haulers = creep.room.find(FIND_MY_CREEPS).filter(c => c.memory.role === "hauler");
    console.log(`[${creep.name}] Found ${haulers.length} hauler(s)`);

    // Determine sourceId if not already set
    if (!creep.memory.sourceId) {
        const sources = creep.room.find(FIND_SOURCES);
        const takenSourceIds = _.map(
            _.filter(Game.creeps, c =>
                c.memory.role === 'harvester' &&
                c.name !== creep.name &&
                c.memory.sourceId
            ),
            c => c.memory.sourceId
        );

        const availableSource = sources.find(source => !takenSourceIds.includes(source.id));
        creep.memory.sourceId = availableSource ? availableSource.id : sources[0].id;
    }

    const source = Game.getObjectById(creep.memory.sourceId);

    if (!haulers.length) {
        const freecap = creep.store.getFreeCapacity();
        console.log(`[${creep.name}] Store free capacity: ${freecap}`);

        if (freecap > 0) {
            const result = creep.harvest(source);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            } else if (result === OK) {
                console.log(`[${creep.name}] Harvested energy`);
                creep.say("⛏️", true);
            } else {
                console.log(`[${creep.name}] Harvest failed with code ${result}`);
            }
        } else {
            console.log(`[${creep.name}] No capacity. Trying to deliver energy`);
            this.deliverEnergy();
        }
    } else {
        const result = creep.harvest(source);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else if (result === OK) {
            console.log(`[${creep.name}] Harvested energy`);
            creep.drop(RESOURCE_ENERGY);
            creep.say("⛏️", true);
        } else {
            console.log(`[${creep.name}] Harvest failed with code ${result}`);
        }
    }
};


Creep.prototype.upgrade = function() {
    const creep = this;
    creep.say("");

    const sites = creep.room.find(FIND_CONSTRUCTION_SITES);

    if (!creep.room.controller) {
        return;
    }

    if (creep.room.controller.ticksToDowngrade > 500 && sites.length > 0) {
        creep.building();
        return;
    }

    const result = creep.upgradeController(creep.room.controller);

    if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller.pos, { maxRooms: 1 });
    }
};



Creep.prototype.building = function() {
    const allSites = this.room.find(FIND_CONSTRUCTION_SITES);

    const sortedSites = _.sortBy(allSites, site => site.structureType !== STRUCTURE_EXTENSION);

    const close_target = this.pos.findClosestByPath(sortedSites);
    
    if (close_target) {
        if (this.build(close_target) == ERR_NOT_IN_RANGE) {
            this.moveTo(close_target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        var close_repair = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
        
        if (close_repair) {
            this.say('🚧', true);
            if (this.repair(close_repair) == ERR_NOT_IN_RANGE) {
                this.moveTo(close_repair, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}
