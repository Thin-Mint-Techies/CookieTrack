const { Firestore } = require('../firebaseConfig');

// Service to create a new Reward
const createReward = async ({ name, description, boxesNeeded,imageName }) => {
  try {
    const newRewardRef = Firestore.collection('rewards').doc();
    await newRewardRef.set({name,description,boxesNeeded,imageName});
    return newRewardRef.id;
  } catch (error) {
    throw new Error('Error creating Reward');
  }
};

// Service to get all Rewards
const getAllRewards = async () => {
  try {
    const snapshot = await Firestore.collection('rewards').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No Rewards found');
  } catch (error) {
    throw new Error('Error fetching Rewards');
  }
};

// Service to update a Reward by ID
const updateReward = async (id, { name, description, boxesNeeded,imageName }) => {
  try {
    const ref = Firestore.collection('rewards').doc(id);
    await ref.update({name,description,boxesNeeded,imageName });
    return { message: 'Reward updated successfully' };
  } catch (error) {
    throw new Error('Error updating Reward');
  }
};

// Service to delete a Reward by ID
const deleteReward = async (id) => {
  try {
    const ref = Firestore.collection('rewards').doc(id);
    await ref.delete();
    return { message: 'Reward deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting Reward');
  }
};


// Allow user to select a reward for a specific troop
const selectRewardForTroop = async (troopId, rewardId, userId) => {
  try {
    // Validate trooper association
    const trooperRef = Firestore.collection('troopers').doc(troopId);
    const trooperDoc = await trooperRef.get();

    if (!trooperDoc.exists) {
      throw new Error('Trooper not found');
    }

    const trooperData = trooperDoc.data();

    // Validate reward existence
    const rewardRef = Firestore.collection('rewards').doc(rewardId);
    const rewardDoc = await rewardRef.get();

    if (!rewardDoc.exists) {
      throw new Error('Reward not found');
    }

    const rewardData = rewardDoc.data();

    // Add reward selection to the trooper's currentReward array
    const currentReward = trooperData.currentReward || [];
    currentReward.push({
      ...rewardDataFormat,
      ...rewardData,
      selectedBy: userId,
      selectedAt: new Date().toISOString(),
    });

    await trooperRef.update({ currentReward });

    return { message: 'Reward selected successfully for the trooper' };
  } catch (error) {
    throw new Error('Error selecting reward: ' + error.message);
  }
};



module.exports = {
  createReward,
  getAllRewards,
  updateReward,
  deleteReward,
  selectRewardForTroop
};
