const mongoose = require('mongoose')

const GeoUserSchema = mongoose.Schema({
    name: String,
    status: {
        type: Boolean,
        default: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    }
})

GeoUserSchema.index({ location: '2dsphere' });

exports.GeoUserModel = mongoose.model('GeoUser', GeoUserSchema)