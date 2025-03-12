const Firestore = admin.firestore();
const functions = require('firebase-functions');
const { moveCompletedOrders, archiveOrders } = require('./services/orderService');

// Schedule the moveCompletedOrders function to run daily
const moveCompletedOrders = functions.pubsub.schedule('every week').onRun(async (context) => {
    await archiveOrders();
    console.log('Scheduled function executed: moveCompletedOrders');
});

const updateMonthlySales = async () => {
    try {
        const cookiesRef = Firestore.collection('cookies');
        const snapshot = await cookiesRef.get();

        snapshot.forEach(async (doc) => {
            const data = doc.data();
            const { soldAmount } = data;

            // Add soldAmount to the monthlySold array
            const currentMonth = new Date().getMonth();
            const monthlySold = data.monthlySold || [];
            monthlySold[currentMonth] = soldAmount;

            // Reset soldAmount and update monthlySold
            await cookiesRef.doc(doc.id).update({
                soldAmount: 0,
                monthlySold,
            });
        });

        console.log('Monthly sales data updated successfully');
    } catch (error) {
        console.error('Error updating monthly sales data:', error.message);
    }
};

module.exports = { 
    updateMonthlySales, 
    moveCompletedOrders,
};
