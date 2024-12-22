const mongoose = require('mongoose');
const crypto = require('crypto');
const pagination = require('mongoose-paginate-v2')
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    created: {
        type: Date,
        default: Date.now
    },
    mobile: {
        type: String,

    },
    updated: Date,
    hashed_password: {
        type: String,
        required: "password is easy"
    },
    salt: String,
    user_type: {
        type: String
    },
    aadhar_card_no: {
        type: String
    },
    pan_card_no: {
        type: String
    },
    profile_photo:{
        type:String
    },
    joined_company:{
        type:String
    },
    truck_managed:{
        type:mongoose.Schema.ObjectId,
        ref:'Truck'
    },
    address:{
        type:String
    },
    home_town:{
        type:String
    },
    recovery_number:{
        type:String
    },
    isWorking:{
        type:Boolean,
        default:false
    },
    driving_license_no:{
        type:String
    },
    bank_account_no:{
        type:String
    },
    bank_ifsc_code:{
        type:String
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }

})




UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}

UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

UserSchema.plugin(pagination);

module.exports = mongoose.model('User', UserSchema)