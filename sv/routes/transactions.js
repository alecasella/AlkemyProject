const express = require('express');
const router = express.Router();

const verify = require('../middlewares/verifyToken');
const transcactionController = require("../controllers/transactionControllers");

router.post('/transaction', verify, transcactionController.create);

router.get('/transaction/:id_user', verify, transcactionController.list);

router.get('/transaction/:id_user/:id_transaction', verify, transcactionController.details);

router.delete('/transaction', verify, transcactionController.delete );


router.patch('/transaction/:id_user', verify, transcactionController.update);


router.get('/filter/:id_user/:category', verify, transcactionController.filter);

module.exports = router