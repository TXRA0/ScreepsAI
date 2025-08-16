var roleMineralMiner = {
  run: function (creep, active, toolbox, source) {
    if (!active) return;

    function isCarryingMinerals(creep) {
      return Object.keys(creep.store).some(resource =>
        resource !== RESOURCE_ENERGY && creep.store[resource] > 0
      );
    }

    function hasFreeCapacityForMinerals(creep) {
      return creep.store.getFreeCapacity() > 0;
    }

    if (isCarryingMinerals(creep) && !hasFreeCapacityForMinerals(creep)) {
      creep.memory.working = true;
    } else {
      creep.memory.working = false;
    }

    if (creep.memory.working) {
      const terminal = creep.room.terminal;
      if (terminal) {
        for (const resource in creep.store) {
          if (resource !== RESOURCE_ENERGY && creep.store[resource] > 0) {
            if (creep.transfer(terminal, resource) === ERR_NOT_IN_RANGE) {
              creep.moveTo(terminal);
            }
            break;
          }
        }
      }
    } else {
      const mineral = creep.room.find(FIND_MINERALS)[0];
      if (mineral && mineral.mineralAmount > 0) {
        if (creep.harvest(mineral) === ERR_NOT_IN_RANGE) {
          creep.moveTo(mineral);
        }
      }
    }
  }
};

module.exports = roleMineralMiner;