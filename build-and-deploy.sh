#!/bin/bash
# OAuth Login Fix - Build & Deploy Script
# 
# Usage: bash build-and-deploy.sh
# 
# This script:
# 1. Verifies build status
# 2. Builds APK
# 3. Installs on connected device
# 4. Shows deployment instructions

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║    OAuth Login Fix - Build & Deploy Script                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Verify build
echo -e "${BLUE}[1/4] Verifying TypeScript build...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed - see errors above${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}[2/4] Building APK...${NC}"
cd android || exit

if [ ! -f "local.properties" ]; then
    echo -e "${YELLOW}⚠ local.properties not found - generating...${NC}"
    echo "sdk.dir=$ANDROID_HOME" > local.properties
fi

# Build APK
if ./gradlew assembleDebug; then
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo -e "${GREEN}✓ APK built successfully: $APK_SIZE${NC}"
    echo -e "  Location: $APK_PATH"
else
    echo -e "${RED}✗ APK build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${BLUE}[3/4] Checking for connected devices...${NC}"
DEVICES=$(adb devices | grep -v "List" | awk 'NF')
if [ -z "$DEVICES" ]; then
    echo -e "${YELLOW}⚠ No connected devices found${NC}"
    echo "  Please connect an Android device and try again:"
    echo "  1. Enable Developer Mode on device"
    echo "  2. Enable USB Debugging"
    echo "  3. Connect via USB cable"
    echo "  4. Run: adb devices (should show device name)"
    echo ""
    exit 1
else
    echo -e "${GREEN}✓ Device(s) found:${NC}"
    echo "$DEVICES" | awk '{print "  - " $0}'
fi

echo ""
echo -e "${BLUE}[4/4] Installing APK...${NC}"
if adb install -r "android/app/build/outputs/apk/debug/app-debug.apk"; then
    echo -e "${GREEN}✓ APK installed successfully${NC}"
else
    echo -e "${RED}✗ Installation failed${NC}"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         OAuth Fix Ready for Testing                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ All steps completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Open 'Dungeon Forge' app on your device"
echo "2. Tap the 🔍 button (bottom-right corner)"
echo "3. Select 'Diagnostics' tab"
echo "4. Tap 'Run Diagnostics' to verify setup"
echo ""
echo "Then test OAuth:"
echo "1. Go to 'Session' tab"
echo "2. Tap 'Test OAuth Flow' (simulated test)"
echo "3. Check 'Logs' tab to see the flow"
echo ""
echo "Real test:"
echo "1. Close debug panel"
echo "2. Tap 'Sign in with Google'"
echo "3. Select your account"
echo "4. Wait 2+ seconds for redirect"
echo "5. Should enter app successfully ✓"
echo ""
echo "If it still hangs:"
echo "  - Check debug panel Logs tab for failure point"
echo "  - See OAUTH-FIX-GUIDE.md for troubleshooting"
echo ""
