import React from 'react';
import PropTypes from 'prop-types';
import {useStaticQuery, graphql} from 'gatsby';

import classNames from 'classnames';
import styled from '@emotion/styled';

import ActiveFilters from './ActiveFilters';
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

function SearchResults({isSearching}) {
    const data = useStaticQuery(graphql`
        query {
            plugins: allJenkinsPlugin {
                edges {
                    node {
                        ...JenkinsPluginFragment
                    }
                }
            }
        }
    `);
    const plugins = data.plugins.edges.slice(0, 30).map(e => e.node);
    const total = data.plugins.edges.length;

    return (
        <div className="row results">
            <div className="items-box">
                {/* <nav className="page-controls">
                    <ul className="nav navbar-nav">
                        <ActiveFilters />
                        <Pagination total={0} limit={10} page={0} pages={1} setPage={()=>{}} />
                    </ul>
                </nav> */}
                {(function () {
                    if (isSearching) {
                        return <Spinner />;
                    }
                    if (total === 0) {
                        return (
                            <div className="no-results">
                                <h1>No results found</h1>
                                <p>
                                    {'You search did not return any results. Please try changing your search criteria or reloading the browser.'} 
                                </p>
                            </div>
                        );
                    }
                    return (
                        <GridBox id="cb-item-finder-grid-box">
                            {plugins.map(plugin => (
                                <ItemBox key={plugin.name} role="button">
                                    <Plugin plugin={plugin} />
                                </ItemBox>
                            ))}
                        </GridBox>
                    );
                })()}
            </div>
        </div>
    );
}

SearchResults.propTypes = {
    isSearching: PropTypes.bool.isRequired
};

SearchResults.defaultProps = {
    isSearching: false
};


export default SearchResults;
