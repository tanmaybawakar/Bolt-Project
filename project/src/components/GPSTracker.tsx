import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  Satellite,
  Target,
  Route,
  Plus,
  Trash2,
  Play,
  Square
} from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alt: number;
  type: 'checkpoint' | 'target' | 'home' | 'landing';
  order: number;
}

interface Drone {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'maintenance' | 'offline';
  position: { lat: number; lng: number; alt: number };
  battery: number;
  signal: number;
  mission?: string;
  formation?: string;
  gpsAccuracy?: number;
  satelliteCount?: number;
  speed?: number;
  heading?: number;
}

interface GPSTrackerProps {
  drones: Drone[];
  selectedDrone: string | null;
  onWaypointAdd: (waypoint: Waypoint) => void;
}

const GPSTracker: React.FC<GPSTrackerProps> = ({ drones, selectedDrone, onWaypointAdd }) => {
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

  const [newWaypoint, setNewWaypoint] = useState({
    name: '',
    lat: '',
    lng: '',
    alt: '150',
    type: 'checkpoint' as const
  });

  const [gpsStatus, setGpsStatus] = useState({
    accuracy: 2.5,
    satelliteCount: 12,
    fixType: '3D',
    lastUpdate: new Date()
  });

  const selectedDroneData = selectedDrone ? drones.find(d => d.id === selectedDrone) : null;

  useEffect(() => {
    // Simulate GPS updates
    const interval = setInterval(() => {
      setGpsStatus(prev => ({
        ...prev,
        accuracy: Math.max(1, Math.min(10, prev.accuracy + (Math.random() - 0.5) * 0.5)),
        satelliteCount: Math.max(8, Math.min(16, prev.satelliteCount + Math.floor((Math.random() - 0.5) * 2))),
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addWaypoint = () => {
    if (newWaypoint.name && newWaypoint.lat && newWaypoint.lng) {
      const waypoint: Waypoint = {
        id: `WP-${Date.now()}`,
        name: newWaypoint.name,
        lat: parseFloat(newWaypoint.lat),
        lng: parseFloat(newWaypoint.lng),
        alt: parseFloat(newWaypoint.alt),
        type: newWaypoint.type,
        order: waypoints.length + 1
      };
      
      setWaypoints(prev => [...prev, waypoint]);
      onWaypointAdd(waypoint);
      setNewWaypoint({ name: '', lat: '', lng: '', alt: '150', type: 'checkpoint' });
    }
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(prev => prev.filter(wp => wp.id !== id));
  };

  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const abs = Math.abs(coord);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const getWaypointIcon = (type: string) => {
    switch (type) {
      case 'home': return <MapPin className="w-4 h-4 text-green-400" />;
      case 'target': return <Target className="w-4 h-4 text-red-400" />;
      case 'checkpoint': return <Navigation className="w-4 h-4 text-blue-400" />;
      case 'landing': return <Crosshair className="w-4 h-4 text-yellow-400" />;
      default: return <MapPin className="w-4 h-4 text-gray-400" />;
    }
  };

  const getWaypointColor = (type: string) => {
    switch (type) {
      case 'home': return 'border-green-400 bg-green-900/20';
      case 'target': return 'border-red-400 bg-red-900/20';
      case 'checkpoint': return 'border-blue-400 bg-blue-900/20';
      case 'landing': return 'border-yellow-400 bg-yellow-900/20';
      default: return 'border-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">GPS Navigation</h2>
          <div className="flex items-center space-x-2">
            <Satellite className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">{gpsStatus.satelliteCount} sats</span>
          </div>
        </div>
        
        {/* GPS Status */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-700/50 rounded p-2 text-center">
            <div className="text-green-400 font-semibold">{gpsStatus.fixType}</div>
            <div className="text-gray-400">Fix Type</div>
          </div>
          <div className="bg-gray-700/50 rounded p-2 text-center">
            <div className="text-blue-400 font-semibold">{gpsStatus.accuracy.toFixed(1)}m</div>
            <div className="text-gray-400">Accuracy</div>
          </div>
          <div className="bg-gray-700/50 rounded p-2 text-center">
            <div className="text-yellow-400 font-semibold">{gpsStatus.satelliteCount}</div>
            <div className="text-gray-400">Satellites</div>
          </div>
        </div>
      </div>

      {/* Current Position */}
      {selectedDroneData && (
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-2">
            Current Position - {selectedDroneData.name}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Latitude:</span>
              <span className="font-mono text-white">
                {formatCoordinate(selectedDroneData.position.lat, 'lat')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Longitude:</span>
              <span className="font-mono text-white">
                {formatCoordinate(selectedDroneData.position.lng, 'lng')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Altitude:</span>
              <span className="font-mono text-white">{selectedDroneData.position.alt}m MSL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Speed:</span>
              <span className="font-mono text-white">{(Math.random() * 20 + 10).toFixed(1)} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Heading:</span>
              <span className="font-mono text-white">{Math.floor(Math.random() * 360)}° True</span>
            </div>
          </div>
        </div>
      )}

      {/* Waypoint Management */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-3">Mission Waypoints</h3>
          
          {/* Add New Waypoint */}
          <div className="space-y-2 mb-4">
            <input
              type="text"
              placeholder="Waypoint name"
              value={newWaypoint.name}
              onChange={(e) => setNewWaypoint(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Latitude"
                step="0.000001"
                value={newWaypoint.lat}
                onChange={(e) => setNewWaypoint(prev => ({ ...prev, lat: e.target.value }))}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              />
              <input
                type="number"
                placeholder="Longitude"
                step="0.000001"
                value={newWaypoint.lng}
                onChange={(e) => setNewWaypoint(prev => ({ ...prev, lng: e.target.value }))}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Altitude (m)"
                value={newWaypoint.alt}
                onChange={(e) => setNewWaypoint(prev => ({ ...prev, alt: e.target.value }))}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              />
              <select
                value={newWaypoint.type}
                onChange={(e) => setNewWaypoint(prev => ({ ...prev, type: e.target.value as any }))}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              >
                <option value="checkpoint">Checkpoint</option>
                <option value="target">Target</option>
                <option value="home">Home</option>
                <option value="landing">Landing</option>
              </select>
            </div>
            <button
              onClick={addWaypoint}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Waypoint</span>
            </button>
          </div>
        </div>

        {/* Waypoint List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {waypoints.sort((a, b) => a.order - b.order).map((waypoint) => (
              <div
                key={waypoint.id}
                className={`rounded-lg border p-3 ${getWaypointColor(waypoint.type)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getWaypointIcon(waypoint.type)}
                    <span className="font-semibold text-white text-sm">{waypoint.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">#{waypoint.order}</span>
                    <button
                      onClick={() => removeWaypoint(waypoint.id)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
                
                <div className="text-xs space-y-1">
                  <div className="font-mono text-gray-300">
                    {waypoint.lat.toFixed(6)}, {waypoint.lng.toFixed(6)}
                  </div>
                  <div className="text-gray-400">
                    Alt: {waypoint.alt}m | Type: {waypoint.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Start Route</span>
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors flex items-center justify-center space-x-2">
              <Square className="w-4 h-4" />
              <span>Stop Nav</span>
            </button>
          </div>
          
          <div className="mt-2 text-xs text-center text-gray-400">
            Last GPS Update: {gpsStatus.lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSTracker;