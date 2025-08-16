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
const roleScout = require("role.scout");
const roleWallBuilder = require("role.wallBuilder")
const roleMineralMiner = require("role.mineralMiner")
const toolbox = require("./utilities");
const spawner = require("./functions.spawner");
const defcon = require("./defcon");
const roomAdd = require('object.room')
const profiler = require('screeps-profiler');
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
const spawn_hauler = 2;
const spawn_harvester_external = 0;
const spawn_harvester_mineral = 0;
const spawn_builder = 2;
const spawn_upgrader = 3;
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
const spawn_wallBuilder = 1;

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

let lastMemoryTick;
let lastMemory;

function tryInitSameMemory() {
    const startCPU = Game.cpu.getUsed();
    let reused = false;

    if (lastMemoryTick && lastMemory && Game.time === lastMemoryTick + 1) {
        delete global.Memory;
        global.Memory = lastMemory;
        RawMemory._parsed = lastMemory;
        reused = true;
    } else {
        Memory;
        lastMemory = RawMemory._parsed;
    }

    lastMemoryTick = Game.time;
    const endCPU = Game.cpu.getUsed();

    console.log(`[MemHack] CPU: ${(endCPU - startCPU).toFixed(3)} | Reused: ${reused}`);
}

function fnv1aHash(str) {
  let hash = 0x811c9dc5; 
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash >>> 0) * 0x01000193; 
  }
  return hash >>> 0; 
}
function generateRoomHash(data) {
  return fnv1aHash(JSON.stringify(data));
}
function roomNeedsUpdate(room, prevHash) {
  const memRoom = Memory.rooms[room.name];
  let storedLevel;

  if (memRoom && memRoom.controllerLevel !== undefined) {
    storedLevel = memRoom.controllerLevel;
  }

  const currentLevel = room.controller.level;

  if (storedLevel !== currentLevel) return true;

  if (Game.time % 10 === 0) return true;

  if (!prevHash) return true;

  return false;
}


