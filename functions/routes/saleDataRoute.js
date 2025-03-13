const express = require('express');
const saleDataController = require('../controllers/saleDataController');
const router = express.Router();


router.post('/saleData', saleDataController.createSaleData);
router.put('/saleData/:id', saleDataController.getSaleData);
router.put('/saleData/:id', saleDataController.updatesaleData);
router.delete('/saleData/:id', saleDataController.deletesaleData);



module.exports = router;
