const router = require('express').Router()
const productCtrl = require('../controllers/productCtrl')
// const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')


router.route('/products')
    .get(productCtrl.getProducts)
    .post(productCtrl.createProduct)
    router.route("/products/:cat_id").get(productCtrl.getProductsByCategory);
router.route('/product/:id').get(productCtrl.getProduct) ;

router.route('/products/:id')
    .delete(productCtrl.deleteProduct)
    .put(productCtrl.updateProduct)

router.route("/search-listings")   
    .post(productCtrl.searchListings);



router.route('/offer/:check_offer').get(productCtrl.getOffer) ;

//add room 
// router.route('/products/room/:id').
//     post(productCtrl.addRoom)

// router.route('/products/room/:id/:r_id').
//     get(productCtrl.deleteRoom)

module.exports = router
