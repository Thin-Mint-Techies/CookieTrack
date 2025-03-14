const express = require('express');
const sharedController = require('../controllers/documentController');
const router = express.Router();
const upload = require('../utils/fileUpload'); 
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');


router.post('/document', upload.single('file'), sharedController.uploadDocument);

module.exports = router;
