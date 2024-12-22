const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooeAggregatePagination = require('mongoose-aggregate-paginate-v2');

const TransactionSchema= new mongoose.Schema({

    transaction_id:{
        type:String
    },
    transaction_type:{
        type:String
    },
    current_account_balance:{
        type:String
    },
    sender_name:{
        type:String
    },
    receiver_name:{
        type:String
    },
    amount_to_send:{
        type:String
    },
    transaction_status:{
        type:String
    },
    sender_account_no:{
        type:String
    },
    sender_bank_name:{
        type:String
    },
    sender_bank_ifsc_code:{
        type:String
    },
    receiver_account_no:{
        type:String
    },
    receiver_bank_name:{
        type:String
    },
    receiver_bank_ifsc_code:{
        type:String
    },
    note:{
        type:String,
        trim:true
    },
    transaction_created_date:{
        type:String
    },
    transaction_completed_date:{
        type:String
    },
    truck:{
        type:mongoose.Schema.ObjectId,
        ref:'Truck'
    },
    company:{
        type:mongoose.Schema.ObjectId,
        ref:'Company'
    },
    consignment:{
        type:mongoose.Schema.ObjectId,
        ref:'Consignment'
    },
    bill:{
        type:mongoose.Schema.ObjectId,
        ref:'Bill'
    },
    due_payment:{
        type:String
    },
    created:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
    
})

TransactionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Transaction',TransactionSchema);