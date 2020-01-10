import React from 'react';
import {navigate} from 'gatsby';
import querystring from 'querystring';

import Layout from '../layout';

import SEO from '../components/SEO';
import Footer from '../components/Footer';
import SearchBox from '../components/SearchBox';

import './index.css';


function IndexPage() {
    const [query, setQuery] = React.useState('');
    const handleOnSubmit = (e) => {
        e.preventDefault();
        navigate(`/ui/search?${querystring.stringify({query})}`);
    };

    return (
        <Layout>
            <SEO />
            <div className="IndexPage--Container jumbotron" onSubmit={handleOnSubmit}>
                <div className="logo" />
                <div className="content">
                    <h1>Plugins Index</h1>
                    <p>Discover the 1500+ community contributed Jenkins plugins to support building, deploying and automating any project.</p>
                    <SearchBox 
                        handleOnSubmit={handleOnSubmit}
                        query={query}
                        setQuery={setQuery}
                    />
                </div>
            </div>
            <Footer />
        </Layout>
    );
}

export default IndexPage;
