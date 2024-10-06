export interface Article {
    id: number;
    slug: string;
    title: string;
}

export interface Metadata {
    page: number;
    limit: number;
    total_docs: number;
    total_pages: number;
    has_next_page: boolean;
}

export interface ArticleResponse {
    code: number;
    data: {
        data: Article[];
        metadata: Metadata;
    };
}

export interface Category {
    id: number;
    name: string;
    created_at: string; 
    updated_at: string; 
}

export interface CategoryResponse {
    code: number;
    data: Category[];
}

export interface ArticleData {
    id: number;
    title: string;
    slug: string;
    content: string; 
    created_at: string; 
    updated_at: string; 
}

export interface ArticleDataResponse {
    code: number;
    data: ArticleData;
}
