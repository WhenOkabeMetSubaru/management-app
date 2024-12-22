const BillCtrl = require('../../controllers/bill/bill.controller')


const resolvers = {
    Query: {
       getAllBills:BillCtrl.getAllBills,
       getAllBillsFull:BillCtrl.getAllBillsFull,
       getBillByID:BillCtrl.getBillByID,
       getBillTemplateByUser:BillCtrl.getBillTemplateByUser,
       getLRTemplateByUser:BillCtrl.getLRTemplateByUser,
       getLoadingSlipTemplateByUser:BillCtrl.getLoadingSlipTemplateByUser,
       checkBillNumberExists:BillCtrl.checkBillNumberExists
    
    },
    Mutation: {
        addNewBill:BillCtrl.addNewBill,
        updateBillByID:BillCtrl.updateBillByID,
        deleteBillByID:BillCtrl.deleteBillByID
    }
}


module.exports = resolvers