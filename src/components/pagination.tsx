import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pagesToShow = 2; 
    const pagination: React.ReactNode[] = [];

    if (currentPage > 1) {
        pagination.push(
            <button
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                className="mx-1 px-2 py-1 rounded bg-white"
            >
                &lt;
            </button>
        );
    }

    let lastPageAdded: number | null = null; 
    let addedEllipsis = false; 

    for (let i = 1; i <= totalPages; i++) {
        if (i <= pagesToShow || i > totalPages - pagesToShow || (i >= currentPage - 1 && i <= currentPage + 1)) {
            
            pagination.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`mx-1 px-3 py-2 rounded-lg ${
                        currentPage === i ? 'bg-[#6913D8] text-white' : 'bg-white'
                    }`}
                >
                    {i}
                </button>
            );
            lastPageAdded = i; 
            addedEllipsis = false; 
        } else if (!addedEllipsis && lastPageAdded !== null && lastPageAdded !== i - 1) {
            
            pagination.push(<span key={`dots-${i}`} className="mx-2">...</span>);
            addedEllipsis = true; 
        }
    }

    if (currentPage < totalPages) {
        pagination.push(
            <div
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                className="mx-1 px-3 py-2 rounded bg-white"
            >
                &gt;
            </div>
        );
    }

    return (
        <div className="flex justify-center mt-6">
            {pagination}
        </div>
    );
};

export default Pagination;
