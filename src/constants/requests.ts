import { AxiosRequestConfig } from "axios";

export const GET_ALL_CATEGORIES: AxiosRequestConfig = {
    method: 'get',
    url: 'categories'  
};

export const GET_ALL_ARTICLES: AxiosRequestConfig = {
    method: 'get',
    url: 'articles',  
};

export const GET_ARTICLE_BY_ID = (id: string): AxiosRequestConfig => ({
    method: 'get',
    url: `articles/${id}`,  
});
