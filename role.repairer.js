const hitsToRepair = 50000;

const roleRepairer = {
    run: function (creep, active, toolbox, source) {
        if (creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.working = false;
        }

        if (
            !creep.memory.working &&
            creep.store.getUsedCapacity(RESOURCE_ENERGY) === creep.store.getCapacity(RESOURCE_ENERGY)
        ) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            toolbox.repair(creep, source)
 
        } else {
            toolbox.pickupEnergy(creep);
        }
    }
};

module.exports = roleRepairer;
