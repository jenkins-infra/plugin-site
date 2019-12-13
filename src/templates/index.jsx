import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {navigate} from 'gatsby';
import querystring from 'querystring';

import Layout from '../layout';
import styles from '../styles/main.module.css';
import useFilterHooks from '../components/FiltersHooks';

import SEO from '../components/SEO';
import Footer from '../components/Footer';
import SearchBox from '../components/SearchBox';
import Filters from '../components/Filters';


function IndexPage({isFiltered, showResults, view}) {
    const [showFilter, setShowFilter] = React.useState(false);
    const {
        sort, setSort,
        clearCriteria,
        categories, toggleCategory,
        labels, toggleLabel,
        query, setQuery
    } = useFilterHooks();
    
    const handleOnSubmit = () => {
        navigate(`/ui/search?${querystring.stringify({
            categories,
            labels,
            query,
            sort
        })}`);
    };

    return (
        <Layout>
            <SEO />
            <div className={classNames(styles.ItemFinder, view, {showResults}, {isFiltered}, 'item-finder')}>
                <form action="#" id="plugin-search-form" className={classNames(styles.HomeHeader, {showFilter}, 'HomeHeader jumbotron')} onSubmit={handleOnSubmit}>
                    <h1>Plugins Index</h1>
                    <p>Discover the 1500+ community contributed Jenkins plugins to support building, deploying and automating any project.</p>
                    <nav className={classNames('navbar', styles.navbar)}>
                        <div className="nav navbar-nav">
                            <SearchBox 
                                handleOnSubmit={handleOnSubmit}
                                showFilter={showFilter}
                                setShowFilter={setShowFilter} 
                                query={query}
                                setQuery={setQuery}
                            />
                        </div>
                    </nav>
                    <Filters
                        showFilter={showFilter}
                        showResults={false} 
                        sort={sort}
                        categories={categories}
                        labels={labels}
                        setSort={setSort}
                        clearCriteria={clearCriteria}
                        toggleCategory={toggleCategory}
                        toggleLabel={toggleLabel}
                    />
                </form>
                <Footer />
            </div>
        </Layout>
    );
}

IndexPage.propTypes = {
    isFiltered: PropTypes.bool,
    showResults: PropTypes.bool,
    view: PropTypes.object
};


export default IndexPage;
