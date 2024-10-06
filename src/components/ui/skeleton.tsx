import React from 'react';

interface SkeletonProps {
    className?: string;
    height?: string;
    width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, height = "20px", width = "100%" }) => {
    return (
        <div
            className={`animate-pulse bg-gray-300 ${className}`}
            style={{ height, width }}
        />
    );
};

export default Skeleton;
