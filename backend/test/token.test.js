import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthToken, verifyAuthToken } from '../src/utils/token.js';

test('createAuthToken and verifyAuthToken round-trip payload values', () => {
  const token = createAuthToken({
    sub: 'user-123',
    email: 'patient@example.com',
    role: 'customer',
  });

  const payload = verifyAuthToken(token);

  assert.equal(payload.sub, 'user-123');
  assert.equal(payload.email, 'patient@example.com');
  assert.equal(payload.role, 'customer');
  assert.ok(payload.exp > payload.iat);
});

test('verifyAuthToken rejects malformed tokens', () => {
  assert.throws(() => verifyAuthToken('not-a-valid-token'));
});
