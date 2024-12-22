const { gql } = require('apollo-server-express');


const typeDefs = gql`

    type Query{

       getAllTransactions(start_time:String,end_time:String,truck:ID,company:ID,consignment:ID,bill:ID,status:String,pageNumber:Int,pageSize:Int):MultipleTransactionOutput
       getTransactionByID(transaction_id:ID):SingleTransactionOutput
       getAllTransactionsFull:MultipleTransactionOutput
    }

    type Mutation{

        addNewTransaction(TransactionInput:NewTransactionInput):SingleTransactionOutput
        updateTransactionByID(TransactionInput:UpdateTransactionInput):SingleTransactionOutput
    }

    type SingleTransactionOutput{
        error:Boolean
        message:String
        data:TransactionData
    }

    type MultipleTransactionOutput{
        error:Boolean
        message:String
        data:[TransactionData]
        totalDocs:Int
        limit:Int
        totalPages:Int
        page:Int
    }

    input NewTransactionInput {
        transaction_id:String
        transaction_type:String
        current_account_balance:String
        sender_name:String
        receiver_name:String
        amount_to_send:String
        transaction_status:String
        sender_account_no:String
        sender_bank_name:String
        sender_bank_ifsc_code:String
        receiver_account_no:String
        receiver_bank_name:String
        receiver_bank_ifsc_code:String
        truck:ID
        company:ID
        consignment:ID
        bill:ID
        due_payment:String
        created:String
        transaction_created_date:String
        transaction_completed_date:String
        note:String
    }
    input UpdateTransactionInput {
        _id:ID
        transaction_id:String
        transaction_type:String
        current_account_balance:String
        sender_name:String
        receiver_name:String
        amount_to_send:String
        transaction_status:String
        sender_account_no:String
        sender_bank_name:String
        sender_bank_ifsc_code:String
        receiver_account_no:String
        receiver_bank_name:String
        receiver_bank_ifsc_code:String
        truck:ID
        company:ID
        consignment:ID
        bill:ID
        due_payment:String
        transaction_created_date:String
        transaction_completed_date:String
        note:String
       
    }

    type TransactionData {
        _id:ID
        transaction_id:String
        transaction_type:String
        current_account_balance:String
        sender_name:String
        receiver_name:String
        amount_to_send:String
        transaction_status:String
        sender_account_no:String
        sender_bank_name:String
        sender_bank_ifsc_code:String
        receiver_account_no:String
        receiver_bank_name:String
        receiver_bank_ifsc_code:String
        truck:ID
        company:ID
        consignment:ID
        bill:ID
        due_payment:String
        created:String
        transaction_created_date:String
        transaction_completed_date:String
        note:String
    }

    


`

module.exports = typeDefs;