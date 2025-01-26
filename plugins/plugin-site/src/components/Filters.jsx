import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Categories from './Categories';
import './Filters.css';

function Filters({
    showFilter,
    showResults,
    clearCriteria,
    categories, toggleCategory,
    labels, toggleLabel
}) {
    if (!showFilter) {
        return null;
    }
    return (
        <fieldset>
            <div className={classNames('Filters--Container', 'filters', 'container')}>
                <div className="row headerContainer">
                    <div className={showResults ? 'col-md-12' : 'col-md-9'}>
                        <Categories
                            anyCriteria={false}
                            activeCategories={categories}
                            clearCriteria={clearCriteria}
                            toggleCategory={toggleCategory}
                            activeLabels={labels}
                            toggleLabel={toggleLabel}
                        />
                    </div>
                </div>
            </div>
        </fieldset>
    );
}

Filters.propTypes = {
    showFilter: PropTypes.bool.isRequired,
    showResults: PropTypes.bool.isRequired,
    clearCriteria: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleCategory: PropTypes.func.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleLabel: PropTypes.func.isRequired,
};

Filters.defaultProps = {
    showFilter: false,
    showResults: false,
};

export default Filters;
