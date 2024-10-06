import React from 'react';

const About: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 mt-16 bg-white rounded-lg shadow-md">
            <p className="text-red-600 font-bold mb-4">
                *Note: It's recommended to use HashRouter instead of BrowserRouter when deploying to Netlify, 
                because Netlify's hosting doesn’t support client-side routing well. HashRouter ensures the app 
                doesn't throw a 404 error when refreshing or navigating directly to routes like /article/detail/:id.
            </p>
            <p className="text-red-600 font-bold mb-4">
                I understand it may impact SEO, but it is used on Netlify to fix the routing error.
            </p>
            <h2 className="text-2xl font-bold mb-4">Application Overview</h2>
            <p className="text-gray-700 mb-6">
                The web application aims to provide a user-friendly experience for browsing articles through a categorized and interactive interface.
            </p>
            <h2 className="text-2xl font-bold mb-4">Functionality</h2>

            <h3 className="text-xl font-semibold mt-6 mb-2">1. Homepage</h3>
            <ul className="list-disc list-inside mb-4 text-gray-600">
                <li>Displays all articles.</li>
                <li>Articles can be swiped through (like a carousel).</li>
                <li>Displays categories of articles.</li>
                <li>Categories can be swiped through (like a carousel).</li>
                <li>Each category shows up to 5 articles at a time.</li>
                <li>Users can swipe through articles within a category to view all available articles.</li>
                <li>Users can click on an article to view its detailed content.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">2. Article Page</h3>
            <ul className="list-disc list-inside mb-4 text-gray-600">
                <li>Provides advanced search and filter options.</li>
                <li>Displays a list of all articles.</li>
                <li>Users can filter articles based on different criteria (e.g., category, latest, oldest).</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-2">3. Article Details Page</h3>
            <ul className="list-disc list-inside mb-4 text-gray-600">
                <li>Shows detailed content of the selected article.</li>
                <li>Displays HTML content retrieved from an API.</li>
                <li>Shows the categories like homepage.</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Bug Found</h2>
            <p className="text-red-600 mb-4">
                Issue: There’s a bug in the API where retrieving certain categories returns incorrect categories instead. 
                The backend SQL queries are poorly structured, leading to this issue.
            </p>
        </div>
    );
};

export default About;
