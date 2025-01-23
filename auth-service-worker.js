import { initializeApp } from 'firebase/app';
import { getAuth, getIdToken } from 'firebase/auth';
import { getInstallations, getToken } from 'firebase/installations';

let firebaseConfig;

self.addEventListener('install', (event) => {
  const serializedFirebaseConfig = new URL(location).searchParams.get('firebaseConfig');
  if (!serializedFirebaseConfig) {
    throw new Error('Firebase Config object not found in service worker query string.');
  }
  firebaseConfig = JSON.parse(serializedFirebaseConfig);
  initializeApp(firebaseConfig); // Initialize once
  console.log('Service worker installed with Firebase config', firebaseConfig);
});

self.addEventListener('fetch', (event) => {
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const installations = getInstallations(app);
  const headers = new Headers(request.headers);

  try {
    const [authIdToken, installationToken] = await Promise.all([
      getAuthIdToken(auth),
      getToken(installations),
    ]);

    if (installationToken) headers.append('Firebase-Instance-ID-Token', installationToken);
    if (authIdToken) headers.append('Authorization', `Bearer ${authIdToken}`);
  } catch (error) {
    console.error('Error adding Firebase headers:', error);
  }

  const newRequest = new Request(request, { headers });
  return fetch(newRequest);
}

async function getAuthIdToken(auth) {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (!user) return resolve(null);
      resolve(await getIdToken(user));
    });
  });
}
