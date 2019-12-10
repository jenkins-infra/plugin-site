import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from '../styles/main.module.css';
import Categories from './Categories';
import Sort from './Sort';

function Filters({showFilter, showResults}) {
    const [sort, setSort] = React.useState('');
    const [categories, setCategories] = React.useState([]);
    const [labels, setLabels] = React.useState([]);

    const clearCriteria = () => {
        setCategories([]);
    };

    const toggleCategory = (category) => {
        const vals = new Set(categories);
        if (vals.has(category.id)) {
            vals.delete(category.id);
        } else {
            vals.add(category.id);
        }
        setCategories(Array.from(vals));
    };

    const toggleLabel = (label) => {
        const vals = new Set(labels);
        if (vals.has(label.id)) {
            vals.delete(label.id);
        } else {
            vals.add(label.id);
        }
        setLabels(Array.from(vals));
    };

    if (!showFilter) {
        return null;
    }
    return (
        <div className={classNames(styles.FiltersBox)}>
            <div className={classNames(styles.filters, 'filters', 'container')}>
                <div className={classNames(styles.Header,'row')}>
                    <div className={showResults ? 'col-md-12' : 'col-md-3'}>
                        <Sort setSort={setSort} sort={sort} />
                    </div>
                    <div className={showResults ? 'col-md-9' : 'col-md-3'}>
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
        </div>
    );
}

Filters.propTypes = {
    showFilter: PropTypes.bool.isRequired,
    showResults: PropTypes.bool.isRequired
};

Filters.defaultProps = {
    showResults: false,
    showFilter: false
};

export default Filters;