module.exports.loop = function () {
    tryInitSameMemory();
   // Profiler.loop()
    console.log(Game.cpu.bucket)
 //     if (Game.cpu.generatePixel && Game.cpu.bucket >= 10000) {
  //  console.log('generating a pixel');
 //   Game.cpu.generatePixel();
 // }
    
if(!Memory.rooms) {
    Memory.rooms = {}
}

if (!Memory.rooms) Memory.rooms = {};

const roomNames = Object.keys(Game.rooms);
const index = Game.time % roomNames.length;
const roomName = roomNames[index];
const room = Game.rooms[roomName];

if (room && room.controller && room.controller.my) {
  const memRoom = Memory.rooms[room.name] || {};
  const prevHash = memRoom.__hash;

  if (roomNeedsUpdate(room, prevHash)) {
    const newData = roomAdd(room);
    const newHash = generateRoomHash(newData);

    if (newHash !== prevHash) {
      Memory.rooms[room.name] = newData;
      Memory.rooms[room.name].__hash = newHash;
    }
  }
}

    for (const roomName in Game.rooms) {
        if(!Memory.rooms[roomName]) {
        Memory.rooms[roomName] = {};
        }
    }
if (Game.time % 6 === 0) {
    require('marketManager').run();
    // console.log(`[marketManager] Tick ${Game.time}: run() triggered`);
}
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
  const creeps = Object.values(Game.creeps);
  const paired = new Set();

  for (let i = 0; i < creeps.length; i++) {
    const creepA = creeps[i];
    if (paired.has(creepA.name) || Math.random() > 0.75 || creepA.saying) continue;

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
  // ╔═════════════════╗
  // ║ Role Assignment ║
  // ╚═════════════════╝
for (let name in Game.creeps) {
  let creep = Game.creeps[name];
  switch (creep.memory.role) {
case "harvester": {
  const startCPU = Game.cpu.getUsed();
  roleHarvester.run(creep, activated_harvesters, toolbox, source_harvesters);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for harvester: ${endCPU - startCPU}`);
  break;
}
case "pioneer": {
  const startCPU = Game.cpu.getUsed();
  rolePioneer.run(creep, true, toolbox, source_pioneers);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for pioneer: ${endCPU - startCPU}`);
  break;
}
case "hauler": {
  const startCPU = Game.cpu.getUsed();
  roleHauler.run(creep, activated_haulers, toolbox, source_haulers);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for hauler: ${endCPU - startCPU}`);
  break;
}
case "harvester_external": {
  const startCPU = Game.cpu.getUsed();
  roleHarvesterExternal.run(creep, activated_harvesters);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for harvester_external: ${endCPU - startCPU}`);
  break;
}
case "harvester_mineral": {
  const startCPU = Game.cpu.getUsed();
  roleHarvesterMineral.run(creep, activated_harvesters);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for harvester_mineral: ${endCPU - startCPU}`);
  break;
}
case "upgrader": {
  const startCPU = Game.cpu.getUsed();
  roleUpgrader.run(creep, activated_upgraders, toolbox, source_upgraders);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for upgrader: ${endCPU - startCPU}`);
  break;
}
case "builder": {
  const startCPU = Game.cpu.getUsed();
  roleBuilder.run(creep, activated_builders, toolbox, source_builders);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for builder: ${endCPU - startCPU}`);
  break;
}
case "repairer": {
  const startCPU = Game.cpu.getUsed();
  roleRepairer.run(creep, activated_repairers, toolbox, source_repairers);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for repairer: ${endCPU - startCPU}`);
  break;
}
case "defender": {
  const startCPU = Game.cpu.getUsed();
  roleDefender.run(creep, activated_defenders, toolbox, source_defenders);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for defender: ${endCPU - startCPU}`);
  break;
}
case "attacker": {
  const startCPU = Game.cpu.getUsed();
  roleAttacker.run(creep);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for attacker: ${endCPU - startCPU}`);
  break;
}
case "claimer": {
  const startCPU = Game.cpu.getUsed();
  roleClaimer.run(creep, true, toolbox);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for claimer: ${endCPU - startCPU}`);
  break;
}
case "filler": {
  const startCPU = Game.cpu.getUsed();
  roleFiller.run(creep, activated_fillers, toolbox);
  const endCPU = Game.cpu.getUsed();
  console.log(`CPU used for filler: ${endCPU - startCPU}`);
  break;
}

    case "explorer":
      roleExplorer.run(creep);
      break;
    case "ranger":
      roleRanger.run(creep, activated_rangers, toolbox);
      break;
    case "healer":
      roleHealer.run(creep, activated_healers, toolbox);
      break;
    case "beserker":
      roleBeserker.run(creep, activated_beserkers, toolbox);
      break;
    case "wallBuilder":
      roleWallBuilder.run(creep, true, toolbox);
      break;
    case "mineralMiner":
        roleMineralMiner.run(creep, true, toolbox);
      break;
  }
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
const total_wallBuilder = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "wallBuilder" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);
const total_mineralMiner = _.filter(
  Game.creeps,
  (creep) =>
    creep.memory.role === "mineralMiner" &&
    creep.memory.origin &&
    creep.memory.origin.name === room.name
);
var sites = room.find(FIND_CONSTRUCTION_SITES)


  // ╔═════════╗
  // ║ Loggers ║
  // ╚═════════╝
if (Game.time % 10 === 0) {
    for (const name in Game.rooms) {
        const room = Game.rooms[name];
        console.log(`╔════════════════════════════════════════════════`);
        console.log(`║─┤Room "${name}"`);
        console.log(`║─┤Total Energy: ${room.energyAvailable}`);
        console.log(`║─┤Slots per Creep: ${Math.floor(room.energyAvailable / 50)}`);
        console.log(`║─┤⛏️ Harvesters: ${total_harvesters.length}`);
        console.log(`║─┤🔨 Builders: ${total_builders.length}`);
        console.log(`║─┤🔺 Upgraders: ${total_upgraders.length}`);
        console.log(`║─┤🔧 Repairers: ${total_repairers.length}`);
        console.log(`║─┤🛒 Haulers: ${total_haulers.length}`);
        console.log(`╚════════════════════════════════════════════════`);
    }
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
  //every 100 ticks for CPU efficiency
if (Game.time % 100 === 0) {
    Memory.spawns = {};
    for (const spawnName in Game.spawns) {
        Memory.spawns[spawnName] = {
            name: spawnName,
            pos: Game.spawns[spawnName].pos,
            room: Game.spawns[spawnName].room.name
        };
    }
}

for (const spawnName in Memory.spawns) {
    const spawn = Game.spawns[spawnName];
    if (spawn && spawn.spawning) {
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
// ╔════════════════════════════════╗
// ║ Priority-Based Creep Spawning ║
// ╚════════════════════════════════╝
if (total_harvesters.length < spawn_harvester) {
  spawner.buildCreep('harvester', room);
} else if (total_haulers.length < spawn_hauler) {
  spawner.buildCreep('hauler', room);
} else if (total_wallBuilder.length < 1) {
  spawner.buildCreep('wallBuilder', room);
} else if (total_builders.length < spawn_builder && sites.length) {
  spawner.buildCreep('builder', room);
} else if (total_upgraders.length < spawn_upgrader) {
  spawner.buildCreep('upgrader', room);
} else if (total_repairers.length < spawn_repair) {
  spawner.buildCreep('repairer', room);
} else if (room.controller.level >= 4 && room.storage && total_filler.length < 1) {
  spawner.buildCreep('filler', room);
}

// ╔════════════════════════════════╗
// ║ Conditional Spawning (Flags)  ║
// ╚════════════════════════════════╝
if (Game.flags.claimRoom && total_claimers.length < 1) {
  spawner.buildCreep('claimer', room);
}

if (Game.flags.supportRoom && total_pioneers.length < 2) {
  spawner.buildCreep('pioneer', room);
}

// ╔════════════════════════════════╗
// ║ DEFCON-Based Defender Spawning ║
// ╚════════════════════════════════╝
var defconLevel = Number(Memory.defcon && Memory.defcon[room.name] && Memory.defcon[room.name].defcon);
if (defconLevel >= 1) {
  let spawn_defender = [0, 1, 2, 4, 6][defconLevel] || 0;
  if (total_defenders.length < spawn_defender) {
    spawner.buildCreep('defender', room);
  }
}

// ╔════════════════════════════════╗
// ║ Mineral Miner (Low Priority)  ║
// ╚════════════════════════════════╝
if (
  room.controller.level >= 6 &&
  room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_EXTRACTOR }).length > 0 &&
  total_mineralMiner.length < 1
) {
  spawner.buildCreep('mineralMiner', room);
}
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
        print(`🚨 Hostiles: ${hostileCreeps.length}, line++, '#ff5555'`);
    }
}