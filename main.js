const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const roleRepairer = require("role.repairer");
const roleHauler = require("role.hauler");
const roleDefender = require("role.defender");
const roleRanger = require("role.ranger");
const roleHealer = require("role.healer");
const roleBeserker = require("role.beserker");
const roleFiller = require("role.filler");
const roleClaimer = require("role.claimer")
const rolePioneer = require("role.pioneer")
const toolbox = require("./utilities");
const spawner = require("./functions.spawner");
const defcon = require("./defcon");
const hash = require('hash'); //latest addition
//╔══════════════════╗
//║ Global Variables ║
//╚══════════════════╝
const activated_harvesters = true;
const activated_haulers = true;
const activated_harvesters_external = false;
const activated_harvesters_mineral = false;
const activated_builders = true;
const activated_upgraders = true;
const activated_repairers = true;
const activated_notifiers = false;
const activated_attackers = false;
const activated_defenders = true;
const activated_explorers = false;
const activated_claimers = false;
const activated_fillers = true;
const activated_rangers = true;
const activated_healers = true;
const activated_beserkers = true;

const spawn_harvester = 2;
const spawn_hauler = 3;
const spawn_harvester_external = 0;
const spawn_harvester_mineral = 0;
const spawn_builder = 2;
const spawn_upgrader = 2;
const spawn_repair = 1;
const spawn_notifier = 0;
const spawn_attacker = 0;
const spawn_defender = 0;
const spawn_explorer = 0;
const spawn_claimer = 0;
const spawn_filler = 0;
const spawn_ranger = 1;
const spawn_healer = 1;
const spawn_beserker = 1;

// T = 1 roads, 2 plain, 10 swamp
// MOVE not generate fatigue
// empty CARRY not generate fatigue
// fatigue ? !move : move;

// F = T*n(S) + ?n(CARRY) - 2*n(MOVES)
// [WORK, CARRY, MOVE]
const model_harvesters = [WORK, WORK, CARRY, MOVE];
const model_haulers = [CARRY, MOVE, CARRY, MOVE]
const model_harvesters_external = [];
const model_harvesters_mineral = [];
const model_builders = [WORK, CARRY, MOVE];
const model_upgraders = [WORK, CARRY, MOVE];
const model_repairers = [WORK, CARRY, MOVE];
const model_notifiers = [];
const model_attackers = [];
const model_defenders = [];
const model_explorers = [];
const model_claimers = [];
const model_fillers = [];

const source_harvesters = 1;
const source_haulers = 1;
const source_upgraders = 1;
const source_builders = 0;
const source_repairers = 0;
const source_defenders = 0;
const source_pioneers = 0;

const pairedMessages = [
  ["hey", "yo"],
  ["back off", "try me"],
  ["sup?", "chillin"],
  ["lol", "same"],
  ["you good?", "yeah"],
  ["follow me", "on it"],
  ["zzz...", "wake up"],
  ["hey!", "hi!"],
  ["yo!", "hey!"],
  ["got time?", "sure"],
  ["brb", "ok"],
  ["go!", "let's go"],
  ["slow down", "move up"],
  ["gg", "wp"],
  ["nope", "yep"],
  ["wait", "now"],
  ["bye", "see ya"],
  ["why?", "idk"],
  ["lol vro 😂", "xd"],
  ["ok", "👍"],
];



module.exports.loop = function () {
    
if(!Memory.rooms) {
    Memory.rooms = {}
}
for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if(room && room.controller && room.controller.my) {
    drawRoomVisual(room);
    }
}
    for (const roomName in Game.rooms) {
        if(!Memory.rooms[roomName]) {
        Memory.rooms[roomName] = {};
        }
    }
  const creeps = Object.values(Game.creeps);
  const paired = new Set();

  for (let i = 0; i < creeps.length; i++) {
    const creepA = creeps[i];
    if (paired.has(creepA.name) || Math.random() > 0.6 || creepA.saying) continue;

    for (let j = i + 1; j < creeps.length; j++) {
      const creepB = creeps[j];
      if (paired.has(creepB.name) || creepB.saying) continue;

      if (creepA.pos.inRangeTo(creepB.pos, 2)) {
        const [msgA, msgB] = pairedMessages[Math.floor(Math.random() * pairedMessages.length)];
        creepA.say(msgA,true);
        creepB.say(msgB, true);
        paired.add(creepA.name);
        paired.add(creepB.name);
        break;
      }
    }
  }

    
    
    
  // ╔═════════╗
  // ║ CodeLab ║
  // ╚═════════╝
  try {
  } catch (error) {
    console.log(error);
  }
