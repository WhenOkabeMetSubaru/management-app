const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2')
const FuelSchema = new mongoose.Schema({
    quantity:{
        type:Number
    },
    cost:{
        type:Number
    },
    petrol_pump_name:{
        type:String
    },
    location:{
        type:String
    },
    petrol_rate_by_location:{
        type:Number
    },
    truck:{
        type:mongoose.Schema.ObjectId,
        ref:'Truck'
    },
    driver:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    optional_driver_name:{
        type:String
    },
    transaction:{
        type:mongoose.Schema.ObjectId,
        ref:'Transaction'
    },
    consignment:{
        type:mongoose.Schema.ObjectId,
        ref:'Consignment'
    },
    note:{
        type:String,
        trim:true
    },
    fuel_created_date:{
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

FuelSchema.plugin(paginate)
module.exports = mongoose.model('Fuel',FuelSchema);