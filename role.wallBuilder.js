var roleWallBuilder = {
  run: function (creep, active, toolbox, source) {
         if (!active) return;

    if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.working = true;
    }
    if (creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.working = false;
    }

    if (creep.memory.working) {
      toolbox.wallBuild(creep)
    } else {
      toolbox.pickupEnergy(creep);
    }
  }
}
module.exports = roleWallBuilder;