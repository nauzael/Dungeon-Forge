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
    console.log('[GoogleSignInNative] ====== NATIVE PLUGIN CALL START ======');
    console.log('[GoogleSignInNative] Calling native plugin...');
    
    const result = await GoogleSignIn.signInWithGoogle();
    
    console.log('[GoogleSignInNative] ✓ Plugin returned result!');
    console.log('[GoogleSignInNative]   - Email: ' + (result?.email || 'NULL'));
    console.log('[GoogleSignInNative]   - IdToken: ' + (result?.idToken ? 'YES (length=' + result.idToken.length + ')' : 'NO'));
    console.log('[GoogleSignInNative]   - DisplayName: ' + (result?.displayName || 'NULL'));
    console.log('[GoogleSignInNative]   - PhotoUrl: ' + (result?.photoUrl ? 'YES' : 'NO'));
    
    return result;
  } catch (error) {
    console.error('[GoogleSignInNative] ❌ NATIVE PLUGIN FAILED!');
    console.error('[GoogleSignInNative]   - Error message: ' + (error as Error).message);
    console.error('[GoogleSignInNative]   - Error type: ' + ((error as { code?: string }).code || (error as Error).constructor.name));
    console.error('[GoogleSignInNative]   - Full error: ' + JSON.stringify(error));
    console.error('[GoogleSignInNative]   - Stack: ' + (error as Error).stack);
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
