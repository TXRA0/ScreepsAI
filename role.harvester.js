var roleHarvester = {
  run: function (creep, active, toolbox, source) {
    if (active) {
      toolbox.harvester(creep)
    } else {
      // REST
      creep.moveTo(Game.flags.Rest1.pos, {
        visualizePathStyle: { stroke: "#00ffff" },
      });
      creep.say("💤", true);
    }
  },
};

module.exports = roleHarvester;
