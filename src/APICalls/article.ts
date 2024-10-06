import axiosInstance from "../constants/axiosInstance";
import { GET_ALL_CATEGORIES, GET_ALL_ARTICLES, GET_ARTICLE_BY_ID } from "../constants/requests";

export const fetchAllCategories = async () => {
    try {
        const response = await axiosInstance(GET_ALL_CATEGORIES);
        return response.data;  
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;  
    }
};

export const fetchAllArticles = async (query: {
    search?: string;
    category_id?: string;
    limit?: number;
    page?: number;
    sort?: string;
} = {}) => {
    try {
        const filteredQuery = Object.fromEntries(
            Object.entries(query).filter(([_, value]) => value !== undefined && value !== '')
        );

        const response = await axiosInstance({
            ...GET_ALL_ARTICLES,
            params: filteredQuery, 
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

export const fetchArticleById = async (id: string) => {
    try {
        const response = await axiosInstance(GET_ARTICLE_BY_ID(id)); 
        return response.data;  
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        throw error;  
    }
};

export {};
