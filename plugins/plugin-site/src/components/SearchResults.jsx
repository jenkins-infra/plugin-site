import React from 'react';
import PropTypes from 'prop-types';

import Pagination from './Pagination';
import Plugin from './Plugin';
import Spinner from './Spinner';

import './SearchResults.css';

function SearchResults({results, setPage, view}) {
    const isSearching = results === null;
    if (isSearching) {
        return <div><Spinner /></div>;
    }
    if (results.total === 0) {
        return (
            <div>
                <div className="no-results">
                    <h1>No results found</h1>
                    <p>
                        {'You search did not return any results. Please try changing your search criteria or reloading the browser.'}
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div>
            <Pagination
                total={results.total}
                limit={results.limit}
                page={results.page}
                pages={results.pages}
                setPage={setPage}
            />
            <div id="cb-item-finder-grid-box" className={`SearchResults--GridBox SearchResults--${view}`}>
                {results.plugins.map(plugin => (
                    <div className="SearchResults--ItemBox" key={plugin.name} role="button">
                        <Plugin plugin={plugin} />
                    </div>
                ))}
            </div>
        </div>
    );
}

SearchResults.propTypes = {
    isSearching: PropTypes.bool.isRequired,
    setPage: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
    results: PropTypes.shape({
        limit: PropTypes.number.isRequired,
        page: PropTypes.number.isRequired,
        pages: PropTypes.number.isRequired,
        plugins: PropTypes.array.isRequired,
        total: PropTypes.number.isRequired,
    })
};

SearchResults.defaultProps = {
    isSearching: false
};


export default SearchResults;
