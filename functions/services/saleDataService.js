const { Firestore } = require('../firebaseConfig');


const createSaleData = async ({ ownerId, trooperId, trooperName }) => {
  try {
    const newSaleDataRef = Firestore.collection('saleData').doc();

    await Firestore.runTransaction(async (transaction) => {
      // Check for duplicate orderId (optional)
      /* const existingSaleDataSnapshot = await Firestore.collection('saleData')
        .where('orderId', 'array-contains', orderId)
        .get();

      if (!existingSaleDataSnapshot.empty) {
        throw new Error('Sale data with this orderId already exists');
      } */

      const newSaleData = {
        ownerId,
        trooperId,
        trooperName,
        orderId: [],
        cookieData: [],
        totalMoneyMade: "$0.00",
        totalBoxesSold: 0,
      };

      // Create the new sale data document
      transaction.set(newSaleDataRef, newSaleData);
    });

    return newSaleDataRef.id;
  } catch (error) {
    throw new Error(`Failed to create sale data: ${error.message}`);
  }
};

const updateSaleData = async (saleDataId, { orderId, orderContent }) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const saleDataRef = Firestore.collection('saleData').doc(saleDataId);
      const saleDataDoc = await transaction.get(saleDataRef);
      if (!saleDataDoc.exists) {
        throw new Error('Sale data not found');
      }

      const saleData = saleDataDoc.data();
      const updatedSaleData = {
        ...saleData,
        orderId: [...saleData.orderId, orderId],
        totalMoneyMade: (parseFloat(saleData.totelMoneyMade.replace(/[^0-9.-]+/g, "")) + parseFloat(orderContent.totalCost.replace(/[^0-9.-]+/g, ""))).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        }),
      };

      //Update cookie data
      orderContent.cookies.forEach(cookie => {
        const existingCookie = updatedSaleData.cookieData.find(item => item.varietyId === cookie.varietyId);
        if (existingCookie) {
          existingCookie.boxTotal += cookie.boxes;
          existingCookie.cookieTotalCost = (existingCookie.boxTotal * parseFloat(existingCookie.boxPrice.replace(/[^0-9.-]+/g, ""))).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          });
        } else {
          updatedSaleData.cookieData.push({
            varietyId: cookie.varietyId,
            variety: cookie.variety,
            boxPrice: cookie.boxPrice,
            boxTotal: cookie.boxes,
            cookieTotalCost: (cookie.boxes * parseFloat(cookie.boxPrice.replace(/[^0-9.-]+/g, ""))).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            }),
          });
        }
      });

      // Calculate new boxes from this order
      const newBoxesTotal = orderContent.cookies.reduce((total, cookie) => total + cookie.boxes, 0);

      // Add new boxes to existing totalBoxesSold
      updatedSaleData.totalBoxesSold = (saleData.totalBoxesSold || 0) + newBoxesTotal;

      transaction.update(saleDataRef, updatedSaleData);
    });

    return { message: 'Sale data updated successfully' };
  } catch (error) {
    throw new Error(`Failed to update sale data: ${error.message}`);
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

const deleteSaleData = async (id) => {
  try {
    await Firestore.runTransaction(async (transaction) => {
      const saleDataRef = Firestore.collection('saleData').doc(id);

      // Fetch the document within the transaction
      const saleDataDoc = await transaction.get(saleDataRef);
      if (!saleDataDoc.exists) {
        throw new Error('Sale data not found');
      }

      // Delete the document within the transaction
      transaction.delete(saleDataRef);
    });

    return { message: 'Sale data deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting sale data: ${error.message}`);
  }
};

const getSaleDatasByTrooperId = async (id) => {
  try {
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

const getAllSaleData = async () => {
  try {
    const snapshot = await Firestore.collection('saleData').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No sale data found');
  } catch (error) {
    throw new Error(`Error fetching all sale data: ${error.message}`);
  }
};

const getSaleDataByOwnerId = async (ownerId) => {
  try {
    const snapshot = await Firestore.collection('saleData').where('ownerId', '==', ownerId).get();
    if (snapshot.empty) {
      throw new Error('No sale data found for the given owner ID');
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error fetching sale data by owner ID: ${error.message}`);
  }
};



module.exports = {
  createSaleData,
  getSaleData,
  updateSaleData,
  deleteSaleData,
  getSaleDatasByTrooperId,
  getSaleDataByOwnerId,
  getAllSaleData
};