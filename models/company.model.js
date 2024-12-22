const mongoose = require('mongoose');
const pagination = require('mongoose-paginate-v2');

const CompanySchema = new mongoose.Schema({
    company_name:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true
    },
    company_image:{
        type:String
    },
    company_email:{
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    company_type:{
        type:String
    },
    company_website:{
        type:String
    },
    company_contact_no:{
        type:String
    },
    gst_no:{
        type:String
    },
    address:{
        type:String,
        trim:true
    },
    location:{
        type:String
    },
    consignments:[{
        type:mongoose.Schema.ObjectId,
        ref:'Consignment'
    }],
    bills:[{
        type:mongoose.Schema.ObjectId,
        ref:'Bill'
    }],
    created:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
    
})

CompanySchema.plugin(pagination)

module.exports = mongoose.model('Company',CompanySchema);