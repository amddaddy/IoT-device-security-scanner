
import React from 'react';
import { Device, Severity, Vulnerability } from '../types';

interface DeviceDetailsProps {
    device: Device;
}

const severityClasses: Record<Severity, { text: string; bg: string; border: string }> = {
    [Severity.High]: { text: 'text-red-400', bg: 'bg-red-900/50', border: 'border-red-500/50' },
    [Severity.Medium]: { text: 'text-yellow-400', bg: 'bg-yellow-900/50', border: 'border-yellow-500/50' },
    [Severity.Low]: { text: 'text-green-400', bg: 'bg-green-900/50', border: 'border-green-500/50' },
};

const VulnerabilityItem: React.FC<{ vuln: Vulnerability }> = ({ vuln }) => {
    const classes = severityClasses[vuln.severity];
    return (
        <div className={`border-l-4 ${classes.border} ${classes.bg} p-4 rounded-r-lg`}>
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-brand-text">{vuln.name}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes.text}`}>{vuln.severity} Risk</span>
            </div>
            <p className="text-sm text-brand-text-secondary mt-1">{vuln.description}</p>
            <div className="mt-3 pt-3 border-t border-brand-border">
                <p className="text-xs font-semibold text-brand-cyan">Recommendation:</p>
                <p className="text-sm text-brand-text-secondary">{vuln.recommendation}</p>
            </div>
        </div>
    );
};

export const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device }) => {
    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-brand-text">Details for {device.ip}</h3>
            <div className="text-sm text-brand-text-secondary mt-1">
                <span className="font-semibold">MAC:</span> {device.mac} | <span className="font-semibold">Vendor:</span> {device.vendor}
            </div>
            <div className="mt-4 text-sm text-brand-text-secondary">
                <span className="font-semibold">Open Ports:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                    {device.openPorts.map(port => (
                        <span key={port} className="bg-brand-border px-2 py-1 rounded text-xs">{port}</span>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h4 className="font-bold text-brand-text mb-3">Vulnerabilities & Recommendations</h4>
                <div className="space-y-4">
                    {device.vulnerabilities.map((vuln, index) => (
                        <VulnerabilityItem key={index} vuln={vuln} />
                    ))}
                </div>
            </div>
        </div>
    );
};
