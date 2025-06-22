import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X, 
  Bell,
  BellOff,
  Shield,
  Battery,
  Signal,
  Wind
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
}

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'ALT-001',
      type: 'warning',
      title: 'Low Battery Warning',
      message: 'DR-005 battery level at 45%. Return to base recommended.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      acknowledged: false,
      source: 'DR-005'
    },
    {
      id: 'ALT-002',
      type: 'info',
      title: 'Formation Update',
      message: 'Swarm formation changed to diamond pattern for optimal coverage.',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      acknowledged: true,
      source: 'System'
    },
    {
      id: 'ALT-003',
      type: 'success',
      title: 'Mission Checkpoint',
      message: 'Search Pattern Alpha completed successfully. 68% coverage achieved.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      acknowledged: true,
      source: 'Mission Control'
    },
    {
      id: 'ALT-004',
      type: 'critical',
      title: 'Communication Lost',
      message: 'Lost contact with DR-005. Last known position logged.',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      acknowledged: false,
      source: 'DR-005'
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-400 bg-red-900/20';
      case 'warning': return 'border-yellow-400 bg-yellow-900/20';
      case 'info': return 'border-blue-400 bg-blue-900/20';
      case 'success': return 'border-green-400 bg-green-900/20';
      default: return 'border-gray-400 bg-gray-900/20';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="h-1/2 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">System Alerts</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            >
              {soundEnabled ? (
                <Bell className="w-4 h-4 text-blue-400" />
              ) : (
                <BellOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {unacknowledgedCount > 0 && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unacknowledgedCount}
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {alerts.length} total alerts
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border p-3 ${getAlertColor(alert.type)} ${
              !alert.acknowledged ? 'animate-pulse' : 'opacity-70'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.type)}
                <div className="font-semibold text-white text-sm">{alert.title}</div>
              </div>
              <div className="flex items-center space-x-1">
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Acknowledge"
                  >
                    <CheckCircle className="w-3 h-3 text-gray-400 hover:text-green-400" />
                  </button>
                )}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Dismiss"
                >
                  <X className="w-3 h-3 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-300 mb-2">{alert.message}</div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400">{alert.source}</span>
              </div>
              <span className="text-gray-400">{formatTime(alert.timestamp)}</span>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active alerts</p>
              <p className="text-xs">System operating normally</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-red-400 font-semibold">
              {alerts.filter(a => a.type === 'critical').length}
            </div>
            <div className="text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-semibold">
              {alerts.filter(a => a.type === 'warning').length}
            </div>
            <div className="text-gray-400">Warning</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-semibold">
              {alerts.filter(a => a.type === 'info').length}
            </div>
            <div className="text-gray-400">Info</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertSystem;