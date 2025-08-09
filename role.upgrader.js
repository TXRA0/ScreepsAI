var roleUpgrader = {
  run: function (creep, active, toolbox, source) {
    if (active) {
      if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
        // UPGRADE OFF
        creep.memory.working = false;
      }

      if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
        // UPGRADE ON
        creep.memory.working = true;
      }

      if (creep.memory.working) {
        toolbox.upgrade(creep, source)
      } else {
        // MINE
        toolbox.pickupEnergyUpgrade(creep, source);
      }
    } else {
      // REST
      creep.say("💤", true);
      creep.moveTo(Game.flags.Rest1.pos, {
        visualizePathStyle: { stroke: "#00ffff" },
      });
    }
  },
};

module.exports = roleUpgrader;
