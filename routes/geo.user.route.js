const { GeoUserModel } = require('../models/geo_user');
const express = require('express');
const router = express.Router();
//const { body }   = require('express-validator');
//const { validateFields } = require('../middlewares/validate-fields')

router.get('/insert', async (req, res, next) => {
    try {
        const users = await GeoUserModel.insertMany([
            {
                name: 'User 1',
                location: {
                    type: 'Point',
                    coordinates: [79.821602, 28.626137]// [longitude, latitude]
                }
            },
            {
                name: 'User 2',
                location: {
                    type: 'Point',
                    coordinates: [79.821091, 28.625484]
                }
            },
            {
                name: 'User 3',
                location: {
                    type: 'Point',
                    coordinates: [79.817924, 28.625294]
                }
            },
            {
                name: 'User 4',
                location: {
                    type: 'Point',
                    coordinates: [79.814636, 28.625181]
                }
            },
            {
                name: 'User 5',
                location: {
                    type: 'Point',
                    coordinates: [79.810135, 28.625044]
                }
            },
            {
                name: 'User 6',
                location: {
                    type: 'Point',
                    coordinates: [79.808296, 28.625019]
                }
            }
        ])

        if (users)
            res.json({ message: 'Successfuly' })
        else
            res.json({ message: 'Failed' })
    } catch (error) {
        next(error)
    }
})


router.get('/nearByUsersExample1', async (req, res, next) => {
    try {
        const latitude = 28.626137;
        const longitude = 79.821602;
        const distance = 1;
        const unitValue = 1000;

        const users = await GeoUserModel.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    query: {
                        status: true
                    },
                    maxDistance: distance * unitValue, // distance in meters
                    distanceField: 'distance',
                    distanceMultiplier: 1 / unitValue
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    distance: 1
                }
            },
            {
                $sort: {
                    distance: 1
                }
            },
            { $limit: 5 }
        ]);

        if (users)
            return res.json(users)
        return res.json({ message: 'failed' })
    } catch (error) {
        next(error)
    }
})

router.get('/nearByUsersExample2', async (req, res, next) => {
    try {
        const latitude = 28.626137;
        const longitude = 79.821602;
        const distance = 1;
        const unitValue = 1000;

        // $near sorts documents by distance
        const users = await GeoUserModel.find({
            location: {
                $near: {
                    $maxDistance: distance * unitValue, // distance in meters
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                }
            }
        }).select('_id name')

        if (users)
            return res.json(users)
        return res.json({ message: 'failed' })
    } catch (error) {
        next(error)
    }
})

module.exports = router