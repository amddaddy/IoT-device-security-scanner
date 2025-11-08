import { Device, Severity, DeviceType, Vulnerability } from '../types';
// In a real app, you'd use a robust library. Here we're using the global one from the CDN.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsPDF = (window as any).jspdf.jsPDF;


const MOCK_VULNERABILITIES: Record<string, Vulnerability> = {
    DEFAULT_PASS: { name: 'Default Credentials', severity: Severity.High, description: 'The device is using a default factory password which is publicly known.', recommendation: 'Change the default password immediately through the device\'s admin interface.' },
    TELNET: { name: 'Unsecured Telnet', severity: Severity.High, description: 'Telnet service is enabled, which transmits data, including credentials, in plaintext.', recommendation: 'Disable Telnet service and use SSH if remote access is required.' },
    FTP: { name: 'Unsecured FTP', severity: Severity.Medium, description: 'FTP service is enabled, which can be vulnerable to brute-force attacks and sniffing.', recommendation: 'Disable FTP if not needed, or use a secure alternative like SFTP.' },
    HTTP_ADMIN: { name: 'Unencrypted Admin Panel', severity: Severity.Medium, description: 'The device\'s web administration panel is served over HTTP, not HTTPS.', recommendation: 'Enable HTTPS on the device\'s admin panel. If not possible, only access it from a trusted network.' },
    OLD_FIRMWARE: { name: 'Outdated Firmware (Simulated)', severity: Severity.Medium, description: 'Firmware may be outdated, potentially missing critical security patches.', recommendation: 'Check the manufacturer\'s website for firmware updates and apply them.' },
};

const MOCK_DEVICES_POOL: Omit<Device, 'id' | 'risk' | 'vulnerabilities' | 'openPorts'>[] = [
    { ip: '192.168.1.101', mac: 'B8:27:EB:01:23:45', vendor: 'Raspberry Pi Foundation', type: 'Unknown' },
    { ip: '192.168.1.105', mac: '00:1A:2B:3C:4D:5E', vendor: 'TP-Link', type: 'Router' },
    { ip: '192.168.1.110', mac: 'F8:E0:79:12:34:56', vendor: 'Wyze Labs', type: 'Camera' },
    { ip: '192.168.1.112', mac: 'D8:F1:5B:78:9A:BC', vendor: 'Philips', type: 'Lightbulb' },
    { ip: '192.168.1.115', mac: 'A0:20:A6:DE:F0:12', vendor: 'Belkin', type: 'Smart-Plug' },
    { ip: '192.168.1.120', mac: '18:B4:30:34:56:78', vendor: 'Google Inc.', type: 'Thermostat' },
    { ip: '192.168.1.121', mac: 'C0:A1:B2:C3:D4:E5', vendor: 'Generic IoT', type: 'Unknown' },
];

// FIX: Corrected the input type for `assignVulnerabilities` to match the data from `MOCK_DEVICES_POOL`.
const assignVulnerabilities = (device: Omit<Device, 'id' | 'risk' | 'vulnerabilities' | 'openPorts'>): Pick<Device, 'risk' | 'vulnerabilities' | 'openPorts'> => {
    const vulnerabilities: Vulnerability[] = [];
    const openPorts: number[] = [80, 443];
    let high = 0, medium = 0;

    if (Math.random() > 0.5) {
        vulnerabilities.push(MOCK_VULNERABILITIES.DEFAULT_PASS);
        openPorts.push(22);
        high++;
    }
    if (device.type === 'Camera' && Math.random() > 0.3) {
        vulnerabilities.push(MOCK_VULNERABILITIES.TELNET);
        openPorts.push(23);
        high++;
    }
    if (device.type === 'Router' && Math.random() > 0.6) {
        vulnerabilities.push(MOCK_VULNERABILITIES.FTP);
        openPorts.push(21);
        medium++;
    }
    if (Math.random() > 0.4) {
        vulnerabilities.push(MOCK_VULNERABILITIES.HTTP_ADMIN);
    }
     if (Math.random() > 0.2) {
        vulnerabilities.push(MOCK_VULNERABILITIES.OLD_FIRMWARE);
        medium++;
    }

    const risk = high > 0 ? Severity.High : medium > 0 ? Severity.Medium : Severity.Low;
    
    // Low risk devices should have at least one note
    if (vulnerabilities.length === 0) {
        vulnerabilities.push({
            name: 'Standard Ports Open',
            severity: Severity.Low,
            description: 'Standard ports like HTTP (80) and HTTPS (443) are open for normal operation.',
            recommendation: 'Ensure all services running on these ports are secure and up-to-date. No immediate action required if properly configured.'
        });
    }

    return { vulnerabilities, risk, openPorts: [...new Set(openPorts)].sort((a, b) => a - b) };
};

