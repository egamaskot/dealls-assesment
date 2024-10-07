import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticleById, fetchAllArticles } from '../../APICalls/article';
import { fetchAllCategories } from '../../APICalls/article';
import { ArticleData, Category } from '../../types/article';
import Skeleton from '../../components/ui/skeleton';
import JobCard from '../../components/card/job';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import { format } from 'date-fns';

function decodeHtmlContent(encodedContent: string): string {
    try {
        const decodedContent = JSON.parse(`{"content": ${encodedContent}}`).content;
        return decodedContent.replace(/\\"/g, '"').replace(/\\n/g, '\n');
    } catch (error) {
        console.error('Error decoding HTML content:', error);
        return encodedContent;
    }
}

const noSelectStyle: React.CSSProperties = {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
};

const ArticleDetail: React.FC = () => {
    const { id, slug } = useParams<{ id: string, slug: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<ArticleData | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryArticles, setCategoryArticles] = useState<{ [key: string]: ArticleData[] }>({});
    const [displayIndices, setDisplayIndices] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [showCopied, setShowCopied] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [articleResponse, categoriesResponse] = await Promise.all([
                    fetchArticleById(id || "1"),
                    fetchAllCategories()
                ]);

                if (articleResponse.data) {
                    const decodedContent = decodeHtmlContent(articleResponse.data.content);
                    const fetchedArticle = {...articleResponse.data, content: decodedContent};
                    setArticle(fetchedArticle);
                } else {
                    console.error('No article data received');
                }

                setCategories(categoriesResponse.data);

                const articlePromises = categoriesResponse.data.map((category: { id: any; }) => 
                    fetchAllArticles({ limit: 5, page: 1, category_id: category.id })
                );
                const articleResponses = await Promise.all(articlePromises);

                const newCategoryArticles: { [key: string]: ArticleData[] } = {};
                const newDisplayIndices: { [key: string]: number } = {};

                categoriesResponse.data.forEach((category: { id: string | number; }, index: number) => {
                    newCategoryArticles[category.id] = articleResponses[index].data.data;
                    newDisplayIndices[category.id] = 0;
                });

                setCategoryArticles(newCategoryArticles);
                setDisplayIndices(newDisplayIndices);
                console.log("categories", newCategoryArticles);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleJobCardClick = (id: string, slug: string) => {
        navigate(`/article/detail/${id}/${slug}`);
    };

    const handleNavigation = (categoryId: string, direction: 'prev' | 'next') => {
        setDisplayIndices(prev => {
            const currentIndex = prev[categoryId];
            const totalArticles = categoryArticles[categoryId].length;
            let newIndex;

            if (direction === 'prev') {
                newIndex = (currentIndex - 1 + totalArticles) % totalArticles;
            } else {
                newIndex = (currentIndex + 1) % totalArticles;
            }

            return { ...prev, [categoryId]: newIndex };
        });
    };

    const handleSwipe = (eventData: SwipeEventData, direction: 'prev' | 'next') => {
        const target = eventData.event.target as HTMLElement;
        const categoryId = target.closest('[data-category-id]')?.getAttribute('data-category-id');
        if (categoryId) {
            handleNavigation(categoryId, direction);
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: (eventData) => handleSwipe(eventData, 'next'),
        onSwipedRight: (eventData) => handleSwipe(eventData, 'prev'),
        trackMouse: true
    });

    const formattedCreatedAt = format(new Date(article?.created_at || '2024-10-02T04:45:48.443695Z'), 'MMMM d, yyyy');
    const formattedUpdatedAt = format(new Date(article?.updated_at || '2024-10-02T04:45:48.443695Z'), 'MMMM d, yyyy');

    const handleShare = () => {
        const url= `${window.location.origin}/#/article/detail/${id}/${slug}`
        navigator.clipboard.writeText(url).then(() => {
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000); 
            }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    if (loading) {
        return (
            <div className="skeleton-loading min-h-screen">
                <Skeleton className="h-32 w-full mb-4" />
                <div className="px-4 md:px-8 lg:px-20">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" /> 
                    <Skeleton className="h-4 w-full mb-2" /> 
                    <Skeleton className="h-4 w-1/2" /> 
                </div>
            </div>
        );
    }

    if (!article) {
        return <div className="px-4 md:px-8 lg:px-20">No article found.</div>;
    }

    return (
        <div className="article-page min-h-[90vh] bg-[#efedf6]">
            <div className="px-4 md:px-8 lg:px-20 max-w-[1440px] mx-[auto]">
                <div className="flex flex-col">
                    <div className="article-detail-container flex-grow w-full md:pr-8 md:mr-20 justify-center">
                        <div className="bg-[#6913D8] text-white pt-12 pb-4 mb-8 ml-[-100vh] mr-[-100vh]">
                            <div className="ml-[100vh] mr-[100vh]">
                                <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
                                <p className="mt-2 text-sm">
                                    Created on: {formattedCreatedAt} | Updated on: {formattedUpdatedAt}
                                </p>
                                <nav className="text-sm mt-10 w-full">
                                    <ul className="flex space-x-2 justify-center">
                                        <li>
                                            <a href="/" className="hover:underline">Dashboard</a>
                                        </li>
                                        <li>→</li>
                                        <li>{article.title}</li>
                                    </ul>
                                </nav>
                                <button onClick={handleShare} className='flex flex-row align-middle items-center'>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                    {showCopied && (
                                        <span className="ml-2 text-green-500 animate-fade-in-out">
                                        Copied!
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: article.content }} className="mb-8 max-w-[800px] m-auto" />
                    </div>
                    
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                        <div className="flex flex-wrap -mx-2">
                        {categories.map(category => {
                            return (
                                <div key={category.id} className="w-full md:w-1/3 px-2 mb-8">
                                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                                    <div className="relative">
                                        <button 
                                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                                            onClick={() => handleNavigation(String(category.id), 'prev')}
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        {categoryArticles[category.id] && categoryArticles[category.id].length > 0 && (
                                            <div 
                                                {...swipeHandlers} 
                                                data-category-id={String(category.id)} 
                                                style={noSelectStyle}
                                            >
                                                <JobCard
                                                    key={categoryArticles[category.id][displayIndices[category.id]].id}
                                                    title={categoryArticles[category.id][displayIndices[category.id]].title}
                                                    description={`Learn more about ${categoryArticles[category.id][displayIndices[category.id]].title}.`}
                                                    buttonText="Learn More"
                                                    onClick={() => handleJobCardClick(
                                                        String(categoryArticles[category.id][displayIndices[category.id]].id),
                                                        categoryArticles[category.id][displayIndices[category.id]].slug
                                                    )}
                                                />
                                            </div>
                                        )}
                                        <button 
                                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                                            onClick={() => handleNavigation(String(category.id), 'next')}
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;