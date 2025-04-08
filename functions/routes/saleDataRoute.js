const express = require('express');
const saleDataController = require('../controllers/saleDataController');
const router = express.Router();
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');


//requireLogin, 
router.post('/saleData',  saleDataController.createSaleData);
//requireLogin, 
router.get('/saleData/:id',saleDataController.getSaleData);
//requireLogin
router.put('/saleData/:id', saleDataController.updateSaleData);
//requireLogin, 
router.delete('/saleData/:id', saleDataController.deleteSaleData);
//requireLogin,
router.get('/saleDataTrooperId/:id',  saleDataController.getSaleDatasByTrooperId);
//requireLogin,
router.get('/saleDataOwnerId/:id',  saleDataController.getSaleDataByOwnerId);
//requireLogin,
router.get('/saleDatas',  saleDataController.getAllSaleData);






module.exports = router;
