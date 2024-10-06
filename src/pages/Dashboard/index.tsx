import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllCategories, fetchAllArticles } from '../../APICalls/article';
import { ArticleData, Category } from '../../types/article';
import Skeleton from '../../components/ui/skeleton';
import JobCard from '../../components/card/job';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SwipeEventData, useSwipeable } from 'react-swipeable';
import YellowButton from '../../components/button/yellow';


const noSelectStyle: React.CSSProperties = {
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
};


const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryArticles, setCategoryArticles] = useState<{ [key: string]: ArticleData[] }>({});
    const [displayIndices, setDisplayIndices] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [currentPages, setCurrentPages] = useState<number>(1); 
    const [allArticles, setAllArticles] = useState<ArticleData[] >();
    const [totalPages, setTotalPages] = useState<number>(1);



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [categoriesResponse] = await Promise.all([
                    fetchAllCategories()
                ]);

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

    useEffect(() => {
        const fetchAllData = async () => {
            const initialArticleResponses = await fetchAllArticles({ limit: 1, page: currentPages });

            setAllArticles(initialArticleResponses.data.data);
            setCurrentPages(initialArticleResponses.data.metadata.page);
            setTotalPages(initialArticleResponses.data.metadata.total_pages)
        }
        fetchAllData();
    }, [currentPages]);

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


    const handleAllNavigation = (direction: 'prev' | 'next') => {
            if (direction === 'prev') {
                setCurrentPages(currentPages - 1);
            } else {
                setCurrentPages(currentPages + 1);
            }
    };

    const swipeAllHandlers = useSwipeable({
        onSwipedLeft: (eventData) => handleAllNavigation('next'),
        onSwipedRight: (eventData) => handleAllNavigation('prev'),
        trackMouse: true
    });

    const scrollToLatest = () => {
        const element = document.getElementById('latest-articles');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' }); 
        }
    };

    const openGit = () => {
        window.open('https://github.com/egamaskot/dealls-assesment', '_blank');
    };

    const openInstagram = () => {
        window.open('https://www.instagram.com/ega_sy/', '_blank');
    };

    const openArticle = () => {
        navigate('/article');
    };

    const openBug = () => {
        navigate('/bug');
    };

    return (
        <div className="article-page min-h-[90vh] bg-[#efedf6]">
            <div className="bg-[#6913D8] text-white py-12 px-4">
                <div className="max-w-[1440px] mx-auto">
                    <h1 className="text-4xl font-bold mb-10 text-stroke">
                        Empowering Indonesian Talents to Reach Their Full Potential!
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-10">
                        <YellowButton text="Explore Articles" onClick={scrollToLatest} />
                        <YellowButton text="Github Repositories" onClick={openGit} />
                        <YellowButton text="Follow on Instagram" onClick={openInstagram} />
                        <YellowButton text="Bug Found" onClick={openBug} />
                    </div>
                </div>
            </div>
            <div className="px-4 md:px-8 lg:px-20 max-w-[1440px] mx-[auto]">
                <h2 className="text-2xl font-bold mt-10 mb-3">Latest Articles</h2>
                <YellowButton text="Show All Articles" onClick={openArticle} className="mb-10"/>
                {allArticles && (
                    <div key={allArticles[0].id} className="w-full px-2 mb-8">
                        <div>
                            <div className="relative">
                                {
                                    currentPages > 1 && (
                                    <button
                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                                        onClick={() => handleAllNavigation('prev')}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    )
                                }
                                {allArticles[0].id && allArticles[0].id > 0 && (
                                    <div
                                        {...swipeAllHandlers}
                                        style={noSelectStyle}
                                    >
                                        <JobCard
                                            key={allArticles[0].id}
                                            title={allArticles[0].title}
                                            description={`Learn more about ${allArticles[0].title}.`}
                                            buttonText="Learn More"
                                            onClick={() => handleJobCardClick(
                                                String(allArticles[0].id),
                                                allArticles[0].slug
                                            )}
                                        />
                                    </div>
                                )}
                                { currentPages < totalPages &&
                                    (
                                    <button
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                                        onClick={() => handleAllNavigation('next')}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-8 md:mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                    {loading ? (
                        <div className="skeleton-loading min-h-screen">
                            <div className="px-4 md:px-8 lg:px-20">
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="mb-8">
                                        <Skeleton className="h-6 w-1/4 mb-2" />
                                        <div className="relative">
                                            <Skeleton className="h-12 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap -mx-2">
                            {categories.map((category) => (
                                <div key={category.id} className="w-full md:w-1/3 px-2 mb-8">
                                    <div>
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
                                                    className=''
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;