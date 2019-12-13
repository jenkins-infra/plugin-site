import React from 'react';
import classNames from 'classnames';
import {navigate} from 'gatsby';
import querystring from 'querystring';

import Layout from '../layout';
import styles from '../styles/main.module.css';

import SEO from '../components/SEO';
import Footer from '../components/Footer';
import SearchBox from '../components/SearchBox';


function IndexPage() {
    const [query, setQuery] = React.useState('');
    const handleOnSubmit = (e) => {
        e.preventDefault();
        navigate(`/ui/search?${querystring.stringify({query})}`);
    };

    return (
        <Layout>
            <SEO />
            <div className={classNames(styles.ItemFinder, 'item-finder')}>
                <div id="plugin-search-form" className={classNames(styles.HomeHeader, 'HomeHeader jumbotron')} onSubmit={handleOnSubmit}>
                    <h1>Plugins Index</h1>
                    <p>Discover the 1500+ community contributed Jenkins plugins to support building, deploying and automating any project.</p>
                    <nav className={classNames('navbar', styles.navbar)}>
                        <div className="nav navbar-nav">
                            <SearchBox 
                                handleOnSubmit={handleOnSubmit}
                                query={query}
                                setQuery={setQuery}
                            />
                        </div>
                    </nav>
                </div>
                <Footer />
            </div>
        </Layout>
    );
}

export default IndexPage;
