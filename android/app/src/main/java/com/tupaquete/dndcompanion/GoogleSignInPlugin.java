package com.tupaquete.dndcompanion;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "GoogleSignIn")
public class GoogleSignInPlugin extends Plugin {

    private static final String TAG = "GoogleSignIn";
    private GoogleSignInClient mGoogleSignInClient;
    private PluginCall savedCall;
    private ActivityResultLauncher<Intent> signInLauncher;

    @Override
    public void load() {
        super.load();
        // Register for activity result BEFORE any activity launch (required by AndroidX)
        signInLauncher = getActivity().registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> handleActivityResult(result)
        );
        initializeGoogleSignIn();
    }

    private void handleActivityResult(ActivityResult result) {
        Log.i(TAG, "Activity result received, resultCode=" + result.getResultCode());
        handleSignInResult(GoogleSignIn.getSignedInAccountFromIntent(result.getData()));
    }

    private void initializeGoogleSignIn() {
        try {
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
            Log.i(TAG, "Initialized with webClientId: " + (webClientId.isEmpty() ? "NOT_FOUND" : "SET"));
        } catch (Exception e) {
            Log.e(TAG, "Initialization error: " + e.getMessage());
        }
    }

    @PluginMethod
    public void signInWithGoogle(PluginCall call) {
        savedCall = call;

        try {
            Log.i(TAG, "signInWithGoogle called");

            // Check if user is already signed in with a valid cached token
            GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getContext());
            if (account != null && account.getIdToken() != null) {
                Log.i(TAG, "Using cached account: " + account.getEmail());
                returnSuccessWithToken(account);
                return;
            }

            // Launch account chooser using ActivityResultLauncher (modern AndroidX API)
            Intent signInIntent = mGoogleSignInClient.getSignInIntent();
            signInLauncher.launch(signInIntent);
            Log.i(TAG, "Account chooser launched");

        } catch (Exception e) {
            Log.e(TAG, "Error launching sign-in: " + e.getMessage());
            call.reject("Sign-in failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void signOut(PluginCall call) {
        try {
            Log.i(TAG, "signOut called");
            mGoogleSignInClient.signOut().addOnCompleteListener(getActivity(), task -> {
                Log.i(TAG, "Signed out successfully");
                call.resolve();
            });
        } catch (Exception e) {
            Log.e(TAG, "Sign-out error: " + e.getMessage());
            call.reject("Sign-out failed");
        }
    }

    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);
            if (account != null) {
                Log.i(TAG, "Sign-in successful: " + account.getEmail());
                returnSuccessWithToken(account);
            } else {
                Log.e(TAG, "Sign-in returned null account");
                if (savedCall != null) {
                    savedCall.reject("Sign-in cancelled or failed");
                    savedCall = null;
                }
            }
        } catch (ApiException e) {
            Log.e(TAG, "Sign-in failed, statusCode=" + e.getStatusCode() + " msg=" + e.getMessage());
            if (savedCall != null) {
                savedCall.reject("Sign-in failed with status " + e.getStatusCode());
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

        Log.i(TAG, "Returning token for: " + account.getEmail());

        new Handler(Looper.getMainLooper()).post(() -> {
            savedCall.resolve(result);
            savedCall = null;
        });
    }
}
