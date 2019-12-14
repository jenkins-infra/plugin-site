import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Pagination from './Pagination';
import Plugin from './Plugin';
import Spinner from './Spinner';

const GridBox = styled.div`

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0;
`;

const ItemBox = styled.button`

    background: #fff;
    border: 0.1rem solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    color: #666;
    display: block;
    flex: 0 0 auto;
    font-size: 0.85rem;
    height: 16.5rem;
    margin: 0.25rem;
    min-height: 6rem;
    opacity: 0.9;
    padding: 0.67rem;
    text-align: left;
    text-decoration: none !important;
    width: 13rem;

    :hover {
        border: 0.1rem solid #999;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.25);
        opacity: 1;
        text-decoration: none;
    }
`;

function SearchResults({results, setPage}) {
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
            <GridBox id="cb-item-finder-grid-box">
                {results.plugins.map(plugin => (
                    <ItemBox key={plugin.name} role="button">
                        <Plugin plugin={plugin} />
                    </ItemBox>
                ))}
            </GridBox>
        </div>
    );
}

SearchResults.propTypes = {
    isSearching: PropTypes.bool.isRequired,
    setPage: PropTypes.func.isRequired,
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
