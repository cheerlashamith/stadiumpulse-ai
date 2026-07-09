import { mockRealtimeService } from '../../services/mockRealtimeService';

export const apiClient = {
  getRealtimeService: () => mockRealtimeService,
  reportIncident: (incident: any) => mockRealtimeService.reportIncident(incident),
  assignTask: (taskId: string, volunteer: string) => mockRealtimeService.assignTask(taskId, volunteer),
  completeTask: (taskId: string) => mockRealtimeService.completeTask(taskId),
  getState: () => mockRealtimeService.getState()
};
