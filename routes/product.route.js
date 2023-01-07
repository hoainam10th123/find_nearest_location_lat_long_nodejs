const { ProductModel } = require('../models/product');
const express = require('express');
const router = express.Router();


router.get('/', async(req, res, next)=>{
    try {
        const { category = '', pageSize = 5, pageNumber = 1 } = req.body;
        let query = { status: true };

        if (category != '') {
            query = { status: true, category: category };
        }

        const total = await ProductModel.countDocuments(query);

        let totalPages = Math.ceil(total / pageSize);


        const products = await ProductModel.find(query)
            .populate('category', 'name')
            .skip(Number((pageNumber - 1) * pageSize)).limit(Number(pageSize))

        res.json({ data: products, total, totalPages, pageSize, pageNumber })
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {
            name, 
            description, 
            imgsUrl = `http://localhost:${process.env.PORT}/upload/images/img01.jpg`, 
            price, 
            categoryId
        } = req.body

        let product = new ProductModel({
            name: name,
            description: description,
            imgsUrl: imgsUrl,
            price: price,
            category: categoryId
        })
        product = await product.save();
    
        if(!product)
        return res.status(400).send('the product cannot be created!')
    
        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
    
});

router.put('/:id', async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const product = await ProductModel.findByIdAndRemove(req.params.id)
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "product not found!"})
        }
    } catch (error) {
        next(error)
    }
});

module.exports = router