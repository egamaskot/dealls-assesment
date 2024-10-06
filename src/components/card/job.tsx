import React from 'react';

interface JobCardProps {
    title: string;
    description: string;
    buttonText: string;
    onClick?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ title, description, buttonText, onClick }) => {
    
    return (
        <div className="bg-white text-black p-4 rounded-lg flex flex-col h-full">
            <div className="flex-grow"> 
                <h2 className="font-bold mb-2">{title}</h2>
                <p className="mb-2">{description}</p>
            </div>
            <button 
                className="bg-[#6913D8] text-white px-4 py-2 rounded-xl mx-auto"
                onClick={onClick}
            > 
                {buttonText}
            </button>        
        </div>
    );
};

export default JobCard;
