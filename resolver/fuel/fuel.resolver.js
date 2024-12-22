const FuelCtrl= require('../../controllers/fuel/fuel.controller')


const resolvers = {
    Query: {
        getAllFuels:FuelCtrl.getAllFuels,
        getAllFuelsFull:FuelCtrl.getAllFuelsFull,
        getFuelByID:FuelCtrl.getFuelByID
    
    },
    Mutation: {
        addNewFuel:FuelCtrl.addNewFuel,
        updateFuelByID:FuelCtrl.updateFuelByID,
        deleteFuelByID:FuelCtrl.deleteFuelByID
    }
}


module.exports = resolvers