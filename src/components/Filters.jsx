import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styled from '@emotion/styled';
import styles from '../styles/main.module.css';
import Categories from './Categories';
import Sort from './Sort';

const FiltersBoxContainer = styled.fieldset`
`;

const FiltersContainer = styled.div`
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    box-shadow: 0 1px 0.5rem rgba(0, 0, 0, 0.15);
    font-size: 0.85rem;
    font-weight: 200;
    padding: 0 !important;
    position: initial;
    text-align: left;
    top: -4rem;
`;


const HeaderContainer = styled.div`
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1rem;
`;


function Filters({
    showFilter,
    showResults,
    sort, setSort,
    clearCriteria,
    categories, toggleCategory,
    labels, toggleLabel
}) {
    if (!showFilter) {
        return null;
    }
    return (
        <FiltersBoxContainer>
            <FiltersContainer className={classNames(styles.filters, 'filters', 'container')}>
                <HeaderContainer className="row">
                    <div className={showResults ? 'col-md-12' : 'col-md-3'}>
                        <Sort setSort={setSort} sort={sort} />
                    </div>
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
                </HeaderContainer>
            </FiltersContainer>
        </FiltersBoxContainer>
    );
}

Filters.propTypes = {
    showFilter: PropTypes.bool.isRequired,
    showResults: PropTypes.bool.isRequired,
    sort: PropTypes.string.isRequired,
    setSort: PropTypes.func.isRequired,
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
