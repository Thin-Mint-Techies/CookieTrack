const express = require('express');
const rewardController = require('../controllers/rewardController');
const router = express.Router();


// CRUD for rewards
router.post('/reward', rewardController.createreward);
router.get('/reward', rewardController.getAllreward);
router.put('/reward/:id', rewardController.updatereward);
router.delete('/reward/:id', rewardController.deletereward);


module.exports = router;
