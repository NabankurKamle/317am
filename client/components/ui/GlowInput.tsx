'use client';
import { forwardRef } from 'react';
import { cn } from '@nextui-org/react';

interface GlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    glow?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const GlowInput = forwardRef<HTMLInputElement, GlowInputProps>(
    ({ label, glow = '#8B5CF6', error, icon, className, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-white/35 text-xs tracking-widest uppercase pl-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        className={cn(
                            'w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white/75',
                            'placeholder:text-white/15 outline-none transition-all duration-300',
                            'hover:border-white/15 focus:bg-white/6',
                            !!icon && 'pl-10',
                            error && 'border-pink-500/40',
                            className
                        )}
                        style={{
                            // @ts-ignore
                            '--glow': glow,
                        }}
                        onFocus={e => {
                            e.currentTarget.style.borderColor = `${glow}66`;
                            e.currentTarget.style.boxShadow = `0 0 0 3px ${glow}12, 0 0 20px ${glow}10`;
                        }}
                        onBlur={e => {
                            e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    />
                </div>
                {error && <p className="text-pink-400/70 text-xs pl-1">{error}</p>}
            </div>
        );
    }
);

GlowInput.displayName = 'GlowInput';