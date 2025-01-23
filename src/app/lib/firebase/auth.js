import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    onAuthStateChanged as _onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./clientApp";

export function onAuthStateChanged(cb) {
    return _onAuthStateChanged(auth, cb);
}

export async function signInWithEmail(email, password, rememberMe) {
    try {
        const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistenceType);
        await signInWithEmailAndPassword(auth, email, password);
    } catch(error) {
        console.error("Error signing in with Email:", error);
    }
}

export async function createUserWithEmail(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch(error) {
        console.error("Error creating an email account:", error);
    }
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error signing in with Google:", error);
    }
}

export async function signOut() {
    try {
        return auth.signOut();
    } catch (error) {
        console.error("Error signing out:", error);
    }
}