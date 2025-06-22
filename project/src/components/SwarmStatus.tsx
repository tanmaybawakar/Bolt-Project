import React from 'react';
import { Plane, Battery, Signal, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

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

interface SwarmStatusProps {
  drones: Drone[];
  selectedDrone: string | null;
  onSelectDrone: (id: string | null) => void;
}

const SwarmStatus: React.FC<SwarmStatusProps> = ({ drones, selectedDrone, onSelectDrone }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'standby': return 'text-yellow-400 bg-yellow-900/20';
      case 'maintenance': return 'text-orange-400 bg-orange-900/20';
      case 'offline': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-400';
    if (battery > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSignalColor = (signal: number) => {
    if (signal > 80) return 'text-green-400';
    if (signal > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-2">Fleet Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{drones.filter(d => d.status === 'active').length}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{drones.length}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {drones.map((drone) => (
            <div
              key={drone.id}
              className={`bg-gray-700/30 rounded-lg p-4 border transition-all cursor-pointer hover:bg-gray-700/50 ${
                selectedDrone === drone.id 
                  ? 'border-blue-400 bg-blue-900/20' 
                  : 'border-gray-600'
              }`}
              onClick={() => onSelectDrone(drone.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(drone.status)}`}>
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{drone.name}</div>
                    <div className="text-xs text-gray-400">{drone.id}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {drone.status === 'active' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : drone.battery < 20 ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Battery className={`w-4 h-4 ${getBatteryColor(drone.battery)}`} />
                  <span className="text-sm text-white">{Math.round(drone.battery)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Signal className={`w-4 h-4 ${getSignalColor(drone.signal)}`} />
                  <span className="text-sm text-white">{Math.round(drone.signal)}%</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-2">
                <div>Alt: {drone.position.alt}m</div>
                {drone.mission && (
                  <div className="text-blue-400 mt-1">{drone.mission}</div>
                )}
              </div>

              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drone.status)}`}>
                {drone.status.charAt(0).toUpperCase() + drone.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwarmStatus;