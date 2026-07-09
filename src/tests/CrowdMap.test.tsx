import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AppStateProvider } from '../hooks/useAppState';
import { CrowdMap } from '../features/crowd/CrowdMap';

// Mock the getCrowdRecommendations function to bypass relative fetch URL calls in unit tests
vi.mock('../services/geminiService', () => ({
  getCrowdRecommendations: vi.fn().mockResolvedValue({
    fanDirective: 'Gates 1, 2, and 4 are operating smoothly. Gate 3 is busy but fully staffed.',
    staffDirective: 'Monitor southern concourses and turnstile access lines.',
    severity: 'medium'
  }),
  askConcierge: vi.fn(),
  getTransitPlan: vi.fn(),
  getShiftBriefing: vi.fn(),
  getAnomalyDiagnosis: vi.fn()
}));

describe('CrowdMap Component Integration Tests', () => {
  test('should render crowd segments on screen and display live tag', async () => {
    render(
      <AppStateProvider>
        <CrowdMap />
      </AppStateProvider>
    );

    // Wrap screen assertions in async waitFor block to capture async state updates safely inside act()
    await waitFor(() => {
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
});
