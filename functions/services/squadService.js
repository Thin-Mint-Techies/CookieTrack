const { Firestore } = require('../firebaseConfig');


const createSquad = async ({ squadName, creatorId, }) => {
    try {
        const newsquadRef = Firestore.collection('squad').doc();
        const accessId = [creatorId];
        await newsquadRef.set({
            squadName,
            creatorId, 
            accessId,
            troopersId: [],
            totalSaleData: [], // get all data from the trooopers
        });
        return newsquadRef.id;
    } catch (error) {
        throw new Error(error, `Error creating squad: ${error.message}`);
    }
};


const getSquad = async (id) => {
    try {
        const squadRef = Firestore.collection('squad').doc(id);
        const doc = await squadRef.get();
        if (!doc.exists) {
            throw new Error('Squad not found');
        }
        return doc.data();
    } catch (error) {
        throw new Error(`Error fetching squad: ${error.message}`);
    }
};

const updateSquad = async (id, updateData) => {
    try {
        const squadRef = Firestore.collection('squad').doc(id);
        await squadRef.update(updateData);
        return { message: 'Squad updated successfully' };
    } catch (error) {
        throw new Error(`Error updating squad: ${error.message}`);
    }
};

const deleteSquad = async (id) => {
    try {
        const squadRef = Firestore.collection('squad').doc(id);
        await squadRef.delete();
        return { message: 'Squad deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting squad: ${error.message}`);
    }
};

module.exports = {
    createSquad,
    getSquad,
    updateSquad,
    deleteSquad,
}