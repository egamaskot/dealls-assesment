import React, { useState, useEffect } from 'react';
import { fetchAllArticles, fetchAllCategories } from '../../APICalls/article';
import Skeleton from '../../components/ui/skeleton';
import JobCard from '../../components/card/job';
import YellowButton from '../../components/button/yellow';
import { Article, ArticleResponse, Category, CategoryResponse, Metadata } from '../../types/article';
import Pagination from '../../components/pagination';
import './article.css'
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(9) ;
    const [search, setSearch] = useState<string>(''); 
    const [category_id, setCategoryId] = useState<string>(''); 
    const [sort, setSort] = useState<string>('desc'); 

    const fetchArticles = async (page: number) => {
        setLoading(true);
        const response = await fetchAllArticles({ limit, page, search, sort, category_id });
        setArticles(response.data.data);
        setMetadata(response.data.metadata);
        setLoading(false); 
    };

    const fetchCategories = async () => {
        const resCategories = await fetchAllCategories();
        setCategories(resCategories.data);
    };

    useEffect(() => {
        fetchArticles(currentPage);
        fetchCategories();
    }, [currentPage, search, category_id, sort]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= (metadata?.total_pages || 1)) {
            setCurrentPage(page);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1); 
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(event.target.value);
        setCurrentPage(1); 
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSort(event.target.value);
        setCurrentPage(1);
    };

    const scrollToLatest = () => {
        const element = document.getElementById('latest-articles');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' }); 
        }
    };

    const openGoogle = () => {
        window.open('https://www.google.com', '_blank');
    };

    const openInstagram = () => {
        window.open('https://www.instagram.com', '_blank');
    };

    const handleJobCardClick = (id: string, slug: string) => {
        navigate(`/article/detail/${id}/${slug}`);
    };


    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-[#6913D8] text-white py-12 px-4">
                <div className="max-w-[1440px] mx-auto">
                    <h1 className="text-4xl font-bold mb-10 text-stroke">
                        Empowering Indonesian Talents to Reach Their Full Potential!
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10">
                        <YellowButton text="Explore Articles" onClick={scrollToLatest} />
                        <YellowButton text="Join Community" onClick={openGoogle} />
                        <YellowButton text="Follow on Instagram" onClick={openInstagram} />
                    </div>
                </div>
            </div>

            <div  id="latest-articles" className="flex-grow bg-[#efedf6] py-12 px-4">
                <div className="max-w-[1440px] mx-auto">
                    <h2 className="text-2xl font-bold mb-7">Latest Articles</h2>
                    <div className='flex flex-col md:flex-row justify-between mx-10 space-y-4 md:space-y-0 mb-5'>
                        <div className="flex items-center border rounded-lg bg-white w-full h-12 mr-5">
                            <Search className="h-5 w-5 text-gray-500 mx-2" /> 
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={search}
                                onChange={handleSearchChange}
                                className="flex-grow p-2 rounded focus:outline-none h-full"
                            />
                        </div>
                        <div className="flex flex-col justify-end md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-1/3">
                            <select
                                value={category_id}
                                onChange={handleCategoryChange}
                                className="border p-2 rounded-lg w-full h-12"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            
                            <select
                                value={sort}
                                onChange={handleSortChange}
                                className="border p-2 rounded-lg w-full h-12"
                            >
                                <option value="">Sort By</option>
                                <option value="desc">Latest</option>
                                <option value="asc">Oldest</option>
                            </select>
                        </div>
                    </div>


                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        articles.length > 0 ? (
                            <div className='px-10'>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {articles.map((article) => (
                                        <JobCard
                                            key={article.id}
                                            title={article.title}
                                            description={`Learn more about the role of a ${article.title}.`}
                                            buttonText="Learn More"
                                            onClick={() => handleJobCardClick(String(article.id), article.slug)} 
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-center mt-6">
                                    {metadata && (
                                        <Pagination 
                                            currentPage={currentPage} 
                                            totalPages={metadata.total_pages} 
                                            onPageChange={handlePageChange} 
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>No articles found.</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
