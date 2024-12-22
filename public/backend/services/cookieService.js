const { Firestore } = require('../config/firebaseConfig');

// Service to create a new cookie
const createCookie = async ({ name, description, price }) => {
  try {
    const newCookieRef = Firestore.collection('cookies').doc();
    await newCookieRef.set({
      name,
      description,
      price,
    });
    return newCookieRef.id;
  } catch (error) {
    throw new Error('Error creating cookie');
  }
};

// Service to get all cookies
const getAllCookies = async () => {
  try {
    const snapshot = await Firestore.collection('cookies').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No cookies found');
  } catch (error) {
    throw new Error('Error fetching cookies');
  }
};

// Service to update a cookie by ID
const updateCookie = async (id, { name, description, price }) => {
  try {
    const ref = Firestore.collection('cookies').doc(id);
    await ref.update({
      name,
      description,
      price,
    });
    return { message: 'Cookie updated successfully' };
  } catch (error) {
    throw new Error('Error updating cookie');
  }
};

// Service to delete a cookie by ID
const deleteCookie = async (id) => {
  try {
    const ref = Firestore.collection('cookies').doc(id);
    await ref.delete();
    return { message: 'Cookie deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting cookie');
  }
};

module.exports = {
  createCookie,
  getAllCookies,
  updateCookie,
  deleteCookie,
};
