import React from 'react';
import PropTypes from 'prop-types';
import ActiveCategory from './ActiveCategory';
import ActiveLabel from './ActiveLabel';

function ActiveFilters({activeCategories, activeLabels, activeQuery, categories, clearQuery, labels, toggleCategory, toggleLabel}) {
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

ActiveFilters.propTypes = {
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

ActiveFilters.defaultProps = {
    activeCategories: [],
    activeLabels: [],
    activeQuery: '',
    categories: [],
    clearQuery: () => {},
    labels: [],
    toggleCategory: () => {},
    toggleLabel: () => {}
};
    
export default ActiveFilters;
