
import React from 'react';
import { Device, DeviceType, Severity } from '../types';
import { CameraIcon, LightbulbIcon, RouterIcon, SmartPlugIcon, ThermostatIcon, UnknownDeviceIcon } from './icons';

interface DeviceCardProps {
    device: Device;
    isSelected: boolean;
    onSelect: () => void;
}

const deviceIcons: Record<DeviceType, React.ReactNode> = {
    Router: <RouterIcon className="w-8 h-8" />,
    Camera: <CameraIcon className="w-8 h-8" />,
    Lightbulb: <LightbulbIcon className="w-8 h-8" />,
    'Smart-Plug': <SmartPlugIcon className="w-8 h-8" />,
    Thermostat: <ThermostatIcon className="w-8 h-8" />,
    Unknown: <UnknownDeviceIcon className="w-8 h-8" />,
};

const riskColorClasses: Record<Severity, string> = {
    [Severity.High]: 'border-red-500/50 bg-red-500/10 text-red-400',
    [Severity.Medium]: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
    [Severity.Low]: 'border-green-500/50 bg-green-500/10 text-green-400',
};

const selectedClasses = 'ring-2 ring-brand-cyan ring-offset-2 ring-offset-brand-surface';

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, isSelected, onSelect }) => {
    
    return (
        <div
            onClick={onSelect}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${riskColorClasses[device.risk]} ${isSelected ? selectedClasses : 'hover:bg-white/5'}`}
        >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{deviceIcons[device.type]}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-text truncate">{device.type}</p>
                    <p className="text-xs text-brand-text-secondary truncate">{device.ip}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${riskColorClasses[device.risk]}`}>
                    {device.risk}
                </span>
            </div>
        </div>
    );
};
