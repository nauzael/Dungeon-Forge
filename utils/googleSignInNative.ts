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
    console.log('[GoogleSignInNative] Calling native plugin...');
    const result = await GoogleSignIn.signInWithGoogle();
    console.log('[GoogleSignInNative] Result received:', {
      email: result.email,
      hasToken: !!result.idToken
    });
    return result;
  } catch (error) {
    console.error('[GoogleSignInNative] Native plugin error:', error);
    throw error;
  }
}

/**
 * Sign out from Google on native
 */
export async function signOutGoogleNative(): Promise<void> {
  try {
    console.log('[GoogleSignInNative] Signing out...');
    await GoogleSignIn.signOut();
    console.log('[GoogleSignInNative] Sign-out complete');
  } catch (error) {
    console.error('[GoogleSignInNative] Sign-out error:', error);
    throw error;
  }
}
