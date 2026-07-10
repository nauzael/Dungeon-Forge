import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signInWithCredential } from 'firebase/auth';
import { auth } from './init';
import { signInWithGoogleNative, signOutGoogleNative } from '../googleSignInNative';

// Firebase Auth helpers
export const signInWithGooglePopup = async () => {
  if (!auth) throw new Error('Auth not initialized');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const signInWithGoogleRedirect = async () => {
  if (!auth) throw new Error('Auth not initialized');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithRedirect(auth, provider);
};

/**
 * Native Google Sign-In for Android using Google Play Services
 * Exchanges ID token from native plugin for Firebase credential
 */
async function signInWithGoogleNativeFirebase() {
  try {
    if (!auth) throw new Error('Auth not initialized');

    const isStaleCredentialError = (error: unknown): boolean => {
      const message = error instanceof Error ? error.message : String(error);
      return (
        message.includes('auth/invalid-credential') ||
        message.toLowerCase().includes('stale to sign-in')
      );
    };

    const exchangeWithFirebase = async (idToken: string) => {
      const credential = GoogleAuthProvider.credential(idToken);

      const credentialPromise = signInWithCredential(auth, credential);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Credential exchange timeout after 10 seconds')), 10000)
      );

      return Promise.race([credentialPromise, timeoutPromise]);
    };

    // Force clean session to avoid reusing old ID tokens on Android.
    try {
      await signOutGoogleNative();
    } catch (signOutErr) {
    }

    // Step 1: Get ID token from native Android plugin
    let nativeResult: unknown;
    try {
      nativeResult = await signInWithGoogleNative();
      const nativeObj = nativeResult as { email?: string; idToken?: string; displayName?: string };
    } catch (nativeErr) {
      const nativeErrObj = nativeErr as { message?: string; constructor?: { name?: string } };
      throw nativeErr;
    }

    const nativeResultObj = nativeResult as { idToken?: string };
    if (!nativeResultObj.idToken) {
      const errMsg = 'No ID token returned from native plugin - OAuth flow incomplete';
      throw new Error(errMsg);
    }

    // Step 2: Exchange credential in Firebase (with one stale-token retry)
    let result: unknown;
    try {
      result = await exchangeWithFirebase(nativeResultObj.idToken);
      const resultObj = result as { user: { email: string; uid: string } };
    } catch (exchangeErr) {
      if (!isStaleCredentialError(exchangeErr)) {
        throw exchangeErr;
      }

      try {
        await signOutGoogleNative();
      } catch (retrySignOutErr) {
      }

      // Step 2-retry: Get a fresh token from native and try again
      const retryNativeResult = (await signInWithGoogleNative()) as { idToken?: string };
      if (!retryNativeResult?.idToken) {
        throw new Error('No fresh ID token returned during stale-token retry');
      }

      result = await exchangeWithFirebase(retryNativeResult.idToken!);
      const retryResultObj = result as { user: { email: string; uid: string } };
    }

    const finalResultObj = result as {
      user: {
        uid: string;
        email: string | null;
        photoURL: string | null;
        displayName: string | null;
      };
    };
    return {
      data: {
        url: null,
        user: {
          id: finalResultObj.user.uid,
          email: finalResultObj.user.email,
          user_metadata: {
            avatar_url: finalResultObj.user.photoURL,
            full_name: finalResultObj.user.displayName,
          },
        },
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: { message: (error as Error).message },
    };
  }
}
