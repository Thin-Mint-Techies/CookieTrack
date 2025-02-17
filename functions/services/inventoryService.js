const { Firestore } = require('../firebaseConfig');

const createInventory = async ({ ownerId, trooperId, trooperName, trooperNumber, inventory }) => {
  try {
    const newInventoryRef = Firestore.collection('inventory').doc();
    await newInventoryRef.set({
      ownerId: '', // id of the parent of the trooper
      trooperName: '',
      trooperId: '',
      trooperNumber: '',
      inventory: [{
        variety: '',
        cases: 0,
        packages: 0,
      },],
    });
    return newInventoryRef.id;
  } catch (error) {
    throw new Error(`Error creating Inventory: ${error.message}`);
  }
};


const getAllInventorys = async () => {
  try {
    const snapshot = await Firestore.collection('inventory').get();
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    throw new Error('No Inventorys found');
  } catch (error) {
    throw new Error(`Error fetching all Inventory: ${error.message}`);
  }
};

const updateInventory = async (id, { name, description, price }) => {
  try {
    const ref = Firestore.collection('inventory').doc(id);
    await ref.update({
      name,
      description,
      price,
    });
    return { message: 'Inventory updated successfully' };
  } catch (error) {
    throw new Error(`Error updating Inventory: ${error.message}`);
  }
};

const deleteInventory = async (id) => {
  try {
    const ref = Firestore.collection('inventory').doc(id);
    await ref.delete();
    return { message: 'Inventory deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting Inventory: ${error.message}`);
  }
};




module.exports = {
  createInventory,
  getAllInventorys,
  updateInventory,
  deleteInventory,
};
