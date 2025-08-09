var defcon = {
    run: function(room) {
        if (!Memory.defcon) {
            Memory.defcon = {};
        }

        const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        let roomDefcon = Memory.defcon[room.name] || { defcon: 0, count: 0 };

        if (hostileCreeps.length > 0) {
            if (hostileCreeps.length === 1 && roomDefcon.defcon === 0) {
                roomDefcon.defcon = 1;
                // spawn 1 defender
            }
            if (hostileCreeps.length >= 2) {
                roomDefcon.defcon = 3;
            }
            if (hostileCreeps.length > 6) {
                roomDefcon.defcon = 4;
            }

            if (roomDefcon.defcon === 0) {
                roomDefcon.count = 0;
            } else {
                roomDefcon.count += 1;
            }

            if (roomDefcon.count === 50 && roomDefcon.defcon === 1) {
                roomDefcon.defcon = 2;
                roomDefcon.count = 0;
            }

            if (roomDefcon.count === 50) {
                room.controller.activateSafeMode();
                // emergency room condition (recover) add later
            }
        } else {
            if (roomDefcon.defcon > 0) {
                roomDefcon.count -= 1;

                if (roomDefcon.count <= 0) {
                    roomDefcon.defcon -= 1;
                    roomDefcon.count = 0;
                }
            }
        }

        Memory.defcon[room.name] = roomDefcon;
        
    }
};

module.exports = defcon;