for (const roomName in Game.rooms) {
  const room = Game.rooms[roomName];
  if (room.controller && room.controller.my) {
    if (!Memory.rooms[roomName]) Memory.rooms[roomName] = {};

  // ╔══════════╗
  // ║ Watchers ║
  // ╚══════════╝
const total_harvesters = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "harvester" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_builders = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "builder" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_upgraders = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "upgrader" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_repairers = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "repairer" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_haulers = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "hauler" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_defenders = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "defender" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_rangers = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "ranger" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_healers = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "healer" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_beserkers = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "beserker" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);

const total_filler = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "filler" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);
const total_claimer = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "claimer" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);
const total_pioneers = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "pioneer" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);


  // ╔═════════╗
  // ║ Loggers ║
  // ╚═════════╝
  for (const name in Game.rooms) {
    console.log(`╔════════════════════════════════════════════════`);
    console.log(`║─┤Room "${name}"`);
    console.log(`║─┤Total Energy: ${Game.rooms[name].energyAvailable}`);
    console.log(
      `║─┤Slots per Creep: ${Math.floor(Game.rooms[name].energyAvailable / 50)}`
    );
    console.log(`║─┤⛏️ Harvesters: ${total_harvesters.length}`);
    console.log(`║─┤🔨 Builders: ${total_builders.length} `);
    console.log(`║─┤🔺 Upgraders: ${total_upgraders.length}`);
    console.log(`║─┤🔧 Repairers: ${total_repairers.length}`);
    console.log(`║─┤� Haulers: ${total_haulers.length}`);
    console.log(`╚════════════════════════════════════════════════`);
  }
  defcon.run(room)

  // ╔════════════════╗
  // ║ Memory Cleaner ║
  // ╚════════════════╝
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      console.log(`Clearing non-existing creep memory: ${name}`);
      delete Memory.creeps[name];
    }
  }

  // ╔═════════════════╗
  // ║ Notify Spawning ║
  // ╚═════════════════╝
for (const spawnName in Memory.spawns) {
    const spawn = Memory.spawns[spawnName];
    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        const msg = `Spawning: ${spawningCreep.memory.role}`;
        spawn.room.visual.text(
            msg,
            spawn.pos.x,
            spawn.pos.y + 1.5,
            { align: "center", opacity: 0.8 }
        );
    }
}


  // ╔═══════════════════╗
  // ║ Harvester Spawner ║
  // ╚═══════════════════╝
  if (total_harvesters.length < spawn_harvester) {
    const newName = `Harvester${Game.time}`;
    console.log(`Spawning new harvester: ${newName}`);
    spawner.buildCreep('harvester', room);
  }

  // ╔══════════════════╗
  // ║  Hauler Spawner  ║
  // ╚══════════════════╝
  else if (total_haulers.length < spawn_hauler) {
    const newName = `Hauler${Game.time}`;
    console.log(`Spawning new hauler: ${newName}`);
    spawner.buildCreep('hauler', room);
  }
// ╔══════════════════╗
// ║ TRIO Flag Logic  ║
// ╚══════════════════╝
if (1 < 0) {
    if (total_rangers.length < spawn_ranger) {
        const newName = `Ranger${Game.time}`;
        console.log(`Spawning new ranger: ${newName}`);
        spawner.buildCreep('ranger', room);
    } else if (total_healers.length < spawn_healer) {
        const newName = `Healer${Game.time}`;
        console.log(`Spawning new healer: ${newName}`);
        spawner.buildCreep('healer', room);
    } else if (total_beserkers.length < spawn_beserker) {
        const newName = `Beserker${Game.time}`;
        console.log(`Spawning new beserker: ${newName}`);
        spawner.buildCreep('beserker', room);
    }
}
if(Game.flags.claimRoom) {
    if(total_claimers.length < 1) {
        spawner.buildCreep('claimer', room);
    }
}
if(Game.flags.supportRoom) {
    if(total_pioneers.length < 3) {
        spawner.buildCreep('pioneer', room)
    }
}
    
var defconLevel = Number(
    Memory.defcon &&
    Memory.defcon[room.name] &&
    Memory.defcon[room.name].defcon
);

if (defconLevel >= 1) {

    if(defconLevel == 1) {
         var spawn_defender = 1;
    } else if(defconLevel == 2) {
         var spawn_defender = 2;
    } else if(defconLevel == 3) {
         var spawn_defender = 4;
    } else if(defconLevel == 4) {
         var spawn_defender = 6;
    }

    if (!Array.isArray(total_defenders)) {
    } else {

        if (total_defenders.length < spawn_defender) {
            console.log(`🚨 Spawning a new defender in room ${room.name}`);
                spawner.buildCreep('defender', room);
        }
    }
}

  // ╔═════════════════╗
  // ║ Builder Spawner ║
  // ╚═════════════════╝
  else if (total_builders.length < spawn_builder) {
    const newName = `Builder${Game.time}`;
    console.log(`Spawning new builder: ${newName}`);
    spawner.buildCreep('builder', room);
  }

  // ╔══════════════════╗
  // ║ Upgrader Spawner ║
  // ╚══════════════════╝
  else if (total_upgraders.length < spawn_upgrader) {
    const newName = `Upgrader${Game.time}`;
    console.log(`Spawning new upgrader: ${newName}`);
    spawner.buildCreep('upgrader', room);
  } else if (total_repairers.length < spawn_repair) {
  const newName = `Repairer${Game.time}`;
  console.log(`Spawning new repairer: ${newName}`);
  spawner.buildCreep('repairer', room);
} else if(room.controller.level >= 4 && room.storage) {
      const spawn_filler = 1;
      if(total_filler.length < spawn_filler) {
        const newName = `Filler${Game.time}`;
        console.log(`Spawning new filler: ${newName}`);
        spawner.buildCreep('filler', room);
      }
      
  }

  // ╔══════════════════╗
  // ║ Repairer Spawner ║
  // ╚══════════════════╝

  // ╔══════════════════╗
  // ║ Tower Management ║
  // ╚══════════════════╝
