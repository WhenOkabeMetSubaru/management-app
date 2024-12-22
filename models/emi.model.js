const mongoose = require('mongoose');
const pagination = require('mongoose-paginate-v2');

const EMISchema = new mongoose.Schema({
    total_payable_amount:{
        type:String
    },
    monthly_payable_amount:{
        type:String
    },
    truck:{
        type:mongoose.Schema.ObjectId,
        ref:'Truck'
    },
    emi_start_month:{
        type:String
    },
    emi_end_month:{
        type:String
    },
    total_paid_amount:{
        type:String
    },
    remaining_amount_to_pay:{
        type:String
    },
    date_of_debit:{
        type:Number
    },
    transaction:{
        type:mongoose.Schema.ObjectId,
        ref:'Transaction'
    },
    created:{
        type:Date,
        default:Date.now
    }
})

EMISchema.plugin(pagination)
module.exports = mongoose.model('Emi',EMISchema);