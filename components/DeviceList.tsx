
import React from 'react';
import { Device } from '../types';
import { DeviceCard } from './DeviceCard';
import { DeviceDetails } from './DeviceDetails';

interface DeviceListProps {
    devices: Device[];
    selectedDevice: Device | null;
    onSelectDevice: (device: Device) => void;
}

export const DeviceList: React.FC<DeviceListProps> = ({ devices, selectedDevice, onSelectDevice }) => {
    if (devices.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
                 <h2 className="text-xl font-bold mb-4 text-brand-cyan">Discovered Devices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {devices.map(device => (
                        <DeviceCard
                            key={device.id}
                            device={device}
                            isSelected={selectedDevice?.id === device.id}
                            onSelect={() => onSelectDevice(device)}
                        />
                    ))}
                </div>
            </div>
            {selectedDevice && <DeviceDetails device={selectedDevice} />}
        </div>
    );
};
