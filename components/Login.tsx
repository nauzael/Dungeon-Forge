import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isMockMode = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('TU_PROYECTO');

  const handleGoogleLogin = async () => {
    if (isMockMode) {
      alert("Google Login is not available in Mock Mode. Please set VITE_SUPABASE_URL in .env");
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Choose redirect depending on platform (Capacitor Mobile vs Web)
    const isNative = Capacitor.getPlatform() !== 'web';
    const redirectUrl = isNative
      ? 'com.tupaquete.dndcompanion://login-callback' 
      : window.location.origin;

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: isNative, 
          queryParams: { prompt: 'select_account' }
        }
      });
      
      if (error) {
         setLoading(false);
         alert("SUPABASE ERROR: " + error.message);
         return;
      }

      if (isNative && data?.url) {
        try {
          await Browser.open({ url: data.url });
          
          Browser.addListener('browserFinished', () => {
            setLoading(false);
          });
        } catch (bErr: any) {
          alert('BROWSER OPEN ERROR: ' + bErr?.message);
          setLoading(false);
        }
      } else {
        // Fallback or Web logic that might not have a URL immediately
        // Though skipBrowserRedirect=false usually navigates automatically on web
      }
    } catch (e: any) {
      alert(`GENERAL AUTH ERROR: ${e.message || JSON.stringify(e)}`);
      setError(e.message);
      setLoading(false);
    }
  };

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
            
            <div className="relative size-24 mx-auto rounded-3xl bg-primary flex items-center justify-center shadow-[0_20px_50px_rgba(255,102,0,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="material-symbols-outlined text-background-dark text-5xl font-black">fort</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-3">
            Dungeon <span className="text-primary italic">Forge</span>
          </h1>
          <div className="h-1.5 w-16 bg-primary mx-auto rounded-full mb-6" />
          
          <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-4">
            Forge your destiny
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
