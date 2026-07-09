export type CrowdLevel = 'low' | 'medium' | 'high';

export interface StadiumZone {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  crowdLevel: CrowdLevel;
  description: string;
  accessible: boolean;
  accessibleRoutes: string[];
}

export interface Incident {
  id: string;
  zoneId: string;
  title: string;
  status: 'active' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
}

export interface VolunteerTask {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'completed';
  assignedTo?: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TransportOption {
  id: string;
  name: string;
  type: 'metro' | 'bus' | 'rideshare' | 'parking';
  status: 'fluid' | 'congested' | 'delayed' | 'on-time';
  eta: string;
  description: string;
  carbonSaved: number; // in kg CO2
  capacity: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export type AppLanguage = 'en' | 'es' | 'hi' | 'fr' | 'ar';

export type UserRole = 'fan' | 'accessibility_fan' | 'volunteer' | 'organizer';
