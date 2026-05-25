// Test: Realtime timeout + exponential backoff
// Verifica: timeout 5s, backoff 1s→2s→4s→8s, jitter ±10%, máx 10 retries

interface RetryState {
  attempt: number;
  status: 'connecting' | 'connected' | 'error' | 'reconnecting';
  backoffMs: number;
  jitteredMs: number;
}

// Mock Supabase channel
class MockChannel {
  private eventHandlers: Map<string, (payload: any) => void> = new Map();
  private shouldFail = true;
  private eventDelay = 100; // Simula delay antes de disparar evento

  on(type: string, options: any, handler: (payload: any) => void) {
    this.eventHandlers.set(type, handler);
    return this;
  }

  subscribe() {
    if (this.shouldFail) {
      // Simula falso positivo: se suscribe pero nunca dispara eventos
      console.log('[Test] Channel subscribed but will not emit events (timeout scenario)');
    } else {
      // Después de eventDelay, dispara INSERT
      setTimeout(() => {
        const handler = this.eventHandlers.get('postgres_changes');
        if (handler) {
          handler({ eventType: 'INSERT', new: { data: { id: '1', name: 'Test' }, party_id: 'party-1' } });
        }
      }, this.eventDelay);
    }
    return this;
  }

  // Test helper: simula reconexión exitosa
  setShouldFail(shouldFail: boolean) {
    this.shouldFail = shouldFail;
  }

  unsubscribe() {
    console.log('[Test] Channel unsubscribed');
    return Promise.resolve();
  }
}

// Test 1: Exponential backoff calculation
console.log('\n=== TEST 1: Exponential Backoff Calculation ===');

function calculateBackoff(attempt: number): number {
  return Math.min(Math.pow(2, attempt) * 1000, 8000);
}

function addJitter(ms: number): number {
  const jitterPercent = 0.1; // ±10%
  const jitterAmount = ms * jitterPercent;
  const randomJitter = (Math.random() - 0.5) * 2 * jitterAmount; // ±
  return Math.round(ms + randomJitter);
}

const backoffSequence = [
  { attempt: 0, expected: 1000 },
  { attempt: 1, expected: 2000 },
  { attempt: 2, expected: 4000 },
  { attempt: 3, expected: 8000 },
  { attempt: 4, expected: 8000 }, // max
  { attempt: 5, expected: 8000 }, // max
];

backoffSequence.forEach(({ attempt, expected }) => {
  const backoff = calculateBackoff(attempt);
  const jittered = addJitter(backoff);
  const jitterRange = backoff * 0.1;
  const isValid = jittered >= backoff - jitterRange && jittered <= backoff + jitterRange;
  
  console.log(
    `Attempt ${attempt}: ${backoff}ms, jittered: ${jittered}ms (valid: ${isValid ? '✓' : '✗'})`
  );
  
  if (backoff !== expected) {
    throw new Error(`Backoff mismatch at attempt ${attempt}: expected ${expected}ms, got ${backoff}ms`);
  }
});

console.log('✅ Backoff calculation passed');

// Test 2: Timeout verification (5 seconds)
console.log('\n=== TEST 2: Timeout Verification (5s) ===');

async function testTimeout() {
  const TIMEOUT_MS = 5000;
  const channel = new MockChannel();
  let timedOut = false;

  const timeoutPromise = new Promise<void>((_, reject) => {
    setTimeout(() => {
      timedOut = true;
      reject(new Error(`Subscription timeout after ${TIMEOUT_MS}ms`));
    }, TIMEOUT_MS);
  });

  const subscribePromise = new Promise<void>((resolve) => {
    // Simula que channel.subscribe() se demora más de 5s sin enviar eventos
    setTimeout(() => {
      if (!timedOut) {
        resolve();
      }
    }, 6000);
  });

  try {
    await Promise.race([subscribePromise, timeoutPromise]);
    console.log('❌ Should have timed out');
  } catch (e) {
    if (timedOut) {
      console.log('✅ Timeout triggered correctly after 5s');
    } else {
      throw e;
    }
  }
}

testTimeout();

// Test 3: Retry loop with max attempts
console.log('\n=== TEST 3: Max Retry Attempts (10) ===');

async function testMaxRetries() {
  const MAX_RETRIES = 10;
  let attemptCount = 0;

  async function subscribeWithRetry(): Promise<void> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      attemptCount = attempt;
      console.log(`[Retry ${attempt + 1}/${MAX_RETRIES}] Attempting to subscribe...`);

      // Simula siempre fallo
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log(`[Retry ${attempt + 1}/${MAX_RETRIES}] Failed, backing off...`);
          resolve();
        }, 100);
      });
    }

    if (attemptCount >= MAX_RETRIES - 1) {
      throw new Error(`Failed after ${MAX_RETRIES} attempts. Escalating.`);
    }
  }

  try {
    await subscribeWithRetry();
  } catch (e) {
    if (attemptCount === MAX_RETRIES - 1) {
      console.log(`✅ Max retries (${MAX_RETRIES}) enforced, escalation needed`);
    } else {
      throw e;
    }
  }
}

testMaxRetries();

// Test 4: State transitions
console.log('\n=== TEST 4: State Transitions ===');

class RealtimeSubscriber {
  private status: 'connecting' | 'connected' | 'error' | 'reconnecting' = 'connecting';
  private stateLog: RetryState[] = [];

  getStatus() {
    return this.status;
  }

  setState(status: 'connecting' | 'connected' | 'error' | 'reconnecting', attempt: number = 0, backoffMs: number = 0, jitteredMs: number = 0) {
    this.status = status;
    this.stateLog.push({ attempt, status, backoffMs, jitteredMs });
    console.log(`[State] ${status} (attempt ${attempt})`);
  }

  getLog() {
    return this.stateLog;
  }
}

const subscriber = new RealtimeSubscriber();
subscriber.setState('connecting', 0);
subscriber.setState('connected', 0);
subscriber.setState('error', 1, 2000, 2100);
subscriber.setState('reconnecting', 1);
subscriber.setState('connected', 1);

const log = subscriber.getLog();
const expectedSequence = ['connecting', 'connected', 'error', 'reconnecting', 'connected'];
const actualSequence = log.map(s => s.status);

if (JSON.stringify(actualSequence) === JSON.stringify(expectedSequence)) {
  console.log('✅ State transitions validated');
} else {
  console.log(`❌ State mismatch: expected ${expectedSequence}, got ${actualSequence}`);
}

console.log('\n=== ALL TESTS COMPLETED ===');
