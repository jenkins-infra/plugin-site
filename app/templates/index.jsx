import React from 'react';
import classNames from 'classnames';
import styles from '../styles/Main.css';

import Footer from '../components/Footer';

function IndexPage({ }) {
  return (
    <div>
      <div className={classNames(styles.ItemFinder, this.props.view, { showResults: this.props.showResults },
        { isFiltered: this.props.isFiltered }, 'item-finder')}>
        <form action="#" id="plugin-search-form"
          className={classNames(styles.HomeHeader, { showFilter: this.props.showFilter }, 'HomeHeader jumbotron')}
          onSubmit={this.handleOnSubmit}>
          <h1>Plugins Index</h1>
          <p>
            Discover the 1500+ community contributed Jenkins plugins to support building, deploying and automating any project.
          </p>
          <nav className={classNames(styles.navbar, 'navbar')}>
            <div className="nav navbar-nav">
              {/*
              <SearchBox handleOnSubmit={this.handleOnSubmit} />
              <Views />
              */}
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
};

export default IndexPage;
