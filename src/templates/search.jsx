// import {graphql} from 'gatsby';
import React from 'react';
import querystring from 'querystring';
import PropTypes from 'prop-types';
import {navigate} from 'gatsby';

import Layout from '../layout';
import useFilterHooks from '../components/FiltersHooks';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import Views from '../components/Views';
import SearchResults from '../components/SearchResults';
import SearchBox from '../components/SearchBox';
import Filters from '../components/Filters';
import ActiveFilters from '../components/ActiveFilters';
import fetch from 'isomorphic-fetch';


const doSearch = (data, setResults) => {
    const {categories, labels, page, query, sort} = data;
    const params = querystring.stringify({
        categories,
        labels,
        page,
        q: query,
        sort
    });
    const url = `https://plugins.jenkins.io/api/plugins?${params}`;
    setResults(null);
    fetch(url, {mode: 'cors'})
        .then((response) => {
            if (response.status >= 300 || response.status < 200) {
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
            return response;
        })
        .then(response => response.json())
        .then(setResults);
};



function SearchPage({location}) {
    const [showFilter, setShowFilter] = React.useState(true);
    const [results, setResults] = React.useState(null);
    const {
        sort, setSort,
        clearCriteria,
        categories, toggleCategory,
        labels, toggleLabel,
        view, setView,
        page, setPage,
        query, setQuery, clearQuery,
        setData
    } = useFilterHooks({doSearch, setResults});

    const handleOnSubmit = (e) => {
        const newData = {sort, categories, labels, view, page, query};
        e.preventDefault();
        navigate(`/ui/search?${querystring.stringify(newData)}`);
        doSearch(newData, setResults);
    };

    const searchPage = 'templates/search.jsx';
    
    React.useEffect(() => {
        const qs = location.search.replace(/^\?/, '');
        if (!qs) {
            return;
        }
        const parsed = querystring.parse(qs);
        setData(parsed);
        setQuery(parsed.query);
        doSearch(parsed, setResults);
    }, []);

    return (
        <Layout id="searchpage" reportProblemRelativeSourcePath={searchPage} reportProblemUrl={`/ui/search?${querystring.stringify({query})}`} reportProblemTitle="Search">
            <SEO pathname={'/ui/search'} title="Search Results" />

            <div className="row d-flex">
                {showFilter && (<div className="col-md-3 order-last order-md-first">
                    <Filters
                        showFilter={showFilter}
                        showResults
                        sort={sort}
                        categories={categories}
                        labels={labels}
                        setSort={setSort}
                        clearCriteria={clearCriteria}
                        toggleCategory={toggleCategory}
                        toggleLabel={toggleLabel}
                    />
                </div>)}
                <div className={showFilter ? 'col-md-9' : 'offset-md-1 col-md-11'}>
                    <div className="row">
                        <div className={'col-md-9'}>
                            <SearchBox
                                showFilter={showFilter}
                                setShowFilter={setShowFilter}
                                query={query}
                                setQuery={setQuery}
                                handleOnSubmit={handleOnSubmit}
                            />
                        </div>
                        <div className={'col-md-3'}>
                            <Views view={view} setView={setView} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <ActiveFilters
                                activeCategories={categories}
                                activeLabels={labels}
                                activeQuery={query}
                                clearQuery={clearQuery}
                                toggleCategory={toggleCategory}
                                toggleLabel={toggleLabel}
                            />
                        </div>
                    </div>
                    <div className="view">
                        <div className="col-md-12">
                            <SearchResults
                                showFilter={showFilter}
                                showResults
                                view={view}
                                setPage={setPage}
                                results={results}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Layout>
    );
}

SearchPage.propTypes = {
    location: PropTypes.object.isRequired
};

export default SearchPage;
