const { Firestore } = require('../config/firebaseConfig');

// Service to create a new Reward
const createReward = async ({ name, description, price }) => {
  try {
    const newRewardRef = Firestore.collection('rewards').doc();
    await newRewardRef.set({
      name,
      description
    });
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
const updateReward = async (id, { name, description, price }) => {
  try {
    const ref = Firestore.collection('rewards').doc(id);
    await ref.update({
      name,
      description,
    });
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

module.exports = {
  createReward,
  getAllRewards,
  updateReward,
  deleteReward,
};
