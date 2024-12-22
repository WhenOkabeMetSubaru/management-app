const UserCtrl = require('../../controllers/user/user.controller');




const resolvers = {
    Query: {
        getAllUsers: UserCtrl.getAllUsers,
        getUserByID:UserCtrl.getUserByID,
        getAllDrivers:UserCtrl.getAllDrivers,
        getAllDriversFull:UserCtrl.getAllDriversFull,
        getDriverByID:UserCtrl.getDriverByID,
        getAllContacts:UserCtrl.getAllContacts,
        getContactByID:UserCtrl.getContactByID,
        getDashboardData:UserCtrl.getDashboardData,
        getAnalyticsDataByUser:UserCtrl.getAnalyticsDataByUser,
        getDriverAnalyticDataByID:UserCtrl.getDriverAnalyticDataByID

    
    },
    Mutation: {
        addNewUser: UserCtrl.addNewUser,
        updateUser:UserCtrl.updateUser,
        addNewDriver:UserCtrl.addNewDriver,
        addNewContact:UserCtrl.addNewContact,
        updateContactByID:UserCtrl.updateContactByID,
        updateDriverByID:UserCtrl.updateDriverByID
    }
}


module.exports = resolvers