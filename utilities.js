var utils = require('utils')

class Utils {
 miner(creep, sourceIndex) {
    const roomMemory = Memory.rooms[creep.room.name];
    const energySources = utils.inflate(roomMemory.sources);
    if (creep.harvest(energySources[sourceIndex]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(energySources[sourceIndex]);
    }
  }

  pickupEnergyHaul(creep) {
    const carryCapacity = creep.store.getCapacity(RESOURCE_ENERGY);
    const currentCarry = creep.store[RESOURCE_ENERGY] || 0;
    const energyNeeded = carryCapacity - currentCarry;

    if (creep.memory.energyTargetId) {
      const target = Game.getObjectById(creep.memory.energyTargetId);

      if (target && target.amount > 0) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
  reusePath: 5, 
});
        }
        return;
      } else {
        creep.memory.energyTargetId = null;
      }
    }

const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);
    const enoughEnergyDrops = droppedEnergy.filter(res => res.amount >= energyNeeded);

    let target = null;

    if (enoughEnergyDrops.length > 0) {
      target = creep.pos.findClosestByRange(enoughEnergyDrops);
    } else if (droppedEnergy.length > 0) {
      target = droppedEnergy.reduce((max, res) =>
        res.amount > max.amount ? res : max, droppedEnergy[0]);
    }

    if (target) {
      creep.memory.energyTargetId = target.id;
      if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
  reusePath: 5, 
});
      }
    }
  }

  pickupEnergy(creep) {
    const roomMemory = Memory.rooms[creep.room.name];
    const carryCapacity = creep.store.getCapacity(RESOURCE_ENERGY);
    const currentCarry = creep.store[RESOURCE_ENERGY] || 0;
    const energyNeeded = carryCapacity - currentCarry;

    if (energyNeeded <= 0) return;

    const storage = utils.inflate(roomMemory.storage);
    if (storage.length && storage[0].store[RESOURCE_ENERGY] > 0) {
      if (creep.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage[0], {
  reusePath: 5,
  visualizePathStyle: { stroke: '#ffaa00' }
});
      }
      return;
    }

    const containers = utils.inflate(roomMemory.recycleContainers);
    if (containers.length > 0) {
      const container = creep.pos.findClosestByRange(containers);
      if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {
  reusePath: 5, 
});
      }
      return;
    }



  const dropped = creep.room.find(FIND_DROPPED_RESOURCES);
    if (dropped.length > 0) {
      const closest = creep.pos.findClosestByRange(dropped);
      if (creep.pickup(closest) === ERR_NOT_IN_RANGE) {
        creep.moveTo(dropped, {
  reusePath: 5, 
});
      }
      return;
    }

    const restFlag = Game.flags["Rest1"];
    if (restFlag) creep.moveTo(restFlag);
  }

  pickupEnergyUpgrade(creep) {
    const roomMemory = Memory.rooms[creep.room.name];
    const carryCapacity = creep.store.getCapacity(RESOURCE_ENERGY);
    const currentCarry = creep.store[RESOURCE_ENERGY] || 0;
    const energyNeeded = carryCapacity - currentCarry;

    if (energyNeeded <= 0) return;

    const containers = utils.inflate(roomMemory.generalContainers);
    if (containers.length > 0) {
      const container = creep.pos.findClosestByPath(containers);
      if (container && creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return;
    }

    const storage = utils.inflate(roomMemory.storage);
    if (storage.length && storage[0].store[RESOURCE_ENERGY] > 0) {
      if (creep.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage[0], { visualizePathStyle: { stroke: '#00aaff' } });
      }
      return;
    }



const dropped = creep.room.find(FIND_DROPPED_RESOURCES);
    if (dropped.length > 0) {
      const closest = creep.pos.findClosestByPath(dropped);
      if (closest && creep.pickup(closest) === ERR_NOT_IN_RANGE) {
        creep.moveTo(closest, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
      return;
    }

    const restFlag = Game.flags["Rest1"];
    if (restFlag) creep.moveTo(restFlag);
  }

  deliverEnergy(creep) {
    const roomMemory = Memory.rooms[creep.room.name];
    const hasFiller = creep.room.find(FIND_MY_CREEPS)
      .some(c => c.memory.role === "filler");

    let target = null;

    if (hasFiller) {
      const storage = utils.inflate(roomMemory.storage);
      if (storage.length && storage[0].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        target = storage[0];
      }
    } else {
      const targets = utils.inflate([
        ...(roomMemory.spawns || []),
        ...(roomMemory.extensions || []),
        ...(roomMemory.towers || []),
        ...(roomMemory.recycleContainers || []),
        ...(roomMemory.storage ? [roomMemory.storage] : [])
      ]).filter(structure =>
        structure.store &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
      target = creep.pos.findClosestByPath(targets);
    }

    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
  reusePath: 3,
});
      }
      return;
    }

    const upgraders = creep.room.find(FIND_MY_CREEPS)
      .filter(c => c.memory.role === "upgrader");
    if (upgraders.length) {
      const closestUpgrader = creep.pos.findClosestByRange(upgraders);
      if (closestUpgrader) {
        if (creep.transfer(closestUpgrader, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                  creep.moveTo(target, {
  reusePath: 3,
});
        }
      }
    }
  }
  harvester(creep) {
    const roomMemory = Memory.rooms[creep.room.name];
    const myCreeps = Game.creeps;
    const haulers = Object.values(myCreeps).filter(c =>
      c.memory.role === "hauler" && c.room.name === creep.room.name
    );

    if (!creep.memory.sourceId) {
      const sources = utils.inflate(roomMemory.sources);
      const takenSourceIds = _.map(
        _.filter(Game.creeps, c =>
          c.memory.role === 'harvester' &&
          c.name !== creep.name &&
          c.memory.sourceId &&
          c.room.name === creep.room.name
        ),
        c => c.memory.sourceId
      );

      const availableSource = sources.find(source => !takenSourceIds.includes(source.id));
      creep.memory.sourceId = availableSource ? availableSource.id : sources[0].id;
    }

    const source = Game.getObjectById(creep.memory.sourceId);
    if (!source) {
      delete creep.memory.sourceId;
      return;
    }

    if (!haulers.length) {
      if (creep.store.getFreeCapacity() > 0) {
        const result = creep.harvest(source);
        if (result === ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      } else {
        this.deliverEnergy(creep);
      }
    } else {
      const result = creep.harvest(source);
      if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      } else if (result === OK) {
        const nearbyLink = creep.pos.findInRange(FIND_STRUCTURES, 1, {
          filter: s => s.structureType === STRUCTURE_LINK &&
                       s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        creep.drop(RESOURCE_ENERGY);
      }
    }
  }

upgrade(creep) {
  const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
  if (!creep.room.controller) return;

  // these bloody recursion loops break my CPU 
  if (!creep.memory._triedUpgrade) {
    creep.memory._triedUpgrade = true;

    if (creep.room.controller.ticksToDowngrade > 500 && sites.length > 0) {
      this.building(creep);
      return;
    }
  }

  const result = creep.upgradeController(creep.room.controller);
  if (result === ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller.pos, { maxRooms: 1 });
  }

  creep.memory._triedUpgrade = false;
}

building(creep) {
  const allSites = creep.room.find(FIND_CONSTRUCTION_SITES);
  const sortedSites = _.sortBy(allSites, site => site.structureType !== STRUCTURE_EXTENSION);
  const target = creep.pos.findClosestByPath(sortedSites);

  if (target) {
    if (creep.build(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
    } else {
      if ((target.structureType === STRUCTURE_WALL || target.structureType === STRUCTURE_RAMPART) &&
          target.hits < 10000) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    }
  } else if (creep.memory.role === "builder" && !creep.memory._triedUpgrade) {
    creep.memory._triedUpgrade = true;
    this.upgrade(creep);
    creep.memory._triedUpgrade = false;
  }
} 

  repair(creep) {
    if (!creep.memory.working) return;

    const roomMemory = Memory.rooms[creep.room.name];
    if (!roomMemory.wallRepairThreshold) {
      roomMemory.wallRepairThreshold = 10000;
    }

    const threshold = roomMemory.wallRepairThreshold;

    if (!creep.memory.mode) {
      creep.memory.mode = 'repair';
    }

    if (creep.memory.mode === 'repair') {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure =>
          structure.hits < structure.hitsMax &&
          structure.structureType !== STRUCTURE_WALL &&
          structure.structureType !== STRUCTURE_RAMPART
      });

      if (targets.length > 0) {
        targets.sort((a, b) => (a.hits / a.hitsMax) - (b.hits / b.hitsMax));
        if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      } else {
        creep.memory.mode = 'walls';
      }

      return;
    }

    if (creep.memory.mode === 'walls') {
      const walls = creep.room.find(FIND_STRUCTURES, {
        filter: s =>
          (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) &&
          s.hits < threshold
      });

      if (walls.length > 0) {
        walls.sort((a, b) => a.hits - b.hits);
        if (creep.repair(walls[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(walls[0]);
        }
      } else {
        roomMemory.wallRepairThreshold += 10000;
        creep.say(`⬆️ ${roomMemory.wallRepairThreshold}`);
        creep.memory.mode = 'repair';
      }

      return;
    }

    const flag = Game.flags["Rest1"];
    if (flag) {
      creep.moveTo(flag.pos);
      creep.say('💤');
    }
  }

  defend(creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length) {
      const target = creep.pos.findClosestByRange(hostiles);
      if (target && creep.attack(target) === ERR_NOT_IN_RANGE) creep.moveTo(target);
      return;
    }

    const onRampart = creep.pos.lookFor(LOOK_STRUCTURES)
      .some(s => s.structureType === STRUCTURE_RAMPART);
    if (onRampart) return;

    const ramparts = utils.inflate(Memory.rooms[creep.room.name].structures)
      .filter(s => s.structureType === STRUCTURE_RAMPART &&
                   !s.pos.lookFor(LOOK_CREEPS).length);

    if (ramparts.length) {
      const rampart = creep.pos.findClosestByRange(ramparts);
      if (rampart) creep.moveTo(rampart);
    }
  }
ranger(creep) {
  const flag = Game.flags.trio;
  if (!flag) {
    creep.say("huh");
    return;
  }

  if (creep.pos.roomName !== flag.pos.roomName) {
    creep.moveTo(flag, {
      visualizePathStyle: { stroke: '#ffaa00' },
      reusePath: 50,
      maxOps: 5000,
      maxRooms: 16
    });
    creep.rangedMassAttack();
    creep.say("move in!", true);
    return;
  }

  const enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
  const enemyStructures = creep.room.find(FIND_HOSTILE_STRUCTURES, {
    filter: s => s.structureType !== STRUCTURE_CONTROLLER
  });
  const enemies = enemyCreeps.concat(enemyStructures);
  if (enemies.length === 0) return;

  const dangerousEnemies = enemyCreeps.filter(e =>
    e.getActiveBodyparts(ATTACK) > 0 || e.getActiveBodyparts(RANGED_ATTACK) > 0
  );

  const hasAttack = creep.getActiveBodyparts(ATTACK) > 0;
  const hasRanged = creep.getActiveBodyparts(RANGED_ATTACK) > 0;
  let target = creep.pos.findClosestByRange(enemies);

  if (dangerousEnemies.length > 0) {
    const closestDanger = creep.pos.findClosestByRange(dangerousEnemies);
    const dist = creep.pos.getRangeTo(closestDanger);

    if (dist <= 3) {
      const fleePos = this.getFleePath(creep, closestDanger.pos, 3);
      if (fleePos.length > 0) {
        creep.moveTo(fleePos[0], { visualizePathStyle: { stroke: '#ff0000' } });
        creep.say("parry", true);
        creep.rangedAttack(closestDanger);
      } else {
        // fallback flee
        const dx = creep.pos.x - closestDanger.pos.x;
        const dy = creep.pos.y - closestDanger.pos.y;
        const fallbackPos = new RoomPosition(
          creep.pos.x + dx,
          creep.pos.y + dy,
          creep.room.name
        );
        creep.moveTo(fallbackPos);
        creep.say("fallback!", true);
      }
      return;
    }
  }

  if (hasRanged && target.structureType) {
    if (creep.pos.inRangeTo(target, 1)) {
      //creep.rangedMassAttack();
      creep.rangedAttack(target)
      creep.say("pew!", true);
    } else {
      creep.moveTo(target, {
        range: 1,
        visualizePathStyle: { stroke: '#ff8800' }
      });
      creep.say("move in!", true);
    }
  } else if (hasAttack) {
    if (creep.pos.isNearTo(target)) {
      creep.attack(target);
    } else {
      creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff' } });
      creep.say("move in!", true);
    }
  } else {
    if(creep.signController(creep.room.controller, "lol get cooked") == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
    }
  }
}

getFleePath(creep, enemyPos, desiredRange) {
  const positions = [];

  for (let dx = -desiredRange; dx <= desiredRange; dx++) {
    for (let dy = -desiredRange; dy <= desiredRange; dy++) {
      const x = creep.pos.x + dx;
      const y = creep.pos.y + dy;
      if (x < 0 || x > 49 || y < 0 || y > 49) continue;

      const pos = new RoomPosition(x, y, creep.room.name);
      if (pos.getRangeTo(enemyPos) >= desiredRange && this.isPositionWalkable(pos)) {
        positions.push(pos);
      }
    }
  }

  positions.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
  return positions;
}

isPositionWalkable(pos) {
  const terrain = Game.map.getRoomTerrain(pos.roomName);
  if (terrain.get(pos.x, pos.y) === TERRAIN_MASK_WALL) return false;

  const structures = pos.lookFor(LOOK_STRUCTURES);
  if (structures.some(s => OBSTACLE_OBJECT_TYPES.includes(s.structureType))) return false;

  const creeps = pos.lookFor(LOOK_CREEPS);
  if (creeps.length > 0) return false;

  return true;
}



healer(creep) {
  const flag = Game.flags.trio;
  if (!flag) {
    creep.say("huh");
    return;
  }

if (creep.pos.roomName !== flag.pos.roomName) {
  creep.moveTo(flag, {
    visualizePathStyle: { stroke: '#ffaa00' },
    reusePath: 50,
    maxOps: 5000,
    maxRooms: 16
  });
  creep.say("move in!", true);
  return;
}


  const myCreeps = creep.room.find(FIND_MY_CREEPS);

  if (!myCreeps || myCreeps.length === 0) {
    creep.heal(creep);
    creep.say("heal self", true);
    return;
  }
  if(creep.hits > creep.hitsMax) [
    creep.heal(creep)
  ]

  const rangedHealTarget = creep.pos.findInRange(myCreeps.filter(c => c.hits < c.hitsMax), 3).find(c => creep.pos.getRangeTo(c) > 1);
  if (rangedHealTarget) {
    creep.rangedHeal(rangedHealTarget);
  }

  const needsHeal = myCreeps.filter(c => c.hits < c.hitsMax);
  if (needsHeal.length > 0) {
    needsHeal.sort((a, b) => a.hits - b.hits);
    const target = needsHeal[0];
    if (creep.pos.isNearTo(target)) {
      creep.heal(target);
      creep.say("here!", true)
    } else {
      creep.moveTo(target);
      creep.say("move in!",true)
    }
  } else {
    const beserker = myCreeps.find(c => c.memory.role === 'beserker');
    const ranger = myCreeps.find(c => c.memory.role === 'ranger');
    if (beserker) {
      if (creep.pos.isNearTo(beserker)) {
        creep.heal(beserker);
        creep.say("here!", true)
      } else {
        creep.moveTo(beserker);
        creep.say("move in!")
      }
    } else if(ranger){
    if (creep.pos.isNearTo(beserker)) {
        creep.heal(beserker);
        creep.say("here!", true)
      } else {
        creep.moveTo(beserker);
        creep.say("move in!")
      }
    }
  }
}

beserker(creep) {
  const flag = Game.flags.trio;
  if (!flag) {
    creep.say("huh");
    return;
  }

if (creep.pos.roomName !== flag.pos.roomName) {
  creep.moveTo(flag, {
    visualizePathStyle: { stroke: '#ffaa00' },
    reusePath: 50,
    maxOps: 5000,
    maxRooms: 16
  });
  creep.say("move in!", true);
  return;
}


  const enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
    const enemyStructures = creep.room.find(FIND_STRUCTURES, {
    filter: struct => struct.structureType !== STRUCTURE_WALL
});
  const enemies = enemyCreeps.concat(enemyStructures);

  if (enemies.length) {
    const closestEnemy = creep.pos.findClosestByRange(enemies);
    if (creep.attack(closestEnemy) === ERR_NOT_IN_RANGE) {
      creep.moveTo(closestEnemy, { visualizePathStyle: { stroke: '#ff0000' } });
      creep.say("move in!", true);
    }
  } else {
    creep.say("yay", true);
  }
}
//fillers should only be rcl 4 and storage built, i might make a room rcl and building checker, and probably add some memory for improved CPU usage
filler(creep) {
  const storage = creep.room.find(FIND_MY_STRUCTURES).filter(
    structure => structure.structureType === STRUCTURE_STORAGE
  );

  if (storage.length === 0) {
    creep.say("huh");
    console.log("no storage for filler :(");
    return;
  }

  if (creep.store.getUsedCapacity() === 0) {
    const closestStorage = creep.pos.findClosestByRange(storage);
    if (creep.withdraw(closestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(closestStorage);
    }
    return;
  }

  const spawns = creep.room.find(FIND_MY_SPAWNS);
  const extensions = creep.room.find(FIND_MY_STRUCTURES).filter(
    structure => structure.structureType === STRUCTURE_EXTENSION
  );
  const towers = creep.room.find(FIND_MY_STRUCTURES).filter(
    structure => structure.structureType === STRUCTURE_TOWER
  );

  const fillTargets = spawns.concat(extensions, towers).filter(
    structure => structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  );

  let target = null;

  if (fillTargets.length > 0) {
    target = creep.pos.findClosestByRange(fillTargets);
  } else {
    const controller = creep.room.controller;
    const containersNearController = creep.room.find(FIND_STRUCTURES).filter(
      structure =>
        structure.structureType === STRUCTURE_CONTAINER &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
        structure.pos.inRangeTo(controller.pos, 6)
    );
    if (containersNearController.length > 0) {
      target = creep.pos.findClosestByRange(containersNearController);
    }
  }

  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  } else {
    creep.say("sleep", true);
  }
}
claim(creep) {
  var flag = Game.flags.claimRoom
  if(!flag) {
    creep.say("huh")
    return;
  }
  if (creep.pos.roomName !== flag.pos.roomName) {
    creep.moveTo(flag, {
      visualizePathStyle: { stroke: '#ffaa00' },
      reusePath: 50,
      maxOps: 5000,
      maxRooms: 16
    });
    return;
  }
  if(creep && creep.room && creep.room.controller) {
    if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller)
    } else {
      creep.signController(creep.room.controller, `${creep.room.name} is property of _TXR`);
    }
  }
}


}



module.exports = new Utils();  //create and export an instance