
// import {graphql} from 'gatsby';
import React from 'react';
import querystring from 'querystring';
import PropTypes from 'prop-types';
import {navigate, useStaticQuery, graphql} from 'gatsby';
import algoliasearch from 'algoliasearch/lite';

import Layout from '../layout';
import forceArray from '../utils/forceArray';
import useFilterHooks from '../components/FiltersHooks';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import SuspendedPlugins from '../components/SuspendedPlugins';
import Views from '../components/Views';
import SearchResults from '../components/SearchResults';
import SearchBox from '../components/SearchBox';
import Filters from '../components/Filters';
import ActiveFilters from '../components/ActiveFilters';
import SearchByAlgolia from '../components/SearchByAlgolia';

function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        acc[key] = obj;
        return acc;
    }, {});
}

const doSearch = (data, setResults, categoriesMap) => {
    const {query} = data;
    const labels = forceArray(data.labels).concat(
        ...forceArray(data.categories).filter(Boolean).map(categoryId => categoriesMap[categoryId].labels)
    ).filter(Boolean);
    let page = data.page;
    setResults(null);
    const searchClient = algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID || 'HF9WKP9QU1',
        process.env.GATSBY_ALGOLIA_SEARCH_KEY || '4ef9c8513249915cc20e3b32c450abcb'
    );
    const index = searchClient.initIndex('Plugins');
    const filters = [];
    if (labels && labels.length) {
        filters.push(`(${labels.map(l => `labels:${l}`).join(' OR ')})`);
    }

    if (page === undefined || page === null) {
        page = 1;
    }

    index.search(
        query,
        {
            hitsPerPage: 50,
            page: page-1,
            filters: filters.join(' AND ')
        }
    ).then(({nbHits, page, nbPages, hits, hitsPerPage}) => {
        return setResults({
            total: nbHits,
            pages: nbPages + 1,
            page: page + 1,
            limit: hitsPerPage,
            plugins: hits
        });
    }).catch(err => {
        window?.Sentry?.captureException(err);
        // FIXME alert/console.log/somehow tell user something went wrong
    });
};

function SearchPage({location}) {
    const [showFilter, setShowFilter] = React.useState(true);
    const [results, setResults] = React.useState(null);
    const graphqlData = useStaticQuery(graphql`
        query {
            categories: allJenkinsPluginCategory {
                edges {
                    node {
                        id
                        labels
                        title
                    }
                }
            }
 suspendedPlugins: allSuspendedPlugin {
        edges {
          node {
            id
            url
          }
        }
      }
        }
    `);

    const categoriesMap = groupBy(graphqlData.categories.edges.map(edge => edge.node), 'id');
    const suspendedPlugins = graphqlData.suspendedPlugins.edges.map(edge => edge.node.id);
    const {
        sort, setSort,
        clearCriteria,
        categories, toggleCategory,
        labels, toggleLabel,
        view, setView,
        page, setPage,
        query, setQuerySilent, clearQuery,
        setData
    } = useFilterHooks();

    const handleOnSubmit = (e) => {
        const newData = {sort, categories, labels, view, page, query};
        e.preventDefault();
        navigate(`/ui/search?${querystring.stringify(newData)}`);
    };

    const searchPage = 'plugins/plugin-site/src/templates/search.jsx';

    // triggered on page load and when internal <Link> clicked, e.g. for label
    React.useEffect(() => {
        const qs = location.search.replace(/^\?/, '');
        const parsed = querystring.parse(qs);
        parsed.query = parsed.query || '';
        setData(parsed);
        doSearch(parsed, setResults, categoriesMap);
    }, [location]);

    return (
        <Layout id="searchpage" sourcePath={searchPage}>
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
                    <div className="row pt-4">
                        <div className={'col-md-9'}>
                            <SearchBox
                                showFilter={showFilter}
                                setShowFilter={setShowFilter}
                                query={query || ''}
                                setQuery={setQuerySilent}
                                handleOnSubmit={handleOnSubmit}
                            />
                        </div>
                        <div className={'col-md-3'}>
                            <Views view={view} setView={setView} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-9 text-center">
                            <SearchByAlgolia />
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
                            <SuspendedPlugins pluginIds={suspendedPlugins.filter(e => query && query.length >2 && e.includes(query))}/>
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
