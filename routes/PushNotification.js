const router = require('express').Router() ; 
const PushCtrl = require('../controllers/PushNotification') ;
const auth = require('../middleware/auth')

router.route('/save-subscription')
.post(PushCtrl.AcceptSubscription) ;

router.route('/cancel-subscription/:id') 
.get(auth,PushCtrl.DeleteSubscription)

module.exports = router ;