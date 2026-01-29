import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Codex from '../components/Codex';
import { useInventory } from '../store/inventory';
import { useStore } from '../store';

// Mock Dependencies
vi.mock('../store/inventory', () => ({
  useInventory: vi.fn(),
}));

vi.mock('../store', () => ({
  useStore: vi.fn(),
}));

// Mock the Codex Data utility to return stable test data
vi.mock('../utils/codexData', () => ({
  getUniversalCodexData: () => [
    {
      name: 'Elementary',
      subcategories: [
        { name: 'Quarks', particles: ['up-quark', 'down-quark'] }
      ]
    },
    {
        name: 'Molecules',
        subcategories: [
            { name: 'Simple', particles: ['water'] }
        ]
    }
  ],
  getUniversalItemInfo: (type) => {
    const map = {
      'up-quark': { name: 'Up Quark', color: 'red' },
      'down-quark': { name: 'Down Quark', color: 'blue' },
      'water': { name: 'Water', color: 'blue' }
    };
    return map[type] || { name: 'Unknown', color: 'gray' };
  }
}));

// Mock the ParticleIcon to avoid rendering complex SVGs in test
vi.mock('../particle-lab/components/ParticleIcon', () => ({
  default: ({ type }) => <div data-testid={`icon-${type}`}>{type}</div>
}));

describe('Codex Component', () => {
  beforeEach(() => {
    // Default Mock State
    useInventory.mockReturnValue([]); // No items discovered
    useStore.mockReturnValue(false); // Sandbox mode off
  });

  it('should render nothing if not visible', () => {
    render(<Codex isVisible={false} onClose={() => {}} />);
    expect(screen.queryByText('Universal Codex')).not.toBeInTheDocument();
  });

  it('should render items as "???" if not discovered', () => {
    render(<Codex isVisible={true} onClose={() => {}} />);
    
    // Check for placeholder text (the component logic renders ??? for undiscovered)
    // And opacity-40 grayscale for undiscovered.
    
    // We expect 3 items based on mock data: up, down, water
    const placeholders = screen.getAllByText('???');
    expect(placeholders).toHaveLength(3);
  });

  it('should show item names if discovered', () => {
    useInventory.mockReturnValue(['up-quark', 'water']);
    
    render(<Codex isVisible={true} onClose={() => {}} />);
    
    expect(screen.getByText('Up Quark')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getAllByText('???')).toHaveLength(1); // Down quark still hidden
  });

  it('should show all items in Sandbox Mode', () => {
    useInventory.mockReturnValue([]);
    useStore.mockReturnValue(true); // Sandbox ON
    
    render(<Codex isVisible={true} onClose={() => {}} />);
    
    expect(screen.getByText('Up Quark')).toBeInTheDocument();
    expect(screen.getByText('Down Quark')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
  });

  it('should filter items when searching', () => {
    useStore.mockReturnValue(true); // Sandbox ON to see names
    
    render(<Codex isVisible={true} onClose={() => {}} />);
    
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Quark' } });
    
    expect(screen.getByText('Up Quark')).toBeInTheDocument();
    expect(screen.getByText('Down Quark')).toBeInTheDocument();
    expect(screen.queryByText('Water')).not.toBeInTheDocument();
  });

  it('should filter by Category Tab', () => {
    useStore.mockReturnValue(true);
    render(<Codex isVisible={true} onClose={() => {}} />);
    
    // Click 'Molecules' tab
    const tab = screen.getByRole('button', { name: 'Molecules' });
    fireEvent.click(tab);
    
    expect(screen.queryByText('Up Quark')).not.toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
  });

  it('should trigger drag start only for discovered items', () => {
    useInventory.mockReturnValue(['up-quark']);
    const onDragStart = vi.fn();
    
    render(<Codex isVisible={true} onClose={() => {}} onDragStart={onDragStart} />);
    
    const upQuark = screen.getByText('Up Quark').closest('div');
    
    // Mock dataTransfer
    const dataTransfer = { setData: vi.fn(), effectAllowed: '' };
    fireEvent.dragStart(upQuark, { dataTransfer });
    
    expect(onDragStart).toHaveBeenCalled();
    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', expect.stringContaining('up-quark'));
    
    const downQuark = screen.getAllByText('???')[0].closest('div');
    const dataTransferDown = { setData: vi.fn(), effectAllowed: '' };
    
    fireEvent.dragStart(downQuark, { dataTransfer: dataTransferDown });
    
    // Should NOT call drag start again (or at least logic prevents it, but let's check mocks)
    // The component checks isDiscovered before calling onDragStart
    expect(onDragStart).toHaveBeenCalledTimes(1); 
  });
});
