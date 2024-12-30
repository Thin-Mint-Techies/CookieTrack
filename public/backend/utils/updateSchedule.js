const admin = require('firebase-admin');
const Firestore = admin.firestore();

const updateMonthlySales = async () => {
  try {
    const snapshot = await Firestore.collection('cookies').get();

    if (!snapshot.empty) {
      const batch = Firestore.batch();
      const currentMonth = new Date().getMonth() + 1;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const monthlySold = data.monthlySold || {};

        // Update the current month's data
        monthlySold[currentMonth] = (monthlySold[currentMonth] || 0) + data.soldAmount;

        // Reset soldAmount for the next month
        batch.update(doc.ref, { monthlySold, soldAmount: 0 });
      });

      await batch.commit();
      console.log('Monthly sales updated successfully');
    } else {
      console.log('No cookies found to update.');
    }
  } catch (error) {
    console.error(`Error updating monthly sales: ${error.message}`);
  }
};

module.exports = updateMonthlySales;
