import React from 'react';
import PropTypes from 'prop-types';
import {useStaticQuery, graphql} from 'gatsby';

import classNames from 'classnames';
import styled from '@emotion/styled';

import styles from '../styles/main.module.css';
import ActiveFilters from './ActiveFilters';
import Pagination from './Pagination';
import Plugin from './Plugin';
import Spinner from './Spinner';

const GridBox = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    padding: 0;
    border-top: 1px solid #bbb;
`;

const ItemBox = styled.button`
    flex: 0 0 auto;

    display: block;
    border: .1rem solid #ccc;
    font-size: .85rem;
    min-height: 6rem;
    height: 16.5rem;
    width: 13rem;
    box-sizing: border-box;
    padding: .67rem;
    color: #666;
    text-decoration: none !important;
    background: #fff;
    opacity: .9;
    border-radius: 3px;
    margin: .25rem;
    text-align: left;

    :hover {
        border: .1rem solid #999;
        opacity: 1;
        box-shadow: 0 2px 3px rgba(0,0,0,.25);
        text-decoration: none;
    }
`;

function SearchResults({isSearching, showFilter, showResults}) {
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
            {showFilter && showResults && <div className="col-md-2" /> }
            <div className={classNames(styles.ItemsList, `items-box col-md-${showFilter && showResults ? '10' : '12'}`)}>
                {/* <nav className="page-controls">
                    <ul className="nav navbar-nav">
                        <ActiveFilters />
                        <Pagination total={0} limit={10} page={0} pages={1} setPage={()=>{}} />
                    </ul>
                </nav> */}
                <div className="padded-box">
                    {(function () {
                        if (isSearching) {
                            return <Spinner />;
                        }
                        if (total === 0) {
                            return (
                                <div className="no-results">
                                    <h1>No results found</h1>
                                    <p>
                                        {`You search did not return any results.
                                    Please try changing your search criteria or reloading the browser.`} 
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
        </div>
    );
}

SearchResults.propTypes = {
    isSearching: PropTypes.bool.isRequired,
    showFilter: PropTypes.bool.isRequired,
    showResults: PropTypes.bool.isRequired
};

SearchResults.defaultProps = {
    isSearching: false
};


export default SearchResults;
