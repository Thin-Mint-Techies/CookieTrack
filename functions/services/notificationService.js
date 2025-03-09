const { messaging } = require('../firebaseConfig'); // Import Firebase config


// Have not tested
class NotificationService {
  static async sendNotificationToUser(userId, title, body, data = {}) {
    try {
      const message = {
        notification: {
          title: title,
          body: body,
        },
        data: data,
        token: await this.getUserDeviceToken(userId),
      };
      const response = await messaging.send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  static async getUserDeviceToken(userId) {
    try {
      const userDoc = await Firestore.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      return userData.deviceToken;
    } catch (error) {
      console.error('Error retrieving user device token:', error);
      throw error;
    }
  }

  static async notifyParentOnChildAssignment(parentId, childName) {
    const title = 'New Child Assignment';
    const body = `A new child named ${childName} has been assigned to you.`;
    await this.sendNotificationToUser(parentId, title, body);
  }

  static async notifyParentOnNewReward(parentId, rewardName) {
    const title = 'New Reward Created';
    const body = `A new reward named ${rewardName} has been created.`;
    await this.sendNotificationToUser(parentId, title, body);
  }
}

module.exports = NotificationService;