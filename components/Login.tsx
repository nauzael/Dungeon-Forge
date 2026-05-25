import React, { useState } from 'react';
import { supabase } from '../utils/firebase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

interface LoginProps {
  onLocalModeActivated?: (localMode: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLocalModeActivated }) => {
  // 🚀 V1.6 VERIFICATION - OAuth popup flow
  console.log('[V1.6] 🚀 Login component loaded - NEW POPUP FLOW');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check if Firebase is properly configured (not mock/placeholder values)
  const isMockMode = !import.meta.env.VITE_FIREBASE_PROJECT_ID || 
                     import.meta.env.VITE_FIREBASE_PROJECT_ID.includes('TU_PROYECTO') ||
                     !import.meta.env.VITE_FIREBASE_API_KEY ||
                     import.meta.env.VITE_FIREBASE_API_KEY.includes('TU_API_KEY');

  const handleLocalModeClick = () => {
    try {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      localStorage.setItem('df_local_mode', 'true');
      localStorage.setItem('df_session', JSON.stringify({ 
        user: 'Local Developer', 
        id: 'local-dev-mode',
        isLocalMode: true 
      }));
      console.log('[LocalMode] Activating local development mode...');
      onLocalModeActivated?.(true);
      // Reload to trigger App.tsx re-initialization
      window.location.reload();
    } catch (e) {
      console.error('[LocalMode] Failed to activate local mode:', e);
      alert('Failed to activate local mode: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleGoogleLogin = async () => {
    if (isMockMode) {
      alert("Google Login is not available in Mock Mode. Please set VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_API_KEY in .env");
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Detect platform
    const isNative = Capacitor.getPlatform() !== 'web';
    const redirectUrl = isNative
      ? 'com.tupaquete.dndcompanion://login-callback' 
      : window.location.origin;

    console.log('[Login] Starting OAuth flow');
    console.log('[Login] Platform:', isNative ? 'native (Capacitor)' : 'web');
    console.log('[Login] Redirect URL:', redirectUrl);
    console.log('[Login] Firebase Project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

    try {
      // For web: signInWithOAuth uses signInWithRedirect (will redirect to Google)
      // For mobile: We need to use a different approach with popups/custom handlers
      
      if (!isNative) {
        // Web platform: use redirect flow
        console.log('[Login] Using redirect OAuth flow for web');
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            queryParams: { prompt: 'select_account' }
          }
        });
        
        if (error) {
          console.error('[Login] OAuth error:', error.message);
          setLoading(false);
          setError('OAuth error: ' + error.message);
          alert("OAUTH ERROR: " + error.message);
          return;
        }
        
        // For redirect flow, the browser will navigate away
        // Loading state remains until page reloads with user
        console.log('[Login] Redirect flow initiated - waiting for Google OAuth...');
      } else {
        // Mobile: use popup flow for Capacitor (NO redirectTo, so firebase uses popup)
        console.log('[Login] Using POPUP OAuth flow for mobile');
        
        try {
          // Use signInWithOAuth WITHOUT redirectTo for Capacitor
          // This triggers popup flow in firebase.ts
          const result = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              // NO redirectTo for mobile - let firebase.ts use popup flow
              queryParams: { prompt: 'select_account' }
            }
          });
          
          const { error, data } = result as any;
          
          if (error) {
            console.error('[Login] OAuth error:', error.message);
            setLoading(false);
            setError('OAuth error: ' + error.message);
            return;
          }
          
          // SUCCESS path: Credential exchange completed
          if (data?.user) {
            console.log('[Login] OAuth succeeded for:', data.user.email);
            setLoading(false);  // ← CRITICAL: Clear loading state immediately
            // App.tsx onAuthStateChange will fire and navigate to CharacterSelect
          } else {
            console.log('[Login] OAuth response with no user, waiting for auth state change...');
          }
          
          // Safety timeout - if auth doesn't complete in 15 seconds, show error
          timeoutRef.current = setTimeout(() => {
            console.error('[Login] OAuth timeout - auth did not complete');
            setLoading(false);
            setError('Authentication timeout. Please try again.');
          }, 15000);
        } catch (popupError) {
          console.error('[Login] Redirect OAuth error:', popupError);
          
          // Fallback: Provide user with manual link
          setError('Automatic OAuth failed. Please try again.');
          setLoading(false);
          
          alert('Note: OAuth popups may not work in Capacitor. The app will automatically sign you in when you authorize Google in the system browser.');
        }
      }
    } catch (e) {
      console.error('[Login] Unexpected error:', e);
      alert(`GENERAL AUTH ERROR: ${e instanceof Error ? e.message : JSON.stringify(e)}`);
      setError(e instanceof Error ? e.message : String(e));
      setLoading(false);
    }
  };
  // Cleanup timeout on unmount or when navigating away
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/login_bg.png')",
          filter: "brightness(0.4) contrast(1.2)"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
      
      {/* Top Controls */}
      <div className="absolute top-8 right-8 z-20 flex gap-3">
        {isMockMode && (
          <div className="bg-amber-500/20 border border-amber-500/40 px-4 py-2 rounded-full text-[10px] font-black uppercase text-amber-200 backdrop-blur-xl flex items-center gap-2 shadow-lg">
            <span className="material-symbols-outlined text-sm">database_off</span>
            Local Mode
          </div>
        )}
      </div>

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="relative inline-block mb-8">
            {/* Logo Glow */}
            <div className="absolute inset-x-0 -bottom-4 bg-primary/40 blur-3xl h-12 w-full mx-auto rounded-full animate-pulse"></div>
            
            <button
              onClick={handleLocalModeClick}
              title="Click to enter Local Development Mode (no authentication required)"
              className="relative size-24 mx-auto rounded-3xl bg-primary flex items-center justify-center shadow-[0_20px_50px_rgba(255,102,0,0.3)] transform -rotate-3 hover:rotate-0 transition-all duration-500 active:scale-95 cursor-pointer hover:shadow-[0_20px_50px_rgba(255,102,0,0.5)] group"
            >
              <span className="material-symbols-outlined text-background-dark text-5xl font-black group-hover:animate-bounce">fort</span>
              
              {/* Tooltip hint */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-[10px] text-white/60 pointer-events-none">
                Local Mode
              </div>
            </button>
          </div>
          
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-3">
            Dungeon <span className="text-primary italic">Forge</span>
          </h1>
          <div className="h-1.5 w-16 bg-primary mx-auto rounded-full mb-6" />
          
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-4">
            Forge your destiny
          </p>
          
          {/* Local Mode Info */}
          <p className="text-primary/60 text-[11px] font-semibold mt-6 italic">
            💡 Click the logo to enter Local Development Mode (no login required)
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group animate-fadeIn">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 size-48 bg-primary/10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 size-48 bg-primary/5 blur-3xl rounded-full"></div>

          <div className="relative space-y-8">
            <div className="text-center">
              <h2 className="text-white text-lg font-black uppercase tracking-widest mb-2">
                Welcome, Adventurer
              </h2>
              <p className="text-white/40 text-xs font-medium italic">
                Your journey begins with a click
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-[11px] font-bold flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined text-base">report</span>
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              aria-label="Login with Google"
              className="w-full group relative flex items-center justify-center gap-4 bg-white text-slate-900 hover:bg-primary hover:text-white py-5 rounded-2xl transition-all duration-300 active:scale-[0.98] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
              ) : (
                <>
                  <img 
                    src="https://www.google.com/favicon.ico" 
                    className="size-5" 
                    alt="Google" 
                  />
                  <span>
                    Login with Google
                  </span>
                  
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-[9px] font-medium text-white/20 leading-relaxed max-w-[200px] mx-auto">
                By continuing, you accept that your characters will be forged in the eternal cloud fire.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center animate-fadeIn">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
             © 2024 Dungeon Forge Studio
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
