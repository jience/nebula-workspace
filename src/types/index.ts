export enum ResourceType {
  DESKTOP = 'DESKTOP',
  APPLICATION = 'APPLICATION'
}

export enum SessionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED'
}

export enum ConnectionQuality {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  POOR = 'POOR'
}

export interface VDIResource {
  id: string;
  name: string;
  type: ResourceType;
  os: string; // e.g., 'Windows 11', 'Ubuntu', 'vApp'
  status: 'running' | 'stopped' | 'maintenance';
  region: string;
  cpu: number; // Cores
  ram: number; // GB
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  department: string;
  location: string;
  status: 'online' | 'away' | 'dnd' | 'offline';
  joinDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ActivityLogEntry {
  id: string;
  resourceId: string;
  resourceName: string;
  type: ResourceType;
  action: 'LAUNCHED' | 'DISCONNECTED' | 'STOPPED';
  timestamp: string;
}