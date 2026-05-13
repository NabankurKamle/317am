import { Button, type ButtonProps } from '@nextui-org/react';

interface NeonButtonProps extends ButtonProps {
    glowColor?: string;
}

export function NeonButton({ glowColor = '#8B5CF6', style, ...props }: NeonButtonProps) {
    return (
        <Button
            {...props}
            className={`font-body tracking-wide ${props.className ?? ''}`}
            style={{
                boxShadow: `0 0 20px ${glowColor}55`,
                border: `1px solid ${glowColor}66`,
                ...style,
            }}
        />
    );
}