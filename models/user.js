const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Field name is required"],
    },
    lastName: {
        type: String,
        default: '',
    },
    address : {
        type: String,
        default:''
    },
    city : {
        type: String,
        default:''
    },
    state : {
        type: String,
        default:''
    },
    cp : {
        type: String,
        default:''
    },
    country : {
        type: String,
       default:''
    },
    email:{
        type: String,
        unique : [true, 'email unique']
    },
    passwordHash: {
        type: String,
        required: true,
    },
    status :{
        type: Boolean,
        default : true
    }
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.UserModel = mongoose.model('User', userSchema)