const express = require('express');
const rewardController = require('../controllers/rewardController');
const router = express.Router();


router.post('/reward', rewardController.createReward);
router.get('/reward', rewardController.getAllReward);
router.put('/reward/:id', rewardController.updateReward);
router.delete('/reward/:id', rewardController.deleteReward);
router.post('/selectReward', rewardController.selectRewardForTroop);



module.exports = router;
