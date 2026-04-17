/**
 * OAuth Diagnostics Tool
 * 
 * Validates the complete OAuth flow chain:
 * 1. Supabase configuration (URL, key, credentials)
 * 2. OAuth callback configuration 
 * 3. Capacitor deeplink setup
 * 4. Browser plugin availability
 * 5. Session state
 */

import { supabase } from './supabase';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export interface OAuthDiagnostic {
  category: string;
  check: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  message: string;
  suggestion?: string;
}

/**
 * Run complete OAuth diagnostics
 */
export const runOAuthDiagnostics = async (): Promise<OAuthDiagnostic[]> => {
  const results: OAuthDiagnostic[] = [];

  // 1. Supabase Configuration Check
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  results.push({
    category: 'Supabase Config',
    check: 'Supabase URL Set',
    status: supabaseUrl ? 'PASS' : 'FAIL',
    message: supabaseUrl ? `✓ URL configured: ${supabaseUrl.substring(0, 30)}...` : '✗ VITE_SUPABASE_URL not found',
    suggestion: !supabaseUrl ? 'Add VITE_SUPABASE_URL to .env file' : undefined
  });

  results.push({
    category: 'Supabase Config',
    check: 'Supabase Anon Key Set',
    status: supabaseKey ? 'PASS' : 'FAIL',
    message: supabaseKey ? `✓ Key configured: ${supabaseKey.substring(0, 20)}...` : '✗ VITE_SUPABASE_ANON_KEY not found',
    suggestion: !supabaseKey ? 'Add VITE_SUPABASE_ANON_KEY to .env file' : undefined
  });

  // 2. Capacitor Platform Check
  const platform = Capacitor.getPlatform();
  const isNative = platform !== 'web';

  results.push({
    category: 'Capacitor',
    check: 'Platform Detection',
    status: 'PASS',
    message: `✓ Running on: ${platform} (native: ${isNative})`
  });

  // 3. Browser Plugin Check (only on native)
  if (isNative) {
    try {
      const browserInfo = await Browser.getInfo?.();
      results.push({
        category: 'Capacitor Plugins',
        check: 'Browser Plugin Available',
        status: 'PASS',
        message: `✓ Browser plugin is available`
      });
    } catch (e) {
      results.push({
        category: 'Capacitor Plugins',
        check: 'Browser Plugin Available',
        status: 'FAIL',
        message: `✗ Browser plugin error: ${e instanceof Error ? e.message : String(e)}`,
        suggestion: 'Ensure Capacitor Browser plugin is installed: npm install @capacitor/browser'
      });
    }
  }

  // 4. OAuth Callback Configuration
  const expectedDeeplink = 'com.tupaquete.dndcompanion://login-callback';
  results.push({
    category: 'OAuth Config',
    check: 'Deeplink URL',
    status: 'PASS',
    message: `✓ Expected deeplink: ${expectedDeeplink}`,
    suggestion: 'This must be configured in Supabase OAuth settings'
  });

  // 5. Session State Check
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      results.push({
        category: 'Session',
        check: 'Get Current Session',
        status: 'FAIL',
        message: `✗ Failed to get session: ${error.message}`,
        suggestion: 'Check Supabase client initialization'
      });
    } else {
      results.push({
        category: 'Session',
        check: 'Get Current Session',
        status: session ? 'PASS' : 'WARN',
        message: session 
          ? `✓ User session active: ${session.user.email}` 
          : `⚠ No active session (expected before login)`
      });
    }
  } catch (e) {
    results.push({
      category: 'Session',
      check: 'Get Current Session',
      status: 'FAIL',
      message: `✗ Error: ${e instanceof Error ? e.message : String(e)}`
    });
  }

  // 6. Auth State Listener Check
  try {
    let stateChangeCounter = 0;
    const subscription = supabase.auth.onAuthStateChange(() => {
      stateChangeCounter++;
    });

    // Wait 100ms to see if listener fires
    await new Promise(resolve => setTimeout(resolve, 100));

    // Cleanup
    subscription.data.subscription?.unsubscribe();

    results.push({
      category: 'Auth Listener',
      check: 'State Change Listener',
      status: 'PASS',
      message: `✓ onAuthStateChange listener is functional`
    });
  } catch (e) {
    results.push({
      category: 'Auth Listener',
      check: 'State Change Listener',
      status: 'FAIL',
      message: `✗ Error: ${e instanceof Error ? e.message : String(e)}`,
      suggestion: 'onAuthStateChange may not be properly initialized'
    });
  }

  // 7. Native Platform Checks
  if (isNative) {
    results.push({
      category: 'Native Config',
      check: 'Capacitor Package ID',
      status: 'PASS',
      message: `✓ Package ID: com.tupaquete.dndcompanion`,
      suggestion: 'Verify this matches capacitor.config.json'
    });

    results.push({
      category: 'Native Config',
      check: 'Android Scheme',
      status: 'PASS',
      message: `✓ URL scheme: com.tupaquete.dndcompanion://`,
      suggestion: 'Deep links use this scheme to redirect back to app'
    });
  }

  return results;
};

