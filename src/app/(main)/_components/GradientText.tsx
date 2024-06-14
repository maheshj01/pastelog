import React from 'react';

interface GradientTextProps {
    text: string;
    gradientColors: string[];
    fontSize?: string;
    fontWeight?: string | number;
    fontFamily?: string;
    className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
    text,
    gradientColors,
    fontSize = '3rem',
    fontWeight = 'bold',
    fontFamily = 'Arial, sans-serif',
    className = '',
}) => {
    const gradientStyle = {
        background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        fontSize,
        fontWeight,
        fontFamily,
    };

    return (
        <h1 className={`${className}`} style={gradientStyle}>
            {text}
        </h1>
    );
};

export default GradientText;