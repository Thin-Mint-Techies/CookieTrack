const express = require('express');
const rewardController = require('../controllers/rewardController');
const router = express.Router();


// CRUD for rewards
router.post('/reward', rewardController.createReward);
router.get('/reward', rewardController.getAllReward);
router.put('/reward/:id', rewardController.updateReward);
router.delete('/reward/:id', rewardController.deleteReward);


module.exports = router;
