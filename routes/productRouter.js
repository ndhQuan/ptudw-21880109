let express = require('express');
let router = express.Router();

router.get('/',(req,res) => {
    res.render('category', {banner: 'Shop Category'});
})

router.get('/:id',(req,res) => {
    res.render('single-product', {banner: 'Shop Single'});
})

module.exports = router;