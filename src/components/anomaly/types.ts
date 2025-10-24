export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface Note {
  id: string;
  title: string;
  text: string;
  timestamp: string;
  tags: string[];
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'climate' | 'security' | 'media';
  status: boolean;
  value?: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
}

export interface SystemStats {
  cpu: number;
  ram: number;
  disk: number;
}
