const express = require('express');
const sharedController = require('../controllers/documentController');
const router = express.Router();
const upload = require('../utils/fileUpload'); 

// CRUD for Documents
router.post('/document', upload.single('file'), sharedController.uploadDocument);

module.exports = router;
