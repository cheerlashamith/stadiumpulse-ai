import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppStateProvider } from '../hooks/useAppState';
import { AccessibilitySuite } from '../features/accessibility/AccessibilitySuite';

describe('Accessibility Suite Toggle Tests', () => {
  test('should toggle high contrast mode state when button is clicked', () => {
    render(
      <AppStateProvider>
        <AccessibilitySuite />
      </AppStateProvider>
    );

    // Locate the toggle button for High Contrast
    const toggleButton = screen.getByText(/High Contrast/i).closest('button');
    expect(toggleButton).toBeDefined();

    // Verify initial attribute
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('false');

    // Click to activate
    fireEvent.click(toggleButton!);

    // Verify changed attribute
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('true');
  });

  test('should toggle text size when font button is clicked', () => {
    render(
      <AppStateProvider>
        <AccessibilitySuite />
      </AppStateProvider>
    );

    // Locate the Text Size button
    const sizeButton = screen.getByText(/Large Text|Regular Text/i).closest('button');
    expect(sizeButton).toBeDefined();

    // Verify initial state
    expect(sizeButton?.getAttribute('aria-pressed')).toBe('false');

    // Click to toggle
    fireEvent.click(sizeButton!);

    // Should indicate the button has been toggled to active
    expect(sizeButton?.getAttribute('aria-pressed')).toBe('true');
  });
});
