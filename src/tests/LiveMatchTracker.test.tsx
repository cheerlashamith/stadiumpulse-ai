import React from 'react';
import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppStateProvider } from '../hooks/useAppState';
import { LiveMatchTracker } from '../features/tracking/LiveMatchTracker';

describe('LiveMatchTracker Component Tests', () => {
  test('renders scoreboard, teams and control buttons correctly', () => {
    render(
      <AppStateProvider>
        <LiveMatchTracker />
      </AppStateProvider>
    );

    // Scoreboard header
    expect(screen.getByText(/StadiumPulse Derby/i)).toBeDefined();
    
    // Team short codes
    expect(screen.getByText('EMD')).toBeDefined();
    expect(screen.getByText('TEL')).toBeDefined();

    // Mode selectors
    expect(screen.getByText('Live Tracker')).toBeDefined();
    expect(screen.getByText('Tactical Heatmap')).toBeDefined();
    expect(screen.getByText('Pass Vectors')).toBeDefined();

    // Playback control button
    expect(screen.getByText(/Pause Live Stream/i)).toBeDefined();
  });

  test('toggles views and displays correct mode overlays', async () => {
    render(
      <AppStateProvider>
        <LiveMatchTracker />
      </AppStateProvider>
    );

    // Initially in Live Tracker view, clicking Heatmap
    const heatmapBtn = screen.getByText('Tactical Heatmap');
    fireEvent.click(heatmapBtn);
    
    // Check mode text updates
    expect(screen.getByText(/MODE: HEATMAP/i)).toBeDefined();

    // Clicking Pass Vectors
    const vectorsBtn = screen.getByText('Pass Vectors');
    fireEvent.click(vectorsBtn);
    expect(screen.getByText(/MODE: VECTORS/i)).toBeDefined();
  });

  test('injects match events via simulated game scripts', () => {
    render(
      <AppStateProvider>
        <LiveMatchTracker />
      </AppStateProvider>
    );

    // Verify simulate buttons are present
    const goalBtn = screen.getByText('Simulate Goal');
    const foulBtn = screen.getByText('Simulate Foul');
    
    expect(goalBtn).toBeDefined();
    expect(foulBtn).toBeDefined();

    // Fire events and ensure simulation pauses/updates state
    fireEvent.click(goalBtn);
    expect(screen.getByText(/Resume Tracking/i)).toBeDefined(); // Toggled to pause mode
  });
});
