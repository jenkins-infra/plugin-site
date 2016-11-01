import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions } from '../actions';
import { activeCategories, activeLabels, activeQuery, categories, labels } from '../selectors';
import ActiveCategory from './ActiveCategory';
import ActiveLabel from './ActiveLabel';
import { createSelector } from 'reselect';

class ActiveFilters extends React.PureComponent {

  static propTypes = {
    activeCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeQuery: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      labels: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string.isRequired
    })).isRequired,
    clearQuery: PropTypes.func.isRequired,
    labels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string
    })).isRequired,
    toggleCategory: PropTypes.func.isRequired,
    toggleLabel: PropTypes.func.isRequired
  };

  render() {
    const { activeCategories, activeLabels, activeQuery, categories, clearQuery,
      labels, toggleCategory, toggleLabel } = this.props;
    const renderedActiveCategories = activeCategories.map((activeCategory) => {
      return (
        <ActiveCategory
          key={`category_${activeCategory}`}
          category={categories.find((category) => category.id === activeCategory)}
          toggleCategory={toggleCategory}
        />
      );
    });
    const renderedActiveLabels = activeLabels.map((activeLabel) => {
      return (
        <ActiveLabel
          key={`label_${activeLabel}`}
          label={labels.find((label) => label.id === activeLabel)}
          toggleLabel={toggleLabel}
        />
      );
    });
    return (
      <li className="nav-item active-filters">
        <div className="active-categories">
          {renderedActiveCategories}
        </div>
        <div className="active-labels">
          {renderedActiveLabels}
        </div>
        <div className="active-string">
          {activeQuery !== '' &&
            <a className="nav-link" title="clear search string" onClick={clearQuery}>{activeQuery}</a>}
        </div>
      </li>
    );
  }

}

const selectors = createSelector(
  [ activeCategories, activeLabels, activeQuery, categories, labels ],
  ( activeCategories, activeLabels, activeQuery, categories, labels ) =>
  ({ activeCategories, activeLabels, activeQuery, categories, labels })
);

export default connect(selectors, actions)(ActiveFilters);
