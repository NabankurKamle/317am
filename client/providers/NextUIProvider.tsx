'use client';
import { NextUIProvider as Provider } from '@nextui-org/react';

if (typeof window !== 'undefined') {
    const originalCreateElement = document.createElement.bind(document);
    // @ts-ignore
    document.createElement = (...args) => originalCreateElement(...args);
}

export function NextUIProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider
        >
            {children}
        </Provider>
    );
}