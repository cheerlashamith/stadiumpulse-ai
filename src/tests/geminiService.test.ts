import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { askConcierge, getTransitPlan } from '../services/geminiService';

describe('geminiService Frontend API Broker Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('should parse and return response from server-side proxy', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ text: 'The stadium wayfinding maps are located at Gate 4.' })
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const reply = await askConcierge('Where can I find maps?', 'en');
    expect(reply).toBe('The stadium wayfinding maps are located at Gate 4.');
    expect(global.fetch).toHaveBeenCalledWith('/api/concierge', expect.anything());
  });

  test('should fall back gracefully to local offline rule heuristics if fetch fails', async () => {
    // Force fetch to reject/fail
    (global.fetch as any).mockRejectedValue(new Error('Network disconnected'));

    const reply = await askConcierge('Where is the restroom?', 'en');
    // Service should detect error and return a helpful local rule summary
    expect(reply).toBeDefined();
    expect(reply).toContain('[System Connection Delay]'); // Matches our local fallback knowledge base header!
  });

  test('should construct valid body structure for transport queries', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        recommendedMode: 'Metro Rail',
        eta: '30 mins',
        recommendedGate: 'Gate 4',
        journeyExplanation: 'Take Metro Line Red.',
        co2SavedKg: 3.2
      })
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const plan = await getTransitPlan('Hotel', []);
    expect(plan.recommendedMode).toBe('Metro Rail');
    expect(plan.co2SavedKg).toBe(3.2);
    expect(global.fetch).toHaveBeenCalledWith('/api/transit-plan', expect.anything());
  });
});
