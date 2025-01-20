const { cert } = require('firebase-admin/app');
const functions = require('firebase-functions');

// Export Firebase Admin credentials from Firebase Functions config
const firebaseConfig = {
  credential: cert({
    type: functions.config().admin.type,
    project_id: functions.config().admin.project_id,
    private_key_id: functions.config().admin.private_key_id,
    private_key: functions.config().admin.private_key.replace(/\\n/g, '\n'),
    client_email: functions.config().admin.client_email,
    client_id: functions.config().admin.client_id,
    auth_uri: functions.config().admin.auth_uri,
    token_uri: functions.config().admin.token_uri,
    auth_provider_x509_cert_url: functions.config().admin.auth_provider_cert_url,
    client_x509_cert_url: functions.config().admin.client_cert_url,
    universe_domain: functions.config().admin.universe_domain,
  }),
  databaseURL: functions.config().admin.db_url,
  storageBucket: functions.config().admin.storage_bucket,
};


module.exports = firebaseConfig;