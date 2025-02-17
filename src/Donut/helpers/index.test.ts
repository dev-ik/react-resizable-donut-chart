import { redistribute, roundAndAdjust } from './';

const sum = (nums: Array<number>) => nums.reduce((s, num) => s + num, 0);

describe(redistribute.name, () => {
  it('should work on appropriate data 1', () => {
    const result = redistribute([25, 25, 25, 25], 1, 2);

    expect(result[0]).toBeLessThan(25);
    expect(result[1]).toBe(27);
    expect(result[2]).toBeLessThan(25);
    expect(result[3]).toBeLessThan(25);
    expect(Math.round(sum(result))).toBe(100);
  });

  it('should work on appropriate data 2', () => {
    const result = redistribute([40, 26, 10, 13, 11], 0, 3);

    expect(result[0]).toBe(43);
    expect(result[1]).toBeLessThan(26);
    expect(result[2]).toBe(10);
    expect(result[3]).toBeLessThan(13);
    expect(result[4]).toBeLessThan(11);
    expect(Math.round(sum(result))).toBe(100);
  });

  it('should work on appropriate data 3', () => {
    const result = redistribute([33, 33, 34], 2, -3);

    expect(result[0]).toBeGreaterThan(33);
    expect(result[1]).toBeGreaterThan(33);
    expect(result[2]).toBe(31);
    expect(Math.round(sum(result))).toBe(100);
  });

  it('should work on appropriate data 4', () => {
    const result = redistribute([10, 10, 20, 20, 30, 10], 2, -1);

    expect(result[0]).toBeGreaterThan(10);
    expect(result[1]).toBeGreaterThan(10);
    expect(result[2]).toBe(19);
    expect(result[3]).toBeGreaterThan(20);
    expect(result[4]).toBeGreaterThan(30);
    expect(result[5]).toBeGreaterThan(10);
    expect(Math.round(sum(result))).toBe(100);
  });

  it('should work on appropriate data 4', () => {
    const result = redistribute([10, 10, 20, 20, 30, 10], 2, -1);

    expect(result[0]).toBeGreaterThan(10);
    expect(result[1]).toBeGreaterThan(10);
    expect(result[2]).toBe(19);
    expect(result[3]).toBeGreaterThan(20);
    expect(result[4]).toBeGreaterThan(30);
    expect(result[5]).toBeGreaterThan(10);
    expect(Math.round(sum(result))).toBe(100);
  });

  it('should handle corner cases', () => {
    expect(() =>
      redistribute([10, 10, 10, 10, 10, 10, 10, 10, 10, 10], 1, 2),
    ).toThrow();
    expect(() => redistribute([100], 0, 2)).toThrow();
    expect(() => redistribute([100], 0, -2)).toThrow();
  });
});

describe(roundAndAdjust.name, () => {
  it('should work on appropriate data', () => {
    expect(roundAndAdjust([33.33, 33.33, 33.33], 1)).toEqual([33, 34, 33]);
    expect(roundAndAdjust([10.66, 38, 30.66, 20.66], 3)).toEqual([
      11, 38, 31, 20,
    ]);
    expect(roundAndAdjust([50, 50], 0)).toEqual([50, 50]);
  });
});
