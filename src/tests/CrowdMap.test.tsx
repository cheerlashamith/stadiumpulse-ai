import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppStateProvider } from '../hooks/useAppState';
import { CrowdMap } from '../features/crowd/CrowdMap';

describe('CrowdMap Component Integration Tests', () => {
  test('should render crowd segments on screen and display live tag', () => {
    render(
      <AppStateProvider>
        <CrowdMap />
      </AppStateProvider>
    );

    // Look for heading or title "Live Section & Gate Density"
    const heading = screen.getByText(/Gate Density/i);
    expect(heading).toBeDefined();

    // Look for status indicator text
    const liveIndicator = screen.getByText(/LIVE SENSORS/i);
    expect(liveIndicator).toBeDefined();

    // Verify some of our default zones like Gate 3 are rendered
    const gate3Tiles = screen.getAllByText(/Gate 3/i);
    expect(gate3Tiles.length).toBeGreaterThanOrEqual(1);
  });
});
