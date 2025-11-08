
export enum Severity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export interface Vulnerability {
    name: string;
    severity: Severity;
    description: string;
    recommendation: string;
}

export type DeviceType = 'Router' | 'Camera' | 'Lightbulb' | 'Smart-Plug' | 'Thermostat' | 'Unknown';

export interface Device {
    id: string;
    ip: string;
    mac: string;
    vendor: string;
    type: DeviceType;
    risk: Severity;
    openPorts: number[];
    vulnerabilities: Vulnerability[];
}
