const TransactionCtrl= require('../../controllers/transaction/transaction.controller')


const resolvers = {
    Query: {
       getAllTransactions:TransactionCtrl.getAllTransactions,
       getTransactionByID:TransactionCtrl.getTransactionByID,
       getAllTransactionsFull:TransactionCtrl.getTransactionsFull
    },
    Mutation: {
        addNewTransaction:TransactionCtrl.addNewTransaction,
        updateTransactionByID:TransactionCtrl.updateTransactionByID
    }
}


module.exports = resolvers