import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    className?: string;
}

const YellowButton: React.FC<ButtonProps> = ({ text, onClick, className }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-[#FEE156] text-black px-4 py-2 rounded-full shadow-[2px_4px_0px_rgba(27,27,27,1)] ${className}`}
        >
            {text}
        </button>
    );
};

export default YellowButton;
