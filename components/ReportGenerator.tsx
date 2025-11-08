
import React from 'react';

interface ReportGeneratorProps {
    onExportCSV: () => void;
    onExportPDF: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onExportCSV, onExportPDF }) => {
    return (
        <div className="mt-8 pt-6 border-t border-brand-border">
            <h3 className="text-lg font-bold mb-3 text-brand-text">Export Report</h3>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onExportCSV}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-brand-cyan border border-brand-cyan rounded-md hover:bg-brand-cyan hover:text-brand-bg transition-colors duration-200"
                >
                    Export as CSV
                </button>
                <button
                    onClick={onExportPDF}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-brand-green border border-brand-green rounded-md hover:bg-brand-green hover:text-brand-bg transition-colors duration-200"
                >
                    Export as PDF
                </button>
            </div>
        </div>
    );
};