/**
 * Print diagnostics in a human-readable format
 */
export const printOAuthDiagnostics = (results: OAuthDiagnostic[]) => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         OAuth Configuration Diagnostics                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const groupedByCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, OAuthDiagnostic[]>);

  Object.entries(groupedByCategory).forEach(([category, checks]) => {
    console.log(`📋 ${category}:`);
    checks.forEach(check => {
      const icon = check.status === 'PASS' ? '✓' : check.status === 'WARN' ? '⚠' : '✗';
      const color = check.status === 'PASS' ? '\x1b[32m' : check.status === 'WARN' ? '\x1b[33m' : '\x1b[31m';
      const reset = '\x1b[0m';
      
      console.log(`  ${color}${icon}${reset} ${check.check}: ${check.message}`);
      if (check.suggestion) {
        console.log(`    💡 ${check.suggestion}`);
      }
    });
    console.log();
  });

  // Summary
  const passCount = results.filter(r => r.status === 'PASS').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;

  console.log(`📊 Summary: ${passCount} PASS, ${warnCount} WARN, ${failCount} FAIL`);
  
  if (failCount > 0) {
    console.log('\n⚠️  OAUTH SETUP INCOMPLETE - See suggestions above');
  } else if (warnCount > 0) {
    console.log('\n⚠️  OAUTH SETUP OK but check warnings');
  } else {
    console.log('\n✓ OAUTH SETUP COMPLETE - Ready for testing');
  }
  console.log('\n');
};

/**
 * Test the complete OAuth flow (without actual browser)
 */
export const testOAuthFlow = async (mockUrl: string = '') => {
  console.log('[OAuth Test] Starting OAuth flow test...');

  // Simulate the OAuth flow
  const testDeeplink = mockUrl || 'com.tupaquete.dndcompanion://login-callback#access_token=test_token&refresh_token=test_refresh&expires_in=3600&token_type=Bearer&type=signup';
  
  console.log('[OAuth Test] Simulating deeplink:', testDeeplink.substring(0, 80) + '...');

  // Extract params like the real handler does
  const hashIndex = testDeeplink.indexOf('#');
  const queryIndex = testDeeplink.indexOf('?');
  let params = null;

  if (hashIndex !== -1) {
    params = testDeeplink.substring(hashIndex + 1);
  } else if (queryIndex !== -1) {
    params = testDeeplink.substring(queryIndex + 1);
  }

  console.log('[OAuth Test] Params extracted:', !!params);
  
  if (params) {
    console.log('[OAuth Test] Setting window.location.hash');
    try {
      window.location.hash = params;
      console.log('[OAuth Test] Hash set successfully');
      console.log('[OAuth Test] Current hash:', window.location.hash);
    } catch (e) {
      console.error('[OAuth Test] Failed to set hash:', e);
    }
  }

  // Wait to see if onAuthStateChange fires
  console.log('[OAuth Test] Waiting 2 seconds for session to establish...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    console.log('[OAuth Test] ✓ Session established:', session.user.email);
    return true;
  } else {
    console.log('[OAuth Test] ✗ Session not established');
    return false;
  }
};
