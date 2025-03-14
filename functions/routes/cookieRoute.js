const express = require('express');
const cookieController = require('../controllers/cookieController');
const router = express.Router();
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');

router.post('/cookie', cookieController.createCookie);
router.get('/cookie', cookieController.getAllCookie);
router.get('/cookies', cookieController.getMonthlyCookies);
router.put('/cookie/:id', cookieController.updateCookie);
router.delete('/cookie/:id', cookieController.deleteCookie);
router.post('/cookieManager', cookieController.createCookie);


module.exports = router;
