import { describe, it, expect } from 'vitest';

function sum(a: number, b: number): number {
  return a + b;
}

describe('sum function', () => {
  it('adds two positive numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('adds a positive and a negative number correctly', () => {
    expect(sum(5, -3)).toBe(2);
  });

  it('adds two negative numbers correctly', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  it('adds zero correctly', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
    expect(sum(0, 0)).toBe(0);
  });
});
