const { CategoryModel } = require('../models/category');
const express = require('express');
const router = express.Router();
//const { body }   = require('express-validator');
//const { validateFields } = require('../middlewares/validate-fields')

router.get('/', async(req, res, next)=>{
    try {
        const { pageNumber, pageSize = 5 } = req.query

        const query = { status: true };

        const [categories, total] = await Promise.all([
            CategoryModel.find(query).populate('user', 'name').skip(Number((pageNumber - 1) * pageSize)).limit(Number(pageSize)),
            CategoryModel.countDocuments(query)
        ])

        const totalPages = Math.ceil(total / pageSize);

        res.json({pageNumber, pageSize, total, totalPages, data: categories })
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, imgUrl = `http://localhost:${process.env.PORT}/upload/images/img01.jpg`, userId } = req.body;

        const categoryDB = await CategoryModel.findOne({ 'name': name });

        if (categoryDB) {
            return res.status(400).json({ msg: `category is exist` });
        }

        let category = new CategoryModel({
            name: name,
            imgUrl: imgUrl,
            user: userId
        });

        category = await category.save();
        if(!category)
            return res.status(400).send('the category cannot be created!')

        res.status(201).json(category);
    } catch (error) {
        next(error)
    }
    
});

router.put('/:id', async (req, res, next) => {
    try {
        const {name, imgUrl, status, userId} = req.body
        const category = await CategoryModel.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                imgUrl: imgUrl,
                status: status,
                user: userId,
            },
            { new: true}
        )
    
        if(!category)
        return res.status(400).send('the category cannot be update!')
    
        res.send(category);
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const category = await CategoryModel.findByIdAndRemove(req.params.id)
        if(category) {
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "category not found!"})
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router