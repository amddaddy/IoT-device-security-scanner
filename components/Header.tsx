
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="border-b border-brand-border p-4">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold text-brand-cyan tracking-wider">
                    IoT Guardian // Security Scanner
                </h1>
            </div>
        </header>
    );
};
