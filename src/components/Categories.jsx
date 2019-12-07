import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import styles from '../styles/Main.css';
import Category from './Category';
import {actions} from '../actions';
import {activeCategories, activeLabels, categories} from '../selectors';
import {createSelector} from 'reselect';

class Categories extends React.PureComponent {

  static propTypes = {
      anyCriteria: PropTypes.bool.isRequired,
      categories: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string.isRequired,
          labels: PropTypes.arrayOf(PropTypes.string).isRequired,
          title: PropTypes.string.isRequired
      })).isRequired,
      clearCriteria: PropTypes.func.isRequired
  };

  handleOnClick = (event) => {
      event.preventDefault();
      this.props.clearCriteria();
  }

  render() {
      return (
          <fieldset className={classNames(styles.Categories)}>
              <legend>
          Categories
                  {this.props.anyCriteria && <button className={classNames('btn btn-secondary btn-sm show-all')}
                      name="showAll" onClick={this.handleOnClick}
                  >Show all</button>
                  }
              </legend>
              <ul className={classNames(styles.Cols3, 'Cols3')}>
                  {this.props.categories.map((category) => {
                      return (
                          <Category
                              key={category.id}
                              category={category}
                          />
                      );
                  })}
              </ul>
          </fieldset>
      );
  }
}

const selectors = createSelector(
    [ activeCategories, activeLabels, categories ],
    ( activeCategories, activeLabels, categories ) =>
        ({
            anyCriteria: activeCategories.length > 0 || activeLabels.length > 0,
            categories
        })
);

export default connect(selectors, actions)(Categories);
