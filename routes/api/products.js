const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const protectRoute = require('../../middleware/routeProtect')
const Product = require('../../models/Product')
const {
    check,
    validationResult
} = require('express-validator')


// @route  POST api/product
// @desc   Add Product
// @access Private
router.post('/', [auth, protectRoute, [
    check('name', 'Product name is Required'),
    check('price', 'Price is required')]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        try {

            // if (req.user.role == 'admin') {


            const {
                name,
                price
            } = req.body

            product = new Product({
                name,
                price

            })
            await product.save();
            res.status(200).send('Product Added')
            // } else {
            //     res.status(400).send('msg: Unauthorized access')
            //  }

        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error');
        }
    })


// @route  PUT api/product/update/:id
// @desc   Update Product
// @access Private
router.put('/update/:id', [auth, protectRoute], async (req, res) => {

    try {
        const {
            name,
            price
        } = req.body

        const product = {}
        product.name = name;
        product.price = price


        const prod = await Product.findByIdAndUpdate({ _id: req.params.id }, {
            $set: product
        }, {
            new: true
        })
        console.log(prod)

        //await Product.findByIdAndUpdate({ _id: req.params.id }, { product })
        return res.json(prod);

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error');
    }

})


// @route  Delete api/products/:id
// @desc   Delete Product
// @access Private
router.delete('/:id', [auth, protectRoute], async (req, res) => {

    try {
        await Product.findByIdAndDelete({ _id: req.params.id })
        return res.status(200).send("Product Deleted");

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error');
    }

})

// @route  GET api/products/:id
// @desc   Get Product by id
// @access Public
router.get('/:id', async (req, res) => {

    try {
        const product = await Product.findById({ _id: req.params.id })
        return res.status(200).json(product);

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error');
    }

})

// @route  GET api/products
// @desc   Get all Product
// @access Public
router.get('/', async (req, res) => {

    try {
        const product = await Product.find()
        return res.status(200).json(product);

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error');
    }

})

module.exports = router;