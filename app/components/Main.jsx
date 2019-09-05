import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from '../styles/Main.css';
import classNames from 'classnames';
import Filters from './Filters';
import Footer from './Footer';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import Views from './Views';
import { actions } from '../actions';
import { isFiltered, showFilter, showResults, view } from '../selectors';
import { createSelector } from 'reselect';

class Main extends React.PureComponent {

  // This is ultimately called in server.js to ensure the initial data is loaded prior to serving
  // up the response. Thus making this SEO friendly and avoids an unnecssary async call after
  // handing off to the browser.
  static fetchData({ store, location, params, history }) { // eslint-disable-line no-unused-vars
    return store.dispatch(actions.loadInitialData())
      .then(store.dispatch(actions.clearFirstVisit()));
  }

  static propTypes = {
    clearFirstVisit: PropTypes.func.isRequired,
    isFiltered: PropTypes.bool.isRequired,
    loadInitialData: PropTypes.func.isRequired,
    parseQueryParams: PropTypes.func.isRequired,
    showFilter: PropTypes.bool.isRequired,
    showResults: PropTypes.bool.isRequired,
    search: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired
  };

  handleOnSubmit = (event) => {
    event.preventDefault();
    this.props.search({ resetPage: true });
  }

  componentDidMount() {
    // These are only called for client side rendering. Otherwise fetchData is used.
    this.props.loadInitialData();
    this.props.clearFirstVisit();

    // Support query params:
    // categories - comma separated list of filtered categories
    // labels - comma separated list of filtered labels
    // q - search query
    // page - specific page
    // sort - sort by
    // view - tiles, table, etc.
    const parseQueryParams = () => {
      const queryParams = this.props.location.query; // eslint-disable-line react/prop-types
      const activeCategories = queryParams.categories ? queryParams.categories.split(',') : undefined;
      const activeLabels = queryParams.labels ? queryParams.labels.split(',') : undefined;
      const page = queryParams.page ? Number(queryParams.page) : undefined;
      const query = queryParams.q || undefined;
      const sort = queryParams.sort || undefined;
      const view = queryParams.view || undefined;
      const data = {
        activeCategories: activeCategories,
        activeLabels: activeLabels,
        page: page,
        query: query,
        sort: sort,
        view: view
      };
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === 'undefined') {
          delete data[key];
        }
      });
      return data;
    };
    const queryParams = parseQueryParams();
    this.props.parseQueryParams(queryParams);
  }

  render() {
    return (
      <div>
        <div className={classNames(styles.ItemFinder, this.props.view, { showResults: this.props.showResults },
            { isFiltered: this.props.isFiltered }, 'item-finder')}>
          <form ref="form" action="#" id="plugin-search-form"
              className={classNames(styles.HomeHeader, { showFilter: this.props.showFilter }, 'HomeHeader jumbotron')}
              onSubmit={this.handleOnSubmit}>
            <h1>Plugins Index</h1>
            <p>
              Discover the 1500+ community contributed Jenkins plugins to support building, deploying and automating any project.
            </p>
            <nav className={classNames(styles.navbar, 'navbar')}>
              <div className="nav navbar-nav">
                <SearchBox handleOnSubmit={this.handleOnSubmit} />
                <Views />
              </div>
            </nav>
            <Filters />
          </form>
          <SearchResults />
          <Footer />
        </div>
      </div>
    );
  }

}

const selectors = createSelector(
  [ isFiltered, showFilter, showResults, view ],
  ( isFiltered, showFilter, showResults, view ) =>
  ({ isFiltered, showFilter, showResults, view })
);

export default connect(selectors, actions)(Main);
