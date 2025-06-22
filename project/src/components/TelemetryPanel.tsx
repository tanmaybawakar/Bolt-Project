import React from 'react';
import { Activity, Battery, Signal, Thermometer, Wind, Compass, Satellite, MapPin } from 'lucide-react';

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

interface TelemetryPanelProps {
  drones: Drone[];
  selectedDrone: string | null;
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ drones, selectedDrone }) => {
  const selectedDroneData = selectedDrone ? drones.find(d => d.id === selectedDrone) : null;

  // Mock additional telemetry data including GPS
  const mockTelemetry = {
    speed: Math.random() * 20 + 10, // 10-30 m/s
    heading: Math.random() * 360,
    temperature: Math.random() * 10 + 15, // 15-25°C
    windSpeed: Math.random() * 5 + 2, // 2-7 m/s
    vibration: Math.random() * 0.5 + 0.1,
    flightTime: Math.floor(Math.random() * 3600 + 1800), // 30-90 minutes
    gpsAccuracy: Math.random() * 3 + 1, // 1-4 meters
    satelliteCount: Math.floor(Math.random() * 8) + 8, // 8-16 satellites
    hdop: Math.random() * 2 + 0.5, // 0.5-2.5 HDOP
    groundSpeed: Math.random() * 18 + 8, // 8-26 m/s
    verticalSpeed: (Math.random() - 0.5) * 4, // -2 to +2 m/s
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatCoordinate = (coord: number, type: 'lat' | 'lng') => {
    const abs = Math.abs(coord);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(2);
    const direction = type === 'lat' ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const getGPSQuality = (accuracy: number) => {
    if (accuracy < 2) return { color: 'text-green-400', label: 'Excellent' };
    if (accuracy < 5) return { color: 'text-yellow-400', label: 'Good' };
    return { color: 'text-red-400', label: 'Poor' };
  };

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Live Telemetry</h2>
        {selectedDroneData ? (
          <div className="text-sm text-blue-400 mt-1">
            {selectedDroneData.name} ({selectedDroneData.id})
          </div>
        ) : (
          <div className="text-sm text-gray-400 mt-1">
            Select a drone to view telemetry
          </div>
        )}
      </div>

      {selectedDroneData ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Primary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Battery className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Battery</span>
              </div>
              <div className="text-2xl font-bold text-white">{Math.round(selectedDroneData.battery)}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedDroneData.battery}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Signal className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Signal</span>
              </div>
              <div className="text-2xl font-bold text-white">{Math.round(selectedDroneData.signal)}%</div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedDroneData.signal}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* GPS Status */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
              <Satellite className="w-4 h-4 text-green-400" />
              <span>GPS Status</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{mockTelemetry.satelliteCount}</div>
                <div className="text-xs text-gray-400">Satellites</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGPSQuality(mockTelemetry.gpsAccuracy).color}`}>
                  {mockTelemetry.gpsAccuracy.toFixed(1)}m
                </div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Fix Quality:</span>
                <span className={`font-semibold ${getGPSQuality(mockTelemetry.gpsAccuracy).color}`}>
                  {getGPSQuality(mockTelemetry.gpsAccuracy).label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">HDOP:</span>
                <span className="font-mono text-white">{mockTelemetry.hdop.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fix Type:</span>
                <span className="text-green-400 font-semibold">3D</span>
              </div>
            </div>
          </div>

          {/* Position Data */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Position & Navigation</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Latitude:</span>
                <span className="font-mono text-white text-sm">{formatCoordinate(selectedDroneData.position.lat, 'lat')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Longitude:</span>
                <span className="font-mono text-white text-sm">{formatCoordinate(selectedDroneData.position.lng, 'lng')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Decimal:</span>
                <span className="font-mono text-white text-xs">
                  {selectedDroneData.position.lat.toFixed(6)}, {selectedDroneData.position.lng.toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Altitude MSL:</span>
                <span className="font-mono text-white">{selectedDroneData.position.alt}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ground Speed:</span>
                <span className="font-mono text-white">{mockTelemetry.groundSpeed.toFixed(1)} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vertical Speed:</span>
                <span className={`font-mono ${mockTelemetry.verticalSpeed > 0 ? 'text-green-400' : mockTelemetry.verticalSpeed < 0 ? 'text-red-400' : 'text-white'}`}>
                  {mockTelemetry.verticalSpeed > 0 ? '+' : ''}{mockTelemetry.verticalSpeed.toFixed(1)} m/s
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Heading:</span>
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span className="font-mono text-white">{mockTelemetry.heading.toFixed(0)}° True</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Data */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Environmental</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-400">Temperature:</span>
                </div>
                <span className="font-mono text-white">{mockTelemetry.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-400">Wind Speed:</span>
                </div>
                <span className="font-mono text-white">{mockTelemetry.windSpeed.toFixed(1)} m/s</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">System Health</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Flight Time:</span>
                <span className="font-mono text-white">{formatTime(mockTelemetry.flightTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vibration:</span>
                <span className="font-mono text-white">{mockTelemetry.vibration.toFixed(2)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-semibold ${
                  selectedDroneData.status === 'active' ? 'text-green-400' :
                  selectedDroneData.status === 'standby' ? 'text-yellow-400' :
                  selectedDroneData.status === 'maintenance' ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {selectedDroneData.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Live Data Chart Placeholder */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3">GPS Signal Strength</h3>
            <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-gray-400">Live GPS data visualization</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Satellite className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a drone to view</p>
            <p>GPS telemetry data</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelemetryPanel;