import React from 'react';

const Contact: React.FC = () => {
    return (
        <div>
            <iframe
                src="https://docs.google.com/gview?url=https://drive.google.com/uc?id=1pcq8RKfFSGc64T2Lug7DVGtltuL4zUUC&embedded=true" 
                title="Embedded Content"
                className="w-full h-full border-none"
                style={{ minHeight: '100vh' }} 
            />
        </div>
    );
};

export default Contact;