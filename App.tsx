
import React, { useState, useCallback, useEffect } from 'react';
import { Device, Severity } from './types';
import { startScan, generateCSV, generatePDF } from './services/scannerService';
import { Header } from './components/Header';
import { ScanControl } from './components/ScanControl';
import { DeviceList } from './components/DeviceList';
import { VulnerabilityChart } from './components/VulnerabilityChart';
import { ReportGenerator } from './components/ReportGenerator';
import { ShieldCheckIcon } from './components/icons';

const App: React.FC = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scanProgress, setScanProgress] = useState<number>(0);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [scanCompleted, setScanCompleted] = useState<boolean>(false);

    const handleStartScan = useCallback(() => {
        setIsScanning(true);
        setScanCompleted(false);
        setDevices([]);
        setSelectedDevice(null);
        setScanProgress(0);

        startScan((progress, newDevices) => {
            setScanProgress(progress);
            if (newDevices) {
                setDevices(prev => [...prev, ...newDevices]);
            }
        }).then(finalDevices => {
            setDevices(finalDevices);
            setIsScanning(false);
            setScanCompleted(true);
        });
    }, []);

    const handleSelectDevice = (device: Device) => {
        setSelectedDevice(device);
    };

    const riskCounts = devices.reduce((acc, device) => {
        acc[device.risk] = (acc[device.risk] || 0) + 1;
        return acc;
    }, {} as Record<Severity, number>);

    return (
        <div className="min-h-screen bg-brand-bg font-mono">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8">
                <ScanControl
                    isScanning={isScanning}
                    progress={scanProgress}
                    onStartScan={handleStartScan}
                    devicesFound={devices.length}
                />

                {scanCompleted && devices.length === 0 && (
                     <div className="text-center p-8 bg-brand-surface border border-brand-border rounded-lg flex flex-col items-center justify-center">
                        <ShieldCheckIcon className="w-16 h-16 text-brand-green mb-4" />
                        <h3 className="text-2xl font-bold text-brand-green">No Vulnerable Devices Found</h3>
                        <p className="text-brand-text-secondary mt-2">Your network appears to be secure. Great job!</p>
                    </div>
                )}

                {(scanCompleted && devices.length > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-brand-surface border border-brand-border rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 text-brand-cyan">Security Overview</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>High Risk:</span> <span className="font-bold text-red-500">{riskCounts.High || 0}</span></div>
                                <div className="flex justify-between"><span>Medium Risk:</span> <span className="font-bold text-yellow-500">{riskCounts.Medium || 0}</span></div>
                                <div className="flex justify-between"><span>Low Risk:</span> <span className="font-bold text-green-500">{riskCounts.Low || 0}</span></div>
                            </div>
                            <VulnerabilityChart devices={devices} />
                            <ReportGenerator 
                                onExportCSV={() => generateCSV(devices)} 
                                onExportPDF={() => generatePDF(devices)}
                            />
                        </div>
                        <div className="lg:col-span-2">
                             <DeviceList
                                devices={devices}
                                selectedDevice={selectedDevice}
                                onSelectDevice={handleSelectDevice}
                            />
                        </div>
                    </div>
                )}

                {!scanCompleted && !isScanning && (
                     <div className="text-center p-12 bg-brand-surface border border-dashed border-brand-border rounded-lg">
                        <h3 className="text-2xl font-bold text-brand-text">Ready to Scan</h3>
                        <p className="text-brand-text-secondary mt-2">Click "Scan Now" to begin analyzing your network for vulnerable IoT devices.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
