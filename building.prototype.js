function linkTransfer(link1, link2) {

    if(link1.cooldown == 0 && link2.cooldown == 0 && link1.getUsedCapacity(RESOURCE_ENERGY) >= 100 && link2.getFreeCapacity >= 100) {
        link1.transferEnergy(link2)
    }
    //pretty basic function but probably works  
}
    