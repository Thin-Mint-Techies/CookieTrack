const { Firestore } = require('../firebaseConfig');
const { saleDataformatforTrooper } = require('../dataFormat');


const createSaleData = async ({ trooperId, trooperName, orderId, cookieData, totalMoneyMade, totalBoxesSold }) => {
  try {
    const newSaleDataRef = Firestore.collection('saleData').doc();
    const newSaleData = {
      ...saleDataformatforTrooper,
      trooperId,
      trooperName,
      orderId,
      cookieData,
      totalMoneyMade,
      totalBoxesSold,
    };
    await newSaleDataRef.set(newSaleData);
    return newSaleDataRef.id;
  } catch (error) {
    throw new Error(`Failed to create sale data: ${error.message}`);
  }
};


const getSaleData = async (id) => {
  try {
    const saleDataRef = Firestore.collection('saleData').doc(id);
    const saleDataSnapshot = await saleDataRef.get();
    if (!saleDataSnapshot.exists) {
      throw new Error('Sale data not found');
    }
    return saleDataSnapshot.data();
  } catch (error) {
    throw new Error(`Error fetching sale data: ${error.message}`);
  }
};


const updateSaleData = async (id, { trooperId, trooperName, orderId, cookieData, totalMoneyMade, totalBoxesSold }) => {
  try {
    const saleDataRef = Firestore.collection('saleData').doc(id);
    const updatedSaleData = {
      trooperId,
      trooperName,
      orderId,
      cookieData,
      totalMoneyMade,
      totalBoxesSold,
    };
    await saleDataRef.update(updatedSaleData);
    return { message: 'Sale data updated successfully' };
  } catch (error) {
    throw new Error(`Error updating sale data: ${error.message}`);
  }
};

const getAllSaleDatasByTrooperId = async (id) => {
  try {
    // Query the troopers collection where assignedParent matches the userId
    const snapshot = await Firestore.collection('saleData').where('trooperId', '==', id).get();
    if (snapshot.empty) {
      throw new Error('No troopers found for the given user ID');
    }

    // Map the fetched documents to an array of trooper data
    const troopers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return troopers;
  } catch (error) {
    throw new Error(`Error fetching troopers saleData by id: ${error.message}`);
  }
};


const deleteSaleData = async (id) => {
  try {
    const saleDataRef = Firestore.collection('saleData').doc(id);
    await saleDataRef.delete();
    return { message: 'Sale data deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting sale data: ${error.message}`);
  }
};

module.exports = {
  createSaleData,
  getSaleData,
  updateSaleData,
  deleteSaleData,
  getAllSaleDatasByTrooperId
};