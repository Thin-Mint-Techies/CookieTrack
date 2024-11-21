const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseConfig');
const { Firestore } = require('../config/firebaseConfig');

// Create a new troop
router.post('/troop', async (req, res) => {
  try {
    const { name, email, userName, password, role, contactDetail, notificationPreference, assignedLeader, refreshToken } = req.body;

    // Firestore collection reference
    const newTroopRef = Firestore.collection('troops').doc();  // Create a new document in 'troops' collection
    await newTroopRef.set({
      name,
      email,
      userName: userName || null,
      password,
      role: role || 1,
      contactDetail: {
        address: contactDetail?.address || null,
        email: contactDetail?.email || null,
      },
      notificationPreference: {
        reminder: notificationPreference?.reminder || false,
        text: notificationPreference?.text || null,
        phone: notificationPreference?.phone || null,
        email: notificationPreference?.email || null,
      },
      assignedLeader: assignedLeader || [],
      refreshToken: refreshToken || null,
    });
    res.status(201).json({ id: newTroopRef.id });  // Firestore uses `id` for document identifiers
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating troop', error });
  }
});

// Get all troops
router.get('/troop', async (req, res) => {
  try {
    const snapshot = await Firestore.collection('troops').get(); // Get all troops in the collection
    if (!snapshot.empty) {
      const troops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(troops);
    } else {
      res.status(404).json({ message: 'No troops found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching troops', error });
  }
});

// Get a specific troop by ID
router.get('/troop/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Firestore.collection('troops').doc(id).get();
    if (doc.exists) {
      res.status(200).json({ id: doc.id, ...doc.data() });
    } else {
      res.status(404).json({ message: 'Troop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching troop', error });
  }
});

// Update a troop by ID
router.put('/troop/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, userName, password, role, contactDetail, notificationPreference, assignedLeader, refreshToken } = req.body;

  try {
    const ref = Firestore.collection('troops').doc(id);  // Get document by ID
    await ref.update({
      name,
      email,
      userName,
      password,
      role,
      contactDetail: {
        address: contactDetail?.address || null,
        email: contactDetail?.email || null,
      },
      notificationPreference: {
        reminder: notificationPreference?.reminder || false,
        text: notificationPreference?.text || null,
        phone: notificationPreference?.phone || null,
        email: notificationPreference?.email || null,
      },
      assignedLeader,
      refreshToken,
    });

    res.status(200).json({ message: 'Troop updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating troop', error });
  }
});

// Delete a troop by ID
router.delete('/troop/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ref = Firestore.collection('troops').doc(id);  // Get document by ID
    await ref.delete();
    res.status(200).json({ message: 'Troop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting troop', error });
  }
});

// Delete all troops
router.delete('/troops', async (req, res) => {
  try {
    const snapshot = await Firestore.collection('troops').get();
    const batch = Firestore.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);  // Delete each document in the batch
    });

    await batch.commit();
    res.status(200).json({ message: 'All troops deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all troops', error });
  }
});

module.exports = router;
