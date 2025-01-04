const rewardService = require('../services/rewardService');
/*START OF RewardER CONTROLLER*/

// Controller for creating a new Reward
const createReward = async (req, res) => {
  try {
    const RewardId = await rewardService.createReward(req.body);
    res.status(201).json({ id: RewardId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all Rewards
const getAllReward = async (req, res) => {
  try {
    const Rewards = await rewardService.getAllRewards();
    res.status(200).json(Rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller for updating a Reward
const updateReward = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await rewardService.updateReward(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a Reward
const deleteReward = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await rewardService.deleteReward(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting all Rewards
/*
const deleteAllReward = async (req, res) => {
  try {
    const result = await RewardService.deleteAllReward();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

const selectRewardForTroop = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: Missing ID token' });
  }

  const { troopId, rewardId } = req.body;

  try {
    const result = await rewardService.selectRewardForTroop(idToken, troopId, rewardId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createReward,
  getAllReward,
  updateReward,
  deleteReward,
  selectRewardForTroop
};
