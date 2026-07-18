import initialZones from '../data/zones.json';
import initialIncidents from '../data/incidents.json';
import initialTransport from '../data/transport.json';
import { StadiumZone, Incident, VolunteerTask, TransportOption } from '../types';

export interface RealtimeState {
  zones: StadiumZone[];
  incidents: Incident[];
  tasks: VolunteerTask[];
  transport: TransportOption[];
}

/**
 * Simulator engine driving real-time updates for stadium digital twins.
 * Simulates crowd fluctuations, transport arrivals, incident management, and volunteer tracking.
 *
 * Serves Area 2 (Crowd management) & Area 7 (Operational intelligence)
 */
class MockRealtimeService {
  private state: RealtimeState;
  private listeners: Set<(state: RealtimeState) => void> = new Set();
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Deep clone static JSON seeds as initial state
    this.state = {
      zones: JSON.parse(JSON.stringify(initialZones)),
      incidents: JSON.parse(JSON.stringify(initialIncidents)),
      tasks: [
        {
          id: "task-1",
          incidentId: "inc-101",
          title: "Setup outer barrier lane direction at South Gate",
          description: "Assist fans stuck at Gate 3 South turnstiles due to scanner slow-downs.",
          status: "assigned",
          assignedTo: "Volunteer #12",
          location: "Gate 3 - South Gate",
          severity: "high"
        },
        {
          id: "task-2",
          incidentId: "inc-102",
          title: "Assess Fan Heat Exhaustion",
          description: "Bring water bottles and check vitals of elderly fan near Food Stall #4.",
          status: "pending",
          location: "Zone B - East Stand Concourse",
          severity: "medium"
        }
      ],
      transport: JSON.parse(JSON.stringify(initialTransport))
    };

    this.startSimulation();
  }

  /**
   * Periodically updates crowd data and transit ETAs, simulating sensor ticks.
   * Batching changes to notify listeners once per interval to optimize render efficiency.
   * 
   * Serves Area 2 (Crowd management) & Area 7 (Operational intelligence)
   */
  private startSimulation() {
    setInterval(() => {
      let stateChanged = false;

      // 1. Simulating crowd fluctuations
      this.state.zones = this.state.zones.map(zone => {
        const changeRate = (Math.random() - 0.45) * 200; // Average increase
        let newOccupancy = Math.max(0, Math.min(zone.capacity, Math.round(zone.occupancy + changeRate)));
        
        // Occasional abnormal spike simulation for anomaly detection
        if (Math.random() > 0.88) {
          newOccupancy = Math.min(zone.capacity, Math.round(newOccupancy + zone.capacity * 0.15));
        }

        const crowdRatio = newOccupancy / zone.capacity;
        let crowdLevel: StadiumZone['crowdLevel'] = 'low';
        if (crowdRatio > 0.8) {
          crowdLevel = 'high';
        } else if (crowdRatio > 0.4) {
          crowdLevel = 'medium';
        }

        if (newOccupancy !== zone.occupancy || crowdLevel !== zone.crowdLevel) {
          stateChanged = true;
          return {
            ...zone,
            occupancy: newOccupancy,
            crowdLevel
          };
        }
        return zone;
      });

      // 2. Fluctuate transport ETAs slightly
      this.state.transport = this.state.transport.map(option => {
        if (option.type !== 'parking' && Math.random() > 0.7) {
          stateChanged = true;
          const currentMin = parseInt(option.eta);
          if (!isNaN(currentMin)) {
            const nextMin = Math.max(2, currentMin + (Math.random() > 0.5 ? 1 : -1));
            return {
              ...option,
              eta: `${nextMin} mins`
            };
          }
        }
        return option;
      });

      // Notify if state updated
      if (stateChanged) {
        this.notifyListeners();
      }
    }, 5000);
  }

  /**
   * Subscribes a listener callback to real-time state changes.
   * Immediately emits the initial state to sync components on mount.
   *
   * @param {function} listener - State observer callback.
   * @returns {function} Unsubscribe callback to detach listener and clear memory.
   */
  public subscribe(listener: (state: RealtimeState) => void): () => void {
    this.listeners.add(listener);
    // Emit initial state immediately
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  /**
   * Fetches the current snapshot of the arena's real-time twin state.
   *
   * @returns {RealtimeState} The active state metrics wrapper.
   */
  public getState(): RealtimeState {
    return this.state;
  }

  /**
   * Reports a new crowd congestion, safety, or medical incident in a zone.
   * Automatically allocates an active volunteer task, linking it to the incident ID.
   *
   * @param {Omit<Incident, 'id' | 'timestamp'>} incident - Reported incident parameter fields.
   * @returns {Incident} The newly created incident record containing generated IDs and timestamps.
   */
  public reportIncident(incident: Omit<Incident, 'id' | 'timestamp'>): Incident {
    const newIncident: Incident = {
      ...incident,
      id: `inc-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.state.incidents = [newIncident, ...this.state.incidents];
    
    // Auto-generate a volunteer task for this incident
    const newTask: VolunteerTask = {
      id: `task-${Date.now()}`,
      incidentId: newIncident.id,
      title: `Respond to: ${newIncident.title}`,
      description: newIncident.description,
      status: 'pending',
      location: this.state.zones.find(z => z.id === incident.zoneId)?.name || 'Stadium Perimeters',
      severity: incident.severity
    };
    this.state.tasks = [newTask, ...this.state.tasks];

    this.notifyListeners();
    return newIncident;
  }

  /**
   * Assigns a volunteer to claim and resolve an active task.
   * Updates state variables and triggers subscriber updates.
   *
   * @param {string} taskId - The ID of target volunteer task.
   * @param {string} volunteerName - Claiming volunteer agent name.
   */
  public assignTask(taskId: string, volunteerName: string) {
    this.state.tasks = this.state.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: 'assigned', assignedTo: volunteerName };
      }
      return task;
    });
    this.notifyListeners();
  }

  /**
   * Marks a volunteer task as fully resolved.
   * Feeds back into automatically updating and resolving the underlying logged incident.
   *
   * @param {string} taskId - The ID of completed volunteer task.
   */
  public completeTask(taskId: string) {
    let incidentIdToResolve = '';
    
    this.state.tasks = this.state.tasks.map(task => {
      if (task.id === taskId) {
        incidentIdToResolve = task.incidentId;
        return { ...task, status: 'completed' };
      }
      return task;
    });

    if (incidentIdToResolve) {
      this.state.incidents = this.state.incidents.map(inc => {
        if (inc.id === incidentIdToResolve) {
          return { ...inc, status: 'resolved' };
        }
        return inc;
      });
    }

    this.notifyListeners();
  }
}

export const mockRealtimeService = new MockRealtimeService();
