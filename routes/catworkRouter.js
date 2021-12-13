const router = require('express').Router()
const catworkCtrl =require('../controllers/catworkCtrl')
const auth =require('../middleware/auth')
const authAdmin =require('../middleware/authAdmin')


router.route('/catwork')
    .get(catworkCtrl.getCatwork)
    .post(auth, authAdmin, catworkCtrl.createCatwork)

router.route('/catwork/:id')
    .delete(auth, authAdmin, catworkCtrl.deleteCatwork)
    .put(auth, authAdmin, catworkCtrl.updateCatwork)







module.exports= router