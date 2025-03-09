const { Firestore } = require('../firebaseConfig');

const createCookie = async ({ variety, description, price }) => {
  try {
    // Check if a cookie with the same name already exists
    const existingCookieSnapshot = await Firestore.collection('cookies')
      .where('name', '==', name)
      .get();

    if (!existingCookieSnapshot.empty) {
      throw new Error(`Cookie with name "${name}" already exists`);
    }
    const newCookieRef = Firestore.collection('cookies').doc();
    await newCookieRef.set({
      variety,
      description,
      price,
    });
    return newCookieRef.id;
  } catch (error) {
    throw new Error(`Error creating cookie: ${error.message}`);
  }
};


const getAllCookies = async () => {
  try {
    const snapshot = await Firestore.collection('cookies').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No cookies found');
  } catch (error) {
    throw new Error(`Error fetching all cookie: ${error.message}`);
  }
};

const updateCookie = async (id, { name, description, price }) => {
  try {
    // Check if a cookie with the same name already exists
    const existingCookieSnapshot = await Firestore.collection('cookies')
      .where('name', '==', name)
      .get();

    if (!existingCookieSnapshot.empty) {
      const existingCookie = existingCookieSnapshot.docs[0];
      if (existingCookie.id !== id) {
        throw new Error(`Cookie with name "${name}" already exists`);
      }
    }

    const ref = Firestore.collection('cookies').doc(id);
    await ref.update({
      name,
      description,
      price,
    });
    return { message: 'Cookie updated successfully' };
  } catch (error) {
    throw new Error(`Error updating cookie: ${error.message}`);
  }
};

const deleteCookie = async (id) => {
  try {
    const ref = Firestore.collection('cookies').doc(id);
    await ref.delete();
    return { message: 'Cookie deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting cookie: ${error.message}`);
  }
};



module.exports = {
  createCookie,
  getAllCookies,
  updateCookie,
  deleteCookie,
};
