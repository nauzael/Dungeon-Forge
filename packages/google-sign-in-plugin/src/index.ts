import { registerPlugin } from '@capacitor/core';

import type { GoogleSignInPlugin } from './definitions';

const GoogleSignIn = registerPlugin<GoogleSignInPlugin>('GoogleSignIn', {
  android: {
    paths: ['com.tupaquete.dndcompanion.GoogleSignInPlugin'],
  },
});

export * from './definitions';
export { GoogleSignIn };
