import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from '../styles/Main.css';

import Footer from '../components/Footer';

function IndexPage({isFiltered, showResults, showFilter, view}) {
    const handleOnSubmit = (e) => {};

    return (
        <div>
            <div className={classNames(styles.ItemFinder, view, {showResults: showResults},
                {isFiltered: isFiltered}, 'item-finder')}>
                <form action="#" id="plugin-search-form"
                    className={classNames(styles.HomeHeader, {showFilter: showFilter}, 'HomeHeader jumbotron')}
                    onSubmit={handleOnSubmit}>
                    <h1>Plugins Index</h1>
                    <p>Discover the 1500+ community contributed Jenkins plugins to support building, deploying and automating any project.</p>
                    <nav className={classNames(styles.navbar, 'navbar')}>
                        <div className="nav navbar-nav">
                            {/* <SearchBox handleOnSubmit={handleOnSubmit} /> */}
                            {/* <Views /> */}
                        </div>
                    </nav>
                    {/* <Filters /> */}
                </form>
                {/* <SearchResults /> */}
                <Footer />
            </div>
        </div>
    );
}

IndexPage.propTypes = {
    isFiltered: PropTypes.bool,
    showResults: PropTypes.bool,
    showFilter: PropTypes.bool,
    view: PropTypes.object
};


export default IndexPage;
