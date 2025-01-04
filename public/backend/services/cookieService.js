const { Firestore } = require('../config/firebaseConfig');

// Service to create a new cookie
const createCookie = async ({ name, description, price }) => {
  try {
    const newCookieRef = Firestore.collection('cookies').doc();
    await newCookieRef.set({
      name,
      description,
      price,
      soldAmount: 0, // Total Sold
      monthlySold: {}, // Monthly Sale, is an array of month that contain ammount sold that month
    });
    return newCookieRef.id;
  } catch (error) {
    throw new Error(`Error creating cookie: ${error.message}`);
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



//Have not test
const getMonthlyCookies = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;

    const snapshot = await Firestore.collection('cookies').get();
    if (snapshot.empty) {
      return 'No cookies found';
    }

    const cookies = snapshot.docs.map((doc) => {
      const data = doc.data();
      const monthlySold = data.monthlySold || {};
      const currentMonthSold = monthlySold[currentMonth] || 0; // Directly get the current month's sales
      return { id: doc.id, name: data.name, currentMonthSold };
    });

    // Sort by sales and return the top 3
    const sortedCookies = cookies.sort((a, b) => b.currentMonthSold - a.currentMonthSold);
    return sortedCookies.slice(0, 3);
  } catch (error) {
    throw new Error(`Error fetching monthly cookies: ${error.message}`);
  }
};



//Have not test
const updateMonthlySales = async () => {
  try {
    const snapshot = await Firestore.collection('cookies').get();

    if (!snapshot.empty) {
      const batch = Firestore.batch();
      const currentMonth = new Date().getMonth() + 1;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const monthlySold = data.monthlySold || {};
        monthlySold[currentMonth] = (monthlySold[currentMonth] || 0) + data.soldAmount;

        // Reset soldAmount for the next month
        batch.update(doc.ref, { monthlySold, soldAmount: 0 });
      });

      await batch.commit();
      console.log("Monthly sales updated successfully");
    }
  } catch (error) {
    console.error(`Error updating monthly sales: ${error.message}`);
  }
};

const createCookieManager = async (idToken, { name, description, price }) => {
  try {
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userRole = decodedToken.role;

    // Check if the user is a manager
    if (userRole !== 'manager') {
      throw new Error('Unauthorized: Only managers can create cookies');
    }

    // Add the cookie to Firestore
    const newCookieRef = Firestore.collection('cookies').doc();
    await newCookieRef.set({
      name,
      description,
      price,
      createdAt: new Date().toISOString(),
    });

    return newCookieRef.id;
  } catch (error) {
    throw new Error('Error creating cookie: ' + error.message);
  }
};




module.exports = {
  createCookie,
  getAllCookies,
  updateCookie,
  deleteCookie,
  getMonthlyCookies,
  updateMonthlySales,
  createCookieManager
};
