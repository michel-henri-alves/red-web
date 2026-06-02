import { describe, expect, it } from 'vitest';
import { toBrasiliaISOString, toBrasiliaTimestamp } from './brasiliaDate';

describe('brasiliaDate', () => {
  it('converts a UTC instant to the equivalent UTC-3 persisted timestamp', () => {
    const utcNoon = new Date('2026-06-01T12:00:00.000Z');

    expect(toBrasiliaTimestamp(utcNoon)).toBe(
      Date.parse('2026-06-01T09:00:00.000Z')
    );
  });

  it('formats the adjusted timestamp as an ISO string for API date filters', () => {
    const utcNoon = new Date('2026-06-01T12:00:00.000Z');

    expect(toBrasiliaISOString(utcNoon)).toBe('2026-06-01T09:00:00.000Z');
  });
});
