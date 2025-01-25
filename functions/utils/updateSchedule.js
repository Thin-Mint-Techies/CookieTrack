const Firestore = admin.firestore();

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

module.exports = updateMonthlySales;
