
import React from 'react';

interface ScanControlProps {
    isScanning: boolean;
    progress: number;
    onStartScan: () => void;
    devicesFound: number;
}

export const ScanControl: React.FC<ScanControlProps> = ({ isScanning, progress, onStartScan, devicesFound }) => {
    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-grow w-full">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-brand-text">
                        {isScanning ? `Scanning Network... (${Math.round(progress)}%)` : (devicesFound > 0 ? `Scan Complete: ${devicesFound} devices found` : 'Ready to Scan')}
                    </span>
                    <span className="text-sm font-medium text-brand-text-secondary">{devicesFound} devices</span>
                </div>
                <div className="w-full bg-brand-border rounded-full h-2.5">
                    <div
                        className="bg-brand-cyan h-2.5 rounded-full transition-all duration-300 ease-linear"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            <button
                onClick={onStartScan}
                disabled={isScanning}
                className="w-full md:w-auto px-8 py-3 text-lg font-semibold text-white bg-brand-cyan rounded-md shadow-lg hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 focus:ring-offset-brand-bg"
            >
                {isScanning ? 'Scanning...' : 'Scan Now'}
            </button>
        </div>
    );
};
