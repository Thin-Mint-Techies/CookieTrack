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

const createRewardManager = async (idToken, { title, pointsRequired }) => {
  try {
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userRole = decodedToken.role;

    // Check if the user is a manager
    if (userRole !== 'manager') {
      throw new Error('Unauthorized: Only managers can create rewards');
    }

    // Add the reward to Firestore
    const newRewardRef = Firestore.collection('rewards').doc();
    await newRewardRef.set({
      title,
      pointsRequired,
      createdAt: new Date().toISOString(),
    });

    return newRewardRef.id;
  } catch (error) {
    throw new Error('Error creating reward: ' + error.message);
  }
};


// Allow user to select a reward for a specific troop
const selectRewardForTroop = async (idToken, troopId, rewardId) => {
  try {
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Validate troop association
    const troopRef = Firestore.collection('troops').doc(troopId);
    const troopDoc = await troopRef.get();

    if (!troopDoc.exists) {
      throw new Error('Troop not found');
    }

    const troopData = troopDoc.data();
    if (!troopData.parentIds.includes(userId)) {
      throw new Error('Unauthorized: You are not associated with this troop');
    }

    // Validate reward existence
    const rewardRef = Firestore.collection('rewards').doc(rewardId);
    const rewardDoc = await rewardRef.get();

    if (!rewardDoc.exists) {
      throw new Error('Reward not found');
    }

    // Add reward selection to the troop
    const selectedRewards = troopData.selectedRewards || [];
    selectedRewards.push({
      rewardId,
      selectedBy: userId,
      selectedAt: new Date().toISOString(),
    });

    await troopRef.update({ selectedRewards });

    return { message: 'Reward selected successfully for the troop' };
  } catch (error) {
    throw new Error('Error selecting reward: ' + error.message);
  }
};





module.exports = {
  createReward,
  getAllRewards,
  updateReward,
  deleteReward,
  createRewardManager,
  selectRewardForTroop
};
