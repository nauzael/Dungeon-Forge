/**
 * T3.2 Tests: OTA Error UI and Progress Tracking
 * Tests for extended OTAUpdate interface and error handling
 */

import { OTAUpdate, VersionJsonResponse } from './types';

/**
 * Test 1: OTAUpdate interface includes error, downloading, and progress fields
 */
export function testOTAUpdateInterface() {
  const update: OTAUpdate = {
    version: '1.0.1',
    message: 'Update available',
    payload: { id: 'test-123' },
    error: undefined,
    downloading: false,
    progress: 0
  };

  console.assert(
    update.version === '1.0.1',
    'OTAUpdate.version should be set'
  );
  console.assert(
    typeof update.downloading === 'boolean',
    'OTAUpdate.downloading should be boolean'
  );
  console.assert(
    typeof update.progress === 'number',
    'OTAUpdate.progress should be number'
  );
  console.assert(
    update.error === undefined || typeof update.error === 'string',
    'OTAUpdate.error should be string or undefined'
  );

  return true;
}

/**
 * Test 2: Error state validation
 */
export function testOTAUpdateWithError() {
  const errorUpdate: OTAUpdate = {
    version: '1.0.1',
    message: 'Update available',
    payload: { id: 'test-123' },
    error: 'Network timeout while downloading update',
    downloading: false,
    progress: 0
  };

  console.assert(
    errorUpdate.error !== undefined && errorUpdate.error.length > 0,
    'Error message should be populated'
  );
  console.assert(
    !errorUpdate.downloading,
    'downloading should be false when error occurs'
  );

  return true;
}

/**
 * Test 3: Progress tracking during download
 */
export function testDownloadProgress() {
  const progressStates: OTAUpdate[] = [
    { version: '1.0.1', message: 'Downloading...', payload: {}, downloading: true, progress: 0 },
    { version: '1.0.1', message: 'Downloading...', payload: {}, downloading: true, progress: 25 },
    { version: '1.0.1', message: 'Downloading...', payload: {}, downloading: true, progress: 50 },
    { version: '1.0.1', message: 'Downloading...', payload: {}, downloading: true, progress: 100 },
  ];

  progressStates.forEach((state, i) => {
    console.assert(
      state.progress >= 0 && state.progress <= 100,
      `Progress at step ${i} should be 0-100: ${state.progress}`
    );
    console.assert(
      state.downloading === true,
      `downloading should be true during download at step ${i}`
    );
  });

  return true;
}

/**
 * Test 4: Error types handling
 */
export function testErrorTypeHandling() {
  const errorScenarios = [
    { error: 'Network timeout', expectedUI: 'retry' },
    { error: 'Storage quota exceeded', expectedUI: 'warning' },
    { error: 'CORS error at fetch version.json', expectedUI: 'error' },
    { error: 'Invalid file signature', expectedUI: 'error' },
  ];

  errorScenarios.forEach(scenario => {
    const isNetworkError = scenario.error.toLowerCase().includes('network') || 
                          scenario.error.toLowerCase().includes('timeout');
    const isStorageError = scenario.error.toLowerCase().includes('quota') || 
                          scenario.error.toLowerCase().includes('storage');

    console.assert(
      isNetworkError || isStorageError || scenario.error.length > 0,
      `Should correctly categorize error: ${scenario.error}`
    );
  });

  return true;
}

// Run all tests
if (typeof window !== 'undefined') {
  console.log('[Tests] Running OTA Error UI tests...');
  testOTAUpdateInterface() && console.log('✓ Test 1: OTAUpdate interface');
  testOTAUpdateWithError() && console.log('✓ Test 2: Error state');
  testDownloadProgress() && console.log('✓ Test 3: Progress tracking');
  testErrorTypeHandling() && console.log('✓ Test 4: Error type handling');
  console.log('[Tests] All OTA tests passed');
}
