module.exports = {
  inflate: function(ids){
    return _.transform(ids, function(result, id){
      result.push(Game.getObjectById(id))
    })
  },

  deflate: function(objects){
    return _.transform(objects, function(result, object){
      result.push(object.id)
    })
  },

  workRate: function(creeps){
    var workRate = 0

    _.forEach(creeps, function(creep){
      _.forEach(creep.body, function(part){
        if(part.type == WORK){
          workRate += 2
        }
      })
    })

    return workRate
  },

  myNearestRoom: function(roomName, rooms){
    var myRooms = rooms.where({mine: true}, {spawnable: true})

    var nearestRoom
    var nearestRoomDistance = 999

    _.forEach(myRooms, function(room){
      var distance = Game.map.getRoomLinearDistance(roomName, room.name)


      if(distance < nearestRoomDistance){
        nearestRoomDistance = distance
        nearestRoom = room.name
      }
    })

    return nearestRoom
  }
}