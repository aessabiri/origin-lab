import { describe, it, expect } from 'vitest';
import { generateFoldedStructure } from '../components/ProteinFolder';
import { getUniversalItemInfo } from '../../utils/codexData';
import { vi } from 'vitest';

vi.mock('../../utils/codexData', () => ({
  getUniversalItemInfo: vi.fn((type) => ({ color: '#fff', name: type }))
}));

describe('ProteinFolder generateFoldedStructure', () => {
  it('should return a valid structure for a sequence', () => {
    const sequence = [
      { type: 'leucine' },
      { type: 'serine' },
      { type: 'valine' }
    ];
    const structure = generateFoldedStructure(sequence);
    expect(structure.points).toHaveLength(3);
    expect(structure.bonds).toHaveLength(2);
  });
});
