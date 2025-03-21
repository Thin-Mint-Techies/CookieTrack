const express = require('express');
const rewardController = require('../controllers/rewardController');
const router = express.Router();
const { requireLogin, checkRole, checkUserOwnership } = require('../utils/roleCheck');

//requireLogin, checkRole(['leader']),
router.post('/reward',  rewardController.createReward);
//requireLogin, checkRole(['leader']), 
router.get('/reward', rewardController.getAllReward);
//requireLogin, checkRole(['leader']),
router.put('/reward/:id', rewardController.updateReward);
//requireLogin, checkRole(['leader']), 
router.delete('/reward/:id', rewardController.deleteReward);
//requireLogin, 
router.post('/selectReward/:id', rewardController.selectRewardForTroop);



module.exports = router;
