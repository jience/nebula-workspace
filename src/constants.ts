import { ResourceType, VDIResource, ActivityLogEntry, User } from './types';

export const MOCK_RESOURCES: VDIResource[] = [
  {
    id: 'res-1',
    name: 'Dev Workstation Alpha',
    type: ResourceType.DESKTOP,
    os: 'Windows 11 Pro',
    status: 'running',
    region: 'US-East (N. Virginia)',
    cpu: 8,
    ram: 32
  },
  {
    id: 'res-2',
    name: 'Linux Build Server',
    type: ResourceType.DESKTOP,
    os: 'Ubuntu 22.04 LTS',
    status: 'stopped',
    region: 'EU-West (London)',
    cpu: 4,
    ram: 16
  },
  {
    id: 'res-3',
    name: 'VS Code Remote',
    type: ResourceType.APPLICATION,
    os: 'vApp',
    status: 'running',
    region: 'US-East (N. Virginia)',
    cpu: 2,
    ram: 8
  },
  {
    id: 'res-4',
    name: 'SAP GUI',
    type: ResourceType.APPLICATION,
    os: 'vApp',
    status: 'maintenance',
    region: 'Asia-Pacific (Tokyo)',
    cpu: 2,
    ram: 4
  },
  {
    id: 'res-5',
    name: 'Creative Suite Host',
    type: ResourceType.DESKTOP,
    os: 'macOS Sonoma',
    status: 'running',
    region: 'US-West (Oregon)',
    cpu: 12,
    ram: 64
  }
];

export const MOCK_USER: User = {
  id: 'u-123',
  name: 'Alex Chen',
  email: 'alex.chen@nebula.corp',
  avatarUrl: 'https://picsum.photos/200/200',
  role: 'Senior DevOps Engineer',
  department: 'Cloud Infrastructure',
  location: 'San Francisco, CA',
  status: 'online',
  joinDate: 'March 2022'
};

// Mock latency data for the dashboard chart
export const LATENCY_DATA = [
  { time: '10:00', ms: 25 },
  { time: '10:05', ms: 28 },
  { time: '10:10', ms: 22 },
  { time: '10:15', ms: 35 },
  { time: '10:20', ms: 24 },
  { time: '10:25', ms: 20 },
  { time: '10:30', ms: 21 },
];

export const MOCK_ACTIVITY_LOG: ActivityLogEntry[] = [
  {
    id: 'log-1',
    resourceId: 'res-1',
    resourceName: 'Dev Workstation Alpha',
    type: ResourceType.DESKTOP,
    action: 'LAUNCHED',
    timestamp: '2 mins ago'
  },
  {
    id: 'log-2',
    resourceId: 'res-3',
    resourceName: 'VS Code Remote',
    type: ResourceType.APPLICATION,
    action: 'DISCONNECTED',
    timestamp: '45 mins ago'
  },
  {
    id: 'log-3',
    resourceId: 'res-3',
    resourceName: 'VS Code Remote',
    type: ResourceType.APPLICATION,
    action: 'LAUNCHED',
    timestamp: '1 hour ago'
  },
  {
    id: 'log-4',
    resourceId: 'res-2',
    resourceName: 'Linux Build Server',
    type: ResourceType.DESKTOP,
    action: 'STOPPED',
    timestamp: '3 hours ago'
  },
  {
    id: 'log-5',
    resourceId: 'res-5',
    resourceName: 'Creative Suite Host',
    type: ResourceType.DESKTOP,
    action: 'DISCONNECTED',
    timestamp: 'Yesterday, 5:30 PM'
  },
  {
    id: 'log-6',
    resourceId: 'res-5',
    resourceName: 'Creative Suite Host',
    type: ResourceType.DESKTOP,
    action: 'LAUNCHED',
    timestamp: 'Yesterday, 9:00 AM'
  },
  {
    id: 'log-7',
    resourceId: 'res-4',
    resourceName: 'SAP GUI',
    type: ResourceType.APPLICATION,
    action: 'DISCONNECTED',
    timestamp: '2 days ago'
  }
];