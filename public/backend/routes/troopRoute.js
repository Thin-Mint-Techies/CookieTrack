const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseConfig');

// Create a new troop
router.post('/troop', async (req, res) => {
  try {
    const { name, email, userName, password, role, contactDetail, notificationPreference, assignedLeader, refreshToken } = req.body;

    const newTroopRef = db.ref('troops').push(); // Adds a new record under 'troops'
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

    res.status(201).json({ id: newTroopRef.key });
  } catch (error) {
    res.status(500).json({ message: 'Error creating troop', error });
  }
});

// Get all troops
router.get('/troop', async (req, res) => {
  try {
    const ref = db.ref('troops');
    const snapshot = await ref.once('value');
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
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
    const ref = db.ref(`troops/${id}`);
    const snapshot = await ref.once('value');
    if (snapshot.exists()) {
      res.status(200).json({ id: snapshot.key, ...snapshot.val() });
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
  const { name, email, userName, password, role, contactDetail, notificationPreference, appointments, assignedLeader, refreshToken } = req.body;

  try {
    const ref = db.ref(`troops/${id}`);
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
    const ref = db.ref(`troops/${id}`);
    await ref.remove();
    res.status(200).json({ message: 'Troop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting troop', error });
  }
});

// Delete all troops
router.delete('/troops', async (req, res) => {
  try {
    const ref = db.ref('troops');
    await ref.remove();  // Removes the entire 'troops' node
    res.status(200).json({ message: 'All troops deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all troops', error });
  }
});
module.exports = router;
