import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from '../styles/Main.css';
import Categories from './Categories';
import Sort from './Sort';
import { showFilter, showResults } from '../selectors';
import { createSelector } from 'reselect';

class Filters extends React.PureComponent {

  static propTypes = {
    showFilter: PropTypes.bool.isRequired,
    showResults: PropTypes.bool.isRequired
  };

  render() {
    return (
      this.props.showFilter &&
        <div className={classNames(styles.FiltersBox)}>
          <div className={classNames(styles.filters, 'filters', this.props.showResults ? 'col-md-2' : 'container')}>
            <div className={classNames(styles.Header,'row')}>
              <div className={this.props.showResults ? 'col-md-12' : 'col-md-3'}>
                <Sort />
              </div>
              <div className={this.props.showResults ? 'col-md-12' : 'col-md-9'}>
                <Categories />
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const selectors = createSelector(
  [ showFilter, showResults ],
  ( showFilter, showResults ) =>
  ({ showFilter, showResults })
);

export default connect(selectors)(Filters);
