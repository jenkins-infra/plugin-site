import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from '../styles/Main.css';
import classNames from 'classnames';
import { actions } from '../actions';
import { query, showFilter } from '../selectors';
import { createSelector } from 'reselect';

class SearchBox extends React.PureComponent {

  static propTypes = {
    handleOnSubmit: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    showFilter: PropTypes.bool.isRequired,
    setQuery: PropTypes.func.isRequired,
    toggleShowFilter: PropTypes.func.isRequired
  };

  handleOnChange = (event) => {
    event.preventDefault();
    this.props.setQuery(event.currentTarget.value);
  }

  // For some reason the input.onFocus was overriding a.onClick so use the
  // same function and detect the caller
  handleToggleShowFilter = (event) => {
    event.preventDefault();
    const forceOpen = event.currentTarget.name === 'query';
    this.props.toggleShowFilter({ forceOpen: forceOpen });
  }

  render() {
    const { query, showFilter } = this.props;
    return (
      <fieldset className={classNames(styles.SearchBox, 'form-inline SearchBox')}>
        <div className={classNames(styles.searchBox, 'form-group')}>
          <label className={classNames(styles.searchLabel, 'input-group')}>
            <a className={classNames(styles.ShowFilter, styles.Fish, 'input-group-addon btn btn-primary ShowFilter')}
              onClick={this.handleToggleShowFilter}
            >
              Browse <span>{showFilter ? '▼' : '◄' }</span>
            </a>
            <input name="query"
                value={query}
                onChange={this.handleOnChange}
                onClick={this.handleToggleShowFilter}
                className={classNames('form-control')}
                placeholder="Find plugins..."
            />
            <input type="submit" className="sr-only" />
            <div className={classNames(styles.SearchBtn, 'input-group-addon SearchBtn btn btn-primary')}
                onClick={this.props.handleOnSubmit}>
              <i className={classNames('icon-search')} />
            </div>
          </label>
        </div>
      </fieldset>
    );
  }

}

const selectors = createSelector(
  [ query, showFilter ],
  ( query, showFilter ) =>
  ({ query, showFilter })
);

export default connect(selectors, actions)(SearchBox);