export const startScan = (
    onProgress: (progress: number, newDevices?: Device[]) => void
): Promise<Device[]> => {
    return new Promise(resolve => {
        let progress = 0;
        const totalDuration = 5000; // 5 seconds scan
        const intervalTime = 250;
        const steps = totalDuration / intervalTime;
        let foundDevices: Device[] = [];

        const shuffledPool = [...MOCK_DEVICES_POOL].sort(() => 0.5 - Math.random());
        const devicesToFindCount = Math.floor(Math.random() * 4) + 2; // Find 2 to 5 devices
        const devicesToDiscover = shuffledPool.slice(0, devicesToFindCount);

        const interval = setInterval(() => {
            progress += 100 / steps;
            
            const devicesFoundThisTick: Device[] = [];
            if (devicesToDiscover.length > 0 && Math.random() > 0.5) {
                const deviceData = devicesToDiscover.pop()!;
                const { risk, vulnerabilities, openPorts } = assignVulnerabilities(deviceData);
                const newDevice: Device = {
                    ...deviceData,
                    id: deviceData.mac,
                    risk,
                    vulnerabilities,
                    openPorts,
                };
                foundDevices.push(newDevice);
                devicesFoundThisTick.push(newDevice);
            }
            
            onProgress(Math.min(100, progress), devicesFoundThisTick.length > 0 ? devicesFoundThisTick : undefined);

            if (progress >= 100) {
                clearInterval(interval);
                // Ensure any remaining devices are "found" at the end
                while (devicesToDiscover.length > 0) {
                    const deviceData = devicesToDiscover.pop()!;
                    const { risk, vulnerabilities, openPorts } = assignVulnerabilities(deviceData);
                    foundDevices.push({
                        ...deviceData,
                        id: deviceData.mac,
                        risk,
                        vulnerabilities,
                        openPorts,
                    });
                }
                resolve(foundDevices.sort((a,b) => a.ip.localeCompare(b.ip)));
            }
        }, intervalTime);
    });
};

export const generateCSV = (devices: Device[]) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "IP Address,MAC Address,Vendor,Device Type,Risk Level,Open Ports,Vulnerabilities\n";

    devices.forEach(device => {
        const ports = device.openPorts.join('; ');
        const vulns = device.vulnerabilities.map(v => `${v.name} (${v.severity})`).join('; ');
        const row = [device.ip, device.mac, `"${device.vendor}"`, device.type, device.risk, `"${ports}"`, `"${vulns}"`].join(',');
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "iot_security_scan_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export const generatePDF = (devices: Device[]) => {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("IoT Security Scan Report", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(12);
    doc.text(`Scan Date: ${new Date().toLocaleDateString()}`, 105, y, { align: "center" });
    y += 15;
    
    devices.forEach((device, index) => {
        if (y > 260) {
            doc.addPage();
            y = 15;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        
        let riskColor = '#22c55e'; // green-500
        if (device.risk === Severity.High) riskColor = '#ef4444'; // red-500
        if (device.risk === Severity.Medium) riskColor = '#f59e0b'; // amber-500
        
        doc.setTextColor(riskColor);
        doc.text(`${device.type} - ${device.ip} (Risk: ${device.risk})`, 15, y);
        y += 7;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        doc.text(`MAC: ${device.mac}`, 20, y);
        y += 5;
        doc.text(`Vendor: ${device.vendor}`, 20, y);
        y += 5;
        doc.text(`Open Ports: ${device.openPorts.join(', ')}`, 20, y);
        y += 8;

        doc.setFont(undefined, 'bold');
        doc.text('Vulnerabilities Found:', 20, y);
        y += 5;
        doc.setFont(undefined, 'normal');

        device.vulnerabilities.forEach(vuln => {
            if (y > 270) {
              doc.addPage();
              y = 15;
            }
            doc.text(`- ${vuln.name} (${vuln.severity}): ${vuln.description}`, 25, y, { maxWidth: 160 });
            y += 10; 
            doc.setFont(undefined, 'italic');
            doc.text(`Recommendation: ${vuln.recommendation}`, 28, y, { maxWidth: 155 });
            y += 10;
             doc.setFont(undefined, 'normal');
        });
        
        y+=5;
        doc.setDrawColor('#cccccc');
        doc.line(15, y, 195, y);
        y+=10;
    });

    doc.save("iot_security_scan_report.pdf");
};