const ConsignmentCtrl = require('../../controllers/consignment/consignment.controller.js')


const resolvers = {
    Query: {
       getAllConsignments:ConsignmentCtrl.getAllConsignments,
       getConsignmentByID:ConsignmentCtrl.getConsignmentByID,
       getFuelFilledLocationByID:ConsignmentCtrl.getFuelFilledLocationByID,
       getAllStoppagesByID:ConsignmentCtrl.getAllStoppagesByID,
       getAllTollsByID:ConsignmentCtrl.getAllTollsByID,
       getAllExpensesByID:ConsignmentCtrl.getAllExpensesByID,
       getAllFinesByID:ConsignmentCtrl.getAllFinesByID,
       getAllVehicleDamagesByID:ConsignmentCtrl.getAllVehicleDamagesByID,
       getAllConsignmentsFull:ConsignmentCtrl.getAllConsignmentsFull,
       getConsignmentExpenseMetrics:ConsignmentCtrl.getConsignmentExpenseMetrics
    
    },
    Mutation: {
        addNewConsignment:ConsignmentCtrl.addNewConsignment,
        updateConsignmentByID:ConsignmentCtrl.updateConsignmentByID,
        addFuelFilledLocationByID:ConsignmentCtrl.addFuelFilledLocationByID,
        addStoppageByID:ConsignmentCtrl.addStoppageByID,
        addTollByID:ConsignmentCtrl.addTollByID,
        addExpenseByID:ConsignmentCtrl.addExpenseByID,
        addFineByID:ConsignmentCtrl.addFineByID,
        addVehicleDamageByID:ConsignmentCtrl.addVehicleDamageByID
    }
}


module.exports = resolvers