var towers = room.find(FIND_MY_STRUCTURES).filter(
    s => s.structureType === STRUCTURE_TOWER
);

towers.forEach(tower => {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
        tower.attack(closestHostile);
    } else {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                if (structure.structureType === STRUCTURE_RAMPART) {
                    return structure.hits < structure.hitsMax * 0.001;
                }
                return false;
            },
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        } else {
            const damagedCreeps = tower.room.find(FIND_MY_CREEPS).filter(
                c => c.hits < c.hitsMax
            )
            if(damagedCreeps) {
                var closest = tower.pos.findClosestByRange(damagedCreeps)
                tower.heal(closest)
            }
        }
    }
});
}
  // ╔═════════════════╗
  // ║ Role Assignment ║
  // ╚═════════════════╝
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        roleHarvester.run(
          creep,
          activated_harvesters,
          toolbox,
          source_harvesters
        );
        break;
      case 'pioneer':
         rolePioneer.run(
          creep,
          true,
          toolbox,
          source_pioneers,
        );
         break
      case "hauler":
        roleHauler.run(
          creep,
          activated_haulers,
          toolbox,
          source_haulers
        );
        break;
       case 'harvester_external':
       	roleHarvesterExternal.run(creep, activated_harvesters);
       	break;
       case 'harvester_mineral':
       	roleHarvesterMineral.run(creep, activated_harvesters);
       	break;
      case "upgrader":
        roleUpgrader.run(creep, activated_upgraders, toolbox, source_upgraders);
        break;
      case "builder":
        roleBuilder.run(creep, activated_builders, toolbox, source_builders);
        break;
      case 'repairer':
       	roleRepairer.run(creep, activated_repairers, toolbox, source_repairers);
       	break;
       case 'defender':
       	roleDefender.run(creep, activated_defenders, toolbox, source_defenders);
       	break;
       case 'attacker':
       	roleAttacker.run(creep);
       	break;
       case 'claimer':
       	roleClaimer.run(creep, true, toolbox);
       	break;
       case 'filler':
       	roleFiller.run(creep, activated_fillers, toolbox);
       	break;
       case 'explorer':
       	roleExplorer.run(creep);
       	break;
       case 'ranger':
       	roleRanger.run(creep, activated_rangers, toolbox);
       	break
       case 'healer':
       	roleHealer.run(creep, activated_healers, toolbox);
       	break
       case 'beserker':
       	roleBeserker.run(creep, activated_beserkers, toolbox);
       	break
    }
  }

}
};

function drawRoomVisual(room) {
    if (!room) return;

    const visual = room.visual;

    const desiredCounts = {
        harvester: 2,
        hauler: 3,
        builder: 2,
        upgrader: 2,
        repairer: 1,
        defender: 0,
        filler: 1,
    };

    const currentCounts = {};
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.room.name !== room.name) continue;
        const role = creep.memory.role || 'unknown';
        currentCounts[role] = (currentCounts[role] || 0) + 1;
    }

    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    const controller = room.controller;
    const energy = room.energyAvailable;
    const maxEnergy = room.energyCapacityAvailable;


    // Visual position
    const x = 38.5;
    const y = 1.5;
    const width = 10;
    const height = 14;

    visual.rect(x, y, width, height, {
        fill: '#000',
        opacity: 0.5,
        stroke: '#ffffff',
        strokeWidth: 0.1
    });

    const print = (text, offsetY, color = '#ffffff') => {
        visual.text(text, x + 0.3, y + 0.8 + offsetY, {
            align: 'left',
            color,
            font: '0.9 Trebuchet MS'
        });
    };

    let line = 0;
    print(`🧠 Room HUD`, line++);
    print(`🏷 ${room.name}`, line++);
    print(`⚡ ${energy}/${maxEnergy} E`, line++);

    print(`🏛 RCL ${controller.level}`, line++);
    const progressPercent = ((controller.progress / controller.progressTotal) * 100).toFixed(1);
    print(`📈 ${progressPercent}% to RCL ${controller.level + 1}`, line++);
    print(`⌛ Downgrade: ${controller.ticksToDowngrade}`, line++);

    print(`👥 Creeps (cur/des):`, line++);
    for (const role in desiredCounts) {
        const current = currentCounts[role] || 0;
        const desired = desiredCounts[role];
        const text = `• ${role.padEnd(9)} ${current}/${desired}`;
        const color = current < desired ? '#ffaa00' : '#ffffff';
        print(text, line++, color);
    }

    if (hostileCreeps.length > 0) {
        print(`🚨 Hostiles: ${hostileCreeps.length}`, line++, '#ff5555');
    }
}





