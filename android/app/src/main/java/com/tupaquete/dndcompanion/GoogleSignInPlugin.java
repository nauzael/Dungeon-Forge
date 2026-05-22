package com.tupaquete.dndcompanion;

import android.app.Activity;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "GoogleSignIn")
public class GoogleSignInPlugin extends Plugin {
    
    private static final int RC_SIGN_IN = 9001;
    private GoogleSignInClient mGoogleSignInClient;
    private PluginCall savedCall;
    private static GoogleSignInPlugin instance;

    @Override
    public void load() {
        super.load();
        instance = this;
        initializeGoogleSignIn();
    }

    private void initializeGoogleSignIn() {
        try {
            // Get web client ID from strings.xml (set by Firebase/google-services.json)
            int webClientIdStringId = getContext().getResources().getIdentifier(
                "default_web_client_id", 
                "string", 
                getContext().getPackageName()
            );
            
            String webClientId = "";
            if (webClientIdStringId != 0) {
                webClientId = getContext().getString(webClientIdStringId);
            }
            
            GoogleSignInOptions.Builder builder = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestProfile();
            
            if (!webClientId.isEmpty()) {
                builder.requestIdToken(webClientId);
            }
            
            GoogleSignInOptions gso = builder.build();
            mGoogleSignInClient = GoogleSignIn.getClient(getActivity(), gso);
            System.out.println("[GoogleSignIn] Initialized with webClientId: " + (webClientId.isEmpty() ? "NOT_FOUND" : "SET"));
        } catch (Exception e) {
            System.err.println("[GoogleSignIn] Initialization error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Native Google Sign-In using Google Play Services
     * Opens system account chooser, returns ID token for Firebase credential exchange
     */
    public void signInWithGoogle(PluginCall call) {
        savedCall = call;
        
        try {
            System.out.println("[GoogleSignIn] signInWithGoogle called");
            
            // Check if user is already signed in with Google
            GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getContext());
            if (account != null && account.getIdToken() != null) {
                System.out.println("[GoogleSignIn] Using cached account: " + account.getEmail());
                returnSuccessWithToken(account);
                return;
            }
            
            // Open Google account chooser
            Intent signInIntent = mGoogleSignInClient.getSignInIntent();
            getActivity().startActivityForResult(signInIntent, RC_SIGN_IN);
            System.out.println("[GoogleSignIn] Account chooser opened");
            
        } catch (Exception e) {
            System.err.println("[GoogleSignIn] Error: " + e.getMessage());
            e.printStackTrace();
            call.reject("Sign-in failed: " + e.getMessage());
        }
    }

    /**
     * Sign out from Google
     */
    public void signOut(PluginCall call) {
        try {
            System.out.println("[GoogleSignIn] signOut called");
            mGoogleSignInClient.signOut().addOnCompleteListener(getActivity(), task -> {
                System.out.println("[GoogleSignIn] Signed out successfully");
                call.resolve();
            });
        } catch (Exception e) {
            System.err.println("[GoogleSignIn] Sign-out error: " + e.getMessage());
            call.reject("Sign-out failed");
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        
        if (requestCode == RC_SIGN_IN) {
            System.out.println("[GoogleSignIn] Activity result received, resultCode=" + resultCode);
            handleSignInResult(GoogleSignIn.getSignedInAccountFromIntent(data));
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            if (account != null) {
                System.out.println("[GoogleSignIn] Sign-in successful: " + account.getEmail());
                returnSuccessWithToken(account);
            } else {
                System.err.println("[GoogleSignIn] Sign-in returned null account");
                if (savedCall != null) {
                    savedCall.reject("Sign-in cancelled or failed");
                    savedCall = null;
                }
            }
        } catch (ApiException e) {
            System.err.println("[GoogleSignIn] Sign-in failed, status=" + e.getStatusCode());
            e.printStackTrace();
            
            if (savedCall != null) {
                savedCall.reject("Sign-in failed: " + e.getMessage());
                savedCall = null;
            }
        }
    }

    private void returnSuccessWithToken(GoogleSignInAccount account) {
        if (savedCall == null) return;
        
        JSObject result = new JSObject();
        result.put("idToken", account.getIdToken() != null ? account.getIdToken() : "");
        result.put("email", account.getEmail() != null ? account.getEmail() : "");
        result.put("displayName", account.getDisplayName() != null ? account.getDisplayName() : "");
        result.put("photoUrl", account.getPhotoUrl() != null ? account.getPhotoUrl().toString() : "");
        
        System.out.println("[GoogleSignIn] Returning token for: " + account.getEmail());
        
        // Use Handler to ensure callback runs on main thread
        new Handler(Looper.getMainLooper()).post(() -> {
            savedCall.resolve(result);
            savedCall = null;
        });
    }
}
