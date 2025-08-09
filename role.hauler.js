var roleHauler = {
  run: function (creep, active, toolbox, source) {
    if (!active) return;

    if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.working = true;
    }
    if (creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.working = false;
    }

    if (creep.memory.working) {
      toolbox.deliverEnergy(creep, source);
    } else {
      toolbox.pickupEnergyHaul(creep, source);
    }
  }
};

module.exports = roleHauler;
