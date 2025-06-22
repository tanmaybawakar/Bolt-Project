import React from 'react';
import { 
  Target, 
  MapPin, 
  Search, 
  Camera, 
  Shield, 
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface MissionControlProps {
  missionStatus: 'planning' | 'active' | 'paused' | 'completed';
  onMissionStatusChange: (status: 'planning' | 'active' | 'paused' | 'completed') => void;
}

const MissionControl: React.FC<MissionControlProps> = ({ missionStatus, onMissionStatusChange }) => {
  const missions = [
    {
      id: 'SAR-001',
      name: 'Search & Rescue Alpha',
      type: 'search',
      priority: 'high',
      status: 'active',
      progress: 68,
      assignedDrones: 3,
      estimatedTime: '45 min',
      icon: Search
    },
    {
      id: 'MAP-002',
      name: 'Terrain Mapping',
      type: 'mapping',
      priority: 'medium',
      status: 'planned',
      progress: 0,
      assignedDrones: 2,
      estimatedTime: '2.5 hrs',
      icon: MapPin
    },
    {
      id: 'SUR-003',
      name: 'Perimeter Survey',
      type: 'surveillance',
      priority: 'low',
      status: 'completed',
      progress: 100,
      assignedDrones: 1,
      estimatedTime: 'Completed',
      icon: Camera
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-400" />;
      case 'planned': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'paused': return <Pause className="w-4 h-4 text-orange-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="h-1/2 border-b border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Mission Control</h2>
        <div className="text-sm text-gray-400">Active Operations</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {missions.map((mission) => {
          const IconComponent = mission.icon;
          return (
            <div key={mission.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{mission.name}</div>
                    <div className="text-xs text-gray-400">{mission.id}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(mission.status)}
                  <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(mission.priority)}`}>
                    {mission.priority}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{mission.progress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      mission.status === 'completed' ? 'bg-green-400' :
                      mission.status === 'active' ? 'bg-blue-400' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${mission.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">{mission.assignedDrones} drones</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">{mission.estimatedTime}</span>
                </div>
              </div>

              {mission.status === 'active' && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs transition-colors">
                      Pause
                    </button>
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">
                      Abort
                    </button>
                  </div>
                </div>
              )}

              {mission.status === 'planned' && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors">
                    Start Mission
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Plan New Mission</span>
        </button>
      </div>
    </div>
  );
};

export default MissionControl;