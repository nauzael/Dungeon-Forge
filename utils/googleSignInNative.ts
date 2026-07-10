import { registerPlugin } from '@capacitor/core';

/**
 * Native Google Sign-In bridge using Capacitor
 * Calls native Android Google Sign-In plugin to open system account chooser
 */
export interface GoogleSignInResult {
  idToken: string;
  email: string;
  displayName: string;
  photoUrl: string;
}

export interface GoogleSignInPlugin {
  signInWithGoogle(): Promise<GoogleSignInResult>;
  signOut(): Promise<void>;
}

// Register the native plugin
const GoogleSignIn = registerPlugin<GoogleSignInPlugin>('GoogleSignIn');

/**
 * Sign in with native Google using Google Play Services
 * Opens system account chooser on Android
 * @returns ID token for Firebase credential exchange
 */
export async function signInWithGoogleNative(): Promise<GoogleSignInResult> {
  try {
    
    const result = await GoogleSignIn.signInWithGoogle();
    
    
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Sign out from Google on native
 */
export async function signOutGoogleNative(): Promise<void> {
  try {
    await GoogleSignIn.signOut();
  } catch (error) {
    throw error;
  }
}
