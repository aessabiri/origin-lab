import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Hub from '../components/Hub';
import ChemistryApp from '../chemistry-lab/ChemistryApp';
import Codex from '../components/Codex';
import { useStore } from '../store';
import { useChemistryStore } from '../chemistry-lab/store';

// Mock ResizeObserver for any layout-dependent components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('UI Interactions', () => {
  
  // --- HUB TESTS ---
  describe('Hub Component', () => {
    beforeEach(() => {
      useStore.setState({ isSandboxMode: false });
    });

    it('should toggle Sandbox Mode when clicked', () => {
      // Mock navigation prop
      const mockNavigate = vi.fn();
      
      render(<Hub onNavigate={mockNavigate} />);
      
      // Find the toggle button (using the title we added or text)
      // "Standard progression enabled." is visible when OFF.
      expect(screen.getByText(/Standard progression enabled/i)).toBeInTheDocument();
      
      // Find the button by title
      const toggleButton = screen.getByTitle('Toggle Sandbox Mode');
      
      // Click it
      fireEvent.click(toggleButton);
      
      // Check if text changed
      expect(screen.getByText(/Unlocks all items/i)).toBeInTheDocument();
      
      // Verify store updated
      expect(useStore.getState().isSandboxMode).toBe(true);
    });
  });

  // --- CHEMISTRY LAB TESTS ---
  describe('Chemistry Lab UI', () => {
    it('should toggle Pantry Sidebar visibility', () => {
      render(<ChemistryApp />);
      
      // Initially, the Pantry sidebar has width 0 (hidden) but is in DOM.
      // We can check the toggle button state or aria-label.
      
      const toggleButton = screen.getByLabelText('Open Pantry');
      expect(toggleButton).toBeInTheDocument();
      
      // Click to open
      fireEvent.click(toggleButton);
      
      // Button label should switch to 'Close Pantry'
      expect(screen.getByLabelText('Close Pantry')).toBeInTheDocument();
    });
  });

  // --- CODEX TESTS ---
  describe('Codex Component', () => {
    it('should render without crashing (Duplicate Key Check)', () => {
      // This test specifically targets the "white screen" issue caused by duplicate keys
      // or reference errors.
      
      const { container } = render(
        <Codex 
          isVisible={true} 
          onClose={() => {}} 
          isEmbedded={false} 
        />
      );
      
      // Check for a known element to confirm render success
      expect(screen.getByText('Universal Codex')).toBeInTheDocument();
      
      // Ensure categories are rendered (e.g., "Fundamental", "Molecular")
      // Note: These appear as Tab Buttons AND Section Headers, so getAllByText is safer
      expect(screen.getAllByText('Fundamental').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Molecular').length).toBeGreaterThan(0);
    });

    it('should show all items when isSandboxMode is TRUE', () => {
      useStore.setState({ isSandboxMode: true });
      
      render(
        <Codex 
          isVisible={true} 
          onClose={() => {}} 
        />
      );
      
      // Find a known particle (Up Quark)
      // In sandbox mode, it should NOT have the 'opacity-40' class or be "???"
      // Since we don't mock text content of ??? dynamically in this test setup easily without knowing state,
      // we check for the item name "Up Quark".
      
      // "Up Quark" text is only rendered if discovered/sandbox.
      expect(screen.getAllByText('Up Quark')[0]).toBeInTheDocument();
    });
  });

});
