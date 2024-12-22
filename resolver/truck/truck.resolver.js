const TruckCtrl = require('../../controllers/truck/truck.controller')


const resolvers = {
    Query: {
       getAllTrucks:TruckCtrl.getAllTrucks,
       getTruckByID:TruckCtrl.getTruckByID,
       getAllVehicleRepairByID:TruckCtrl.getAllVehicleRepairByID,
       getAllDeliveryRouteByID:TruckCtrl.getAllDeliveryRouteByID,
       getAllTrucksFull:TruckCtrl.getAllTrucksFull,
       getTruckAnalyticDataByID:TruckCtrl.getTruckAnalyticDataByID,
       checkPendingTruckExists:TruckCtrl.checkPendingTruckExists
    
    },
    Mutation: {
        addNewTruck:TruckCtrl.addNewTruck,
        updateTruckByID:TruckCtrl.updateTruckByID,
        addVehicleRepairByID:TruckCtrl.addVehicleRepairByID,
        addDeliveryRouteByID:TruckCtrl.addDeliveryRouteByID
    }
}


module.exports = resolvers