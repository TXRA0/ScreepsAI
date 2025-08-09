/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

const roleDefender = {
    run: function (creep, active, toolbox, source) {
        toolbox.defend(creep)
    }
};
module.exports = roleDefender