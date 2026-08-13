import { describe, it, expect } from 'vitest';
import { SpatialHash } from '../utils/spatialHash';

describe('SpatialHash', () => {
  it('should insert and query entities correctly', () => {
    const hash = new SpatialHash(10);
    const entity = { id: 1, x: 15, y: 15 };
    hash.insert(entity);
    const result = hash.query(15, 15, 5);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
  
  it('should reuse arrays on clear', () => {
    const hash = new SpatialHash(10);
    const entity = { id: 1, x: 15, y: 15 };
    hash.insert(entity);
    hash.clear();
    const result = hash.query(15, 15, 5);
    expect(result).toHaveLength(0);
  });
});
