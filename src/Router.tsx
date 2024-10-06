import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'

// Import your page components
import Dashboard from './pages/Dashboard';
import Bug from './pages/Bug';
import Contact from './pages/Contact';
import ArticleDetail from './pages/Article/detail';
import Article from './pages/Article';

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bug" element={<Bug />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/article/" element={<Article />} />
                    <Route path="/article/detail/:id/:slug" Component={ArticleDetail} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;