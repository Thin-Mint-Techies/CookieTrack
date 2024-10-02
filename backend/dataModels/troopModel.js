const db = require('../config/firebaseConfig');

class Troop {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.userName = data.userName || null;
    this.password = data.password;
    this.role = data.role;
    this.contactDetail = {
      address: data.contactDetail?.address || null,
      email: data.contactDetail?.email || null,
    };
    this.notificationPreference = {
      reminder: data.notificationPreference?.reminder || false,
      text: data.notificationPreference?.text || null,
      phone: data.notificationPreference?.phone || null,
      email: data.notificationPreference?.email || null,
    };
    this.appointments = data.appointments || [];
    this.assignedLeader = data.assignedLeader || [];
    this.role = data.role || 1;
    this.refreshToken = data.refreshToken || null;
  }

  /*THESE ARE JUST FUNCTION, NOT ENDPOINTS */
  static async createTroop(data) {
    const troop = new Troop(data);
    const res = await db.collection('troops').add(JSON.parse(JSON.stringify(troop)));
    return res.id;
  }

  static async getTroop() {
    const snapshot = await db.collection('troops').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getTroopById(id) {
    const doc = await db.collection('troops').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async updateTroop(id, data) {
    const troopData = new Troop(data);
    await db.collection('troops').doc(id).update(JSON.parse(JSON.stringify(troopData)));
  }

  static async deleteTroop(id) {
    await db.collection('').doc(id).delete();
  }
}

module.exports = Troop;
