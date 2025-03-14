const express = require('express');
const saleDataController = require('../controllers/saleDataController');
const router = express.Router();
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');


router.post('/saleData', requireLogin,  saleDataController.createSaleData);
router.get('/saleData/:id', requireLogin, saleDataController.getSaleData);
router.put('/saleData/:id', requireLogin, saleDataController.updatesaleData);
router.delete('/saleData/:id', requireLogin, saleDataController.deletesaleData);

router.get('/saleDataTrooperId/:id', requireLogin, saleDataController.getSaleDatasByTrooperId);
router.get('/saleDataOwnerId/:id',requireLogin,  saleDataController.getSaleDataByOwnerId);
router.get('/saleDatas', requireLogin, checkRole(['leader']), saleDataController.getAllSaleData);






module.exports = router;
