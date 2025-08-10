/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('functions.spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
createCreep: function(options) {
  if (!options.extend) {
    options.extend = options.base;
  }

  let canSpend = options.canAffordOnly
    ? options.room.energyAvailable
    : options.room.energyCapacityAvailable;

  if (canSpend > options.cap) {
    canSpend = options.cap;
  }

  let creep = [...options.base]; // Clone base to avoid mutating it
  let add = true;

  while (add) {
    const costSoFar = this.creepCost(creep);
    const chunkCost = this.creepCost(options.extend);

    if (costSoFar + chunkCost > canSpend) {
      add = false;
    } else {
      creep = creep.concat(options.extend);
    }
  }

  return creep;
},


  creepCost: function(creep){
    var cost = 0

    for(var part in creep){
      cost += BODYPART_COST[creep[part]]
    }

    return cost
  },
buildCreep: function(action, room){
  if (!room) {
    console.log("Error: room is undefined in buildCreep");
    return;
  }

  var creepDesign = this.createCreep({
    base: this.baseDesign[action],
    room: room,
    canAffordOnly: true,
    cap: this.caps[action]
  });

var spawns = room.find(FIND_MY_SPAWNS);
var spawn = spawns.find(s => !s.spawning);

if (spawn) {
  spawn.spawnCreep(creepDesign, `Creep_${Game.time}`, {
    memory: {
      role: action,
      working: false,
      origin: { name: room.name }
    }
  });
}

},


  baseDesign: {
    harvester: [WORK, WORK, CARRY, MOVE],
    upgrader: [WORK, WORK, CARRY, MOVE],
    hauler: [CARRY, CARRY, MOVE, MOVE],
    builder: [WORK, WORK, CARRY, MOVE],
    repairer: [WORK, CARRY, MOVE, MOVE],
    defender: [ATTACK, MOVE],
    ranger: [RANGED_ATTACK, MOVE],
    healer: [MOVE, HEAL],
    beserker: [ATTACK, MOVE],
    filler: [CARRY, CARRY, MOVE, MOVE],
    claimer: [MOVE, CLAIM],
    pioneer: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  },

  caps: {
    harvester: 900,
    upgrader: 800,
    hauler: 750,
    builder: 1200,
    repairer: 800,
    defender: 130,
    ranger: 1000,
    healer: 900,
    beserker: 650,
    filler: 1500,
    claimer: 650,
    pioneer: 1200,
  }
}