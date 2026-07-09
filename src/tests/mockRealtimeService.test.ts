import { describe, test, expect, vi } from 'vitest';
import { mockRealtimeService } from '../services/mockRealtimeService';

describe('mockRealtimeService State Engine Tests', () => {
  test('should load valid initial stadium state', () => {
    const state = mockRealtimeService.getState();
    expect(state.zones).toBeDefined();
    expect(state.zones.length).toBeGreaterThan(0);
    expect(state.incidents).toBeDefined();
    expect(state.tasks).toBeDefined();
  });

  test('should execute observer notifications on state updates', () => {
    const callback = vi.fn();
    const unsubscribe = mockRealtimeService.subscribe(callback);

    // Report a new incident to trigger a state update
    mockRealtimeService.reportIncident({
      zoneId: 'zone-b',
      title: 'Spilled Soda Row 10',
      severity: 'low',
      status: 'active',
      description: 'Minor clean up required.'
    });

    expect(callback).toHaveBeenCalled();
    const lastCalledWith = callback.mock.calls[0][0];
    expect(lastCalledWith.incidents.some((i: any) => i.title === 'Spilled Soda Row 10')).toBe(true);

    unsubscribe();
  });

  test('should ensure crowd density occupancy bounds are valid', () => {
    const state = mockRealtimeService.getState();
    for (const zone of state.zones) {
      expect(zone.occupancy).toBeGreaterThanOrEqual(0);
      expect(zone.occupancy).toBeLessThanOrEqual(zone.capacity);
    }
  });

  test('should successfully assign and complete volunteer tasks', () => {
    const state = mockRealtimeService.getState();
    const pendingTasks = state.tasks.filter(t => t.status === 'pending');
    if (pendingTasks.length > 0) {
      const targetTask = pendingTasks[0];
      
      // Assign
      mockRealtimeService.assignTask(targetTask.id, 'Volunteer 101');
      let updatedState = mockRealtimeService.getState();
      let updatedTask = updatedState.tasks.find(t => t.id === targetTask.id);
      expect(updatedTask?.status).toBe('assigned');
      expect(updatedTask?.assignedTo).toBe('Volunteer 101');

      // Complete
      mockRealtimeService.completeTask(targetTask.id);
      updatedState = mockRealtimeService.getState();
      updatedTask = updatedState.tasks.find(t => t.id === targetTask.id);
      expect(updatedTask?.status).toBe('completed');
    }
  });
});
