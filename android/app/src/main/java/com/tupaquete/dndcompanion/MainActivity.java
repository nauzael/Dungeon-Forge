package com.tupaquete.dndcompanion;

import android.os.Bundle;
import android.content.Intent;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		registerPlugin(GoogleSignInPlugin.class);
		super.onCreate(savedInstanceState);
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		Log.i("GoogleSignIn", "MainActivity.onActivityResult: requestCode=" + requestCode + " resultCode=" + resultCode + " hasData=" + (data != null));
		super.onActivityResult(requestCode, resultCode, data);
	}
}
