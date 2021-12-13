const router = require('express').Router()
const workerCtrl = require('../controllers/workerCtrl')
// const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')


router.route('/workers')
    .get(workerCtrl.getWorkers)
    .post(workerCtrl.createWorker)


router.route('/workers/:id')
    .delete(workerCtrl.deleteWorker)
    .put(workerCtrl.updateWorker)



module.exports = router
