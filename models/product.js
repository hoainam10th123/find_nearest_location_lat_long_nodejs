const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    imgsUrl: {
        type: Array,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    discount:{
        type: Boolean,
        default: false
    },
    discount_percentage:{
        type: Number,
        default: 0
    }
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.ProductModel = mongoose.model('Product', productSchema)