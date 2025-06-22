import React from 'react';
import { Plane, MapPin, Navigation, Route, Target, Crosshair } from 'lucide-react';

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

interface DroneMapProps {
  drones: Drone[];
  selectedDrone: string | null;
  onSelectDrone: (id: string | null) => void;
  waypoints?: Waypoint[];
}

const DroneMap: React.FC<DroneMapProps> = ({ drones, selectedDrone, onSelectDrone, waypoints = [] }) => {
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
      case 'home': return 'bg-green-500 border-green-400 shadow-green-500/50';
      case 'target': return 'bg-red-500 border-red-400 shadow-red-500/50';
      case 'checkpoint': return 'bg-blue-500 border-blue-400 shadow-blue-500/50';
      case 'landing': return 'bg-yellow-500 border-yellow-400 shadow-yellow-500/50';
      default: return 'bg-gray-500 border-gray-400 shadow-gray-500/50';
    }
  };

  return (
    <div className="h-full bg-gray-900 relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* GPS Coordinate Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
          37.7759° N
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono">
          37.7729° N
        </div>
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-gray-400 font-mono">
          122.4214° W
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-xs text-gray-400 font-mono">
          122.4174° W
        </div>
      </div>

      {/* Waypoints */}
      <div className="absolute inset-0 p-8">
        <div className="relative h-full w-full">
          {waypoints.map((waypoint, index) => {
            const x = 15 + (index % 4) * 20 + Math.random() * 5;
            const y = 15 + Math.floor(index / 4) * 25 + Math.random() * 5;
            
            return (
              <div
                key={waypoint.id}
                className="absolute transition-all duration-300"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className={`relative p-2 rounded-lg border-2 ${getWaypointColor(waypoint.type)} shadow-lg`}>
                  {getWaypointIcon(waypoint.type)}
                  
                  {/* Waypoint Label */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1">
                    <div className="bg-gray-800 border border-gray-600 rounded px-2 py-1 whitespace-nowrap text-xs">
                      <div className="font-semibold text-white">{waypoint.name}</div>
                      <div className="text-gray-400">#{waypoint.order}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Flight Path Lines */}
          {waypoints.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {waypoints.sort((a, b) => a.order - b.order).map((waypoint, index) => {
                if (index === waypoints.length - 1) return null;
                const nextWaypoint = waypoints.find(w => w.order === waypoint.order + 1);
                if (!nextWaypoint) return null;
                
                const x1 = 15 + (index % 4) * 20 + 2.5;
                const y1 = 15 + Math.floor(index / 4) * 25 + 2.5;
                const x2 = 15 + ((index + 1) % 4) * 20 + 2.5;
                const y2 = 15 + Math.floor((index + 1) / 4) * 25 + 2.5;
                
                return (
                  <line
                    key={`path-${waypoint.id}`}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                );
              })}
            </svg>
          )}

          {/* Drone Positions */}
          {drones.map((drone, index) => {
            const x = 25 + (index % 3) * 25 + Math.random() * 10;
            const y = 25 + Math.floor(index / 3) * 20 + Math.random() * 10;
            
            return (
              <div
                key={drone.id}
                className={`absolute transition-all duration-300 cursor-pointer transform hover:scale-110 ${
                  selectedDrone === drone.id ? 'scale-125 z-10' : ''
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onSelectDrone(drone.id)}
              >
                {/* Drone Icon */}
                <div className={`relative p-3 rounded-full border-2 ${
                  drone.status === 'active' 
                    ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50' 
                    : drone.status === 'standby'
                    ? 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50'
                    : drone.status === 'maintenance'
                    ? 'bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/50'
                    : 'bg-red-500 border-red-400 shadow-lg shadow-red-500/50'
                }`}>
                  <Plane className="w-6 h-6 text-white" />
                  
                  {/* Pulse Animation for Active Drones */}
                  {drone.status === 'active' && (
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30"></div>
                  )}
                </div>

                {/* GPS Coordinates Tooltip */}
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 transition-opacity ${
                  selectedDrone === drone.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                }`}>
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 whitespace-nowrap text-sm">
                    <div className="font-semibold text-white">{drone.name}</div>
                    <div className="text-gray-300">{drone.id}</div>
                    <div className="font-mono text-xs text-blue-400 mt-1">
                      {drone.position.lat.toFixed(6)}°N
                    </div>
                    <div className="font-mono text-xs text-blue-400">
                      {Math.abs(drone.position.lng).toFixed(6)}°W
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">Alt:</span>
                      <span className="text-xs text-white">{drone.position.alt}m</span>
                    </div>
                    {drone.mission && (
                      <div className="text-xs text-blue-400 mt-1">{drone.mission}</div>
                    )}
                  </div>
                </div>

                {/* GPS Accuracy Circle */}
                {drone.status === 'active' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-24 h-24 border border-blue-400 opacity-20 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                    <div className="w-32 h-32 border border-blue-400 opacity-10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 flex flex-col space-y-2">
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2 rounded-lg transition-colors">
          <Navigation className="w-5 h-5" />
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2 rounded-lg transition-colors">
          <MapPin className="w-5 h-5" />
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2 rounded-lg transition-colors">
          <Route className="w-5 h-5" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800 border border-gray-600 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-white mb-2">Status Legend</h3>
        <div className="space-y-1 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Standby</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-300">Offline</span>
          </div>
        </div>
        <h4 className="text-xs font-semibold text-white mb-1">Waypoints</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3 h-3 text-green-400" />
            <span className="text-xs text-gray-300">Home</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-3 h-3 text-red-400" />
            <span className="text-xs text-gray-300">Target</span>
          </div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-gray-300">Checkpoint</span>
          </div>
        </div>
      </div>

      {/* GPS Coordinates Display */}
      <div className="absolute top-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-3">
        <div className="text-xs text-gray-400">Search Area Center</div>
        <div className="font-mono text-sm text-white">37.7749° N, 122.4194° W</div>
        <div className="text-xs text-gray-400 mt-1">Coverage: 2.5 km² | GPS Accuracy: ±2.1m</div>
        <div className="text-xs text-green-400 mt-1">12 Satellites | 3D Fix</div>
      </div>
    </div>
  );
};

export default DroneMap;