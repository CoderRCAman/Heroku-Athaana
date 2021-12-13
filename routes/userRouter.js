const router = require('express').Router()
const userCtrl =require('../controllers/userCtrl')
// const {register} =require('../controllers/userCtrl')
const auth = require('../middleware/auth')


router.post('/register',userCtrl.register) 

router.post('/activation', userCtrl.activateEmail)

router.post('/login',userCtrl.login) 

router.get('/logout',userCtrl.logout) 

router.get('/refresh',userCtrl.refreshToken) 

router.post('/forgot', userCtrl.forgotPassword)

router.post('/reset', auth, userCtrl.resetPassword)

router.get('/infor', auth,userCtrl.getUser)

router.patch('/addcart',auth,userCtrl.addCart)
router.post('/cart',auth,userCtrl.updateCart) 

router.get('/history',auth,userCtrl.history)

router.post('/address/:id', auth,userCtrl.addAddress) 
router.delete('/address/:id', auth,userCtrl.deteleAddress) //id : user's id 
router.post('/order/:id',auth,userCtrl.order) ; 
router.post('/update/:id',userCtrl.updateStatus) ;
router.post('/google_Login', userCtrl.googleLogin)
// router.post('/facebook_login', userCtrl.facebookLogin)
router.get('/status',userCtrl.status) ;


// router.post('/sendOTP',userCtrl.sendOTP) ;
// router.post('/verifyOTP',userCtrl.verifyOTP) ;







module.exports = router