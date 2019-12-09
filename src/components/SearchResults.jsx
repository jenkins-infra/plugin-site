import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/main.module.css';
import classNames from 'classnames';
import ActiveFilters from './ActiveFilters';
import Pagination from './Pagination';
import Plugin from './Plugin';
import Spinner from './Spinner';

function SearchResults({isSearching, labels, plugins, showFilter, showResults, total}) {
    return (
        <div className="row results">
            {showFilter && showResults && <div className="col-md-2" /> }
            <div className={classNames(styles.ItemsList,
                `items-box col-md-${showFilter && showResults ? '10' : '12'}`)}>
                <nav className="page-controls">
                    <ul className="nav navbar-nav">
                        <ActiveFilters />
                        <Pagination />
                    </ul>
                </nav>
                <div className="padded-box">
                    <div id="cb-item-finder-grid-box" className={classNames(styles.GridBox, 'grid-box')}>
                        <div className={classNames(styles.Grid, 'grid')}>
                            {isSearching && <Spinner />}
                            {!isSearching && total > 0 &&
                  plugins.map((plugin) => {
                      return (
                          <Plugin key={plugin.name} labels={labels} plugin={plugin} />
                      );
                  })}
                            {total === 0 && !isSearching &&
                                <div className="no-results">
                                    <h1>No results found</h1>
                                    <p>
                      You search did not return any results.
                      Please try changing your search criteria or reloading the browser.
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="clearfix" />
            </div>
        </div>
    );
}

SearchResults.propTypes = {
    isSearching: PropTypes.bool.isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string
    })).isRequired,
    plugins: PropTypes.arrayOf(PropTypes.object).isRequired,
    showFilter: PropTypes.bool.isRequired,
    showResults: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired
};

export default SearchResults;
