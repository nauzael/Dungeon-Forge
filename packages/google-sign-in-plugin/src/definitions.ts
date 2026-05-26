import type { PluginListenerHandle } from '@capacitor/core';

export interface GoogleSignInResult {
  idToken: string;
  email: string;
  displayName: string;
  photoUrl: string;
}

export interface GoogleSignInPlugin {
  /**
   * Sign in with Google using native Google Play Services
   */
  signInWithGoogle(): Promise<GoogleSignInResult>;

  /**
   * Sign out from Google
   */
  signOut(): Promise<void>;
}
