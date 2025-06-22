import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  Plane, 
  MapPin, 
  Activity, 
  Shield, 
  Radio, 
  Users, 
  AlertTriangle,
  Play,
  Pause,
  Square,
  Settings,
  Battery,
  Signal,
  Wifi,
  Navigation,
  Satellite
} from 'lucide-react';
import DroneMap from './components/DroneMap';
import TelemetryPanel from './components/TelemetryPanel';
import MissionControl from './components/MissionControl';
import SwarmStatus from './components/SwarmStatus';
import AlertSystem from './components/AlertSystem';
import GPSTracker from './components/GPSTracker';

interface Drone {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'maintenance' | 'offline';
  position: { lat: number; lng: number; alt: number };
  battery: number;
  signal: number;
  mission?: string;
  formation?: string;
}

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
  type: 'checkpoint' | 'target' | 'home' | 'landing';
  order: number;
}

function App() {
  const [drones, setDrones] = useState<Drone[]>([
    {
      id: 'DR-001',
      name: 'Alpha Leader',
      status: 'active',
      position: { lat: 37.7749, lng: -122.4194, alt: 150 },
      battery: 87,
      signal: 95,
      mission: 'Search Pattern Alpha',
      formation: 'diamond'
    },
    {
      id: 'DR-002',
      name: 'Beta Wing',
      status: 'active',
      position: { lat: 37.7739, lng: -122.4184, alt: 145 },
      battery: 92,
      signal: 88,
      mission: 'Search Pattern Alpha',
      formation: 'diamond'
    },
    {
      id: 'DR-003',
      name: 'Gamma Scout',
      status: 'active',
      position: { lat: 37.7759, lng: -122.4174, alt: 155 },
      battery: 76,
      signal: 91,
      mission: 'Perimeter Sweep',
      formation: 'line'
    },
    {
      id: 'DR-004',
      name: 'Delta Support',
      status: 'standby',
      position: { lat: 37.7729, lng: -122.4204, alt: 0 },
      battery: 100,
      signal: 100,
      formation: 'standby'
    },
    {
      id: 'DR-005',
      name: 'Echo Reserve',
      status: 'maintenance',
      position: { lat: 37.7719, lng: -122.4214, alt: 0 },
      battery: 45,
      signal: 0,
      formation: 'maintenance'
    }
  ]);

  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    {
      id: 'WP-001',
      name: 'Search Zone Alpha',
      lat: 37.7749,
      lng: -122.4194,
      alt: 150,
      type: 'target',
      order: 1
    },
    {
      id: 'WP-002',
      name: 'Checkpoint Bravo',
      lat: 37.7759,
      lng: -122.4184,
      alt: 145,
      type: 'checkpoint',
      order: 2
    },
    {
      id: 'WP-003',
      name: 'Home Base',
      lat: 37.7739,
      lng: -122.4204,
      alt: 0,
      type: 'home',
      order: 0
    }
  ]);

  const [missionStatus, setMissionStatus] = useState<'planning' | 'active' | 'paused' | 'completed'>('active');
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState(98);
  const [activeView, setActiveView] = useState<'map' | 'gps'>('map');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDrones(prev => prev.map(drone => ({
        ...drone,
        battery: Math.max(0, drone.battery - (Math.random() * 0.5)),
        signal: Math.min(100, Math.max(70, drone.signal + (Math.random() - 0.5) * 10)),
        position: drone.status === 'active' ? {
          ...drone.position,
          lat: drone.position.lat + (Math.random() - 0.5) * 0.001,
          lng: drone.position.lng + (Math.random() - 0.5) * 0.001,
          alt: Math.max(100, Math.min(200, drone.position.alt + (Math.random() - 0.5) * 5))
        } : drone.position
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleWaypointAdd = (waypoint: Waypoint) => {
    setWaypoints(prev => [...prev, waypoint]);
  };

  const activeDrones = drones.filter(d => d.status === 'active').length;
  const totalDrones = drones.length;
  const gpsConnectedDrones = drones.filter(d => d.status !== 'offline').length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Radar className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">DroneFleet Command</h1>
            </div>
            <div className="text-sm text-gray-400">
              Civilian Search & Rescue Operations
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Satellite className="w-4 h-4 text-green-400" />
              <span className="text-sm">GPS: {gpsConnectedDrones}/{totalDrones} Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">System Operational</span>
            </div>
            <div className="text-sm">
              {activeDrones}/{totalDrones} Active
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          <SwarmStatus 
            drones={drones}
            selectedDrone={selectedDrone}
            onSelectDrone={setSelectedDrone}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Controls */}
          <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMissionStatus(missionStatus === 'active' ? 'paused' : 'active')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      missionStatus === 'active' 
                        ? 'bg-yellow-600 hover:bg-yellow-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {missionStatus === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{missionStatus === 'active' ? 'Pause' : 'Resume'}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                    <Square className="w-4 h-4" />
                    <span>Stop All</span>
                  </button>
                </div>
                
                <div className="text-sm text-gray-400">
                  Mission: Search & Rescue Operation Alpha-7
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView('map')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                      activeView === 'map' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Map</span>
                  </button>
                  <button
                    onClick={() => setActiveView('gps')}
                    className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                      activeView === 'gps' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Satellite className="w-4 h-4" />
                    <span className="text-sm">GPS</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm">System Health: {systemHealth}%</span>
                </div>
                <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Map and Telemetry */}
          <div className="flex-1 flex">
            <div className="flex-1">
              {activeView === 'map' ? (
                <DroneMap 
                  drones={drones}
                  selectedDrone={selectedDrone}
                  onSelectDrone={setSelectedDrone}
                  waypoints={waypoints}
                />
              ) : (
                <GPSTracker
                  drones={drones}
                  selectedDrone={selectedDrone}
                  onWaypointAdd={handleWaypointAdd}
                />
              )}
            </div>
            <div className="w-96 border-l border-gray-700">
              <TelemetryPanel 
                drones={drones}
                selectedDrone={selectedDrone}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <MissionControl 
            missionStatus={missionStatus}
            onMissionStatusChange={setMissionStatus}
          />
          <AlertSystem />
        </div>
      </div>
    </div>
  );
}

export default App;