var rolePioneer = {
  run: function (/** @type {any} */ creep, /** @type {any} */ active, /** @type {{ pioneer: (arg0: any) => void; }} */ toolbox, /** @type {any} */ source) {
     var flag = Game.flags.supportRoom
  if(!flag) {
    creep.say("huh")
    return;
  }
  if (creep.pos.roomName !== flag.pos.roomName) {
    creep.moveTo(flag, {
      reusePath: 50,
      maxOps: 5000,
      maxRooms: 16
    });
    return;
  }
  if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.working = true;
  }
  if (creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.working = false;
  }
  if(creep.memory.working == false) {
    toolbox.miner(creep, 0)
  } else if(creep.memory.working == true) {
    toolbox.building(creep)
  }
  }
}
module.exports = rolePioneer;